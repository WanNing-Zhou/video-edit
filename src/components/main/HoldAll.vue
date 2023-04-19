<template>
  <div class="hold-all">
    <el-scrollbar >
      <add-picture v-show="addPictureVisible"></add-picture>
      <add-subtitle v-show="addSubtitleVisible"></add-subtitle>
      <select-media v-show="selectMediaVisible"></select-media>
    </el-scrollbar>
  </div>

</template>

<script>

import AddPicture from "@/components/main/HoldAll/AddPicture";
import AddSubtitle from "@/components/main/HoldAll/AddSubtitle";
import SelectMedia from "@/components/main/HoldAll/SelectMedia";
export default {
  name: "HoldAll",
  components: {SelectMedia, AddSubtitle, AddPicture},
  data(){
    return {
      addPictureVisible: false,
      addSubtitleVisible:false,
      selectMediaVisible:true,
    }
  },
}
</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 100px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>