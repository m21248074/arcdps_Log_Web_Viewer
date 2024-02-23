<script setup>
import { computed, ref } from 'vue';
import Paginate from 'vuejs-paginate-next';
import { baseURL,
  getName, getUsedType, getMode, getModeDesc, getResult, getResultDesc, getPlayerGroup,
  getFractalScale, getInstability, getInstabilities, getInstabFileName, 
  getDate, getDuration, getFractalScaleDesc } from '../util';


const props=defineProps(['data','apiData']);

const selectedData=ref({});

const sortType=ref("date");
const isReverse=ref(false);
const isCopied=ref(false);

const page=ref(1);
const pageSize=15;

const changeSortType=(type)=>{
  if(sortType.value==type)
    isReverse.value=!isReverse.value;
  else
    isReverse.value=false;
  sortType.value=type;
}

const dataBySort=computed(()=>{
  return props.data.sort((a,b)=>{
    let resultA=0;
    let resultB=0;
    if(sortType.value=='name')
    {
      resultA=getName(a.Encounter);
      resultB=getName(b.Encounter);
    }
    else if(sortType.value=='cm')
    {
      resultA=getMode(a);
      resultB=getMode(b);
    }
    else if(sortType.value=='result')
    {
      resultA=a.HealthPercentage;
      resultB=b.HealthPercentage;
    }
    else if(sortType.value=='fractalLevel')
    {
      resultA=getFractalScale(a.LogExtras.FractalExtras)
      resultB=getFractalScale(b.LogExtras.FractalExtras)
    }
    else if(sortType.value=='date')
    {
      resultA=new Date(a.EncounterStartTime).getTime();
      resultB=new Date(b.EncounterStartTime).getTime();
    }
    else if(sortType.value=='duration')
    {
      resultA=a.EncounterDuration;
      resultB=b.EncounterDuration;
    }
    else if(sortType.value=='character')
    {
      resultA=a.PointOfView.CharacterName;
      resultB=b.PointOfView.CharacterName;
    }
    if(isReverse.value)
    {
      if(resultA>resultB) return -1;
      else if(resultA<resultB) return 1;
    }
    if(resultA<resultB) return -1;
    else if(resultA>resultB) return 1;
    return 0;
  })
})

const copyLink=(link)=>{
  const cb=navigator.clipboard;
  if(cb==undefined) return "";
  cb.writeText(`${baseURL.value}/Logs/${link}`);
  isCopied.value=true;
  setTimeout(()=>{
    isCopied.value=false;
  },1000);
}

const pageCount=computed(()=>{
  let totalRecord=props.data.length;
  return parseInt((totalRecord+pageSize-1)/pageSize);
})

const getGuildName=(id)=>{
  if(id=="00000000-0000-0000-0000-000000000000")
    return "沒有公會";
  else
    return props.apiData[id].Name;
}

const getGuildTag=(id)=>{
  if(id=="00000000-0000-0000-0000-000000000000")
    return "";
  else
    return `[${props.apiData[id].Tag}]`;
}

</script>

<template>
    <table class="table">
      <thead>
        <tr>
          <th @click="changeSortType('name')">
            遭遇戰名稱
            <i v-if="sortType=='name'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
          </th>
          <th @click="changeSortType('cm')">
            CM
            <i v-if="sortType=='cm'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
          </th>
          <th @click="changeSortType('result')">
            結果
            <i v-if="sortType=='result'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
          </th>
          <th @click="changeSortType('fractalLevel')">
            碎層等級
            <i v-if="sortType=='fractalLevel'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
          </th>
          <th>霧鎖異變</th>
          <th @click="changeSortType('date')">
            日期
            <i v-if="sortType=='date'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
          </th>
          <th @click="changeSortType('duration')">
            戰鬥時間
            <i v-if="sortType=='duration'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
          </th>
          <th @click="changeSortType('character')">
            使用角色
            <i v-if="sortType=='character'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
          </th>
          <th>玩家</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row of dataBySort.slice((page-1)*pageSize,page*pageSize)" :key="row.outputFileName">
          <tr class="align-middle" @click="selectedData=row" :class="{'table-primary':selectedData.order==row.order}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight">
            <td>{{ getName(row.Encounter) }}</td>
            <td>{{ getMode(row) }}</td>
            <td>{{ getResult(row) }}</td>
            <td>{{ getFractalScale(row.LogExtras.FractalExtras) }}</td>
            <td>
              <template v-for="id of getInstabilities(row.LogExtras.FractalExtras)" :key="id">
                <img :title="getInstability(id)" :src="`Images/ArenaNet/fractal_instabilities/${getInstabFileName(id)}_32px.png`">
              </template>
            </td>
            <td>{{ getDate(row.EncounterStartTime) }}</td>
            <td>{{ getDuration(row.EncounterDuration) }}</td>
            <td>{{ row.PointOfView.CharacterName }}</td>
            <td>
              <template v-for="player of row.Players" :key="player.AccountName">
                <img :title="getUsedType(player)" class="p-1" :src="`Images/Tango/${getUsedType(player)}_tango_icon_20px.png`">
              </template>
            </td>
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
    <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h4 class="offcanvas-title fw-bold" id="offcanvasRightLabel">
          {{ getName(selectedData.Encounter) }}
          <br/>
          <h5 v-if="selectedData.EncounterMode!=1" class="fst-italic text-secondary">
            {{ getModeDesc(selectedData.EncounterMode)+getFractalScaleDesc(selectedData.LogExtras) }}
          </h5>
        </h4>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" @click="selectedData={}"></button>
      </div>
      <div class="offcanvas-body">
        <h5 :class="{'text-success': selectedData.EncounterResult==0,'text-danger': selectedData.EncounterResult==1}">
          {{ getDuration(selectedData.EncounterDuration)+" "+getResultDesc(selectedData) }}
        </h5>
        <template v-if="selectedData.LogExtras!=undefined"  v-for="id of getInstabilities(selectedData.LogExtras.FractalExtras)">
          <img class="mx-1" :title="getInstability(id)" :src="`Images/ArenaNet/fractal_instabilities/${getInstabFileName(id)}_32px.png`">
        </template>
        <table class="table fs-6" v-for="group of getPlayerGroup(selectedData.Players)">
          <thead>
            <tr>
              <th colspan="2">小隊 {{ group[0].Subgroup }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player of group">
              <td>
                  <img width="25px" title="指揮官" :class="{invisible: !player.Tag,'d-none': !player.Tag&&player.AccountName==':Cavey.6432'}" class="p-1" src="/Images/ArenaNet/commander_tag_red_32px.png">
                  <img width="25px" title="我在這!" v-if="player.AccountName==':Cavey.6432'" class="p-1" src="/Images/ArenaNet/storyline_32px.png">
                  <img :title="getUsedType(player)" class="p-1" :src="`Images/Tango/${getUsedType(player)}_tango_icon_20px.png`">
                  <span :title="getGuildName(player.GuildGuid)">{{ player.Name }} {{ getGuildTag(player.GuildGuid) }}</span>
                </td>
                <td>{{ player.AccountName.slice(1) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="input-group position-absolute bottom-0 start-50 translate-middle-x px-4 pb-4">
          <button class="btn btn-outline-secondary" type="button" @click="copyLink(selectedData.outputFileName)">
            <i class="bi" :class="{'bi-clipboard': !isCopied,'bi-check-lg':isCopied}"></i>
          </button>
          <input type="text" class="form-control" :value="`${baseURL}/Logs/${selectedData.outputFileName}`" disabled>
          <a class="btn btn-outline-secondary" type="button" :href="`Logs/${selectedData.outputFileName}`" target="_blank">
            <i class="bi bi-box-arrow-up-right"></i>
          </a>
        </div>
      </div>
    </div>
</template>

<style scoped>

.offcanvas{
  --bs-offcanvas-width: 500px;
}

</style>
