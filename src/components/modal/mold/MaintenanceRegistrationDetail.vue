<template>
        <div class="dialog_main" >
            <div class="dialog_body">
                <div class="field">
                    <div class="info_input">
                        <div class="line">
                            <div class="box in">
                                <span>수리기간</span>
                                <div style="display: flex;">
                                    <input v-model="item.startDate" type="date" style="color: #fff;">
                                    <input v-model="item.endDate" type="date" style="color: #fff;">
                                </div>
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>점검종류</span>
                                <select v-model="item.checkItem" class="modal_select" name="" id="">
                                    <option value="N">정기점검</option>
                                    <option value="D">일상점검</option>
                                    <option value="A">A/S</option>
                                    <option value="E">기타</option>
                                </select>
                            </div>
                            <div class="box in">
                                <span>점검사항</span>
                                <select v-model="item.checkType" class="modal_select" name="" id="">
                                    <option value="C">세척</option>
                                    <option value="R">보수</option>
                                    <option value="D">금형손상</option>
                                    <option value="F">이물질</option>
                                    <option value="W">작동유무</option>
                                    <option value="E">기타</option>
                                </select>
                            </div>
                            <div class="box in">
                                <span>처리방법</span>
                                <select v-model="item.conductMethod" class="modal_select" name="" id="">
                                    <option value="R">보수</option>
                                    <option value="S">간이PM</option>
                                    <option value="G">구리스유입</option>
                                    <option value="E">기타</option>
                                </select>
                            </div>
                        </div>
                        <div class="line" style="height: 60px;">
                            <div class="box in">
                                <span>수리처</span>
                                <input v-model="item.repairCompany" type="text" style="color: #fff;">
                            </div>
                            <div class="box in">
                                <span>담당자/연락처</span>
                                <input v-model="item.manager" type="text" style="color: #fff;">
                            </div>
                            <div class="box in">
                                <span>수리비용</span>
                                <input v-model.lazy="item.repairCost" type="text" style="color: #fff;">
                            </div>
                        </div>
                        
                        <div class="line">
                            <div class="box in">
                                <span>세부내용</span>
                                <textarea v-model="item.detailsContent" ></textarea>
                            </div>
                        </div>
                        <div class="line">
                             <span class="material-icons">
                                attachment
                            </span>
                            <label for="fileup">파일첨부</label>
                            <div class="box in">
                                <input 
                                @change="handleFileChange"
                                id="fileup" type="file"/>
                                <label 
                                
                                for="fileup">
                                </label>
                            </div>
                        </div>
                        <div class="line">
                            <div class="box in">
                                <span>작성자</span>
                                <input :value=" item.creatorName ? item.creatorName : user.userName" type="text" disabled style="color: #fff;">
                            </div>
                            <div class="box in">
                                <span>작성일시</span>
                                <input type="text" :value="today" disabled style="color: #fff;">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnarea" v-if="isReg">
                    <div class="btn medium" @click="saveItem">
                        저장
                    </div>
                </div>
                <div class="btnarea" v-if="isIng">
                    <div class="btn medium" @click="deleteItem">
                        삭제
                    </div>
                    <div class="btn medium" @click="saveItem">
                        저장
                    </div>
                    <div class="btn medium" @click="completeRepair">
                        수리완료
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
import Swal from 'sweetalert2';
import { useStore } from "vuex";
import { ref } from '@vue/reactivity';
import { computed } from '@vue/runtime-core';
import MaintenanceApi from '~/apis/maintenance';

export default {
    name: "ChartModal",
    props: {
        id: {
            type: Number,
            required: true,
            default: -1,
        },
        moldId: {
            type: Number,
            required: true,
            default: null,
        },
        target: {
            type: String,
            default: 'list',
        },
    },
    components: {
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

        const item = ref({
            id: props.id,
            moldId: null,
            checkItem: 'N',
            checkType: 'C',
            conductMethod: 'R',
        })

        const today = new Date();

        const isReg = computed(() => {
            return item.value.id && item.value.id === -1;
        })
        const isIng = computed(() => {
            return item.value && item.value.state === 'I';
        })

        if (item.value.id !== -1) {
            findItem();
        }

        if (!item.value.moldId) {
            item.value.moldId = props.moldId;
        }

        function findItem() {
            const vm = this;
            MaintenanceApi.get(item.value.id).then(function(res) {
                console.log('Found maintenance...', res.data);
                if (res.data) {
                    item.value = res.data;
                    item.value.startDate = res.data.startDate;
                    item.value.endDate = res.data.endDate;

                    //vm.findItemFiles(); // Get files from DB
                }
            });
        }


        function saveItem() {
            if (!item.value.startDate || !item.value.endDate) {
                Swal.fire({
                    icon: 'warning',
                    text: '수리기간을 입력해 주세요.',
                });
                return;
            }

            const editedItem = {
                ...item.value,
                state: 'I',
            };

            if (item.value.repairCost) {
                editedItem.repairCost = item.value.repairCost //.replace(/,/gi, '');
            }
            if (item.value.id === -1) {
                editedItem.creatorId = user.value.id;
                editedItem.creatorName = user.value.userName;
                delete editedItem.id;
            }
            console.log('To save item...', editedItem);
            try {
                MaintenanceApi.save(editedItem, editedItem.id).then(res => {
                    if (res && res.data) {
                        if (!res.data.id) {
                            throw '저장 중 오류가 발생하였습니다.';
                        }
                        item.value = res.data;
                        item.value.startDate = res.data.startDate;
                        item.value.endDate = res.data.endDate;
                        //if (vm.item.id > 0 && vm.files.length > 0) {
                        //    saveFiles();
                        //}
                        Swal.fire({
                            icon: 'success',
                            html: '저장되었습니다.',
                        }).then(() => {
                        // 목록 뷰?
                        });
                    }
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    html:
                        '저장에 실패하였습니다.<br />동일 현상이 반복될 경우, 관리자에게 문의하시기 바랍니다.',
                    });
                    console.log('Occurred exaption...', err);
            }
        }

        function completeRepair() {
            const editedItem = {
                ...item.value,
                state: 'F',
            };
            if (item.value.repairCost) {
                editedItem.repairCost = item.value.repairCost //.replace(/,/gi, '');
            }
            console.log('To save item...', editedItem);
            try {
                MaintenanceApi.save(editedItem, editedItem.id).then(res => {
                if (res && res.data) {
                    if (!res.data.id) {
                        throw '저장 중 오류가 발생하였습니다.';
                    }
                    item.value = res.data;
                    Swal.fire({
                        icon: 'success',
                        html: '저장되었습니다.',
                    }).then(() => {
                    // 목록 뷰?
                    });
                }
                });
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    html:
                        '저장에 실패하였습니다.<br />동일 현상이 반복될 경우, 관리자에게 문의하시기 바랍니다.',
                });
                console.log('Occurred exaption...', err);
            }
        }

        function deleteItem() {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'deleteConfirmMsg',
                text: 'deleteWarningMsg',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'delete'.toUpperCase(),
            }).then(result => {
                if (result.isConfirmed) {
                    try {
                        MaintenanceApi.delete(item.value.id).then(() => {
                            //console.log('Delete files...', vm.files);

                            // if (vm.files && vm.files.length > 0) {
                            //     for (let index = 0; index < vm.files.length; index++) {
                            //         let elm = vm.files[index];

                            //         if (elm.response.id) {
                            //             try {
                            //             let fn = elm.response.fileUri;
                            //             let fileName = decodeURI(
                            //                 decodeURIComponent(
                            //                 fn.substring(
                            //                     fn.lastIndexOf('/o/') + 3,
                            //                     fn.indexOf('?alt'),
                            //                 ),
                            //                 ),
                            //             );
                            //             AttachedFileApi.deleteFile(elm.response.id, fileName);
                            //             } catch (error) {
                            //             vm.$swal({
                            //                 icon: 'error',
                            //                 html:
                            //                 vm.$t('failedAction', [vm.$t('deletion')]) +
                            //                 '<br/>' +
                            //                 vm.$t('tryAgain'),
                            //             });
                            //             }
                            //         }
                            //     }
                            // }
                            Swal.fire({
                                icon: 'success',
                                html: '삭제 되었습니다.<br />다이얼로그 창을 닫습니다.',
                            }).then(() => {
                                $emit('close-modal');
                            });
                        });
                    } catch (err) {
                        Swal.fire({
                        icon: 'error',
                        html:
                            '삭제에 실패하였습니다.<br />동일 현상이 반복될 경우, 관리자에게 문의 바랍니다.',
                        });
                    }
                }
            });
        }
        
        return {
            item, user, today, isIng, isReg,
            saveItem, deleteItem, completeRepair
        }
    }
}
</script>


<style lang="scss" scoped>
    @import "~/scss/main.scss";

    //첨부파일
    .line:nth-child(5) {
        span,
        label {
            height: 16px;
            color: #26c8fd;
            //font-size: 16px;
            font-weight: 500;
            margin:auto 16px auto 0;
        }
        .box {
            &.in{
                min-height: 52px;
                position: relative;
                label {
                    color: #4f5393;
                    top: 0;
                    bottom: 0;
                    margin: auto;
                    padding-left: 12px;
                    position: absolute;
                }
            }
        }
    }


.dialog_main {
    margin: auto;
    //width: 1350px;
    width: 100%;
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
            gap: 10px;
        }
    }
}

select {
    color: #fff;
}

</style>