<template>
  <div class="add-picture">
    <h2>添加图片</h2>
    <el-button class="file-box" text>
      <input type="file" id='fileInput' class="file-btn" required
             @change="handleFileSelect"/> 选择文件
    </el-button>
    <el-button
        type="primary"
        bg
        @click="addPictureHandler"
    >确认添加
    </el-button>
    <div>
      <span>图片大小</span>
      <el-input-number v-model="pictureSizeValue" :min="16" :max="500" @change="setPictureValue"/>
    </div>

    <div>
      <span>旋转角度</span>
      <el-input-number v-model="pictureRotateValue" :min="0" :max="360" @change="setPictureValue"/>
    </div>

    <el-upload
        v-model:file-list="imgList"
        class="upload-demo"
        multiple
        list-type="picture"
        :auto-upload="false"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="3"
        :on-exceed="handleExceed"
    >
      <!--        <el-button class="file-box" text>-->

      <!--        </el-button>-->
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500KB.
        </div>
      </template>
    </el-upload>




  </div>
</template>

<script>

import {ref,reactive} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useStore} from 'vuex'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: "AddPicture",
  components:{Plus},
  setup() {

    const store = useStore();
    const pictureRotateValue  = ref(0);
    const imgList = ref([
    ])

    const pictureSizeValue = ref(120);
    const handleRemove = (file, uploadFiles) => {
      console.log(file, uploadFiles)
    }

    const handlePreview = (uploadFile) => {
      console.log(uploadFile)
    }

    const handleExceed = (files, uploadFiles) => {
      ElMessage.warning(
          `The limit is 3, you selected ${files.length} files this time, add up to ${
              files.length + uploadFiles.length
          } totally`
      )
    }

    const beforeRemove = (uploadFile, uploadFiles) => {
      console.log(uploadFile,uploadFiles)
      return ElMessageBox.confirm(
          `Cancel the transfer of ${uploadFile.name} ?`
      ).then(
          () => true,
          () => false
      )
    }

    // const fileInput = ref();
    //全局存储照片名
    let name = '';
    // 照片路径
    let url = '';
    //选择文件操作

    const setPictureValue = ()=>{
      // console.log(`进入了`,name,url)
      if(name&&name!==''&&url&&url!==''){
        let size = pictureSizeValue.value + 'px';
        let rotate = pictureRotateValue.value + 'deg';
        store.dispatch('setPictureValue',{name,url,size,rotate})
        console.log('pic',store.state.pictureValue)
      }

    }
    const handleFileSelect = () => {
      // console.log(fileInput.value)
      const file = document.getElementById('fileInput').files[0];
      name = file.name;//读取选中文件的文件名
      console.log(name,file)
      if(file){
        url = URL.createObjectURL(file);
        imgList.value.push({
          name,
          url,
        })

       setPictureValue()
        // console.log(url);
      }
    }



    const addPictureHandler = ()=>{

    }

    return {
      pictureRotateValue,
      pictureSizeValue,
      imgList,
      handleRemove,
      handlePreview,
      handleExceed,
      beforeRemove,
      handleFileSelect,
      addPictureHandler,
      setPictureValue
    }
  },
}
</script>

<style scoped>
.file-box {
  display: inline-block;
  position: relative;
  overflow: hidden;
  color: rgb(252, 113, 0);
  background-color: rgb(255, 255, 255);
}

.file-btn {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  outline: none;
  filter: alpha(opacity=0);
  -moz-opacity: 0;
  -khtml-opacity: 0;
  opacity: 0;
}
</style>