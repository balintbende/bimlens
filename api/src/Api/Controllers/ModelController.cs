using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
public class ModelController(IModelService service) : ControllerBase
{
    // Matches client_max_body_size in the web image's nginx config.
    private const long MaxUploadBytes = 100 * 1024 * 1024;

    [HttpPost("/store")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(MaxUploadBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = MaxUploadBytes)]
    public async Task<ActionResult<ModelDto>> Store(IFormFile file, CancellationToken cancellationToken)
    {
        if (file.Length == 0)
        {
            return ValidationProblem(detail: "The uploaded file is empty.");
        }

        await using var stream = file.OpenReadStream();
        var name = Path.GetFileName(file.FileName);
        var contentType = string.IsNullOrEmpty(file.ContentType) ? "application/octet-stream" : file.ContentType;
        var dto = await service.StoreAsync(name, stream, file.Length, contentType, cancellationToken);
        return CreatedAtAction(nameof(Fetch), new { id = dto.Id }, dto);
    }

    [HttpGet("/models")]
    public async Task<ActionResult<IEnumerable<ModelDto>>> FetchAll(CancellationToken cancellationToken)
    {
        return Ok(await service.FetchModelsAsync(cancellationToken));
    }

    [HttpGet("/models/{id:guid}")]
    public async Task<ActionResult<ModelDto>> Fetch(Guid id, CancellationToken cancellationToken)
    {
        var dto = await service.FetchModelAsync(id, cancellationToken);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpGet("/models/{id:guid}/file")]
    public async Task<IActionResult> Download(Guid id, CancellationToken cancellationToken)
    {
        var file = await service.OpenFileAsync(id, cancellationToken);
        // File() disposes the stream once the response has been written.
        return file is null
            ? NotFound()
            : File(file.Content, "application/octet-stream", file.Name);
    }
}
