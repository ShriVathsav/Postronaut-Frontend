<template>
    <div>
        <div v-if="loading">
            <Loader size="big" height="160" />
        </div>
        <div v-if="followingList.length === 0 && !loading">
            <div style="display: flex; align-items: center; flex-direction: column; margin: 14px 0px;">
                <SuiImage :src="followingIcon" size="small"/>
                <SuiHeader style="margin-top: 16px; color: gray; text-align: center;">
                    It seems {{identity() === 1 ? "you are" : profile.userName + " is"}} not following anyone!
                </SuiHeader>
            </div>
        </div>
        <div v-if="followingList.length !== 0 && !loading" >
            <SuiHeader dividing style="font-size: 16px; margin-bottom: 30px;">{{totalResults}} people followed by {{identity() === 1 ? "you" : profile.userName}}</SuiHeader>
            <div v-for="item in followingList" :key="item.id" class="follower-profile">
                <FollowProfile :item="item"/>
            </div>
            <infinite-loading @infinite="loadMore" spinner="bubbles">
                <div slot="no-more" class="no-more-results">No More Results</div>
                <div slot="no-results" class="no-more-results">No More Results</div>
            </infinite-loading>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import FollowProfile from "./FollowProfile"
import Loader from "../../UI/Loader"

import followingIcon from "../../../static/Icons/ProfileIcons/followingIcon.svg"
import avatarIcon from "../../../static/Icons/ProfileIcons/unknownUser3.svg"

export default {
    name: "Following",
    components: {FollowProfile, Loader},
    props: ["profile"],
    data(){
        return {
            followingList: [],
            followingIcon,
            avatarIcon,
            loading: false,
            profileId: this.$store.state.auth.user.id,
            pageNumber: 0,
            totalResults: 0
        }
    },
    methods: {
        identity(){
            return this.$store.state.auth.user.id == this.$route.params.id ? 1 : 2
        },
        loadMore($state){
            axios.get(`/follow/following/${this.$route.params.id}?page=${this.pageNumber}&size=3`).then(res => {
                console.log(res, "FOLLOWING LIST")
                if(res.data.content.length !== 0){
                    this.followingList.push(...res.data.content)
                    $state ? $state.loaded() : null
                    this.pageNumber = this.pageNumber + 1
                    this.totalResults = res.data.totalElements
                }
                else{
                    $state ? $state.complete() : null
                }
                this.loading = false
            }).catch(err => {                
                this.loading = false
                console.log(err, err.response)
            })
        }
    },
    mounted(){
        console.log("FOLLOWING MOUNTED")
    },
    created(){
        this.loading = true
        this.loadMore()
    }
}
</script>

<style scoped>
.follower-profile{
    /*border-bottom: 1px solid rgba(34,36,38,.15);*/
    padding: 14px;
}

.no-more-results{
    font-size: 16px;
    font-weight: 700;
    margin-top: 5px;
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
    .follower-profile{
        padding: 14px 0px;
    }
}
</style>