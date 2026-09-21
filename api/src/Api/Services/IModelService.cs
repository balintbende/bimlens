using Api.Dtos;

namespace Api.Services;

public interface IModelService
{
    Task<IReadOnlyList<ModelDto>> FetchModelsAsync(CancellationToken cancellationToken = default);

    Task<ModelDto> StoreAsync(
        string name,
        Stream file,
        long fileSize,
        string contentType,
        CancellationToken cancellationToken = default);
}
