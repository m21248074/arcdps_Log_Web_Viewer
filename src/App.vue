<script setup>
import { ref } from 'vue';

import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import DataTable from './components/DataTable.vue';
import PlayerTable from './components/PlayerTable.vue';
import GuildTable from './components/GuildTable.vue';
import StatisticsTable from './components/StatisticsTable.vue';

const data=ref([]);

const apiData=ref({});

const handleChangedData=(changedData)=>{
  data.value=changedData;
}

const getApiData=async ()=>{
  const response=await fetch("ApiData.json");
  const json=await response.json();
  json["00000000-0000-0000-0000-000000000000"]={Name: "沒有公會", Tag: ""}
  apiData.value=json;
}

getApiData();

</script>

<template>
  <Navbar />
  <div class="container-fluid">
    <div class="row">
      <Sidebar @changeFilter="handleChangedData" />
      <div class="col-9">
        <nav>
          <div class="nav nav-tabs mt-1" id="nav-tab" role="tablist">
            <button class="nav-link active" id="nav-logs-tab" data-bs-toggle="tab" data-bs-target="#nav-logs" type="button" role="tab" aria-controls="nav-logs" aria-selected="true">日誌</button>
            <button class="nav-link" id="nav-player-tab" data-bs-toggle="tab" data-bs-target="#nav-player" type="button" role="tab" aria-controls="nav-player" aria-selected="false">玩家</button>
            <button class="nav-link" id="nav-guild-tab" data-bs-toggle="tab" data-bs-target="#nav-guild" type="button" role="tab" aria-controls="nav-guild" aria-selected="false">公會</button>
            <button class="nav-link" id="nav-statistics-tab" data-bs-toggle="tab" data-bs-target="#nav-statistics" type="button" role="tab" aria-controls="nav-statistics" aria-selected="false">統計數據</button>
          </div>
        </nav>
        <div class="tab-content">
          <div class="tab-pane fade show active" id="nav-logs" role="tabpanel" aria-labelledby="nav-logs-tab" tabindex="0">
            <DataTable :data="data" :apiData="apiData" />
          </div>
          <div class="tab-pane fade" id="nav-player" role="tabpanel" aria-labelledby="nav-player-tab" tabindex="0">
            <PlayerTable :data="data" :apiData="apiData" />
          </div>
          <div class="tab-pane fade" id="nav-guild" role="tabpanel" aria-labelledby="nav-guild-tab" tabindex="0">
            <GuildTable :data="data" :apiData="apiData"/>
          </div>
          <div class="tab-pane fade" id="nav-statistics" role="tabpanel" aria-labelledby="nav-statistics-tab" tabindex="0">
            <StatisticsTable :data="data"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
