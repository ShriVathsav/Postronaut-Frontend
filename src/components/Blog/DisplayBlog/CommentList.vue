<template>
    <div>
        <div style="display: flex; justify-content: center;" class="comment-group">
            <SuiCommentGroup style=" width: 100%; max-width: none;" class="comment-group">
                <SuiHeader style="margin-bottom: 40px; font-size: 20px; display: flex; align-items: center;" dividing>
                    <SuiImage :src="commentCard" style="width: 35px; margin-right: 10px;" />
                    <div>Comments ({{commentCount}})</div>
                </SuiHeader>
                <div class="comment-content">
                    <div v-if="loading">
                        <Loader size="big" height="160" />
                    </div>
                    <div v-else>
                        <div v-if="commentList.length === 0" style="font-size: 18px; margin: 30px 0px; display: flex; flex-direction: column; align-items: center;">
                            <SuiImage :src="commentsIcon" style="width: 120px; margin-bottom: 10px;" />
                            <span>Be the first one to comment</span>
                        </div>
                        <div v-else v-for="(comment, index) in commentList" :key="comment.id">
                            <Comment :comment="comment" :deleteComment="deleteComment"  :index="index"
                                :updateComment="updateComment" :updateCommentLoading="updateCommentLoading"  />
                        </div>                    
                        <SuiSegment attached="top">
                            <SuiForm>
                                <textarea rows="5" style="min-height: 105px;" placeholder="Leave a Comment" 
                                    ref="commentContent" :value="commentContent" @input="commentChange($event)" />
                            </SuiForm>
                        </SuiSegment>
                        <SuiMenu attached="bottom" tabular>
                            <SuiMenuMenu position="right">
                                <SuiMenuItem :active="true" style="padding: 14px;">
                                    <SuiButton :loading="createCommentLoading" content="Post Comment" 
                                        label-position="left" icon="pencil" color="violet"
                                        :disabled="commentContent.trim() === ''" @click.native="postCommentHandler" />
                                </SuiMenuItem>
                            </SuiMenuMenu>
                        </SuiMenu>
                    </div>
                </div>              
            </SuiCommentGroup>
        </div>
    </div>
</template>

<script>
import Comment from "./Comment"
import axios from "axios"
import Loader from "../../UI/Loader"

import commentCard from "../../../static/Icons/DisplayBlogIcons/commentCard.svg"
import commentsIcon from "../../../static/Icons/ProfileIcons/comments.svg"


export default {
    name: "CommentList",
    components: {Comment, Loader},
    props: ["blogId", "commentCount", "alterCommentCount"],
    data(){
        return {
            commentContent: "",
            commentList: [],
            loading: true,
            createCommentLoading: false,
            updateCommentLoading: false,

            commentCard,
            commentsIcon            
        }
    },
    methods: {
        commentChange(e){
            const val = e.target.value
            if(val.length < 3000) {
                this.commentContent = val
            }
            this.$refs.commentContent.value = this.commentContent
        },
        postCommentHandler(){
            this.createCommentLoading = true
            const commentBody = {
                content: this.commentContent,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            this.commentContent = ""
            axios.post(`/comment/${this.blogId}/create/${this.$store.state.auth.user.id}`, commentBody).then(res => {
                console.log(res)
                this.createCommentLoading = false
                this.commentList.push(res.data)
                this.alterCommentCount(1)
            }).catch(err => {
                console.log(err)
                this.createCommentLoading = false
            })
        },
        updateComment(editedContent, commentId, successCallback, errorCallback){
            this.updateCommentLoading = true
            const commentBody = {
                content: editedContent,
                updatedAt: new Date()
            }
            axios.put(`/comment/${commentId}`, commentBody).then(res => {
                console.log(res)
                this.updateCommentLoading = false
                successCallback()
                this.updateCommentAction(res.data, res.data.id)
                console.log(this.commentList, "PRINTING COMMENT LIST after updates")
            }).catch(err => {
                console.log(err)
                this.updateCommentLoading = false
                errorCallback()
            })
        },
        updateCommentAction(comment, commentId){
            console.log(this.commentList, this.commentList.filter(item => item.id !== commentId), "COMMENT LIST BEFORE UPDATES")
            const arr = this.commentList.filter(item => item.id !== commentId)
            arr.push(comment)
            console.log(arr, "array")
            this.commentList = arr
            console.log(this.commentList, "COMMENT LIST AFTER UPDATES")
            //this.commentList.splice(index, 1)
            //this.commentList.push(comment)
        },
        deleteComment(commentId){
            axios.delete(`/comment/${commentId}`).then(res => {
                console.log(res)
                this.alterCommentCount(-1)
            }).catch(err => {
                console.log(err)
            })
            this.commentList = this.commentList.filter(item => item.id !== commentId)
        }
    },
    created(){
        axios.get(`/comment/${this.blogId}`).then(res => {
            console.log(res, "COMMENT LIST")
            this.commentList = res.data.content
            this.loading = false
        }).catch(err => {
            console.log(err)
            this.loading = false
        })
    },
}
</script>

<style scoped>
/*ABOVE 990 PX*/
@media only screen and (min-width: 990px){
    #profile-segment{
        max-width: 800px;
    }
}

/*BELOW 990 PX*/
@media only screen and (max-width: 990px){

}

/*ABOVE 767 PX*/
@media only screen and (min-width: 767px){
    .comment-content {
        padding: 0px 30px;
    }
    .comment-group {
        margin: 40px;
    }
}

/*BELOW 767 PX*/
@media only screen and (max-width: 767px){
    .comment-group {
        margin: 40px 0px;
    }
}

/*ABOVE 510 PX*/
@media only screen and (min-width: 510px){

}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){

}
</style>