using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GearNet.Entities
{
    [Table("Devices")]
    public class Device
    {
        public int DeviceId { get; set; }
        [MaxLength(50)]
        [DisplayName("Device Name")]
        [Required(ErrorMessage = "Device Name is required.")]
        public string? DeviceName { get; set; }
        [MaxLength(50)]
        [DisplayName("Device Type")]
        [Required(ErrorMessage = "Device Type is required.")]
        public string? DeviceType { get; set; }
        [DisplayName("Checked Out?")]
        public bool? IsCheckedOut { get; set; }
    }
}
