<template>
    <div style="margin-top: 60px;">
        <SuiGrid>
            <SuiGridColumn :mobile="16" :tablet="7" :computer="7" stretched >
                <div class="login-panel">
                    <SuiImage :src="loginIcon" size="tiny" />
                    <SuiHeader style="font-size: 22px;">Login to your account</SuiHeader>
                </div>
            </SuiGridColumn>
            <SuiGridColumn :mobile="16" :tablet="9" :computer="9">
                <SuiSegment>
                    <div style="margin-bottom: 14px; display: flex; justify-content: center;">
                        <SuiImage :src="mainIcon" size="mini" />
                    </div>
                    <SuiForm>
                        <SuiFormField required>
                            <label>Email</label>
                            <input fluid placeholder="Email" :value="username" ref="username"
                                @input="emailChange($event)" />
                            <SuiLabel v-if="!emailValid()" basic color="red" pointing>{{emailError}}</SuiLabel>
                        </SuiFormField>
                        <SuiFormField required>
                            <label>Password</label>
                            <input fluid placeholder="Password" :value="password" ref="password" type="password"
                                @input="passwordChange($event)" />
                            <SuiLabel v-if="password === ''" basic color="red" pointing>{{requiredField}}</SuiLabel>
                        </SuiFormField>
                    </SuiForm>
                    <div class="info-message error" v-if="loginError">
                        {{errorMessage}}
                    </div>
                    <SuiButton fluid color="violet" size="big" style="margin: 14px 0px;" id="login-button"
                            :loading="loading" @click="loginHandler" :disabled="!loginValid()">
                        <SuiImage id="login-button-icon" :src="loginIconAlt" /><span>SIGN IN</span>
                    </SuiButton>
                    <div style="color: gray; text-align: center;">
                        Don`t have an account? 
                        <router-link to="/signup">
                            <span>Register here</span>
                        </router-link>
                    </div>
                </SuiSegment>
            </SuiGridColumn>
        </SuiGrid>
    </div>
</template>

<script>
import axios from "axios"
import {validateEmail, removeSpacesFromPasswordInput} from "../Utility/ValidateInputs"

import loginIcon from "../../static/Icons/AuthIcons/loginIcon.svg"
import loginIconAlt from "../../static/Icons/AuthIcons/loginIconAlt.svg"
import mainIcon from "../../static/Icons/mainIcon.svg"
import User from "../../models/User"
import {setAxiosHeader} from "../Utility/Utility"

//const API_URL = 'http://localhost:5000/api/auth/'
const REQUIRED_FIELD = "This field is mandatory"

export default {
    name: "Login",
    data(){
        return {
            username: "",
            password: "",

            loginIcon,
            mainIcon,
            loginIconAlt,

            loginError: false,
            loading: false,
            errorMessage: "",

            emailError: REQUIRED_FIELD,
            requiredField: REQUIRED_FIELD
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        }
    },
    created() {
        if (this.loggedIn) {
            this.$router.push('/');
        }
    },
    methods: {
        loginHandler2() {
            this.loading = true
            axios.post('/auth/signin', {
                    email: this.username,
                    password: this.password
            }).then(response => {
                console.log(response, "SUCCESSFUL LOGIN")
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                this.loginError = false
                this.loading = false
                this.$store.dispatch("auth/login", response.data, 0)
                this.$router.replace("/")
            }).catch(err => {
                console.log(err, err.response, "FAILED LOGIN")
                this.loading = false
                if(err.response.status === 401){
                    this.loginError = true
                }
                this.$store.dispatch("auth/login", err, 1)
            })
        },
        loginHandler(){
            this.loading = true
            this.$store.dispatch('auth/login', new User(this.username, this.password)).then(
                () => {
                    this.loading = false;
                    setAxiosHeader()
                    this.$router.push('/');
                },
                error => {
                    this.loading = false
                    this.loginError = true
                    this.errorMessage = "An error has occured. Please try again later."
                    if(error.response && error.response.status === 401){                        
                        this.errorMessage = "Invalid Credentials"
                    }
                }
            );
        },
        loginValid(){
            return validateEmail(this.username) && this.password !== ""
        },
        emailChange(e){
            const val = e.target.value
            this.username = removeSpacesFromPasswordInput(val)
            this.$refs.username.value = this.username
        },
        passwordChange(e){
            const val = e.target.value
            this.password = removeSpacesFromPasswordInput(val)
            this.$refs.password.value = this.password
        },
        emailValid(){
            if(this.username === ""){
                this.emailError = REQUIRED_FIELD
            } else if(!validateEmail(this.username)){
                this.emailError = "Not a Valid Email"
            } else {
                this.emailError = ""
            }
            return validateEmail(this.username)
        }
    }
}
</script>

<style scoped>
.login-panel{
    display: flex;
    align-items: center;
    justify-content: center; 
    flex-direction: column;
    background-color: #f8f8f9;
    padding: 14px;
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

#login-button{
    display: flex;
    justify-content: center;
    align-items: center;
}

#login-button-icon{
    width: 25px;
    height: 25px;
    margin-right: 10px;;
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