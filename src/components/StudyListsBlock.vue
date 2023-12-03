<template>
    <div class="study-list-block">
        <div class="inner">
            <div
                class="studylist-item"
                v-for="item in vocabularyStore.studyLists"
                :key="item.id"
                @click="go(item.id)"
            >
                <van-icon name="notes-o" size="5rem" />
                <div class="name">{{ item.name }}</div>
            </div>
            <div class="studylist-item" @click="showCreateStudyList = true">
                <van-icon name="add-o" size="3rem" />
            </div>
        </div>
        
        <van-dialog
            v-model:show="showCreateStudyList"
            title="Create study list"
            show-cancel-button
            :before-close="createStudyList"
        >
            <van-field
                v-model="studyListName"
                name="name"
                placeholder="Name of new study list"
            />
        </van-dialog>
    </div>
</template>

<style lang="less" scoped>
.study-list-block {
    overflow: scroll;
    .inner {
        display: flex;
        width: fit-content;
    }

    .studylist-item {
        margin: 1rem;
        width: 8rem;
        height: 10rem;
        background-color: white;
        border: 1px;
        border-color: gray;
        border-style: solid;
        box-shadow: 3px 3px #00000020;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}
</style>


<script setup lang="ts">
import type { StudyList } from '@/api';
import { dictionaryApi } from '@/remote';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { showNotify } from 'vant';
import 'vant/es/notify/style';
import { useRouter } from 'vue-router';
import { useVocabularyStore } from '@/stores/vocabulary';

const vocabularyStore = useVocabularyStore()
const showCreateStudyList = ref(false)
const studyListName = ref('')

const router = useRouter()

const createStudyList = async (action: any) => {
    if (action !== 'confirm') {
        return true
    }
    if (studyListName.value.length === 0) {
        showNotify({
            type: 'warning',
            message: 'Name is required'
        })
        return false
    }
    try {
        await dictionaryApi.studylistsPost({
            studylistsPostRequest: {
                name: studyListName.value,
            },
        })
        await vocabularyStore.refreshStudyLists()
        return true
    } catch (e: any) {
        return true
    }
}

const go = (id: string) => {
    router.push({
        name: 'studylist',
        params: {
            studyListId: id,
        }
    })
}

</script>