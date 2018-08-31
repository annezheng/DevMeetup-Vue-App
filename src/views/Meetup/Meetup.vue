<template>
    <v-container>
        <v-layout v-if="loading">
            <v-flex xs12 class="text-xs-center">
            <v-progress-circular
                :size="50"
                color="accent darken-2"
                indeterminate
            ></v-progress-circular>
            </v-flex>       
        </v-layout>
        <v-layout row wrap v-else> 
            <v-flex xs12>
                <v-card>
                    <v-card-title primary-title>
                        <div>
                            <div class="headline indigo--text font-weight-bold">{{meetup.title}}</div>
                            <span>{{meetup.location}}</span>                            
                        </div>
                         <template v-if="userIsCreator">
                            <v-spacer />
                            <app-edit-meetup-details-dialog :meetup="meetup"/>
                        </template>
                    </v-card-title> 
                    <v-card-media
                        :src="meetup.imageUrl"
                        height="400px"                                                                                   
                    ></v-card-media>
                    <v-card-text>
                        <div class="subheading mb-2 indigo--text font-weight-bold">
                            {{meetup.date | date}}
                            <template v-if="userIsCreator">                               
                                <app-edit-meetup-Date-dialog  :meetup="meetup"/>
                                <app-edit-meetup-Time-dialog  :meetup="meetup"/>
                            </template>
                        </div>                        
                        <div>{{meetup.description}}</div>                       
                    </v-card-text>
                    <v-card-actions>  
                        <router-link to="/meetups" tag="span">
                            <v-tooltip bottom>                            
                                <v-icon
                                    slot="activator"
                                    class="ml-2" 
                                    color="accent darken-3"
                                    dark
                                >far fa-arrow-alt-circle-left
                                </v-icon>                        
                                <span>Go Back</span>
                            </v-tooltip>
                        </router-link>                                       
                        <v-spacer></v-spacer> 
                        <!-- <v-btn                              
                            color="red darken-3" 
                            @click="onDeleteMeetup">Delete
                        </v-btn>   -->
                        <v-btn 
                            color="amber darken-3" 
                            class="mr-2 mb-2" 
                            dark 
                            @click="onDeleteMeetup">Delete
                            <v-icon dark right class="hidden-xs-only">delete</v-icon>
                        </v-btn>                      
                        <div class="mr-2 mb-2" v-if="userIsAuthenticated && !userIsCreator">
                            <app-meetup-register-dialog :meetupId="meetup.id"/>
                        </div>                        
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: ['id'],
    computed: {
      meetup () {
        return this.$store.getters.loadMeetup(this.id)
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
          if (!this.userIsAuthenticated) {
              return false
          } 
          return this.$store.getters.user.id === this.meetup.creatorId          
      },
      userIsRegistered () {
            return this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
                return meetupId === this.meetup.id
            }) >= 0
      },
      loading () {
          return this.$store.getters.loading
      }
    },
    methods: {
        onDeleteMeetup () {
            if (this.userIsRegistered) {
                console.log('dispatch unregisterUserFromMeetup')
                this.$store.dispatch('unregisterUserFromMeetup', this.meetup.id)
            }
            this.$store.dispatch('deleteMeetup', this.meetup.id)
            this.$router.push('/meetups')
        }
    }
    
}
</script>
