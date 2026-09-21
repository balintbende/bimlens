using Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class BimlensDbContext(DbContextOptions<BimlensDbContext> options) : DbContext(options)
{
    public DbSet<Model> Models => Set<Model>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Model>(model =>
        {
            model.ToTable("models");
            model.HasKey(m => m.Id);
            model.Property(m => m.Name).HasMaxLength(255);
            model.Property(m => m.BlobName).HasMaxLength(1024);
            model.HasIndex(m => m.CreatedAt);
        });
    }
}
