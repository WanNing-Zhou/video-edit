<template>
  <div class="hold-all-inner  add-subtitle">
    <h2 class="action-title">添加字幕</h2>

    <div>
      <span>字体大小: </span>
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
      <span>字体颜色: </span>
      <el-color-picker v-model="colorValue" @change="subtitleInput" lable="选择颜色" show-alpha :predefine="predefineColors"/>
    </div>

    <div>
      <span>字幕: </span>
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
    <div>
        <div v-for="item in subtitleArr">
          <div
              :style="`display: inline-block;font-family:${item.fontFamily}; color:black;font-size:18px;`"
              :key="item.position"
          >{{item.inputValue}}</div>
          <el-button
              type="danger"
              text
              @click="deleteSubtitle(item)"
          >删除</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: "AddSubtitle",
  setup() {
    //字体颜色
    const colorValue = ref('#ffffff')
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

    //判断是否有视频
    const isHaveVideoUrl = ()=>{
      const url = store.state.videoUrl;
      if(!url || url ===''){
        ElMessage({
          showClose: true,
          message: '请先添加视频',
          type: 'warning',
        })
        return false;
      }
      return true;
    }

    //字幕输入时触发
    const subtitleInput = ()=>{

      if(!isHaveVideoUrl()){
        textValue.value='';
        return;
      }

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
        textValue.value = '';
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

      if(!isHaveVideoUrl()){
        textValue.value='';
        return;
      }

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
      }
      // console.log(subtitleArr);
    }

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

    const deleteSubtitle = (subtitleValue)=>{
      // console.log('subtitleValue',subtitleValue)
      store.dispatch('deleteSubtitle',subtitleValue)
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
      deleteSubtitle,
      subtitleArr
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

.action-title{
  text-align: center;
}
</style>