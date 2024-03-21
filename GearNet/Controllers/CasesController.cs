using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GearNet.Data;
using GearNet.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace GearNet.Controllers
{

    [Route("api/CasesApi")]
    [ApiController]
    public class CasesApiController : ControllerBase
    {
        private readonly GearNetContext _context;

        public CasesApiController(GearNetContext context)
        {
            _context = context;
        }

        // POST: api/CasesApi/Create
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Case case_)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var existingStudent = _context.Students.FirstOrDefault(s => s.Username == case_.Username);

                    if (existingStudent != null)
                    {
                        case_.Student = existingStudent;
                        _context.Cases.Add(case_);
                        await _context.SaveChangesAsync();

                        // Log case_ to console
                        Console.WriteLine("Created Case:");
                        Console.WriteLine(case_.Student);

                        return Ok(case_);
                    }
                    else
                    {
                        ModelState.AddModelError("Username", "Student with the provided username does not exist.");
                        return BadRequest(ModelState);
                    }
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        // GET: api/CasesApi/GetAll
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<Case>>> GetAll()
        {
            var cases = await _context.Cases.ToListAsync();

            return Ok(cases);
        }

        // GET: api/CasesApi/Get/5
        [HttpGet("Get/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var cases = await _context.Cases.FindAsync(id);
            if (cases == null)
            {
                return NotFound();
            }
            return Ok(cases);
        }
        // DELETE: api/CasesApi/Delete/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (_context.Cases == null)
            {
                return Problem("Entity set 'GearNetContext.Cases' is null.");
            }

            var case_ = await _context.Cases.Include(c => c.Devices).FirstOrDefaultAsync(c => c.CaseId == id);

            if (case_ == null)
            {
                return NotFound();
            }

            foreach (var bookedDevice in case_.Devices)
            {
                bookedDevice.Case = null;
                bookedDevice.IsCheckedOut = false;
                bookedDevice.StudentId = null;
            }

            _context.Cases.Remove(case_);

            await _context.SaveChangesAsync();
            return Ok(case_);
        }



    }

    public class CasesController : Controller
    {
        private readonly GearNetContext _context;

        public CasesController(GearNetContext context)
        {
            _context = context;
        }

        // GET: Cases
        public async Task<IActionResult> Index(string caseName, DateTime? startDate, int? duration, string? studentUser)
        {
            var cases = _context.Cases.AsQueryable();

            if (!string.IsNullOrEmpty(caseName))
            {
                cases = cases.Where(c => c.CaseName.Contains(caseName));
            }

            if (startDate.HasValue)
            {
                cases = cases.Where(c => c.DateTime >= startDate.Value.Date);
            }



            if (duration.HasValue)
            {
                cases = cases.Where(c => c.Duration == duration);
            }

            if (!string.IsNullOrEmpty(studentUser))
            {
                cases = cases.Where(c => c.Username.Contains(studentUser));
            }

            ViewData["caseName"] = caseName;
            ViewData["startDate"] = startDate.HasValue ? startDate.Value.ToString("yyyy-MM-dd") : null;
            ViewData["duration"] = duration;
            ViewData["studentUser"] = studentUser;

            return View(await cases.ToListAsync());
        }

        // GET: Cases/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var case_ = await _context.Cases
                .Include(c => c.Devices)
                .FirstOrDefaultAsync(m => m.CaseId == id);

            if (case_ == null)
            {
                return NotFound();
            }

            return View(case_);
        }

        // GET: Cases/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Cases/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CaseId,CaseName,DateTime,Duration,Username")] Case case_)
        {
            if (ModelState.IsValid)
            {

                var student = _context.Students.FirstOrDefault(s => s.Username == case_.Username);

                if (student != null)
                {
                    case_.Student = student;
                    _context.Add(case_);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                else
                {
                    ModelState.AddModelError("Username", "Student with the provided username does not exist.");
                }


            }
            return View(case_);
        }

        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var case_ = await _context.Cases
                .Include(c => c.Devices) // Include the Devices navigation property
                .FirstOrDefaultAsync(m => m.CaseId == id);

            if (case_ == null)
            {
                return NotFound();
            }

            return View(case_);
        }

        // POST: Cases/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CaseId,CaseName,DateTime,Duration,StudentId, Username")] Case case_)
        {
            if (id != case_.CaseId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                var student = _context.Students.FirstOrDefault(s => s.Username == case_.Username);

                if (student != null)
                {
                    case_.Student = student;
                    _context.Update(case_);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                else
                {
                    ModelState.AddModelError("Username", "Student with the provided username does not exist.");
                    return View(case_);
                }
            }
            return View(case_);
        }


        // GET: Cases/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Cases == null)
            {
                return NotFound();
            }

            var case_ = await _context.Cases
                .FirstOrDefaultAsync(m => m.CaseId == id);
            if (case_ == null)
            {
                return NotFound();
            }

            return View(case_);
        }

        // POST: Cases/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Cases == null)
            {
                return Problem("Entity set 'GearNetContext.Cases' is null.");
            }

            var case_ = await _context.Cases.Include(c => c.Devices).FirstOrDefaultAsync(c => c.CaseId == id);

            if (case_ == null)
            {
                return NotFound();
            }

            foreach (var bookedDevice in case_.Devices)
            {
                bookedDevice.Case = null;
                bookedDevice.IsCheckedOut = false;
                bookedDevice.StudentId = null;
            }

            _context.Cases.Remove(case_);

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }


        // GET: Cases
        public async Task<IActionResult> CaseSelection(string? caseName, DateTime? startDate, int? duration, string? studentUser)
        {
            var cases = _context.Cases.AsQueryable();

            if (!string.IsNullOrEmpty(caseName))
            {
                cases = cases.Where(c => c.CaseName.Contains(caseName));
            }

            if (startDate.HasValue)
            {
                cases = cases.Where(c => c.DateTime >= startDate.Value.Date);
            }



            if (duration.HasValue)
            {
                cases = cases.Where(c => c.Duration == duration);
            }

            if (!string.IsNullOrEmpty(studentUser))
            {
                cases = cases.Where(c => c.Username.Contains(studentUser));
            }

            ViewData["caseName"] = caseName;
            ViewData["startDate"] = startDate.HasValue ? startDate.Value.ToString("yyyy-MM-dd") : null;
            ViewData["duration"] = duration;
            ViewData["studentUser"] = studentUser;

            return View(await cases.ToListAsync());
        }


        private bool CaseExists(int id)
        {
            return (_context.Cases?.Any(e => e.CaseId == id)).GetValueOrDefault();
        }


        [HttpGet]
        public IActionResult GetBookedDevicesForCase(int caseId)
        {
            var caseWithDevices = _context.Cases
                .Include(c => c.Devices)
                .FirstOrDefault(c => c.CaseId == caseId);

            if (caseWithDevices == null)
            {
                return NotFound();
            }

            var bookedDevices = caseWithDevices.Devices.ToList();

            return Json(bookedDevices);
        }

        [HttpPost]
        public IActionResult RemoveFromBookedDevices(int deviceId, int caseId)
        {
            var caseToUpdate = _context.Cases.Include(c => c.Devices).FirstOrDefault(c => c.CaseId == caseId);
            if (caseToUpdate == null)
            {
                return NotFound();
            }

            var deviceToRemove = caseToUpdate.Devices.FirstOrDefault(d => d.DeviceId == deviceId);
            if (deviceToRemove == null)
            {
                return NotFound();
            }

            deviceToRemove.IsCheckedOut = false;
            deviceToRemove.StudentId = null;
            deviceToRemove.CaseId = null;

            caseToUpdate.Devices.Remove(deviceToRemove);

            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost]
        public IActionResult GenerateTelnetLink(List<int> deviceIds, int portNumber)
        {
            var devices = _context.Devices.Where(d => deviceIds.Contains(d.DeviceId)).ToList();

            var deviceWithStaticIP = devices.FirstOrDefault(d => d.Address != null);

            if (deviceWithStaticIP != null)
            {
                string link = $"telnet://{deviceWithStaticIP.Address}:205{portNumber}";

                return Content(link);
            }
            else
            {
                return BadRequest("No comm device with a static IP address found.");
            }
        }
    }
}
