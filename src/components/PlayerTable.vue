<script setup>
import { computed, ref } from 'vue';
import Paginate from 'vuejs-paginate-next';
import DataTableForModal from './DataTableForModal.vue';
import { getUsedType } from '../util';

const props=defineProps(['data', 'apiData']);

const roleCnt=ref(0);

const namefilter=ref("")

const sortType=ref("logsCnt");
const isReverse=ref(true);

const page=ref(1);
const pageSize=16;

const selectedData=ref({});

const dataForModal=ref([]);

const modalDisplay=ref("");

const playerLogsCount=computed(()=>{
  let result={};
  for(let row of props.data)
  {
    for(let player of row.Players)
    {
      let accountName=player.AccountName.slice(1);
      if(!result[accountName])
        result[accountName]={accountName,logs:[],roles:{}};
      if(!result[accountName].roles[player.Name])
        result[accountName].roles[player.Name]=[];
      result[accountName].logs.push(row);
      result[accountName].roles[player.Name].push(row);
    }
  }
  let rawData=Object.values(result);
  let roleSet=new Set();
  result=rawData.filter((row)=>{
    let isOK=false;
    let roles=Object.keys(row.roles);
    if(row.accountName.toLowerCase().includes(namefilter.value.toLowerCase()))
      isOK=true;
    if(!isOK)
    {
      for(let role of roles)
      {
        if(role.toLowerCase().includes(namefilter.value.toLowerCase()))
        {
          isOK=true;
          break;
        }
      }
    }
    if(isOK)
    {
      for(let role of roles)
        roleSet.add(role);
    }
    return isOK;
  })
  roleCnt.value=roleSet.size;
  return result;
})

const sortData=(data)=>{
  return data.sort((a,b)=>{
    let resultA=0;
    let resultB=0;
    if(sortType.value=='account')
    {
      resultA=a.accountName
      resultB=b.accountName
    }
    else // sortType.value=='logsCnt'
    {
      resultA=a.logs.length;
      resultB=b.logs.length;
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
};

const changeSortType=(type)=>{
  if(sortType.value==type)
    isReverse.value=!isReverse.value;
  else
    isReverse.value=false;
  sortType.value=type;
}

const pageCount=computed(()=>{
  let totalRecord=Object.keys(playerLogsCount.value).length
  return parseInt((totalRecord+pageSize-1)/pageSize);
})

const getRole=(roleName)=>{
  return Object.values(selectedData.value.roles[roleName][0].Players).filter((player)=>{
    return player.Name==roleName
  })[0];
}

</script>

<template>
  <div class="input-group mt-3">
    <span class="input-group-text" id="basic-addon1">按角色或帳號名稱篩選</span>
    <input type="text" class="form-control" placeholder="請輸入角色或帳號名稱" aria-label="Username" aria-describedby="basic-addon1" v-model="namefilter">
    <span class="input-group-text" id="basic-addon2">{{ Object.keys(playerLogsCount).length }} 個帳號</span>
    <span class="input-group-text" id="basic-addon2">{{ roleCnt }} 個角色</span>
  </div>
  <div class="row">
    <div class="col">
      <table class="table">
        <thead>
          <tr>
            <th @click="changeSortType('account')">
              帳號名
              <i v-if="sortType=='account'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
            </th>
            <th @click="changeSortType('logsCnt')">
              日誌數
              <i v-if="sortType=='logsCnt'" class="bi" :class="{'bi-chevron-up': !isReverse,'bi-chevron-down': isReverse}"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row of sortData(playerLogsCount).slice((page-1)*pageSize,page*pageSize)">
            <tr @click="selectedData=row" :class="{'table-primary':selectedData.accountName==row.accountName}">
              <td>{{ row.accountName }}</td>
              <td>{{ row.logs.length }}</td>
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
    <div class="col d-flex flex-column">
      <template v-if="selectedData.accountName">
      
        <div class="mt-2 mb-auto">
          <h4 class="fw-bold">{{ selectedData.accountName }}</h4>
          <h6>出現在 {{ selectedData.logs.length }} 個日誌中</h6>
          <table class="table mt-5 align-middle">
            <thead>
              <tr class="text-center">
                <th>角色名</th>
                <th>日誌數</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="logs,role in selectedData.roles">
                <tr>
                  <td>
                    <img :title="getUsedType(getRole(role))" class="ms-4 p-1" :src="`Images/Tango/${getUsedType(getRole(role))}_tango_icon_20px.png`">
                    {{ role }}
                  </td>
                  <td class="text-center">{{ logs.length }}</td>
                  <td class="text-center">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#playerModal" @click="dataForModal=logs; modalDisplay=role+' 角色'">日誌</button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="d-grid">
          <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#playerModal" @click="dataForModal=selectedData.logs; modalDisplay=selectedData.accountName+' 玩家'">
            顯示該玩家的日誌
          </button>
        </div>

        <div class="modal fade" id="playerModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">帶有 {{ modalDisplay }}的日誌</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <DataTableForModal :data="dataForModal" :apiData="props.apiData"/>
              </div>
            </div>
          </div>
        </div>


      </template>
      
    </div>
  </div>
</template>