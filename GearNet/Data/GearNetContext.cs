using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GearNet.Entities;
using Microsoft.EntityFrameworkCore;

namespace GearNet.Data
{
    public class GearNetContext:DbContext
    {
        public GearNetContext(DbContextOptions<GearNetContext> options) : base(options)
        {
            
        }

        public DbSet<Device> Devices { get; set; }
        public DbSet<Student> Students { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /*modelBuilder.Entity<Student>()
                .HasMany(d => d.Devices)
                .WithOne(c => c.Student)
                .HasForeignKey(d => d.StudentId);
            modelBuilder.Entity<Student>()
                .HasMany(s => s.Cases)
                .WithOne(c => c.Student)
                .HasForeignKey(c => c.StudentId);
            modelBuilder.Entity<Case>()
                .HasMany(s => s.Devices)
                .WithOne(c => c.Case)
                .HasForeignKey(d => d.CaseId);
            */
        }

    }
}
