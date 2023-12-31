﻿using System;
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
    public class CasesController : Controller
    {
        private readonly GearNetContext _context;

        public CasesController(GearNetContext context)
        {
            _context = context;
        }

        // GET: Cases
        public async Task<IActionResult> Index(string caseName, DateTime? startDate, DateTime? endDate, int? duration, string? studentUser)
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

            if (endDate.HasValue)
            {
                // Include records on the end date by adding a day to the endDate
                var adjustedEndDate = endDate.Value.Date.AddDays(1);
                cases = cases.Where(c => c.DateTime < adjustedEndDate);
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
            ViewData["endDate"] = endDate.HasValue ? endDate.Value.ToString("yyyy-MM-dd") : null;
            ViewData["duration"] = duration;
            ViewData["studentUser"] = studentUser;

            return View(await cases.ToListAsync());
        }

        // GET: Cases/Details/5
        public async Task<IActionResult> Details(int? id)
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

                if(student != null)
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

        // GET: Cases/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Cases == null)
            {
                return NotFound();
            }

            var case_ = await _context.Cases.FindAsync(id);
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
        public async Task<IActionResult> Edit(int id, [Bind("CaseId,CaseName,DateTime,Duration,StudentId")] Case case_)
        {
            if (id != case_.CaseId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(case_);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CaseExists(case_.CaseId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Details", new { id = case_.CaseId });
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
                return Problem("Entity set 'GearNetContext.Cases'  is null.");
            }
            var case_ = await _context.Cases.FindAsync(id);
            if (case_ != null)
            {
                _context.Cases.Remove(case_);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CaseExists(int id)
        {
            return (_context.Cases?.Any(e => e.CaseId == id)).GetValueOrDefault();
        }
    }
}
