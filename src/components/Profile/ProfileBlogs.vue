<template>
    <div>
        <div v-if="loading">
            <FullPageLoader />
        </div>
        <div v-else>
            <div v-if="profileNotFound">
                <PageNotFound />
            </div>
            <div v-else>
                <SuiHeader style="margin: 30px 0px; font-size: 23px; text-align: center;">
                    Blogs Posted By {{identity() === 1 ? "you" : this.profile.userName}}
                </SuiHeader>
                <div style="margin: 14px 0px;">
                    <SuiMenu tabular>
                        <SuiMenuItem :active="selectedTab === 1" @click.native="selectedTab = 1" class="menu-tab" >
                            <div>BLOGS PUBLISHED</div>
                            <SuiLabel color="blue">{{publishedBlogTotal}}</SuiLabel>
                        </SuiMenuItem>
                        <SuiMenuItem :active="selectedTab === 2" v-if="identity() === 1"
                                @click.native="selectedTab = 2" class="menu-tab">
                            <div>BLOGS SAVED</div>
                            <SuiLabel color="red">{{savedBlogTotal}}</SuiLabel>
                        </SuiMenuItem>
                    </SuiMenu>
                </div>
                <div style="margin: 50px 0px;" v-if="selectedTab === 1">
                    <div v-if="publishedBlogLoading">
                        <Loader size="big" height="160" />
                    </div>
                    <div v-else>
                        <div v-if="publishedBlogList.length !== 0" >
                            <BlogList :blogList="publishedBlogList" :loadMore="getPublishedBlogs" />
                        </div>
                        <div v-else>
                            <SuiMessage style="padding: 22px 14px; display: flex; flex-direction: column; align-items: center; justify-content: center;" >
                                <SuiImage style="margin-bottom: 25px;" :src="noBlogsIcon" size="tiny" />
                                <SuiHeader>
                                    It seems {{identity() === 1 ? "you haven`t" : profile.userName + " hasn`t"}} published any blogs yet             
                                </SuiHeader>
                                <div style="margin-top: 14px; font-size: 15px;" v-if="identity() === 1">
                                    <router-link to="/new">Click here</router-link> to create a post.
                                </div>
                            </SuiMessage>
                        </div>
                    </div>
                </div>
                <div style="margin: 50px 0px;" v-if="selectedTab === 2">
                    <div v-if="savedBlogLoading">
                        <Loader size="big" height="160" />
                    </div>
                    <div v-else>
                        <div v-if="savedBlogList.length !== 0" >
                            <BlogList :blogList="savedBlogList" :loadMore="getSavedBlogs" />
                        </div>
                        <div v-else>
                            <SuiMessage style="padding: 22px 14px; display: flex; flex-direction: column; align-items: center; justify-content: center;" >
                                <SuiImage style="margin-bottom: 25px;" :src="noBlogsIcon" size="tiny" />
                                <SuiHeader>
                                    It seems you haven`t saved any blogs yet             
                                </SuiHeader>
                                <div style="margin-top: 14px; font-size: 15px;">
                                    <router-link to="/new">Click here</router-link> to create a post.
                                </div>
                            </SuiMessage>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import BlogList from "../Blog/BlogList"
import Loader from "../UI/Loader"
import FullPageLoader from "../UI/FullPageLoader"
import PageNotFound from "../InfoPages/PageNotFound"

import noBlogsIcon from "../../static/Icons/DisplayBlogIcons/noBlogs.svg"
import loadingImage from "../../static/Images/LoadingImage.png"

export default {
    name: "ProfileBlogs",
    components: {BlogList, Loader, FullPageLoader, PageNotFound},
    props: [],
    data(){
        return {
            selectedTab: 1,
            publishedBlogList: [],
            savedBlogList: [],
            profileId: this.$route.params.id,
            profile: null,
            publishedBlogLoading: false,
            publishedBlogTotal: 0,
            savedBlogTotal: 0,
            savedBlogLoading: false,
            profileNotFound: false,
            loading: true,
            savedBlogsPageNumber: 0,
            publishedBlogsPageNumber: 0,

            noBlogsIcon,
            loadingImage
        }
    },
    methods: {
        onTabChange(tab){
            this.selectedTab = tab
            if(tab === 1){
                this.publishedBlogLoading = true
                this.getPublishedBlogs()
            } else if (tab === 2){
                this.savedBlogLoading = true
                this.getSavedBlogs()
            }
        },
        getPublishedBlogs(infiniteLoadingState){
            axios.get(`/blog/byprofile/${this.$route.params.id}/published?page=${this.publishedBlogsPageNumber}&size=3`).then(res => {
                console.log(res, infiniteLoadingState)
                this.publishedBlogLoading = false
                if(res.data.content.length !== 0){
                    console.log(res.data.content.length)
                    this.publishedBlogList.push(...res.data.content)
                    infiniteLoadingState ? infiniteLoadingState.loaded() : null
                    this.publishedBlogsPageNumber = this.publishedBlogsPageNumber + 1
                    this.publishedBlogTotal = res.data.totalElements
                }
                else{
                    console.log(infiniteLoadingState)
                    infiniteLoadingState ? infiniteLoadingState.complete() : null
                }
                
            }).catch(err => {
                console.log(err, err.response)
                this.publishedBlogLoading = false
            })
        },
        getPublishedBlogs2(){
            this.publishedBlogLoading = true
            axios.get(`/blog/byprofile/${this.$route.params.id}/published`).then(res => {
                console.log(res)
                this.publishedBlogList = res.data.content
                this.publishedBlogLoading = false                
            }).catch(err => {
                console.log(err)
                this.publishedBlogLoading = false
            })
        },
        getSavedBlogs(infiniteLoadingState){
            axios.get(`/blog/byprofile/${this.$route.params.id}/saved?page=${this.savedBlogsPageNumber}&size=3`).then(res => {
                console.log(res, infiniteLoadingState)
                this.savedBlogLoading = false
                if(res.data.content.length !== 0){
                    console.log(res.data.content.length)
                    this.savedBlogList.push(...res.data.content)
                    infiniteLoadingState ? infiniteLoadingState.loaded() : null
                    this.savedBlogsPageNumber = this.savedBlogsPageNumber + 1
                    this.savedBlogTotal = res.data.totalElements
                }
                else{
                    console.log(infiniteLoadingState)
                    infiniteLoadingState ? infiniteLoadingState.complete() : null
                }
                
            }).catch(err => {
                console.log(err, err.response)
                this.savedBlogLoading = false
            })
        },
        identity(){
            return this.$store.state.auth.user.id == this.$route.params.id ? 1 : 2
        }
    },
    watch: {
        selectedTab: function() {
            console.log("SELECTED TAB CHANMHEE")
            if(this.selectedTab === 1){
                this.publishedBlogLoading = true
                this.getPublishedBlogs()
            } else if(this.selectedTab === 2){
                this.savedBlogLoading = true
                this.getSavedBlogs()
            }
        }
    },
    created(){
        axios.get(`/profile/${this.$route.params.id}`).then(res => {
            this.profile = res.data
            this.loading = false
        }).catch(err => {
            console.log(err)
            this.loading = false
            if(err.response.status === 404){
                this.profileNotFound = true
            }
        })

        if(this.selectedTab === 1){
            this.getPublishedBlogs()
        } else if(this.selectedTab === 2){
            this.getSavedBlogs()
        }
    },
    updated(){
        console.log(this.savedBlogList, this.publishedBlogList, "PROFILE BLOGS UPDATED")
    }
}
</script>

<style scoped>
.menu-tab{
    cursor: pointer;
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