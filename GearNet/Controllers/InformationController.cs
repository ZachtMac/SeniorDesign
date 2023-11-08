using GearNet.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace GearNet.Controllers
{
    public class InformationController : Controller
    {
        private readonly ILogger<InformationController> _logger;

        public InformationController(ILogger<InformationController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}