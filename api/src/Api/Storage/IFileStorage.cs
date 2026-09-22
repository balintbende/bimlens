namespace Api.Storage;

public interface IFileStorage
{
    Task UploadAsync(string name, Stream content, string contentType, CancellationToken cancellationToken = default);
    Task DeleteAsync(string name, CancellationToken cancellationToken = default);

    /// <summary>Opens the stored file for reading, or returns null if it doesn't exist.</summary>
    Task<Stream?> OpenReadAsync(string name, CancellationToken cancellationToken = default);
}
