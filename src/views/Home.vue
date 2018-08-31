<template>
  <v-container fluid> 
      <v-layout v-if="loading">
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular
            :size="50"
            color="accent darken-2"
            indeterminate
          ></v-progress-circular>
        </v-flex>       
      </v-layout>

      <v-alert
        v-if="!loading && meetups.length == 0"
        :value="true"
        color="info"
        icon="info"
        outline
      >
        No meetups found. Please Login or Signup and create meetups.
      </v-alert>
        
        <v-layout row wrap class="mt-2" v-if="!loading && meetups.length > 0">
          <v-flex xs12>
              <v-carousel
                delimiter-icon="stop"
                prev-icon="keyboard_arrow_left"
                next-icon="keyboard_arrow_right"
                style="cursor: pointer"
                interval='8000'
              >
                <v-carousel-item
                  v-for="meetup in meetups"
                  :key="meetup.id"
                  :src="meetup.imageUrl"
                  @click.native="onLoadMeetup(meetup.id)"
                >
                <v-layout column align-center justify-center 
                  class="white--text" style="font-size: 1.5rem; background: rgba(0,0,0,.2); padding: 10px;">
                  {{meetup.title}}
                </v-layout>  
                </v-carousel-item>
              </v-carousel>
          </v-flex>
        </v-layout>

        <v-layout row wrap class="mt-4" v-if="!loading && meetups.length > 0">
          <v-flex xs12 sm6 class="text-xs-center text-sm-right">
            <v-btn color="accent darken-2" large router to="/meetups">Explore Meetups</v-btn>
          </v-flex>
          <v-flex xs12 sm6 class="text-xs-center text-sm-left">
            <v-btn color="accent darken-2" large router to="/meetup/new">Organize Meetups</v-btn>
          </v-flex>
        </v-layout>   
  </v-container>
</template>

<script>
  export default {
    computed: {
      meetups () {
        return this.$store.getters.featuredMeetups
      },
      loading () {
          return this.$store.getters.loading
      }
    },
    methods: {
      onLoadMeetup (id) {
        console.log(id)
        this.$router.push('/meetups/' + id);         
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  position: absolute;
  bottom: 50px;
  text-align: center;

}
</style>
