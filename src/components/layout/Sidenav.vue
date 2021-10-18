<template>
    <input id="sidebar" type="checkbox" v-model="state.checked"/>
    <div class="sidenav">
        <div class="mov">
            <div class="item">
                <label class="la" for="sidebar">
                    <div class="main_menu img"></div>
                    <div class="title">menu</div>
                </label>
            </div> 
            <div class="item" >
                <label class="la" for="sidebar" @click="savedash()">
                    <div class="mainimg img"></div>
                    <router-link to="/dashboard" class="title" style="text-decoration: none;">
                        Dashboard
                    </router-link>
                </label>
            </div> 
            <div 
            v-for="(grop, index) in state.main"
            class="item"
            v-bind:key="index">
                <label
                @click="toggle(index)" 
                :class="`la ${state.mainmenu === index ? 'main_active' : ''}`">
                    <div class="mainimg img"></div>
                    <div class="title">{{ grop.title }}</div>
                    <div class="material-icons arrow">
                        expand_more
                    </div>
                </label>
                <div :class="`itemlist ${state.mainmenu === index ? 'sub_active' : ''}`">
                    <router-link  
                    v-for="(sub) in grop.subs"
                    :key="sub"
                    :to="{path:sub.te}"
                    @click="savelocal(index)"
                    class="list">
                        <div class="subimg"></div>
                        <div 
                        :class="`rout ${$route.path === sub.te ? 'sub_menu' : ''}`">
                            {{ sub.name }}
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onUnmounted, onBeforeUnmount, reactive } from 'vue';

export default {
    setup() {
        const state = reactive({
            test: '/mold',
            currentTabNum: -1,
            mainmenu: -1,
            submenu: -1,
            checked: false,
            main: [
                {
                    title: '종합지표',
                    subs: [ 
                            {name: '종합 지표', te: '/indicator'},
                            {name: '금형 사용 지표', te: '/userchart'},
                            {name: '금형 가동 지표', te: '/activechart'},
                            {name: '금형 생산 지표', te: '/outputchart'},
                            {name: 'C/T준수 지표', te: '/ctchart'},
                        ],
                },
                {
                    title: '금형 관리',
                    subs: [
                            {name: '금형관리', te: '/mold'},
                            {name: '생산관리', te: '/production'},
                            {name: '유지관리', te: '/maintenance'},
                            {name: '페기관리', te: '/disposal'},
                            {name: '특이사항', te: '/singularity'},
                        ]
                },
                {
                    title: '장비 관리',
                    subs: [
                            {name: '장비 승인 요청', te: '/approval'},
                            {name: '터미널 관리', te: '/terminal'},
                            {name: '카운터 관리', te: '/counter'},
                            {name: '카운터 PreSet', te: '/preset'},
                            // {name: '카운터 알림 수신', te: '/test'},
                            // {name: '미등록 터미널', te: '/test'},
                            // {name: '미등록 카운터', te: '/test'},
                        ]
                },
                // {
                //     title: '공유 관리',
                //     subs: [
                //             {name: '금형 조회', te: '/test'},
                //             {name: '유지 관리', te: '/test'},
                //             {name: '페기 관리', te: '/test'},
                //         ]
                // },
                {
                    title: '설정 관리',
                    subs: [
                            {name: '사업장 관리', te: '/company'},
                            {name: '사용자 관리', te: '/member'},
                            {name: '금형코드관리', te: '/customcd'},
                            //{name: 'User Management', te: '/test'},
                        ]
                },
            ]
        })

        

        if(localStorage.getItem('CURR_SIDE_NUM')) {
            state.currentTabNum = localStorage.getItem('CURR_SIDE_NUM');
            if (isNaN(state.currentTabNum)) {
                state.currentTabNum = 0;
            }
            toggle(Number(state.currentTabNum));
        }

        function toggle(num){
            if(state.checked === false){
                state.checked = true;
            }
            
            if(state.mainmenu === num){
                state.mainmenu = -1;   
            }
            else {
               state.mainmenu = num;
            }

        }

        function savedash() {
            state.mainmenu = -1;
            localStorage.setItem('CURR_SIDE_NUM', -1);
            state.checked = true;
        }

        function savelocal(num) {
           localStorage.setItem('CURR_SIDE_NUM', num);
        }
        

        

        return {
            state, toggle, savelocal, savedash
        }

    }
    
}

</script>


<style scoped lang="scss">
.rout {
    color: #96a9fe;
    &.sub_menu{
        color: #64e1f0;
    }
}

.sidenav {
    width: 61px;
    height: 100%;
    //position: fixed;
    background-color: #151a3b;
    //overflow: hidden;
    transition: .3s;
    border-right: 1px solid rgb(33, 45, 115);
    flex: none;
    .mov{
        position: sticky;
        top: 61px;
        .item {
            overflow: hidden;
            .itemlist {
                display: none;
                transition: .3s;
                overflow: hidden;
                cursor: pointer;
                background-color: #09152e;
                &.sub_active {
                    // height: 100%;
                    
                display: block;
                }
                .list {
                    display: flex;
                    width: 310px;
                    height: 61px;
                    //color: #96a9fe;
                    text-decoration: none;
                    box-sizing: border-box;
                    padding-left: 71px;
                    border-bottom: 1px solid rgb(33, 45, 115);
                    align-items: center;
                    &.sub_menu {
                        color: #64e1f0;
                    }
                    .subimg {
                        background-position: center;
                        background-repeat: no-repeat;
                        width: 24px;
                        height: 24px;
                        margin-right: 16px;
                    }
                    &:hover {
                        background-color: rgba(68, 77, 96, .7);
                        transition: .3s;
                    }
                }
            }

            @for $i from 1 through 5 {
                &:nth-child(#{$i+1}) .la .mainimg {
                    background-image: url("~/assets/sidenav/main_menu_#{$i+1}.png");
                }
            }

            @for $i from 1 through 5 {
                &:nth-child(3) .itemlist .list:nth-child(#{$i}) .subimg {
                    background-image: url("~/assets/sidenav/sub_main_3-#{$i}.png");
                }
            }
            
            @for $i from 1 through 5 {
                &:nth-child(4) .itemlist .list:nth-child(#{$i}) .subimg {
                    background-image: url("~/assets/sidenav/sub_main_4-#{$i}.png");
                }
            }
            
            @for $i from 1 through 4 {
                &:nth-child(5) .itemlist .list:nth-child(#{$i}) .subimg {
                    background-image: url("~/assets/sidenav/sub_main_5-#{$i}.png");
                }
            }
            
            @for $i from 1 through 3 {
                &:nth-child(6) .itemlist .list:nth-child(#{$i}) .subimg {
                    background-image: url("~/assets/sidenav/sub_main_6-#{$i}.png");
                }
            }

            &:nth-child(n+2) .la:hover {
                background-color: rgba(68, 77, 96, .7);
                transition: .3s;
            }
            
            .la {
                display: flex;
                border-bottom: 1px solid rgb(33, 45, 115);
                cursor: pointer;
                
                &.main_active {
                    background-color: #28337b;
                    .material-icons {
                        transform: rotate(-180deg);
                        transition: .3s;
                    }
                }
                .title {
                    width: 188px;
                    height: 61px;
                    font-size: 16px;
                    color: #dbe0fe;
                    padding: 20px 100px 20px 10px;
                    box-sizing: border-box;
                    white-space: nowrap;
                }
                .material-icons {
                    display: flex;
                    color: #fff;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    width: 61px;
                    height: 61px;
                    padding: 15px;
                    box-sizing: border-box;
                    transform: rotate(0);
                    transition: .2s;
                }
            }
        }
    }
}

input[type="checkbox"] {
    display: none;
}

input[type="checkbox"]:checked + .sidenav {
    width: 310px;
    transition: .3s;
}

/*input[type="checkbox"]:checked + .sidenav .item .itemlist {
    height: 0;
    transition: .5s;
}*/

.img {
    background-repeat: no-repeat;
    background-position: center;
    width: 61px;
    height: 61px;
    flex: none;
    border-right: 1px solid rgb(33, 45, 115);
}

.main_menu {
    background-image: url("~/assets/sidenav/main_menu_1.png");
    background-size: auto;
}

#sidebar[type="checkbox"]:checked + .sidenav .main_menu {
    background-image: url("~/assets/sidenav/main_menu_close.png");
}
/* 
.dashboard {
    background-image: url("../images/main_menu/main_menu_2_dashboard.7957ea02.png");
} */
</style>