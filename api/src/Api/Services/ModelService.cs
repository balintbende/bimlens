using Api.Domain;
using Api.Dtos;
using Api.Repositories;
using Api.Storage;

namespace Api.Services;

public class ModelService(IModelRepository repository, IFileStorage storage) : IModelService
{
    public async Task<IReadOnlyList<ModelDto>> FetchModelsAsync(CancellationToken cancellationToken = default)
    {
        var models = await repository.GetAllAsync(cancellationToken);
        return models.Select(ToDto).ToList();
    }

    public async Task<ModelDto?> FetchModelAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var model = await repository.GetByIdAsync(id, cancellationToken);
        return model is null ? null : ToDto(model);
    }

    public async Task<ModelFile?> OpenFileAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var model = await repository.GetByIdAsync(id, cancellationToken);
        if (model is null)
        {
            return null;
        }

        var content = await storage.OpenReadAsync(model.BlobName, cancellationToken);
        return content is null ? null : new ModelFile(model.Name, content);
    }

    public async Task<ModelDto> StoreAsync(
        string name,
        Stream file,
        long fileSize,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        var id = Guid.NewGuid();
        // Keyed by id so user-supplied file names never end up in the blob path.
        var blobName = $"{id}.ifc";

        await storage.UploadAsync(blobName, file, contentType, cancellationToken);

        var model = new Model
        {
            Id = id,
            Name = name,
            BlobName = blobName,
            FileSize = fileSize,
            CreatedAt = DateTime.UtcNow,
        };

        try
        {
            return ToDto(await repository.AddAsync(model, cancellationToken));
        }
        catch
        {
            // Don't leave an orphaned blob behind when the metadata can't be saved.
            await storage.DeleteAsync(blobName, CancellationToken.None);
            throw;
        }
    }

    private static ModelDto ToDto(Model model) => new(
        model.Id,
        model.Name,
        model.FileSize,
        model.CreatedAt,
        model.BlobName);
}
