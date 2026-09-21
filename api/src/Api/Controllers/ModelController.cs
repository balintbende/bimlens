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
    public async Task<ActionResult<ModelDto>> Store(
        [FromForm] StoreModelRequest request,
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file.Length == 0)
        {
            return ValidationProblem(detail: "The uploaded file is empty.");
        }

        await using var stream = file.OpenReadStream();
        var contentType = string.IsNullOrEmpty(file.ContentType) ? "application/octet-stream" : file.ContentType;
        var dto = await service.StoreAsync(request, stream, file.Length, contentType, cancellationToken);
        return CreatedAtAction(nameof(FetchAll), dto);
    }

    [HttpGet("/models")]
    public async Task<ActionResult<IEnumerable<ModelDto>>> FetchAll(CancellationToken cancellationToken)
    {
        return Ok(await service.FetchModelsAsync(cancellationToken));
    }
}
