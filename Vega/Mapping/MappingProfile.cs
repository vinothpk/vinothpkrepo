using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Vega.Controllers.Resources;
using Vega.Core.Models;

namespace Vega.Mapping
{
    public class MappingProfile : Profile
    {
       public MappingProfile()
       {
           //Domain to API Resource
           CreateMap<Photo, PhotoResource>();
           CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));
           CreateMap<Make, MakeResource>();
           CreateMap<Make, KeyValuePairResource>();
           CreateMap<Model, KeyValuePairResource>();
           CreateMap<Feature, KeyValuePairResource>();
           CreateMap<Vehicle, SaveVehicleResource>()
            .ForMember(vr => vr.Contact, act => act.MapFrom(v => new ContactResource{Name = v.ContactName, Email = v.ContactEmail, Phone = v.ContactPhone}))
            .ForMember(vr => vr.Features, act => act.MapFrom(v => v.Features.Select(vf => vf.FeatureId)));
           CreateMap<Vehicle, VehicleResource>()
            .ForMember(vr => vr.Make, act => act.MapFrom(v => v.Model.Make))
            .ForMember(vr => vr.Contact, act => act.MapFrom(v => new ContactResource{Name = v.ContactName, Email = v.ContactEmail, Phone = v.ContactPhone}))
            .ForMember(vr => vr.Features, act => act.MapFrom(v => v.Features.Select(vf => new KeyValuePairResource{Id = vf.Feature.Id, Name = vf.Feature.Name})));

           //API Resource to Domain
           CreateMap<VehicleQueryResource, VehicleQuery>();
           CreateMap<SaveVehicleResource, Vehicle>()
            .ForMember(v => v.Id, act => act.Ignore())
            .ForMember(v => v.ContactName, act => act.MapFrom(vr => vr.Contact.Name))
            .ForMember(v => v.ContactEmail, act => act.MapFrom(vr => vr.Contact.Email))
            .ForMember(v => v.ContactPhone, act => act.MapFrom(vr => vr.Contact.Phone))
            .ForMember(v => v.Features, act => act.Ignore())
            .AfterMap((vr, v) => {
                //Remove unselected features
                var removedFeatures = v.Features.Where(f => !vr.Features.Contains(f.FeatureId)).ToList();
                foreach(var f in removedFeatures)
                    v.Features.Remove(f);

                //Add new features
                var addedFeatures = vr.Features.Where(id => !v.Features.Any(f => f.FeatureId == id)).Select(nid => new VehicleFeature{FeatureId = nid}).ToList();        
                foreach(var f in addedFeatures)
                    v.Features.Add(f);
            });
       } 
    }
}