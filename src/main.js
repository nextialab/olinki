import Vue from 'vue';
import VueRouter from 'vue-router';
import home from './home.vue';
import app from './app.vue';
import login from './login.vue';
import './main.less';

Vue.use(VueRouter);

const routes = [
	{ path: '/', component: home },
	{ path: '/app', component: app },
	{ path: '/login', component: login }
];

const router = new VueRouter({
	routes
});

new Vue({
    router
}).$mount('.vue-app');