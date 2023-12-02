<template>
    <div class="profile-view">
        <van-nav-bar title="Profile"></van-nav-bar>
        <van-cell-group title="Account">
            <van-cell title="Logout" is-link @click="logout"></van-cell>
        </van-cell-group>
    </div>
</template>

<script setup lang="ts">
import { auth } from '@/remote';
import { showSuccessToast } from 'vant';
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = async () => {
    await auth.authLogoutGet()
    showSuccessToast('Logout succeed')
    router.replace({
        name: 'login',
    });
}
</script>