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
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">카운터 조회</label>
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
                <CounterInfo v-if="meuninfo === '1'" :id="id" :target="'counter'"/>
            </div>
        </div>
    </div>
</template>

<script>
import CounterInfo from "~/components/modal/indicator/IndicatorInfo.vue";

import _ from 'lodash';

import { CODES } from '~/config';
import { useStore } from "vuex";
import ApprovalApi from '~/apis/approval';
import CompanyApi from '~/apis/company';
import CounterApi from '~/apis/counter';
import CustomCodeApi from '~/apis/commoncd';
import MoldApi from '~/apis/mold';

import { computed, ref } from '@vue/reactivity';
import Swal from 'sweetalert2';

export default {
    components: {
        CounterInfo,
    },
    props: {
        editItem: {
            type: Object,
        },
    },
    setup(props) {
        const store = useStore();
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const meuninfo = ref('1');
        const id = ref(props.editItem.moldId);
        const counterId = ref(null);
        const moldCounter = ref(null);
        const counters = ref([]);
        const isSearchingItem = ref(false);
        const selectedItem = ref(null);
        const molds = ref([]);
        const isSearchingMold = ref(false);
        const searchedMold = ref(null);
        // searchMold: null,
        const moldTypes = ref([]);
        const moldStates = ref([]);
        
        async function getMemberName() {
            if (searchedMold.value && searchedMold.value.creatorId) {
                const res = await CompanyApi.getMember(
                user.value.companyId,
                searchedMold.value.creatorId,
                );
                if (res.data) {
                searchedMold.value = {
                    ...{ creator: res.data },
                    ...searchedMold.value,
                };
                }
            }
        }
        async function getMoldTypes() {
            CustomCodeApi.getCode(1, 'MOLD_TYPES').then(res => {
                if (res.data) {
                    moldTypes.value = JSON.parse(res.data[0].codeElements);
                } else {
                    moldTypes.value = CODES.MOLD_TYPES[locale];
                }
            });
        }
        async function getMoldStates() {
            CustomCodeApi.getCode(1, 'MOLD_STATES').then(res => {
                if (res.data) {
                    moldStates.value = JSON.parse(res.data[0].codeElements);
                } else {
                    moldStates.value = CODES.MOLD_STATES[locale];
                }
            });
        }
        async function getMolds() {
            isSearchingMold.value = true;
            // 카운터와 매칭되어 있는 금형은 제외
            // 금형명, 금형코드로 조회
            try {
                MoldApi.searchUnmatchingMolds(user.value.companyId)
                .then(res => {
                    if (res.data) {
                        molds.value = res.data.map(d => {
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
            } catch (ex) {
                Swal.fire({
                    icon: 'error',
                    html: '금형목록 조회 중 오류가 발생하였습니다.<br />잠시 후 다시 시도해 주세요.',
                });
                console.error(ex);
            } finally {
                isSearchingMold.value = false;
            }
        }
        function getMoldCounter() {
            CounterApi.getMoldCounter(counterId.value).then(res => {
                console.log(res);
                if (res.data) {
                    moldCounter.value = {
                        id: res.data.mold.id,
                        counterId: res.data.counterId,
                        moldName:
                        res.data.mold.moldName + ' (' + res.data.mold.moldCode + ')',
                    };
                selectedItem.value = {
                    deviceId: res.data.counterId,
                };
                searchedMold.value = _.cloneDeep(moldCounter.value);
                }
            });
        }

        function findList() {
            counters.value = [];
            isSearchingItem.value = true;
            try {
                ApprovalApi.getApprovedRequestsRestDeviceByCorp(
                user.value.companyId,
                'counter',
                )
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

        function saveItem() {
            console.log('### counter...', selectedItem.value);
            console.log('### mold...', searchedMold.value);
            if (selectedItem.value && searchedMold.value) {
                const data = {
                    moldId: searchedMold.value.id,
                    counterId: selectedItem.value.deviceId,
                    companyId: searchedMold.value.companyId,
                    creatorId: user.value.id,
                };
                CounterApi.saveMoldCounter(data).then(res => {
                    console.log(res);
                    if (res) {
                        Swal.fire({
                            icon: 'success',
                            text: '카운터 정보가 저장되었습니다.',
                        });
                    }
                });
            }
        }

        function expireItem() {
            console.log('To expire counter...', counterId.value);
            try {
                CounterApi.expireMoldCounter(counterId.value).then(res => {
                    if (res.data) {
                        if (!res.data.expiredAt) {
                        Swal.fire({
                            icon: 'error',
                            html:
                            '사용종료 처리 중 에러가 발생했습니다.<br />잠시 후 다시 시도해 주세요.',
                        });
                        }
                        Swal.fire({
                            icon: 'success',
                            html: '사용종료 처리되었습니다.',
                        });
                    }
                });
            } catch (err) {
                Swal.fire({
                icon: 'error',
                html:
                    '저장에 실패하였습니다.<br />동일 현상에 반복될 경우, 관리자에게 문의 바랍니다.',
                });
            }
        }

        return { 
            meuninfo, id 
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
</style>