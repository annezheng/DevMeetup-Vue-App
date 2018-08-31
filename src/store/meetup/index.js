import * as firebase from 'firebase'

export default {
  state: {
    loadedMeetups: []    
  },
  mutations: {    
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
    deleteMeetup (state, payload) {
        const meetupIndex = state.loadedMeetups.findIndex(meetup => meetup.id === payload)
        if (meetupIndex < 0) {
            console.log('meetupIndex does not exist', meetupIndex)
            return
        }
        state.loadedMeetups.splice(meetupIndex, 1) 
    }
  },
  actions: {    
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
    },


    deleteMeetup ({commit}, payload) {
        commit('setLoading', true)

        // delete this meetup from all user's registered meetup
        firebase.database().ref('users').once('value')
            .then (data => {                
        
            const obj = data.val()  
            // console.log('obj', obj)          
            for (let key in obj) { 
                // console.log(key, obj[key]) 
                
                firebase.database().ref('/users/' + key + '/registration/').once('value')
                .then (regData => {
                    const regObj = regData.val()
                    // console.log('regObj', regObj)  
                    for (let regKey in regObj) {
                        // console.log(regKey, regObj[regKey]) 
                        if (regObj[regKey] === payload) {
                            
                            firebase.database().ref('/users/' + key + '/registration/').child(regKey)
                            .remove()
                            .then(() => console.log('delete it'))
                            .catch ( error => {
                                console.log(error)
                                commit('setLoading', false)
                              })
                        }
                    } 
                })
                .catch ( error => {
                    console.log(error)
                    commit('setLoading', false)
                  })
        
          }              
        //   commit('setLoadedMeetups', meetups)
        //   commit('setLoading', false)
        })
        .catch ( error => {
          console.log(error)
          commit('setLoading', false)
        })

        // console.log('delete Meetups');

        firebase.database().ref('meetups').child(payload).remove()
        .then(data => {
            // console.log('data', data);         
            commit('deleteMeetup', payload)
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
    }
  }
}