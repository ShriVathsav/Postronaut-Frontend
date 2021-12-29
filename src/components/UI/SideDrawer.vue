<template>
    <div>
        <Backdrop :toggleSideDraw="toggleSideDraw" />
        <div id="side-drawer" style="height: 100%; overflow: auto;" class="open" >
            <div style="border: none; border-radius: 0px;" >
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <SuiImage :src="mainIcon"
                            style="margin: 0px 0px 14px 0px; width: 60px;" />
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-size: 28px; font-weight: 700;">Postronaut</span>
                            <span style="font-size: 12px; text-align: center;">Launch your posts!</span>
                        </div>
                    </div>

                    <SuiDivider />

                    <div v-if="!isAuthenticated" style="text-align: center;" >
                        <div style="font-size: 20px; margin-bottom: 10px;" >
                            You are not Signed In.
                        </div>
                        <div>
                            Sign In / Sign Up to start creating Posts.
                        </div>
                    </div>

                    <div v-else style="width: 100%; display: flex; align-items: center; font-size: 15px; font-weight: 700;">
                        <div style="max-width: 32%;">
                            <SuiImage circular :src="this.$store.state.auth.user.profilePicUrl || avatarIcon" style="width: 45px; height: 45px; margin-right: 10px; border: 1px solid  rgba(34,36,38,.15);"/>
                        </div>
                        <SuiDropdown inline :text="this.$store.state.auth.user.username || 'Unknown User'" pointing="top left" >                                    
                            <SuiDropdownMenu style="margin-top: 8px;">                                            
                                <SuiDropdownItem text="View Profile" icon="user" style="padding: 40px;"
                                    @click.native="navigate(`/profile/${profileId}`)"  /> 
                                <SuiDropdownDivider style="margin: 0px 7px;" />
                                <SuiDropdownItem text="Edit Profile" icon="edit" style="padding: 40px;"
                                    @click.native="navigate(`/profile/${profileId}/edit`)"  /> 
                                <SuiDropdownDivider style="margin: 0px 7px;" />
                                <SuiDropdownItem text="Sign Out" icon="sign out" 
                                    @click.native="signOut()" />
                            </SuiDropdownMenu>
                        </SuiDropdown>
                    </div>

                    <SuiDivider style="margin-bottom: 0px;" />

                    <div>
                        <div v-if="!isAuthenticated">
                            <div class="drawer-items" @click="navigate('/signup')" >
                                <SuiIcon class="drawer-item-icon" name="user plus" />Create Account</div>
                            <div class="drawer-items" @click="navigate('/signin')" >
                                <SuiIcon class="drawer-item-icon" name="sign-in" />Sign In</div>
                        </div>
                        <div v-if="isAuthenticated">
                            <div class="drawer-items" @click="navigate('/')" >
                                <SuiIcon class="drawer-item-icon" name="home" />Dashboard</div>
                            <div class="drawer-items" @click="navigate('/new')" >
                                <SuiIcon class="drawer-item-icon" name="write" />Create a Post</div>
                            <div class="drawer-items" @click="navigate(`/profile/${profileId}/posts`)" >
                                <SuiIcon class="drawer-item-icon" name="paper plane" />Posts Created By You</div>
                            <div class="drawer-items" @click="navigate(`/profile/${profileId}`)" >
                                <SuiIcon class="drawer-item-icon" name="user" />View Profile</div>
                            <div class="drawer-items" @click="navigate(`/profile/${profileId}/edit`)" >
                                <SuiIcon class="drawer-item-icon" name="edit" />Edit Profile</div>
                            <div class="drawer-items" @click="signOut()" >
                                <SuiIcon class="drawer-item-icon" name="sign-out" />Sign Out</div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
import Backdrop from "./Backdrop.vue"

import mainIcon from "../../static/Icons/mainIcon.svg"
import loginIcon from "../../static/Icons/AuthIcons/loginIconAlt.svg"
import registerIcon from "../../static/Icons/AuthIcons/registerIcon.svg"
import avatarIcon from "../../static/Icons/ProfileIcons/unknownUser3.svg"

export default {
    name: "SideDrawer",
    props: ["toggleSideDraw"],
    components: {Backdrop},
    data(){
        return {
            profileId: this.$store.state.auth.status.loggedIn && this.$store.state.auth.user.id,
            mainIcon,
            loginIcon,
            registerIcon,
            avatarIcon,

            create: false,

            isAuthenticated: this.$store.getters["auth/isAuthenticated"]

        }
    },
    methods: {
        trigger(){
            return <div>Hhujefdvg</div>
        },
        navigate(url){
            this.$router.push(url).catch(err => {
                console.log(err)
            })
            this.toggleSideDraw()
        },
        signOut(){
            this.$store.dispatch('auth/logout');
            this.$router.push('/signin');
            this.toggleSideDraw()
        }
    },
    created(){
        this.create = !this.create
        console.log(this.isAuthenticated, "IS AUTHENTICATED")
    },
    updated(){
        console.log(this.isAuthenticated, "IS AUTHENTICATED")
    }
}
</script>

<style scoped>
#side-drawer{
    height: 100%;
    width: 280px;
    max-width: 80%;
    z-index: 200;
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
    transition: all 15s ease-out;
    box-sizing: border-box;
    padding: 14px;
}

.open{
    transform: translateX(0);
}

.close{
    transform: translateX(-100%);
}

.drawer-items{
    padding: 16px 14px;
    border-bottom: 1px solid rgba(34,36,38,.15);
    cursor: pointer;
    
    font-size: 16px;
}

.drawer-item-icon{
    margin-right: 10px;
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