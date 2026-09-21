namespace Api.Domain;

public class Model
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string BlobName { get; init; }
    public long FileSize { get; init; }
    public DateTime CreatedAt { get; init; }
}
