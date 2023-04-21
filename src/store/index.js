// vue3中创建store实例对象的方法createStore()按需引入
import { createStore } from 'vuex'

export const store =  createStore({

    state: { // 存放数据 和data类似
        //哪一个工具框正在显示
        addPictureVisible: false,
        addSubtitleVisible:false,
        selectMediaVisible:true,
        //正在显示的框
        IsVisible:'selectMediaVisible',
        //存储视频地址
        videoUrl:'',
        //存储时评的img(放弃使用)
        videoImgUrl:'',
        // 存放video的属性
        video:{
            videoDuration:'', //总时间
            videoCurrentTime:0, //正在播放的时间
            pause:true,
            play:false,
            isLoaded:false,
        }
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
        },
        updateVideoDuration(state,payload){
            state.video.videoDuration = payload;
        },
        updateVideoCurrentTime(state,payload){
            state.video.videoCurrentTime = payload;
        },
        updateVideoPause(state,payload){
            state.video.pause = payload
        },
        updateVideoPlay(state,payload){
            state.video.play = payload;
        },
        updateVideoLoaded(state,payload){
            state.video.isLoaded = payload
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
        },
        updateVideoDuration(context,payload){
            context.commit('updateVideoDuration',payload)
        },
        updateVideoCurrentTime(context,payload){
           context.commit('updateVideoCurrentTime',payload)
        },
        updateVideoPause(context,payload){
            context.commit('updateVideoPause',payload)
        },
        updateVideoPlay(context,payload){
            context.commit('updateVideoPlay',payload)
        },
        updateVideoLoaded(context,payload){
            context.commit('updateVideoLoaded',payload)
        }

    },
    modules: {// 拆分模块

    },


    
})



