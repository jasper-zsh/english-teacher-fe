<template>
    <div class="vocabulary-view">
        <van-nav-bar title="Vocabulary" />
        <van-cell-group title="Study lists">
            <div class="content-row">
                <StudyListsBlock />
            </div>
        </van-cell-group>
    </div>
</template>

<style lang="less" scoped>
.vocabulary-view {
    .content-row {
        padding: 0.5rem;
    }
}
</style>

<script setup lang="ts">
import StudyListsBlock from '@/components/StudyListsBlock.vue'
</script>