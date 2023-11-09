using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GearNet.Data;
using GearNet.Entities;
using Microsoft.CodeAnalysis.Operations;

namespace GearNet.Controllers
{
    public class DevicesController : Controller
    {
        private readonly GearNetContext _context;

        public DevicesController(GearNetContext context)
        {
            _context = context;
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

        private bool DeviceExists(int id)
        {
          return (_context.Devices?.Any(e => e.DeviceId == id)).GetValueOrDefault();
        }
    }
}
