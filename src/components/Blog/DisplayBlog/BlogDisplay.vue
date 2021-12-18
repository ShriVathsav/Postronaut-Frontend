<template>
    <div style="margin-top: 40px;">
        <div v-if="!blogDeleted">
            <div id="blog-container" v-if="!loading">
                <div v-if="blogNotFound">
                    <PageNotFound />
                </div>
                <div v-else >
                    <div style="padding: 16px; margin: 14px 0px; background-color: #f8f8f9;">
                        <div >
                            <div style="display: flex; justify-content: center; align-items: center;">
                                <div style="width: 70%; font-size: 16px; display: flex; align-items: center; flex-flow: row wrap;">
                                    <div style="font-weight: 700; margin: 4px 8px; display: flex; align-items: center;">
                                        <SuiImage style="margin-right: 12px;" :src="$store.state.auth.user.profilePicUrl || unknownUser" avatar />
                                        <SuiPopup content="View Profile" inverted position="top center" >
                                            <div slot="trigger" style="cursor: pointer;" @click="$router.push(`/profile/${author.id}`)">
                                                {{author.userName}}
                                            </div>
                                        </SuiPopup>                         
                                    </div>
                                    <SuiLabel color="violet" style="margin: 4px 8px;">AUTHOR</SuiLabel>
                                </div>
                                <div style="width: 30%; text-align: right; margin-right: 6px;">
                                    <div style="color: gray; font-size: 12px; margin-bottom: 5px;">Last Edited On</div>
                                    <div>{{formatDate}}</div>
                                </div>
                            </div>
                            <div style="width: 100%; display: flex; margin-left: 14px;">
                                <SuiImage v-if="author.linkedin" :src="linkedinIcon" class="social-media-button"/>
                                <SuiImage v-if="author.github" :src="githubIcon" class="social-media-button"/>
                                <SuiImage v-if="author.facebook" :src="facebookIcon" class="social-media-button"/>
                                <SuiImage v-if="author.youtube" :src="youtubeIcon" class="social-media-button"/>
                            </div>
                        </div>               
                    </div>
                    <div style="width: 100%; display: flex; flex-direction: row-reverse; align-items: center;" v-if="author.id === this.$store.state.auth.user.id" >                        
                        <SuiButton color="red" style="margin: 0px 7px; display: flex; align-items: center; justify-content: center;" @click.native="deleteBlog" :loading="deleteLoading" >
                            <SuiImage style="margin-right: 8px; width: 25px;" :src="deleteBlogIcon" />
                            <span>Delete Post</span>
                        </SuiButton>
                        <SuiButton color="green" style="margin: 0px 7px; display: flex; align-items: center; justify-content: center;" @click.native="$router.push(`/blog/${blogId}/edit`)" >
                            <SuiImage style="margin-right: 8px; width: 25px;" :src="editBlogIcon" />
                            <span>Edit Post</span>
                        </SuiButton>
                    </div>
                    <div v-for="item in blogContent" :key="item.id" style="margin: 0px 14px;">
                        <div v-if="item.type === 'Image'" style="text-align: center;">
                            <div v-html="item.firstContent + imagesList[item.content] + item.thirdContent" 
                                    style="margin-top: 28px; text-align: center;  max-width: 100%;">
                            </div>
                        </div>

                        <div v-else v-html="item.firstContent + item.content + item.thirdContent" style="margin-top: 28px;">
                            {{item.firstContent + item.content + item.thirdContent}}
                        </div>
                    </div>

                    <SuiDivider style="margin-top: 40px;" />

                    <div id="tags">#Tags</div>
                    <div id="tag-label" >
                        <SuiLabel color="orange" v-for="topic in blogTopicList" :key="topic.id"
                            style="margin: 7px;" size="large" >{{topic.topicName}}</SuiLabel>
                    </div>

                    <Like :blogId="blogId" :liked="liked" :alterLike="alterLike" :likeCount="likeCount" />
                    <div style="text-align: center; margin: 30px 0px;">
                        <SuiButton inverted :icon="viewComments ? 'chevron up' : 'chevron down'" label-position="right"
                                @click.native="viewComments = !viewComments" :color="viewComments ? 'blue' : 'violet'" 
                                style="border-radius: 0px;" >
                            <div style="display: flex; align-items: center; justify-content: center;">
                                <SuiImage :src="commentsIcon" style="width: 30px; margin-right: 14px;" />
                                <span style="font-size: 15px;">{{viewComments ? "HIDE COMMENTS": "VIEW COMMENTS"}} ({{commentCount}})</span>
                            </div>
                        </SuiButton>
                    </div>
                    <div v-if="viewComments">
                        <CommentList :blogId="blogId" :commentCount="commentCount" :alterCommentCount="alterCommentCount" />
                    </div>
                </div>
            </div>
            <FullPageLoader v-else />
        </div>
        <div v-else>
            <InfoPage message="Post has been deleted successfully!" :icon="blogDeletedIcon" />
        </div>
    </div>
</template>

<script>
import moment from "moment"
import axios from "axios"
import CommentList from "./CommentList"
import Like from "./Like"
import FullPageLoader from "../../UI/FullPageLoader.vue"
import PageNotFound from "../../InfoPages/PageNotFound.vue"
import InfoPage from "../../UI/InfoPage.vue"

import commentsIcon from "../../../static/Icons/DisplayBlogIcons/commentCard.svg"
import blogDeletedIcon from "../../../static/Icons/AuthIcons/blogDeleted.svg"
import unknownUser from "../../../static/Icons/ProfileIcons/unknownUser3.svg"

import linkedinIcon from "../../../static/Icons/ProfileIcons/SocialMedia/linkedin.svg"
import githubIcon from "../../../static/Icons/ProfileIcons/SocialMedia/github.svg"
import facebookIcon from "../../../static/Icons/ProfileIcons/SocialMedia/facebook.svg"
import youtubeIcon from "../../../static/Icons/ProfileIcons/SocialMedia/youtube.svg"
import editBlogIcon from "../../../static/Icons/DisplayBlogIcons/edit3.svg"
import deleteBlogIcon from "../../../static/Icons/DisplayBlogIcons/bin.svg"
import AWS from "aws-sdk"

export default {
    name: "BlogDisplay",
    components: {CommentList, Like, FullPageLoader, PageNotFound, InfoPage},
    data(){
        return {
            s3Bucket: process.env.VUE_APP_BUCKET_NAME,
            region: process.env.VUE_APP_BUCKET_REGION,
            myBucket: new AWS.S3({
                params: { Bucket: process.env.VUE_APP_BUCKET_NAME},
                signatureVersion: 'v4',
                region: process.env.VUE_APP_BUCKET_REGION
            }),
            blogId: this.$route.params.id,
            blogContent: [],
            blogTopicList: [],
            blogUpdatedAt: "",
            loading: true,
            viewComments: false,
            liked: false,
            author: null,
            likeCount: 0,
            commentCount: 0,
            blogNotFound: false,
            deleteLoading: false,
            blogDeleted: false,
            imagesList: {},

            editBlogIcon,
            deleteBlogIcon,
            commentsIcon,
            unknownUser,
            blogDeletedIcon,
            linkedinIcon,
            githubIcon,
            youtubeIcon,
            facebookIcon
        }
    },
    methods: {
        alterLike(){
            this.liked = !this.liked
            if(this.liked){
                this.likeCount = this.likeCount + 1
            } else {
                this.likeCount = this.likeCount - 1
            }
            if(this.liked === true){
                axios.post(`/like/${this.blogId}/${this.$store.state.auth.user.id}`).then(res => {
                    console.log(res)
                })
            } else if(this.liked === false){
                axios.delete(`/like/${this.blogId}/${this.$store.state.auth.user.id}`).then(res => {
                    console.log(res)
                })
            }
        },
        deleteBlog(){
            this.deleteLoading = true
            axios.delete(`/blog/${this.blogId}/${this.$store.state.auth.user.id}`) .then(res => {
                console.log(res)
                this.deleteLoading = false
                this.blogDeleted = true
            }).catch(err => {
                console.log(err)
                this.deleteLoading = false
            })
        },
        alterCommentCount(val){
            this.commentCount = this.commentCount + val
        },
        async getPresignedUrls(image){
            //const s3 = new AWS.S3()
            console.log(image, "PRINTING IMAGE FOR WHICH PRESIGNED URL IS GEN")
            return new Promise((resolve,reject) => {
                const myBucket = this.s3Bucket
                const myKey = image
                const signedUrlExpireSeconds = 60 * 5
                const params = {
                    Bucket: myBucket,
                    Key: myKey,
                    Expires: signedUrlExpireSeconds
                }
                console.log(params, "BUCKET PARAMS")
                this.myBucket.getSignedUrl('getObject', params, (err, url) => {
                    if (err) reject(err);
                    resolve(url);
                });
            })
        },
        async setBlogState(res){
            const imagesList = {}
            const list = JSON.parse(res.data.imagesList)
            console.log(list, "PARSED IMAGES LIST")
            if(list){
                for (let image of list) {
                    console.log(image, "ITERATING PARSED IMAGES LIST")
                    const signedUrl = await this.getPresignedUrls(image)
                    console.log(signedUrl, "SIGNED URL")
                    imagesList[image] = signedUrl
                }
                this.imagesList = imagesList
            }
            this.blogContent = JSON.parse(res.data.blogContent)
            this.blogUpdatedAt = res.data.updatedAt
            this.blogTopicList = res.data.topic
            this.likeCount = res.data.likeCount
            this.commentCount = res.data.commentCount
            this.author = res.data.profile
            this.loading = false
        }
    },
    computed: {
        formatDate(){
            return moment(this.blogUpdatedAt).format("Do MMM YYYY")
        }
    },
    created(){
        axios.get(`/blog/${this.$route.params.id}`).then(res => {
            console.log(res)            
            this.setBlogState(res)
        }).catch(err => {
            this.loading = false
            if(err.response.status === 404){
                this.blogNotFound = true
            }
            console.log(err.response)
        })

        axios.get(`/like/liked/${this.blogId}/${this.$store.state.auth.user.id}`).then(res => {
            console.log(res)
            if(res.data){
                this.liked = true
            } else {
                this.liked = false
            }
        })
    },
    beforeCreate(){
        AWS.config.update({
            accessKeyId: process.env.VUE_APP_ACCESS_KEY,
            secretAccessKey: process.env.VUE_APP_SECRET_ACCESS_KEY
        })
    }
}
</script>

<style scoped>
#tags{
    margin-top: 30px;
    color: gray;
    font-style: italic;
    text-align: center;
}

#tag-label{
    margin: 10px 0px 20px 0px;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
}

.social-media-button{
    width: 20px;
    margin: 10px 10px 0px 10px;
    cursor: pointer;
}

#blog-container >>> p {
    margin: 28px 0px 0px 0px;
}

#blog-container >>> p {
    margin: 28px 0px 0px 0px; padding: 0px;
}

#blog-container >>> li {
    margin: 20px 0px 0px 0px; padding: 0px;
} 

#blog-container >>> ul, ol {
    margin: 28px 0px 0px 0px; padding: 0px 0px 0px 40px;
}

#blog-container >>> blockquote p:first-child {
    margin: 0px;
}

</style>