using System.Text;
using Api.Domain;
using Api.Dtos;
using Api.Repositories;
using Api.Services;
using Api.Storage;

namespace Api.Tests;

public class ModelServiceTests
{
    private readonly FakeFileStorage _storage = new();

    private ModelService CreateService(IModelRepository? repository = null) =>
        new(repository ?? new InMemoryModelRepository(), _storage);

    private static Task<ModelDto> Store(ModelService service, string name, string content = "ISO-10303-21;")
    {
        var bytes = Encoding.UTF8.GetBytes(content);
        return service.StoreAsync(name, new MemoryStream(bytes), bytes.Length, "application/octet-stream");
    }

    [Fact]
    public async Task Store_ReturnsDto_WithGeneratedIdAndCreatedAt()
    {
        var service = CreateService();

        var dto = await Store(service, "sample.ifc");

        Assert.NotEqual(Guid.Empty, dto.Id);
        Assert.Equal("sample.ifc", dto.Name);
        Assert.Equal($"{dto.Id}.ifc", dto.BlobName);
        Assert.Equal(13, dto.FileSize);
        Assert.NotEqual(default, dto.CreatedAt);
    }

    [Fact]
    public async Task Store_UploadsFile_KeyedById()
    {
        var service = CreateService();

        var dto = await Store(service, "A", "file-content");

        Assert.Equal("file-content", Encoding.UTF8.GetString(_storage.Files[$"{dto.Id}.ifc"]));
    }

    [Fact]
    public async Task Store_DeletesUploadedFile_WhenSavingMetadataFails()
    {
        var service = CreateService(new FailingModelRepository());

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => Store(service, "A"));

        Assert.Empty(_storage.Files);
    }

    [Fact]
    public async Task FetchModels_ReturnsEmpty_WhenNothingStored()
    {
        var service = CreateService();

        Assert.Empty(await service.FetchModelsAsync());
    }

    [Fact]
    public async Task FetchModels_ReturnsAllStoredModels()
    {
        var service = CreateService();
        await Store(service, "A");
        await Store(service, "B");

        var models = await service.FetchModelsAsync();

        Assert.Equal(2, models.Count);
        Assert.Contains(models, m => m.Name == "A");
        Assert.Contains(models, m => m.Name == "B");
    }

    [Fact]
    public async Task Store_AssignsUniqueIds()
    {
        var service = CreateService();

        var first = await Store(service, "A");
        var second = await Store(service, "B");

        Assert.NotEqual(first.Id, second.Id);
    }

    private sealed class FakeFileStorage : IFileStorage
    {
        public Dictionary<string, byte[]> Files { get; } = [];

        public async Task UploadAsync(string name, Stream content, string contentType, CancellationToken cancellationToken = default)
        {
            using var buffer = new MemoryStream();
            await content.CopyToAsync(buffer, cancellationToken);
            Files[name] = buffer.ToArray();
        }

        public Task DeleteAsync(string name, CancellationToken cancellationToken = default)
        {
            Files.Remove(name);
            return Task.CompletedTask;
        }
    }

    private sealed class FailingModelRepository : IModelRepository
    {
        public Task<IReadOnlyList<Model>> GetAllAsync(CancellationToken cancellationToken = default) =>
            Task.FromResult<IReadOnlyList<Model>>([]);

        public Task<Model> AddAsync(Model model, CancellationToken cancellationToken = default) =>
            throw new InvalidOperationException("Database unavailable");
    }
}
