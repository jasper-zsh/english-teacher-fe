<template>
    <div class="word-entry" :style="{height: height ? `${height}px` : '100%'}">
        <div class="result" v-if="wordEntry">
            <div class="word">{{ wordEntry?.word }}</div>
            <div
                class="definition"
                v-for="def, idx in wordEntry?.definitions"
                :key="idx"
            >
                <div class="part">{{ def.part }}</div>
                <div
                    class="detail"
                    v-for="text, idx in def.definitions"
                    :key="idx"
                >{{ text }}</div>
            </div>
        </div>
        <div class="not-found" v-else>
            No definition found for "{{ word }}"
        </div>
        <div class="loading" v-if="loading">
            <van-loading />
        </div>
    </div>
</template>

<style lang="less" scoped>
.word-entry {
    position: relative;
    overflow: scroll;
    padding: 1.5rem;
    .result {
        .word {
            font-size: 2.5rem;
        }
        .definition {
            .part {
                font-size: 1.5rem;
                font-style: italic;
            }
            .detail {
                font-size: 1rem;
            }
        }
    }
    .loading {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: #00000080;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>

<script setup lang="ts">
import type { WordEntry } from '@/api';
import { dictionaryApi } from '@/remote';
import { ref, watch } from 'vue';

const props = defineProps<{
    word: string|undefined;
    height?: number;
}>()
const wordEntry = ref<WordEntry>()
const loading = ref(false)

const loadWord = async () => {
    if (!props.word) {
        wordEntry.value = undefined
        loading.value = false
        return
    }
    loading.value = true
    try {
        wordEntry.value = await dictionaryApi.dictionaryWordGet({
            word: props.word,
        })
    } catch (e: any) {
        switch (e.response.status) {
            case 404:
                wordEntry.value = undefined
                break
            default:
                throw e
        }
    } finally {
        loading.value = false
    }
}

watch(() => props.word, (n, o) => {
    console.log(n, o)
    if (n !== o) {
        loadWord()
    }
}, {
    immediate: true,
})

</script>