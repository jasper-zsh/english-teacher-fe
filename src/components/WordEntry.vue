<template>
    <div class="word-entry" :style="{height: height ? `${height}px` : '100%'}">
        <div class="result" v-if="computedEntry">
            <div class="scroll">
                <div class="word">{{ computedEntry?.word }}</div>
                <div
                    class="definition"
                    v-for="def, idx in computedEntry?.definitions"
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
            <div class="actions">
                <van-button type="success" block square @click="showAddToStudyList = true">Add to study list</van-button>
            </div>
        </div>
        <div class="not-found" v-else>
            No definition found for "{{ word }}"
        </div>
        <div class="loading" v-if="loading">
            <van-loading />
        </div>
        <van-dialog
            v-model:show="showAddToStudyList"
            :show-confirm-button="false"
            title="Which study list"
            show-cancel-button
        >
            <van-cell
                v-for="item in vocabularyStore.studyLists"
                :key="item.id"
                :title="item.name"
                @click="addToStudyList(item.id)"
            />
            <OverlayLoading :loading="adding" />
        </van-dialog>
    </div>
</template>

<style lang="less" scoped>
.word-entry {
    position: relative;
    display: flex;
    flex-direction: column;
    .result {
        display: flex;
        flex-direction: column;
        height: 100%;
        .scroll {
            flex: 1;
            overflow: scroll;
            padding: 1.5rem;
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
import { useVocabularyStore } from '@/stores/vocabulary';
import { ref, watch } from 'vue';
import OverlayLoading from './OverlayLoading.vue'
import { computed } from 'vue';

const props = defineProps<{
    word?: string;
    entry?: WordEntry;
    height?: number;
}>()
const wordEntry = ref<WordEntry>()
const loading = ref(false)
const adding = ref(false)
const showAddToStudyList = ref(false)

const vocabularyStore = useVocabularyStore()

const computedEntry = computed(() => {
    if (props.entry) {
        return props.entry
    }
    if (wordEntry.value) {
        return wordEntry.value
    }
    return undefined
})

const loadWord = async () => {
    if (!props.word) {
        wordEntry.value = undefined
        loading.value = false
        return
    }
    loading.value = true
    try {
        wordEntry.value = await dictionaryApi.dictionariesWordGet({
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

const addToStudyList = async (studyListId: string) => {
    adding.value = true
    try {
        await dictionaryApi.studylistsIdWordPost({
            id: studyListId,
        })
    } finally {
        adding.value = false
        showAddToStudyList.value = false
    }
}

watch(() => props.word, (n, o) => {
    console.log(n, o)
    if (n !== o && n) {
        loadWord()
    }
}, {
    immediate: true,
})

</script>