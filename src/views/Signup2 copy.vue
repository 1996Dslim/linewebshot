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
                            <div class="box in">
                                <span>USERID(이메일)</span>
                                <input type="text" placeholder="이메일을 입력해 주세요">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>성명</span>
                                <input type="text" placeholder="성명을 입력해 주세요">
                            </div>
                            <div class="box in">
                                <span>연락처/핸드폰</span>
                                <input type="text" placeholder="연락처/핸드폰을 입력해 주세요">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>비밀번호</span>
                                <input type="text" placeholder="비밀번호를 입력해 주세요">
                            </div>
                            <div class="box in">
                                <span>비밀번호 확인</span>
                                <input type="text" placeholder="비밀번호를 가시 한번 더 입력해 주세요">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>부서명</span>
                                <input type="text" placeholder="부서명을 입력해 주세요">
                            </div>
                            <div class="box in">
                                <span>직위</span>
                                <input type="text" placeholder="직위를 입력해 주세요">
                            </div>
                            <div class="box in">
                                <span>담당업무</span>
                                <input type="text" placeholder="담당업무를 입력해 주세요">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box">
                                <span>권한</span>
                                <input type="text" value="업체 담당자" disabled>
                            </div>
                            <div class="box">
                                <span>계정 상태</span>
                                <input type="text" value="업체 담당자" disabled>
                            </div>
                        </div>
                        <div class="line">
                            <div class="box">
                                <span>권한 부여자</span>
                                <input type="text" value="업체 담당자" disabled>
                            </div>
                            <div class="box">
                                <span>권한 부여 일시</span>
                                <input type="text" value="업체 담당자" disabled>
                            </div>
                        </div>
                        <div class="line">
                            <div class="box">
                                <span>작성자</span>
                                <input type="text" value="업체 담당자" disabled>
                            </div>
                            <div class="box">
                                <span>작성 일시</span>
                                <input type="text" value="업체 담당자" disabled>
                            </div>
                        </div>
                    </div>

                    <div class='sub_input'>
                        <button class="sub_btn" type="submit" >
                            <a href="/">요 청</a>
                        </button>
                    </div>
                </form> 
            </div>                    
        </div>
    </div>
</template>

<style scoped  >
@import "~/scss/main";
@import "~/scss/signup2";

</style>