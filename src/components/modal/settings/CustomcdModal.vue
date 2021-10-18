<template>
    <div class="modal" @click.self="$emit('close-modal')">
        <div class="modal_main" >
            <div class="modal_head">
                <div class="modal_head_content">
                    <div class="title">
                        <div class="dashboardimg"></div>
                        <span>설정관리 > 금형코드 관리</span>
                    </div>
                    <div class="infobtn">
                        <input type="radio" id="value1" v-model="meuninfo" value="1" checked><label for="value1">금형코드 {{ editedItem && editedItem.id !== 'register' ? '조회' : '등록' }}</label>
                    </div>         
                </div>
                <div class="btnarea">
                    <div class="btn" @click="$emit('close-modal')">
                        <span class="material-icons">
                            close
                        </span>
                        <span>닫 기</span>
                    </div>
                </div>
            </div>
            <div class="modal_body">
                <div class="counter_input_box">
                    <div class="line">
                        <div class="box in">
                            <span>금형코드</span>
                            <input id="moldCode" v-model="editedItem.code" type="text" />
                        </div>
                        <div class="box in">
                            <span>코드 명</span>
                            <input id="codeName" v-model="editedItem.codeName" type="text" />
                        </div>
                        <div class="btn" @click.prevent="duplicateCustomCode">중복 확인</div>
                    </div>
                    <div class="line">
                        <div class="box in">
                            <span>코드 유형</span>  
                            <select v-model="editedItem.codeType" class="modal_select" name="" id="" style="height: 32px;">
                                <option value="text">Text</option>
                                <option value="select">Select</option>
                                <option value="radio">Radio</option>
                            </select>
                        </div>
                        <div class="box in">
                            <span>화면 표시 여부</span>
                            <input type="checkbox" v-model="isVisible">
                        </div>
                        <div class="box in">
                            <span>검색 허용 여부</span>
                            <input type="checkbox" v-model="isSearchable">
                        </div>
                    </div>
                </div>
                <div class="btnarea">
                    <div class="btn medium" @click="saveItem">
                        <span>저장</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from '@vue/reactivity';
import CustomCodeApi from '~/apis/commoncd';
import { useStore } from "vuex";
import Swal from 'sweetalert2';

export default {
    props: {
        editItem: {
            type: Object,
        },
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
        
        const editedItem = ref({ 
            code: '',
            codeName: '',
            codeType: 'text',
            codeElements: [],
            visible: false,
            searchable: false,
        });

        const isDuplicateChecked = ref(false);
        const isVisible = ref(true);
        const isSearchable = ref(true);   
        
        const elCode = ref({
            text: '',
            value: '',
            order: 0,
        });

        console.log("testestset",props.editItem.id)
        if (props.editItem) {
            editedItem.value = _.cloneDeep(props.editItem);
            if (!editedItem.value.codeType) {
                editedItem.value.codeType = 'text';
            }
            if (props.editItem.id) {
                //isDuplicateChecked.value = true;
                isVisible.value = props.editItem.visible ? true : false;
                isSearchable.value = props.editItem.searchable ? true : false;
            }
        } 
        else {
            editedItem.value.codeType = 'text';
        }
        
        console.log("testestset",isDuplicateChecked.value)
        function duplicateCustomCode() {
            if (isDuplicateChecked.value) {
                return;
            }
            if (!editedItem.value.code) {
                Swal.fire({
                    title: '중복확인',
                    text: '코드를 입력해 주세요.',
                });
                return;
            }
            if (props.editItem.code === editedItem.value.code) {
                return;
            }
            CustomCodeApi.getCode(user.value.companyId, editedItem.value.code).then(
                res => {
                    console.log('code...', editedItem.value.code, res);
                    if (res && res.data && res.data.length > 0) {
                        Swal.fire({
                            icon: 'error',
                            text: '이미 등록된 코드입니다.',
                        });
                        isDuplicateChecked.value = false;
                    } else {
                        Swal.fire({
                            icon: 'success',
                            text: '사용 가능한 코드입니다.',
                        });
                        isDuplicateChecked.value = true;
                    }
                },
            );
        }

        function saveItem() {
            if (!isDuplicateChecked.value) {
                Swal.fire({
                    icon: 'warning',
                    text: '코드 중복 확인 바랍니다.',
                });
                return;
            }
            try {
                let entity = _.cloneDeep(editedItem.value);
                delete entity.codeElements;
                if (editedItem.value.codeElements) {
                    entity['codeElements'] = JSON.stringify(editedItem.value.codeElements);
                    console.log("dlrjanjsid", editedItem.value.codeElements)
                }
                entity.visible = isVisible.value;
                entity.searchable = isSearchable.value;
                entity['creatorId'] = user.value.id;

                console.log("tests", entity);
                CustomCodeApi.saveCode(entity, user.value.companyId, editedItem.value.id)
                .then(res => {
                    if (res.data.id) {
                        Swal.fire({
                            icon: 'success',
                            text: '코드 저장에 성공하였습니다.',
                        }); //.then(() => this.$emit('close', res.data));
                    } else {
                        throw Error('비정상 호출입니다.');
                    }
                })
                .catch(err => {
                    throw err;
                });
            } catch (ex) {
                Swal.fire({
                    icon: 'error',
                    text: '코드 저장 중에 시스템 오류가 발생하였습니다.',
                });
                console.error(ex);
            }
        }

        const meuninfo = ref('1');
        const file_name = ref('가입 시 제출하신 사업자등록증을 첨부해주세요.');
        const file_label = ref('');

        const handleFileChange = (e) => {
            file_name.value = e.target.files[0].name;
            file_label.value = '#26c8fd';
        } 
        return { 
            meuninfo, file_name, file_label, editedItem, isVisible, isSearchable, 
            handleFileChange, saveItem, duplicateCustomCode
        }
    }
}
</script>


<style lang="scss" scoped>
@import "~/scss/main.scss";
.modal_main {
        max-width: 800px;
}
//수정
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
        color: rgb(115, 151, 253);
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