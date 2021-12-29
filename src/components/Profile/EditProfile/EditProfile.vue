<template>
    <div style="margin-top: 30px;">
        <div v-if="initialLoading">
            <FullPageLoader />
        </div>
        <div v-else style=" display: flex; flex-direction: column; align-items: center;" >
            <div class="profile-header profile-segment">
                <SuiImage :src="createProfileIcon" size="small" style="width: 80px;" />
                <SuiHeader style="font-size: 26px; text-align: center;">Update your Profile</SuiHeader>
            </div>
            <SuiSegment style="margin-top: 20px;" class="profile-segment" >
                <div style="text-align: center;">
                    <div style="font-size: 21px; font-weight: 700; margin-bottom: 5px;">
                        {{username}}</div>
                    <div style="font-size: 11px; color: gray;">Last Updated On {{formatDate}}</div>
                </div>
                <SuiDivider style="margin: 7px 0px 50px 0px;" />
                <SuiForm>
                    <SuiGrid>
                        <SuiHeader dividing class="heading" style="font-size: 16px; margin-top: 15px;" >Basic Information</SuiHeader>
                        <SuiGridColumn :mobile="16" :tablet="8" :computer="8" >
                            <SuiFormField>
                                <label>Email</label>
                                <input fluid placeholder="Email" v-model="email" disabled />
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :mobile="16" :tablet="8" :computer="8" >
                            <SuiFormField required>
                                <label>Username</label>
                                <input fluid placeholder="Username" :value="username" ref="username"
                                    @input="textInputChange($event, 'username')" />
                                <SuiLabel v-if="username.trim() === ''" basic color="red" pointing>This field is mandatory</SuiLabel>
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :mobile="16" :tablet="16" :computer="16" >
                            <SuiFormField>
                                <label>Description</label>
                                <textarea placeholder="Write something about you" :value="description" 
                                    rows="5" style="min-height: 105px;" ref="description"
                                    @input="descriptionChange($event)" />
                            </SuiFormField>
                        </SuiGridColumn>

                        <SuiHeader dividing class="heading" style="font-size: 16px;" >Add Education</SuiHeader>
                        <SuiGridColumn :mobile="16" :tablet="9" :computer="9" >
                            <SuiFormField>
                                <label>Education</label>
                                <input fluid placeholder="College or School Name" :value="education" ref="education"
                                    @input="textInputChange($event, 'education')" />
                            </SuiFormField>
                        </SuiGridColumn>

                        <SuiHeader dividing class="heading" style="font-size: 16px;" >Add work</SuiHeader>
                        <SuiGridColumn :mobile="16" :tablet="9" :computer="9" >
                            <SuiFormField>
                                <label>Work</label>
                                <input fluid placeholder="Company Name / Business / Freelancer" :value="work" ref="work"
                                    @input="textInputChange($event, 'work')"/>
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiHeader dividing class="heading" style="font-size: 16px;" >Social Media Links</SuiHeader>
                        <SuiGridColumn :mobile="16" :tablet="8" :computer="8" v-for="item in socialMediaArray()" :key="item[1]" >                        
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <div style="width: 13%; margin-bottom: -16px; text-align: center; display: flex; justify-content: center;">
                                    <SuiImage :src="item[0]" style="width: 25px;" />
                                </div>
                                <div style="width: 87%;">
                                    <SuiFormField>
                                        <label>{{item[3]}}</label>
                                        <input style="display: block; width: 100%;" :ref="item[1]" :placeholder="item[2]" 
                                            :value="item[4]" @input="socialMediaChange($event, item[1])"/>
                                    </SuiFormField>
                                </div>
                            </div>
                        </SuiGridColumn>
                        <SuiGridColumn :width="16" id="button-column">
                            <SuiButton :loading="loading" size="big" id="update-profile-button"
                                :disabled="!username.trim()" @click.native="updateProfile($event)" color="violet" >
                                <SuiImage id="update-profile-button-icon" :src="createProfileIcon" /><span>UPDATE PROFILE</span>
                            </SuiButton>
                        </SuiGridColumn>
                    </SuiGrid>
                </SuiForm>
            </SuiSegment>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import moment from "moment"
import FullPageLoader from "../../UI/FullPageLoader"

import linkedinIcon from "../../../static/Icons/ProfileIcons/SocialMedia/linkedin.svg"
import githubIcon from "../../../static/Icons/ProfileIcons/SocialMedia/github.svg"
import facebookIcon from "../../../static/Icons/ProfileIcons/SocialMedia/facebook.svg"
import youtubeIcon from "../../../static/Icons/ProfileIcons/SocialMedia/youtube.svg"
import createProfileIcon from "../../../static/Icons/ProfileIcons/createProfile.svg"

import {removeSpacesFromTextInput} from "../../Utility/ValidateInputs"

export default {
    name: "EditProfile",
    components: {FullPageLoader},
    props: ["alterUpdateSuccess"],
    data() {
        return {
            //linkedinIcon, githubIcon, facebookIcon, youtubeIcon,
            profileId: this.$route.params.id,
            username: this.$store.state.auth.user.username,
            email: this.$store.state.auth.user.email,
            description: "",
            education: "",
            work: "",
            linkedinLink: "",
            githubLink: "",
            facebookLink: "",
            youtubeLink: "",      
            profile: null,
            loading: false,
            initialLoading: false,
            updatedAt: "",

            createProfileIcon,
        }
    },
    methods: {
        socialMediaArray(){
            return [
                [linkedinIcon, "linkedinLink", "LinkedIn", "LinkedIn", this.linkedinLink],
                [githubIcon, "githubLink", "Github", "Github", this.githubLink],
                [facebookIcon, "facebookLink", "Facebook", "Facebook", this.facebookLink],
                [youtubeIcon, "youtubeLink", "YouTube", "Youtube", this.youtubeLink],
            ]
        },
        socialMediaChange(e, field){
            this[field] = e.target.value
            this.$refs[field].value = this[field]
        },
        textInputChange(e, field){
            const val = e.target.value
            this[field] = removeSpacesFromTextInput(val)
            this.$refs[field].value = this[field]
        },
        descriptionChange(e){
            const val = removeSpacesFromTextInput(e.target.value)
            if(val.length < 500){
                this.description = val
            }
            this.$refs.description.value = this.description
        },
        setProfileState(data){
            this.description = data.description
            this.education = data.education
            this.work = data.work
            this.linkedinLink = data.linkedin
            this.githubLink = data.github
            this.youtubeLink = data.youtube
            this.facebookLink = data.facebook
            this.updatedAt = data.updatedAt
        },
        updateProfile(e){
            e.preventDefault()
            const profile = {
                description: this.description,
                userName: this.username,
                education: this.education,
                work: this.work,
                linkedin: this.linkedinLink,
                github: this.githubLink,
                youtube: this.youtubeLink,
                facebook: this.facebookLink,
                updatedAt: new Date()
            }
            console.log(profile, ":PROFILE INPUT")
            this.loading = true
            axios.put(`/profile/${this.profileId}`, profile).then(res => {
               console.log(res)
               this.loading = false
               this.alterUpdateSuccess()
            }).catch(err => {
                this.loading = false
                console.log(err, err.response.data)
            })
        }
    },
    computed: {
        formatDate(){            
            const date = moment(this.updatedAt).format("Do MMM YYYY")
            console.log(date, this.updatedAt, "DATE")
            return date === "Invalid date" ? "a year ago" : date
        }
    },
    created(){
        this.initialLoading = true
        axios.get(`/profile/${this.profileId}`).then(res => {
            console.log(res.data, "PROFILE")
            this.setProfileState(res.data)
            this.initialLoading = false
        }).catch(err => {
            console.log(err.response.data)
            this.initialLoading = false
            if(err.response.status === 401){
                this.$store.dispatch("auth/logout")
            }
        })
    },
    updated(){
        console.log(this.uploadError, "UPLOAD ERROR")
    }
}
</script>

<style scoped>
.heading{
    margin: 15px 14px;
    padding: 0px;
    width: 100%;
}
.profile-header{
    background-color: #f8f8f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 28px;
}

#update-profile-button{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 40px;
}

#update-profile-button-icon{
    margin-right: 10px;
    width: 25px;
    height: 25px;
}

#button-column{
    display: flex;
    justify-content: center;
    padding: 34px 14px;
}

/*ABOVE 990 PX*/
@media only screen and (min-width: 990px){
    .profile-segment{
        max-width: 800px;
    }
}

/*BELOW 990 PX*/
@media only screen and (max-width: 990px){

}

/*ABOVE 767 PX*/
@media only screen and (min-width: 767px){
    
}

/*BELOW 767 PX*/
@media only screen and (max-width: 767px){
    
}

/*ABOVE 510 PX*/
@media only screen and (min-width: 510px){

}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){

}
</style>