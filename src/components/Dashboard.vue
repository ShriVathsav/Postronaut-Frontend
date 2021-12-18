<template>
    <div style="margin-top: 40px;">
        <SearchBlog :searchLoading="searchLoading" :searchByTopic="searchByTopic" 
            :searchByContent="searchByContent" :alterState="alterState"  />
        <SuiHeader dividing style="margin: 30px 0px; font-size: 23px;">{{topicMessage}} ({{totalResults}})</SuiHeader>
        <div v-if="loading">
            <Loader size="big" height="160" />
        </div>
        <div v-else>
            <div v-if="blogList.length !== 0" >
                <BlogList :blogList="blogList" :loadMore="loadMore"/>
            </div>
            <div v-else >
                <SuiMessage style="display: flex; flex-direction: column; align-items: center; padding: 22px 14px;" >
                    <SuiImage :src="noBlogsIcon" size="tiny" style="margin-bottom: 14px;" />
                    <SuiHeader>
                        {{noResultsMessage}}            
                    </SuiHeader>
                    <div style="margin-top: 14px; font-size: 15px;">
                        <div v-if="blogSearchCriteria === 1">
                            <router-link :to="'/profile/' + profileId">Click here</router-link> to add more topics in your profile section to show posts based on your interests.
                        </div>
                        <div v-else>
                            Please refine your search.
                        </div>
                    </div>
                </SuiMessage>
            </div>
        </div>
  </div>
</template>

<script>
import BlogList from "./Blog/BlogList.vue"
import SearchBlog from "./SearchBlog.vue"
import axios from "axios"
import Loader from "./UI/Loader"

import noBlogsIcon from "../static/Icons/DisplayBlogIcons/noBlogs.svg"

export default {
    name: "Dashboard",
    components: {BlogList, SearchBlog, Loader},
    data(){
        return {
            blogList: [],
            profileId: this.$store.state.auth.user.id,
            loading: false,
            pageNumber: 0,
            totalResults: 0,
            blogSearchCriteria: 1,
            searchLoading: false,
            searchTopic: [],
            searchContent: "",

            noBlogsIcon
        }
    },
    computed: {
        noResultsMessage(){
            if(this.blogSearchCriteria === 2){
                return "No Posts to show based on the topics selected."
            } else if(this.blogSearchCriteria === 3){
                return "No Posts to show based on the search term."
            } else{
                return "No Posts to show based on your interests."
            }
        },
        topicMessage(){
            if(this.blogSearchCriteria === 2){
                return "Based on the topics selected"
            } else if(this.blogSearchCriteria === 3){
                return "Based on search content"
            } else{
                return "Based on your interests"
            }
        }
    },
    methods: {
        alterState(state, val){
            this[state] = val
        },
        searchByInterests(infiniteLoadingState){
            axios.get(`/blog/byinterests/${this.profileId}?page=${this.pageNumber}&size=3`).then(res => {
                console.log(res)
                if(res.data.content.length !== 0){
                    this.blogList.push(...res.data.content)
                    infiniteLoadingState ? infiniteLoadingState.loaded() : null
                    this.pageNumber = this.pageNumber + 1
                    this.totalResults = res.data.totalElements
                }
                else{
                    infiniteLoadingState ? infiniteLoadingState.complete() : null
                }
                this.loading = false
            }).catch(err => {
                console.log(err)
                if(err.response && err.response.status === 401){
                    this.$store.dispatch('auth/logout')
                    this.$router.push('/signin')
                }
                this.loading = false
            })
        },
        searchByTopic(infiniteLoadingState, selectedTopicList){            
            let str = ""
            if(selectedTopicList !== null || selectedTopicList.length !== 0){
                for(const item of selectedTopicList){
                    str = str + item + ","
                }
                this.searchLoading = true
                axios.get(`/blog/bytopics?topicList=${str}&page=${this.pageNumber}&size=3`).then(res => {
                    console.log(res)
                    if(res.data.content.length !== 0){
                        this.blogList.push(...res.data.content)
                        infiniteLoadingState ? infiniteLoadingState.loaded() : null
                        this.pageNumber = this.pageNumber + 1                                                
                    }
                    else{
                        infiniteLoadingState ? infiniteLoadingState.complete() : null
                    }
                    this.totalResults = res.data.totalElements
                    this.searchLoading = false
                    this.loading = false
                }).catch(err => {
                    console.log(err.response)
                    this.searchLoading = false
                    this.loading = false
                })
            }
        },
        searchByContent(infiniteLoadingState, blogContentSearch){   
            this.searchLoading = true            
            axios.get(`/blog/bycontent?searchContent=${blogContentSearch}&page=${this.pageNumber}&size=3`).then(res => {
                console.log(res, "SEARCH CONTENT BLOGS")
                if(res.data.content.length !== 0){
                    this.blogList.push(...res.data.content)
                    infiniteLoadingState ? infiniteLoadingState.loaded() : null
                    this.pageNumber = this.pageNumber + 1                                     
                }
                else{
                    infiniteLoadingState ? infiniteLoadingState.complete() : null
                }
                this.totalResults = res.data.totalElements
                this.searchLoading = false
                this.loading = false
            }).catch(err => {
                console.log(err.response)
                this.searchLoading = false
                this.loading = false
            })
        },
        loadMore($state){
            if(this.blogSearchCriteria === 2){
                this.searchByTopic($state, this.searchTopic)
            } else if(this.blogSearchCriteria === 3){
                this.searchByContent($state, this.searchContent)
            } else{
                this.searchByInterests($state)
            }
        }
    },
    created(){
        this.loading = true
        this.loadMore()
    },
    mounted() {/*
        const listElm = document.querySelector('#infinite-list')
        listElm.addEventListener('scroll', e => {
            if(listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
                console.log("THRESHOLD POINT REACHED")
                //this.loadMore();
            }
        })
        // Initially load some items.
        //this.loadMore()*/
    }
}
</script>

<style scoped>

</style>