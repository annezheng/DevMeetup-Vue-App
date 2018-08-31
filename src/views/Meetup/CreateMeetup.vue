<template>
    <v-container>  
        <v-snackbar
        v-model="snackbar"
        absolute
        top
        right
        color="success"
        >
        <span>Successful!</span>
        <v-icon dark>check_circle</v-icon>
        </v-snackbar> 
        <v-layout row>
            <v-flex xs12 sm8 offset-sm2>    
                <v-card flat>
                    <v-form ref="form" @submit.prevent="onCreateMeetup">
                        <v-container grid-list-xl fluid>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <div class="headline indigo--text">Create a new meetup</div>
                                </v-flex> 
                                <v-flex xs12>
                                    <v-text-field
                                    v-model="form.title"
                                    :rules="rules.name"
                                    :counter="100"
                                    color="indigo"
                                    label="Title"
                                    required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field
                                    v-model="form.location"
                                    :rules="rules.name"
                                    :counter="100"
                                    color="indigo"
                                    label="Location"
                                    required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-radio-group v-model="imageType" row @change="onChangeImageType">
                                        <v-radio label="Image URL" value="url"></v-radio>
                                        <v-radio label="Image File" value="file"></v-radio>
                                    </v-radio-group>
                                </v-flex>
                                <v-flex xs12 v-if="imageType === 'url'">
                                    <v-text-field
                                    v-model="form.imageUrl"
                                    :rules="rules.image"
                                    color="indigo"
                                    label="Image URL"
                                    required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 v-if="imageType === 'file'">                                    
                                    <v-btn                                      
                                        color="accent darken-3"
                                        class="white--text"
                                        @click="onPickFile"
                                    >
                                        Upload Image
                                        <v-icon right dark>cloud_upload</v-icon>
                                    </v-btn>
                                    <input 
                                        type="file" 
                                        style="display: none" 
                                        ref="fileInput" 
                                        accept="image/*"
                                        @change="onFilePicked"
                                    >                                    
                                </v-flex>
                                <v-flex xs12 sm8 offset-sm2 v-if="form.imageUrl">
                                    <img :src="form.imageUrl"/>
                                </v-flex>
                                <v-flex xs12>
                                    <v-textarea
                                    v-model="form.description"
                                    color="indigo"
                                    :rules="rules.desp"
                                    :counter="500"
                                    >
                                    <div slot="label">
                                        Description
                                    </div>
                                    </v-textarea>
                                </v-flex> 
                                <v-flex xs12>
                                    <div slot="label" class="subheading">
                                        Choose a Meetup Date:
                                    </div>               
                                </v-flex> 
                                    
                                <v-flex>
                                    <v-dialog
                                        ref="dialogDate"
                                        v-model="modalDatePicker"
                                        :return-value.sync="form.date"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"                        
                                    >
                                        <v-text-field
                                            slot="activator"
                                            v-model="form.date"
                                            label="Choose Meetup Date"
                                            prepend-icon="today"
                                            readonly
                                            color="indigo"
                                        ></v-text-field>
                                        <v-date-picker
                                            v-if="modalDatePicker"
                                            v-model="form.date"
                                            color="accent"
                                        >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="accent darken-3" @click="modalDatePicker = false">Cancel</v-btn>
                                        <v-btn flat color="accent darken-3" @click="$refs.dialogDate.save(form.date)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-flex>

                                <v-flex>
                                    <v-dialog
                                        ref="dialog"
                                        v-model="modalTimePicker"
                                        :return-value.sync="form.time"
                                        persistent
                                        lazy
                                        full-width
                                        width="290px"
                                    >
                                        <v-text-field
                                            slot="activator"
                                            v-model="form.time"
                                            label="Choose Meetup Time"
                                            prepend-icon="access_time"
                                            readonly
                                            color="indigo"
                                        ></v-text-field>
                                        <v-time-picker
                                            v-if="modalTimePicker"
                                            v-model="form.time"
                                            color="accent"
                                        >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="accent darken-3" @click="modalTimePicker = false">Cancel</v-btn>
                                        <v-btn flat color="accent darken-3" @click="$refs.dialog.save(form.time)">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                </v-flex>
                                
                                <v-flex xs12>
                                    <v-card-actions>
                                        <v-btn flat @click="resetForm">Cancel</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                        :disabled="!formIsValid"          
                                        color="accent darken-3"
                                        type="submit"
                                        >Create</v-btn>
                                    </v-card-actions>
                                </v-flex> 
                            </v-layout>
                        </v-container>       
                    </v-form>    
                </v-card> 
            </v-flex>
        </v-layout>   
    </v-container>
</template>

<script>
  export default {
    data () {
      const defaultForm = Object.freeze({
        title: '',
        location: '',
        description: '',
        imageUrl: '',
        date: '2018-11-04',
        time: '16:00',
        imageFile: null    
      })

      return {
        form: Object.assign({}, defaultForm),
        rules: {
            name: [
                val => (val || '').length > 0 || 'This field is required',
                val => (val && val.length <= 100) || 'This field must be less than 100 characters'            
            ],
            image: [ val => (val || '').length > 0 || 'This field is required' ],
            desp: [
                val => (val || '').length > 0 || 'This field is required',
                val => (val && val.length <= 500) || 'This field must be less than 500 characters'            
            ]          
        },
        snackbar: false,        
        defaultForm,
        modalTimePicker: false,
        modalDatePicker: false,
        imageType: 'url'
      }
    },

    computed: {
        formIsValid () {
            return (
            this.form.title &&
            this.form.location &&
            this.form.description && 
            (this.form.imageUrl || this.form.imageFile) &&
            this.form.date && 
            this.form.time
            )
        },
        submittableDateTime () {  
            return this.form.date + ' ' + this.form.time;
        }
    },

    methods: {
        resetForm () {
            this.form = Object.assign({}, this.defaultForm)
            this.$refs.form.reset()
        },
        onCreateMeetup () {
            // console.log('this.submittableDateTime)', this.submittableDateTime)
            if (!this.formIsValid) {
                return
            }
            if (this.imageType === 'file') {
                if (!this.form.imageFile) {
                    return
                }
                const meetupData = {
                    title: this.form.title,            
                    location: this.form.location,
                    imageUrl: '',
                    description: this.form.description,
                    date: this.submittableDateTime,
                    imageFile: this.form.imageFile
                }
                this.$store.dispatch('createMeetupF', meetupData)

            } else if (this.imageType === 'url'){
                const meetupData = {
                    title: this.form.title,            
                    location: this.form.location,
                    imageUrl: this.form.imageUrl,
                    description: this.form.description,
                    date: this.submittableDateTime,
                    imageFile: null
                }
                this.$store.dispatch('createMeetup', meetupData)
            }          
            this.snackbar = true
            this.resetForm()
            // this.$router.push('/meetups')
        },
        onPickFile () {
            this.$refs.fileInput.click()
        },
        onFilePicked (event) {
            const files = event.target.files           
            let filename = files[0].name
            if (filename.lastIndexOf('.') <= 0) {
                return alert ('Invalid file!')
            }
            const fileReader = new FileReader()
            fileReader.addEventListener('load', ()=>{
                this.form.imageUrl = fileReader.result               
            })
            fileReader.readAsDataURL(files[0])
            this.form.imageFile = files[0]            
        },
        onChangeImageType () {
            
            if (this.imageType === 'url' && this.form.imageFile) {
                this.form.imageFile = null
                this.form.imageUrl = ''
            }
            else if (this.imageType === 'file' && this.form.imageUrl) {
                this.form.imageUrl = ''
            }
            console.log('onChangeImageType', this.imageType, this.form.imageUrl, this.form.imageFile)
        }
    }
  }
</script>

<style scoped>
img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
}
</style>