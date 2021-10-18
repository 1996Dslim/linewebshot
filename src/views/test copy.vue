<template>
        <div class="multfile_box">
            <span>첨부파일</span>
            <input @change="handleFileChange" id = "multfile" type="file" multiple>
            <label class="filewrap">
                <div class="files" v-for="file, index in file_name" :key="index">{{ file.name }} <button></button> </div>
                <div v-if="file">업로드할 파일</div>
            </label>
            <label class="multfile_btn" for="multfile">파일선택</label>
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
//@import "~/scss/main.scss";
 @import "~/scss/test1.scss";
</style>