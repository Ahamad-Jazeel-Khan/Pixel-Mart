import { useMemo } from "react";

const getExterior = (name) => {
  const exteriors = [
    "Factory New",
    "Minimal Wear",
    "Field-Tested",
    "Well-Worn",
    "Battle-Scarred",
  ];
  return exteriors.find((ext) => name.includes(ext)) || "Unknown";
};

const getItemType = (name) => {
  if (name.includes("Sticker")) return "Sticker";
  if (name.includes("Case")) return "Case";
  if (name.includes("Music Kit")) return "Music Kit";
  if (name.includes("Graffiti")) return "Graffiti";
  if (name.includes("Agent")) return "Agent";
  if (name.includes("Knife")) return "Melee";

  const rifles = ["AK-47", "M4A1-S", "M4A4", "FAMAS", "Galil AR", "SG 553", "AUG"];
  const snipers = ["AWP", "SSG 08", "SCAR-20", "G3SG1"];
  const pistols = ["USP-S", "Glock-18", "P250", "Five-SeveN", "Desert Eagle", "CZ75-Auto", "Dual Berettas", "Tec-9", "R8 Revolver"];
  const smgs = ["MP9", "MP7", "MP5-SD", "MAC-10", "P90", "UMP-45", "PP-Bizon"];
  const shotguns = ["Nova", "XM1014", "Sawed-Off", "MAG-7"];

  if (rifles.some(w => name.includes(w))) return "Rifle";
  if (snipers.some(w => name.includes(w))) return "Sniper";
  if (pistols.some(w => name.includes(w))) return "Pistol";
  if (smgs.some(w => name.includes(w))) return "SMG";
  if (shotguns.some(w => name.includes(w))) return "Shotgun";

  return "Other";
};

const useFilteredInventory = (inventory, filters) => {
  return useMemo(() => {
    if (!filters) return inventory;

    return inventory.filter((item) => {
      const name = item.market_hash_name || "";

      const exterior = getExterior(name);
      const type = getItemType(name);
    

      const matchType = filters.type ? type === filters.type : true;
      const matchExterior = filters.exterior ? exterior === filters.exterior : true;


      return matchType && matchExterior;
    });
  }, [inventory, filters]);
};


export default useFilteredInventory;
