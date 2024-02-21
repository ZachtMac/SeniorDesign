using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using GearNet.Data;
using GearNet.Entities;

namespace GearNet.Controllers
{

    [Route("api/StudentsApi")]
    [ApiController]
    public class StudentsApiController : ControllerBase
    {
        private readonly GearNetContext _context;

        public StudentsApiController(GearNetContext context)
        {
            _context = context;
        }

        // POST: api/StudentsApi/Create
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] Student student)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Check if the username is already taken
                    if (_context.Students.Any(s => s.Username == student.Username))
                    {
                        return Conflict(new { message = "Username is already taken" });
                    }

                    // Additional validation for username length
                    if (student.Username?.Length > 10)
                    {
                        return BadRequest(new { message = "Username must be at most 10 characters long" });
                    }

                    // Additional validation for first name length
                    if (student.FirstName?.Length > 50)
                    {
                        return BadRequest(new { message = "First name must be at most 50 characters long" });
                    }

                    // Additional validation for last name length
                    if (student.LastName?.Length > 50)
                    {
                        return BadRequest(new { message = "Last name must be at most 50 characters long" });
                    }

                    _context.Add(student);
                    await _context.SaveChangesAsync();
                    return Ok(student);
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/StudentsApi/GetAll
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var students = await _context.Students.ToListAsync();
            return Ok(students);
        }


        // GET: api/StudentsApi/Get/5
        [HttpGet("Get/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }
            return Ok(student);
        }

        // DELETE: api/StudentsApi/Delete/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            // Check if the student is part of a case
            var isPartOfCase = _context.Cases.Any(c => c.StudentId == id);
            if (isPartOfCase)
            {
                // If the student is part of a case, return a BadRequest with a custom message
                return BadRequest("The student is part of a case and cannot be deleted.");
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }

    public class StudentsController : Controller
    {
        private readonly GearNetContext _context;

        public StudentsController(GearNetContext context)
        {
            _context = context;
        }

        // GET: Students
        public async Task<IActionResult> Index(string? userName, string? firstName, string? lastName)
        {
            var students = _context.Students.AsQueryable();

            if (!string.IsNullOrEmpty(userName))
            {
                students = students.Where(c => c.Username.Contains(userName));
            }

            if (!string.IsNullOrEmpty(firstName))
            {
                students = students.Where(c => c.FirstName.Contains(firstName));
            }

            if (!string.IsNullOrEmpty(lastName))
            {
                students = students.Where(c => c.LastName.Contains(lastName));
            }

            ViewData["userName"] = userName;
            ViewData["firstName"] = firstName;
            ViewData["lastName"] = lastName;

            return View(await students.ToListAsync());
        }


        // GET: Students/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Students == null)
            {
                return NotFound();
            }

            var student = await _context.Students
                .FirstOrDefaultAsync(m => m.StudentId == id);
            if (student == null)
            {
                return NotFound();
            }

            return View(student);
        }

        // GET: Students/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Students/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("StudentId,Username,FirstName,LastName")] Student student)
        {
            if (ModelState.IsValid)
            {
                // Check if the username is already taken
                if (_context.Students.Any(s => s.Username == student.Username))
                {
                    // If the username is already taken, add a model error
                    ModelState.AddModelError("Username", "Username is already taken");
                    return View(student);
                }
                // Additional validation for username length
                if (student.Username?.Length > 10)
                {
                    return BadRequest(new { message = "Username must be at most 10 characters long" });
                }

                // Additional validation for first name length
                if (student.FirstName?.Length > 50)
                {
                    return BadRequest(new { message = "First name must be at most 50 characters long" });
                }

                // Additional validation for last name length
                if (student.LastName?.Length > 50)
                {
                    return BadRequest(new { message = "Last name must be at most 50 characters long" });
                }

                _context.Add(student);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(student);
        }

        // GET: Students/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Students == null)
            {
                return NotFound();
            }

            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }
            return View(student);
        }

        // POST: Students/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("StudentId,Username,FirstName,LastName")] Student student)
        {
            if (id != student.StudentId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(student);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StudentExists(student.StudentId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(student);
        }

        // GET: Students/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Students == null)
            {
                return NotFound();
            }

            var student = await _context.Students
                .FirstOrDefaultAsync(m => m.StudentId == id);
            if (student == null)
            {
                return NotFound();
            }

            return View(student);
        }

        // POST: Students/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Students == null)
            {
                return Problem("Entity set 'GearNetContext.Students'  is null.");
            }
            var student = await _context.Students.FindAsync(id);
            if (student != null)
            {
                // Check if the student is part of a case
                var isPartOfCase = _context.Cases.Any(c => c.StudentId == id);
                if (isPartOfCase)
                {
                    // Add an error to the ModelState and return to the view
                    ModelState.AddModelError("Student", "The student is part of a case and cannot be deleted.");
                    return View(student);
                }
                _context.Students.Remove(student);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }


        private bool StudentExists(int id)
        {
            return (_context.Students?.Any(e => e.StudentId == id)).GetValueOrDefault();
        }
    }
}
