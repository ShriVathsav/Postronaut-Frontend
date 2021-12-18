<template>
    <div>
        <div v-if="loading">
            <Loader size="big" height="160" />
        </div>
        <div v-if="followersList.length === 0 && !loading">
            <div style="display: flex; align-items: center; flex-direction: column; margin: 14px 0px;">
                <SuiImage :src="followerIcon" size="small"/>
                <SuiHeader style="margin-top: 16px; color: gray;">
                    It seems {{identity() === 1 ? "you don`t" : profile.userName + " doesn`t"}} have any followers yet!
                </SuiHeader>
            </div>
        </div>
        <div v-if="followersList.length !== 0 && !loading">
            <SuiHeader dividing style="font-size: 16px; margin-bottom: 30px;">{{totalResults}} people following {{identity() === 1 ? "you" : profile.userName}}</SuiHeader>
            <div v-for="item in followersList" :key="item.id" class="follower-profile">
                <div style="display: flex; align-items: center;"  >
                    <div style="display: flex; align-items: center; width: 70%;">
                        <SuiImage :src="avatarIcon" circular bordered
                            style="width: 50px; margin-right: 14px;"/>
                        <div>
                            <div style="font-weight: 700; margin-bottom: 5px; cursor: pointer;" 
                                    @click="$router.push(`/profile/${item.from.id}`)">
                                {{item.from.userName}}</div>
                            <div>{{item.from.description}}</div>
                        </div>
                    </div>
                </div>
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
import Loader from "../../UI/Loader"

import followerIcon from "../../../static/Icons/ProfileIcons/followerIcon.svg"
import avatarIcon from "../../../static/Icons/ProfileIcons/unknownUser3.svg"

export default {
    name: "Followers",
    components: {Loader},
    props: ["profile"],
    data(){
        return {
            followersList: [],
            followerIcon,
            avatarIcon,
            loading: false,
            pageNumber: 0,
            totalResults: 0
        }
    },
    methods: {
        identity(){
            return this.$store.state.auth.user.id == this.$route.params.id ? 1 : 2
        },
        loadMore($state){
            axios.get(`/follow/followers/${this.$route.params.id}?page=${this.pageNumber}&size=3`).then(res => {
                console.log(res)
                if(res.data.content.length !== 0){
                    this.followersList.push(...res.data.content)
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
        console.log("FOLLOWERS MOUNTED")
    },
    created(){
        console.log("FOLLOWERS CREATED")
        this.loading = true
        this.loadMore()
    },
    updated(){
        
    }
}
</script>

<style scoped>
.follower-profile{
    /*border-bottom: 1px solid  rgba(34,36,38,.15);*/
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