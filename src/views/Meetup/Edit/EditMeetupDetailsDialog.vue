<template>
    <v-dialog v-model="dialog" persistent width="450px">
      <v-btn slot="activator" color="accent" dark fab small><v-icon>edit</v-icon></v-btn>
      <v-card>
          <v-container>
              <v-layout row>
                  <v-flex xs12>
                      <v-card-title class="subheading indigo--text">Edit Meetup</v-card-title>
                  </v-flex>
              </v-layout>
              <v-layout row>
                  <v-flex xs12>                    
                      <v-card-text>
                            <v-text-field
                            v-model="editedTitle"                            
                            color="indigo"
                            label="Title"
                            :rules="rules.name"
                            :counter="100"
                            required                            
                            ></v-text-field>
                            <v-text-field
                            v-model="editedLocation"                               
                            color="indigo"
                            label="Location"
                            :rules="rules.name"
                            :counter="100"
                            required                            
                            ></v-text-field>
                            <v-textarea
                            v-model="editedDescription"                               
                            color="indigo"
                            label="Description"
                            :rules="rules.desp"
                            :counter="500"
                            required
                            >                           
                            </v-textarea>
                        </v-card-text>
                        <v-card-actions>                           
                            <v-btn class="indigo--text" flat @click="onCancel">Cancel</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="indigo darken-1" flat :disabled="!IsValid"  @click="onSaveChanges">Save</v-btn>
                        </v-card-actions>
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
                editedTitle: this.meetup.title,
                editedLocation: this.meetup.location,
                editedDescription: this.meetup.description,
                rules: {
                    name: [
                        val => (val || '').length > 0 || 'This field is required',
                        val => (val && val.length <= 100) || 'This field must be less than 100 characters'
                    ],
                    desp: [
                        val => (val || '').length > 0 || 'This field is required',
                        val => (val && val.length <= 500) || 'This field must be less than 500 characters'            
                    ]  
                },
            }
        },
        computed: {
            IsValid () {
                return (
                    this.editedTitle && this.editedTitle.trim().length <= 100 &&
                    this.editedLocation && this.editedLocation.trim().length <= 100 &&
                    this.editedDescription && this.editedDescription.trim().length <= 500
                )
            }
        },
        methods: {
            onSaveChanges () {
                this.dialog = false
                if (this.IsValid) {                    
                    // console.log('id', this.meetup.id)
                    this.$store.dispatch('updateMeetup', {
                        id: this.meetup.id,
                        title: this.editedTitle,
                        location: this.editedLocation,
                        description: this.editedDescription
                    })
                }                
            },
            onCancel () {
                this.dialog = false
                this.editedTitle = this.meetup.title
                this.editedLocation = this.meetup.location
                this.editedDescription = this.meetup.description                
            }
        }
    }
</script>