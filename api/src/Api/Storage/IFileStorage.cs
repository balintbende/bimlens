namespace Api.Storage;

public interface IFileStorage
{
    Task UploadAsync(string name, Stream content, string contentType, CancellationToken cancellationToken = default);
    Task DeleteAsync(string name, CancellationToken cancellationToken = default);
}
