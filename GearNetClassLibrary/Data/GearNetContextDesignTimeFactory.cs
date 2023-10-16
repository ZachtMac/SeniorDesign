using GearNetClassLibrary.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment4ClassLibraryMcIntoshZach.Data
{
    internal class GearNetContextDesignTimeFactory : IDesignTimeDbContextFactory<GearNetContext>
    {
        public GearNetContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
            var optionsBuilder = new DbContextOptionsBuilder<GearNetContext>();

            optionsBuilder.UseSqlServer(configuration.GetConnectionString("dev"));

            return new GearNetContext(optionsBuilder.Options);
        }
    }
}
