<template>
    <div>
        <div style="display: flex; align-items: center;">
            <div style="width: 37%">
                <SuiButton inverted color="violet" content="Back" icon="left arrow" 
                    @click.native="alterStep(1)" style="border-radius: 0px;" label-position="left" />
            </div>
            <div style="width: 63%; color: gray; font-size: 16px;">
                Please click on the Save button to save changes.
            </div>
        </div>
        <div>
            <div style="display: flex; justify-content: center;"  >
                <SuiPopup content="Your Blog will be visible to everyone." inverted position="bottom left" >
                    <SuiButton slot="trigger" compact inverted color="violet" @click.native="blogSubmitHandler(selectedTopicList, coverPicture, coverPicUrl)"
                        style="display: flex; align-items: center; justify-content: center; margin: 30px 18px 30px 0px;" >
                        <SuiImage :src="publishBlog" size="mini" style="margin-right: 16px;" />
                        <span style="font-size: 16px;">PUBLISH</span>
                    </SuiButton>
                </SuiPopup>
                <SuiPopup v-if="evaluateSave()" content="A copy of this blog will be saved and will not be visible to others." inverted position="bottom right" >
                    <SuiButton slot="trigger" compact inverted color="blue" 
                        style="display: flex; align-items: center; justify-content: center; margin: 30px 0px 30px 18px;" >
                        <SuiImage :src="saveBlog" size="mini" style="margin-right: 16px;" />
                        <span style="font-size: 16px;">SAVE</span>
                    </SuiButton>
                </SuiPopup>
            </div>
        </div>
        <div>
            <SuiHeader dividing >Add Topics related to the blog</SuiHeader>
            <SuiForm style="padding: 14px;">
                <SuiFormField required>
                    <label>Select Topics of your interests</label>
                    <SuiDropdown :options="topicList" placeholder="Select Topics" search
                        fluid multiple selection v-model="selectedTopicList" />
                    <SuiLabel basic color="red" v-if="selectedTopicList.length === 0" pointing>Select atleast one topic</SuiLabel>
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
        <div style="margin-top: 30px;">            
            <SuiHeader dividing>Cover Photo</SuiHeader>            
            <CoverPicUpload :addCoverPicture="addCoverPicture" :coverPicUrl="coverPicUrl"
                :deleteCoverPicUrl="deleteCoverPicUrl" />
        </div>
    </div>
</template>

<script>
import axios from "axios"
import {editBlogEnum} from "../BlogModels/Enums"
import CoverPicUpload from "./CoverPicUpload"

import publishBlog from "../../../static/Icons/CreateBlogIcons/publishBlog.svg"
import saveBlog from "../../../static/Icons/CreateBlogIcons/saveBlog.svg"

export default {
    name: "PublishBlog",
    components: {CoverPicUpload},
    props: ["blogObjectList", "imagesList", "deletedImagesList", "coverPicUrl", "blogSubmitHandler", 
        "initialTopicList", "alterStep", "blog", "blogEditState", "deleteCoverPicUrl"],
    data(){
        return {
            topicList: [],
            selectedTopicList: this.prepareSelectedTopics(this.initialTopicList),
            editBlogEnum,
            coverPicture: null,

            publishBlog,
            saveBlog
        }
    },
    methods: {
        addCoverPicture(obj) {
            this.coverPicture = obj
        },
        evaluateSave() {
            if((this.blogEditState === editBlogEnum.UPDATE && this.blog.blogStatus === 'saved')
                    || this.blogEditState === editBlogEnum.CREATE) {
                return true
            }
            return false
        },
        alterState(stateObj, value){
            console.log(stateObj, value)
            this[stateObj] = value
        },
        addItemBlogObjectList(obj){
            this.blogObjectList.push(obj)
        },
        removeItemBlogObjectList(index){
            this.blogObjectList.splice(index, 1)
        },
        submitHandler(){
            this.blogObjectList.map(item => {
                if(item.type === "Title"){
                    this.contentList.push(this.prepareTitleContent(item))
                } else if(item.type === "Text"){
                    this.contentList.push(this.prepareTextContent(item))
                } else if(item.type === "Image"){
                    this.contentList.push(this.prepareImageContent(item))
                } else if(item.type === "Blockquote"){
                    this.contentList.push(this.prepareBlockquoteContent(item))
                }
            })
            console.log(this.contentList, "PRINTING CONTENT LIST")
        },
        generateTopicList(list){
            const arr = []
            for(const item of list){
                arr.push({
                    key: item.id,
                    value: item.id,
                    text: item.topicName
                })
            }
            console.log(arr, "topic list")
            this.topicList = arr
        },
        prepareSelectedTopics(list){
            let arr = []
            for(const i of list){
                arr.push(i.id)
            }
            return arr
        },
        clearTopics(){
            this.selectedTopicList = null
        },
        topicListValid(){
            if(this.selectedTopicList){
                console.log(this.selectedTopicList.length)
                if(this.selectedTopicList.length === 0){
                    console.log("Hello")
                    return true
                }
                return false
            } else {
                return true
            }
        },
    },
    created(){
        axios.get("/topic/").then(res => {
            this.generateTopicList(res.data)
        }).catch(err => {
            console.log(err, err.response)
        })
    },
    updated(){
        console.log(this.blog.blogStatus, "BVLOG STATUS")
    },
}
</script>

<style scoped>

</style>