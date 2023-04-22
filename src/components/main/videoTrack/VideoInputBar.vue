<template>
  <span>{{videoCurrentTime.toFixed(2)}} s / {{totalTime}}s</span>
  <div class="slider-demo-block">
    <el-slider v-model="value" range @change="valueChange" :marks="marks"/>
  </div>
</template>

<script >
import { reactive, ref ,computed,watch} from 'vue'
import {useStore} from 'vuex'
import {debounce} from "@/utils/debounce";
export default {
  name:'VideoInputBar',
  setup(){
    const store = useStore();
    const value = ref([0, 0])
    // const oldValue = ref([0,0])

    const marks = computed(()=>{
      return store.state.videTrack.videoInputBarMarks;
    })

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
      if(totalTime.value!==0 && totalTime.value){
        value.value[1] = (curTime / totalTime.value)  * 100; //公式
      }

    }, {immediate:true,deep:true})

    //监听视频导轨的数据
/*    watch(value ,(newValue,oldValue)=> {
      if(store.state.videoUrl!=='' && store.state.videoUrl){
        let time = 0;
        if (newValue['1'] !== oldValue['1']){
          time = newValue['1'] * totalTime.value/100;
          store.dispatch('updateVideoCurrentTime',time)
          console.log('设置时间',time)
        }
        if(newValue['0'] !== oldValue['0']){
          time = newValue['0'] * totalTime.value/100;
          store.dispatch('updateVideoCurrentTime',time)
        }
      }
    }, {immediate:true,deep:true})*/

    /*为事件防抖*/
    const debounceValueChange = debounce((value)=>{
      if(store.state.videoUrl !== '' && store.state.videoUrl){
        // console.log('防抖执行了')
        let time =value[1]  *totalTime.value /100;
        store.dispatch('updateVideoCurrentTime',time)
        store.dispatch('updateInputBarValue',value);
      }
    },200,true)

     const valueChange = ()=>{
       debounceValueChange(value.value)
     }

    return {
      marks,
      value,
      totalTime,
      videoCurrentTime,
      valueChange
    }
  }
}

</script>
<style scoped>
.slider-demo-block {
  display: flex;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;

}

</style>
