<template>
<div class="navbar">
    <el-row class="tac" >
      <el-col :span="12">
        <h3 class="mb-2">视频剪辑</h3>
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="1"
            text-color="#fff"
            @close="handleClose"
        >
          <el-menu-item index="1" ref="refMenuItem1" @click="changePage('updateSelectMediaVisible')">
            <el-icon><icon-menu /></el-icon>
            <span>媒体</span>
          </el-menu-item>
          <el-menu-item index="2" ref="refMenuItem2" @click="changePage('updateAddSubtitleVisible')">
            <el-icon><setting /></el-icon>
            <span>字幕</span>
          </el-menu-item>
          <el-menu-item index="3" ref="refMenuItem3" @click="changePage('updateAddPictureVisible')">
            <el-icon><setting /></el-icon>
            <span>贴图</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
</div>
</template>

<script>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,} from '@element-plus/icons-vue'

import { useStore } from 'vuex'

export default {
  name: "AppNavbar",
  components:  {
    Document,
    IconMenu,
    Location,
    Setting,},
  setup(){

    const store = useStore();
    const changePage = (mutation)=>{
      store.dispatch(mutation,true); // 更改页面可见性
      // console.log(store.state.IsVisible)
    }

    return{
      changePage,

    }
  }
}


</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu{
  border-right: 0;
  background-color: #29333a;
}

.navbar{
  color:#e1ffff
}


</style>