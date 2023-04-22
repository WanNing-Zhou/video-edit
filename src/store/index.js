// vue3中创建store实例对象的方法createStore()按需引入
import { createStore } from 'vuex'
import options from '@/utils/constant'
import deepCopy from "@/utils/deepCopy";

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
        },
        //视频导轨组件控制得属性
        videTrack:{
            valueRight:0,
            valueLeft:0,
            inputBarValue:[],
            videoInputBarMarks:{ //mark用来保留断点
                0: {
                    style:{
                        color:'#81e35b',
                        fontWeight:'700'
                    },
                    label:'0.00s'
                },
                100: {
                    style:{
                        color:'#0ede30',
                        fontWeight:'700'
                    },
                    label:'100%'
                },
            }
        },
        //用来保存历史操作
        history:{
            historyOptionsArr:[],
            historyOptionStep:[],
            videoInputBarMarksArr:[],
        },
        //用来保存当前操作
        currentWork:{},
        //删除操作栈
        deleteOptions:{
            optionStep:0,
            optionArr: []
        },

        //字幕数组
        subtitlesArr:[],
        // 切片数组
        sliceFragment:{
            sliceStep:0,
            // 切片栈(用于记录操作)
            sliceStepArr:[],
            //切片数组
            sliceFragmentArr:[]
        },
        //输入框中的文字
        subtitleValue:{
            fontFamily:'',
            fontSize:'',
            color:'',
            inputValue:''
        },
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
        },
        updateVideoTrack(state,payload){
            state.videTrack.valueLeft = payload[0];
            state.videTrack.valueRight = payload[1];
        },
        //添加操作
        pushDeleteOptions(state,payload){
/*            let length = state.deleteOptions.optionArr.length;
            if(state.deleteOptions.optionStep>=length){
                state.deleteOptions.optionArr
            }*/
            state.deleteOptions.optionArr[state.deleteOptions.optionStep] = payload;
            state.deleteOptions.optionStep ++;


        },
        //回退操作
        backDeleteOptions(state,payload){
            state.deleteOptions.optionStep --;
        },

        //向历史记录中添加数据
        pushHistoryOptions(state,payload){
            let step = state.history.historyOptionStep;
            state.history.historyOptionsArr[step] = payload //在历史记录中添加记录
            state.history.historyOptionStep ++;

        },
        //更新进度条
        updateInputBarValue(state,payload){
            state.videTrack.inputBarValue = payload;
        },

        //添加进度条状态
        addVideoInputBarMarks(state,payload){
            let mark = deepCopy(state.videTrack.videoInputBarMarks);
            mark = {...mark,...payload};
            state.videTrack.videoInputBarMarks = mark;

            let step = state.history.historyOptionStep;
            state.history.videoInputBarMarksArr[step-1] = mark;
        },
        //添加切片
        addSliceFragmentArr(state,payload){
            let sliceStep = state.sliceFragment.sliceStep;
            if(state.sliceFragment.sliceFragmentArr.length === 0){
                state.sliceFragment.sliceFragmentArr.push([0, state.video.videoDuration])
            }else{
                let fragment = [];
                for(let i = 0 ; i < state.sliceFragment.sliceFragmentArr.length; i++){
                    fragment = state.sliceFragment.sliceFragmentArr[i];
                    if(payload > fragment[0] && payload < fragment[1] ){
                        //更改当前数据
                        state.sliceFragment.sliceFragmentArr[i] = [fragment[0],payload];
                        //在当前位置后添加一个新的片段
                        state.sliceFragment.sliceFragmentArr[i] = state.sliceFragment.sliceFragmentArr.splice(i+1,0,[payload,fragment[1]]);

                        //操作进栈
                        state.sliceFragment.sliceStepArr[sliceStep] = payload;

                        break; //跳出循环
                    }
                }
            }
            state.sliceFragment.sliceStep ++;
        },
        setSubtitleValue(state,payload){
            if(payload && payload.inputValue && payload.inputValue!==''){
                payload.inputValue =  payload.inputValue.trim();
                state.subtitleValue = payload;
            }
        },

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
        },

        //更新进度条
        updateVideoTrack(context,payload){

            context.commit('updateVideoTrack',payload)
        },

        //添加删除记录
        pushDeleteOptions(context,payload){
            context.commit('pushHistoryOptions',options.DELETE);
            context.commit('pushDeleteOptions',payload);
            let value = context.state.videTrack.inputBarValue;
            let mark = {}
            mark[`${value[0]}`] ={
                style:{
                    color:options.color.DELETE_COLOR,
                        fontWeight:'500'
                },
                label:payload[0].toFixed(2) + 's'
            }

            mark[`${value[1]}`] ={
                style:{
                    color:options.color.DELETE_COLOR,
                    fontWeight:'500'
                },
                label:payload[1].toFixed(2) + 's'
            }

            console.log('mark',mark)
            context.commit('addVideoInputBarMarks',mark);
        },

        //回退删除操作
        backDeleteOptions(context,payload){
            context.commit('pushDeleteOptions')
        },

        //更改进度条状态
        updateInputBarValue(context,payload){
            context.commit('updateInputBarValue',payload)
        },

        //更新mark
        addVideoInputBarMarks(context,payload){
            context.commit('addVideoInputBarMarks',payload);
        },

        //添加切片 (payload是一个视频时间)
        addSliceFragmentArr(context,payload){
            context.commit('addSliceFragmentArr',payload);
            let mark = {}
            let value = context.state.videTrack.inputBarValue;
            mark[`${value[1]}`] ={
                style:{
                    color:options.color.SLICE_COLOR,
                    fontWeight:'700'
                },
                label:payload .toFixed(2) + 's'
            }
            context.commit('addVideoInputBarMarks',mark);

        },

        //保存字幕的值
        setSubtitleValue(context,payload){
            context.commit('setSubtitleValue',payload)
        }








    },
    modules: {// 拆分模块

    },

})



