import { AuthApi, Configuration, ConversationApi, DictionaryApi, type Middleware, type ResponseContext } from '@/api'
import router from './router'

class AuthMiddleware implements Middleware {
    async post(context: ResponseContext): Promise<void | Response> {
        if (context.response?.status === 401 && router.currentRoute.value.name !== 'login') {
            console.log('unauthenticated')
            router.push({
                path: '/login'
            })
        } else {
            return context.response;
        }
    }
}

const conf = new Configuration({
    // @ts-ignore
    basePath: import.meta.env.VITE_API_ENDPOINT,
    middleware: [new AuthMiddleware()],
    credentials: 'include',
})

export const conversationApi = new ConversationApi(conf)
export const authApi = new AuthApi(conf)
export const dictionaryApi = new DictionaryApi(conf)