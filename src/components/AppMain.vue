<template>
<div class="main">
  <hold-all></hold-all>
  <video-track></video-track>
  <video-player></video-player>
</div>
</template>

<script>
import HoldAll from "@/components/main/HoldAll";
import VideoTrack from "@/components/main/VideoTrack";
import VideoPlayer from "@/components/main/VideoPlayer";
export default {
  name: "AppMain",
  components:{VideoPlayer, VideoTrack, HoldAll},
}
</script>

<style scoped>

.hold-all{
  position: absolute;
  left: 0;
  top: 0;
  bottom: 210px;
  width: 350px;
  background-color: antiquewhite;
}

.video-track{
  position:absolute ;
  width: 100%;
  height: 210px;
  bottom: 0;
  background-color: beige;
}

.video-player{
  position: absolute;
  left: 350px;
  right: 0;
  top:0;
  bottom: 210px;
  background-color: #545c64;
}




</style>