<template>
  <div>
    <video ref="myVideo" class="video-js" src="public/video/mixkit-stars-in-space-background-1610-large.mp4" width="200" height="200"></video>
  </div>
</template>

<script>
import videojs from 'video.js/dist/video.min';
import 'video.js/dist/video-js.css';
import {useStore} from 'vuex'

export default {
  data() {
    return {
      videoPlayer: null
    };
  },
  mounted() {
    const options = {
      controls: true,
      fluid: true,
      height: '500px',
      width: '100%'
    };

    this.videoPlayer = videojs(this.$refs.myVideo, options, function onPlayerReady() {
      this.rangeslider({
        step: 0.1,
        vertical: false
      });
    });
  },
  methods: {
    cutVideo(start, end) {
      this.videoPlayer.cut(start, end, function (result) {
        console.log('Cut result: ', result);
      });
    }
  },
  created() {
    // 监听trim:start事件
    this.videoPlayer.on('trim:start', (event, data) => {
      console.log('Start time: ' + data.start);
    });

    // 监听trim:end事件
    this.videoPlayer.on('trim:end', (event, data) => {
      console.log('End time: ' + data.end);

      this.cutVideo(data.start, data.end);
    });
  },
  beforeDestroy() {
    if (this.videoPlayer != null) {
      this.videoPlayer.dispose();
    }
  }
};
</script>