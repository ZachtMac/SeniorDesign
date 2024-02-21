using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GearNet.Data;
using GearNet.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.CodeAnalysis.Operations;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Serialization;
using GearNet.Models;
using NuGet.Packaging;

namespace GearNet.Controllers
{
    [Route("api/DevicesApi")]
    [ApiController]
    public class DevicesApiController : ControllerBase
    {
        private readonly GearNetContext _context;

        public DevicesApiController(GearNetContext context)
        {
            _context = context;
        }

        // GET: api/DevicesApi/GetAll
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<Device>>> GetAll()
        {
            return await _context.Devices.ToListAsync();
        }

        // GET: api/DevicesApi/Get/5
        [HttpGet("Get/{id}")]
        public async Task<ActionResult<Device>> GetDevice(int id)
        {
            var device = await _context.Devices.FindAsync(id);

            if (device == null)
            {
                return NotFound();
            }

            return device;
        }

        // POST: api/DevicesApi/Create
        [HttpPost("Create")]
        public async Task<ActionResult<Device>> Create(Device device)
        {
            _context.Devices.Add(device);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDevice), new { id = device.DeviceId }, device);
        }

        // DELETE: api/DevicesApi/Delete/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteDevice(int id)
        {
            var device = await _context.Devices.FindAsync(id);
            if (device == null)
            {
                return NotFound();
            }

            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class DevicesController : Controller
    {
        private readonly GearNetContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DevicesController(GearNetContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IActionResult> Index(string deviceName, string deviceType, int? rackRow, int? rackCol, string? isCheckedOut)
        {
            var devices = _context.Devices.AsQueryable();

            if (!string.IsNullOrEmpty(deviceName))
            {
                devices = devices.Where(c => c.DeviceName.Contains(deviceName));
            }

            if (!string.IsNullOrEmpty(deviceType))
            {
                devices = devices.Where(c => c.DeviceType.Contains(deviceType));
            }

            if (rackRow.HasValue)
            {
                devices = devices.Where(c => c.RackRow == rackRow);
            }

            if (rackCol.HasValue)
            {
                devices = devices.Where(c => c.RackCol == rackCol);
            }

            if (!string.IsNullOrEmpty(isCheckedOut))
            {
                if (bool.TryParse(isCheckedOut, out bool isCheckedOutValue))
                {
                    devices = devices.Where(c => c.IsCheckedOut == isCheckedOutValue);
                }
            }

            // Pass the search parameters as route values
            ViewData["deviceName"] = deviceName;
            ViewData["deviceType"] = deviceType;
            ViewData["rackRow"] = rackRow;
            ViewData["rackCol"] = rackCol;
            ViewData["isCheckedOut"] = isCheckedOut;

            return View(await devices.ToListAsync());
        }



        // GET: Devices/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var device = await _context.Devices
                .Include(d => d.Case)
                .Include(d => d.Student)
                .FirstOrDefaultAsync(m => m.DeviceId == id);

            if (device == null)
            {
                return NotFound();
            }

            return View(device);
        }


        // GET: Devices/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Devices/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("DeviceId,DeviceName,DeviceType,RackRow,RackCol,OperatingSystem,SoftwareVersion,Vendor,IsCheckedOut")] Device device)
        {
            if (ModelState.IsValid)
            {
                _context.Add(device);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(device);
        }

        // GET: Devices/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Devices == null)
            {
                return NotFound();
            }

            var device = await _context.Devices.FindAsync(id);
            if (device == null)
            {
                return NotFound();
            }
            return View(device);
        }

        // POST: Devices/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("DeviceId,DeviceName,DeviceType,RackRow,RackCol,OperatingSystem,SoftwareVersion,Vendor,IsCheckedOut")] Device device)
        {
            if (id != device.DeviceId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(device);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DeviceExists(device.DeviceId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Details", new { id = device.DeviceId });
            }
            return View(device);
        }

        // GET: Devices/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Devices == null)
            {
                return NotFound();
            }

            var device = await _context.Devices
                .FirstOrDefaultAsync(m => m.DeviceId == id);
            if (device == null)
            {
                return NotFound();
            }

            return View(device);
        }

        // POST: Devices/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Devices == null)
            {
                return Problem("Entity set 'GearNetContext.Devices'  is null.");
            }
            var device = await _context.Devices.FindAsync(id);
            if (device != null)
            {
                _context.Devices.Remove(device);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        // GET: Devices/DeviceBooking/5
        public async Task<IActionResult> DeviceBooking(int id, string? deviceName, string? deviceType, int? rackRow, int? rackCol, string? isCheckedOut)
        {
            var devices = _context.Devices.AsQueryable();
            var bookedDevices = _httpContextAccessor.HttpContext.Session.GetObjectFromJson<List<Device>>("BookedDevices") ?? new List<Device>();
            ViewBag.CaseId = id;


            var case_ = await _context.Cases
                .FirstOrDefaultAsync(m => m.CaseId == id);

            var caseName = case_?.CaseName;

            ViewBag.CaseName = caseName;


            if (!string.IsNullOrEmpty(deviceName))
            {
                devices = devices.Where(c => c.DeviceName.Contains(deviceName));
            }

            if (!string.IsNullOrEmpty(deviceType))
            {
                devices = devices.Where(c => c.DeviceType.Contains(deviceType));
            }

            if (rackRow.HasValue)
            {
                devices = devices.Where(c => c.RackRow == rackRow);
            }

            if (rackCol.HasValue)
            {
                devices = devices.Where(c => c.RackCol == rackCol);
            }

            if (!string.IsNullOrEmpty(isCheckedOut))
            {
                if (bool.TryParse(isCheckedOut, out bool isCheckedOutValue))
                {
                    devices = devices.Where(c => c.IsCheckedOut == isCheckedOutValue);
                }
            }

            // Pass the search parameters as route values
            ViewData["deviceName"] = deviceName;
            ViewData["deviceType"] = deviceType;
            ViewData["rackRow"] = rackRow;
            ViewData["rackCol"] = rackCol;
            ViewData["isCheckedOut"] = isCheckedOut;
            ViewData["BookedDevices"] = bookedDevices;



            return View(await devices.ToListAsync());
        }

        private bool DeviceExists(int id)
        {
            return (_context.Devices?.Any(e => e.DeviceId == id)).GetValueOrDefault();
        }


        [HttpPost]
        public IActionResult AddToBookedDevices(int id, int caseId)
        {
            var deviceToAdd = _context.Devices.FirstOrDefault(d => d.DeviceId == id);
            if (deviceToAdd != null)
            {
                var bookedDevices = _httpContextAccessor.HttpContext.Session.GetObjectFromJson<List<Device>>("BookedDevices") ?? new List<Device>();

                if (bookedDevices.Any(d => d.DeviceId == deviceToAdd.DeviceId))
                {
                    TempData["ErrorMessage"] = "Device is already booked!";
                    return RedirectToAction("DeviceBooking", new { id = caseId }); // Redirect back to the device booking page with an error message
                }

                bookedDevices.Add(deviceToAdd);

                _httpContextAccessor.HttpContext.Session.SetObjectAsJson("BookedDevices", bookedDevices);
            }

            return RedirectToAction("DeviceBooking", new { id = caseId }); // Redirect back to the device booking page
        }

        [HttpPost]
        public IActionResult RemoveFromBookedDevices(int id, int caseId)
        {
            var bookedDevices = _httpContextAccessor.HttpContext.Session.GetObjectFromJson<List<Device>>("BookedDevices") ?? new List<Device>();
            var deviceToRemove = bookedDevices.FirstOrDefault(d => d.DeviceId == id);
            if (deviceToRemove != null)
            {
                bookedDevices.Remove(deviceToRemove);
                _httpContextAccessor.HttpContext.Session.SetObjectAsJson("BookedDevices", bookedDevices);
            }

            return RedirectToAction("DeviceBooking", new { id = caseId }); // Redirect back to the device booking page
        }

        [HttpPost]
        public IActionResult ClearBookedDevicesSession()
        {

            _httpContextAccessor.HttpContext.Session.Remove("BookedDevices");
            return Ok();

        }

        [HttpGet]
        public IActionResult GetBookedDevices()
        {
            var bookedDevices = _httpContextAccessor.HttpContext.Session.GetObjectFromJson<List<Device>>("BookedDevices") ?? new List<Device>();

            var deviceIds = bookedDevices.Select(device => device.DeviceId).ToList();
            return Json(deviceIds);
        }

        [HttpPost("cases/devices/checkout")]
        public IActionResult CheckOutDevices(int caseId, string deviceIds)
        {
            List<int> deviceIdsList = deviceIds
                .Split(',', StringSplitOptions.RemoveEmptyEntries) // Split by comma and remove empty entries
                .Select(id => id.Trim('[', ']', ' ')) // Clean each string
                .Select(id => int.TryParse(id, out int parsedId) ? parsedId : -1) // Parse and handle errors
                .Where(parsedId => parsedId != -1) // Filter out failed parsing results
                .ToList();

            var devicesToCheckout = _context.Devices.Where(d => deviceIdsList.Contains(d.DeviceId)).ToList();

            var caseToUpdate = _context.Cases.FirstOrDefault(c => c.CaseId == caseId);

            if (caseToUpdate != null)
            {
                foreach (var device in devicesToCheckout)
                {
                    device.IsCheckedOut = true;
                    device.StudentId = caseToUpdate.StudentId;
                }
                caseToUpdate.Devices.AddRange(devicesToCheckout);
                _context.SaveChanges();
            }
            ClearBookedDevicesSession();
            // Redirect to the case details page using the same caseId
            return RedirectToAction("Details", "Cases", new { id = caseId });
        }




    }
}
