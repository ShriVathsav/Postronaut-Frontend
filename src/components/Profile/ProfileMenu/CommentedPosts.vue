<template>
    <div>
        <div v-if="loading">
            <Loader size="big" height="160" />
        </div>
        <div v-if="commentedPostsList.length === 0 && !loading">
            <div style="display: flex; align-items: center; flex-direction: column; margin: 14px 0px;">
                <SuiImage :src="commentIcon" size="small"/>
                <SuiHeader style="margin-top: 16px; color: gray; text-align: center;">
                    It seems {{identity() === 1 ? "you have" : profile.userName + " has"}} not commented on any posts!
                </SuiHeader>
            </div>
        </div>
        <div v-if="commentedPostsList.length !== 0 && !loading" >
            <SuiHeader dividing style="font-size: 16px; margin-bottom: 30px;">
                {{totalResults}} Posts Commented by {{identity() === 1 ? "you" : profile.userName}}
            </SuiHeader>
            <SuiGrid>     
                <SuiGridColumn :mobile="16" :tablet="16" :computer="8" v-for="comment in commentedPostsList" :key="comment.id">
                    <div>   
                        <BlogCard :blog="comment.blog"/>
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

import commentIcon from "../../../static/Icons/ProfileIcons/comments.svg"

export default {
    name: "CommentedPosts",
    components: {BlogCard, Loader},
    props: ["profile"],
    data(){
        return {
            commentedPostsList: [],
            loading: false,
            commentIcon,
            pageNumber: 0,
            totalResults: 0
        }
    },
    methods: {
        identity(){
            return this.$store.state.auth.user.id == this.$route.params.id ? 1 : 2
        },
        loadMore($state){
            axios.get(`/comment/byprofile/${this.$route.params.id}?page=${this.pageNumber}&size=3`).then(res => {
                console.log(res)
                if(res.data.content.length !== 0){
                    this.commentedPostsList.push(...res.data.content)
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
    created(){
        this.loading = true
        this.loadMore()
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