import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/router'
import { store } from './store'
import DateFilter from './filters/date'
import * as firebase from 'firebase'

import AlertComp from './components/Alert'
import EditMeetupDetailsDialog from './views/Meetup/Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from './views/Meetup/Edit/EditMeetupDateDialog'
import EditMeetupTimeDialog from './views/Meetup/Edit/EditMeetupTimeDialog'
import RegisterDialog from './views/Meetup/Registration/RegisterDialog'

Vue.config.productionTip = false

Vue.filter('date', DateFilter)

Vue.component('app-alert', AlertComp)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-Date-dialog', EditMeetupDateDialog)
Vue.component('app-edit-meetup-Time-dialog', EditMeetupTimeDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: "AIzaSyAzDLIBMEFKzf3_kg5lS2XnqeT9yQX0jbY",
      authDomain: "devmeetup-74ba8.firebaseapp.com",
      databaseURL: "https://devmeetup-74ba8.firebaseio.com",
      projectId: "devmeetup-74ba8",
      storageBucket: "devmeetup-74ba8.appspot.com",
      messagingSenderId: "233293747167"
    })
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
    this.$store.dispatch('loadMeetups')
  }
}).$mount('#app')
