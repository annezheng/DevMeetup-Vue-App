import Vue from 'vue'
import Vuex from 'vuex'
import meetup from './meetup'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    meetup: meetup,
    user: user,
    shared: shared
  }
})

/*
import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null
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
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.location) {
        meetup.location = payload.location
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      } 
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state, payload) {
      state.error = null
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
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then (data => {          
          const meetups = []
          const obj = data.val()         
          for (let key in obj) {           
            meetups.push({
              id: key,
              title: obj[key].title,
              location: obj[key].location,
              imageUrl: obj[key].imageUrl,
              description: obj[key].description,
              date: obj[key].date,
              creatorId: obj[key].creatorId 
            })
          }              
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        })
        .catch ( error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        creatorId: getters.user.id      
      }
      firebase.database().ref('meetups').push(meetup)
        .then(data => {
          // console.log(data.key);
          const key = data.key;
          commit('createMeetup', {
            ...meetup, 
            id: key
          })
        })
        .catch(error => {
          console.log(error)
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
            fbKeys: {}
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
            fbKeys: {}
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
      commit('setUser', {
        id : payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    fetchUserData ({commit, getters}) {
      console.log('fetchUserData', getters.user.id)
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
          console.log(fbKeyObj, registeredMeetups)  
          commit('setUser', {
            id : getters.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: fbKeyObj
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
    },
    clearError ({commit}) {
      commit('clearError')
    },
    // Create Meetup that contains image file
    createMeetupF ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,       
        description: payload.description,
        date: payload.date,
        creatorId: getters.user.id      
      }
      let iUrl
      let key
      let ext
      firebase.database().ref('meetups').push(meetup)
        .then(data => {  
          key = data.key        
          return key
        })
        .then(key => {
          const filename = payload.imageFile.name
          ext = filename.slice(filename.lastIndexOf('.'))          
          return firebase.storage().ref('meetups/' + key + ext).put(payload.imageFile)
        })
        .then(() => {  
          firebase.storage().ref('meetups/' + key + ext).getDownloadURL()
            .then(url => {
              iUrl = url            
              return firebase.database().ref('meetups').child(key).update({imageUrl: iUrl})
            })
        })
        .then(() => {
          commit('createMeetup', {
            ...meetup, 
            imageUrl: iUrl,
            id: key
          })

        })
        .catch(error => {
          console.log(error)
        })
    },  
    updateMeetup ({commit}, payload) {
      commit('setLoading', true)
      const updateMeetupObj = {}
      if (payload.title) {
        updateMeetupObj.title = payload.title
      }
      if (payload.location) {
        updateMeetupObj.location = payload.location
      }
      if (payload.description) {
        updateMeetupObj.description = payload.description
      }
      if (payload.date) {
        updateMeetupObj.date = payload.date
      } 
      
      firebase.database().ref('meetups').child(payload.id).update(updateMeetupObj)
        .then(data => {
          console.log('data', data);         
          commit('updateMeetup', payload)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    user (state) {
      return state.user
    },
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    }
  }
}) */