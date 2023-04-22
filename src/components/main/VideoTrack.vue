<template>
  <div class="video-track">


    <el-scrollbar>
      <div class="util-bar">
        <!-- 这里需存放各种工具     -->
        <el-icon class="util-icon" title="撤销"><RefreshLeft /></el-icon>
        <el-icon class="util-icon" title="分割"><SemiSelect /></el-icon>
        <el-icon class="util-icon" title="删除" @click="deleteFragment" ><Delete/></el-icon>
      </div>
      <div class="cc">
        <!--视频进度条        -->
        <div class="progress" id="progress" :style="`width:${progressWidth}px`"></div>

        <!-- 视频进度条     -->
        <video-input-bar></video-input-bar>
      </div>

    </el-scrollbar>
  </div>
</template>

<script>
import {onMounted, computed, watch, ref,reactive,getCurrentInstance} from "vue";
import {useStore} from "vuex";
import {SemiSelect,Delete,RefreshLeft} from '@element-plus/icons-vue'
import VideoInputBar from "@/components/main/videoTrack/VideoInputBar";
import videojs from 'video.js/dist/video'


export default {
  name: "VideoTrack",
  components: {VideoInputBar,SemiSelect,Delete,RefreshLeft},
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

      // console.log('totalTime',totalTime.value)
      // console.log('这是长度',totalWidth.value*curTime/totalTime.value)
      if(totalTime.value!==0 && totalTime.value){
        // console.log(totalWidth.value)
        progressWidth.value =  totalWidth.value * curTime / totalTime.value; //公式
      }
      // console.log('这是长度',progressWidth.value)

    }, {immediate:true,deep:true})
    // onMounted(progressSupport)

    //删除片段，从而达到剪辑效果
    const deleteFragment= ()=>{
      //在状态中加入删除的历史记录

    }

    return {
      progressWidth,
      videoCurrentTime,
      totalTime,
      deleteFragment,
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
.util-bar{
  position: absolute;
  top: 5%;
  width: 600px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color:black;
  font-size:20px;
}

.util-bar .util-icon{
  cursor: pointer;
}

.util-bar .util-icon:hover{
  transform: scale(0.96);
}

.cc{
   position: absolute;
    top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}

</style>