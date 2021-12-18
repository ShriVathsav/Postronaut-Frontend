<template>
    <div style="margin-top: 30px;">
        <div v-if="updateSuccess">
            <InfoPage :icon="successIcon" message="Profile has been updated Successfully!" />
            <!--div style="display: flex; flex-direction: column; align-items: center;">
                <SuiImage :src="successIcon" size="small" />
                <SuiHeader style="margin: 30px 0px; font-size: 22px;">Profile has been updated Successfully!</SuiHeader>
                <SuiButton color="orange" size="large" inverted @click.native="$router.push(`/profile/${profileId}/`)" >
                    <SuiIcon name="eye" />VIEW PROFILE</SuiButton>
            </div-->
        </div>
        <div v-else>
            <div v-if="authorized">
                <EditProfile :alterUpdateSuccess="alterUpdateSuccess" />
            </div>
            <div v-else>
                <Unauthorized />
            </div>
        </div>
    </div>
</template>

<script>
//import axios from "axios"
import EditProfile from "./EditProfile"
import Unauthorized from "../../InfoPages/Unauthorized"
import InfoPage from "../../UI/InfoPage"

import successIcon from "../../../static/Icons/ProfileIcons/successIcon.svg"
import unauthorizedIcon from "../../../static/Icons/AuthIcons/unauthorizedIcon.svg"

export default {
    name: "CreateProfile",
    components: {EditProfile, Unauthorized, InfoPage},
    data() {
        return {
            authorized: false,
            profileId: this.$route.params.id,
            updateSuccess: false,

            successIcon,
            unauthorizedIcon
        }
    },
    methods: {
        alterUpdateSuccess(){
            this.updateSuccess = true
        }
    },
    created(){
        console.log(this.$route.params.id == this.$store.state.auth.user.id, this.$route.params.id, this.$store.state.auth.user.id)
        if(this.$route.params.id == this.$store.state.auth.user.id){
            this.authorized = true
        } else {
            this.authorized = false
        }
    }
}
</script>

<style scoped>

</style>