<template>
    <div class="chat-message" :class="{ right: message.role === 'user' }">
        <van-icon
            name="volume-o"
            size="1.5rem"
            style="margin-right: 0.5rem;"
            @click="tts"
            v-if="message.role === 'user'"
        />
        <div class="bubble">
            <div ref="textRef" class="text">
                <span
                    v-for="word in message.text.split(' ')"
                    :key="word"
                    @click="clickWord(word)"
                >{{ word }}&nbsp;</span>
            </div>
            <div class="loading" v-if="loading">
                <van-loading />
            </div>
            <div class="loading" v-if="playing" @click="stop">
                <van-loading type="spinner" />
            </div>
        </div>
        <van-icon
            name="volume-o"
            size="1.5rem"
            style="margin-left: 0.5rem;"
            @click="tts"
            v-if="message.role === 'assistant'"
        />

        <audio
            ref="audioRef"
            v-if="voiceData"
            :src="`data:audio/mp3;base64,${voiceData}`"
            autoplay
            @play="onPlay"
            @pause="stop"
        />
    </div>
</template>

<style lang="less">
.chat-message {
    display: flex;
    align-items: center;
    .bubble {
        position: relative;
        width: fit-content;
        max-width: 80%;
        margin: 0.5rem;
        border-radius: 0.5rem;
        background-color: white;
        overflow: hidden;

        .text {
            padding: 0.5rem;
            display: flex;
            flex-wrap: wrap;
        }

        .loading {
            background-color: #000000A0;
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}

.right {
    justify-content: end;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import type { Message } from '@/api';
import { onMounted } from 'vue';

const props = defineProps<{
    message: Message;
}>();

const emits = defineEmits<{
    (event: 'tts', msg: Message): void;
    (event: 'word', word: string): void;
}>()

const voiceData = ref<string>();
const audioRef = ref<HTMLAudioElement>();
const playing = ref(false);
const loading = ref(false);
const textRef = ref<HTMLDivElement>();

onMounted(() => {
    if (textRef.value) {
        const childs = textRef.value.childNodes;
        let minLeft = textRef.value.clientWidth;
        let maxLeft = 0;
        let maxLeftWidth = 0;
        for (const el of childs) {
            const e = el as any;
            if (e.offsetLeft < minLeft) {
                minLeft = e.offsetLeft
            }
            if (e.offsetLeft > maxLeft) {
                maxLeft = e.offsetLeft
                maxLeftWidth = e.clientWidth
            }
        }
        const innerWidth = maxLeft - minLeft + maxLeftWidth
        textRef.value.style.width = `calc(${innerWidth}px + 1.1rem)`;
    }
})

const tts = () => {
    if (!voiceData.value) {
        if (loading.value) {
            return
        }
        emits('tts', props.message)
        loading.value = true
    } else {
        audioRef.value?.play()
    }
    
}

const play = (data?: string) => {
    console.log('msg', props.message.id, 'play voice')
    loading.value = false
    voiceData.value = data
}

const onPlay = () => {
    playing.value = true
}

const stop = () => {
    if (audioRef.value) {
        audioRef.value.pause()
        audioRef.value.currentTime = 0
    }
    playing.value = false
}

const wordPattern = new RegExp(/([a-zA-Z0-9-'"]+)/)

const clickWord = (word: string) => {
    const match = wordPattern.exec(word)
    if (match) {
        emits('word', match[0])
    } else {
        emits('word', word)
    }
    
}

defineExpose({play})
</script>