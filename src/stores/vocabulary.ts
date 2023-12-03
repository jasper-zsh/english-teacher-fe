import type { StudyList } from "@/api";
import { dictionaryApi } from "@/remote";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useVocabularyStore = defineStore('vocabulary', () => {
    const studyLists = ref<StudyList[]>([])
    
    async function refreshStudyLists() {
        const res = await dictionaryApi.studylistsGet({
            limit: '100',
        })
        studyLists.value = res.data
    }

    if (studyLists.value.length === 0) {
        refreshStudyLists()
    }

    return { studyLists, refreshStudyLists }
})