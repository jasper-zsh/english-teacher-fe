<template>
    <div class="chat-message" :class="{ right: message.role === 'user' }">
        <div class="bubble">
            <div class="text" @click="tts">
                {{ message.text }}
            </div>
            <div class="loading" v-if="loading">
                <van-loading />
            </div>
            <div class="loading" v-if="playing" @click="stop">
                <van-loading type="spinner" />
            </div>
        </div>

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
    display: flex;
    justify-content: end;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import type { Message } from '@/api';

const props = defineProps<{
    message: Message;
}>();

const emits = defineEmits<{
    (event: 'tts', msg: Message): void
}>()

const voiceData = ref<string>();
const audioRef = ref<HTMLAudioElement>();
const playing = ref(false);
const loading = ref(false);

const tts = () => {
    if (!voiceData.value) {
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

defineExpose({play})
</script>