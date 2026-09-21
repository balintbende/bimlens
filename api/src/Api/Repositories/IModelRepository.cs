using Api.Domain;

namespace Api.Repositories;

public interface IModelRepository
{
    IEnumerable<Model> GetAll();
    Model Add(Model model);
}
