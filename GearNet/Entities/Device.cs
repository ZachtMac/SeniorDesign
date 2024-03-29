﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Net.Mime.MediaTypeNames;

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
        [MaxLength(50)]
        [DisplayName("Operating System")]
        public string? OperatingSystem { get; set; }
        [MaxLength(30)]
        [DisplayName("Vendor")]
        public string? Vendor { get; set; }
        [MaxLength(30)]
        [DisplayName("Software Version")]
        public string? SoftwareVersion { get; set; }
        [DisplayName("Rack Row")]
        public int? RackRow { get; set; }
        [DisplayName("Rack Column")]
        public int? RackCol { get; set; }
        [DisplayName("Checked Out?")]
        public bool? IsCheckedOut { get; set; }
        [MaxLength(30)]
        [DisplayName("Static IP Address")]
        public string? Address { get; set; }
        public int? CaseId { get; set; } //Necessary for relationship modeling
        [ForeignKey("CaseId")]
        public virtual Case? Case { get; set; }
        public int? StudentId { get; set; } //Necessary for relationship modeling
        [ForeignKey("StudentId")]
        public virtual Student? Student { get; set; }
    }
}
