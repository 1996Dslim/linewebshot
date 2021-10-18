<template>
    <div class="field full">
        <div class="info_input">
            <div class="line">
                <div class="box in" style="min-height: 52px; display: flex;">
                    <span>카운터 ID</span>
                    <input type="text" value="test" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>         
    </div>
    <div class="field full" v-for="frame in frames" :key="frame">                        
        <div class="title">
            <span class="text">{{ frame.title }}</span>
        </div>
        <div class="info_input">
            <div v-for="line in frame.text" :key="line" class="line">
                <div v-for="box in line" :key="box" class="box in" style="width: 100px;">
                    <span>{{ box }}</span>
                    <input type="text" value="test" disabled style="color: #fff; min-width: 100px;">
                </div>
            </div>
        </div>                  
    </div>
    <div class="counter_input_box">
        <div class="counter_line">
            <span>SHOT 변경</span>
            <input type="number" value=0 >
        </div>
        <div class="counter_line">
            <span>충격 세기 값</span>
            <input type="number" value=0 >
        </div>
        <div class="counter_line">
            <span>알람 값 지정</span>
            <input type="number" value=0 >
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
                <input type="text" value="연구원 01" disabled>
            </div>
            <span>작성일자</span>
            <div class="counter_input">
                <input type="text" value="2021-09-24" disabled>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            frames: [
                {
                    title: "기본정보",
                    text: [
                          ["금형 코드","금형 종류","금형 명", "금형 상태"],
                          ["제작처","제작차 수","제작일", "CAVITY"],
                          ["보증 SHOT","점검 SHOT / 알람 SHOT (View)","기준 C/T", "C/T 오차범위"],
                          ["일별 기준 시간","일별 기준 생산량","작성자", "작성 일시"]
                        ] 
                },
                {
                    title: "통신정보",
                    text: [
                        ["터미널 ID", "터미널 위치", "카운터 ID", "최종 통신 시간"],
                        ["최종 SHOT", "최종C/T"]
                    ]
                },
            ]
        }
    },
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