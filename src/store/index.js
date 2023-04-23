// vue3中创建store实例对象的方法createStore()按需引入
import {createStore} from 'vuex'
import options from '@/utils/constant'
import deepCopy from "@/utils/deepCopy";

export const store = createStore({

    state: { // 存放数据 和data类似
        //哪一个工具框正在显示
        addPictureVisible: false,
        addSubtitleVisible: false,
        selectMediaVisible: true,
        //正在显示的框
        IsVisible: 'selectMediaVisible',
        //存储视频地址
        videoUrl: '',
        //存储视频的img(放弃使用)
        videoImgUrl: '',
        // 存放video的属性
        video: {
            currentFragIndex: 0, //当前处于哪个片段
            videoDuration: '', //总时间
            videoCurrentTime: 0, //正在播放的时间
            pause: true,
            play: false,
            isLoaded: false,
        },
        //视频导轨组件控制得属性
        videTrack: {
            valueRight: 0,
            valueLeft: 0,
            inputBarValue: [],
            videoInputBarMarks: { //mark用来保留断点
                0: {
                    style: {
                        color: '#81e35b',
                        fontWeight: '700'
                    },
                    label: '0.00s'
                },
                100: {
                    style: {
                        color: '#0ede30',
                        fontWeight: '700'
                    },
                    label: '100%'
                },
            }
        },
        //用来保存历史操作
        history: {
            historyOptionsArr: [],
            historyOptionStep: [],
            videoInputBarMarksArr: [],
        },
        //用来保存当前操作
        currentWork: {},
        //删除操作栈
        deleteOptions: {
            optionStep: 0,
            optionArr: []
        },

        //字幕数组
        subtitlesArrState: {
            //步骤
            subtitleStep: 0,
            //字幕数组栈
            subtitlesArr: [],
        },

        // 切片信息
        sliceFragment: {
            sliceStep: 0,
            // 切片栈(用于记录操作)
            sliceStepArr: [],
            //切片数组
            /**
             * 数据存放形式
             * {
             *     frag:[], //当前片段
             *     subtitleArr:[],//当前片段的字幕数组, 字幕数组中元素与 subtitleValue保持一致
             *     pictures:[],//当前贴图数组
             * }
             */
            sliceFragmentArr: []
        },
        //输入框中的文字
        subtitleValue: {
            //字体样式
            fontFamily: '',
            //字体大小
            fontSize: '',
            //字幕颜色
            color: '',
            //字幕值
            inputValue: '',
            //文字位置
            top: '0px',
            left: '0px',

            // 字幕的物理存储位置(用于后期对字幕的修改和删除)
            position: '',
        },
    },


    mutations: { // 用来修改state和getters里面的数据,用于同步修改
        updateAddPictureVisible(state, payload) {
            state[state.IsVisible] = false;
            state.addPictureVisible = true;
            state.IsVisible = 'addPictureVisible';
        },
        updateAddSubtitleVisible(state, payload) {
            state[state.IsVisible] = false;
            state.addSubtitleVisible = true;
            state.IsVisible = 'addSubtitleVisible';
        },
        updateSelectMediaVisible(state, payload) {
            state[state.IsVisible] = false;
            state.selectMediaVisible = true;
            state.IsVisible = 'selectMediaVisible';
        },
        //更新视频地址
        updateVideoUrl(state, payload) {
            state.videoUrl = payload;
        },
        updateVideoImgUrl(state, payload) {
            state.videoImgUrl = payload;
        },
        //更新视频的总时长
        updateVideoDuration(state, payload) {
            state.video.videoDuration = payload;
        },

        //跟新当前视频进度
        updateVideoCurrentTime(state, payload) {
            state.video.videoCurrentTime = payload;
            const fragArr = state.sliceFragment.sliceFragmentArr;
            console.log('fragArr',fragArr);
            //更新当前所在片段
            for (let i = 0; i < fragArr.length; i++) {
                let frag = fragArr[i].frag;
                if (payload >= frag[0] && payload < frag[1]) {
                    state.video.currentFragIndex = i;
                    // console.log(state.video.currentFragIndex)
                }
            }
        },
        updateVideoPause(state, payload) {
            state.video.pause = payload
        },
        updateVideoPlay(state, payload) {
            state.video.play = payload;
        },
        updateVideoLoaded(state, payload) {
            state.video.isLoaded = payload
        },
        updateVideoTrack(state, payload) {
            state.videTrack.valueLeft = payload[0];
            state.videTrack.valueRight = payload[1];
        },
        //添加操作
        pushDeleteOptions(state, payload) {
            /*            let length = state.deleteOptions.optionArr.length;
                        if(state.deleteOptions.optionStep>=length){
                            state.deleteOptions.optionArr
                        }*/
            state.deleteOptions.optionArr[state.deleteOptions.optionStep] = payload;
            state.deleteOptions.optionStep++;


        },
        //回退操作
        backDeleteOptions(state, payload) {
            state.deleteOptions.optionStep--;
        },

        //向历史记录中添加数据
        pushHistoryOptions(state, payload) {
            let step = state.history.historyOptionStep;
            state.history.historyOptionsArr[step] = payload //在历史记录中添加记录
            state.history.historyOptionStep++;

        },
        //更新进度条
        updateInputBarValue(state, payload) {
            state.videTrack.inputBarValue = payload;
        },

        //添加进度条状态
        addVideoInputBarMarks(state, payload) {
            let mark = deepCopy(state.videTrack.videoInputBarMarks);
            mark = {...mark, ...payload};
            state.videTrack.videoInputBarMarks = mark;

            let step = state.history.historyOptionStep;
            state.history.videoInputBarMarksArr[step - 1] = mark;
        },

        //添加切片
        addSliceFragmentArr(state, payload) {
            // console.log('添加切牌的payload', payload)
            let sliceStep = state.sliceFragment.sliceStep; //读取当前切片栈
            //初始化
            // console.log(state.sliceFragment.sliceFragmentArr.length)
            if (state.sliceFragment.sliceFragmentArr.length === 0) {
                state.sliceFragment.sliceFragmentArr.push({frag: [0, state.video.videoDuration]})
                // console.log('第一次执行的时候判断', state.sliceFragment.sliceFragmentArr)
            } else {
                let fragment = [];
                for (let i = 0; i < state.sliceFragment.sliceFragmentArr.length; i++) {
                    fragment = state.sliceFragment.sliceFragmentArr[i].frag;

                    if (payload > fragment[0] && payload < fragment[1]) {
                        //更改当前数据
                        // console.log('index', i, 'frament', fragment)
                        const fragCopy = deepCopy(state.sliceFragment.sliceFragmentArr[i])
                        state.sliceFragment.sliceFragmentArr[i].frag = [fragment[0], payload];
                        // console.log('frag', state.sliceFragment.sliceFragmentArr[i].frag)
                        //在当前位置后添加一个新的片段
                        state.sliceFragment.sliceFragmentArr.splice(i + 1, 0, {...fragCopy,frag: [payload, fragment[1]]});
                        // console.log()
                        //操作进栈
                        // 操作的片段进栈,回退的时候可以根据时间来连接两个片段
                        state.sliceFragment.sliceStepArr[sliceStep] = payload;
                        break; //跳出循环
                    }
                }
            }
            // console.log('slicArr', state.sliceFragment.sliceFragmentArr)
            state.sliceFragment.sliceStep++;
        },


        //设置字幕值
        setSubtitleValue(state, payload) {
            if (payload && payload.inputValue && payload.inputValue !== '') {
                payload.inputValue = payload.inputValue.trim();
                state.subtitleValue = {...state.subtitleValue, ...payload};
            }
        },
        //设置字幕的位置
        setSubtitlePosition(state, payload) {
            if (payload) {
                state.subtitleValue.left = payload.left;
                state.subtitleValue.top = payload.top;
            }
        },
        //添加字幕
        /**
         *
         * @param state
         * @param payload
         *
         * payload参数格式如下
         *         //输入框中的文字
         *
         *subtitleValue:{
         *  //字体样式
         *  fontFamily:'',
         *  //字体大小
         *  fontSize:'',
         *  //字幕颜色
         *  color:'',
         *  //字幕值
         *  inputValue:'',
         *  //文字位置
         *  top:'0px',
         *  left:'0px',
         *},
         *
         */
        addSubtitleArr(state, payload) {
            const currentFragIndex = state.video.currentFragIndex;
            console.log('niaho')
            //如果没有字幕则进行初始化
            if (!state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr) {
                console.log('hehe')
                state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr = [];
            }
            //添加字幕
            if (payload.position && payload.position!==''){

            }
            state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr.push(payload);
            console.log('字幕添加了吗',state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr)

            //添加操作栈
            let length = state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr.length;
            let subtitleStep = state.subtitlesArrState.subtitleStep;
            state.subtitlesArrState.subtitlesArr[subtitleStep]={
                fragIndex: currentFragIndex,
                position: length - 1,
                subtitleValue: payload
            }
            console.log('操作栈添加了吗',state.subtitlesArrState.subtitlesArr )
            state.subtitlesArrState.subtitleStep++;
        }
    },
    getters: { // 相当于计算属性
    },
    actions: { // vuex中可以用于发起异步请求

        updateAddPictureVisible(context, payload) {
            context.commit('updateAddPictureVisible', payload)
        },
        updateAddSubtitleVisible(context, payload) {
            context.commit('updateAddSubtitleVisible', payload)
        },
        updateSelectMediaVisible(context, payload) {
            context.commit('updateSelectMediaVisible', payload)
        },
        updateVideoUrl(context, payload) {
            context.commit('updateVideoUrl', payload)
        },
        updateVideoImgUrl(context, payload) {
            context.commit('updateVideoImgUrl', payload)
        },
        updateVideoDuration(context, payload) {
            context.commit('updateVideoDuration', payload)
        },
        updateVideoCurrentTime(context, payload) {
            context.commit('updateVideoCurrentTime', payload)
        },
        updateVideoPause(context, payload) {
            context.commit('updateVideoPause', payload)
        },
        updateVideoPlay(context, payload) {
            context.commit('updateVideoPlay', payload)
        },
        updateVideoLoaded(context, payload) {
            context.commit('updateVideoLoaded', payload)
        },

        //更新进度条
        updateVideoTrack(context, payload) {

            context.commit('updateVideoTrack', payload)
        },

        //添加删除记录(传递过来的payload的数据是百分比)
        pushDeleteOptions(context, payload) {
            context.commit('pushHistoryOptions', options.DELETE);

            context.commit('pushDeleteOptions', payload);
            let value = context.state.videTrack.inputBarValue;
            let mark = {}
            mark[`${value[0]}`] = {
                style: {
                    color: options.color.DELETE_COLOR,
                    fontWeight: '500'
                },
                label: payload[0].toFixed(2) + 's'
            }

            mark[`${value[1]}`] = {
                style: {
                    color: options.color.DELETE_COLOR,
                    fontWeight: '500'
                },
                label: payload[1].toFixed(2) + 's'
            }

            console.log('mark', mark)
            context.commit('addVideoInputBarMarks', mark);
        },

        //回退删除操作
        backDeleteOptions(context, payload) {
            context.commit('pushDeleteOptions')
        },

        //更改进度条状态
        updateInputBarValue(context, payload) {
            context.commit('updateInputBarValue', payload)
        },

        //更新mark
        addVideoInputBarMarks(context, payload) {
            context.commit('addVideoInputBarMarks', payload);
        },

        //添加切片 (payload是一个视频时间)
        addSliceFragmentArr(context, payload) {

            context.commit('pushHistoryOptions', options.SLICE);
            context.commit('addSliceFragmentArr', payload);
            if (payload) {
                let mark = {}
                let value = context.state.videTrack.inputBarValue;
                mark[`${value[1]}`] = {
                    style: {
                        color: options.color.SLICE_COLOR,
                        fontWeight: '700'
                    },
                    label: payload.toFixed(2) + 's'
                }
                context.commit('addVideoInputBarMarks', mark);
            }
        },

        //保存字幕的值
        setSubtitleValue(context, payload) {
            context.commit('setSubtitleValue', payload)
        },
        //设置字幕的位置(显示位置)
        setSubtitlePosition(context, payload) {
            context.commit('setSubtitlePosition', payload);
        },

        //添加字幕
        addSubtitleArr(context, payload) {
            context.commit('pushHistoryOptions', options.ADD_SUBTITLE);
            context.commit('addSubtitleArr', payload);
        }

    },
    modules: {// 拆分模块

    },

})



