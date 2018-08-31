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
                        <div class="display-1 indigo--text">Sign Up</div>
                    </v-card-text>
                    <v-container>                    
                        <v-form v-model="valid" ref="form" @submit.prevent="onSignup">
                            <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                            type="email"
                            required
                            ></v-text-field>
                            
                            <v-text-field
                            v-model="password"
                            :rules="passwordRules"
                            :counter="10"
                            label="Password"
                            type="password"
                            required
                            ></v-text-field>

                            <v-text-field
                            v-model="confirmPassword"                            
                            :counter="10"
                            label="Confirm Password"
                            required
                            :error-messages="comparePasswords"                            
                            ></v-text-field>  
                    
                            <v-card-actions class="mt-4">
                                <v-btn @click="clear" flat color="indigo darken-3">Clear</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn
                                :disabled="!valid || loading" 
                                :loading="loading"                                       
                                color="accent darken-3"
                                type="submit"
                                >Sign Up
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
      confirmPassword: '',
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
        comparePasswords () {
            return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
        },
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
        onSignup () {            
            if (this.valid && this.email && this.password) {
                this.$store.dispatch('signUserUp', {email: this.email, password: this.password})
            }              
        },
        onDismissed () {
            console.log('onDismissed')
            this.$store.dispatch('clearError')
        }
    }
  }
</script>
