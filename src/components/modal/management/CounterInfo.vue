<template>
    <div class="field full">
        <div class="info_input">
            <div class="line">
                <div class="box in" style="min-height: 52px; display: flex;">
                    <span>카운터</span>
                    <input type="text" value="test" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="min-height: 52px; display: flex;">
                    <span>금형</span>
                    <input type="text" value="test" disabled style="color: #fff; min-width: 100px;">
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
        <div class="info_input">
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>금형 코드</span>
                    <input type="text" :value="moldCounter" disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 명</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 종류</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>금형 상태</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>제작처</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>제작차수</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>재작일자</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>CAVITY</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>보증 SHOT</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>점검 SHOT / 알람 SHOT</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>기준 C/T</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>C/T 오차범위</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
            <div class="line">
                <div class="box in" style="width: 100px;">
                    <span>일별기준시간</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>일별기준생산량</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>등록자</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
                <div class="box in" style="width: 100px;">
                    <span>등록일시</span>
                    <input type="text"  disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>                  
    </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity';
import { useStore } from "vuex";
import { computed } from '@vue/runtime-core';
import { CODES } from "~/config";
import ApprovalApi from "~/apis/approval";
import CustomCodeApi from "~/apis/commoncd";
import MoldApi from "~/apis/mold";
import CounterApi from "~/apis/counter";

export default {
    props: {
        id: {
            type:Number,
        }
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

        const counters = ref([]);
        const isSearchingItem = ref(false);
        const moldTypes = ref([]);
        const moldStates = ref([]);
        const isSearchingMold = ref(false);
        const molds = ref([]);
        const counterId = ref(props.id);
        const moldCounter = ref(null);
        const selectedItem = ref(null);
        const searchedMold = ref(null);

        const frames = reactive([
            {
                title: "기본정보",
                text: [
                        ["금형 코드","금형 종류","금형 명", "금형 상태"],
                        ["제작처","제작차 수","제작일", "CAVITY"],
                        ["보증 SHOT","점검/알람 SHOT","기준 C/T", "C/T 오차범위"],
                        ["일별 기준 시간","일별 기준 생산량","등록자", "등록 일시"]
                    ] 
            },
            {
                title: "통신정보",
                text: [
                    ["터미널 ID", "터미널 위치", "카운터 ID", "최종 통신 시간"],
                    ["최종 SHOT", "최종C/T"]
                ]
            },
        ]);


        if (!!counterId.value && counterId.value !== "register") {
            getMoldCounter();
        }
        getMoldTypes();
        getMoldStates();
        getMolds();
        findList();

        async function getMoldTypes() {
            CustomCodeApi.getCode(1, "MOLD_TYPES").then((res) => {
                if (res.data) {
                    moldTypes.value = JSON.parse(res.data[0].codeElements);
                } else {
                    moldTypes.value = CODES.MOLD_TYPES;
                }
            });
        }

        async function getMoldStates() {
            CustomCodeApi.getCode(1, "MOLD_STATES").then((res) => {
                if (res.data) {
                moldStates.value = JSON.parse(res.data[0].codeElements);
                } else {
                moldStates.value = CODES.MOLD_STATES;
                }
            });
        }
        async function getMolds() {
            isSearchingMold.value = true;
            // 카운터와 매칭되어 있는 금형은 제외
            // 금형명, 금형코드로 조회
            try {
                MoldApi.searchUnmatchingMolds(user.value.companyId)
                .then((res) => {
                    console.log("getmold", res.data)
                    if (res.data) {
                        molds.value = res.data.map((d) => {
                            return {
                            ...{
                                text:
                                d.moldCode +
                                " - " +
                                d.manufactureOrder +
                                " (" +
                                d.moldName +
                                ")",
                            },
                            ...d,
                            };
                        });
                    }
                    console.log("Molds >>>>>>>>>>> ", molds.value);
                })
                .catch((err) => {
                    console.log("Failed to get molds...", err);
                    throw err;
                });
            } catch (error) {
                // this.$swal({
                // icon: "error",
                // text:
                //     this.$t("failedAction", [this.$t("mold")]) +
                //     " " +
                //     this.$t("tryAgain"),
                // });
            } finally {
                isSearchingMold.value = false;
            }
        }
        
        function findList() {
            counters.value = [];
            isSearchingItem.value = true;
            try {
                ApprovalApi.getApprovedRequestsRestDeviceByCorp(
                user.value.companyId,
                "counter"
                )
                .then((res) => {
                    console.log("Get approval requests...", res.data);
                    if (res.data) {
                        counters.value = res.data.filter(
                            (d) => d.deviceType === "counter" && d.progressState === "F"
                        );
                    }
                })
                .catch((err) => {
                    throw err;
                })
                .finally(() => (isSearchingItem.value = false));
            } catch (err) {
                console.log(err);
            }
        }

        function getMoldCounter() {
            CounterApi.getMoldCounter(counterId.value).then((res) => {
                console.log("getMoldCounter",res.data);
                if (res.data) {
                    moldCounter.value = {
                        id: res.data.mold.id,
                        counterId: res.data.counterId,
                        moldName:
                        res.data.mold.moldName + " (" + res.data.mold.moldCode + ")",
                    };
                    selectedItem.value = {
                        deviceId: res.data.counterId,
                    };
                    searchedMold.value = _.cloneDeep(moldCounter.value);
                    console.log(searchedMold.value);
                    console.log(moldCounter.value);
                }
            });
        }

        return {
            frames, moldCounter
        }
    }
}
</script>


<style lang="scss" scoped>
    @import "~/scss/main.scss";
</style>