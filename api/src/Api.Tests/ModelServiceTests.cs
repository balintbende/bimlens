using Api.Dtos;
using Api.Repositories;
using Api.Services;

namespace Api.Tests;

public class ModelServiceTests
{
    private static ModelService CreateService() => new(new InMemoryModelRepository());

    [Fact]
    public void Store_ReturnsDto_WithGeneratedIdAndCreatedAt()
    {
        var service = CreateService();
        var request = new StoreModelRequest("Sample IFC", 42, 17, 12, 8, 6, 24);

        var dto = service.Store(request);

        Assert.NotEqual(Guid.Empty, dto.Id);
        Assert.Equal("Sample IFC", dto.Name);
        Assert.Equal(42, dto.WallCount);
        Assert.Equal(24, dto.WindowCount);
        Assert.NotEqual(default, dto.CreatedAt);
    }

    [Fact]
    public void FetchModel_ReturnsEmpty_WhenNothingStored()
    {
        var service = CreateService();

        Assert.Empty(service.FetchModel());
    }

    [Fact]
    public void FetchModel_ReturnsAllStoredModels()
    {
        var service = CreateService();
        service.Store(new StoreModelRequest("A", 1, 1, 1, 1, 1, 1));
        service.Store(new StoreModelRequest("B", 2, 2, 2, 2, 2, 2));

        var models = service.FetchModel().ToList();

        Assert.Equal(2, models.Count);
        Assert.Contains(models, m => m.Name == "A");
        Assert.Contains(models, m => m.Name == "B");
    }

    [Fact]
    public void Store_AssignsUniqueIds()
    {
        var service = CreateService();

        var first = service.Store(new StoreModelRequest("A", 1, 1, 1, 1, 1, 1));
        var second = service.Store(new StoreModelRequest("B", 1, 1, 1, 1, 1, 1));

        Assert.NotEqual(first.Id, second.Id);
    }
}
