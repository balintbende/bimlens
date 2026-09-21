namespace Api.Dtos;

public record ModelDto(
    Guid Id,
    string Name,
    int WallCount,
    int BeamCount,
    int ColumnCount,
    int SlabCount,
    int DoorCount,
    int WindowCount,
    DateTime CreatedAt);
