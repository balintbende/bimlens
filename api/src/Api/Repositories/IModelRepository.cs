using Api.Domain;

namespace Api.Repositories;

public interface IModelRepository
{
    Task<IReadOnlyList<Model>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Model> AddAsync(Model model, CancellationToken cancellationToken = default);
}
