<template>
  <div class="video-track">
    <div class="util-bar">
      <!-- 这里需存放各种工具     -->
    </div>
    <el-scrollbar>
      <div class="cc">
        <div class="progress" id="progress" :style="`width:${progressWidth}px`"></div>
      </div>
      <CropTool :duration="totalTime"

                :currentPlayingTime="videoCurrentTime"
                />
<!--      <video-input-bar></video-input-bar>-->
    </el-scrollbar>
  </div>
</template>

<script>
import {onMounted, computed, watch, ref} from "vue";
import {useStore} from "vuex";
import CropTool from "@/components/main/videoTrack/CropTool/CropTool";

export default {
  name: "VideoTrack",
  // components: {VideoInputBar},
  setup() {
    let timerId = null;
    const progressWidth =ref(0);
    const totalWidth = ref(500);
    const store = useStore();

    const totalTime = computed(()=>{
      // console.log('状态发生了变化')
      return store.state.video.videoDuration;
    })
    const videoCurrentTime = computed(()=>{
      // console.log('时间发生了变化')
       return store.state.video.videoCurrentTime;
    })




    watch(videoCurrentTime,()=> {
      //通过dir获取
      //视频当前时间
      let curTime = videoCurrentTime.value; //通过dir获取
      //页面总宽度

      console.log('totalTime',totalTime.value)
      // console.log('这是长度',totalWidth.value*curTime/totalTime.value)
      if(totalTime.value!==0 && totalTime.value){
        console.log(totalWidth.value)
        progressWidth.value =  totalWidth.value * curTime / totalTime.value; //公式
      }
      console.log('这是长度',progressWidth.value)

    }, {immediate:true,deep:true})
    // onMounted(progressSupport)



    return {
      progressWidth,
      videoCurrentTime,
      totalTime,
    }
  }
}
</script>

<style scoped>
.video-track {
  overflow: auto;
}

.progress {
  height: 4px;
  left: 0;
  width: 0;
  z-index: 1;
  background-color: #f77;
}
.cc{
  height: 4px;
  width: 500px;
  background-color: #0AAEB3;
}
</style>