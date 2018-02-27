using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vega.Controllers.Resources;
using Vega.Core.Models;

namespace Vega.Core
{
    public interface IVehicleRepository
    {
         Task<Vehicle> GetVehicle(int id, bool includeRelated = true);
         void Add(Vehicle vehicle);
         void Remove(Vehicle vehicle);
         Task<QueryResult<Vehicle>> GetVehicles(VehicleQuery filter);
         IQueryable<Vehicle> GetVehiclesCount();
    }
}