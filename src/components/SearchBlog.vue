<template>
    <div>
        <SuiMessage class="search-container" style="margin: 14px 0px;">
            <div style="margin-bottom: 20px; display: flex; align-items: center; justify-content: center;" >
                <div style="width: 50%; text-align: center;">
                    <div :class="searchBy === 1 && 'search-menu-active'" class="search-menu"
                        @click="searchBy = 1" >
                        Search By Topics</div>
                </div>
                <div style="width: 50%; text-align: center;">
                    <div :class="searchBy === 2 && 'search-menu-active'" class="search-menu" 
                        @click="searchBy = 2" >
                        Search By Content</div>
                </div>
            </div>
            <div v-if="searchBy === 1">
                <SuiForm>
                    <SuiFormField>
                        <label>See posts related to the topics selected below</label>
                        <div class="allFlex" >
                            <SuiDropdown class="search-input" :options="topicList" placeholder="Select Topics" search
                                multiple selection v-model="selectedTopicList" />
                            <SuiButton color="violet" class="search-button" @click.native="topicSearch($event)"
                                    :disabled="selectedTopicList === null || selectedTopicList.length === 0 || searchLoading"
                                    :loading="searchLoading" >
                                <SuiIcon name="search" />SEARCH
                            </SuiButton>
                        </div>
                        <div style="margin-top: 14px;">
                            <span style="margin-right: 10px;">
                                {{!!selectedTopicList ? selectedTopicList.length : "0"}} topics selected
                            </span>
                            <span id="clear-topics" @click="clearTopics()" >
                                <SuiIcon name="delete" />Clear entries
                            </span>
                        </div>
                    </SuiFormField>
                </SuiForm>
            </div>
            <div v-if="searchBy === 2">
                <SuiForm>
                    <SuiFormField>
                        <label>Search for posts based on content</label>
                        <div class="allFlex" >
                            <div class="search-input">
                                <input placeholder="Search for posts based on content" ref="blogContentSearch"
                                    :value="blogContentSearch" @input="searchContentChange($event)" />
                            </div>
                            <SuiButton color="violet" class="search-button" @click.native="contentSearch($event)"
                                    :disabled="!blogContentSearch.trim() || searchLoading" v-model="blogContentSearch" 
                                    :loading="searchLoading" >
                                <SuiIcon name="search" />SEARCH
                            </SuiButton>
                        </div>
                    </SuiFormField>
                </SuiForm>
            </div>
        </SuiMessage>
    </div>
</template>

<script>
import axios from "axios"
//import { blogContentEnum } from './Blog/BlogModels/Enums'

export default {
    name: "SearchBlog",
    components: {},
    props: ["searchLoading", "searchByContent", "searchByTopic", "alterState"],
    data(){
        return {
            topicList: [],
            searchBy: 1,
            selectedTopicList: [],
            blogContentSearch: ""
        }
    },
    methods: {
        generateTopicList(list){
            const arr = []
            for(const item of list){
                arr.push({
                    key: item.id,
                    value: item.id,
                    text: item.topicName
                })
            }
            this.topicList = arr
        },
        clearTopics(){
            this.selectedTopicList = []
        },
        searchContentChange(e){
            const val = e.target.value
            if(val.length <= 100){
                this.blogContentSearch = val
            }
            this.$refs.blogContentSearch.value = this.blogContentSearch
        },
        topicSearch(e){
            e.preventDefault()
            this.alterState("loading", true)
            this.alterState("blogList", [])
            this.alterState("pageNumber", 0)
            this.alterState("searchTopic", this.selectedTopicList)
            this.alterState("blogSearchCriteria", 2)
            this.searchByTopic(undefined, this.selectedTopicList)
        },
        contentSearch(e){
            e.preventDefault()
            this.alterState("loading", true)
            this.alterState("blogList", [])
            this.alterState("pageNumber", 0)
            this.alterState("searchContent", this.blogContentSearch)
            this.alterState("blogSearchCriteria", 3)
            this.searchByContent(undefined, this.blogContentSearch)
        }
    },
    created(){
        axios.get("/topic/").then(res => {
            this.generateTopicList(res.data)
        })
    }
}
</script>

<style scoped>
.allFlex{
    display: flex;
    align-items: center;
    justify-content: center;
}
.search-button{
    border-radius: 0px;
}
.search-menu-active{
    background-color: rgba(0, 0, 0, 0.05);
}
#clear-topics{
    cursor: pointer;
}
#clear-topics:hover{
    text-decoration: underline;
}
.search-menu{
    padding: 14px;
    font-weight: 700;
    cursor: pointer;
    display: inline-block;    
}
.search-menu:hover{
    background-color: rgba(0, 0, 0, 0.05);
}

/*ABOVE 990 PX*/
@media only screen and (min-width: 990px){
    .search-container{
        padding: 30px 40px;
    }
}

/*BELOW 990 PX*/
@media only screen and (max-width: 990px){
    .search-container{
        padding: 30px 14px;
    }
}

/*ABOVE 767 PX*/
@media only screen and (min-width: 767px){
    .search-input{
        width: 75%;
        margin-right: 7px;
    }
    .search-button{
        width: 25%;
        margin-left: 7px;
    }
}

/*BELOW 767 PX*/
@media only screen and (max-width: 767px){
    .search-input{
        width: 100%;
    }
    .search-button{
        width: 50%;
        margin-top: 14px;
    }
    .allFlex{
        flex-direction: column;
    }
}

/*ABOVE 510 PX*/
@media only screen and (min-width: 510px){

}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){
    .search-button{
        width: 100%;
        margin-top: 14px;
    }
}
</style>