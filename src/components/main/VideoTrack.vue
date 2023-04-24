<template>
  <div class="video-track">


    <el-scrollbar>
      <div class="util-bar">
        <!-- 这里需存放各种工具     -->
        <el-icon class="util-icon" title="撤销"><RefreshLeft /></el-icon>
        <el-icon class="util-icon" title="分割" @click="sliceFragment"><Scissor /></el-icon>
        <el-icon class="util-icon" title="删除" @click="deleteFragment" ><Delete/></el-icon>
        <el-icon class="util-icon" title="导出" @click="centerDialogVisible = true"><Download /></el-icon>
      </div>
      <div class="cc">
        <!--视频进度条        -->
        <div class="progress" id="progress" :style="`width:${progressWidth}px`"></div>
        <!-- 视频进度条     -->
        <video-input-bar></video-input-bar>
      </div>

    </el-scrollbar>

    <el-dialog
        v-model="centerDialogVisible"
        title="视频所需提交数据"
        width="50%"
        style="max-height: 70%"
        align-center
    >
      <DataSheet></DataSheet>

      <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          Confirm
        </el-button>
      </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {onMounted, computed, watch, ref,reactive,getCurrentInstance} from "vue";
import {useStore} from "vuex";
import {SemiSelect,Delete,RefreshLeft,Download,Scissor} from '@element-plus/icons-vue'
import VideoInputBar from "@/components/main/videoTrack/VideoInputBar";
import videojs from 'video.js/dist/video'
import { ElMessage } from 'element-plus'
import DataSheet from "@/components/main/videoTrack/DataSheet/DataSheet";


export default {
  name: "VideoTrack",
  components: {DataSheet, VideoInputBar,SemiSelect,Delete,RefreshLeft,Download,Scissor},
  // components: {VideoInputBar},
  setup() {
    let timerId = null;
    const progressWidth =ref(0);
    const totalWidth = ref(1000);
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

      let inputBarValue = [store.state.videTrack.inputBarValue['0'],store.state.videTrack.inputBarValue['1']];
      console.log(inputBarValue)
      let temp = 0;
      let left = inputBarValue[0];
      let right = inputBarValue[1];
      if (left > right){
        temp = left;
        left = right;
        right = temp;
      }

      left = left/100.0 * totalTime.value;
      right = right/100.0 * totalTime.value;

      // console.log('删除的片段',[left,right])
      store.dispatch('pushDeleteOptions',[left,right]);

      //在状态中加入删除的历史记录
      ElMessage({
        message: '删除片段成功',
        type: 'success',
      })
    }
    const sliceFragment = ()=>{
      //获取切片得时长
      let inputBarValue = [store.state.videTrack.inputBarValue['0'],store.state.videTrack.inputBarValue['1']];
      let temp = 0;
      let left = inputBarValue[0];
      let right = inputBarValue[1];
      if (left > right){
        temp = left;
        left = right;
        right = temp;
      }

      right = right/100.0 * totalTime.value;

      console.log('right',right)

      store.dispatch('addSliceFragmentArr',right);

      //在状态中加入删除的历史记录
      ElMessage({
        message: '分割片段成功',
        type: 'success',
      })
    }

    //对话框显示
    const centerDialogVisible = ref(false);

    return {
      progressWidth,
      videoCurrentTime,
      totalTime,
      deleteFragment,
      sliceFragment,
      centerDialogVisible
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
  width: 1000px;
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