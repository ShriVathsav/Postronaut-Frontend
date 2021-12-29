// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App'
import router from './router'
import SuiVue from 'semantic-ui-vue';
import 'semantic-ui-css/semantic.min.css';
import PortalVue from 'portal-vue';
import store from "./store"
import axios from "axios"

import "./main.css"

import InfiniteLoading from 'vue-infinite-loading';

Vue.use(InfiniteLoading, { /* options */ });

Vue.use(PortalVue);

Vue.use(SuiVue)

Vue.config.productionTip = false

axios.defaults.baseURL = 'https://postronaut-backend.herokuapp.com/';
//axios.defaults.baseURL = 'http://localhost:5000';
/*
const tokenPresence = () => {
  //console.log(store)
    if(store.state.auth.user && Object.keys(store.state.auth.user).length !== 0){
        return store.state.auth.user.token ? store.state.auth.user.token : ""
    }
}

axios.defaults.headers.common['Authorization'] = `Bearer ${tokenPresence()}`

/
axios.interceptors.response.use(res => res, function (error) {
    console.log(error, "PRINTING ERROR FROM MAIN JS")
    if(error.response.status === 401){
        //store.dispatch('auth/logout')
        //router.push('/signin')
    }    
    return error
})


/* eslint-disable no-new */
/*new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
