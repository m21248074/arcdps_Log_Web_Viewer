<script setup>
import { ref } from 'vue';

const license=ref("");

async function getLicense() {
  const response=await fetch("https://raw.githubusercontent.com/m21248074/arcdps_Log_Web_Viewer/main/LICENSE");
  const text=await response.text();
  license.value=text.replace(/\n/g, "<br />");
}
getLicense();
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="/program_icon.ico" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
        arcdps 日誌瀏覽器
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" data-bs-toggle="collapse" href="#sidebar" role="button" aria-expanded="true" aria-controls="sidebar">篩選器</a>
          </li>
          <li class="nav-item">
            <button class="nav-link" type="button" data-bs-toggle="modal" data-bs-target="#About">關於</button>

            <div class="modal fade text-light" id="About" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">關於</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    
                    <nav>
                      <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">關於</button>
                        <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">製作人員</button>
                        <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">授權</button>
                      </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                      <div class="tab-pane fade show active p-5" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                        <div class="d-flex align-items-center justify-content-center">
                          <img src="/program_icon.ico" class="rounded float-start me-4" alt="...">
                          <div class="card border border-0" style="width: 18rem;">
                            <div class="card-body">
                              <h5 class="card-title">arcdps 日誌瀏覽器</h5>
                              <h6 class="card-subtitle mb-2 text-body-secondary">v1.0.0</h6>
                              <p class="card-text">由 arcdps (激戰2 插件) 產生的 EVTC 日誌瀏覽器</p>
                              <a href="https://github.com/m21248074/arcdps_Log_Web_Viewer" class="card-link">Github 頁面</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="tab-pane fade p-3" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                        開發人員: <a class="text-decoration-none" href="https://github.com/m21248074">Cavey</a>
                      </div>
                      <div class="tab-pane fade p-3" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0" v-html="license"></div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
