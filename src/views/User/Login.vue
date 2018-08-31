<template>
    <v-container>
        <v-layout row v-if="error">
            <v-flex xs12 sm8 offset-sm2>
                <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12 sm8 offset-sm2> 
                <v-card flat>
                    <v-card-text>
                        <div class="display-1 teal--text">Login</div>
                    </v-card-text>
                    <v-container>                    
                        <v-form v-model="valid" ref="form" @submit.prevent="onLogin">
                            <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            type="email"
                            color="teal"
                            required
                            ></v-text-field>
                            
                            <v-text-field
                            v-model="password"
                            :rules="passwordRules"
                            :counter="10"
                            label="Password"
                            type="password"
                            color="teal"
                            required                            
                            ></v-text-field>                           
                    
                            <v-card-actions class="mt-4">
                                <v-btn @click="clear" flat color="teal darken-3">Clear</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                :disabled="!valid || loading" 
                                :loading="loading"         
                                color="teal darken-3 white--text"                                
                                type="submit"
                                >Log In
                                <span slot="loader" class="custom-loader">
                                    <v-icon light>cached</v-icon>
                                </span>
                                </v-btn>       
                            </v-card-actions>   
                        </v-form>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    data: () => ({     
      valid: false,      
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v || '').length >= 6 || 'Password should be at least 6 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    }),
    computed: {        
        user () {
            return this.$store.getters.user
        },
        error () {
            return this.$store.getters.error
        },
        loading () {
            return this.$store.getters.loading
        }
    },
    watch: {
        user (value) {
            if (value !== null && value !== undefined) {
                this.$router.push('/')
            }
        }
    },
    methods: {
        clear () {
            this.$refs.form.reset()
        },
        onLogin () {
            // console.log(this.valid, this.email, this.password)
             this.$store.dispatch('signUserIn', {email: this.email, password: this.password})
        },
        onDismissed () {
            console.log('onDismissed')
            this.$store.dispatch('clearError')
        }
    }
  }
</script>
