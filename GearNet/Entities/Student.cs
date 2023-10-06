using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearNet.Entities
{
    [Table("Students")]
    public class Student
    {
        public int StudentId { get; set; }
        [MaxLength(10)]
        [DisplayName("6+2 Username")]
        public string? Username { get; set; }
        [MaxLength(50)]
        [DisplayName("First Name")]
        public string? FirstName { get; set; }
        [MaxLength(50)]
        [DisplayName("Last Name")]
        public string? LastName { get; set; }

    }
}
