using Api.Dtos;

namespace Api.Services;

public interface IModelService
{
    IEnumerable<ModelDto> FetchModel();
    ModelDto Store(StoreModelRequest request);
}
