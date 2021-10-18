<template>
    <div class="field full">                        
        <div class="title">
            <div class="field_title_wrap">
                <div class="info_img"></div>
                <span class="text">기본정보</span>
            </div>
            <div class="btn medium" @click.prevent="saveItem(1)">저장</div>
        </div>
        <div class="info_input">
            <div class="line">
                <div class="box in" style="width: 100px;  max-width: 255px;">
                    <span>금형 코드</span>
                    <input type="text" v-model="mold.moldCode" @keydown="checkMoldCode" style="color: #fff; min-width: 100px;" >
                </div>
                <div class="btn small" @click="duplicateMoldCode">
                    중복<br>확인
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 명</span>
                    <input type="text" v-model="mold.moldName" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 종류</span>
                    <select v-model="selectmodalType" class="modal_select" name="" id="" style="height: 32px;">
                        <option value="injection">사출</option>
                        <option value="press">프레스</option>
                        <option value="die-casting">다이케스팅</option>
                    </select>
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 상태</span>
                    <select v-model="selectMoldState" class="modal_select" name="" id="" style="height: 32px;">
                        <option value="mass" selected>양산</option>
                        <option value="dev">개발</option>
                        <option value="idle">유휴</option>
                        <option value="as">A/S</option>
                        <option value="disposal">폐기</option>
                    </select>
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>제작차수</span>
                    <input type="number" v-model="mold.manufactureOrder"  style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>제작처</span>
                    <input type="text" v-model="mold.manufacturer" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>제작일자</span>
                    <input type="text" v-model="mold.manufactureDate" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>CAVITY</span>
                    <input type="number" v-model="mold.cavity" style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>보증 SHOT</span>
                    <input type="text" v-model.lazy="mold.shotWarranty" v-money3="config" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>점검/알람 SHOT</span>
                    <input type="text" v-model.lazy="mold.shotInspection" v-money3="config" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>기준 C/T (단위: 초)</span>
                    <input type="text" v-model="baseCycleTime" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>C/T 오차범위 (단위: 초)</span>
                    <div style="display: flex;">
                        <span style="color: #fff;">(+-)</span>
                        <input type="text" v-model="ctErrMargin" style="color: #fff; min-width: 100px;">  
                    </div>
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>일별기준시간</span>
                    <input type="number" v-model="dailyBaseTimes" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>일별기준생산량</span>
                    <input type="text" v-model.lazy="mold.dailyBaseOutput" v-money3="config" style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>등록자</span>
                    <input type="text" v-model="user.userName" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>등록일시</span>
                    <input type="text" v-model="createdAt" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>                  
    </div>

    <div class="field full">
        <div class="title">
            <div class="field_title_wrap">
                <div class="info_img"></div>
                <span class="text"> 추가 정보 </span>
            </div>
            <div class="btn medium" @click.prevent="saveItem(2)">저장</div>
        </div>
        <div class="info_input">
            <div class="line">
                <div class="box in" v-for="custom in moldCustoms" :key="custom" style="width: 337px; flex-grow: 0;">
                    <span>{{custom.customCode.codeName}}</span>
                    <input type="text" v-model="custom.customValue" style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>
    </div>
    
    <div class="field full">                        
        <div class="title" v-if="moldId">
            <div class="field_title_wrap">
                <div class="info_img"></div>
                <span class="text">통신 정보</span>
            </div>
        </div>
        <div class="info_input" v-if="moldId">
            <div class="line">
                <div class="box in">
                    <span>터미널 ID</span>
                    <input type="text" :value="commInfo.terminal.terminalId" v-if="commInfo.terminal && commInfo.terminal.terminalId" disabled style="color: #fff; min-width: 100px;">
                    <input type="text" :value="commInfo.cdata.terminalId" v-else-if="commInfo.cdata && commInfo.cdata.terminalId" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in">
                    <span>터미널 위치</span>
                    <input type="text" :value="commInfo.terminal.locationName" v-if="commInfo.terminal && commInfo.terminal.locationName" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in">
                    <span>카운터 ID</span>
                    <input type="text" :value="commInfo.cdata.counterId" v-if="commInfo.cdata && commInfo.cdata.counterId" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in">
                    <span>최종 통신시간</span>
                    <input type="text" :value="dayformat(commInfo.cdata.shotReceivedAt)" v-if="commInfo.cdata && commInfo.cdata.shotReceivedAt" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in">
                    <span>최종 SHOT</span>
                    <input type="text" :value="String(commInfo.cdata.shotCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" v-if="commInfo.cdata && commInfo.cdata.shotCount" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in">
                    <span>최종 C/T</span>
                    <input type="text" :value="commInfo.cdata.cycleTime" v-if="commInfo.cdata && commInfo.cdata.cycleTime" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>                  
    </div>

    <div class="field full" v-if="moldId">                        
        <div class="info_input">
            <div class="line">
                <span class="material-icons">
                    attachment
                </span>
                <label for="fileup">파일첨부</label>
                <div class="box in">
                    <input 
                    @change="handleFileChange"
                    id="fileup" type="file"/>
                    <label 
                    v-bind:style="{color: file_label }" 
                    for="fileup">
                        {{file_name}}
                    </label>
                </div>
            </div>
        </div>                  
    </div>

    
</template>

<script>
import { reactive, ref } from '@vue/reactivity';

import { CODES, SETTINGS } from '~/config';
import communication from '~/assets/data/communication.json';
import MoldApi from '~/apis/mold';
import CustomCodeApi from '~/apis/commoncd';
import { computed } from '@vue/runtime-core';
import { useStore } from "vuex";
import Swal from 'sweetalert2';
import { Money3Directive } from 'v-money3'

export default {
    props: {
        id: {
            type: Number,
            default: () => {
                return null;
            },
        },
    },
    directives : { 
        money3: Money3Directive
    },
    setup(props) {
        const  amount = ref('12345.67')
        const store = useStore();
        const ID = ref([]);
        const COMMUNICATION = communication;
        const moldId = ref(null);
        const mold = ref({
                    id: null, //this.moldId,
                    moldName: null,
                    moldCode: null,
                    moldType: 'injection',
                    moldState: 'mass',
                    manufacturer: null,
                    manufactureOrder: 1,
                    manufactureDate: null,
                    cavity: 1,
                    shotWarranty: 300000,
                    shotInspection: 30000,
                    shotAlaram: 0,
                    ctBase: 0,
                    dailyBaseTimes: CODES.DEFAULT_VALUE.DAILY_BASE_TIMES,
                    dailyBaseOutput: 0,
                    companyId: null,
                    creatorId: null,
                    moldCustoms: [],
                });
        const commInfo = ref({});
        const baseCycleTime = ref(0);
        const ctErrMargin = ref(0);
        const dailyBaseTimes = ref(0);
        const moldCustoms = ref([]);
        const originMold = ref({});
        const isDuplicateChecked = ref(false);
        const selectMoldState = ref();
        const selectmodalType = ref();
        const createdAt = computed(() => {
            if (mold.value.createdAt) {
                return "test"
            }
            return "test1"
        });

        const file_name = ref('파일을 첨부해주세요.');
        const file_label = ref('');
        const frames = reactive([
                {
                    title: "통신정보",
                    linenum: 2,
                    text: [
                        ["터미널 ID", "터미널 위치", "카운터 ID", "최종 통신 시간"],
                        ["최종 SHOT", "최종C/T"]
                    ],
                    value: [
                        [COMMUNICATION.terminal.terminalId, COMMUNICATION.terminal.locationName, COMMUNICATION.cdata.counterId, COMMUNICATION.cdata.lastShotAt],
                        [COMMUNICATION.cdata.lastShotAt,COMMUNICATION.cdata.cycleTime],
                    ]
                },
            ]);
        
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const config = ref({
            decimal: '',
            thousands: ',',
            prefix: '',
            suffix: '',
            precision: 0,
            masked: true,
        });
        

        if(props.id !== null) {
            moldId.value = props.id; //|| $route.params.id;
            //mold.value.id = props.id;
            console.log("props.id", props.id);
            console.log("moldId", moldId.value);
        }
        else {
            moldId.value = "register";
        }
        //init;
        if (!!moldId.value && moldId.value !== 'register') {
            findMold();
            findMoldCommInfo();
        }
        else {
            console.log('Registering MODE...', moldId.value);
            moldId.value = null;
            CustomCodeApi.getCodes(user.value.companyId).then((res) => {
                res.data.forEach((cd) => {
                    if (cd.code === 'MOLD_TYPES' || cd.code === 'MOLD_STATES') {
                        return;
                    }
                    mold.value.moldCustoms.push({
                        moldId: mold.value.id,
                        customCode: cd,
                        customCodeId: cd.id,
                        customValue: null,
                        viewOrder: 0,
                        creatorId: user.value.id,
                    });
                });
                moldCustoms.value = _.cloneDeep(mold.value.moldCustoms);
            });
        }

        const handleFileChange = (e) => {
            file_name.value = e.target.files[0].name;
            file_label.value = '#26c8fd';
        }

        const dayformat = (day) => {
            return day.slice(0,4) + "-" + day.slice(4,6) + "-" + day.slice(6,8) + " " + day.slice(8,10) + ":" + day.slice(10,12) + ":" + day.slice(12,14)
        }

        async function findMold() {
            const res = await MoldApi.getMold(props.id);
            console.log('Get mold response...', res);
            if (res.data && res.data.companyId === user.value.companyId) {
                mold.value = res.data;
                baseCycleTime.value = mold.value.ctBase / 1000;
                ctErrMargin.value = mold.value.ctErrMargin / 1000;
                dailyBaseTimes.value = mold.value.dailyBaseTimes / 60;
                if (res.data.manufactureDate) {
                    mold.value.manufactureDate = res.data.manufactureDate; //.slice(0,10);
                }
                //this.findModFiles();
            }
                moldCustoms.value = _.cloneDeep(mold.value.moldCustoms);
                originMold.value = _.cloneDeep(mold.value);
                isDuplicateChecked.value = true;
                selectMoldState.value = mold.value.moldState;
                selectmodalType.value = mold.value.moldType;
        }

        async function findMoldCommInfo() {
            const res = await MoldApi.getMoldCommInfo(props.id);
            if (res && res.data) {
                commInfo.value = res.data;
            }
        }

        function saveItem(idx) {
            if (idx === 1) {
                if (!isDuplicateChecked) {
                    Swal.fire({
                        icon: 'warning',
                        title: '금형코드 중복확인',
                        text: '금형코드는 반드시 중복확인 하셔야 합니다.',
                    });
                    return;
                }
                if (!mold.value.manufactureOrder) {
                    Swal.fire({
                        icon: 'warning',
                        title: '금형코드 중복확인',
                        text: '금형코드와 차수는 입력하신 후 반드시 중복확인 하셔야 합니다.',
                    });
                    return;
                }
                if (!mold.value.manufacturer) {
                    Swal.fire({
                        icon: 'warning',
                        title: '제작처',
                        text: '제작처를 입력해 주세요.',
                    });
                    return;
                }
                let entity = _.cloneDeep(mold.value);
                entity.companyId = user.value.companyId;
                entity.ctBase = baseCycleTime.value * 1000;
                entity.ctErrMargin = ctErrMargin.value * 1000;
                entity.dailyBaseTimes = dailyBaseTimes.value * 60;
                entity.shotWarranty = mold.value.shotWarranty.replace(/,/gi, '');;
                entity.shotInspection = mold.value.shotInspection.replace(/,/gi, '');
                entity.dailyBaseOutput = mold.value.dailyBaseOutput.replace(/,/gi, '');
                entity.moldType = selectmodalType.value;
                entity.moldState = selectMoldState.value;
                console.log('To save mold...', entity);
                // To basic info.
                if (Object.prototype.hasOwnProperty.call(entity, 'id') && entity.id) {
                    MoldApi.saveMold(entity, entity.id)
                        .then((res) => {
                            Swal.fire({
                                icon: 'success',
                                title: '금형 기본 정보 등록',
                                text: '성공적으로 저장되었습니다.',
                            });
                        mold.value = res.data;
                        baseCycleTime.value = mold.value.ctBase / 1000;
                        ctErrMargin.value = mold.value.ctErrMargin / 1000;
                        if (res.data.manufactureDate) {
                            mold.value.manufactureDate = "2021-10-14"//this.$moment(res.data.manufactureDate).format('YYYY-MM-DD');
                        }
                        // this.findMold();
                        })
                        .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: '시스템 오류',
                            html: '금형 기본 정보 등록 중에 오류가 발생하였습니다.<br />잠시 후 다시 시도해 주세요.',
                        });
                    });
                } else {
                    entity.creatorId = user.value.id;
                    MoldApi.saveMold(entity)
                        .then((res) => {
                            console.log(res.data)
                        if (res.data && res.data.id) {
                            Swal.fire({
                                icon: 'success',
                                title: '금형 기본 정보 수정',
                                text: '성공적으로 수정되었습니다.',
                            });
                            moldId.value = res.data.id;
                            mold.value = res.data;
                            baseCycleTime.value = mold.value.ctBase / 1000;
                            ctErrMargin.value = mold.value.ctErrMargin / 1000;
                            if (res.data.manufactureDate) {
                                mold.value.manufactureDate = res.data.manufactureDate//this.$moment(res.data.manufactureDate).format('YYYY-MM-DD');
                            }
                            // this.findMold();
                            // });
                        }
                        })
                        .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: '시스템 오류',
                            html: '금형 기본 정보 수정 중에 오류가 발생하였습니다.<br />잠시 후 다시 시도해 주세요.',
                        });
                    });
                }
            } else if (idx === 2) {
                // To additional info.
                // this.mold.moldCustoms.forEach((cd, i) => {
                moldCustoms.value.forEach((cd, i) => {
                    cd.customCodeId = cd.customCode.id;
                    cd.viewOrder = i;
                    cd.creatorId = user.value.id;
                    cd.moldId = mold.value.id;
                });
                MoldApi.saveMoldCustom(this.moldCustoms)
                .then((res) => {
                    // this.mold.moldCustoms.forEach((cd) => {
                    moldCustoms.value.forEach((cd) => {
                        for (let index = 0; index < res.data.length; index++) {
                            const savedData = res.data[index];
                            if (savedData.customCode.id === cd.customCode.id) {
                                cd = savedData;
                                break;
                            }
                        }
                    });
                    Swal.fire({
                        icon: 'success',
                        title: '금형 추가 정보',
                        text: '성공적으로 저장 되었습니다.',
                    });
                })
                .catch(() => {
                    Swal.fire({
                        icon: 'error',
                        title: '시스템 오류',
                        text: '금형 추가 정보 저장 중에 오류가 발생하였습니다.<br />잠시 후 다시 시도해 주세요.',
                    });
                });
            }
        }

        //중복체크
        function duplicateMoldCode() {
            if (isDuplicateChecked.value) {
                // 중복 체크 한 경우, 패스
                return;
            }
            if (!mold.value.moldCode || !mold.value.manufactureOrder) {
                Swal.fire({
                    title: '중복확인',
                    text: '금형코드와 차수를 입력해 주세요.',
                });
                return;
            }
            if (
                originMold.value.moldCode === mold.value.moldCode &&
                originMold.value.manufactureOrder === mold.value.manufactureOrder
            ) {
                isDuplicateChecked.value = true;
                return;
            }
            const params = {
                moldCode: mold.value.moldCode,
                manufactureOrder: mold.value.manufactureOrder,
            };
            try {
                MoldApi.checkDuplicateMold(params)
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        if (!originMold.value.id) {
                            Swal.fire({
                                icon: 'error',
                                text: '이미 사용 중인 금형코드 입니다.',
                            });
                            mold.value.moldCode = '';
                        } else if (originMold.value.id !== res.data[0].id) {
                            Swal.fire({
                                icon: 'error',
                                text: '이미 사용 중인 금형코드 입니다.',
                            });
                            mold.value.moldCode = _.cloneDeep(originMold.value.moldCode);
                        }
                        isDuplicateChecked.value = false;
                    } else {
                    isDuplicateChecked.value = true;
                    Swal.fire({
                        icon: 'success',
                        text: '사용 가능한 금형코드 입니다.',
                    });
                    }
                })
                .catch((err) => {
                    throw err;
                });
            } catch (error) {
                console.log('Failed to get molds...', error);
                isDuplicateChecked.value = false;
                Swal.fire({
                    icon: 'error',
                    //text: this.$t('failedAction', [this.$t('mold')]) + ' ' + this.$t('tryAgain'),
                });
            }
        }

        function checkMoldCode() {
            isDuplicateChecked.value = false;
        }

        return {
            file_name, file_label, frames, ID, mold, dailyBaseTimes, ctErrMargin, baseCycleTime, user, createdAt, moldId, moldCustoms, commInfo, selectMoldState, selectmodalType, config, amount,
            handleFileChange, duplicateMoldCode, checkMoldCode, saveItem, dayformat,
        }
    }
}
</script>


<style lang="scss" scoped>
    @import "~/scss/main.scss";

    .line:last-child {
        span,
        label {
            height: 16px;
            color: #26c8fd;
            //font-size: 16px;
            font-weight: 500;
            margin:auto 16px auto 0;
        }
        .box {
            &.in{
                min-height: 52px;
                position: relative;
                label {
                    color: #4f5393;
                    top: 0;
                    bottom: 0;
                    margin: auto;
                    padding-left: 12px;
                    position: absolute;
                }
            }
        }
    }

    select,
    option {
        color: #fff;
    }
</style>