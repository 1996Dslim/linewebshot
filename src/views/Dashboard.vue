<template>
    <div class="day_area_bg">
        <div class="now">
            {{today.year}}년 {{today.month}}월 {{today.day}}일
        </div>
    </div>
    <div class="shot">
        <div class="min_info">
            <div class="imgfield">
                
            </div>
            <div class="title">
                <div class="main_title">
                    <div>점검 대상</div>  
                    <div>금형</div> 
                </div>
                <div class="sub_title">
                    금형특이사항 대상 금형수
                </div>
            </div>
            <div class="num_box">
                <h2>N/A</h2>
                <span>ea</span>
            </div>
        </div>
        <div class="min_info">
            <div class="imgfield">
                
            </div>
            <div class="title">
                <div class="main_title">
                    <div>유지 보수 대상</div>  
                    <div>금형</div> 
                </div>
                <div class="sub_title">
                    유지보수 및 유지보수 진행 금형수
                </div>
            </div>
            <div class="num_box">
                <h2>0</h2>
                <span>ea</span>
            </div>
        </div>
        <div class="min_info">
            <div class="imgfield">
                
            </div>
            <div class="title">
                <div class="main_title">
                    <div>폐기 대상</div>  
                    <div>금형</div> 
                </div>
                <div class="sub_title">
                    폐기 진행 중인 금형수
                </div>
            </div>
            <div class="num_box">
                <h2>99</h2>
                <span>ea</span>
            </div>
        </div>
        <div class="min_info">
            <div class="imgfield">
                
            </div>
            <div class="title">
                <div class="main_title">
                    <div>배터리 교체 대상</div>  
                    <div>금형</div> 
                </div>
                <div class="sub_title">
                    배터리 레벨이 EMPTY 인 금형수
                </div>
            </div>
            <div class="num_box">
                <h2>{{ batteryState.low }}</h2>
                <span>ea</span>
            </div>
        </div>
    </div>
    <div class="Status">
        <!-- field2컴포넌트 -->
        <div class="field full">                        
            <div class="title">
                <span class="text">카운터 사용 현황</span>
            </div>
            <div class="info_input">
                <div class="state_wrap">
                    <div class="cir">
                        <DeviceUseStateChart :series="counterUseStateSeries" v-if="showCounterState" />
                    </div>
                    <div class="counter_num">
                            <div class="title">등록 카운터</div>
                            <div class="num">{{ counterState.registeredCnt }}</div>
                            <div class="ea">ea</div>
                    </div>
                    <div class="counter_num">
                            <div class="title">수신 카운터</div>
                            <div class="num">{{ counterState.greenCnt }}</div>
                            <div class="ea">ea</div>
                    </div>
                    <div class="counter_num">
                            <div class="title">미수신 카운터</div>
                            <div class="num">{{ counterState.yellowCnt + counterState.redCnt }}</div>
                            <div class="ea">ea</div>
                    </div>
                </div>
            </div>                  
        </div>
        <div class="field full">                        
            <div class="title">
                <span class="text">터미널 사용 현황</span>
            </div>
            <div class="info_input">
                <div class="state_wrap">
                    <div class="cir">
                        <DeviceUseStateChart :series="terminalUseStateSeries" v-if="showTerminalState" />
                    </div>
                    <div class="counter_num">
                            <div class="title">등록 카운터</div>
                            <div class="num">{{ terminalState.registeredCnt }}</div>
                            <div class="ea">ea</div>
                    </div>
                    <div class="counter_num">
                            <div class="title">수신 카운터</div>
                            <div class="num">{{ terminalState.greenCnt }}</div>
                            <div class="ea">ea</div>
                    </div>
                    <div class="counter_num">
                            <div class="title">미수신 카운터</div>
                            <div class="num">{{ terminalState.yellowCnt + terminalState.redCnt }}</div>
                            <div class="ea">ea</div>
                    </div>
                </div>
            </div>                  
        </div> 
    </div>
    <div class="chartstatus">
        <!-- field2chart컴포넌트 -->
        <div class="field full">                        
            <div class="title">
                <span class="text">금형 사용 지표</span>
            </div>
            <div class="info_input chart">
                <div class="dsadwas">
                    <MoldUsageChart :series="moldUseSeries" />
                </div>
            </div>                  
        </div>
        <div class="field full">                        
            <div class="title">
                <span class="text">금형 가동 지표</span>
            </div>
            <div class="info_input chart">
                <div class="dsadwas">
                    <MoldActiveChart :series="moldActSeries" />
                </div>
            </div>                  
        </div>
        <div class="field full">                        
            <div class="title">
                <span class="text">금형 생산 지표</span>
            </div>
            <div class="info_input chart">
                <div class="dsadwas">
                    <MoldOutputChart :series="moldOutputSeries" />
                </div>
            </div>                  
        </div>
        <div class="field full">                        
            <div class="title">
                <span class="text">C/T 준수 지표</span>
            </div>
            <div class="info_input chart">
                <div class="dsadwas">
                    <CtComplianceChart :series="ctComplianceSeries" />
                </div>
            </div>                  
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import { useStore } from "vuex";
import DeviceUseStateChart from '../components/indicator/DeviceUseStateChart';
//사용지표
import MoldUsageChart from '~/components/indicator/MoldUsageChart';
import MoldActiveChart from '../components/indicator/MoldActiveChart';
import MoldOutputChart from '../components/indicator/MoldOutputChart';
import CtComplianceChart from '../components/indicator/CtCompilanceChart.vue';
import Statistic from '~/apis/statistic.js';
import { nextTick } from 'vue';

export default {
    components: {
        DeviceUseStateChart,
        MoldUsageChart,
        MoldActiveChart,
        MoldOutputChart,
        CtComplianceChart
    },
    setup() {
        const store = useStore();
        const todayDate = new Date();
        const today = {
            year : todayDate.getFullYear(),
            month: todayDate.getMonth() + 1,
            day: todayDate.getDate()
        };

        const batteryState = ref({});
        const counterState = ref({});
        const terminalState = ref({});
        const showCounterState = ref(false);
        const showTerminalState = ref(false);
        const counterUseStateSeries = ref([]);
        const terminalUseStateSeries = ref([]);
        //사용지표
        const moldUseSeries = reactive([
            {
                name: 'MoldUseCnt',
                data: [],
            }
        ]);
        const moldActSeries = reactive([
            {
                name: 'MoldActCnt',
                data: [],
            }
        ]);
        const moldOutputSeries = reactive([
            {
                name: 'MoldOutputCnt',
                type: 'column',
                data: [],
            }
        ]);
        const ctComplianceSeries = reactive([
            {
                name: 'CtComplianceCnt',
                data: [],
            }
        ]);

        const inUser = computed(() => store.getters['account/signedInUser']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
            return {};
        })

        function init() {
            batteryState.value = {
                high: 0,
                middle: 0,
                low: 0,
            };
            counterState.value = {
                registeredCnt: 0,
                activeCnt: 0,
                greenCnt: 0,
                yellowCnt: 0,
                redCnt: 0,
            };
            terminalState.value = {
                registeredCnt: 0,
                activeCnt: 0,
                greenCnt: 0,
                redCnt: 0,
            };
        }
        init();

        nextTick(() => loadIndicator());

        function loadDeviceState() {
            getBatteryState();
        }
        loadDeviceState();

        function loadIndicator() {
            getMoldUseData();
            getMoldActData();
            getMoldOutputIndicator();
            getCtComplianceIndicator();

            getCounterUseState();
            getTerminalUseState();
        }

        async function getBatteryState() {
            // 배터리 상태
            const res = await Statistic.findBatteryState(user.value.companyId);
            if (res.data) {
                batteryState.value.high = res.data.high | 0;
                batteryState.value.middle = res.data.middle | 0;
                batteryState.value.low = res.data.low | 0;
            }
        }

        //사용현황
        async function getCounterUseState() {
            showCounterState.value = false;
            counterUseStateSeries.value = [];  
            // 카운터 사용 현황
            const res = await Statistic.findCounterUseState(user.value.companyId);
            if (res.data) {
                counterState.value.registeredCnt = res.data.registeredCnt | 0;
                counterState.value.greenCnt = res.data.greenCnt | 0;
                counterState.value.yellowCnt = res.data.yellowCnt | 0;
                counterState.value.redCnt = res.data.redCnt | 0;
                if (!counterState.value.greenCnt || !counterState.value.registeredCnt) {
                    counterUseStateSeries.value.push(0);
                } else {
                    counterUseStateSeries.value.push(
                        Math.round((counterState.value.greenCnt / counterState.value.registeredCnt) * 100 * 100) / 100
                    );
                }
            }
            console.log("counterState",counterUseStateSeries.value);
            showCounterState.value = true;
        }

        async function getTerminalUseState() {
            showTerminalState.value = false;
            terminalUseStateSeries.value = [];
            // 터미널 사용 현황
            const res = await Statistic.findTerminalUseState(user.value.companyId);
            if (res.data) {
                terminalState.value.registeredCnt = res.data.registeredCnt | 0; // | (Math.random() * (100 - 1) + 1);
                terminalState.value.greenCnt = res.data.greenCnt | 0; // | (Math.random() * (10 - 1) + 1);
                terminalState.value.yellowCnt = res.data.yellowCnt | 0;
                terminalState.value.redCnt = res.data.redCnt | 0;
                if (!terminalState.greenCnt || !terminalState.registeredCnt) {
                    terminalUseStateSeries.value.push(0);
                } else {
                    terminalUseStateSeries.value.push(
                    Math.round((terminalState.greenCnt / terminalState.registeredCnt) * 100 * 100) / 100);
                }
            }
            console.log("terminalUseStateSeries",terminalUseStateSeries.value)
            showTerminalState.value = true;
        }

        //사용지표
        async function getMoldUseData() {
            moldUseSeries[0].data = [];
            // 금형 사용지표
            const res = await Statistic.findMoldUseIndicator(user.value.companyId);
            if (res.data) {
                moldUseSeries[0].data.push(res.data.totalCnt | 0);
                moldUseSeries[0].data.push(res.data.activeCnt | 0);
                moldUseSeries[0].data.push(res.data.idleCnt | 0);
                moldUseSeries[0].data.push(res.data.unusedCnt | 0);
            }
        }
        
        async function getMoldActData() {
            moldActSeries[0].data = [];
            // 금형 가동률 지표
            const res = await Statistic.findMoldActiveIndicator(user.value.companyId);
            if (res.data) {
                moldActSeries[0].data.push(res.data.activeRate);
                console.log("res.data.activeRate",res.data)
            }
            //console.log("moldActSeries", moldActSeries);
        }
        
        async function getMoldOutputIndicator() {
            moldOutputSeries[0].data = [];
            // 금형 생산지표
            const res = await Statistic.findMoldOutputIndicator(user.value.companyId);
            if (res.data) {
                moldOutputSeries[0].data.push(res.data.outputCnt | 0);
            }
            //console.log("moldOutputSeries", moldOutputSeries);
        }

        async function getCtComplianceIndicator() {
            ctComplianceSeries[0].data = [];
            // C/T 준수지표
            const res = await Statistic.findCtComplianceIndicator(user.value.companyId);
            if (res.data) {
                ctComplianceSeries[0].data.push(res.data.activeCnt | 0);
                ctComplianceSeries[0].data.push(res.data.withinCnt | 0);
                ctComplianceSeries[0].data.push(res.data.overCnt | 0);
                ctComplianceSeries[0].data.push(res.data.underCnt | 0);
            }
           // console.log("ctComplianceSeries", ctComplianceSeries);
        }

        return {
            today,moldUseSeries, moldActSeries, moldOutputSeries, ctComplianceSeries, showCounterState, counterUseStateSeries, showTerminalState, terminalUseStateSeries, counterState, terminalState, batteryState,
            getMoldUseData, getMoldActData
        }
    }

    //차트 데이터 확인, 차트 컴포넌트 vue3전환
}
</script>


<style lang="scss" scoped>
    @import "~/scss/main.scss";
    .field{
       
        .title {
            justify-content: center !important;
            height: 40px !important;
            background: #2c3a90;
        }
        .info_input {
            background-color: #0b1f46;
        }
    }
    @import "~/scss/dashboard.scss";
</style>