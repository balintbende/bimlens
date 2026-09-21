using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveElementCounts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BeamCount",
                table: "models");

            migrationBuilder.DropColumn(
                name: "ColumnCount",
                table: "models");

            migrationBuilder.DropColumn(
                name: "DoorCount",
                table: "models");

            migrationBuilder.DropColumn(
                name: "SlabCount",
                table: "models");

            migrationBuilder.DropColumn(
                name: "WallCount",
                table: "models");

            migrationBuilder.DropColumn(
                name: "WindowCount",
                table: "models");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BeamCount",
                table: "models",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ColumnCount",
                table: "models",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DoorCount",
                table: "models",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SlabCount",
                table: "models",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WallCount",
                table: "models",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "WindowCount",
                table: "models",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
