using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class Addsongfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SongFiles",
                columns: table => new
                {
                    SongToken = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    File = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongFiles", x => x.SongToken);
                    table.ForeignKey(
                        name: "FK_SongFiles_Songs_SongToken",
                        column: x => x.SongToken,
                        principalTable: "Songs",
                        principalColumn: "SongToken",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SongFiles");
        }
    }
}
