<template>
    <div class="overlay-loading" v-if="loading">
        <van-loading />
    </div>
</template>

<style lang="less" scoped>
.overlay-loading {
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #000000A0;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<script setup lang="ts">
const props = defineProps<{
    loading: boolean;
}>()
</script>