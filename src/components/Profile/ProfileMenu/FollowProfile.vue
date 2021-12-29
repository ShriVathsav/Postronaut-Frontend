<template>
    <div style="display: flex; align-items: center;" >
        <div style="display: flex; align-items: center;" class="follow-image">
            <SuiImage :src="avatarIcon" circular bordered
                style="width: 50px; height: 50px; margin-right: 14px;"/>            
            <div>
                <div style="font-weight: 700; margin-bottom: 5px; cursor: pointer;"
                        @click="$router.push(`/profile/${item.to.id}`)">
                    {{item.to.userName}}</div>
                <div>{{item.to.description}}</div>
            </div>
        </div>
        <div class="follow-button">
            <SuiButton compact @click.native="followPerson" floated="right" :color="following ? 'red' : 'orange'" >
                {{ following ? 'Unfollow' : 'Follow' }}
            </SuiButton>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import avatarIcon from "../../../static/Icons/ProfileIcons/unknownUser3.svg"

export default {
    name: "FollowProfile",
    props: ["item"],
    data(){
        return {
            avatarIcon,
            following: true
        }
    },
    methods: {
        followPerson(){
            this.following = !this.following
            axios.delete(`/follow/unfollow/${this.item.from.id}/${this.item.to.id}`).then(res => {
                console.log(res, "UNFOLLOWED")
            })
        }
    },
}
</script>

<style scoped>
.follower-profile{
    border-bottom: 1px solid  rgba(34,36,38,.15);
    padding: 14px 0px;
}

.follower-profile:last-child{
    border-bottom: none;
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
    .follow-image{
        width: 80%;
    }
    .follow-button{
        width: 20%;
    }
}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){
    .follow-image{
        width: 67%;
    }
    .follow-button{
        width: 33%;
    }
}
</style>