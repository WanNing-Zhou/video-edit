// vue3中创建store实例对象的方法createStore()按需引入
import { createStore } from 'vuex'

export default createStore({

    state: { // 存放数据 和data类似
        addPictureVisible: false,
        addSubtitleVisible:false,
        selectMediaVisible:true,
        IsVisible:'',
    },
    mutations: { // 用来修改state和getters里面的数据,用于同步修改
        updateAddPictureVisible (state, payload) {
            state.info = payload
        },
        updateAddSubtitleVisible (state, payload) {
            state.info = payload
        },
        updateSelectMediaVisible (state, payload) {
            state.info = payload
        },
        updateIsVisible(state, payload){
            state.IsVisible = payload
        }

    },
    getters: { // 相当于计算属性
    },
    actions: { // vuex中用于发起异步请求
    },
    modules: {// 拆分模块
    },

})



