<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-toolbar color="accent" dark>
          <v-icon left>person_outline</v-icon>
          <v-toolbar-title>{{userEmail}}</v-toolbar-title>  
        </v-toolbar>

        <v-list two-line subheader>         
          <v-subheader inset>Created meetups ({{createdMeetups.length}})</v-subheader>

          <v-list-tile
            v-for="(item, i) in createdMeetups"
            :key="i"
            avatar
            
          >
            <v-list-tile-avatar>
              <!-- <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon> -->
              <v-icon class="amber darken-4 white--text">folder_shared</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple :to="'/meetups/' + item.id">
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider inset></v-divider>       

          <v-subheader inset>Registered meetups ({{registeredMeetupItems.length}})</v-subheader>

          <v-list-tile
            v-for="item in registeredMeetupItems"
            :key="item.title"
            avatar
           
          >
            <v-list-tile-avatar>
              <!-- <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon> -->
              <v-icon class="light-green darken-2 white--text">how_to_reg</v-icon>
              
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple :to="'/meetups/' + item.id">
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    // data () {
    //   return {
    //     items: [
    //       { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Photos', subtitle: 'Jan 9, 2014' },
    //       { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Recipes', subtitle: 'Jan 17, 2014' },
    //       { icon: 'folder', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' }
    //     ],
    //     items2: [
    //       { icon: 'assignment', iconClass: 'blue white--text', title: 'Vacation itinerary', subtitle: 'Jan 20, 2014' },
    //       { icon: 'call_to_action', iconClass: 'amber white--text', title: 'Kitchen remodel', subtitle: 'Jan 10, 2014' }
    //     ]
    //   }
    // },
    computed: {
        userEmail () {            
            return this.$store.getters.user.email
        },
        createdMeetups () {
            const createdMeetups = []
            const loadedMeetups = this.$store.getters.loadedMeetups 
            const user = this.$store.getters.user
            // console.log('user', this.$store.getters.user)
            if (user) {
                const userId = this.$store.getters.user.id
                loadedMeetups.forEach(meetup => {
                    if (userId === meetup.creatorId) {
                        createdMeetups.push({
                            title: meetup.title,
                            subtitle: meetup.date,
                            // icon: 'add_alert',
                            // iconClass: 'amber white--text',
                            id: meetup.id
                        })
                    }                
                });
                // console.log('createdMeetups', createdMeetups)
            }            
            return createdMeetups  

        },
        registeredMeetupItems () {
            // const registeredMeetupItems = []
            // const loadedMeetups = this.$store.getters.loadedMeetups
            // const user = this.$store.getters.user
            // if (user) {
            //     const registeredMeetups = user.registeredMeetups
            //     registeredMeetups.forEach(meetupId => {
            //         if (loadedMeetups.findIndex(meetup => meetupId === meetup.id) >= 0) {
            //             registeredMeetupItems.push({
            //                 title: meetup.title,
            //                 subtitle: meetup.date,
            //                 icon: 'assignment',
            //                 iconClass: 'blue white--text'
            //             })
            //         }
            //     })
            // }
            // console.log('registeredMeetupItems', registeredMeetupItems)
            // return registeredMeetupItems
            //---------------

            const registeredMeetupItems = []
            const loadedMeetups = this.$store.getters.loadedMeetups 
            const user = this.$store.getters.user
            // console.log('user', this.$store.getters.user)
            if (user) {
                const registeredMeetups = user.registeredMeetups
                loadedMeetups.forEach(meetup => {
                    if (registeredMeetups.findIndex(meetupId => meetupId === meetup.id) >= 0) {
                        registeredMeetupItems.push({
                            title: meetup.title,
                            subtitle: meetup.date,
                            // icon: 'assignment',
                            // iconClass: 'lime white--text',
                            id: meetup.id
                        })
                    }                
                });
                // console.log('registeredMeetupItems', registeredMeetupItems)
            }            
            return registeredMeetupItems 

                       
        }
    }
  }
</script>
