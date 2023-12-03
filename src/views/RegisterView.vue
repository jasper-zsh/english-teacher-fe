<template>
    <div class="register-view">
        <van-nav-bar
            title="Register"
            left-arrow
            @click-left="back"
        />
        <van-form @submit="registerAndLogin">
            <van-cell-group inset title="First you need an account">
                <van-field
                    v-model="username"
                    name="username"
                    label="Username"
                    placeholder="John Doae"
                    :rules="[{ required: true, message: 'Username is required' }]"
                />
                <van-field
                    v-model="password"
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Password"
                    :rules="[{ required: true, message: 'Password is required' }]"
                />
            </van-cell-group>
            <div class="actions">
                <van-button round block type="primary" native-type="submit">Register & Login</van-button>
            </div>
            
        </van-form>
    </div>
</template>

<style lang="less" scoped>
.register-view {
    .actions {
        padding: 2rem;
        
        >button {
            margin-bottom: 1rem;
        }
    }
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { authApi } from '@/remote';
import type { ResponseError } from '@/api';
import { ref } from 'vue';
import 'vant/es/notify/style';

const username = ref('');
const password = ref('');
const router = useRouter();

const back = () => {
    history.back()
}

const registerAndLogin = async (data: any) => {
    const { username, password } = data;
    try {
        await authApi.authRegisterPost({
            registerRequest: {
                username,
                password,
            },
        });
        await authApi.authLoginPost({
            loginRequest: {
                username,
                password,
            }
        })
        showNotify({
            type: 'success',
            message: 'Login succeed',
        })
        router.replace({
            name: 'conversations',
        })
    } catch (e: any) {
        console.log(e)
        switch (e.response.status) {
            case 409:
                showNotify({
                    type: 'warning',
                    message: 'User exists',
                })
                break;
            default:
                showNotify({
                    type: 'warning',
                    message: 'Register failed',
                })
                break;
        }
    }
}
</script>