<script setup>
import { computed, reactive, ref, watch } from 'vue';

const emit=defineEmits(['changeFilter']);

const expanded=ref({
  all: true,
  raids: true,
  sm: true
});

const from=ref("");
const to=ref("");

const selectedData=ref(0);

const count=reactive({});

const srcData=ref([]);
const filteredDataSize=ref(-1);

const checkedResults=ref(['success','failed','unknown']);
const checkedModes=ref(['normal','challenge','emboldened']);

const selectedCategories=ref([]);

watch(
  [checkedResults,checkedModes,from,to,selectedCategories],
  ()=>{
    if(checkedResults.value.length==0||checkedModes.value.length==0)
    {
      emit('changeFilter',[]);
      return;
    }
    let temp=srcData.value;
    let categoriesSet=new Set(selectedCategories.value);
    temp=temp.filter(row=>categoriesSet.has(row.Encounter))
    if(checkedResults.value.length!=3)
    {
      let resultsSet=[];
      for(let result of checkedResults.value)
        resultsSet.push({"success":0,"failed":1,'unknown':2}[result]);
      resultsSet=new Set(resultsSet);
      temp=temp.filter(row=>resultsSet.has(row.EncounterResult));
    }
    if(checkedModes.value,length!=3)
    {
      let modesSet=[];
      for(let mode of checkedModes.value)
        modesSet.push({"normal":1,"challenge":2,'emboldened':3}[mode]);
      modesSet=new Set(modesSet);
      if(modesSet.has(3))
        [4,5,6,7].forEach((v)=>modesSet.add(v));
      temp=temp.filter(row=>modesSet.has(row.EncounterMode));
    }
    if(from.value!="")
    {
      let fromTime=new Date(from.value);
      temp=temp.filter(row=>{
        let rowTime=new Date(row.EncounterStartTime);
        return rowTime>=fromTime;
      })
    }
    if(to.value!="")
    {
      let toTime=new Date(to.value);
      temp=temp.filter(row=>{
        let rowTime=new Date(row.EncounterStartTime);
        return rowTime<=toTime;
      })
    }
    filteredDataSize.value=temp.length;
    emit('changeFilter',temp);
  }
)

const categories=
{
  name: "所有日誌",
  img: "ArenaNet/guild_registrar_icon_26px.png",
  expanded: "all",
  children: [
    {
      name: "大型地下城 (Raids)",
      img: "ArenaNet/raid_icon_32px.png",
      expanded: "raids",
      children: [
        {
          name: "Spirit Vale (W1)",
          img: "ArenaNet/raid_wing_32px.png",
          expanded: "w1",
          children: [
            {
              name: "Vale Guardian",
              id: 11,
              img: "ArenaNet/Bosses/Mini_Vale_Guardian.png",
            },
            {
              name: "Gorseval the Multifarious",
              id: 13,
              img: "ArenaNet/Bosses/Mini_Gorseval_the_Multifarious.png",
            },
            {
              name: "Sabetha the Saboteur",
              id: 14,
              img: "ArenaNet/Bosses/Mini_Sabetha.png",
            }
          ]
        },
        {
          name: "Salvation Pass (W2)",
          img: "ArenaNet/raid_wing_32px.png",
          expanded: "w2",
          children: [
            {
              name: "Slothasor",
              id: 21,
              img: "ArenaNet/Bosses/Mini_Slothasor.png",
            },
            {
              name: "Bandit Trio",
              id: 22,
              img: "ArenaNet/Bosses/Mini_Narella.png",
            },
            {
              name: "Matthias Gabrel",
              id: 23,
              img: "ArenaNet/Bosses/Mini_Matthias_Abomination.png",
            }
          ]
        },
        {
          name: "Stronghold of the Faithful (W3)",
          img: "ArenaNet/raid_wing_32px.png",
          expanded: "w3",
          children: [
            {
              name: "Escort",
              id: 31,
              img: "ArenaNet/Bosses/Mini_McLeod_the_Silent.png",
            },
            {
              name: "Keep Construct",
              id: 32,
              img: "ArenaNet/Bosses/Mini_Keep_Construct.png",
            },
            {
              name: "Twisted Castle",
              id: 33,
              img: "ArenaNet/Bosses/TC.png",
            },
            {
              name: "Xera",
              id: 34,
              img: "ArenaNet/Bosses/Mini_Xera.png",
            }
          ]
        },
        {
          name: "Bastion of the Penitent (W4)",
          img: "ArenaNet/raid_wing_32px.png",
          expanded: "w4",
          children: [
            {
              name: "Cairn the Indomitable",
              id: 41,
              img: "ArenaNet/Bosses/Mini_Cairn_the_Indomitable.png",
            },
            {
              name: "Mursaat Overseer",
              id: 42,
              img: "ArenaNet/Bosses/Mini_Mursaat_Overseer.png",
            },
            {
              name: "Samarog",
              id: 43,
              img: "ArenaNet/Bosses/Mini_Samarog.png",
            },
            {
              name: "Deimos",
              id: 44,
              img: "ArenaNet/Bosses/Mini_Saul.png",
            }
          ]
        },
        {
          name: "Hall of Chains (W5)",
          img: "ArenaNet/raid_wing_32px.png",
          expanded: "w5",
          children: [
            {
              name: "Soulless Horror",
              id: 51,
              img: "ArenaNet/Bosses/Mini_Desmina.png",
            },
            {
              name: "River of Souls",
              id: 52,
              img: "ArenaNet/Bosses/River.jpg",
            },
            {
              name: "Broken King",
              id: 53,
              img: "ArenaNet/Bosses/Mini_Broken_King.png",
            },
            {
              name: "Eater of Souls",
              id: 54,
              img: "ArenaNet/Bosses/Eater.jpg",
            },
            {
              name: "Statue of Darkness",
              id: 55,
              img: "ArenaNet/Bosses/Eyes.jpg",
            },
            {
              name: "Dhuum",
              id: 56,
              img: "ArenaNet/Bosses/Mini_Dhuum.png",
            }
          ]
        },
        {
          name: "Mythwright Gambit (W6)",
          img: "ArenaNet/raid_wing_32px.png",
          expanded: "w6",
          children: [
            {
              name: "Conjured Amalgamate",
              id: 61,
              img: "ArenaNet/Bosses/CA.png",
            },
            {
              name: "Twin Largos",
              id: 62,
              img: "ArenaNet/Bosses/Mini_Nikare.png",
            },
            {
              name: "Qadim",
              id: 63,
              img: "ArenaNet/Bosses/Mini_Qadim.png",
            }
          ]
        },
        {
          name: "The Key of Ahdashim (W7)",
          img: "ArenaNet/raid_wing_32px.png",
          expanded: "w7",
          children: [
            {
              name: "Cardinal Adina",
              id: 71,
              img: "ArenaNet/Bosses/Mini_Earth_Djinn.png",
            },
            {
              name: "Cardinal Sabir",
              id: 72,
              img: "ArenaNet/Bosses/Mini_Air_Djinn.png",
            },
            {
              name: "Qadim the Peerless",
              id: 73,
              img: "ArenaNet/Bosses/Mini_Qadim_the_Peerless.png",
            }
          ]
        }
      ]
    },
    {
      name: "進攻任務 (Strike Missions)",
      img: "ArenaNet/strike_icon_32px.png",
      expanded: "sm",
      children: [
        {
          name: "Icebrood Saga (IBS)",
          img: "ArenaNet/icebrood_saga_32px.png",
          expanded: "ibs",
          children: [
            {
              name: "Legendary Icebrood Construct",
              id: 40001,
              img: "ArenaNet/Bosses/Mini_Icebrood_Construct.png",
            },
            {
              name: "The Voice and the Claw",
              id: 40002,
              img: "ArenaNet/Bosses/Mini_Cloudseeker.png",
            },
            {
              name: "Fraenir of Jormag",
              id: 40003,
              img: "ArenaNet/Bosses/Fraenir.jpg",
            },
            {
              name: "Boneskinner",
              id: 40004,
              img: "ArenaNet/Bosses/Mini_Boneskinner.png",
            },
            {
              name: "Whisper of Jormag",
              id: 40005,
              img: "ArenaNet/Bosses/Mini_Whisper_of_Jormag.png",
            }
          ]
        },
        {
          name: "End of Dragons (EoD)",
          img: "ArenaNet/end_of_dragons_32px.png",
          expanded: "eod",
          children: [
            {
              name: "Aetherblade Hideout",
              id: 41001,
              img: "ArenaNet/Bosses/Aetherblade_Hideout.png",
            },
            {
              name: "Xunlai Jade Junkyard",
              id: 41002,
              img: "ArenaNet/Bosses/Xunlai_Jade_Junkyard.png",
            },
            {
              name: "Kaineng Overlook",
              id: 41003,
              img: "ArenaNet/Bosses/Kaineng_Overlook.png",
            },
            {
              name: "Harvest Temple",
              id: 41004,
              img: "ArenaNet/Bosses/Harvest_Temple.png",
            },
            {
              name: "Old Lion's Court",
              id: 42001,
              img: "ArenaNet/Bosses/Mini_Vermillion_Assault_Knight.png",
            }
          ]
        },
        {
          name: "Secrets of the Obscure (SotO)",
          img: "ArenaNet/secrets_of_the_obscure_32px.png",
          expanded: "soto",
          children: [
            {
              name: "Cosmic Observatory",
              id: 43001,
              img: "ArenaNet/Bosses/CO.png",
            },
            {
              name: "Temple of Febe",
              id: 43002,
              img: "ArenaNet/Bosses/ToF.png",
            }
          ]
        }
      ]
    },
    {
      name: "迷霧碎層 (FotM)",
      img: "ArenaNet/fractals_icon_32px.png",
      expanded: "fotm",
      children: [
        {
          name: "MAMA",
          id: 10001,
          img: "ArenaNet/Bosses/Mini_MAMA.png",
        },
        {
          name: "Siax the Corrupted",
          id: 10002,
          img: "ArenaNet/Bosses/Mini_Toxic_Warlock.png",
        },
        {
          name: "Ensolyss of the Endless Torment",
          id: 10003,
          img: "ArenaNet/Bosses/Mini_Ensolyss.png",
        },
        {
          name: "Skorvald the Shattered",
          id: 10011,
          img: "ArenaNet/Bosses/Skorvald.png",
        },
        {
          name: "Artsariiv",
          id: 10012,
          img: "ArenaNet/Bosses/Artsariiv.png",
        },
        {
          name: "Arkk",
          id: 10013,
          img: "ArenaNet/Bosses/Arkk.png",
        },
        {
          name: "Ai, Keeper of the Peak - Elemental",
          id: 10022,
          img: "ArenaNet/Bosses/Elemental_Ai.png",
        },
        {
          name: "Ai, Keeper of the Peak - Dark",
          id: 10023,
          img: "ArenaNet/Bosses/Dark_Ai.png",
        },
        {
          name: "Ai, Keeper of the Peak - Both Phases",
          id: 10024,
          img: "ArenaNet/Bosses/Both_Phases_Ai.png",
        },
        {
          name: "Kanaxai, Scythe of House Aurkus",
          id: 10031,
          img: "ArenaNet/Bosses/Mini_Kanaxai.png",
        }
      ]
    },
    {
      name: "特種部隊訓練場",
      id: 30001,
      img: "ArenaNet/training_area_32px.png",
    }
  ]
}

const generateCategoriesList=(root)=>{
  let result=[];
  let order=0;
  const preorder=(root,level,parentCheck,expand)=>{
    if(expand)
    {
      if(root.check==null)
        root.check=[];
      if(parentCheck!=null)
        root.check.push(...parentCheck);
      root.check.push(expand);
    }
    result.push({...root,level,order: order++});
    if(root.children!=null)
    {
      for(let child of root.children)
        preorder(child,level+1,root.check,root.expanded);
    }
  }
  preorder(root,0);
  return result;
};

const checkExpanded=(list)=>{
  let result=true;
  if(list==null) return result;
  for(let e of list)
    result=result&&expanded.value[e];
  return result;
}

const categoriesList=generateCategoriesList(categories);

//console.log(categoriesList);

const expandedObject=(expanded)=>{
  return {
    'bi-caret-down':expanded,
    'bi-caret-right-fill':!expanded
  }
}

const calCnt=(src,keys)=>
{
  let result=0;
  for(let i of keys)
    result+=(src[i]==undefined)?0:src[i];
  return result;
}

const getData=async()=>
{
  const response=await fetch("LogData.json");
  const json=(await response.json()).LogsByFilename;
  let index=0;
  for(let i in json)
  {
    json[i].order=index++;
    if(!(json[i].Encounter in count))
      count[json[i].Encounter]=0;
    count[json[i].Encounter]++;
  }
  count['all']=Object.keys(json).length;
  count['w1']=calCnt(count,[11,13,14]);
  count['w2']=calCnt(count,[21,22,23]);
  count['w3']=calCnt(count,[31,32,33,34]);
  count['w4']=calCnt(count,[41,42,43,44]);
  count['w5']=calCnt(count,[51,52,53,54,55,56]);
  count['w6']=calCnt(count,[61,62,63]);
  count['w7']=calCnt(count,[71,72,73]);
  count['raids']=calCnt(count,["w1","w2","w3","w4","w5","w6","w7"]);
  count['ibs']=calCnt(count,[40001,40002,40003,40004,40005,40006]);
  count['eod']=calCnt(count,[41001,41002,41003,41004,42001]);
  count['soto']=calCnt(count,[43001,43002]);
  count['sm']=calCnt(count,["ibs","eod","soto"]);
  count['fotm']=calCnt(count,[10001,10002,10003,10011,10012,10013,10021,10022,10023,10024,10031]);
  srcData.value=Object.values(json);
  filteredDataSize.value=srcData.value.length;
  emit('changeFilter',srcData.value);
}

getData();

const getCnt=(category)=>
{
  //category.id!=null?count[category.id]:count[category.expanded]
  if(category.expanded)
    return count[category.expanded];
  else if(category.id&&count[category.id])
    return count[category.id];
  return 0;
}

const getLastWeek=()=>{
  const currentDate=new Date();
  const lastWeekDate=new Date(currentDate.getTime()-7*24*60*60*1000+8*60*60*1000);
  from.value=lastWeekDate.toISOString().slice(0, 16);
}

const getLastDay=()=>{
  const currentDate=new Date();
  const lastDayDate=new Date(currentDate.getTime()-24*60*60*1000+8*60*60*1000);
  from.value=lastDayDate.toISOString().slice(0, 16);
}

const getLeafCategories=(categories,result=[])=>
{
  for(let i=0;i<categories.length;i++)
  {
    if(!categories[i].children)
      result.push(categories[i].id);
    else
      result=getLeafCategories(categories[i].children,result);
  }
  return result;
}

const selectData=(order,type)=>{
  selectedData.value=order;
  selectedCategories.value=getLeafCategories([type]);
}

selectedCategories.value=getLeafCategories([categories]);

const filteredDataSizeDesc=computed(()=>{
  if(filteredDataSize.value==srcData.value.length)
    return "。";
  return `，顯示 ${filteredDataSize.value} 條。`;
})

</script>

<template>
  <div class="collapse collapse-horizontal show sidebar border-end col-3 pb-2 bg-body-tertiary" id="sidebar">

    <div class="mt-2">
      <div class="d-flex justify-content-between align-items-center">
        結果
        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
          <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off" v-model="checkedResults" value="success">
          <label class="btn btn-outline-success" for="btncheck1">成功</label>

          <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off" v-model="checkedResults" value="failed">
          <label class="btn btn-outline-danger" for="btncheck2">失敗</label>

          <input type="checkbox" class="btn-check" id="btncheck3" autocomplete="off" v-model="checkedResults" value="unknown">
          <label class="btn btn-outline-warning" for="btncheck3">未知</label>
        </div>
        模式
        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
          <input type="checkbox" class="btn-check" id="btncheck4" autocomplete="off" v-model="checkedModes" value="normal">
          <label class="btn btn-outline-primary" for="btncheck4">普通</label>

          <input type="checkbox" class="btn-check" id="btncheck5" autocomplete="off" v-model="checkedModes" value="challenge">
          <label class="btn btn-outline-danger" for="btncheck5">挑戰</label>

          <input type="checkbox" class="btn-check" id="btncheck6" autocomplete="off" v-model="checkedModes" value="emboldened">
          <label class="btn btn-outline-success" for="btncheck6">膽量</label>
        </div>
      </div>
    </div>

    <div class="mt-2">
      日期
      <div class="input-group mb-2">
        <span class="input-group-text">從</span>
        <input type="datetime-local" v-model="from" class="form-control">
      </div>
      <div class="input-group mb-2">
        <span class="input-group-text">到</span>
        <input type="datetime-local" v-model="to" class="form-control">
      </div>
      <div class="d-flex justify-content-center gap-1">
        <button type="button" class="btn btn-primary" @click="from=''">所有時間</button>
        <button type="button" class="btn btn-primary" @click="getLastWeek">過去7天</button>
        <button type="button" class="btn btn-primary" @click="getLastDay">過去24小時</button>
      </div>
    </div>

    <div class="mt-2 d-flex justify-content-center">
      <div>
        找到 {{ srcData.length }} 條日誌{{ filteredDataSizeDesc }}
      </div>
    </div>

    <table class="table table-striped mt-2">
      <thead>
        <tr>
          <th scope="col">分類</th>
          <th scope="col">計數</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="category of categoriesList">
          <tr v-if="checkExpanded(category.check)" :class="{'table-primary':selectedData==category.order}" @click="selectData(category.order,category)">
            <td>
              {{ Array(category.level*3).fill("&nbsp;").join('') }}
              {{ category.expanded?"":Array(4).fill("&nbsp;").join('') }}
              <i v-if="category.expanded" class="bi" :class="expandedObject(expanded[category.expanded])" @click="expanded[category.expanded]=!expanded[category.expanded]"></i>
              <img width="32px" :src="`Images/${category.img}`">
              {{ category.name }}
            </td>
            <td>{{ getCnt(category) }}</td>
          </tr>
        </template>
      </tbody>
    </table>

  </div>
</template>

<script>

</script>

<style scoped>

</style>
