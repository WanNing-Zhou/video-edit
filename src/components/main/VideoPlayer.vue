<template>
  <div class="video-player">
    <div class="player">
      <video ref="myVideo" @loadeddata="setCover" :src="videoUrl" id="video_id" width="520" height="360" loop>
        你的浏览器不能支持HTML5视频
      </video>
      <div class="control-box">
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
import {computed, watch} from "vue";
import {DArrowLeft, VideoPlay, VideoPause, DArrowRight} from '@element-plus/icons-vue'


export default {
  name: "VideoPlayer",
  components: {DArrowLeft, DArrowRight, VideoPlay, VideoPause},
  setup() {

    const store = useStore();

    const videoUrl = computed(() => {
      //返回的是ref对象
      return store.state.videoUrl;
    })

    let kk = document.querySelector('.kk');
    const setCover = (event) => {//加载完成事件，调用函数
      const videoEl = event.target;
      let canvas = document.createElement("canvas");//canvas画布
      console.log(videoEl.videoHeight)
      canvas.width = 100;
      canvas.height = 80;
      canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height);//画图
      store.dispatch('updateVideoImgUrl', canvas.toDataURL("image/png"))
    }

    return {
      videoUrl,
      setCover,
    }
  },
  methods: {
    operateVideo() {
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
      this.$refs.myVideo.currentTime !== this.$refs.myVideo.duration ? this.$refs.myVideo.currentTime += 5 : 1;
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

</style>