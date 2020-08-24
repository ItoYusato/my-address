import Vue from 'vue'
import './plugins/vuetify'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
Vue.config.productionTip = false;

// firebaseコンソールからFirebase SDK snippetのCDNを貼り付け
const firebaseConfig = {
  apiKey: "AIzaSyBtj-Mu0__GZUFgUosKrj7f8ukf2kRcg28",
  authDomain: "my-address-pj-b66f5.firebaseapp.com",
  databaseURL: "https://my-address-pj-b66f5.firebaseio.com",
  projectId: "my-address-pj-b66f5",
  storageBucket: "my-address-pj-b66f5.appspot.com",
  messagingSenderId: "460831946796",
  appId: "1:460831946796:web:2b3a84548d20c4cbe7b989",
  measurementId: "G-9913ZDPYQB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics(); 


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
