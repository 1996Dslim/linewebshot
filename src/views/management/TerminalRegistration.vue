<template>
    <div class="nav">
        <div>장비관리 > 터미널관리</div>
        <span>터미널 등록</span> 
    </div>
    <div class="addfield">
        <div class="line block">
            <div class="box in">
                <div class="img"></div>
                <input list="search_terminal"  type="text" placeholder="검색하실 [터미널 ID]를 입력해 주세요.">
                <datalist id="search_terminal">
                    <option value="test"></option>
                </datalist>
            </div>
        </div>
        <form action="">
            <div class="line block">
                <div class="box" style="border-bottom: 0">
                    <div class="box in">
                        <span>설치 위치</span>
                        <input type="text" placeholder="설치 위치 이름을 입력해 주세요.">
                    </div>
                    <div class="box in" style="margin-left: 88px">
                        <span>주소</span>
                        <input type="text" placeholder="우편번호 검색을 이용해 주세요">
                    </div>
                    <div class="box in" style="margin-left: 88px">
                        <span>상세위치</span>
                        <input type="text" placeholder="상세 주소을 입력해 주세요">
                    </div>
                </div>
            </div>
            <div class="line block">
                <div class="box in">
                    <span>메모</span>
                    <input type="text" placeholder="메모를 입력하세요.">
                </div>
            </div>
            <div class="line block">
                <div class="box in">
                    <span>장비관리자</span>
                    <div class="img"></div>
                    <input type="text" placeholder="장비관리자 이름을 입력하세요.">
                </div>
            </div>
            <div class="multfile_box">
                    <span>첨부파일</span>
                    <input @change="handleFileChange" id = "multfile" type="file" multiple>
                    <label class="filewrap">
                        <div class="files" v-for="file, index in file_name" :key="index">{{ file.name }} <button></button> </div>
                        <div v-if="file">업로드할 파일</div>
                    </label>
                    <label class="multfile_btn" for="multfile">파일선택</label>
                </div>
            <div class="line block">
                <div class="box in">
                    <span>네트워크</span>
                    <input type="radio" name="net" id="wifi"><label class="btn" for="wifi">WI-FI</label>
                    <input type="radio" name="net" id="lan"><label class="btn" for="lan">LAN</label>
                </div>
            </div>
            <div class="line block">
                <div class="box in">
                    <span>IP 정보</span>
                    <input type="radio" name="ip" id="static"><label class="btn" for="static">고정 IP</label>
                    <input type="radio" name="ip" id="dynamic"><label class="btn" for="dynamic">유동 IP (DHCP)</label>
                </div>
            </div>
            <div class="line">
                <div class="box in">
                    <span>작성자</span>
                    <input type="text" value="연구원 01" disabled>
                </div>
                <div class="box in">
                    <span>작성일자</span>
                    <input type="text" value="2021-08-04" disabled>
                </div>
            </div>
        </form>
        <div class="btnarea">
            <div class="btn medium">목록보기</div>
            <div class="btn medium">삭제</div>
            <div class="btn medium">사용종료</div>
            <div class="btn medium">저장</div>
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';
export default {

    setup() {
        const file_name = ref();
        const file_label = [];

        const handleFileChange = (e) => {
            console.log("wind",window.location.pathname);
            file_name.value = e.target.files;
            console.log("target",e.target.files);
            console.log("file_name",file_name.value[0].name)
        }  

        return {
            handleFileChange, file_name
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~/scss/main.scss";
.nav {
    margin-bottom: 15px;
    color: #8495fe;
    margin-bottom: 38px;
    div {
        margin-bottom: 13px;
        font-size: 12px;
    }
    span {
        width: 178px;
        height: 24px;
        font-size: 26px;
        font-weight: 500;
        color: #e9ecff;
    }
}

.add {
    background-color: rgb(24, 28, 56); 
    border-color: rgb(24, 28, 56); 
}

.addfield {
    background-color: rgb(24, 28, 56); 
    border-color: rgb(24, 28, 56); 
    margin: 15px 0;
    padding: 20px 39px;
}

.box.in {
    display: flex;
    align-items: center;
    span {
        width: 80px;
        padding-top: 0;
        //margin-right: 20px;
    }
    input {
        color: #fff;
    }

    input[type=radio] {
        display: none;
        width: 0;
    }
    input[type=radio] + label {
        margin-left: 15px;
        background-color: rgba($color: #000000, $alpha: 0);
        border: rgba(255, 255, 255, 0.12) 1px solid;
        margin: 2px;
    }
    input[type=radio]:checked + label {
        background-color: #303f9f;
    }
}

.btnarea {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 15px;
}

.img {
    width: 24px;
    height: 24px;
    margin: 0 15px;
    background-image: url("~/assets/management/counter/counter_registration.png");
}
</style>