<template>
    <div class="conversation-view">
        <van-nav-bar title="Conversation"
            left-arrow
            left-text="Back"
            @click-left="back"
        />
        <ChatBox class="chat-box" :conversationId="props.id" />
    </div>
</template>

<script setup lang="ts">
import ChatBox from '@/components/ChatBox.vue'
const props = defineProps<{
    id: string
}>()

const back = () => {
    history.back();
}

</script>

<style lang="less" scoped>
.conversation-view {
    display: flex;
    flex-direction: column;
    height: 100%;

    .navi-btn {
        padding: 0.5rem 2rem;
    }
    .chat-box {
        flex: 1;
    }
}
</style>