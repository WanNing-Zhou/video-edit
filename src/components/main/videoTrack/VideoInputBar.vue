
<template>
  <div class="slider-demo-block" :style="`width:${width}`">
    <el-slider v-model="value" :show-tooltip="false" @input="onSliderChange" />
    <ul class="slide-time">
      <li v-for="(event, index) in events" :key="index">
        <span class="time">
          <span class="icon"></span>
          {{ event.name }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import moment from 'moment'
import { ref, reactive, computed } from 'vue'
const props = defineProps({
  width: {
    type: String,
    default: '60%',
  },
  height: {
    type: Number,
    default: 6,
  },
  startTime: {
    type: String,
    default: '2023-04-16T09:00', //开始时间
  },
  endTime: {
    type: String,
    default: '2023-04-16T18:00',//结束时间
  },
})
const state = reactive({
  events: [],
})
const value = ref(0)
//父组件调用函数
const emits = defineEmits(['onSliderChange'])
const generateTimeline = (start, end) => {
  const events = []
  let i = 1
  let curr = moment(start).hours()
  const endDt = moment(end).hours()
  for (let i = curr; i <= endDt; i++) {
    events.push({ id: i, name: moment().hours(i).format('HH') + ':00' })
  }
  return events
}
const onSliderChange = () => {
  emits('onSliderChange', value1.value)
}
const events = computed(() => {
  return generateTimeline(props.startTime, props.endTime)
})
</script>

<style lang="scss" scoped>
.slider-demo-block {
  padding: 0 20px;
  background: #fff;
  border-radius: 10px;
  :deep(.el-slider__bar) {
    background-color: unset;
  }
  :deep(.el-slider__button) {
    background-image: url('/src/assets/video/Slider.png');
    background-size: 100%;
    border: unset;
    background-color: unset;
  }
  .slide-time {
    display: flex;
    justify-content: space-between;
    line-height: 20px;
    li {
      display: inline-block;
      .time {
        color: gray;
        .icon {
          margin: 0 0 4px 18px;
          display: block;
          width: 2px;
          height: 6px;
          background: gray;
        }
      }
    }
  }
}
</style>