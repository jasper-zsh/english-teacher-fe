<template>
    <div class="study-list-view">
        <van-nav-bar :title="studyList?.name" left-arrow @click-left="back" />
        <van-pull-refresh class="words" @refresh="refreshWords" v-model="wordsLoading">
            <van-list>
                <van-cell
                    v-for="word in words"
                    :key="word.wordEntry?.id"
                    :title="word.word"
                    @click="explainWord(word.wordEntry)"
                >
                </van-cell>
                <van-empty description="No words here" v-if="words.length === 0" />
            </van-list>
        </van-pull-refresh>
        <van-popup v-model:show="showWordEntry" position="bottom" style="height: 60%">
            <WordEntry :entry="selectedWord" />
        </van-popup>
    </div>
</template>

<style lang="less" scoped>
.study-list-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    .words {
        flex: 1;
    }
}
</style>

<script setup lang="ts">
import type { WordEntry as WordEntryType, WordInStudyList } from '@/api';
import type { StudyList } from '@/api';
import { dictionaryApi } from '@/remote';
import WordEntry from '@/components/WordEntry.vue'
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps<{
    studyListId: string;
}>()
const studyList = ref<StudyList>()
const words = ref<WordInStudyList[]>([])
const wordsLoading = ref(false)
const selectedWord = ref<WordEntryType>()
const showWordEntry = ref(false)

const back = () => {
    history.back()
}

const load = async () => {
    const res = await dictionaryApi.studylistsIdGet({
        id: props.studyListId,
    })
    studyList.value = res
    if (words.value.length === 0 && res.words) {
        words.value = res.words
    }
}

const refreshWords = async () => {
    wordsLoading.value = true
    try {
        const res = await dictionaryApi.studylistsIdWordsGet({
            id: props.studyListId,
            limit: '20',
        })
        words.value = res.data
    } finally {
        wordsLoading.value = false
    }
}

const explainWord = (entry: any) => {
    selectedWord.value = entry
    showWordEntry.value = true
}

onMounted(() => {
    load()
})

</script>