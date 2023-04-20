// vue3中创建store实例对象的方法createStore()按需引入
import { createStore } from 'vuex'

export const store =  createStore({

    state: { // 存放数据 和data类似
        addPictureVisible: false,
        addSubtitleVisible:false,
        selectMediaVisible:true,
        IsVisible:'selectMediaVisible',
        videoUrl:'',
        videoImgUrl:'',
    },
    mutations: { // 用来修改state和getters里面的数据,用于同步修改
        updateAddPictureVisible (state, payload) {
            state[state.IsVisible] = false;
            state.addPictureVisible = true;
            state.IsVisible = 'addPictureVisible';
        },
        updateAddSubtitleVisible (state, payload) {
            state[state.IsVisible] = false;
            state.addSubtitleVisible = true;
            state.IsVisible = 'addSubtitleVisible';
        },
        updateSelectMediaVisible (state, payload) {
            state[state.IsVisible] = false;
            state.selectMediaVisible = true;
            state.IsVisible = 'selectMediaVisible';
        },
        updateVideoUrl(state,payload){
            state.videoUrl = payload;
        },
        updateVideoImgUrl(state,payload){
            state.videoImgUrl = payload;
        }

    },
    getters: { // 相当于计算属性
    },
    actions: { // vuex中可以用于发起异步请求

        updateAddPictureVisible (context, payload) {
            context.commit('updateAddPictureVisible',payload)
        },
        updateAddSubtitleVisible (context, payload) {
            context.commit('updateAddSubtitleVisible',payload)
        },
        updateSelectMediaVisible (context, payload) {
           context.commit('updateSelectMediaVisible',payload)
        },
        updateVideoUrl(context,payload){
            context.commit('updateVideoUrl',payload)
        },
        updateVideoImgUrl(context,payload){
            context.commit('updateVideoImgUrl',payload)
        }

    },
    modules: {// 拆分模块

    },


    
})



