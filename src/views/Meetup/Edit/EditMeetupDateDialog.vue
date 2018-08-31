<template>
    <v-dialog v-model="dialog" persistent width="350px">      
        <v-btn slot="activator" color="accent" flat icon class="mr-0">
            <v-tooltip bottom>
                <v-icon slot="activator">date_range</v-icon>
                <span>Edit Date</span>
            </v-tooltip> 
        </v-btn>             
      <v-card>
          <v-container>
              <v-layout row>
                  <v-flex xs12 class="ml-0">
                      <v-card-title class="subheading indigo--text pl-1">Edit Meetup Date</v-card-title>
                  </v-flex>
              </v-layout>
              <v-layout row>
                  <v-flex xs12>
                        <v-date-picker                        
                            v-model="editedDate"
                            style="width: 100%"
                            color="accent"
                            actions                            
                        >                        
                        <template scope="{save, cancel}">
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
                    </v-date-picker>  
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
                editedDate: this.meetup.date.slice(0, this.meetup.date.indexOf(' '))
                // editedtime: this.meetup.date.slice(this.meetup.date.indexOf(' ')+1)
               
            }
        },        
        methods: {
            onSaveChanges () {
                this.dialog = false
                    const time = this.meetup.date.slice(this.meetup.date.indexOf(' '))
                    const newDate = this.editedDate + time
                    // console.log(newDate)
                    this.$store.dispatch('updateMeetup', {
                        id: this.meetup.id,
                        date: newDate                       
                    })
                                
            },
            onCancel () {
                this.dialog = false
                this.editedDate = this.meetup.date.slice(0, this.meetup.date.indexOf(' '))                          
            }
        }
    }
</script>