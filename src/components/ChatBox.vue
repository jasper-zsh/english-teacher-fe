<template>
    <div class="chat-box" @mouseup="stopSpeaking" @mouseleave="stopSpeaking">
        <div class="messages">
            <el-scrollbar ref="scrollbarRef" height="100%">
                <div ref="innerRef">
                    <div v-for="msg in messages" :key="msg.id">
                        <div class="warpper" :class="{left: msg.role === 'assistant', right: msg.role === 'user'}">
                            <div class="bubble" :class="{local: msg.role === 'user', remote: msg.role === 'assistant'}">
                                {{ msg.text }}
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        
        <div class="action-bar">
            <el-input v-model="text" class="input-box" />
            <el-button type="primary" @click="sendTextMessage" v-if="text.length > 0">Send</el-button>
            <el-button type="primary" v-else @mousedown="startSpeaking">Speak</el-button>
        </div>

        <div class="speaking" v-if="speaking">
            Speaking
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { type Message, WsResponseFromJSON } from '@/api'
import type { ElScrollbar } from 'element-plus';

const props = defineProps<{
    conversationId: number
}>()

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const innerRef = ref<HTMLDivElement>()
const messages = ref<Message[]>([])
const text = ref('')
const speaking = ref(false)

let ws: WebSocket

const connect = () => {
    ws = new WebSocket('ws://localhost:3000')
    ws.onopen = wsOnOpen
    ws.onerror = wsOnError
    ws.onmessage = wsOnMessage
}

const disconnect = () => {
    ws.close()
}

const wsOnOpen = (e: Event) => {
    console.log('connected', e)
    send('start', {
        id: props.conversationId
    })
}

const wsOnError = (e: Event) => {
    console.log('websocket error, reconnect',e)
    connect()
}

const wsOnMessage = (e: any) => {
    console.log('got message', e)
    const msg = WsResponseFromJSON(JSON.parse(e.data))
    switch (msg.event) {
        case 'started':
            loadMessages()
            break
        case 'msg_forward':
            gotForwardMessage(msg.data)
            break
    }
}

const send = (event: string, data: any) => {
    console.log('send', event, data)
    ws.send(JSON.stringify({
        event,
        data
    }))
}

onMounted(() => {
    connect()
})

onUnmounted(() => {
    disconnect()
})

const gotForwardMessage = (msg: any) => {
    messages.value.push(msg)
    nextTick(() => {
        scrollbarRef.value?.setScrollTop(innerRef.value!.clientHeight)
    })
}

const loadMessages = () => {
    send('loadMessages', {
        direction: 'FORWARD',
        cursor: messages.value.length > 0 ? messages.value[messages.value.length - 1].id : undefined,
    })
}

const sendTextMessage = () => {
    send('chatText', {
        text: text.value,
        cursor: messages.value.length > 0 ? messages.value[messages.value.length - 1].id : undefined,
    })
    text.value = ''
}

let recorder: MediaRecorder|undefined
let recordTicker: number|undefined

const startSpeaking = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000,
    });
    recorder.ondataavailable = async (e) => {
        const data = arrayBufferToBase64(await e.data.arrayBuffer());
        console.log(data);
    }
    recorder.audioBitsPerSecond
    recorder.start()
    recordTicker = setInterval(() => {
        recorder?.requestData()
    }, 1000)
    speaking.value = true
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

const stopSpeaking = () => {
    if (!speaking.value) {
        return
    }
    clearInterval(recordTicker)
    recordTicker = undefined
    recorder?.stop()
    recorder = undefined
    speaking.value = false
}

</script>

<style lang="less" scoped>
.chat-box {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    left: 0;
    top: 0;

    .messages {
        flex: 1;
        overflow: hidden;

        .bubble {
            width: fit-content;
            max-width: 80%;
            padding: 10px;
            margin: 10px;
            border-radius: 10px;
            background-color: #eee;
        }

        .right {
            display: flex;
            justify-content: end;
        }

        .local {
        }

        .remote {

        }
    }

    .action-bar {
        display: flex;
    }
}

.speaking {
    width: 100px;
    height: 100px;
    background-color: #00000080;
    border-radius: 10px;
    position: absolute;
    left: calc(50% - 50px);
    top: calc(50% - 50px);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>