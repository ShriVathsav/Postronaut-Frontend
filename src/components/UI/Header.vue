<template>
    <div>
        <SuiSegment id="header" inverted >
            <SuiContainer>
                <div id="menu">
                    <div id="first-item">
                        <div id="draw-sui-button" style="margin-right: 24px;" >
                            <SuiButton color="violet" id="hamburger-button" @click="toggleSideDraw()">
                                <SuiImage :src="hamburgerMenu" style="width: 16px;"/>
                            </SuiButton>                    
                        </div>
                        <router-link to="/">
                            <div style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
                                <SuiImage :src="mainIcon2" size="mini" style="margin-right: 16px;"/>
                                <div style="display: flex; flex-direction: column; color: white;">
                                    <span style="font-size: 28px; font-weight: 700;">Postronaut</span>
                                    <span style="font-size: 12px;">Launch your posts!</span>                                   
                                </div>
                            </div>
                        </router-link>
                    </div>
                    <div id="second-item">
                        <div v-if="!$store.getters['auth/isAuthenticated']">
                            <SuiButton @click.native="linkToRoute('/signin')" style="margin: 0px 10px;"
                                    color="violet" class="header-button" >
                                <SuiImage :src="loginIcon" style="display: inline; margin-right: 7px; width: 27px;"
                                    size="mini" />SIGN IN
                            </SuiButton>
                            <SuiButton @click.native="linkToRoute('/signup')" style="margin: 0px 10px;"
                                    color="violet" class="header-button" >
                                <SuiImage :src="registerIcon" style="display: inline; margin-right: 7px; width: 27px;" 
                                    size="mini" />CREATE ACCOUNT
                            </SuiButton>
                        </div>
                        <div style="display: flex;" v-else>
                            <SuiButton @click.native="linkToRoute('/new')" style="margin: 0px 10px;"
                                    color="violet" class="header-button" >
                                <SuiImage :src="noBlogsIcon" style="display: inline; margin-right: 7px; width: 27px;" 
                                    size="mini" />CREATE A POST
                            </SuiButton>
                            <SuiButton @click.native="signOut()" style="margin: 0px 10px;"
                                    color="violet" class="header-button" >
                                <SuiImage :src="signOutIcon" style="display: inline; margin-right: 7px; width: 27px;" 
                                    size="mini" />SIGN OUT
                            </SuiButton>
                            <SuiImage :src="$store.state.auth.user.profilePicUrl || avatarIcon" circular size="mini" id="profile-image"
                                @click.native="$router.push(`/profile/${$store.state.auth.user.id}`)" />
                        </div>
                    </div>
                </div>
            </SuiContainer>
        </SuiSegment>

        <div v-if="sideDrawOpen" >
            <SideDrawer :toggleSideDraw="toggleSideDraw" />
        </div>
    </div>
</template>

<script>
import hamburgerMenu from "../../static/Icons/list2.svg"
import mainIcon from "../../static/Icons/mainIcon.svg"
import loginIcon from "../../static/Icons/AuthIcons/loginIconAlt.svg"
import registerIcon from "../../static/Icons/AuthIcons/registerIcon.svg"
import avatarIcon from "../../static/Icons/ProfileIcons/unknownUser3.svg"
import noBlogsIcon from "../../static/Icons/AuthIcons/createPostIcon.svg"
import signOutIcon from "../../static/Icons/AuthIcons/signOutIcon.svg"
import mainIcon2 from "../../static/Icons/mainIcon.svg"

import SideDrawer from "./SideDrawer.vue"

export default {
    name: "Header",
    components: {SideDrawer},
    data(){
        return {
            mainIcon2,
            hamburgerMenu,
            mainIcon,
            loginIcon,
            registerIcon,
            avatarIcon,
            noBlogsIcon,
            signOutIcon,

            sideDrawOpen: false
        }
    },
    methods: {
        handleItemClick(name){
            this.activeItem = name
        },
        toggleSideDraw(){
            this.sideDrawOpen = !this.sideDrawOpen
        },
        signOut(){
            this.$store.dispatch('auth/logout')
            this.$router.push('/signin')
        },
        linkToRoute(route){
            this.$router.push(route).catch(err => {
                console.log(err)
            })
        }
    },
}
</script>

<style scoped>
#header{
    background-color: #54c8ff;
    border-radius: 0px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;    
}

#menu {
    background-color: #54c8ff;
    display: flex;
    align-items: center;
    width: 100%;
}

#hamburger-button{
    /*background-color: #ff851b;*/
    padding: 10px 17px;
}

.header-button{    
    padding: 13px 15px;
}

#first-item{
    display: flex;
    align-items: center;
}

#second-item{
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
}

#profile-image{
    width: 50px;
    height: 50px;
    margin-left: 10px;
    cursor: pointer;
    border: 1px solid rgba(34,36,38,.15);
}

/*ABOVE 990 PX*/
@media only screen and (min-width: 990px){

}

/*BELOW 990 PX*/
@media only screen and (max-width: 990px){

}

/*ABOVE 767 PX*/
@media only screen and (min-width: 767px){
    #first-item{
        width: 40%;
    }
    #second-item{
        width: 60%;
    }   
}

/*BELOW 767 PX*/
@media only screen and (max-width: 767px){
    #first-item{
        width: 100%;
    }
    #second-item{
        display: none;
    }
}

/*ABOVE 510 PX*/
@media only screen and (min-width: 510px){
    
}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){
    
}
</style>