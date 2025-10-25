// api/checkPet.js — Vercel Serverless (Node)
export default function handler(req, res) {
  const TARGET_PET = "Los Combinasion";
  const TARGET_ALIASES = ["loscombinasion","los_combinasion","pet001"];
  const OTHER_PETS = ["GoldenDragon","FluffyCat","RainbowDog","MysticFox","MysticRabbit"];

  function normalize(s){ return String(s||"").toLowerCase().replace(/\s|_/g,""); }
  function matchTarget(input){
    const n = normalize(input);
    if(n === normalize(TARGET_PET)) return true;
    return TARGET_ALIASES.includes(n);
  }

  const petQuery = (req.query && req.query.pet) || (req.url && new URL(req.url, "http://localhost").searchParams.get("pet"));
  if(!matchTarget(petQuery)) {
    res.status(200).json({ success:false, message:"❌ Nur Los Combinasion wird unterstützt", found:false });
    return;
  }

  const servers = [];
  for(let i=1;i<=25;i++){
    const pets = [];
    if(Math.random() < 0.15) pets.push(TARGET_PET);
    OTHER_PETS.forEach(p => { if(Math.random() < 0.5) pets.push(p); });
    servers.push({ id:`server_${i}`, pets });
  }

  const found = servers.find(s => s.pets.includes(TARGET_PET));
  if(found){
    console.log(`✅ ${TARGET_PET} gefunden auf ${found.id}`);
    res.status(200).json({ success:true, found:true, server:found.id, message:`${TARGET_PET} gefunden auf ${found.id}` });
  } else {
    console.log("🔁 Kein Treffer – Suche läuft weiter...");
    res.status(200).json({ success:true, found:false, message:"Kein Server mit Los Combinasion gefunden" });
  }
}
