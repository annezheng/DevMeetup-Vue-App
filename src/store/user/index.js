import * as firebase from 'firebase'

export default {
  state: {    
    user: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetupId => meetupId === id) >= 0) {
        console.log('already registered', payload)
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      const registeredMeetupsIndex = registeredMeetups.findIndex(meetupId => meetupId === payload)
      if (registeredMeetupsIndex < 0) {
        console.log('registeredMeetupsIndex does not exist',registeredMeetupsIndex)
        return
      }
      registeredMeetups.splice(registeredMeetupsIndex, 1) 
      Reflect.deleteProperty(state.user.fbKeys, payload);
    },    
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id).child('/registration/')
        .push(payload)
        .then(data => {
          console.log(data.key, data);
          commit('registerUserForMeetup', {id: payload, fbKey: data.key})
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registration/').child(fbKey)
        .remove()
        .then(data => {
          console.log(data);
          commit('unregisterUserFromMeetup', payload)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },    
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then( user => {      
          commit('setLoading', false)
          const newUser = {
            id : user.user.uid,
            registeredMeetups: [],
            fbKeys: {},
            email: payload.email
          }
          commit('setUser', newUser)
        })
        .catch (error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        })
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then( user => {         
          commit('setLoading', false)
          const newUser = {
            id : user.user.uid,
            registeredMeetups: [],
            fbKeys: {},
            email: payload.email
          }
          commit('setUser', newUser)
        })
        .catch (error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        })
    },
    autoSignIn ({commit}, payload) { 
        console.log('autoSignIn', payload)     
      commit('setUser', {
        id : payload.uid,
        registeredMeetups: [],
        fbKeys: {},
        email: payload.email
      })
    },
    fetchUserData ({commit, getters}) {
      console.log('fetchUserData', getters.user.email)
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registration/').once('value')
        .then (data => {   
          const values = data.val()
          const registeredMeetups = []
          const fbKeyObj = {}
          for (let key in values) {  
            // console.log(key, values[key])           
            registeredMeetups.push(values[key])
            fbKeyObj[values[key]] = key
          } 
        //   console.log(fbKeyObj, registeredMeetups)  
          commit('setUser', {
            id : getters.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: fbKeyObj,
            email: getters.user.email
          })            
          commit('setLoading', false)
        })
        .catch ( error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)  
    }   
  },
  getters: {    
    user (state) {
      return state.user
    }
  }
}