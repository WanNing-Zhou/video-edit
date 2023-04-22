<template>
  <div class="add-subtitle">
    <h3>添加字幕</h3>

    <div>
      <span>字体大小</span>
      <el-input-number v-model="fontSize" :min="8" :max="24" @change="handleChange"/>
    </div>

    <div>
      <el-select v-model="fontFamily" :style="`font-family:${value}`" class="m-2" placeholder="选择字体">
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
      <sapn>字体颜色</sapn>
      <el-color-picker v-model="colorValue" lable="选择颜色" show-alpha :predefine="predefineColors"/>
    </div>

    <div>
      <span>字幕</span>
      <el-input
          v-model="text"
          maxlength="30"
          placeholder="Please input"
          show-word-limit
          :rows="2"
          type="textarea"
          :style="`font-family:${value};`"
      />
    </div>
    <div>
      <el-button
          type="primary"
          text="添加字幕"
          bg
      >添加字幕
      </el-button>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue'

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

    const handleChange = (value) => {
      console.log(value)
    }

    const fontFamily = ref('')

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
    const fontSize = ref('14')

    //文本值
    const textValue = ref('')

    return {
      colorValue,
      predefineColors,
      handleChange,
      fontFamily,
      options,
      fontSize,
      textValue
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