namespace Api.Dtos;

public record ModelDto(
    Guid Id,
    string Name,
    long FileSize,
    DateTime CreatedAt,
    string BlobName);
