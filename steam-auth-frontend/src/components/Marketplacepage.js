// import React, { useState } from "react";  
  
  
//   const [filters, setFilters] = useState(defaultFilters);
//    const filteredInventory = useFilteredInventory(inventory, filters);
//      const defaultFilters = {
//         type: "",
//         exterior: "",
//     };

//  const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters((prev) => ({
//             ...prev,
//             [name]: name.includes("Price") ? parseFloat(value) : value,
//         }));
//     };

//  <div className="bg-[#1a1d24] p-4 rounded-xl shadow">
//                             <h3 className="text-sm font-bold mb-2 text-gray-300">Filters</h3>
//                             <div className="space-y-2">
//                                 <select
//                                     name="type"
//                                     value={filters.type}
//                                     onChange={handleFilterChange}
//                                     className="w-full p-2 rounded bg-[#0f1116] text-white border border-gray-600"
//                                 >
//                                     <option value="">All Types</option>
//                                     <option value="Rifle">Rifles</option>
//                                     <option value="Sniper Rifle">Snipers</option>
//                                     <option value="Pistol">Pistols</option>
//                                     <option value="SMG">SMGs</option>
//                                     <option value="Shotgun">Shotguns</option>
//                                     <option value="Sticker">Stickers</option>
//                                     <option value="Case">Cases</option>
//                                     <option value="Graffiti">Graffiti</option>
//                                     <option value="Agent">Agents</option>
//                                     <option value="Music Kit">Music Kits</option>
//                                 </select>

//                                 <select
//                                     name="exterior"
//                                     value={filters.exterior}
//                                     onChange={handleFilterChange}
//                                     className="w-full p-2 rounded bg-[#0f1116] text-white border border-gray-600"
//                                 >
//                                     <option value="">All Exteriors</option>
//                                     <option value="Factory New">Factory New</option>
//                                     <option value="Minimal Wear">Minimal Wear</option>
//                                     <option value="Field-Tested">Field-Tested</option>
//                                     <option value="Well-Worn">Well-Worn</option>
//                                     <option value="Battle-Scarred">Battle-Scarred</option>
//                                 </select>

//                                 <button
//                                     className="px-2 text-gray-400 text-center"
//                                     onClick={() => setFilters(defaultFilters)}
//                                 >
//                                     Reset Filters
//                                 </button>
//                             </div>
//                         </div>