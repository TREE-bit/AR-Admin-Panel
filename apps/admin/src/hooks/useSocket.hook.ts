import {reactive, computed, ref} from 'vue'
import { isPrototype } from '@/prototype/env'
// import { useStorage } from '@ar/shared'
import { useWebSocket } from '@vueuse/core'

interface OptionTs{
    type:number
    token:string|null
    userid:string|null
    isStart?: boolean,
    
}

const mapList:{
    [key: number]: string 
} = {
    1:'getOnlineMemberCount',
    2:'forbidUser',
    3: 'exportResult',
}
export function useSocket(option:OptionTs){
    if (isPrototype) {
        return {
            OnlineRes: computed(() => ({})),
            status: ref('CLOSED'),
            data: ref(null),
            open: () => {},
            close: () => {},
            ws: ref(null),
        }
    }
    const {type,token,userid, isStart = true } = option;
    // console.log(token,'token',userid,'userid')
    // const { localStore } = useStorage()
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("userInfo");
    interface stateTs{
        heartBeatInterval:NodeJS.Timeout|null
        OnlineRes:any
        count:number
    }
    const state = reactive<stateTs>({
        heartBeatInterval:null,
        OnlineRes:{},
        count:5,
    })
    const OnlineRes = computed(()=> state.OnlineRes)
    const url = `${import.meta.env.VITE_BAST_SOCKET}ar-manager/websocket/${mapList[type]}/${userid}`; 

    const { status, data, send, open, close,ws } = useWebSocket(url,{
        protocols: [token], // 你可能需要根据你的需求指定协议
        // heartbeat: true,
        immediate: isStart,
        onConnected:(ws)=>{
            if(!ws) return;
            clearInterval(state.heartBeatInterval as NodeJS.Timeout)
            const heartbeatInterval = setInterval(() => {
                send(JSON.stringify({ "type": 'connected' }));
            }, 5000);
          state.heartBeatInterval = heartbeatInterval;
        },
        onMessage:(ws,event)=>{
            if(!ws) return;
            let data = JSON.parse(event.data);
            // console.log(ws,data)
            state.OnlineRes = data;
        },
        // 断开重新连接
        autoReconnect: {
            retries: state.count,
            delay: 1000,
            onFailed() {
                console.log(`已自动重连${state.count}次`)
            },
        },
    })
    return{
        OnlineRes,
        status,
        data,
        open,
        close,
        ws
    }
}
