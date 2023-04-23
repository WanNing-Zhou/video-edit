<template>
  <div class="add-subtitle">
    <h3>添加字幕</h3>

    <div>
      <span>字体大小</span>
      <el-input-number v-model="fontSizeValue" :min="8" :max="46" @change="subtitleInput"/>
    </div>

    <div>
      <el-select v-model="fontFamilyValue" @change="subtitleInput" :style="`font-family:${fontFamilyValue}`" class="m-2" placeholder="选择字体">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :style="`font-family:${item.value}`"
        />
      </el-select>
    </div>

    <div>
      <span>字体颜色</span>
      <el-color-picker v-model="colorValue" @change="subtitleInput" lable="选择颜色" show-alpha :predefine="predefineColors"/>
    </div>

    <div>
      <span>字幕</span>
      <el-input
          v-model="textValue"
          maxlength="30"
          placeholder="在这里输入字幕"
          show-word-limit
          :rows="2"
          type="textarea"
          :style="`font-family:${fontFamilyValue};`"
          @input="subtitleInput"
      />
    </div>
    <div>
      <el-button
          type="primary"
          bg
          @click="addSubtitleHandler"
      >添加字幕
      </el-button>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import {useStore} from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: "AddSubtitle",
  setup() {
    //字体颜色
    const colorValue = ref('rgba(255, 69, 0, 0.68)')
    const predefineColors = ref([
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff',
      '#c71585',
      'rgba(255, 69, 0, 0.68)',
      'rgb(255, 120, 0)',
      'hsv(51, 100, 98)',
      'hsva(120, 40, 94, 0.5)',
      'hsl(181, 100%, 37%)',
      'hsla(209, 100%, 56%, 0.73)',
      '#c7158577',
    ])

  const store = useStore();

    // const handleChange = (value) => {
    //   console.log(value)
    // }


    const fontFamilyValue = ref('')

    const options = [
      {
        value: '"SimSun"',
        label: '宋体',
      },
      {
        value: '"SimHei"',
        label: '黑体',
      },
      {
        value: '"Microsoft Yahei"',
        label: '微软雅黑',
      },
      {
        value: '"KaiTi"',
        label: '楷体',
      },
      {
        value: '"Microsoft JhengHei"',
        label: '微软正黑体',
      },
      {
        value: '"NSimSun"',
        label: '新宋体',
      },
      {
        value: '"FangSong"',
        label: '仿宋',
      },
    ]

    //字体大小
    const fontSizeValue = ref(24)

    //文本值
    const textValue = ref('')

    //字幕输入时触发
    const subtitleInput = ()=>{

      const currentFragIndex = store.state.video.currentFragIndex;
      // console.log(currentFragIndex)
      // console.log(store.state.video.videoCurrentTime)
      // console.log('片段数组',store.state.sliceFragment.sliceFragmentArr)
      // console.log('片段',store.state.sliceFragment)
      //在输入字幕的时候,判断当亲片段字幕数量,如果数量大于2,就不允许添加,并给出警告
      if (store.state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr&&store.state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr.length>=2){
        ElMessage({
          showClose: true,
          message: '仅支持添加两条字幕',
          type: 'warning',
        })
        return;
      }

      let inputValue = textValue.value.trim();
      if(inputValue && inputValue!==''){
        // console.log(inputValue)
        let fontFamily = fontFamilyValue.value && fontFamilyValue.value!==''?fontFamilyValue.value:'"Microsoft Yahei"';
        let color = colorValue.value && colorValue.value!=='' ? colorValue.value : 'black';
        let fontSize = fontSizeValue.value + 'px'
        store.dispatch('setSubtitleValue',{fontFamily,color,fontSize,inputValue})
      }
    }

    //点击添加字幕的时候进行操作
    const addSubtitleHandler = async ()=>{
      //获取当前时间片段
      const currentFragIndex = store.state.video.currentFragIndex;
      // console.log(currentFragIndex)
      const subtitleArr = store.state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr;
      if (subtitleArr&&subtitleArr.length>=2) {
        ElMessage({
          showClose: true,
          message: '仅支持添加两条字幕',
          type: 'warning',
        })
        return;
      }
      let inputValue = textValue.value.trim();
      const subtitleValue = store.state.subtitleValue;
      if(inputValue && inputValue!==''){
        await store.dispatch('addSubtitleArr',subtitleValue)

        textValue.value = ''
        await store.dispatch('clearInputValue')
        ElMessage({
          showClose: true,
          message: '添加字幕成功',
          type: 'success',
        })
      }else{
        ElMessage({
          showClose: true,
          message: '字幕不能能为空',
          type: 'warning',
        })
        return;
      }
      console.log(subtitleArr);
    }

    return {
      colorValue,
      predefineColors,
      // handleChange,
      fontFamilyValue,
      options,
      fontSizeValue,
      textValue,
      subtitleInput,
      addSubtitleHandler,

    }
  }
}

</script>

<style scoped>

.add-subtitle {
  /*text-align: center;*/
}

.add-subtitle > div {
  margin: 5px;
}
</style>