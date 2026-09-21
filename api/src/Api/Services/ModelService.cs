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

    public async Task<ModelDto> StoreAsync(
        StoreModelRequest request,
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
            Name = request.Name,
            WallCount = request.WallCount,
            BeamCount = request.BeamCount,
            ColumnCount = request.ColumnCount,
            SlabCount = request.SlabCount,
            DoorCount = request.DoorCount,
            WindowCount = request.WindowCount,
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
        model.WallCount,
        model.BeamCount,
        model.ColumnCount,
        model.SlabCount,
        model.DoorCount,
        model.WindowCount,
        model.FileSize,
        model.CreatedAt);
}
