import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Check, Heart, Shield, Award, Landmark, Search, Navigation } from 'lucide-react';

export default function CitizenRecyclingCenters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');

  const centers = [
    {
      id: 'depot-1',
      name: 'Central District EcoDepot',
      address: '550 Civic Center Blvd',
      phone: '+1 555-0811',
      hours: '8 AM - 6 PM (Mon - Sat)',
      status: 'Open',
      accepted: ['Plastics', 'Aluminum', 'Cardboard', 'Glass', 'Paper'],
      rating: 4.8,
      lat: 37.7750,
      lng: -122.4220
    },
    {
      id: 'depot-2',
      name: 'Mission Green-Cycle Hub',
      address: '1420 Mission St',
      phone: '+1 555-0822',
      hours: '9 AM - 7 PM (Daily)',
      status: 'Open',
      accepted: ['Plastics', 'Compost', 'E-Waste', 'Batteries', 'Bulb'],
      rating: 4.9,
      lat: 37.7845,
      lng: -122.4050
    },
    {
      id: 'depot-3',
      name: 'Soma Hazardous & Metal Salvage',
      address: '980 Bryant St Depot',
      phone: '+1 555-0833',
      hours: '7 AM - 4 PM (Mon - Fri)',
      status: 'Closed',
      accepted: ['Hazardous', 'Paint', 'Batteries', 'Heavy metals', 'E-Waste'],
      rating: 4.6,
      lat: 37.7712,
      lng: -122.4105
    }
  ];

  const materials = ['All', 'Plastics', 'Glass', 'Compost', 'E-Waste', 'Batteries', 'Hazardous', 'Heavy metals'];

  // Filtering
  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          center.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMaterial = selectedMaterial === 'All' || center.accepted.includes(selectedMaterial);
    return matchesSearch && matchesMaterial;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Landmark className="h-5 w-5 mr-1.5 text-emerald-600" /> Eco Recycling Centers Directory
          </h3>
          <p className="text-xs text-slate-500">Locate official hubs accepting domestic sorted recyclables and hazardous materials.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search centers or address..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
          />
        </div>
      </div>

      {/* Materials filter horizontal bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {materials.map(mat => (
          <button
            key={mat}
            onClick={() => setSelectedMaterial(mat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedMaterial === mat
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            {mat}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.map(center => (
          <div 
            key={center.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                    center.status === 'Open' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' 
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                  }`}>
                    {center.status}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">{center.name}</h4>
                </div>
                <div className="flex items-center space-x-0.5 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold font-mono shrink-0">
                  <span>★</span>
                  <span>{center.rating}</span>
                </div>
              </div>

              {/* Address / Contacts */}
              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate">{center.address}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span>{center.hours}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span>{center.phone}</span>
                </div>
              </div>
            </div>

            {/* Accepted materials list */}
            <div>
              <span className="block text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide mb-1.5">
                ACCEPTED MATERIALS FOR REVENUE CREDITS:
              </span>
              <div className="flex flex-wrap gap-1">
                {center.accepted.map(mat => (
                  <span 
                    key={mat}
                    className="text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded-lg"
                  >
                    ✔ {mat}
                  </span>
                ))}
              </div>
            </div>

            {/* Simulated Navigation action */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => alert(`GPS navigation initiated for eco center: ${center.name}. Routing electric container truck...`)}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/20 dark:hover:bg-slate-850/50 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
              >
                <Navigation className="h-3.5 w-3.5 text-emerald-600" />
                <span>Calculate GPS Route</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
