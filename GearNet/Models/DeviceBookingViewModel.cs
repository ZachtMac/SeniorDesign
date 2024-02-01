using GearNet.Entities;

namespace GearNet.Models
{
    public class DeviceBookingViewModel
    {
        public IEnumerable<Device> AvailableDevices { get; set; }
        public List<Device> TempBookingDevices { get; set; }
        public string CaseName { get; set; }
    }
}