namespace Api.Dtos;

public record StoreModelRequest(
    string Name,
    int WallCount,
    int BeamCount,
    int ColumnCount,
    int SlabCount,
    int DoorCount,
    int WindowCount);
