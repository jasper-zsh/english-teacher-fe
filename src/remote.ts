import { ClientApi, Configuration } from '@/api'

const conf = new Configuration({
    basePath: 'http://localhost:3000'
})

export const client = new ClientApi(conf)
