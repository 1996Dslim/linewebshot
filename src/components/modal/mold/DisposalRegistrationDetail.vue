<template>
        <div class="dialog_main" >
            <div class="dialog_body">
                <div class="field">
                    <div class="info_input">
                        <div class="line">
                            <div class="box in">
                                <span>폐기기간</span>
                                <div style="display: flex;">
                                    <input type="date" v-model="datas.startDate" style="color: #fff;">
                                    <input type="date" v-model="datas.endDate" style="color: #fff;">
                                </div>
                            </div>
                            <div class="box in">
                                <span>폐기사유</span>
                                <select class="modal_select" v-model="datas.reason" name="" id="">
                                    <option value="falloff" selected>생산수율저하</option>
                                    <option value="unrepairable">수리불가</option>
                                    <option value="extinction">단종</option>
                                    <option value="etc">기타</option>
                                </select>
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>폐기처</span>
                                <input v-model="datas.company" type="text">
                            </div>
                            <div class="box in">
                                <span>담당자/연락처</span>
                                <input v-model="datas.manager" type="text">
                            </div>
                            <div class="box in">
                                <span>폐기비용</span>
                                <input v-model.lazy="datas.cost" type="text">
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>세부내용</span>
                                <textarea v-model="datas.detailsContent"></textarea>
                            </div>
                        </div>
                        <div class="line file">
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
                        <div class="line">
                            <div class="box in">
                                <span>작성자</span>
                                <input type="text" :value="datas.creatorName ? datas.creatorName : user.userName" disabled>
                            </div>
                            <div class="box in">
                                <span>작성일시</span>
                                <input type="text" :value="datas.createdAt ? datas.createdAt : ''" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="btnarea">
                        <div class="btn small" @click="saveItem">
                            저장
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import { CODES } from '~/config';

//import AttachedFileApi from '~/apis/attachedFile';
import DisposalApi from '~/apis/disposal';
import { useStore } from "vuex";
import { computed, ref } from '@vue/reactivity';
import Swal from 'sweetalert2';

export default {
    name: "ChartModal",
    props: {
        id: {
            type:Number,
            default: -1,
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
        const datas = ref([]);

        if(props.id !== -1){
            findItem()
        };
        
        function findItem() {
            DisposalApi.get(props.id).then(res => {
                console.log('Found disposal...', res);
                if (res && res.data) {
                    datas.value = res.data;
                    datas.value.startDate = res.data.startDate;
                    datas.value.endDate = res.data.endDate;
                    // Get files from DB
                    //vm.findItemFiles();
                }
            });
        }

        function saveItem() {
            if (!datas.value.startDate || !datas.value.endDate) {
                Swal.fire({
                    icon: 'warning',
                    text: '폐기기간을 입력해 주세요.',
                });
                return;
            }

            let editedItem = {
                ...datas.value,
                state: 'I',
            };
            if (datas.value.cost) {
                editedItem.cost = datas.value.cost.replace(/,/gi, '');
            }
            if (datas.value.id === -1) {
                editedItem.creatorId = user.value.id;
                editedItem.creatorName = user.value.userName;
                delete editedItem.id;
            }
            console.log('To save item...', editedItem);
            // try {
            //     DisposalApi.save(editedItem, editedItem.id).then(res => {
            //         if (res.data) {
            //             datas.value = res.data; 
            //             datas.value.startDate = res.data.startDate; //날짜 포멧 YYYY-MM-DD
            //             datas.value.endDate = res.data.endDate; //날짜 포멧 YYYY-MM-DD

            //             if (!datas.value.id) {
            //                 throw '저장 중 오류가 발생하였습니다.';
            //             }

            //             if (datas.value.id > 0 && datas.value.length > 0) {
            //                 //vm.saveFiles();
            //             }

            //             Swal.fire({
            //                 icon: 'success',
            //                 html: '저장되었습니다.',
            //             }).then(function() {
            //             // 목록 뷰?
            //             });
            //         }
            //     });
            // } catch (err) {
            //     Swal.fire({
            //         icon: 'error',
            //         html:
            //             '저장에 실패하였습니다.<br />동일 현상이 반복될 경우, 관리자에게 문의하시기 바랍니다.',
            //     });
            //     console.log('Occurred exaption...', err);
            // }
        }

        function handleFileChange(e) {
            console.log(window.location.pathname);
            this.file_name = e.target.files[0].name;
            this.file_label = '#26c8fd';
            console.log(e.target.files)
        }
        
        return {
            datas, user,
            handleFileChange, saveItem
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";

.dialog_main {
    margin: auto;
    width: 1350px;
    height: 100%;
    overflow-y: auto;
    border-radius: 5px;
    .dialog_head {
        height: 112px;
        background-color: #131d57;
        border-bottom: 1px solid#0096ff;
        .title {
            display: flex;
            align-items: center;
            height: 56px;
            color: #63bfff;
            font-size: 18px;
            .dashboardimg {
                width: 56px;
                height: 56px;
                background-image: url("~/assets/sidenav/main_menu_1.png");
                background-size: cover;
            }
        }

        .infobtn {
            padding-left: 79px;
            height: 56px;
            display: flex;
            input[type = "radio"] {
                display: none;
                &:checked + label {
                    border-bottom: 3px solid #0096ff;
                    color: #fff;
                }
            }
            label {
                width: 130px;
                height: 56px;
                line-height: 50px;
                text-align: center;
                background-color: #131d57;
                color: rgb(91 108 201);
                font-size: 16px;
                border: 0;
                outline: none;
                box-sizing: border-box;
                &:hover {
                    background-color: rgba(91, 108, 201, 0.2);
                    transition: .3s;
                }
            }
        }
    }
    .dialog_body {
        
        .btnarea {
            display: flex;
            justify-content: center;
            text-align: center;
            padding: 13px 0;
            
        }
    }
}



</style>