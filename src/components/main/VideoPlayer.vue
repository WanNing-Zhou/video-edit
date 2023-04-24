<template>
  <div class="video-player">
    <div class="player">
      <!--      <video-play></video-play>-->
      <div class="video-screen">
        <video
            class="myVideo video-js"
            id="myVideo" ref="myVideo"
            @timeupdate="videoTimeUpdateHandler"
            @loadeddata="setCover" :src="videoUrl"
            width="520"
            height="360"
        >
          你的浏览器不能支持HTML5视频
        </video>
        <div class="drawingBoard" ref="drawingBoard" @mouseup="mouseupHandler">
          <div class="dv"
               ref="dv"
               :style="` position:absolute;font-family:${subtitleValue.fontFamily}; color:${subtitleValue.color};font-size:${subtitleValue.fontSize};left:${subtitleValue.left};top:${subtitleValue.top}`"
               @mousedown="mousedownHandler"
               @mousemove="mousemoveHandler"
               @mouseup="mouseupHandler"
          >{{ subtitleValue.inputValue }}
          </div>

            <div v-for=" item in subtitleArr"
                 :style="`position:absolute;font-family:${item.fontFamily}; color:${item.color};font-size:${item.fontSize};left:${item.left};top:${item.top};z-index:1;`"
                 :key="item.position"
            >{{item.inputValue}}</div>

          <img
              class="mg"
              ref="mg"
              :style="`user-select:none;display:inline-block;position:absolute;left:${pictureValue.left};top:${pictureValue.top};z-index:2;width:${pictureValue.size};transform:rotate(${pictureValue.rotate});`"
              :src="pictureValue.url"
              draggable="false"
              oncontextmenu="return false;"
              @mousedown="mousedownImgHandler"
              @mousemove="mousemoveImgHandler"
              @mouseup="mouseupHandler"
          >

          <img
              v-for="item in pictures"
              :src="item.url"
              :style="`user-select:none;display:inline-block;position:absolute;left:${item.left};top:${item.top};z-index:2;width:${item.size};transform:rotate(${item.rotate});`"
              draggable="false"
          >
        </div>
        <!--        <canvas></canvas>-->
      </div>


      <div class="control-box" v-show="videoUrl!==''&&videoUrl">
        <el-icon class="control-icon" @click="backOff" title="-5s">
          <DArrowLeft/>
        </el-icon>
        <el-icon class="control-icon" @click="operateVideo" title="播放">
          <VideoPlay/>
        </el-icon>
        <el-icon class="control-icon" @click="pauseVideo" title="暂停">
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
import {computed, nextTick, onMounted, watch, ref, inject, reactive, getCurrentInstance} from "vue";
import {DArrowLeft, VideoPlay, VideoPause, DArrowRight} from '@element-plus/icons-vue'
import {debounce} from "@/utils/debounce";
import videojs from 'video.js/dist/video'
import throttle from '@/utils/throttle'

export default {
  name: "VideoPlayer",
  components: {DArrowLeft, DArrowRight, VideoPlay, VideoPause},
  setup() {

    let player = null;

    onMounted(() => {
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

    const currentFragIndex = ref(0);

    const videoCurrentTime = computed(() => {
      currentFragIndex.value = store.state.video.currentFragIndex;
      return store.state.video.videoCurrentTime;
    })


    // const {proxy} = getCurrentInstance();


    const debounceGetCurrentTime = debounce((newValue) => {
      // player.currentTime = newValue;
      // console.log(player)
      player.currentTime(newValue)
    }, 300, false)


    //监听事件变化
    watch(videoCurrentTime, (newValue) => {
      // document.querySelector('.myVideo').currentTime = newValue;
      // this.$refs.myVideo.currentTime = newValue;
      // console.log('监听到变化了')
      debounceGetCurrentTime(newValue)
    })

    let kk = document.querySelector('.kk');
    const setCover = (event) => {//加载完成事件，调用函数
      if (videoUrl.value !== '' && videoUrl.value) {
        store.dispatch('updateVideoDuration', event.target.duration);
        store.dispatch('addSliceFragmentArr')
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
    const videoTimeUpdateThrottle = throttle((event) => {
      let videoCurrentTime = event.target.currentTime;
      let temp = videoCurrentTime;
      let fragmentLength = store.state.deleteOptions.optionStep;
      let fragArr = store.state.deleteOptions.optionArr;
      // console.log(fragArr)

      //判断是否使是删除的视频部分
      for (let i = 0; i < fragmentLength; i++) {
        let videoFrag = fragArr[i];
        if (videoCurrentTime >= videoFrag[0] && videoCurrentTime <= videoFrag[1]) {
          videoCurrentTime = videoFrag[1] + 0.01;
        }
      }

      if (videoCurrentTime > temp) {
        player.currentTime(videoCurrentTime)
      }
      // console.log(event.target.currentTime)
      store.dispatch('updateVideoCurrentTime', videoCurrentTime)
      // console.log('currnet已经设置',store.state.video.videoCurrentTime)
    }, 100, false)

    //监听视频时间变化
    const videoTimeUpdateHandler = (event) => {
      videoTimeUpdateThrottle(event);
    }

    // 获取正在输入的字幕
    const subtitleValue = computed(() => {
      let subtitle = store.state.subtitleValue;
      // console.log(subtitle)
      if (subtitle && subtitle.inputValue !== '') {
        // console.log('subtitle', subtitle.inputValue)
        return subtitle;
      } else {
        return false;
      }
    });

    // const settitleArr = reactive({})

    //获取当前片段的字幕数组
    const subtitleArr= computed(()=>{
      const currentFragIndex = store.state.video.currentFragIndex;
      //获取当前视频片段
      const fragment = store.state.sliceFragment.sliceFragmentArr[currentFragIndex];
      if(fragment && fragment.subtitleArr && fragment.subtitleArr.length > 0){
        // console.log(fragment.subtitleArr)
        return fragment.subtitleArr;
      }else{
        return [];
      }
    })

    //获取图片值
    const pictureValue = computed(()=>{
      const picture = store.state.pictureValue;
      // console.log('picture',picture)
      if(picture&&picture.name!==''){
        // console.log('进入啦');
        return picture;
      }else{
        return false;
      }
    })

    // 获取当前片段的贴图数组

    const pictures = computed(()=>{
      // 当前视频片段位置
      const currentFragIndex = store.state.video.currentFragIndex;
      // 获取当前视频片段
      const fragment = store.state.sliceFragment.sliceFragmentArr[currentFragIndex];
      if(fragment && fragment.pictures && fragment.pictures.length > 0){
        return fragment.pictures;
      }else {
        return [];
      }
    })


    return {
      videoUrl,
      setCover,
      videoTimeUpdateHandler,
      subtitleValue,
      subtitleArr,
      pictureValue,
      pictures
    }
  },

  data() {
    //用来存储dv的状态
    return {
      dvStyle: {
        //存储点击时候的x和y坐标
        x: 0,
        l: 0,
        t: 0,
        left : '20px',
        top :  '30px',
        isDown: false,
      },
      //存储mg状态
      mgStyle:{
        x: 0,
        l: 0,
        t: 0,
        left: '20px',
        top:'30px',
        isDown: false,
      }
    }

  },
  methods: {
    operateVideo() {
      // const store = useStore()
      // console.log('store', this.$store)
      if (this.$refs.myVideo.paused) {
        this.$refs.myVideo.play();
        this.videoState = true;
      }
    },
    pauseVideo() {
      if (this.$refs.myVideo.played) {
        this.$refs.myVideo.pause();
        this.videoState = false;
      }
    },
    //视频回退
    backOff() {
      this.$refs.myVideo.currentTime !== 0 ? this.$refs.myVideo.currentTime -= 5 : 1;
    },
    forward() {
      this.$refs.myVideo.currentTime !== this.$refs.myVideo.duration ? this.$refs.myVideo.currentTime += 5 : this.$refs.myVideo.duration;
    },


    mousedownHandler(event) {
      // console.log()

      const dv = this.$refs.dv;
      //获取x坐标
      this.dvStyle.x = event.clientX;
      this.dvStyle.y = event.clientY;

      // console.log(dv)
      //获取左部和顶部的偏移量
      this.dvStyle.l = dv.offsetLeft;
      this.dvStyle.t = dv.offsetTop;

      //打开开关
      this.dvStyle.isDown = true;

      //设置样式
      dv.style.cursor = 'move'
    },

    //鼠标移动事件
    mousemoveHandler(event) {
      if (!this.dvStyle.isDown) {
        return;
      }
      const dv = this.$refs.dv;

      //获取x和y
      let nx = event.clientX;
      let ny = event.clientY;
      // console.log('nx,ny', nx, ny)
      //计算移动后 左偏移量和顶部偏移量;
      let nl = nx - (this.dvStyle.x - this.dvStyle.l);
      let nt = ny - (this.dvStyle.y - this.dvStyle.t);
      const drawingBoard = this.$refs.drawingBoard;

      //控制左右范围
      let left = '0px';
      if (nl < 0) {
        left = '0px';
      } else if (nl > drawingBoard.clientWidth - dv.clientWidth) {
        left = drawingBoard.clientWidth - dv.clientWidth + 'px';
      } else {
        left = nl + 'px'
      }
      this.dvStyle.left = left;
      let top = '0px';
      if (nt < 0) {
        top = '0px';
      } else if (nt > drawingBoard.clientHeight - dv.clientHeight) {
        top = drawingBoard.clientHeight - dv.clientHeight + 'px';
      } else {
        top = nt + 'px';
      }
      this.$store.dispatch('setSubtitlePosition',{top,left})
      this.dvStyle.top = top;
      // console.log(this.$store.state.subtitleValue);

    },

    //鼠标抬起事件
    mouseupHandler() {
      //开关关闭
      const dv = this.$refs.dv;
      const mg = this.$refs.mg;
      this.dvStyle.isDown = false;
      this.mgStyle.isDown = false;
      dv.style.cursor = 'default';
      mg.style.cursor = 'default';
    },
    //鼠标按下
    mousedownImgHandler(event){
      const mg = this.$refs.mg;
      //获取x坐标
      this.mgStyle.x = event.clientX;
      this.mgStyle.y = event.clientY;

      // console.log(dv)
      //获取左部和顶部的偏移量
      this.mgStyle.l = mg.offsetLeft;
      this.mgStyle.t = mg.offsetTop;

      //打开开关
      this.mgStyle.isDown = true;

      //设置样式
      mg.style.cursor = 'move'
    },

    //图片移动
    mousemoveImgHandler(event){
      if (!this.mgStyle.isDown) {
        return;
      }
      const mg = this.$refs.mg;

      //获取x和y
      let nx = event.clientX;
      let ny = event.clientY;
      // console.log('nx,ny', nx, ny)
      //计算移动后 左偏移量和顶部偏移量;
      let nl = nx - (this.mgStyle.x - this.mgStyle.l);
      let nt = ny - (this.mgStyle.y - this.mgStyle.t);
      const drawingBoard = this.$refs.drawingBoard;

      //控制左右范围
      let left = '0px';
      if (nl < 0) {
        left = '0px';
      } else if (nl > drawingBoard.clientWidth - mg.clientWidth) {
        left = drawingBoard.clientWidth - mg.clientWidth + 'px';
      } else {
        left = nl + 'px'
      }
      this.mgStyle.left = left;
      let top = '0px';
      if (nt < 0) {
        top = '0px';
      } else if (nt > drawingBoard.clientHeight - mg.clientHeight) {
        top = drawingBoard.clientHeight - mg.clientHeight + 'px';
      } else {
        top = nt + 'px';
      }
      this.$store.dispatch('setPicturePosition',{top,left})
      this.mgStyle.top = top;
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

.control-box .control-icon:hover {
  transform: scale(0.95);
}

.video-screen {
  position: relative;
  width: 750px;
  height: 470px;
}

.myVideo {
  position: absolute;
  width: 750px;
  height: 470px;
}

.drawingBoard {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: hidden;
}

.dv {
  display: inline-block;
  position: absolute;
  /*width:30px;*/
  /*height:30px;*/
  /*background-color: #0b97c4;*/
  cursor: default;
  user-select: none;
}

.mg {
  display: inline-block;
  /*position: absolute;*/
  /*width:30px;*/
  /*height:30px;*/
  background-color: #0b97c4;
  cursor: default;
  user-select: none;
}

.dv:hover {

  border: 2px orange solid;

}

img{
  /*-moz-user-select: -moz-none;*/
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
  user-select: none;
}

</style>