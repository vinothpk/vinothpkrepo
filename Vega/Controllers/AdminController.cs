using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vega.Controllers.Resources;
using Vega.Core;
using Vega.Core.Models;
using Vega.Persistence;

namespace Vega.Controllers
{
    [Route("/api/admin")]
    public class AdminController : Controller
    {
        private readonly IMapper mapper;
        private readonly IVehicleRepository repository;
        private readonly IUnitOfWork unitOfWork;
        private readonly VegaDbContext context;
        public AdminController(IMapper mapper, IVehicleRepository repository, IUnitOfWork unitOfWork, VegaDbContext context)
        {
            this.context = context;
            this.unitOfWork = unitOfWork;
            this.repository = repository;
            this.mapper = mapper;
        }

        [HttpGet("makescount")]
        public async Task<List<MakesCountResource>> GetMakesCount()
        {
            var makesCount = await context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .GroupBy(g => g.Model.Make.Name)
                .OrderBy(o => o.Key)
                .Select(s => new MakesCount{MakeName = s.Key, MakeCount = s.Count()})
                .ToListAsync();
                
            var makesResourceCount = mapper.Map<List<MakesCount>, List<MakesCountResource>>(makesCount);
            return makesResourceCount;
        }

        [HttpGet("modelscount")]
        public async Task<List<ModelsCountResource>> GetModelsCount()
        {
            var modelsCount = await context.Vehicles
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .GroupBy(g => g.Model.Name)
                .OrderBy(o => o.Key)
                .Select(s => new ModelsCount{ModelName = s.Key, ModelCount = s.Count()})
                .ToListAsync();
                
            var modelsResourceCount = mapper.Map<List<ModelsCount>, List<ModelsCountResource>>(modelsCount);
            return modelsResourceCount;
        }

        [HttpGet("{msg}")]
        public IActionResult GetVehicle(string msg)
        {
            return Ok(msg);
        }   
    }
}