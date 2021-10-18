<template>
    <div class="field full" v-for="frame in frames" :key="frame">                        
        <div class="title">
            <div class="field_title_wrap">
                <div class="info_img">

                </div>
                <span class="text">{{ frame.title }}</span>
            </div>
        </div>
        <div class="info_input">
            <div v-for="line, i in frame.text" :key="i" class="line">
                <div v-for="box, index in line" :key="index" class="box in" style="width: 100px;">
                    <span>{{ box }}</span>
                    <input type="text" :value="frame.value[i]" disabled style="color: #fff; min-width: 100px;">
                    
                </div>
            </div>
        </div>                  
    </div>
    <div class="field full">                        
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
//import id from '~/assets/data/36.json';
import communication from '~/assets/data/communication.json';
import mold_states from '~/assets/data/MOLD_STATES.json';
import mold_types from '~/assets/data/MOLD_TYPES.json';

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
        }
    },
    setup(props) {
        const store = useStore();
        const id = ref(props.id);
        const mold = ref();
        const baseCycleTime = ref(0);
        const createdAt = ref(new Date());
        // const COMMUNICATION = communication;
        // const MOLD_STATES = mold_states;
        // const MOLD_TYPES = mold_types;
        
        const file_name = ref('파일을 첨부해주세요.');
        const file_label = ref('');
        
        const frames = [
            {
                title: "기본정보",
                linenum: 4,
                text: [
                        ["금형 코드","금형 종류","금형 명", "금형 상태"],
                        ["제작처","제작차 수","제작일", "CAVITY"],
                        ["보증 SHOT","점검 SHOT / 알람 SHOT (View)","기준 C/T", "C/T 오차범위"],
                        ["일별 기준 시간","일별 기준 생산량","작성자", "작성 일시"]
                    ],
                value: [
                    // [mold.value.moldName, mold.value.moldCode, mold.value.moldType, mold.value.moldState],
                    // [mold.value.manufacturer, mold.value.manufactureOrder, mold.value.manufactureDate, mold.value.cavity],
                    // [mold.value.shotWarranty, mold.value.shotInspection, mold.value.ctBase, mold.value.ctErrMargin],
                    // [mold.value.dailyBaseTimes, mold.value.dailyBaseOutput, mold.value.creator.userName, mold.value.createdAt]
                ] 
            },
            {
                title: "상세정보",
                linenum: 4,
                text: [
                    ["자산 코드","자산명","모델명", "품명"],
                    ["FAMILY","금형 중량(g)","양산처", "양산차 수"],
                    ["금형 소재","레진 소재","금형 크기(가로 X 세로 X 높이) ", "제작처 담장자 / 연락처"],
                    ["양산처 담당자 / 연락처","금형제작 비용(원)"]
                ],
                value: [
                    [],
                    [],
                    [],
                    []
                ]
            },
            {
                title: "통신정보",
                linenum: 2,
                text: [
                    ["터미널 ID", "터미널 위치", "카운터 ID", "최종 통신 시간"],
                    ["최종 SHOT", "최종C/T"]
                ],
                value: [
                    [],
                    []
                    //[COMMUNICATION.terminal.terminalId, COMMUNICATION.terminal.locationName, COMMUNICATION.cdata.counterId, COMMUNICATION.cdata.lastShotAt],
                    //[COMMUNICATION.cdata.lastShotAt,COMMUNICATION.cdata.cycleTime],
                ]
            },
            // {
            //     title: "공유정보",
            //     linenum: 1,
            //     text: [
            //         ["공유 회사/ 공유 유저", "공유 회사"]
            //     ],
            //     value: [
            //         []
            //         //[ID.moldName, ID.moldCode],
            //     ]
            // },
        ];

        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        });
        
        findMold();
        
        
        function findMold() {
            console.log('Get mold by id...', id.value);
            MoldApi.getMold(id.value).then((res) => {
                console.log('Get mold response...', res.data);
                if (res.data.companyId === user.value.companyId) {
                    mold.value = res.data;
                    baseCycleTime.value = mold.value.ctBase / 1000;
                    createdAt.value = mold.value.createdAt;
                    frames[0].value = [
                        [mold.value.moldName, mold.value.moldCode, mold.value.moldType, mold.value.moldState],
                        [mold.value.manufacturer, mold.value.manufactureOrder, mold.value.manufactureDate, mold.value.cavity],
                        [mold.value.shotWarranty, mold.value.shotInspection, mold.value.ctBase, mold.value.ctErrMargin],
                        [mold.value.dailyBaseTimes, mold.value.dailyBaseOutput, mold.value.creator.userName, mold.value.createdAt]
                    ]
                    // if (res.data.manufactureDate) {
                    //     this.mold.manufactureDate = this.$moment(res.data.manufactureDate).format('YYYY-MM-DD');
                    // }
                }
                console.log("test",mold.value);
                // frames[0].value = [
                //         [mold.value.moldName, mold.value.moldCode, mold.value.moldType, mold.value.moldState],
                //         [mold.value.manufacturer, mold.value.manufactureOrder, mold.value.manufactureDate, mold.value.cavity],
                //         [mold.value.shotWarranty, mold.value.shotInspection, mold.value.ctBase, mold.value.ctErrMargin],
                //         [mold.value.dailyBaseTimes, mold.value.dailyBaseOutput, mold.value.creator.userName, mold.value.createdAt]
                //     ]
            //this.findModFiles();
            });
        }

        
            
        const handleFileChange = (e) => {
            file_name.value = e.target.files[0].name;
            file_label.value = '#26c8fd';
        }

        return {
            file_name, file_label, frames,
            handleFileChange
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