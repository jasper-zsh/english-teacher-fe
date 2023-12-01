<template>
    <div class="conversation-list">
        <el-button @click="createConversation">New</el-button>
        <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
            <router-link
                v-for="c in conversations"
                :key="c.id"
                class="infinite-list-item"
                :to="`/conversations/${c.id}`"
            >{{ c.id }}</router-link>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { client } from '@/remote'
import { type Conversation } from '@/api/models'
import { onMounted, ref } from 'vue';

const conversations = ref<Conversation[]>([]);

const load = async () => {
    const res = await client.conversationsGet();
    conversations.value = res;
}


const createConversation = async () => {
    await client.conversationsPost({
        conversationsPostRequest: {
            assistantId: 1,
        }
    })
    load()
}

onMounted(load)
</script>