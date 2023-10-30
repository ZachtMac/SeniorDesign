using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using static System.Net.Mime.MediaTypeNames;

namespace GearNet.Entities
{
    [Table("Cases")]
    public class Case
    {
        public int CaseId { get; set; }
        [MaxLength(50)]
        [DisplayName("Case Name")]
        public string? CaseName { get; set; }
        public DateTime? DateTime { get; set; }
        public double? Duration { get; set; }
        public int? StudentId { get; set; } //Necessary for relationship building
        [ForeignKey("StudentId")]
        public virtual Student? Student { get; set; }
        
        public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
    }
}
