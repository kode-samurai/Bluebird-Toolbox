import axios from 'axios'
import router from '../router/index'

const http = axios.create({
    baseURL: '/',
    timeout: 10000
})

http.interceptors.response.use(
    res => res,
    err => {
        if (err.response && err.response.status >= 500) {
            router.push('/500')
        }
        if (!err.response) {
            router.push('/500')
        }
        return Promise.reject(err)
    }
)

export default http
