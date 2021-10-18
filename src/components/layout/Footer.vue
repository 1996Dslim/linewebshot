<template>
    <footer>
        <span>
            © {{ new Date().getFullYear() }} ITIFROM. All Rights Reserved.
        </span>
    </footer>
</template>

<style scoped lang="scss">
    footer {
    height: 40px;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #000a2c;
    position: fixed;
    span {
        height: 13px;
        font-size: 12px;
        color: #46529f;
        top: 0;
        bottom: 0;
        left: 121px;
        margin: auto;
        position: absolute;
    }
}

</style>