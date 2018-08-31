<template>
    <v-dialog v-model="dialog" persistent max-width="400">      
        <!-- <v-btn slot="activator" color="accent darken-3">
            {{ userIsRegistered ? 'Unregister' : 'Register'}}           
        </v-btn>              -->
        <v-btn slot="activator" color="teal darken-3" v-if="userIsRegistered" dark>
            Unregister<v-icon dark right class="hidden-xs-only">exit_to_app</v-icon>           
        </v-btn>
        <v-btn slot="activator" color="accent darken-3" v-else>
            <v-icon dark left class="hidden-xs-only">how_to_reg</v-icon>Register           
        </v-btn>       
        <v-card>
          <v-container>
              <v-layout row>
                  <v-flex xs12>
                    <v-card-title class="headline indigo--text" v-if="userIsRegistered">Unregister from Meetup?</v-card-title>
                    <v-card-title class="headline indigo--text" v-else>Register for Meetup?</v-card-title>
                  </v-flex>
              </v-layout>
              <v-divider />  
              <v-layout row>
                  <v-flex xs12>
                        <v-card-text>You can always change your decision later on</v-card-text>       
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="indigo darken-3" flat @click.native="dialog = false">Cancel</v-btn>
                        <v-btn color="indigo darken-3" flat @click.native="onAgree">Confirm</v-btn>
                        </v-card-actions>   
                  </v-flex>
              </v-layout>
          </v-container>     
      </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ['meetupId'],
        data () {
            return {
                dialog: false                
            }
        },
        computed: {
             userIsRegistered () {
                return this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
                    return meetupId === this.meetupId
                }) >= 0
            },
        },
        methods: {
            onAgree () {
                this.dialog = false
                if (this.userIsRegistered) {
                    this.$store.dispatch('unregisterUserFromMeetup', this.meetupId)
                } else {
                    this.$store.dispatch('registerUserForMeetup', this.meetupId)
                }               

            }
        }
       
    }
</script>