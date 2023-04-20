<template>
  <div class="selected-media">
    <h2>选择媒体</h2>

    <input type="file" id="file" @change="handleFileSelect">
    <br>
<!--    <img class="kk" :src="videoImgUrl" alt="视频缩略图">-->
    <video width="200" height="150" :src="videoUrl" loop></video>
  </div>
</template>
<script>

import {ref,computed,watch} from 'vue';
import { useStore } from 'vuex'

import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { UploadFile } from 'element-plus'

export default {
  name: "AppNavbar",
  components:{ Delete,Download,Plus,ZoomIn},
  setup(){
    const store = useStore();
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const disabled = ref(false)
    const videoUrl = ref('')

    const handleRemove = (file) => {
      console.log(file)
    }

    const handlePictureCardPreview = (file) => {
      dialogImageUrl.value = file.url
          dialogVisible.value = true
    }

    const videoImgUrl = computed(()=>{
      console.log(store.state.videoImgUrl)
      //返回的是ref对象
      return store.state.videoImgUrl;
    })




    const setVideoPoster = (event) => {
      let video = event.target;
      // video.height = video.clientHeight;
      let canvas = document.createElement("canvas"); // 创建 canvas
      const ctx = canvas.getContext("2d");
      video.currentTime = 1; // 第一帧
      video.oncanplay = () => {
        canvas.width = video.clientWidth; // 获取视频宽度
        canvas.height = video.clientHeight; //获取视频高度
        let img = new Image(); // 这里使用img是为了解决视频跨域 canvas.toDataURL会提示错误的问题
        img.onload = function () {
          // canvas绘图
          ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
          // 转换成base64形式并设置封面
          video.poster = canvas.toDataURL("image/jpeg", 1); // 截取后的视频封面
        }
      }
    }


    const handleFileSelect = () => {
      // console.log(hello)
      const file = document.getElementById('file').files[0];
      console.log(file)
      if(file){
        const url = URL.createObjectURL(file);
        videoUrl.value = url;
        store.dispatch('updateVideoUrl',url);
        console.log(url);
      }
      // document.getElementById("video_id").src = url;
    }


    return{
      handleFileSelect,
      videoImgUrl,
      videoUrl,
    }
  }
}


</script>

<style scoped>

</style>