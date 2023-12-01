<template>
    <div class="conversation-view">
        <router-link to="/">Back</router-link>
        <ChatBox :conversationId="Number.parseInt(props.id)" />
    </div>
</template>

<script setup lang="ts">
import ChatBox from '@/components/ChatBox.vue'
const props = defineProps<{
    id: string
}>()
</script>

<style lang="less" scoped>
.conversation-view {
    height: 400px;
}
</style>