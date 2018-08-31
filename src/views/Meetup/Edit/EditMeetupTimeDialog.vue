<template>
    <v-dialog v-model="dialog" persistent width="350px">      
        <v-btn slot="activator" color="accent" flat icon class="ml-0">
            <v-tooltip bottom>
                <v-icon slot="activator">update</v-icon>
                <span>Edit Time</span>
            </v-tooltip> 
        </v-btn>             
        <v-card>
          <v-container>
              <v-layout row>
                  <v-flex xs12 class="ml-0">
                      <v-card-title class="subheading indigo--text pl-1">Edit Meetup Time</v-card-title>
                  </v-flex>
              </v-layout>
              <v-layout row>
                  <v-flex xs12>
                        <v-time-picker                        
                            v-model="editedTime"
                            style="width: 100%"
                            color="accent"
                            actions                            
                        >                        
                        <template >
                            <v-btn 
                                flat 
                                color="accent darken-3" 
                                @click.native="onCancel">Cancel
                            </v-btn>
                            <v-spacer />
                            <v-btn 
                                flat 
                                color="accent darken-3" 
                                @click="onSaveChanges">Save
                            </v-btn>                   
                        </template> 
                    </v-time-picker>  
                  </v-flex>
              </v-layout>
          </v-container>       
        
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ['meetup'],
        data () {
            return {
                dialog: false,
                // editedDate: this.meetup.date.slice(0, this.meetup.date.indexOf(' '))
                editedTime: this.meetup.date.slice(this.meetup.date.indexOf(' ')+1)
               
            }
        },        
        methods: {
            onSaveChanges () {
                this.dialog = false
                    const date = this.meetup.date.slice(0, this.meetup.date.indexOf(' '))
                    const newDate = date + ' ' + this.editedTime
                    // console.log(newDate)
                    this.$store.dispatch('updateMeetup', {
                        id: this.meetup.id,
                        date: newDate                       
                    })
                                
            },
            onCancel () {
                console.log(this.editedTime)
                this.dialog = false
                this.editedTime = this.meetup.date.slice(this.meetup.date.indexOf(' ')+1)                           
            }
        }
    }
</script>