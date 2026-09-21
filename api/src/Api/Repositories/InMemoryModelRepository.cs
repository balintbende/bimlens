using Api.Domain;

namespace Api.Repositories;

public class InMemoryModelRepository : IModelRepository
{
    private readonly List<Model> _models = [];
    private readonly Lock _lock = new();

    public Task<IReadOnlyList<Model>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            return Task.FromResult<IReadOnlyList<Model>>(_models.ToArray());
        }
    }

    public Task<Model> AddAsync(Model model, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            _models.Add(model);
            return Task.FromResult(model);
        }
    }
}
