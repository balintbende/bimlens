using Api.Domain;

namespace Api.Repositories;

public class InMemoryModelRepository : IModelRepository
{
    private readonly List<Model> _models = [];
    private readonly Lock _lock = new();

    public IEnumerable<Model> GetAll()
    {
        lock (_lock)
        {
            return _models.ToArray();
        }
    }

    public Model Add(Model model)
    {
        lock (_lock)
        {
            _models.Add(model);
            return model;
        }
    }
}
