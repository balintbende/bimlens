using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Api.Storage;

public class AzureBlobFileStorage(BlobContainerClient container) : IFileStorage
{
    public async Task UploadAsync(string name, Stream content, string contentType, CancellationToken cancellationToken = default)
    {
        await container.GetBlobClient(name).UploadAsync(
            content,
            new BlobUploadOptions { HttpHeaders = new BlobHttpHeaders { ContentType = contentType } },
            cancellationToken);
    }

    public async Task DeleteAsync(string name, CancellationToken cancellationToken = default)
    {
        await container.GetBlobClient(name).DeleteIfExistsAsync(cancellationToken: cancellationToken);
    }
}
