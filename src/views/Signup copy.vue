<template>
    <div class="fieldwrap">
        <div class="title">
                <span class="shotline">SHOTLINE</span>
                <h1>회원가입</h1>
        </div>

        <div class="field">                        
            <div class="title">
                <div class="title_wrap">
                    <span class="material-icons">
                        panorama_fish_eye
                    </span>
                    <span class="text">사업자 정보</span>
                </div>
            </div>
            <div class="input_filed">
                <form action="">
                    <div class="info_input">
                        <div class="line">
                            <span>* 사업자등록증 번호</span>
                            <div class="box in">
                                <input type="text">
                            </div>
                            <div class="box in">
                                <input type="text">
                            </div>
                            <div class="box in">
                                <input type="text">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>* 업체명</span>
                                <input type="text" placeholder="업체명 검색">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>* 주소</span>
                                <input type="text" placeholder="우편번호/주소 검색">
                            </div>
                            <div class="box in">
                                <span>상세 주소</span>
                                <input type="text" placeholder="상세 주소를 입력해 주세요">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>* 업태</span>
                                <input type="text" placeholder="업태를 입력해 주세요">
                            </div>
                            <div class="box in">
                                <span>* 종목</span>
                                <input type="text" placeholder="종목을 입력해 주세요">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>* 1차 산업군</span>
                                <input type="text" placeholder="1차 산업군을 입력해 주세요">
                            </div>
                            <div class="box in">
                                <span>* 2차 산업군</span>
                                <input type="text" placeholder="2차 산업군을 입력해 주세요">
                            </div>
                            <div class="box in">
                                <span>* 세부 산업</span>
                                <input type="text" placeholder="세부 산업을 입력해 주세요">
                            </div>
                        </div>
                        <div class="line">
                            <span class="material-icons">
                                attachment
                            </span>
                            <label for="fileup">사업자등록증</label>
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

                    <div class='sub_input'>
                        <button class="sub_btn" type="submit" >
                            <span class="material-icons" style="color:#fff;">
                                arrow_forward_ios
                            </span>
                            <a href="#/signup">다 음</a>
                        </button>
                    </div>
                </form> 
            </div>                    
        </div>
    </div>
    <!-- <div style="background-color:red; height: 50px;"></div> -->
</template>
    
<script>
export default {
    data() {
        return {
            file_name:'가입 시 제출하신 사업자등록증을 첨부해주세요.',
            file_label: '',
        }
    },
    methods: {
        handleFileChange(e) {
            console.log(window.location.pathname);
            this.file_name = e.target.files[0].name;
            this.file_label = '#26c8fd';
            console.log(e.target.files)
        }
    }
}
</script>


<style scoped  >
@import "~/scss/main";
@import "~/scss/signup";

</style>