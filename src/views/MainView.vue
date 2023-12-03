<template>
    <div class="main-view">
        <div class="content">
            <router-view></router-view>
        </div>
        <van-tabbar route>
            <van-tabbar-item icon="comment-o" replace :to="{ name: 'conversations' }">Chat</van-tabbar-item>
            <van-tabbar-item icon="notes-o" replace :to="{ name: 'vocabulary' }">Vocabulary</van-tabbar-item>
            <van-tabbar-item icon="user-o" replace :to="{ name: 'profile' }">Profile</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<style lang="less" scoped>
.main-view {
    height: 100%;

    .content {
        height: calc(100% - var(--van-tabbar-height));
        overflow: hidden;
    }
}
</style>
