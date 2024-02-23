import { computed } from "vue";

export const VITE_BASENAME = import.meta.env.VITE_BASENAME;

export const roundTo = function( num, decimal ) { return Math.round( ( num + Number.EPSILON ) * Math.pow( 10, decimal ) ) / Math.pow( 10, decimal ); }

export const baseURL=computed(()=>{
  return `${location.protocol}//${location.host}/${VITE_BASENAME}`;
});

export const getDate=(date)=>{
  return new Date(date).toLocaleString("zh-TW");
}

export const getDuration=(duration)=>{
  if(duration==undefined)
    return "";
  let tokens=duration.split(/[\:]+/);
  return Number(tokens[1])+"分 "+tokens[2].slice(0,4)+"秒";
}

export const getName=(id)=>{
  return {
    // Raids
    // w1
    11: "Vale Guardian",
    13: "Gorseval the Multifarious",
    14: "Sabetha the Saboteur",
    // w2
    21: "Slothasor",
    22: "Bandit Trio",
    23: "Matthias Gabrel",
    // w3
    31: "Escort",
    32: "Keep Construct",
    33: "Twisted Castle",
    34: "Xera",
    // w4
    41: "Cairn the Indomitable",
    42: "Mursaat Overseer",
    43: "Samarog",
    44: "Deimos",
    // w5
    51: "Soulless Horror",
    52: "River of Souls",
    53: "Broken King",
    54: "Eater of Souls",
    55: "Statue of Darkness",
    56: "Dhuum",
    // w6
    61: "Conjured Amalgamate",
    62: "Twin Largos",
    63: "Qadim",
    // w7
    71: "Cardinal Adina",
    72: "Cardinal Sabir",
    73: "Qadim the Peerless",
    // FotM
    // 97
    10001: "MAMA",
    10002: "Siax the Corrupted",
    10003: "Ensolyss of the Endless Torment",
    // 98
    10011: "Skorvald the Shattered",
    10012: "Artsariiv",
    10013: "Arkk",
    // 99
    10022: "Ai, Keeper of the Peak - Elemental",
    10023: "Ai, Keeper of the Peak - Dark",
    10024: "Ai, Keeper of the Peak - Both Phases",
    // 100
    10031: "Kanaxai, Scythe of House Aurkus",
    // Special
    20001: "Freezie",
    30001: "Standard Kitty Golem",
    50001: "Mordremoth",
    // SM
    // IBS
    40001: "Legendary Icebrood Construct",
    40002: "The Voice and the Claw",
    40003: "Fraenir of Jormag",
    40004: "Boneskinner",
    40005: "Whisper of Jormag",
    40006: "Varinia Stormsounder",
    // EoD
    41001: "Aetherblade Hideout",
    41002: "Xunlai Jade Junkyard",
    41003: "Kaineng Overlook",
    41004: "Harvest Temple",
    42001: "Old Lion's Court",
    // SotO
    43001: "Cosmic Observatory",
    43002: "Temple of Febe"
  }[id];
}

export const getMode=(row)=>{
  let result="";
  if(row.EncounterMode==0)
    result="?";
  if(row.EncounterMode==2)
    result="CM";
  else if(row.EncounterMode>2)
    result="E"+row.EncounterMode-2;
  return result;
};

export const getModeDesc=(id)=>{
  let result="";
  if(id==0)
    result="未知";
  if(id==2)
    result="挑戰模式";
  else if(id>2)
    result="膽量模式 "+id-2+"層";
  return result;
}

export const getResult=(row)=>{
  if(row.EncounterResult==0)
    return "成功";
  else if(row.EncounterResult==1)
    return "失敗 ("+roundTo(row.HealthPercentage*100,2)+"%)";
  return "未知";
};

export const getResultDesc=(row)=>{
  if(row.EncounterResult==0)
    return "成功";
  else if(row.EncounterResult==1)
    return "失敗 ("+roundTo(row.HealthPercentage*100,2)+"% 生命值)";
  return "未知";
}

export const getFractalScale=(FractalExtras)=>
{
  if(FractalExtras==undefined)
    return "";
  return FractalExtras.FractalScale;
}

export const getInstabilities=(FractalExtras)=>{
  if(FractalExtras==undefined)
    return [];
  return FractalExtras.MistlockInstabilities;
}

export const getInstability=(id)=>{
  return [
    "Adrenaline Rush","Afflicted","Boon Overload","Flux Bomb",
    "Fractal Vindicators","Frailty","Hamstrung","Last Laugh",
    "Mists Covergence","No Pain No Gain","Outflanked","Social Awkwardness",
    "Stick Together","Sugar Rush","Toxic Sickness","Toxic Trail",
    "Vengeance","We Bleed Fire","Birds","Slippery Slope"][id];
}

export const getInstabFileName=(id)=>{
  return getInstability(id).toLowerCase().split(" ").join("_");
}

export const getFractalScaleDesc=(LogExtras)=> {
  if(LogExtras==undefined||LogExtras.FractalExtras==undefined)
    return "";
  return ", 碎層難度係數 "+LogExtras.FractalExtras.FractalScale;
}

export const getProfessionName=(id)=>{
  return ["Guardian","Warrior","Engineer","Ranger","Thief","Elementalist","Mesmer","Necromancer","Revenant","Unknown Profession"][id];
}

export const getSpecializationName=(id)=>
{
  return ["None",
  "Dragonhunter","Berserker","Scrapper",
  "Druid","Daredevil","Tempest",
  "Chronomancer","Reaper","Herald",
  "Soulbeast","Weaver","Holosmith",
  "Deadeye","Mirage","Scourge",
  "Spellbreaker","Firebrand","Renegade",
  "Willbender","Bladesworn","Mechanist",
  "Untamed","Specter","Catalyst",
  "Virtuoso","Harbinger","Vindicator"][id];
}

export const getUsedType=(player)=>{
  return getSpecializationName(player.EliteSpecialization)!="None"?getSpecializationName(player.EliteSpecialization):getProfessionName(player.Profession);
}

export const objectFilter=(obj, predicate)=>{
  return Object.keys(obj).filter(key=>predicate(obj[key])).reduce((res,key)=>(res[key]=obj[key],res),{});
}

export const getPlayerGroup=(players)=>{
  let result={};
  if(players==undefined)
    return;
  for(let player of players)
  {
    if(result[player.Subgroup]==undefined)
      result[player.Subgroup]=[];
    result[player.Subgroup].push(player);
  }
  return result;
}