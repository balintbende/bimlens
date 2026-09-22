using Api.Dtos;

namespace Api.Services;

public interface IModelService
{
    Task<IReadOnlyList<ModelDto>> FetchModelsAsync(CancellationToken cancellationToken = default);

    Task<ModelDto?> FetchModelAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Returns null when the model or its stored file doesn't exist.</summary>
    Task<ModelFile?> OpenFileAsync(Guid id, CancellationToken cancellationToken = default);

    Task<ModelDto> StoreAsync(
        string name,
        Stream file,
        long fileSize,
        string contentType,
        CancellationToken cancellationToken = default);
}
