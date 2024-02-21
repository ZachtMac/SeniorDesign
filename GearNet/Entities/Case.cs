using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using static System.Net.Mime.MediaTypeNames;
using GearNet.Data;

namespace GearNet.Entities
{

    [Table("Cases")]
    public class Case
    {
        public int CaseId { get; set; }
        [MaxLength(50)]
        [Required(ErrorMessage = "Case Name is Required")]
        [DisplayName("Case Name")]
        public string? CaseName { get; set; }
        [DisplayName("Start Date")]
        public DateTime? DateTime { get; set; }
        [Required(ErrorMessage = "Duration is Required")]
        public double? Duration { get; set; }
        public int? StudentId { get; set; } //Necessary for relationship building
        [DisplayName("Student Username (6+2)")]
        [Required(ErrorMessage = "Username is Required")]
        [StudentUsernameNotInExistingCase(ErrorMessage = "Student is already tied to a case")]
        public string? Username { get; set; }
        [ForeignKey("StudentId")]
        public virtual Student? Student { get; set; }
        
        public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
    }

    public class StudentUsernameNotInExistingCaseAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var context = (GearNetContext)validationContext.GetService(typeof(GearNetContext));

            var caseModel = (Case)validationContext.ObjectInstance;

            // Exclude the current case being edited from the query
            var existingCase = context.Cases.FirstOrDefault(c => c.CaseId != caseModel.CaseId && c.Student.Username == caseModel.Username);

            if (existingCase != null)
            {
                return new ValidationResult(FormatErrorMessage(validationContext.DisplayName));
            }

            return ValidationResult.Success;
        }
    }

}
