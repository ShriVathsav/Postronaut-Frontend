<template>
    <div style="margin-top: 60px;">
        <SuiGrid>
            <SuiGridColumn :mobile="16" :tablet="7" :computer="7" stretched >
                <div style="display: flex; align-items: center; justify-content: center; 
                        flex-direction: column; background-color: #f8f8f9; padding: 14px;">
                    <SuiImage :src="registerIcon" size="tiny" />
                    <SuiHeader style="font-size: 22px;">Create Account</SuiHeader>
                </div>
            </SuiGridColumn>
            <SuiGridColumn :mobile="16" :tablet="9" :computer="9">
                <SuiSegment>
                    <div style="margin-bottom: 14px; display: flex; justify-content: center;">
                        <SuiImage :src="mainIcon" size="mini" />
                    </div>
                    <SuiForm>
                        <SuiFormField required>
                            <label>Username</label>
                            <input fluid placeholder="Username" :value="username" ref="username"
                                @input="usernameChange($event)" />
                            <SuiLabel v-if="username === ''" basic color="red" pointing>{{requiredField}}</SuiLabel>
                        </SuiFormField>
                        <SuiFormField required>
                            <label>Email</label>
                            <input fluid placeholder="Email" :value="email" ref="email"
                                @input="emailChange($event)" />
                            <SuiLabel v-if="!emailValid()" basic color="red" pointing>{{emailError}}</SuiLabel>
                        </SuiFormField>
                        <SuiFormField required>
                            <label>Password</label>
                            <input fluid placeholder="Password" :value="password" ref="password" type="password"
                                @input="passwordChange($event)" />
                            <SuiLabel v-if="password === ''" basic color="red" pointing>{{requiredField}}</SuiLabel>
                        </SuiFormField>
                        <SuiFormField required>
                            <label>Confirm Password</label>
                            <input fluid placeholder="Confirm Password" :value="confirmPassword" ref="confirmPassword" type="password"
                                @input="confirmPasswordChange($event)" />
                            <SuiLabel v-if="confirmPassword === '' || password !== confirmPassword" basic color="red" pointing>
                                {{confirmPassword === "" ? requiredField : "Passwords do not match"}}
                            </SuiLabel>
                        </SuiFormField>
                    </SuiForm>
                    <div class="info-message error" v-if="registerError">
                        {{errorMessage}}
                    </div>
                    <SuiButton fluid color="violet" size="big" style="margin: 14px 0px;" id="register-button"
                            :loading="loading" @click="registerHandler" :disabled="!registerValid()" >
                        <SuiImage id="register-button-icon" :src="registerIcon" /><span>CREATE ACCOUNT</span>
                    </SuiButton>
                    <div style="color: gray; text-align: center;">
                        Already have an account? 
                        <router-link to="/signin">
                            <span>Login here</span>
                        </router-link>
                    </div>
                </SuiSegment>
            </SuiGridColumn>
        </SuiGrid>
    </div>
</template>

<script>
import axios from "axios"
import {validateEmail, removeSpacesFromTextInput, removeSpacesFromPasswordInput} from "../Utility/ValidateInputs"
import User from "../../models/User"

import registerIcon from "../../static/Icons/AuthIcons/registerIcon.svg"
import mainIcon from "../../static/Icons/mainIcon.svg"

//const API_URL = 'http://localhost:5000/api/auth/'
const REQUIRED_FIELD = "This field is mandatory"

export default {
    name: "Register",
    data(){
        return {
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            registerIcon,
            mainIcon,
            loading: false,
            registerError: false,
            errorMessage: "",

            emailError: REQUIRED_FIELD,
            requiredField: REQUIRED_FIELD
        }
    },
    methods: {
        registerHandler2() {
            this.loading = true
            return axios.post('/auth/signup', {
                username: this.username,
                email: this.email,
                password: this.password,
                createdAt: new Date(),
                updatedAt: new Date()
            }).then(response => {
                console.log(response, "SUCCESSFUL REGISTRATION")
                this.loading = false
                this.$store.dispatch("auth/register", response.data, 0)
                this.$router.push("/signin")
            }).catch(err => {
                this.loading = false
                this.$store.dispatch("auth/registerFailure")
                console.log(err, err.response, "FAILED REGISTRATION")                
            })
        },
        registerHandler(){
            this.loading = true
            this.registerError = false
            const user = new User(this.email, this.password, this.username)
            this.$store.dispatch('auth/register', user).then(
                data => {
                    console.log(data, "SUCCESSFUL REGISTRATION")
                    //this.errorMessage = data.message;                   
                    this.loading = false
                    this.$router.push("/signin")
                },
                error => {
                    this.registerError = true
                    console.log(error.response, "FAILED REGISTRATION")                    
                    if(error.response && error.response.data) {
                        this.errorMessage = error.response.data.message
                    } else {
                        this.errorMessage = "An error has occured. Please try again later."
                    }                   
                    this.loading = false
                }
            )
        },
        registerValid(){
            return validateEmail(this.email) && this.password.trim() !== "" 
                && this.username.trim() !== "" && this.password === this.confirmPassword
        },
        emailChange(e){
            const val = e.target.value
            this.email = removeSpacesFromPasswordInput(val)
            this.$refs.email.value = this.email
        },
        passwordChange(e){
            const val = e.target.value
            this.password = removeSpacesFromPasswordInput(val)
            this.$refs.password.value = this.password
        },
        confirmPasswordChange(e){
            const val = e.target.value
            this.confirmPassword = removeSpacesFromPasswordInput(val)
            this.$refs.confirmPassword.value = this.confirmPassword
        },
        usernameChange(e){
            const val = e.target.value
            this.username = removeSpacesFromTextInput(val)
            this.$refs.username.value = this.username
        },
        emailValid(){
            if(this.email === ""){
                this.emailError = REQUIRED_FIELD
            } else if(!validateEmail(this.email)){
                this.emailError = "Not a Valid Email"
            }
            return validateEmail(this.email)
        }
    },
    computed: {

    }
}
</script>

<style scoped>
#register-button{
    display: flex;
    justify-content: center;
    align-items: center;
}

#register-button-icon{
    width: 25px;
    height: 25px;
    margin-right: 10px;;
}

.info-message{
    padding: 14px;
    margin-top: 10px;
    border-radius: .28571429rem;
    /*background-color: #21ba45;*/
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
}

.error{
    border: 1px solid #9f3a38;
    background-color: #ffdec3;
    color: #9f3a38;
}

/*ABOVE 990 PX*/
@media only screen and (min-width: 990px){

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