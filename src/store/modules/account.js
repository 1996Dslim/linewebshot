import Swal from 'sweetalert2'
import AES from 'crypto-js/aes';

import {SETTINGS} from '../../config';

import Auth from '../../apis/auth';

const account = {
    namespaced: true,
    state: {
        user: localStorage.getItem(SETTINGS.userToken) || null,
        token: localStorage.getItem(SETTINGS.tokenName) || '',
        refreshToken: localStorage.getItem(SETTINGS.refreshTokenName) || '',
        lge: process.env.VUE_APP_NODE_ENV === 'LGE',
        newUser: null,
        tempToken: ''
    },
    getters: {
        signedInUser: (state) => {
            return state.user
        },
        isAuthenticated: (state) => {
            return !!state.token
        },
        signedToken: (state) => {
            return state.token
        },
        isLG: (state) => {
            return state.lge
        },
        newSignedInUser: (state) => {
            return state.newUser
        },
        tempToken: (state) => {
            return state.tempToken
        }
    },
    mutations: {
        storeUser: (state, data) => {
            localStorage.setItem(SETTINGS.userToken, JSON.stringify(data.user))
            localStorage.setItem(SETTINGS.tokenName, data.token)
            localStorage.setItem(SETTINGS.refreshTokenName, data.refreshToken)
            state.user = data.user
            state.token = data.token
            state.refreshToken = data.refreshToken
        },
        clearUser: (state) => {
            localStorage.removeItem(SETTINGS.userToken)
            localStorage.removeItem(SETTINGS.tokenName)
            localStorage.removeItem(SETTINGS.refreshTokenName)
            state.user = null
            state.token = null
            state.refreshToken = null
        },
        refreshUser: (state, data) => {
            localStorage.setItem(SETTINGS.tokenName, data.token)
            localStorage.setItem(SETTINGS.refreshTokenName, data.refreshToken)
            state.token = data.token
            state.refreshToken = data.refreshToken
        },
        storeNewUser: (state, data) => {
            state.newUser = data.user
            state.tempToken = data.token
        },
        clearNewUer: (state) => {
            state.newUser = null
            state.tempToken = null
        }
    },
    actions: {
        login: ({ commit }, userData) => {
            return new Promise((resolve) => {
                Auth.signin(userData).then((res) => {
                    if (res.data) {
                        if (res.data.user.userState === 'R' && !res.data.user.updatedAt) {
                            commit('storeNewUser', res.data)
                            resolve(res.data)
                            return
                        }
                        if (res.data.user.userState === 'T' && !res.data.user.updatedAt) {
                            resolve(res.data)
                            return
                        }
                        if (userData.rememberMe) {
                            localStorage.setItem('FORM_USER', AES.encrypt(JSON.stringify(userData), "AIzaSyDuTPRXnowd8sPuhSV6RmBUFohGsZ7rbWA").toString())
                        } else {
                            localStorage.removeItem('FORM_USER')
                        }
                        commit('storeUser', res.data)
                        resolve(res.data)
                    } else {
                        throw 'User not found.'
                    }
                }).catch((err) => {
                    let msg = '아이디와 비밀번호를 확인해 주세요.'
                    if (err.data) {
                        msg += "<p style=\"color: red\">(".concat(err.data, ")</p>")
                    }
                    Swal.fire({
                        icon: 'error',
                        title: '로그인 실패',
                        html: msg
                    })
                })
            })
        },
        logout: ({ commit }) => {
            return new Promise((resolve) => {
                Auth.signout()
                commit('clearUser')
                resolve()
            })
        },
        refresh: ({ commit }) => {
            return new Promise((resolve) => {
                const userData = {
                    refreshToken: localStorage.getItem(SETTINGS.refreshTokenName)
                }
                console.log('To refresh toke...', userData)
                Auth.refresh(userData).then((res) => {
                    console.log('refresh res...', res)

                    if (res.data) {
                        commit('refreshUser', res.data)
                        resolve(res.data)
                    } else {
                        throw 'User not found.'
                    }
                }).catch(() => {
                    resolve()
                    Vue.swal({
                        icon: 'error',
                        title: '로그인 재시도 실패',
                        text: '시스템이 불안정 하거나 네트워크 '
                    })
                })
            })
        },
        remoteLogin: ({ commit }, userData) => {
            return new Promise((resolve) => {
                Auth.remoteSignIn(userData.id, userData.remoteId).then((res) => {
                    if (res.data) {
                        if (res.data.user.userState === 'R' && !res.data.user.updatedAt) {
                            throw Error({
                                data: '미승인 계정입니다.'
                            })
                        }
                        commit('storeUser', res.data)
                        resolve(res.data)
                    } else {
                        throw Error({
                            data: '사용자 정보가 없습니다.'
                        })
                    }
                }).catch((err) => {
                    let msg = ''
                    if (err.data) {
                        msg += "<p style=\"color: red\">(".concat(err.data, ")</p>")
                    }
                    Swal({
                        icon: 'error',
                        title: '로그인 실패',
                        html: msg,
                    })
                })
            })
        }
    }
}

export default account