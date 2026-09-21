using Api.Domain;
using Api.Dtos;
using Api.Repositories;

namespace Api.Services;

public class ModelService(IModelRepository repository) : IModelService
{
    public IEnumerable<ModelDto> FetchModel()
    {
        return repository.GetAll().Select(ToDto);
    }

    public ModelDto Store(StoreModelRequest request)
    {
        var model = new Model
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            WallCount = request.WallCount,
            BeamCount = request.BeamCount,
            ColumnCount = request.ColumnCount,
            SlabCount = request.SlabCount,
            DoorCount = request.DoorCount,
            WindowCount = request.WindowCount,
            CreatedAt = DateTime.UtcNow,
        };

        return ToDto(repository.Add(model));
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
        model.CreatedAt);
}
