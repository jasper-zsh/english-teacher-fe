<template>
    <div class="conversation-list">
        <van-nav-bar
            title="Conversations"
            right-text="New"
            @click-right="createConversation"
        />
        <div class="content">
            <van-pull-refresh v-model="loading" @refresh="load">
                <van-list>
                    <van-swipe-cell
                        v-for="c in conversations"
                        :key="c.id"
                    >
                        <van-cell
                            :to="`/conversations/${c.id}`"
                        >
                            <van-text-ellipsis
                                rows="3"
                                :content="c.messages?.length ? c.messages[0].text : '\nEmpty\n '" />
                        </van-cell>
                        <template #right>
                            <van-button class="swipe-button" square type="danger" text="Delete" @click="deleteConversation(c.id)" />
                        </template>
                    </van-swipe-cell>
                </van-list>
            </van-pull-refresh>
        </div>
        

    </div>
</template>

<style lang="less">
.conversation-list {
    height: 100%;
    display: flex;
    flex-direction: column;

    .content {
        flex: 1;
        overflow: scroll;
    }

    .swipe-button {
        height: 100%;
    }
}
</style>

<script setup lang="ts">
import { conversationApi } from '@/remote'
import { type Conversation } from '@/api/models'
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { showSuccessToast } from 'vant';

const router = useRouter();

const conversations = ref<Conversation[]>([]);
const loading = ref(false);

const load = async () => {
    loading.value = true;
    try {
        const res = await conversationApi.conversationsGet();
        conversations.value = res;
    } finally {
        loading.value = false;
    }
}

const alipayLoginUrl = () => {
    const appId = '2021004128694301'
    const redirectUrl = 'https://aien.zcar.tech/auth/callback/alipay'
    const loginUrl = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${appId}&scope=auth_user&redirect_uri=${encodeURIComponent(redirectUrl)}&state=init`
    // return loginUrl
    return `alipays://platformapi/startapp?appId=${appId}&url=${encodeURIComponent(loginUrl)}`
}

const createConversation = async () => {
    const conversation = await conversationApi.conversationsPost({})
    router.push({
        name: 'conversation',
        params: {
            id: conversation.id,
        },
    })
}

const deleteConversation = async (id: string) => {
    await conversationApi.conversationsConversationIdDelete({
        conversationId: id,
    })
    showSuccessToast('Deleted')
    load()
}

onMounted(load)
</script>