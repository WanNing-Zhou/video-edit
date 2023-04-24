<template>
  <el-scrollbar>
  <h2>删除片段列表</h2>
  <p>{{JSON.stringify(deleteFragData)}}</p>

  <h2>传递后端的数据</h2>
  <p>{{JSON.stringify(jsonData)}}</p>

  </el-scrollbar>

</template>

<script>

import {useStore} from 'vuex';
import {ref,computed} from 'vue'

export default {
  name:'DataSheet',
  setup(){
    const store = useStore();
    const jsonData = ref({});

    const fragData = computed(()=>{
      jsonData.value.fragData = store.state.sliceFragment.sliceFragmentArr;
      jsonData.value.videoUrl= store.state.videoUrl
      return store.state.sliceFragment.sliceFragmentArr;
    })

    const deleteFragData = computed(()=>{
      jsonData.value.delteFragData= store.state.deleteOptions.optionArr
      jsonData.value.videoUrl= store.state.videoUrl
      jsonData.value.fragData = store.state.sliceFragment.sliceFragmentArr;
      return store.state.deleteOptions.optionArr;
    })



    return {
      fragData,
      deleteFragData,
      jsonData
    }

  }
}


</script>