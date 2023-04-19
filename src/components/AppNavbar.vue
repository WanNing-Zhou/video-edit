<template>
<div class="navbar">
    <el-row class="tac">
      <el-col :span="12">
        <h5 class="mb-2">视频剪辑</h5>
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="2"
            text-color="#fff"
            @open="handleOpen"
            @close="handleClose"
        >
          <el-menu-item index="1">
            <el-icon><icon-menu /></el-icon>
            <span>媒体</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><setting /></el-icon>
            <span>字幕</span>
          </el-menu-item>
          <el-menu-item index="3">
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
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }

    const store = useStore();

    return{
      handleClose,
      handleOpen
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
  border-right: 0px;
}
</style>