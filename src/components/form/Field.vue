<template>
    <div class="field">                        
        <div class="title">
            <div class="title_wrap">
                <span class="material-icons">
                    panorama_fish_eye
                </span>
                <span class="text">타이틀</span>
            </div>
        </div>
        <div class="input_filed">
            <form action="">
                <div class="info_input">
                    
                </div>

                <div class='sub_input'>
                    <button class="sub_btn" type="submit" >
                        <a href="javascript:void(0)">요 청</a>
                    </button>
                </div>
            </form> 
        </div>                    
    </div>
</template>

<style scoped>
.field {
    width: 1163px;
    height: 700px;
}

.field .title {
    position: relative;
    height: 51px;
    background-color: #2c3a90;
    border-top-left-radius:  10px;
    border-top-right-radius:  10px;
}

.field .title .title_wrap {
    position: absolute;
    height: 21px;
    top:0;
    bottom: 0;
    margin: auto auto auto 41px;
    text-align: center;
}

.field .title .title_wrap span {
    color: #fff;
}

.field .title .title_wrap .material-icons {
    font-size: 21px;
}

.field .title .title_wrap .text {
    font-size: 18px;
    width: 21px;
    text-align: center;
}

.field .input_filed {
    height: 649px;
}

.field .input_filed .info_input {
    height: 567px;
    background-color: #21264d;
    border-bottom-right-radius:  10px;
    border-bottom-left-radius:  10px;
}

.field .input_filed .sub_input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px
}

.field .input_filed .sub_input .sub_btn {
    background-color: #303f9f;
    width: 150px;
    height: 52px;
    box-shadow: 0px 4px 0 0 rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}
</style>