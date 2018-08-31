<template>
  <v-app>
    <v-navigation-drawer temporary app class="hidden-sm-and-up" v-model="sideNav">
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile>     
            <v-list-tile-content>
              <v-list-tile-title>DevMeetup</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.title"        
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>      
    <v-toolbar dark class="accent darken-2">
      <v-toolbar-side-icon class="hidden-sm-and-up" @click.stop="sideNav = !sideNav">        
      </v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag='span' style="cursor: pointer;">DevMeetUp</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      
      <v-toolbar-items 
        class="hidden-xs-only">        
        <v-btn flat 
          v-for="item in menuItems" 
          :key="item.title" 
          :to="item.link">
            <v-icon left>{{ item.icon }}</v-icon>
            {{ item.title }}
        </v-btn>
        <v-btn flat 
          v-if="userIsAuthenticated"         
          @click="onLogout">
            <v-icon left>exit_to_app</v-icon>
            Logout
        </v-btn>              
      </v-toolbar-items>     
    </v-toolbar>
    
    <v-content>
      <v-container fluid >
        <router-view></router-view>
      </v-container>
    </v-content>     

    <v-bottom-sheet v-model="sheet">
      <v-footer dark class="accent darken-2 pa-3" slot="activator">
        <v-spacer></v-spacer>
        <div>&copy; {{ new Date().getFullYear() }}</div>
      </v-footer>   
      <v-list>
        <v-subheader>Building Technologies</v-subheader>
        <v-list-tile
          v-for="tile in tiles"
          :key="tile.title"
          @click="sheet = false"
        >
          <v-list-tile-avatar>
            <v-icon>{{tile.icon}}</v-icon>           
          </v-list-tile-avatar>
          <v-list-tile-title>{{ tile.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-bottom-sheet>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      sideNav: false,
      sheet: false,
      tiles: [
        { icon: 'code', title: 'VueJS' },
        { icon: 'store', title: 'Vuex' },
        { icon: 'flip_to_front', title: 'Vuetify' },
        { icon: 'perm_data_setting', title: 'Google Firebase' }
      ]       
    }
  },
  computed: {
    menuItems () {
      let menuItems = [
          { title: 'Sign Up', icon: 'face', link: '/signup' },
          { title: 'Log In', icon: 'lock_open', link: '/login' }
      ]
      if (this.userIsAuthenticated) {
        menuItems = [
          { title: 'View Meetups', icon: 'supervisor_account', link: '/meetups' },
          { title: 'Organize Meetup', icon: 'room', link: '/meetup/new' },
          { title: 'Profile', icon: 'person', link: '/profile' }               
        ]
      }
      return menuItems
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
      this.$router.push('/')
    }
  }
}
</script>

<style>  
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
