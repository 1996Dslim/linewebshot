<template>
    <div class="field full" v-if="target === 'counter' && mold">
        <div class="info_input">
            <div class="line">
                <div class="box in" style="min-height: 52px; display: flex;">
                    <span>카운터</span>
                    <input type="text" :value="mold.moldName" disabled style="color: #fff; min-width: 100px;">
                    <div style="color:#fff;"></div>
                </div>
            </div>
            <div class="line">
                <div class="box in" style="min-height: 52px; display: flex;">
                    <span>금형</span>
                    <input type="text" :value="mold.moldName + '(' + mold.moldCode + ')'" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>         
    </div>

    <div class="field full" v-if="target === 'preset' && mold">
        <div class="info_input">
            <div class="line">
                <div class="box in" style="min-height: 52px; display: flex;">
                    <span>카운터 ID</span>
                    <input type="text" :value="mold.moldName" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>         
    </div>

    <div class="field full" >                        
        <div class="title">
            <div class="field_title_wrap">
                <div class="info_img">

                </div>
                <span class="text">기본 정보</span>
            </div>
        </div>
        <div class="info_input" v-if="mold">
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>금형 코드</span>
                    <input type="text" :value="mold.moldName" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 명</span>
                    <input type="text" :value="mold.moldCode" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 종류</span>
                    <input type="text" :value="moldType(mold.moldType)" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 상태</span>
                    <input type="text" :value="moldState(mold.moldState)" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>제작처</span>
                    <input type="text" :value="mold.manufacturer" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>제작차수</span>
                    <input type="text" :value="mold.manufactureOrder" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>재작일자</span>
                    <input type="text" :value="mold.manufactureDate" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>CAVITY</span>
                    <input type="text" :value="mold.cavity" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>보증 SHOT</span>
                    <input type="text" :value="String(mold.shotWarranty).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>점검 SHOT / 알람 SHOT</span>
                    <input type="text" :value="String(mold.shotInspection).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>기준 C/T</span>
                    <input type="text" :value="baseCycleTime + ' (초)'" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>C/T 오차범위</span>
                    <input type="text" :value="'+- ' + mold.ctErrMargin / 1000  + ' (초)'" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>일별기준시간</span>
                    <input type="text" :value="mold.dailyBaseTimes / 60 +' 시간'" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>일별기준생산량</span>
                    <input type="text" :value="String(mold.dailyBaseOutput).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>등록자</span>
                    <input type="text" :value="mold.creator.userName" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>등록일시</span>
                    <input type="text" :value="createdAt" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>                  
    </div>

    <div class="field full" v-if="target != 'counter' && target != 'preset'">
        <div class="title">
            <div class="field_title_wrap">
                <div class="info_img"></div>
                <span class="text"> 추가 정보 </span>
            </div>
        </div>
        <div class="info_input">
            <div class="line">
                <div class="box in" v-for="custom in moldCustoms" :key="custom" style="width: 337px; flex-grow: 0;">
                    <span>{{custom.customCode.codeName}}</span>
                    <input type="text" v-model="custom.customValue" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>
    </div>

    <div class="field full" >                        
        <div class="title">
            <div class="field_title_wrap">
                <div class="info_img">

                </div>
                <span class="text">통신 정보</span>
            </div>
        </div>
        <div class="info_input" v-if="commInfo">
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>터미널 ID</span>
                    <input type="text" :value="commInfo.terminal.terminalId" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>터미널위치</span>
                    <input type="text" :value="commInfo.terminal.locationName" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>카운터 ID</span>
                    <input type="text" :value="commInfo.cdata.counterId" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>최종 통신시간</span>
                    <input type="text" :value="shotReceivedAt" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>최종 SHOT</span>
                    <input type="text" :value="commInfo.cdata.shotCount ? String(commInfo.cdata.shotCount).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '' " disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>최종 C/T</span>
                    <input type="text" :value="commInfo.cdata.cycleTime" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>                  
    </div>
    <div class="field full" v-if="target != 'counter' && target != 'preset'">                        
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
import MoldApi from '~/apis/mold';
import CustomCodeApi from '~/apis/commoncd';
//import AttachedFileApi from '~/apis/attachedFile';

import { useStore } from "vuex";
import { reactive, ref } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core';

export default {
    props: {
        id: {
            type: Number,
        },
        target: String,
    },
    setup(props) {
        const store = useStore();
        console.log("infomold id : ", props.id)
        console.log("infomold target : ", props.target);
        const id = ref(props.id);
        const target = ref(props.target);
        const mold = ref();
        const moldCustoms = ref([]);
        const commInfo = ref();
        const baseCycleTime = ref(0);
        const createdAt = ref(new Date());
        const shotReceivedAt = ref();
        const file_name = ref('파일을 첨부해주세요.');
        const file_label = ref('');

        
        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });

        const moldType = (text) => {
            if(text === 'injection'){
                return '사출'
            }
            else if(text === 'press'){
                return '프레스'
            }
            else {
                return '다이케스팅'
            }
        }

        const moldState = (text) => {
            if(text === 'mass'){
                return '양산'
            }
            else if(text === 'dev'){
                return '개발'
            }
            else if(text === 'idle'){
                return '유휴'
            }
            else if(text === 'as'){
                return 'A/S'
            }
            else {
                return '폐기'
            }
        }
        
        findMold();
        findMoldCommInfo();
        
        function findMold() {
            console.log('Get mold by id...', id.value);
            MoldApi.getMold(id.value).then((res) => {
                console.log('Get mold response...', res.data);
                if (res.data.companyId === user.value.companyId) {
                    mold.value = res.data;
                    baseCycleTime.value = mold.value.ctBase / 1000;
                    createdAt.value = mold.value.createdAt; //.slice(0,10) + " " + mold.value.createdAt.slice(11,19);
                    // if (res.data.manufactureDate) {
                    //     this.mold.manufactureDate = this.$moment(res.data.manufactureDate).format('YYYY-MM-DD');
                    // }
                    moldCustoms.value = mold.value.moldCustoms;
                }
            //this.findModFiles();
            });
        }

        async function findMoldCommInfo() {
            let time = "";
            const res = await MoldApi.getMoldCommInfo(id.value);
            if (res && res.data) {
                commInfo.value = res.data;
                
                if(res.data.cdata.shotReceivedAt) {
                    time = res.data.cdata.shotReceivedAt;
                    shotReceivedAt.value = time
                }
            }
        }
            
        const handleFileChange = (e) => {
            file_name.value = e.target.files[0].name;
            file_label.value = '#26c8fd';
        }

        return {
            file_name, file_label, frames, mold, commInfo, baseCycleTime, target, moldCustoms, createdAt, shotReceivedAt, 
            handleFileChange ,moldState ,moldType
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
</style>