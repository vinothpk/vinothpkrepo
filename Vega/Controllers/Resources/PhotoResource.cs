using System.ComponentModel.DataAnnotations;

namespace Vega.Controllers.Resources
{
    public class PhotoResource
    {
        public int Id {get; set;}
        public string FileName {get; set;}
        public int VehicleId {get; set;}
    }
}