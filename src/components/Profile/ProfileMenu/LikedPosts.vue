<template>
    <div>
        <div v-if="loading">
            <Loader size="big" height="160" />
        </div>
        <div v-if="likedPostsList.length === 0 && !loading">
            <div style="display: flex; align-items: center; flex-direction: column; margin: 14px 0px;">
                <SuiImage :src="likeIcon" size="small"/>
                <SuiHeader style="margin-top: 16px; color: gray; text-align: center;">
                    It seems {{identity() === 1 ? "you have" : profile.userName + " has"}} not liked any posts!
                </SuiHeader>
            </div>
        </div>
        <div v-if="likedPostsList.length !== 0 && !loading" >
            <SuiHeader dividing style="font-size: 16px; margin-bottom: 30px;">{{totalResults}} Posts Liked by {{identity() === 1 ? "you" : profile.userName}}</SuiHeader>
            <SuiGrid v-if="likedPostsList.length !== 0">     
                <SuiGridColumn :mobile="16" :tablet="16" :computer="8" v-for="like in likedPostsList" :key="like.id">
                    <div>   
                        <BlogCard :blog="like.blog" />
                    </div>
                </SuiGridColumn>
            </SuiGrid>
            <infinite-loading @infinite="loadMore" spinner="bubbles">
                <div slot="no-more" class="no-more-results">No More Results</div>
                <div slot="no-results" class="no-more-results">No More Results</div>
            </infinite-loading>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import BlogCard from "../../Blog/BlogCard"
import Loader from "../../UI/Loader"

import likeIcon from "../../../static/Icons/ProfileIcons/like.svg"

export default {
    name: "LikedPosts",
    components: {BlogCard, Loader},
    props: ["profile"],
    data(){
        return {
            likedPostsList: [],
            loading: false,
            likeIcon,
            pageNumber: 0,
            totalResults: 0
        }
    },
    methods: {
        identity(){
            return this.$store.state.auth.user.id == this.$route.params.id ? 1 : 2
        },
        loadMore($state){
            axios.get(`/like/byprofile/${this.$route.params.id}?page=${this.pageNumber}&size=3`).then(res => {
                console.log(res, "LIKE OUTPUT")
                this.loading = false
                if(res.data.content.length !== 0){
                    this.likedPostsList.push(...res.data.content)
                    $state ? $state.loaded() : null
                    this.pageNumber = this.pageNumber + 1
                    this.totalResults = res.data.totalElements
                }
                else{
                    $state ? $state.complete() : null
                }
            }).catch(err => {
                this.loading = false
                console.log(err, err.response)
            })
        }
    },
    created(){
        this.loading = true
        this.loadMore()
    },
    updated(){
        console.log(this.likedPostsList, "LIKED POSTS LIST")
    }
}
</script>

<style scoped>
.no-more-results{
    font-size: 16px;
    font-weight: 700;
    margin-top: 15px;
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