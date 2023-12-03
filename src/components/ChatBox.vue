<template>
    <div class="chat-box">
        <div class="messages">
            <van-list v-if="ws">
                <div ref="innerRef">
                    <ChatMessage
                        :ref="msgRef"
                        v-for="msg in messages"
                        :key="msg.id"
                        :message="msg"
                        @tts="tts"
                        @word="word"
                    />
                </div>
            </van-list>
        </div>
        
        <div class="action-bar">
            <van-field v-model="text" class="input-box" x-webkit-speech />
            <van-button type="primary" @click="sendTextMessage" v-if="text.length > 0">Send</van-button>
            <van-button type="primary" v-else @click="startSpeaking">Click to Speak</van-button>
        </div>

        <div class="speaking" v-if="speaking" @click="stopSpeaking">
            Click to stop speaking
        </div>

        <van-overlay :show="showWord" @click="showWord = false">
            <div class="word-panel">
                <WordEntry :word="currentWord" />
            </div>
        </van-overlay>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { type Message } from '@/api'
import ChatMessage from './ChatMessage.vue'
import WordEntry from './WordEntry.vue'
import { WebSocketEmitter } from '@/utils/websocket'

const props = defineProps<{
    conversationId: string
}>()

const innerRef = ref<HTMLDivElement>()
const messages = ref<Message[]>([])
const text = ref('')
const speaking = ref(false)
const ws = ref<WebSocketEmitter>()
const msgRefs: {[key: string]: InstanceType<typeof ChatMessage>} = {}
const showWord = ref(false)
const currentWord = ref<string>()
const wordHeight = ref(0)

const connect = () => {
    // @ts-ignore
    ws.value = new WebSocketEmitter(import.meta.env.VITE_WS_ENDPOINT)
    ws.value.onOpen = () => {
        console.log('connected')
        ws.value?.send('start', {
            id: props.conversationId
        })
    }
    ws.value.on('started', loadMessages)
    ws.value.on('msg_forward', gotForwardMessage)
    ws.value.on('voice_response', playVoice)
}

const msgRef = (el: InstanceType<typeof ChatMessage>, refs: Record<string, any>) => {
    if (el) {
        msgRefs[el.$props.message.id] = el
    }
}

onMounted(() => {
    connect()
})

onUnmounted(() => {
    ws.value?.disconnect()
})

const gotForwardMessage = (msg: any) => {
    messages.value.push(msg)
    nextTick(() => {
        const lastMsg = msgRefs[messages.value[messages.value.length - 1].id]
        console.log(lastMsg.$el)
        lastMsg.$el.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        })
    })
}

const loadMessages = () => {
    ws.value?.send('load_messages', {
        direction: 'FORWARD',
        cursor: messages.value.length > 0 ? messages.value[messages.value.length - 1].createdAt : undefined,
    })
}

const sendTextMessage = () => {
    ws.value?.send('chat_text', {
        text: text.value,
        cursor: messages.value.length > 0 ? messages.value[messages.value.length - 1].createdAt : undefined,
    })
    text.value = ''
}

let recorder: MediaRecorder|undefined
let recordTicker: number|undefined

const startSpeaking = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    ws.value?.send('speaking')

    recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 16000,
    });
    recorder.ondataavailable = async (e) => {
        const data = arrayBufferToBase64(await e.data.arrayBuffer());
        ws.value?.send('audio_data', data)
        if (!speaking.value) {
            ws.value?.send('speaking_end')
        }
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

const playVoice = (data: { message: Message, voice: string }) => {
    msgRefs[data.message.id].play(data.voice)
}

const tts = (msg: Message) => {
    ws.value?.send('tts', msg)
}

const word = (word: string) => {
    currentWord.value = word
    showWord.value = true
}

</script>

<style lang="less" scoped>
.chat-box {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    left: 0;
    top: 0;

    .messages {
        flex: 1;
        overflow: scroll;
        padding: 0 1rem;
    }

    .action-bar {
        display: flex;
        padding: 0.5rem;
    }
}

.speaking {
    width: 100%;
    height: 4rem;
    background-color: #252525;
    position: absolute;
    bottom: 0;
    border-radius: 1rem 1rem 0 0;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

.word-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    border-radius: 1rem 1rem 0 0;
    background-color: white;
}

</style>