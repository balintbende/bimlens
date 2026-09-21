using Api.Data;
using Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class EfModelRepository(BimlensDbContext db) : IModelRepository
{
    public async Task<IReadOnlyList<Model>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await db.Models
            .AsNoTracking()
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Model> AddAsync(Model model, CancellationToken cancellationToken = default)
    {
        db.Models.Add(model);
        await db.SaveChangesAsync(cancellationToken);
        return model;
    }
}
