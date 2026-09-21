namespace Api.Domain;

public class Model
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public int WallCount { get; init; }
    public int BeamCount { get; init; }
    public int ColumnCount { get; init; }
    public int SlabCount { get; init; }
    public int DoorCount { get; init; }
    public int WindowCount { get; init; }
    public DateTime CreatedAt { get; init; }
}
