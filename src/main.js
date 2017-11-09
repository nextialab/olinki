import Vue from 'vue';
import app from './app.vue'
import './main.less'

new Vue({
    el: '.vue-app',
    components: {
        app: app
    }
});