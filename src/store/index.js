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
            //用于字幕添加的时候为字幕添加id
            id:0,
            //步骤
            subtitleStep: 0,
            //字幕数组栈
            subtitlesArr: [],
            //字幕删除步骤
            delStep:[],
            delSubtitleArr:[]
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
            top: '20px',
            left: '20px',
            // 字幕的物理存储位置(用于后期对字幕的修改和删除)
            position:'', //存放存放位置用来确定
            // 字幕的唯一标识
            id:'',
        },

        //贴图(有些属性不知道能不能实现,咱得先有)
        pictureValue:{
            name:'',
            url:'',
            top:'20px',
            left:'20px',
            size:'',
            rotate:'',
            // 图片物理存放位置;
            position:'',
            //图片的标识
            id:'',
        },
        //图片数组
        pictureArrState: {
            //在添加的时候为图片附加id
            id:0,
            //步骤
            pictureStep: 0,
            //字幕数组栈
            picturesArr: [],

            //删除步骤
            delPicStep:0,
            // 图片删除栈
            delPicArr:[],
        },

        //更新视频时间
        UpdateCurrentTime:{
            isUpdateCurrentTime:false,
            timeValue:0
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
            // console.log('fragArr',fragArr);
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
         *  id:; //用作生成时候的唯一标识
         *},
         *
         */
        addSubtitleArr(state, payload) {
            const currentFragIndex = state.video.currentFragIndex;
            // console.log('niaho')
            //如果没有字幕则进行初始化
            if (!state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr) {
                // console.log('hehe')
                state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr = [];
            }

            payload.position =   state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr.length;
            payload.id = state.subtitlesArrState.id++;
            state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr.push(deepCopy(payload));
            // console.log('字幕添加了吗',state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr)

            //添加操作栈
            let length = state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr.length;
            let subtitleStep = state.subtitlesArrState.subtitleStep;
            state.subtitlesArrState.subtitlesArr[subtitleStep]={
                fragIndex: currentFragIndex,
                position: length - 1,
                subtitleValue: payload
            }
            // console.log('操作栈添加了吗',state.subtitlesArrState.subtitlesArr )
            state.subtitlesArrState.subtitleStep++;
        },
        //清空输入值
        clearInputValue(state){
            state.subtitleValue.inputValue = '';
            state.subtitleValue.left = '20px';
            state.subtitleValue.top = '20px';
            state.subtitleValue.position = '';
            state.subtitleValue.id = '';

        },
        //设置图片值
        setPictureValue(state,payload){
            state.pictureValue.name = payload.name;
            state.pictureValue.url = payload.url;
            state.pictureValue.size = payload.size;
            state.pictureValue.rotate = payload.rotate;
        },
        //设置图片的位置
        setPicturePosition(state, payload) {
            if (payload) {
                state.pictureValue.left = payload.left;
                state.pictureValue.top = payload.top;
            }
        },
        //清除图片值
        clearPictureValue(state){
            state.pictureValue.name = '';
            state.pictureValue.left = '20px';
            state.pictureValue.top = '20px';
            state.pictureValue.position = '';
            state.pictureValue.url='';
            state.pictureValue.id = ''
        },
        //添加图片
        addPictureArr(state, payload) {
            //获取当前判断
            const currentFragIndex = state.video.currentFragIndex;
            console.log('niaho')
            //如果没有图片则进行初始化
            if (!state.sliceFragment.sliceFragmentArr[currentFragIndex].pictures) {
                // console.log('hehe')
                state.sliceFragment.sliceFragmentArr[currentFragIndex].pictures = [];
            }

            payload.position =   state.sliceFragment.sliceFragmentArr[currentFragIndex].pictures.length;
            //分配id
            payload.id = state.pictureArrState.id++;
            state.sliceFragment.sliceFragmentArr[currentFragIndex].pictures.push(deepCopy(payload));
            // console.log('字幕添加了吗',state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr)

            //添加操作栈
            let length = state.sliceFragment.sliceFragmentArr[currentFragIndex].pictures.length;
            let pictureStep = state.pictureArrState.pictureStep;
            state.pictureArrState.picturesArr[pictureStep]={
                fragIndex: currentFragIndex,
                position: length - 1,
                pictureValue: payload
            }
            // console.log('操作栈添加了吗',state.subtitlesArrState.subtitlesArr )
            state.pictureArrState.pictureStep++;
        },

        //图片删除操作;
        //传递的是当前图片的value
        deletePicture(state,payload){
          const id = payload.id;
          const currentFragIndex = state.video.currentFragIndex;
          let position = '';
          const pictures =   state.sliceFragment.sliceFragmentArr[currentFragIndex].pictures;
          for(let i = 0; i < pictures.length; i++){
              if(id === pictures[i].id){
                  position = i;
                  state.sliceFragment.sliceFragmentArr[currentFragIndex].pictures.splice(i,1);
                  break;
              }
          }
          state.pictureArrState.delPicArr[state.pictureArrState.delPicStep++] = deepCopy(payload);
        },

        //字幕删除操作;
        //传递的是当前字幕的value
        deleteSubtitle(state,payload){
            const id = payload.id;
            const currentFragIndex = state.video.currentFragIndex;
            let position = '';
            const subtitleArr =  state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr;
            for(let i = 0; i < subtitleArr.length; i++){
                if(id === subtitleArr[i].id){
                    position = i;
                    state.sliceFragment.sliceFragmentArr[currentFragIndex].subtitleArr.splice(i,1);
                    break;
                }
            }
            state.subtitlesArrState.delSubtitleArr[state.subtitlesArrState.delStep++] = deepCopy(payload);
        },

        //是否更新视频时间
        isUpdateCurrentTime(state,payload){
            state.UpdateCurrentTime.isUpdateCurrentTime= payload;
        },
        //改变视频时间
        upDateCurrentTimeValue(state,payload){
            state.UpdateCurrentTime.timeValue = deepCopy(payload)
        },

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
            context.commit('addSubtitleArr', payload);
            context.commit('pushHistoryOptions', options.ADD_SUBTITLE);
        },
        //清空输入值
        clearInputValue(context){
            context.commit('clearInputValue');
        },

        //设置图片的值
        setPictureValue(context,payload){
            context.commit('setPictureValue',payload);
        },
        //设置图片的位置
        setPicturePosition(context, payload) {
           context.commit('setPicturePosition',payload)
        },

        //清除图片值
        clearPictureValue(context){
            context.commit('clearPictureValue');
        },

        //添加图片
        addPictureArr(context,payload){
            context.commit('addPictureArr',payload);
            //添加历史记录
            context.commit('pushHistoryOptions',options.ADD_PICTURE);
        },

        //是否更新视频时间
        isUpdateCurrentTime(context,payload){
            context.commit('isUpdateCurrentTime',payload)
        },

        //改变视频时间
        upDateCurrentTimeValue(context,payload){
            context.commit('upDateCurrentTimeValue',payload);
        },
        //删除贴图操作
        deletePicture(context,payload){
            context.commit('deletePicture',payload);
            context.commit('pushHistoryOptions',options.DELETE_PICTURE)
        },

        //删除字幕操作
        deleteSubtitle(context,payload){
            context.commit('deleteSubtitle',payload);
            context.commit('pushHistoryOptions',options.DELETE_SUBTITLE)
        }

    },
    modules: {// 拆分模块

    },

})



