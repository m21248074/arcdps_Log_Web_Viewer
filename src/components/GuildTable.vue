<script setup>
import { ref, computed } from 'vue';
import Paginate from 'vuejs-paginate-next';
import DataTableForModal from './DataTableForModal.vue';
import { getUsedType} from '../util';

const props=defineProps(['data','apiData']);

const namefilter=ref("");

const sortType=ref("name");
const isReverse=ref(false);

const page=ref(1);
const pageSize=16;

const accountPage=ref(1);
const rolePage=ref(1);
const sidePageSize=12;

const selectedData=ref({});

const accountSortType=ref("account");
const accountIsReverse=ref(false);

const roleSortType=ref("role");
const roleIsReverse=ref(false);

const tableHead={
  "標籤": "tag",
  "名稱": "name",
  "日誌": "logCnt",
  "玩家數": "playerCnt",
  "角色數": "roleCnt"
};

const accountTableHead={
  "日誌數": "logCnt",
  "帳號": "account",
  "角色數": "roleCnt"
};

const roleTableHead={
  "日誌數": "logCnt",
  "角色": "role",
  "帳號": "account"
};

const getRoleCnt=(players)=>{
  let result=0;
  for(let player of Object.values(players))
    result+=Object.keys(player.roles).length;
  return result;
}

const GuildData=computed(()=>{
  let result={};
  for(let row of props.data)
  {
    let guildSet=new Set();
    for(let player of row.Players)
    {
      let AccountName=player.AccountName.slice(1);
      let Name=player.Name;
      let Profession=player.Profession;
      let EliteSpecialization=player.EliteSpecialization;


      guildSet.add(player.GuildGuid);
      if(!Object.hasOwn(result,player.GuildGuid))
        result[player.GuildGuid]={id: player.GuildGuid,logs: [],players: {}};
      if(!Object.hasOwn(result[player.GuildGuid].players,AccountName))
        result[player.GuildGuid].players[AccountName]={cnt: 0,roles: {},AccountName};
      result[player.GuildGuid].players[AccountName].cnt++;
      if(!Object.hasOwn(result[player.GuildGuid].players[AccountName].roles,Name))
        result[player.GuildGuid].players[AccountName].roles[Name]={cnt: 0, AccountName, Name, Profession, EliteSpecialization};
      result[player.GuildGuid].players[AccountName].roles[Name].cnt++;
    }
    for(let guild of [...guildSet])
      result[guild].logs.push(row)
  }
  result=Object.values(result);
  result=result.filter((guild)=>{
    let filter=namefilter.value.toLowerCase();
    let guildName=props.apiData[guild.id].Name.toLowerCase();
    let guildTag=props.apiData[guild.id].Tag.toLowerCase();
    if(guildName.includes(filter)||guildTag.includes(filter))
      return true;
    for(let account in guild.players)
    {
      if(account.toLowerCase().includes(filter))
        return true;
      for(let role of Object.keys(guild.players[account].roles))
      {
        if(role.toLowerCase().includes(filter))
          return true;
      }
    }
    return false;
  })
  result.sort((a,b)=>{
    let resultA=0;
    let resultB=0;
    if(sortType.value=='tag')
    {
      resultA=props.apiData[a.id].Tag;
      resultB=props.apiData[b.id].Tag;
    }
    else if(sortType.value=='name')
    {
      resultA=props.apiData[a.id].Name;
      resultB=props.apiData[b.id].Name;
    }
    else if(sortType.value=='logCnt')
    {
      resultA=a.logs.length;
      resultB=b.logs.length;
    }
    else if(sortType.value=='playerCnt')
    {
      resultA=Object.keys(a.players).length;
      resultB=Object.keys(b.players).length;
    }
    else if(sortType.value=='roleCnt')
    {
      resultA=getRoleCnt(a.players);
      resultB=getRoleCnt(b.players);
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
  return result;
})

const changeSortType=(type)=>{
  if(sortType.value==type)
    isReverse.value=!isReverse.value;
  else
    isReverse.value=false;
  sortType.value=type;
}

const changeAccountSortType=(type)=>{
  if(accountSortType.value==type)
    accountIsReverse.value=!accountIsReverse.value;
  else
    accountIsReverse.value=false;
  accountSortType.value=type;
}

const changeRoleSortType=(type)=>{
  if(roleSortType.value==type)
    roleIsReverse.value=!roleIsReverse.value;
  else
    roleIsReverse.value=false;
  roleSortType.value=type;
}

const pageCount=computed(()=>{
  let totalRecord=GuildData.value.length
  return parseInt((totalRecord+pageSize-1)/pageSize);
})

const accountPageCount=computed(()=>{
  let totalRecord=sortAccountData(selectedData.value.players).length;
  return parseInt((totalRecord+sidePageSize-1)/sidePageSize);
})

const rolePageCount=computed(()=>{
  let totalRecord=sortRoleData(selectedData.value.players).length;
  return parseInt((totalRecord+sidePageSize-1)/sidePageSize);
})

const sortAccountData=(players)=>{
  let result=Object.values(players);
  result=result.sort((a,b)=>{
    let resultA=0;
    let resultB=0;
    if(accountSortType.value=='logCnt')
    {
      resultA=a.cnt;
      resultB=b.cnt;
    }
    else if(accountSortType.value=='account')
    {
      resultA=a.AccountName;
      resultB=b.AccountName;
    }
    else if(accountSortType.value=='roleCnt')
    {
      resultA=Object.keys(a.roles).length;
      resultB=Object.keys(b.roles).length;
    }
    if(accountIsReverse.value)
    {
      if(resultA>resultB) return -1;
      else if(resultA<resultB) return 1;
    }
    if(resultA<resultB) return -1;
    else if(resultA>resultB) return 1;
    return 0;
  })
  return result;
}

const sortRoleData=(players)=>{
  let temp=Object.values(players);
  let result=[];
  for(let account of temp)
    result.push(...Object.values(account.roles));
  result=result.sort((a,b)=>{
    let resultA=0;
    let resultB=0;
    if(roleSortType.value=='logCnt')
    {
      resultA=a.cnt;
      resultB=b.cnt;
    }
    else if(roleSortType.value=='role')
    {
      resultA=a.Name;
      resultB=b.Name;
    }
    else if(roleSortType.value=='account')
    {
      resultA=a.AccountName;
      resultB=b.AccountName;
    }
    if(roleIsReverse.value)
    {
      if(resultA>resultB) return -1;
      else if(resultA<resultB) return 1;
    }
    if(resultA<resultB) return -1;
    else if(resultA>resultB) return 1;
    return 0;
  })
  return result;
}

</script>

<template>
  <div class="input-group mt-3">
    <span class="input-group-text" id="basic-addon1">按公會或成員名稱篩選</span>
    <input type="text" class="form-control" placeholder="請輸入公會或成員名稱" aria-label="Username" aria-describedby="basic-addon1" v-model="namefilter">
    <span class="input-group-text" id="basic-addon2">{{ GuildData.length }} 個公會</span>
  </div>
  <div class="row">
    <div class="col">
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
          <template v-for="guild of GuildData.slice((page-1)*pageSize,page*pageSize)">
            <tr @click="selectedData=guild" :class="{'table-primary':selectedData.id==guild.id}">
              <td>{{ props.apiData[guild.id].Tag }}</td>
              <td>{{ props.apiData[guild.id].Name }}</td>
              <td>{{ guild.logs.length }}</td>
              <td>{{ Object.keys(guild.players).length }}</td>
              <td>{{ getRoleCnt(guild.players) }}</td>
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
      <template v-if="selectedData.id">
        <div class="mt-2">
          <h4 class="fw-bold">{{ props.apiData[selectedData.id].Name }} [{{ props.apiData[selectedData.id].Tag }}]</h4>
          <h6>{{ Object.keys(selectedData.players).length }} 個成員，{{ getRoleCnt(selectedData.players) }} 個角色</h6>
          <nav class="mt-3">
            <div class="nav nav-tabs mt-1" id="nav-tab" role="tablist">
              <button class="nav-link active" id="nav-account-tab" data-bs-toggle="tab" data-bs-target="#nav-account" type="button" role="tab" aria-controls="nav-account" aria-selected="true">帳號</button>
              <button class="nav-link" id="nav-role-tab" data-bs-toggle="tab" data-bs-target="#nav-role" type="button" role="tab" aria-controls="nav-role" aria-selected="false">角色</button>
            </div>
          </nav>
          <div class="tab-content">
            <div class="tab-pane fade show active" id="nav-account" role="tabpanel" aria-labelledby="nav-account-tab" tabindex="0">
              <table class="table">
                <thead>
                  <tr>
                    <template v-for="index,display in accountTableHead">
                      <th @click="changeAccountSortType(index)">
                        {{ display }}
                        <i v-if="accountSortType==index" class="bi" :class="{'bi-chevron-up': !accountIsReverse, 'bi-chevron-down': accountIsReverse}"></i>
                      </th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="account of sortAccountData(selectedData.players).slice((accountPage-1)*sidePageSize,accountPage*sidePageSize)">
                    <tr>
                      <td>{{ account.cnt  }}</td>
                      <td>{{ account.AccountName }}</td>
                      <td>{{ Object.keys(account.roles).length }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <Paginate class="justify-content-center"
                v-model="accountPage"
                :page-count="accountPageCount"
                :prev-text="'<i class=\'bi bi-chevron-left\'></i>'"
                :next-text="'<i class=\'bi bi-chevron-right\'></i>'"
                :first-last-button="true"
                :first-button-text="'<i class=\'bi bi-chevron-double-left\'></i>'"
                :last-button-text="'<i class=\'bi bi-chevron-double-right\'></i>'"
                >
              </Paginate>
            </div>
            <div class="tab-pane fade" id="nav-role" role="tabpanel" aria-labelledby="nav-role-tab" tabindex="0">
              <table class="table">
                <thead>
                  <tr>
                    <template v-for="index,display in roleTableHead">
                      <th @click="changeRoleSortType(index)">
                        {{ display }}
                        <i v-if="roleSortType==index" class="bi" :class="{'bi-chevron-up': !roleIsReverse, 'bi-chevron-down': roleIsReverse}"></i>
                      </th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="role of sortRoleData(selectedData.players).slice((rolePage-1)*sidePageSize,rolePage*sidePageSize)">
                    <tr>
                      <td>{{ role.cnt }}</td>
                      <td>
                        <img :title="getUsedType(role)" class="p-1" :src="`Images/Tango/${getUsedType(role)}_tango_icon_20px.png`">
                        {{ role.Name }}</td>
                      <td>{{ role.AccountName }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
              <Paginate class="justify-content-center"
                v-model="rolePage"
                :page-count="rolePageCount"
                :prev-text="'<i class=\'bi bi-chevron-left\'></i>'"
                :next-text="'<i class=\'bi bi-chevron-right\'></i>'"
                :first-last-button="true"
                :first-button-text="'<i class=\'bi bi-chevron-double-left\'></i>'"
                :last-button-text="'<i class=\'bi bi-chevron-double-right\'></i>'"
                >
              </Paginate>
            </div>
          </div>
        </div>

        <div class="d-grid mt-auto">
          <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
            顯示該公會的日誌
          </button>
        </div>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">帶有公會 {{ props.apiData[selectedData.id].Name }} 成員的日誌</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <DataTableForModal :data="selectedData.logs" :apiData="props.apiData" />
              </div>
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>