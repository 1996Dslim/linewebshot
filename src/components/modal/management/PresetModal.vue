<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="field_title_wrap">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>장비관리 > 카운터 PreSet</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">카운터 PRESET 조회</label>
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
                <div class="counter_input_box" v-if="editItem.id === 'register'">
                    <div class="counter_line">
                        <span>카운터</span>
                        <div class="img"></div>
                        <div class="counter_input">
                            <input list="search_counter" v-model="search" type="text" placeholder="검색하실 [카운터ID]를 입력해 주세요">
                            <datalist id="search_counter">
                                <option v-for="val in molds" :key="val" :value="val.counterId"></option>
                            </datalist>
                        </div>
                    </div>
                </div>  
                <div v-if="searchedMold && searchedMold.moldId">
                    <PresetInfo v-if="searchedMold.moldId" :id="searchedMold.moldId" :target="'counter'"/>
                </div>
                <div class="counter_input_box">
                    <div class="counter_line">
                        <span>SHOT 변경</span>
                        <input type="number" v-model="editItem.presetValue" >
                    </div>
                    <div class="counter_line">
                        <span>충격 세기 값</span>
                        <input type="number" v-model.lazy="editItem.shockThreshold" >
                    </div>
                    <div class="counter_line">
                        <span>알람 값 지정</span>
                        <input type="number" v-model.lazy="editItem.alarmValue" >
                        <label for="cycle">순환여부</label>
                        <input id="cycle" type="checkbox">
                    </div>
                    <div class="counter_line">
                        <span>알림대상자</span>
                        <div class="img"></div>
                        <div class="counter_input">
                            <input list="search_counter_id"  type="text" placeholder="검색하실 [카운터ID]를 입력해 주세요">
                            <datalist id="search_counter_id">
                                <option value="test"></option>
                            </datalist>
                        </div>
                        <div class="btn">추가</div>
                    </div>
                    <div class="counter_line">
                        <span>작성자</span>
                        <div class="counter_input">
                            <input v-if="editItem.creatorId && editItem.user" type="text" v-model="editItem.user.userName" disabled>
                            <input v-else type="text" v-model="user.userName" disabled>
                        </div>
                        <span>작성일자</span>
                        <div class="counter_input">
                            <input v-if="editItem.createdAt" type="text" v-model="editItem.createdAt" disabled>
                        </div>
                    </div>
                </div>

                <div class="btnarea" style="margin-top: 15px;">
                    <div class="btn medium" @click="saveItem">
                        <span>저장</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import PresetInfo from "~/components/modal/indicator/IndicatorInfo.vue";

import { ref } from '@vue/reactivity';

import { useStore } from "vuex";
import _ from 'lodash';
import ApprovalApi from '~/apis/approval';
import CompanyApi from '~/apis/company';
import CounterApi from '~/apis/counter';
import NotificationApi from '~/apis/notification';
import { computed, watchEffect } from '@vue/runtime-core';
import Swal from 'sweetalert2';

export default {
    props: {
        editItem: {
            type: Object,
        },
    },
    components: {
        PresetInfo,
    },
    setup(props) {
        const editItem = ref(props.editItem);
        //console.log("뭐일까", editItem.value);
        //const id = ref(props.editItem.moldId);
        //const target = ref(props.target);
        const meuninfo = ref('1');
        const counterId = ref(null);
        const presetId = ref(null);
        const preset = ref({
            presetValue: 0,
            shockThreshold: 0,
            alarmValue: 0,
        });
        const alarmManagers = ref([]);
        const isCheckAlarmCycle = ref(false);
        const searchedMold = ref(props.editItem.moldId);
        const molds = ref([]);
        const managers = ref([]);
        const search = ref("");

        const store = useStore();
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        if (props.editItem && props.editItem.id && props.editItem.id !== 'register') {
            presetId.value = props.editItem.id;
            counterId.value = props.editItem.counterId;
            getPreset();
        }
        if (!counterId.value) {
            getMoldCounters();
        }
        console.log('This preset...', preset.value);
        searchManager();

        watchEffect(() => {
            searchedMold.value = null
            molds.value.forEach((e) => {
                if(e.counterId === search.value){
                    counterId.value = e.counterId;
                    searchedMold.value = e;
                }
            })
        })

        function getPreset() {
            CounterApi.getCounterPreset(presetId.value).then(res => {
                console.log('Get counter preset...', res.data);
                if (res.data.counter_id) {
                    counterId.value = res.data.counter_id;
                }
                if (res.data.preset) {
                    preset.value = res.data.preset;
                if (preset.value.managers) {
                    preset.value.managers.forEach(m => {
                        let mgr = _.cloneDeep(m);
                        mgr.notificationMethod = JSON.parse(m.notificationMethod);
                        alarmManagers.value.push(mgr);
                    });
                    console.log('This alarm managers...', alarmManagers.value);
                }
                }
                isCheckAlarmCycle.value = preset.value.alarmCycleMode === 'Y';
                getMold();
            });
        }

        async function getMold() {
            console.log('This counterId...', counterId.value);
            const res = await CounterApi.getMoldCounter(counterId.value);
            console.log('Get mold......', res.data);
            if (res && res.data) {
                const molds = res.data.filter(d => !d.expiredAt);
                console.log()
                if (molds.length > 0) {
                    searchedMold.value = {
                        moldId: molds[0].mold.id,
                        counterId: molds[0].counterId,
                    };
                } else {
                    searchedMold.value = {
                        moldId: null,
                        counterId: null,
                    };
                }
            }
        }

        async function getMoldCounters() {
            // 프리셋이 적용되어 있지 않은 승인된 카운터, left join 금형 정보
            try {
                const res = await ApprovalApi.searchNoPresetApprovedMoldCounter(
                    user.value.companyId,
                );
                console.log('getMoldCounters ======> ', res);
                if (res && res.data) {
                    molds.value = res.data.map(d => {
                        console.log(d);
                        if (counterId.value && counterId.value === d.counterId) {
                            searchedMold.value = d;
                        }
                        let option = '';
                        if (d.moldName) {
                            option = ' (' + d.moldName + ')';
                        }
                        return {
                            ...{ text: d.counterId + option },
                            ...d,
                        };
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    text: '카운터 조회 중에 오류가 발생하였습니다.',
                });
            }
        }

        async function searchManager() {
            const tms = _.cloneDeep(alarmManagers.value);
            const res = await CompanyApi.getMembersByCompany(user.value.companyId);
            if (res) {
                if (tms.length > 0) {
                    managers.value = res.data.filter(val => {
                        for (let index = 0; index < tms.length; index++) {
                            if (val.id === tms[index].user.id) {
                                return false;
                            }
                        }
                        return true;
                    });
                } else {
                    managers.value = res.data;
                }
            }
        }

        function saveItem() {
            if (!counterId.value) {
                Swal.fire({
                    icon: 'warning',
                    text: '카운터를 선택해 주세요.',
                });
                return;
            }
            if (!preset.value.presetValue) {
                // alert('SHOT 변경 값을 입력하셔야 합니다.');
                // return;
                preset.value.presetValue = 0;
            }
            if (!preset.value.shockThreshold) {
                // alert('충격 세기 값을 입력하셔야 합니다.');
                // return;
                preset.value.shockThreshold = 0;
            }
            if (isCheckAlarmCycle.value && !preset.value.alarmValue) {
                // alert('순환을 지정된 경우는 반드시 알람 값을 입력하셔야 합니다.');
                // return;
                preset.value.alarmValue = 0;
            }
            const presetVal = (preset.value.presetValue + '').replaceAll(/,/gi, '');
            const shockThrVal = (preset.value.shockThreshold + '').replaceAll(
                /,/gi,
                '',
            );
            const alarmVal = (preset.value.alarmValue + '').replaceAll(/,/gi, '');
            const item = {
                id: presetId.value,
                counterId: counterId.value,
                // presetSetting: presetVal === '0' ? 'N' : 'Y',
                presetSetting: 'Y',
                presetValue:
                presetVal.indexOf(',') != -1
                    ? presetVal.replaceAll(/,/g, '')
                    : presetVal,
                // shockThresholdSetting: shockThrVal === '0' ? 'N' : 'Y',
                shockThresholdSetting: 'Y',
                shockThreshold:
                shockThrVal.indexOf(',') != -1
                    ? shockThrVal.replaceAll(/,/g, '')
                    : shockThrVal,
                // alarmSetting: alarmVal === '0' ? 'N' : 'Y',
                alarmSetting: 'Y',
                alarmValue:
                alarmVal.indexOf(',') != -1
                    ? alarmVal.replaceAll(/,/g, '')
                    : alarmVal,
                alarmCycleMode: isCheckAlarmCycle.value ? 'Y' : 'N',
                creatorId: preset.value.creatorId | user.value.id,
                companyId: preset.value.companyId | user.value.companyId,
                managers: [],
            };
            alarmManagers.value.forEach(tm => {
                const notiTarget = {
                    ...tm,
                    targetUser: tm.user.id,
                    notificationMethod: JSON.stringify(tm.method),
                };
                delete notiTarget.method;
                delete notiTarget.user;
                item.managers.push(notiTarget);
            });
            CounterApi.saveCounterPreset(item, presetId.value)
                .then(res => {
                    if (res.data) {
                        preset.value = res.data;
                        presetId.value = preset.value.id;
                        counterId.value = preset.value.counterId;
                        Swal.fire({
                            icon: 'success',
                            title: 'PreSet 저장',
                            text: 'PreSet이 저장 되었습니다.',
                        }) //.then(() => this.$emit('close'));
                    }
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'PreSet 저장',
                        text: 'PreSet 저장에 실패하였습니다.',
                    });
                });
            }

        return { 
            meuninfo, editItem, user, searchedMold, molds, search, saveItem
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";

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
        color: #26c8fd;
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
        input[type = number] {
            background-color: rgb(9, 21, 46);
            color: #fff;
            outline: 0;
            border: 0;
            border-bottom: rgb(115, 151, 253) solid 1px ;
            margin-right: 15px;
        }

        .counter_input {
            display: flex;
            max-width: 600px;
            width: 600px;
            padding-left: 30px;
            input {
                width: 90%;
                background-color: rgb(9, 21, 46);
                color: #fff;
                outline: 0;
                border: 0;

                &:disabled {
                    color: rgb(115, 151, 253);
                }
            }
        }
    }
}
</style>