<script setup>
import { computed, ref } from 'vue';
import Paginate from 'vuejs-paginate-next';
import { getName, getProfessionName, roundTo, getSpecializationName } from '../util';

const props=defineProps(['data']);

const sortType=ref("name");
const isReverse=ref(false);

const page=ref(1);
const pageSize=16;

const tableHead={
  "遭遇戰名稱": "name",
  "日誌": "logCnt",
  "總時間": "time",
  "成功數": "success",
  "成功總時間": "successTime",
  "平均成功時間": "avgSuccessTime",
  "失敗數": "failed",
  "失敗總時間": "failedTime",
  "平均失敗時間": "avgFailedTime",
  "成功率": "successRate"
}

const EncounterData=computed(()=>{
  let data={};
  for(let row of props.data)
  {
    let id=row.Encounter;
    let result=row.EncounterResult;
    let duration=row.EncounterDuration;
    let tokens=duration.split(/[\:]+/);
    
    let totalSec=Number(tokens[1])*60+Number(tokens[2]);
    if(!Object.hasOwn(data,id))
      data[id]={id, success: 0, failed: 0, cnt: 0, time: 0,successTime: 0, failedTime: 0};
    data[id].cnt++;
    data[id].time+=totalSec;
    if(result==0)
    {
      data[id].success++;
      data[id].successTime+=totalSec;
    }
    else if(result==1)
    {
      data[id].failed++;
      data[id].failedTime+=totalSec;
    }
  }
  data=Object.values(data);
  return data.sort((a,b)=>{
    let resultA=0;
    let resultB=0;
    if(sortType.value=='name')
    {
      resultA=getName(a.id);
      resultB=getName(b.id);
    }
    else if(sortType.value=='logCnt')
    {
      resultA=a.cnt;
      resultB=b.cnt;
    }
    else if(sortType.value=='time')
    {
      resultA=a.time;
      resultB=b.time;
    }
    else if(sortType.value=='success')
    {
      resultA=a.success;
      resultB=b.success;
    }
    else if(sortType.value=='successTime')
    {
      resultA=a.successTime;
      resultB=b.successTime;
    }
    else if(sortType.value=='avgSuccessTime')
    {
      resultA=a.successTime/a.success;
      resultB=b.successTime/b.success;
    }
    else if(sortType.value=='failed')
    {
      resultA=a.failed;
      resultB=b.failed;
    }
    else if(sortType.value=='failedTime')
    {
      resultA=a.failedTime;
      resultB=b.failedTime;
    }
    else if(sortType.value=='avgFailedTime')
    {
      resultA=a.failedTime/a.failed;
      resultB=b.failedTime/b.failed;
      if(isNaN(resultA)) resultA=0;
      if(isNaN(resultB)) resultB=0;
    }
    else if(sortType.value=='successRate')
    {
      resultA=a.success/a.cnt;
      resultB=b.success/b.cnt;
    }
    if(isReverse.value)
    {
      if(resultA>resultB) return -1;
      else if(resultA<resultB) return 1;
    }
    if(resultA<resultB) return -1;
    else if(resultA>resultB) return 1;
    return 0;
  });
})

const getTime=(sec)=>{
  const date=new Date(null);
  date.setSeconds(sec);
  let result=date.toISOString();
  if(sec>60*60) // over 1 hr
  {
    result=result.slice(11,19);
    result=result.replace(':',"小時 ");
    result=result.replace(':',"分 ");
  }
  else
  {
    result=result.slice(14,19);
    result=result.replace(':',"分 ");
  }
  return result+"秒";
  
}

const changeSortType=(type)=>{
  if(sortType.value==type)
    isReverse.value=!isReverse.value;
  else
    isReverse.value=false;
  sortType.value=type;
}

const pageCount=computed(()=>{
  let totalRecord=EncounterData.value.length;
  return parseInt((totalRecord+pageSize-1)/pageSize);
})

const ProfessionData=computed(()=>{
  let data={pro: {}, spec: {}, core: {}};
  for(let row of props.data)
  {
    for(let player of row.Players)
    {
      if(!Object.hasOwn(data.pro,player.Profession))
        data.pro[player.Profession]=0;
      data.pro[player.Profession]++;

      if(player.EliteSpecialization==0)
      {
        if(!Object.hasOwn(data.core,player.Profession))
          data.core[player.Profession]=0;
        data.core[player.Profession]++;
      }
      else
      {
        if(!Object.hasOwn(data.spec,player.EliteSpecialization))
          data.spec[player.EliteSpecialization]=0;
        data.spec[player.EliteSpecialization]++;
      }
    }
  }
  return data;
})

const SpecData=computed(()=>{
  let result=[];
  const core=[1,0,8,3,4,2,7,5,6];
  const spec=[
    [2,16,20],[1,17,19],[9,18,27],
    [4,10,22],[5,13,23],[3,12,21],
    [8,15,26],[6,11,24],[7,14,25]
  ];
  for(let i=0;i<9;i++)
  {
    let row=[];
    if(!Object.hasOwn(ProfessionData.value.core,core[i]))
      row.push({name: getProfessionName(core[i]), cnt: 0});
    else
      row.push({name: getProfessionName(core[i]), cnt: ProfessionData.value.core[core[i]]});
    for(let j of spec[i])
    {
      if(!Object.hasOwn(ProfessionData.value.spec,j))
        row.push({name: getSpecializationName(j), cnt: 0});
      else
        row.push({name: getSpecializationName(j), cnt: ProfessionData.value.spec[j]});
    }
    result.push(row);
  }
  return result;
})

</script>

<template>
  <nav>
    <div class="nav nav-tabs mt-1" id="nav-tab" role="tablist">
      <button class="nav-link active" id="nav-encounter-tab" data-bs-toggle="tab" data-bs-target="#nav-encounter" type="button" role="tab" aria-controls="nav-encounter" aria-selected="true">遭遇戰</button>
      <button class="nav-link" id="nav-spec-tab" data-bs-toggle="tab" data-bs-target="#nav-spec" type="button" role="tab" aria-controls="nav-spec" aria-selected="false">特化</button>
    </div>
  </nav>
  <div class="tab-content">
    <div class="tab-pane fade show active" id="nav-encounter" role="tabpanel" aria-labelledby="nav-encounter-tab" tabindex="0">
      <table class="table">
        <thead>
          <tr>
            <template v-for="index,display in tableHead">
              <th @click="changeSortType(index)">
                {{ display }}
                <i v-if="sortType==index" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="row of EncounterData.slice((page-1)*pageSize,page*pageSize)">
            <tr>
              <td>{{ getName(row.id) }}</td>
              <td>{{ row.cnt }}</td>
              <td>{{ getTime(row.time) }}</td>
              <td>{{ row.success }}</td>
              <td>{{ getTime(row.successTime)}}</td>
              <td>{{ getTime(row.successTime/row.success) }}</td>
              <td>{{ row.failed }}</td>
              <td>{{ getTime(row.failedTime) }}</td>
              <td>{{ (row.failed)?getTime(row.failedTime/row.failed):getTime(row.failedTime) }}</td>
              <td>{{ roundTo(row.success/row.cnt*100,1) }}%</td>
            </tr>
          </template>
        </tbody>
      </table>
      <Paginate class="justify-content-center"
        v-model="page"
        :page-count="pageCount"
        :prev-text="'<i class=\'bi bi-chevron-left\'></i>'"
        :next-text="'<i class=\'bi bi-chevron-right\'></i>'"
        :first-last-button="true"
        :first-button-text="'<i class=\'bi bi-chevron-double-left\'></i>'"
        :last-button-text="'<i class=\'bi bi-chevron-double-right\'></i>'"
        >
      </Paginate>
    </div>
    <div class="tab-pane fade" id="nav-spec" role="tabpanel" aria-labelledby="nav-spec-tab" tabindex="0">
      <div class="row">
        <div class="col">
          <table class="table fs-6">
            <thead>
              <tr>
                <th colspan="2">職業計數</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="id of [1,0,8,3,4,2,7,5,6]">
                <tr>
                  <td>
                    <img :title="getProfessionName(id)" class="p-1" :src="`Images/Tango/${getProfessionName(id)}_tango_icon_20px.png`">
                  </td>
                  <td>{{ !ProfessionData.pro[id]?0:ProfessionData.pro[id] }} (平均 {{ roundTo(!ProfessionData.pro[id]?0:ProfessionData.pro[id]/props.data.length,2) }} 位)</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="col">
          <table class="table fs-6">
            <thead>
              <tr>
                <th colspan="4">特化計數</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="row of SpecData">
                <tr>
                  <td v-for="spec of row">
                    <img :title="spec.name" class="p-1" :src="`Images/Tango/${spec.name}_tango_icon_20px.png`">
                    {{ spec.cnt }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
  </div>
</template>