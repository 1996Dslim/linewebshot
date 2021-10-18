import Swal from 'sweetalert2'
import i18n from '../i18n'
import {store} from "~/store";

// import jwt_decode from 'jwt-decode'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_URI + '/api/v1/mms'
axios.defaults.timeout = 10 * 1000
axios.defaults.headers['Cache-Control'] = 'no-cache,no-store,must-revalidate,max-age=-1,private'
// axios.defaults.withCredentials = true --> spring boot cors allowedOrigins -> '*' 불가능.

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

const service = axios.create()
service.interceptors.request.use((config) => {
    const token = store.getters['account/signedToken'] || store.getters['account/tempToken']
    if (token) {
        // console.log('JWT decoded...', jwt_decode(token))
        config.headers.Authorization = "Bearer ".concat(token)
    }
    return config
}, (error) => {
    Promise.reject(error)
})

service.interceptors.response.use((response) => {
    return response
}, (error) => {
    try {
        console.log('*** error *** ', error)
        if (error.response.status === 401) {
            if (error.response.config.url !== '/auth/signin') {
                Swal({
                    title: i18n.$t('expiredSession'),
                    text: i18n.$t('expiredSessionConfirmMsg'),
                    showCancelButton: true,
                    confirmButtonText: i18n.$t('retryLogin'),
                    cancelButtonText: i18n.$t('cancel'),
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        store.dispatch('account/refresh').then(() => {
                            location.reload()
                        })
                    } else {
                        store.dispatch('account/logout').then(() => {
                            location.href = '/'
                        })
                    }
                })
                return
            }
        }
    } catch (err) {//
    }
    return Promise.reject(error.response)
})

export default service
