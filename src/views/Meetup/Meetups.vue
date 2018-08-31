<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <v-card 
                    class="info white--text mb-4" 
                    v-for="meetup in meetups"
                    :key="meetup.id">
                    <v-card-media
                        :src="meetup.imageUrl"
                        height="200px"                                                                                   
                    ></v-card-media>
                    <v-card-title primary-title>
                    <div>
                        <div class="headline mb-2">
                            {{meetup.title}}                            
                            <v-tooltip bottom v-if="meetup.registered">
                            <v-icon
                                slot="activator"
                                color="blue lighten-5"
                                dark
                                class="ml-4"
                            >how_to_reg</v-icon>
                            <span>Registered</span>
                            </v-tooltip>

                        </div>
                        <span class="black--text">{{meetup.date | date}}</span>
                    </div>
                    </v-card-title>
                    <v-divider light></v-divider>
                    <v-card-actions>
                        <v-btn flat dark :to="'/meetups/'+ meetup.id">
                            <v-icon left light>far fa-arrow-alt-circle-right</v-icon>
                            View Meetup
                        </v-btn>
                    </v-card-actions> 
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    computed: {
        meetups () {     
            const loadedMeetups = this.$store.getters.loadedMeetups 
            const user = this.$store.getters.user
            // console.log('user', this.$store.getters.user)
            if (user) {
                const registeredMeetups = this.$store.getters.user.registeredMeetups
                loadedMeetups.forEach(meetup => {
                    if (registeredMeetups.findIndex(meetupId => meetupId === meetup.id) >= 0) {
                        meetup['registered'] = true
                        // console.log('registered', meetup)
                    } else {
                        meetup['registered'] = false    
                    }                
                });
                // console.log('loadedMeetups', loadedMeetups)
            }            
            return loadedMeetups 
            
            // return this.$store.getters.loadedMeetups            
        }         
    }
}
</script>


