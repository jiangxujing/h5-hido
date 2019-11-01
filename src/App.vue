<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { resetFontSize, resetWindow } from '@/common/utils.js'

    export default {
        name: 'app',
        data() {
            return {
                debug: false
            }
        },
        beforeMount () {
            resetFontSize(document, window)
            resetWindow()
            window.addEventListener('resize', () => {
                resetFontSize(document, window)
                resetWindow()
            })
        }
    };
</script>

<style lang="scss">
    @import './assets/scss/index.scss';
    @import './assets/scss/reset.scss';
    @import './assets/scss/quill.snow.css';
    @import './assets/scss/vant.scss';
    #app{
    	width:100%;
    	height:100%;
    }
</style>
