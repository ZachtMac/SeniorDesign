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

            /*modelBuilder.Entity<Device>().HasData(
                //new Device { DeviceId = 10}


                );*/
        }

    }
}
