<template>
  <div class="video-player">
    <div class="player">
<!--      <video-play></video-play>-->
      <div class="video-screen">
        <video class="myVideo video-js"  id="myVideo" ref="myVideo" @timeupdate="videoTimeUpdateHandler" @loadeddata="setCover" :src="videoUrl"  width="520" height="360">
          你的浏览器不能支持HTML5视频
        </video>
        <div class="drawingBoard">
          <div class="dv" ref="dv" :style="`font-family:${subtitleValue.fontFamily}; color:${subtitleValue.color};font-size:${subtitleValue.fontSize}`">{{subtitleValue.inputValue}}</div>
        </div>
<!--        <canvas></canvas>-->
      </div>


      <div class="control-box" v-show="videoUrl!==''&&videoUrl">
        <el-icon class="control-icon" @click="backOff"  title="-5s">
          <DArrowLeft/>
        </el-icon>
        <el-icon class="control-icon" @click="operateVideo" title="播放">
          <VideoPlay/>
        </el-icon>
        <el-icon class="control-icon"  @click="pauseVideo" title="暂停">
          <VideoPause/>
        </el-icon>
        <el-icon class="control-icon" @click="forward" title="+5s">
          <DArrowRight/>
        </el-icon>
      </div>
    </div>

  </div>
</template>

<script>
import {useStore} from 'vuex'
import {computed,nextTick, onMounted, watch,ref,reactive,getCurrentInstance} from "vue";
import {DArrowLeft, VideoPlay, VideoPause, DArrowRight} from '@element-plus/icons-vue'
import {debounce} from "@/utils/debounce";
import videojs from 'video.js/dist/video'
import throttle from '@/utils/throttle'

export default {
  name: "VideoPlayer",
  components: {DArrowLeft, DArrowRight, VideoPlay, VideoPause},
  setup() {

    let player = null;

    onMounted(()=>{
      player = reactive(videojs(getCurrentInstance().proxy.$refs.myVideo))
      // console.log('palyer',player)
      // player.width = 520;
      // player.height = 210;
    })


    const store = useStore();

    const videoUrl = computed(() => {
      //返回的是ref对象
      return store.state.videoUrl;
    })

    const videoCurrentTime = computed(()=>{
      return store.state.video.videoCurrentTime;
    })


    const {proxy} = getCurrentInstance();


    const debounceGetCurrentTime = debounce((newValue)=>{
      // player.currentTime = newValue;
      // console.log(player)
      player.currentTime(newValue)
    },300,false)



    //监听事件变化
    watch(videoCurrentTime,(newValue)=>{
      // document.querySelector('.myVideo').currentTime = newValue;
      // this.$refs.myVideo.currentTime = newValue;
      // console.log('监听到变化了')
      debounceGetCurrentTime(newValue)
    })

    let kk = document.querySelector('.kk');
    const setCover = (event) => {//加载完成事件，调用函数
      if (videoUrl.value !== ''&&videoUrl.value){
        store.dispatch('updateVideoDuration',event.target.duration);
        // console.log(store.state.video.videoDuration)
      }
      const videoEl = event.target;
      let canvas = document.createElement("canvas");//canvas画布
      // console.log(videoEl.videoHeight)
      canvas.width = 100;
      canvas.height = 80;
      canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);//画图
      store.dispatch('updateVideoImgUrl', canvas.toDataURL("image/png"))
    }

    /**
     * 当视频时间发生改变的时候调用
     */
    const videoTimeUpdateThrottle = throttle((event)=>{
      let videoCurrentTime = event.target.currentTime;
      let temp = videoCurrentTime;
      let fragmentLength = store.state.deleteOptions.optionStep;
      let fragArr = store.state.deleteOptions.optionArr;
      console.log(fragArr)
      for(let i = 0; i <  fragmentLength ; i++){
        let videoFrag =  fragArr[i];
        if (videoCurrentTime>=videoFrag[0] && videoCurrentTime <= videoFrag[1]){
          videoCurrentTime = videoFrag[1];
        }
      }
      if(videoCurrentTime>temp){
        player.currentTime(videoCurrentTime)
      }
      // console.log(event.target.currentTime)
      store.dispatch('updateVideoCurrentTime',videoCurrentTime)
      // console.log('currnet已经设置',store.state.video.videoCurrentTime)
    },100,false)

    //监听视频时间变化
    const videoTimeUpdateHandler = (event)=>{
      videoTimeUpdateThrottle(event);
    }

    const subtitleValue = computed(()=>{
         let subtitle = store.state.subtitleValue;
          // console.log(subtitle)
         if(subtitle && subtitle.inputValue !== ''){
           console.log('subtitle',subtitle.inputValue)
           return subtitle;
         }else{
           return false;
         }

    })



    return {
      videoUrl,
      setCover,
      videoTimeUpdateHandler,
      subtitleValue
    }
  },
  methods: {
    operateVideo() {
      // const store = useStore()
      console.log('store',this.$store)
      if (this.$refs.myVideo.paused) {
        this.$refs.myVideo.play();
        this.videoState = true;
      }
    },
    pauseVideo(){
      if (this.$refs.myVideo.played){
        this.$refs.myVideo.pause();
        this.videoState = false;
      }
    },
    backOff(){
      this.$refs.myVideo.currentTime !== 0 ? this.$refs.myVideo.currentTime -= 5 : 1;
    },
    forward(){
      this.$refs.myVideo.currentTime !== this.$refs.myVideo.duration ? this.$refs.myVideo.currentTime += 5 : this.$refs.myVideo.duration;
    }
  },

}
</script>

<style scoped>
.video-player {

}

.player {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.control-box {
  width: 100%;
  font-size: 32px;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.control-box .control-icon {
  cursor: pointer;
  transition: transtorm 1s;
}

.control-box .control-icon:hover{
  transform: scale(0.95);
}

.video-screen{
  position: relative;
  width: 750px;
  height: 470px;
}

.myVideo{
  position: absolute;
  width: 750px;
  height: 470px;
}

.drawingBoard{
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.dv{
  display: inline-block;
  /*width:30px;*/
  /*height:30px;*/
  /*background-color: #0b97c4;*/
  cursor: default;
  user-select: none;
}

.dv:hover{

  border: 2px orange solid;

}



</style>