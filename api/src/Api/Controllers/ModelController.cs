using Api.Dtos;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
public class ModelController(IModelService service) : ControllerBase
{
    [HttpPost("/store")]
    public ActionResult<ModelDto> Store([FromBody] StoreModelRequest request)
    {
        var dto = service.Store(request);
        return CreatedAtAction(nameof(FetchAll), dto);
    }

    [HttpGet("/models")]
    public ActionResult<IEnumerable<ModelDto>> FetchAll()
    {
        return Ok(service.FetchModel());
    }
}
