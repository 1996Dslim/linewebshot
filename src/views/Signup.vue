<template>
    <div class="fieldwrap">
        <div class="main_title">
                <span class="shotline">SHOTLINE</span>
                <h1>회원가입</h1>
        </div>
        <div class="signupnavwrap">
            <div class="signupnav">
                <div class="step one">1</div> <span>사업자 정보</span><hr/>
                <div :class="`step two ${subpass? '' : 'none'}`">2</div> <span>사용자 정보</span><hr/>
                <div class="step three">3</div> <span>가입 완료</span>
            </div>
        </div>
        <div class="test" style="display: flex;">
            <!-- <div class="wrap"> -->
                <div :class="`field ${pass? '' : 'next'}`">                        
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
                                    <div class="box in">
                                        <span>*사업자들록번호</span>
                                        <input type="text">
                                    </div>
                                    <div class="box in">
                                        <span>*업체명</span>
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>*주소</span>
                                        <input type="text">
                                    </div>
                                    <div class="box in">
                                        <span>*상세주소</span>
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>*업태</span>
                                        <input type="text">
                                    </div>
                                    <div class="box in">
                                        <span>*종목</span>
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>*1차 산업군</span>
                                        <input type="text">
                                    </div>
                                    <div class="box in">
                                        <span>*2차 산업군</span>
                                        <input type="text">
                                    </div>
                                    <div class="box in">
                                        <span>*세부 산업</span>
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="line file">
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
                                <span class="warningtext">* 사업장 정보는 모두 필수 입력(선택) 항목입니다.</span>
                            </div>
                            

                            <div class='sub_input'>
                                <button @click="passon" class="btn" type="submit" >
                                    <a href="javascript:void(0)">다음</a>
                                </button>
                            </div>
                        </form> 
                    </div>                    
                </div>
            <!-- </div> -->
            <!-- <div class="wrap"> -->
                <div  :class="`field sub ${subpass? 'active' : ''}`">                        
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
                                    <div class="box in">
                                        <span>*ID(이메일)</span>
                                        <input type="text" placeholder="이메일을 입력해 주세요">
                                    </div>
                                    <div class="btn small">중복<br>확인</div>
                                    <span class="warningtext id">※ 해당 ID(이메일)로 임시 비밀번호가 발송되므로 주의 바랍니다</span>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>*성명</span>
                                        <input type="text" placeholder="성명을 입력해 주세요.">
                                    </div>
                                    <div class="box in">
                                        <span>*연락처(휴대전화)</span>
                                        <input type="text">
                                    </div>
                                </div>
                                <div class="line">
                                    <div class="box in">
                                        <span>*부서명</span>
                                        <input type="text" placeholder="부서명을 입력해 주세요.">
                                    </div>
                                    <div class="box in">
                                        <span>직위</span>
                                        <input type="text" placeholder="직위를 입력해 주세요.">
                                    </div>
                                    <div class="box in">
                                        <span>담당업무</span>
                                        <input type="text" placeholder="담당업무를 입력해 주세요.">
                                    </div>
                                </div>
                                <span class="warningtext">* 표시는 필수 입력 항목입니다.</span>
                            </div>
                            

                            <div class='sub_input'>
                                <button @click="passon" class="btn">
                                    <a href="javascript:void(0)">이전</a>
                                </button>
                                <button class="btn" type="submit" >
                                    <a href="javascript:void(0)">요청</a>
                                </button>
                            </div>
                        </form> 
                    </div>                    
                </div>
            <!-- </div> -->
        </div>
    </div>
</template>
    
<script>
export default {
    data() {
        return {
            file_name:'가입 시 제출하신 사업자등록증을 첨부해주세요.',
            file_label: '',
            pass: true,
            subpass: false
        }
    },
    methods: {
        handleFileChange(e) {
            console.log(window.location.pathname);
            this.file_name = e.target.files[0].name;
            this.file_label = '#26c8fd';
            console.log(e.target.files)
        },
        passon() {
            if(this.pass === false){
                this.pass = true;
                this.subpass = false;
            }
            else {
                this.pass = false;
                this.subpass = true;
            }
        }
    }
}
</script>


<style scoped  lang="scss">
@import "~/scss/main";
@import "~/scss/test.scss";
</style>