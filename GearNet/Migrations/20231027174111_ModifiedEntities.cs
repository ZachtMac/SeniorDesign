using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GearNet.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CaseId",
                table: "Devices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OperatingSystem",
                table: "Devices",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RackCol",
                table: "Devices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RackRow",
                table: "Devices",
                type: "int",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SoftwareVersion",
                table: "Devices",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StudentId",
                table: "Devices",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Vendor",
                table: "Devices",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Cases",
                columns: table => new
                {
                    CaseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CaseName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Duration = table.Column<double>(type: "float", nullable: true),
                    StudentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cases", x => x.CaseId);
                    table.ForeignKey(
                        name: "FK_Cases_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "StudentId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Devices_CaseId",
                table: "Devices",
                column: "CaseId");

            migrationBuilder.CreateIndex(
                name: "IX_Devices_StudentId",
                table: "Devices",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Cases_StudentId",
                table: "Cases",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Devices_Cases_CaseId",
                table: "Devices",
                column: "CaseId",
                principalTable: "Cases",
                principalColumn: "CaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Devices_Students_StudentId",
                table: "Devices",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Devices_Cases_CaseId",
                table: "Devices");

            migrationBuilder.DropForeignKey(
                name: "FK_Devices_Students_StudentId",
                table: "Devices");

            migrationBuilder.DropTable(
                name: "Cases");

            migrationBuilder.DropIndex(
                name: "IX_Devices_CaseId",
                table: "Devices");

            migrationBuilder.DropIndex(
                name: "IX_Devices_StudentId",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "CaseId",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "OperatingSystem",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "RackCol",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "RackRow",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "SoftwareVersion",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "Vendor",
                table: "Devices");
        }
    }
}
