<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="field_title_wrap">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>장비관리 > 카운터관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">카운터 등록</label>
                    </div>         
                </div>
                <div class="btnarea">
                    <div class="btn" @click="$emit('close-modal')">
                        <span class="material-icons">
                            close
                        </span>
                        <span>닫 기</span>
                    </div>
                </div>
            </div>
            <div class="modal_body">
                <div class="counter_input_box">
                    <div class="counter_line">
                        <span>카운터</span>
                        <div class="img"></div>
                        <div class="counter_input">
                            <input list="search_counter"  type="text" placeholder="검색하실 [카운터ID]를 입력해 주세요">
                            <datalist id="search_counter">
                                <option value="test"></option>
                            </datalist>
                        </div>
                    </div>
                    <div class="counter_line">
                        <span>금형</span>
                        <div class="img"></div>
                        <div class="counter_input">
                            <input list="search_mold"  type="text" placeholder="검색하실 [금형명 또는 금형코드]를 입력해 주세요">
                            <datalist id="search_mold">
                                <option value="test"></option>
                            </datalist>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import { CODES } from '~/config';

import ApprovalApi from '~/apis/approval';
import CompanyApi from '~/apis/company';
import CounterApi from '~/apis/counter';
import CustomCodeApi from '~/apis/commoncd';
import MoldApi from '~/apis/mold'
import { useStore } from "vuex";

import { computed, ref } from '@vue/reactivity';
import Swal from 'sweetalert2';

export default {
    setup() {
        const store = useStore();
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const searchedMold = ref(null);
        const counters = ref([]);
        const isSearchingItem = ref(false);
        const isSearchingMold = ref(false);
        const molds = ref([]);

        const meuninfo = ref('1');

        findList()
        getMolds()
        
        //getMemberName()
        async function getMemberName() {
            console.log(searchedMold.value && searchedMold.value.creatorId)
            if (searchedMold.value && searchedMold.value.creatorId) {
                const res = await CompanyApi.getMember( user.value.companyId, searchedMold.creatorId);
                console.log(res.data)
                if (res.data) {
                    searchedMold.value = {
                        ...{ creator: res.data },
                        ...searchedMold,
                    };
                }
            }
            console.log(searchedMold.value)
        }

        async function getMolds() {
            isSearchingMold.value = true;
            // 카운터와 매칭되어 있는 금형은 제외
            // 금형명, 금형코드로 조회
            try {
                MoldApi.searchUnmatchingMolds(user.value.companyId)
                .then(res => {
                    if (res.data) {
                        molds = res.data.map(d => {
                            return {
                            ...{
                                text:
                                d.moldCode +
                                ' - ' +
                                d.manufactureOrder +
                                ' (' +
                                d.moldName +
                                ')',
                            },
                            ...d,
                            };
                        });
                    }
                })
                .catch(err => {
                    console.log('Failed to get molds...', err);
                    throw err;
                });
            } catch (error) {
                Swal.fire({
                icon: 'error',
                // text:
                //     this.$t('failedAction', [this.$t('mold')]) +
                //     ' ' +
                //     this.$t('tryAgain'),
                });
            } finally {
                isSearchingMold.value = false;
            }
        }

        function getMoldCounter() {
            CounterApi.getMoldCounter(this.counterId).then(res => {
                console.log(res);
                if (res.data) {
                this.moldCounter = {
                    id: res.data.mold.id,
                    counterId: res.data.counterId,
                    moldName:
                    res.data.mold.moldName + ' (' + res.data.mold.moldCode + ')',
                };
                this.selectedItem = {
                    deviceId: res.data.counterId,
                };
                this.searchedMold = _.cloneDeep(this.moldCounter);
                }
            });
        }

        function findList() {
            counters.value = [];
            isSearchingItem.value = true;
            try {
                ApprovalApi.getApprovedRequestsRestDeviceByCorp(user.value.companyId, 'counter')
                .then(res => {
                    console.log('Get approval requests...', res.data);
                    if (res.data) {
                        counters.value = res.data.filter(
                            d => d.deviceType === 'counter' && d.progressState === 'F',
                        );
                    }
                })
                .catch(err => {
                    throw err;
                })
                .finally(() => (isSearchingItem.value = false));
            } catch (err) {
                console.log(err);
            }
        }            

        return { meuninfo }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";

//수정
.counter_input_box {
    background-color: rgb(24, 28, 56);
    border-color: rgb(24, 28, 56);
    padding: 13px 39px 20px;
    .counter_line {
        display: flex;
        height: 52px;
        width: 100%;
        margin-top: 15px;
        background-color: rgb(9, 21, 46);
        border-bottom: rgb(115, 151, 253) solid 1px ;
        color: rgb(115, 151, 253);
        line-height: 52px;
        padding-left: 12px;
        align-items: center;
        span {
            display: block;
            width: 163px;
        }
        .img {
            width: 24px;
            height: 24px;
            background-image: url("~/assets/management/counter/counter_registration.png");
        }
        .counter_input {
            max-width: 600px;
            width: 600px;
            padding-left: 30px;
            input {
                width: 90%;
                background-color: rgb(9, 21, 46);
                color: #fff;
                outline: 0;
                border: 0;
            }
        }
    }
}
</style>