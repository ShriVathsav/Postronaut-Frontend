<template>
    <div>
        <SuiComment style="padding: 14px 0px;">
            <!--<SuiCommentAvatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />-->
            <SuiCommentAvatar :src="avatarIcon" style="width: 35px; height: 35px;" />
            <SuiCommentContent>
                <router-link is="sui-comment-author" :to="'/profile/' + comment.profile.id">
                    {{comment.profile.userName}}</router-link>
                <SuiCommentMetadata>
                    <div>{{formatDate}}</div>
                </SuiCommentMetadata>
                <SuiForm v-if="commentEdit" style="margin: 14px;">
                    <textarea rows="5" style="min-height: 105px;" placeholder="Edit Comment" :value="editedContent"
                        :disabled="updateCommentLoading" @input="editCommentHandler($event)" ref="editedContent" />
                    <div style="margin: 10px 0px;">
                        <SuiButton compact color="red" @click.native="cancelEdit($event)" 
                                :disabled="updateCommentLoading" style="margin-right: 10px;">
                            <SuiIcon name="delete" />Cancel
                        </SuiButton>
                        <SuiButton compact color="green" @click.native="updateExistingComment($event)" 
                                :loading="updateCommentLoading" :disabled="!editedContent.trim()" >
                            <SuiIcon name="edit" />Update
                        </SuiButton>
                    </div>
                </SuiForm>
                <div v-else>
                    <SuiCommentText style="white-space: pre-line;">{{comment.content}}</SuiCommentText>
                    <SuiCommentActions v-if="comment.profile.id === profileId" style="margin-top: 14px;">
                        <SuiLabel size="small" color="blue" style="cursor: pointer; margin-right: 7px;"
                            @click.native="commentEdit = true" >EDIT COMMENT</SuiLabel>
                        <SuiLabel size="small" color="red" style="cursor: pointer;"
                            @click.native="deleteComment(comment.id)" >DELETE COMMENT</SuiLabel>
                        <!--<a is="sui-label" color="red"><SuiIcon name="trash alternate outline" /> DELETE COMMENT</a>-->
                    </SuiCommentActions>
                </div>
            </SuiCommentContent>
        </SuiComment>
    </div>
</template>

<script>
import avatarIcon from "../../../static/Icons/ProfileIcons/unknownUser3.svg"

//import axios from "axios"
import moment from "moment"

export default {
    name: "Comment",
    props: ["comment", "deleteComment", "updateComment", "index", "updateCommentLoading"],
    data(){
        return {
            profileId: this.$store.state.auth.user.id,
            commentEdit: false,
            editedContent: this.comment.content,

            avatarIcon
        }
    },
    computed: {
        formatDate(){
            return moment(this.comment.updatedAt).format("Do MMM YYYY h:mm A")
        }
    },
    methods: {
        editCommentHandler(e){
            const val = e.target.value
            if(val.length < 3000) {
                console.log(val)
                this.editedContent = val
            }
            this.$refs.editedContent.value = this.editedContent
        },
        cancelEdit(e){
            e.preventDefault()
            this.commentEdit = false
            this.editedContent = this.comment.content
        },
        updateExistingComment(e){
            e.preventDefault()
            this.updateComment(
                this.editedContent, this.comment.id,
                () => {
                    this.commentEdit = false
                    //this.editedContent = this.comment.content
                },
                () => {
                    this.commentEdit = false
                }
            )
        }
    }
}
</script>

<style scoped>

</style>