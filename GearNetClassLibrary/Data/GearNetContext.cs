using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GearNetClassLibrary.Data
{
    public class GearNetContext:DbContext
    {
        public GearNetContext(DbContextOptions<GearNetContext> options) : base(options)
        {
            
        }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /*modelBuilder.Entity<Device>().HasData(
                //new Device { DeviceId = 10}


                );*/
        }

    }
}
