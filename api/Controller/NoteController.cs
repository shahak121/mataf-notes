using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.ComponentModel.DataAnnotations;

namespace api.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NoteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NoteDTO>>> GetNotes()
        {
            var notes = await _context.Notes
                                      .Where(note => note.IsHidden == false)
                                      .ToListAsync();

            var noteDTOs = notes.Select(note => new NoteDTO
            {
                NoteNo = note.NoteNo,
                NoteTitle = note.NoteTitle,
                NoteContents = note.NoteContents,
                CreatedAt = note.CreatedAt,
                UserId = note.UserId,
                DeletedAt = note.DeletedAt,
            }).ToList();

            return Ok(noteDTOs);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<NoteDTO>> GetNoteById(Guid id)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note == null)
            {
                return NotFound();
            }

            var noteDTO = new NoteDTO
            {
                NoteNo = note.NoteNo,
                NoteTitle = note.NoteTitle,
                NoteContents = note.NoteContents,
                CreatedAt = note.CreatedAt,
                UserId = note.UserId,
                DeletedAt = note.DeletedAt,
            };

            return noteDTO;
        }

        [HttpPost]
        public async Task<ActionResult<NoteDTO>> CreateNote([FromBody] NoteDTO request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var user = await _context.Users.FindAsync(request.UserId);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                var note = new Note
                {
                    NoteTitle = request.NoteTitle,
                    NoteContents = request.NoteContents,
                    CreatedAt = DateTime.UtcNow, // Set the created date
                    DeletedAt = request.DeletedAt,
                    UserId = request.UserId
                };

                _context.Notes.Add(note);
                await _context.SaveChangesAsync();

                var noteDTO = new NoteDTO
                {
                    NoteNo = note.NoteNo,
                    NoteTitle = note.NoteTitle,
                    NoteContents = note.NoteContents,
                    CreatedAt = note.CreatedAt,
                    UserId = note.UserId,
                    DeletedAt = note.DeletedAt,
                };

                return CreatedAtAction(nameof(GetNoteById), new { id = noteDTO.NoteNo }, noteDTO);
            }
            catch (DbUpdateException dbEx)
            {
                // Log the inner exception details
                Console.WriteLine($"Error creating note: {dbEx.InnerException?.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, dbEx.InnerException?.Message);
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                Console.WriteLine($"Error creating note: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        // PATCH: api/notes/{id}
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchNote(Guid id, [FromBody] NotePatchDto notePatchDto)
        {
            if (notePatchDto == null)
            {
                return BadRequest("Invalid patch document.");
            }

            var note = await _context.Notes.FirstOrDefaultAsync(n => n.NoteNo == id);
            if (note == null)
            {
                return NotFound("Note not found.");
            }

            // Apply changes to the note entity
            if (!string.IsNullOrWhiteSpace(notePatchDto.NoteTitle))
            {
                note.NoteTitle = notePatchDto.NoteTitle;
            }
            if (!string.IsNullOrWhiteSpace(notePatchDto.NoteContents))
            {
                note.NoteContents = notePatchDto.NoteContents;
            }
            if (notePatchDto.DeletedAt.HasValue)
            {
                note.DeletedAt = notePatchDto.DeletedAt.Value;
            }
            if (notePatchDto.UserId.HasValue)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == notePatchDto.UserId.Value);
                if (user == null)
                {
                    return NotFound("User not found.");
                }
                note.UserId = notePatchDto.UserId.Value;
            }

            // Validate the updated note entity
            var validationContext = new ValidationContext(note);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(note, validationContext, validationResults, true);

            if (!isValid)
            {
                foreach (var validationResult in validationResults)
                {
                    ModelState.AddModelError(validationResult.MemberNames.First(), validationResult.ErrorMessage);
                }
                return BadRequest(ModelState);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // DELETE: api/notes/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(Guid id)
        {
            var note = await _context.Notes.FirstOrDefaultAsync(n => n.NoteNo == id);
            if (note == null)
            {
                return NotFound("Note not found.");
            }

            // Mark the note as hidden instead of deleting it
            note.IsHidden = true;

            // Validate the updated note entity
            var validationContext = new ValidationContext(note);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(note, validationContext, validationResults, true);

            if (!isValid)
            {
                foreach (var validationResult in validationResults)
                {
                    ModelState.AddModelError(validationResult.MemberNames.First(), validationResult.ErrorMessage);
                }
                return BadRequest(ModelState);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NoteExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }







        private bool NoteExists(Guid id)
        {
            return _context.Notes.Any(e => e.NoteNo == id);
        }


    }
}
