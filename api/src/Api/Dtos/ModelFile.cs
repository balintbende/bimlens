namespace Api.Dtos;

/// <summary>A stored model's file content; the caller owns and disposes the stream.</summary>
public record ModelFile(string Name, Stream Content);
