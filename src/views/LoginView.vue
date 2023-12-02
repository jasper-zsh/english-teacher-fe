<template>
    <div class="login-view">
        <van-form @submit="login">
            <van-cell-group inset>
                <van-field
                    name="username"
                    v-model="username" 
                    label="Username"
                    placeholder="John Doae"
                    :rules="[{ required: true, message: 'Username is required' }]"
                />
                <van-field
                    type="password"
                    v-model="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    :rules="[{ required: true, message: 'Password is required' }]"
                />
            </van-cell-group>
            <div class="actions">
                <van-button round block type="primary" native-type="submit">Login</van-button>
                <van-button round block @click="registerAndLogin">Register & Login</van-button>
            </div>
            
        </van-form>
    </div>
</template>

<style lang="less">
.login-view {
    .actions {
        padding: 2rem;
        
        >button {
            margin-bottom: 1rem;
        }
    }
}
</style>

<script setup lang="ts">
import { auth } from '@/remote';
import { showSuccessToast, showFailToast } from 'vant';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const password = ref('');

const login = async () => {
    try {
        await auth.authLoginPost({
            loginRequest: {
                username: username.value,
                password: password.value,
            }
        })
        showSuccessToast('Login succeed');
        router.replace({
            name: 'conversations',
        })
    } catch (e) {
        if (e instanceof Response) {
            if (e.status === 401) {
                showFailToast('Wrong username or password')
            }
        }
    }
}

const registerAndLogin = async () => {
    try {
        await auth.authRegisterPost({
            registerRequest: {
                username: username.value,
                password: password.value,
            },
        });
        login();
    } catch (e) {
        showFailToast('Register failed')
    }
}
</script>