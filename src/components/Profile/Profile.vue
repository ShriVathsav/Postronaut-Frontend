<template>
    <div>
        <div v-if="loading">
            <FullPageLoader />
        </div>
        <div v-else>
            <div v-if="!profile" style="margin-top: 70px;">
                <PageNotFound />
            </div>
            <div v-else>
                <SuiSegment style="margin-top: 20px;">
                    <SuiGrid>
                        <SuiGridColumn :mobile="16" :tablet="6" :computer="6">
                            <div style="display: flex; align-items: center; flex-direction: column;">
                                <div>
                                    <div>
                                        <SuiImage slot="trigger" @click.native="openProfileModal()" bordered
                                            :src="profilePicUrl || avatarIcon" circular
                                            style="width: 150px; height: 150px; padding: 5px; cursor: pointer;" />
                                    </div>
                                    <!--SuiPopup position="bottom center" hoverable v-else >
                                        <SuiButton @click.native="removeProfileImage" content="Remove Image" icon="camera" 
                                            :disabled="!this.profilePicUrl" color="red" />
                                    </SuiPopup-->
                                </div>
                                <SuiHeader style="margin: 5px 0px 0px 0px; font-size: 20px;">
                                    {{profile.userName}}
                                </SuiHeader>
                                <div style="font-size: 13px; margin-top: 10px; color: gray;">
                                    Joined {{formatDate}}
                                </div>
                                <div style="width: 100%; display: flex; justify-content: center;">
                                    <a :href="profile.linkedin" target="_blank">
                                        <SuiImage v-if="profile.linkedin" :src="linkedinIcon" class="social-media-button"/>
                                    </a>
                                    <a :href="profile.github" target="_blank">
                                        <SuiImage v-if="profile.github" :src="githubIcon" class="social-media-button"/>
                                    </a>
                                    <a :href="profile.facebook" target="_blank">
                                        <SuiImage v-if="profile.facebook" :src="facebookIcon" class="social-media-button"/>
                                    </a>
                                    <a :href="profile.youtube" target="_blank">
                                        <SuiImage v-if="profile.youtube" :src="youtubeIcon" class="social-media-button"/>
                                    </a>
                                </div>
                                <div style="margin-top: 14px;" v-if="identity() === 2">
                                    <SuiButton :color="followState ? 'red' : 'blue'" @click.native="alterFollowState" >
                                        <SuiIcon :name="followState ? 'remove user' : 'add user'" />
                                        {{followState ? "Unfollow": "Follow"}}
                                    </SuiButton>
                                </div>
                            </div>
                        </SuiGridColumn>
                        <SuiGridColumn :mobile="16" :tablet="10" :computer="10">
                            <div>
                                <div style="display: flex; align-items: center;">
                                    <SuiHeader style="font-size: 20px; margin: 0px; width: 50%;">Profile Information</SuiHeader>
                                    <div style="float: right; width: 50%;" v-if="identity() === 1" >
                                        <SuiButton floated="right" color="violet" @click.native="$router.push(`/profile/${profileId}/edit`)">
                                            <SuiIcon name="edit" />Edit Profile
                                        </SuiButton>
                                    </div>
                                </div>
                                <SuiDivider />
                                <div style="margin-top: 20px;">
                                    <div class="profile-heading">Email</div>
                                    <div>{{profile.email}}</div>
                                </div>
                                <div style="margin-top: 20px;" v-if="identity() === 1 || profile.description">
                                    <div class="profile-heading">About</div>
                                    <div>{{profile.description ? profile.description : "&#x2b; &nbsp; Add a description"}}</div>
                                </div>
                                <div style="margin-top: 20px;">
                                    <div style="display: flex; align-items: center;" class="profile-heading">
                                        <div style="width: 70%;">Topics Interested</div>
                                        <div style="width: 30%;" v-if="identity() === 1" >
                                            <SuiPopup content="Add or Remove Topics" position="top right" inverted >
                                                <SuiButton color="violet" style="padding: 6px;" floated="right" 
                                                    @click.native="openTopicModal" icon="add" slot="trigger" />
                                            </SuiPopup>
                                        </div>
                                    </div>
                                    <div>
                                        <div v-if="profile.topic.length !== 0" style="display: flex; flex-flow: row wrap;">
                                            <SuiLabel color="orange" v-for="topic in profile.topic" :key="topic.id" class="topic-item">
                                                {{topic.topicName}}
                                            </SuiLabel>
                                        </div>
                                        <div v-else>It seems {{identity() === 1 ? " you haven`t selected any topic of your interest." 
                                            : profile.userName + " hasn`t selected any topics of their interests"}}</div>
                                    </div>
                                </div>
                                <div style="display: flex; flex-flow: row wrap;" v-if="viewMore">
                                    <div style="margin-top: 20px; width: 50%;">
                                        <div class="profile-heading">Education</div>
                                        <div>{{profile.education ? profile.education : "Not Specified"}}</div>
                                    </div>
                                    <div style="margin-top: 20px; width: 50%;">
                                        <div class="profile-heading">Work</div>
                                        <div>{{profile.work ? profile.work : "Not Specified"}}</div>
                                    </div>
                                    <div style="display: flex; flex-flow: row wrap; width: 100%;"
                                            v-if="identity() === 1">
                                        <div style="margin-top: 20px; width: 50%;">
                                            <div class="profile-heading"><SuiIcon color="blue" name="linkedin" />LinkedIn</div>
                                            <div>{{profile.linkedin ? profile.linkedin : "Not Specified"}}</div>
                                        </div>
                                        <div style="margin-top: 20px; width: 50%;">
                                            <div class="profile-heading"><SuiIcon color="black" name="github" />Github</div>
                                            <div>{{profile.github ? profile.github : "Not Specified"}}</div>
                                        </div>
                                        <div style="margin-top: 20px; width: 50%;">
                                            <div class="profile-heading"><SuiIcon color="blue" name="facebook" />Facebook</div>
                                            <div>{{profile.facebook ? profile.facebook : "Not Specified"}}</div>
                                        </div>
                                        <div style="margin-top: 20px; width: 50%;">
                                            <div class="profile-heading"><SuiIcon color="red" name="youtube" />Youtube</div>
                                            <div>{{profile.youtube ? profile.youtube : "Not Specified"}}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style="margin-top: 7px;">
                                    <SuiButton size="mini" :color="viewMore ? 'red' : 'green'" compact floated="right" 
                                        @click.native="viewMore = !viewMore">
                                        {{viewMore ? "View Less" : "View More"}}
                                    </SuiButton>
                                </div>
                            </div>
                        </SuiGridColumn>
                    </SuiGrid>
                </SuiSegment>
                <SuiSegment>
                    <SuiHeader style="margin: 5px 0px;">
                        <SuiIcon name="line graph" />{{identity() === 1 ? "Your" : `${profile.userName}'s`}} Activity
                    </SuiHeader>
                    <SuiDivider />
                    <div>
                        <div style="display: flex; flex-flow: row wrap;">
                            <div class="activity-items" v-for="item in activity" :key="item[0]">
                                <div style="width: 70%;">{{item[0]}}</div>
                                <div style="width: 30%;">
                                    <SuiLabel :color="item[2]" style="float: right;">{{item[1]}}</SuiLabel>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 14px;">
                        <SuiButton color="violet" icon="chevron down" style="border-radius: 0px;" label-position="right"
                            @click.native="$router.push({path: `/profile/${profileId}/posts`})" >
                            View Posts Created By {{identity() === 1 ? "You" : profile.userName}}
                        </SuiButton>
                    </div>
                </SuiSegment>
                <ProfileMenu :profile="profile" :items="items" />
                <ProfileImageModal :profileModalOpen="profileModalOpen" :openProfileModal="openProfileModal"
                    :profilePicUrl="profilePicUrl" :alterProfilePic="alterProfilePic" :profile="profile" />
                <AddTopicModal :topicModalOpen="topicModalOpen" :openTopicModal="openTopicModal" :profile="profile" />
            </div>
        </div>
    </div>
</template>

<script>
import ProfileMenu from "./ProfileMenu/ProfileMenu"
import FullPageLoader from "../UI/FullPageLoader"
import ProfileImageModal from "./EditProfile/ProfileImageModal"
import AddTopicModal from "./EditProfile/AddTopicModal"
import PageNotFound from "../InfoPages/PageNotFound"
import axios from "axios"
import moment from "moment"
import AWS from 'aws-sdk'
require("dotenv").config()

import avatarIcon from "../../static/Icons/ProfileIcons/unknownUser3.svg"

import linkedinIcon from "../../static/Icons/ProfileIcons/SocialMedia/linkedin.svg"
import githubIcon from "../../static/Icons/ProfileIcons/SocialMedia/github.svg"
import facebookIcon from "../../static/Icons/ProfileIcons/SocialMedia/facebook.svg"
import youtubeIcon from "../../static/Icons/ProfileIcons/SocialMedia/youtube.svg"

export default {
    name: "Profile",
    components: {ProfileMenu, FullPageLoader, ProfileImageModal, AddTopicModal, PageNotFound},
    data(){
        return {
            s3Bucket: process.env.VUE_APP_BUCKET_NAME,
            region: process.env.VUE_APP_BUCKET_REGION,
            myBucket: new AWS.S3({
                params: { Bucket: process.env.VUE_APP_BUCKET_NAME},
                signatureVersion: 'v4',
                region: process.env.VUE_APP_BUCKET_REGION
            }),
            profileId: this.$route.params.id,
            activity: [],
            items: [],

            linkedinIcon,
            githubIcon,
            youtubeIcon,
            facebookIcon,
            avatarIcon,

            viewMore: false,
            profile: null,
            profilePicUrl: "",
            profileModalOpen: false,
            topicModalOpen: false,
            followState: false,
            loading: false
        }
    },
    methods: {
        profileValid(){
            return !!this.profile
        },
        openProfileModal(){
            this.profileModalOpen = !this.profileModalOpen
        },
        openTopicModal(){
            this.topicModalOpen = !this.topicModalOpen
        },
        alterFollowState(){
            this.followState = !this.followState
            if(this.followState){
                axios.post(`/follow/${this.$store.state.auth.user.id}/${this.$route.params.id}`).then(res => {
                    console.log(res)
                })
            } else{
                axios.delete(`/follow/unfollow/${this.$store.state.auth.user.id}/${this.$route.params.id}`).then(res => {
                    console.log(res)
                })
            }
        },
        setActivityItems(profile){
            this.activity = [["Posts Published", profile.blogsPublished, "red"], ["Posts Saved", profile.blogsSaved, "teal"], 
                ["Liked Posts", profile.likedPosts, "blue"], ["Commented Posts", profile.commentedPosts, "orange"], 
                ["Followers", profile.followerCount, "olive"], ["Following", profile.followingCount, "brown"]]
                
            this.items = [['Liked Posts', profile.likedPosts, 'red'], ['Posts Commented', profile.commentedPosts, 'blue'], 
                ['Followers', profile.followerCount, 'teal'], ['Following', profile.followingCount, 'olive']]
        },
        async generatePresignedUrl(key){
            return new Promise((resolve,reject) => {
                const myBucket = this.s3Bucket
                const myKey = key
                const signedUrlExpireSeconds = 86400
                const params = {
                    Bucket: myBucket,
                    Key: myKey,
                    Expires: signedUrlExpireSeconds
                }
                this.myBucket.getSignedUrl('getObject', params, (err, url) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(url)
                })
            });
        },
        identity(){
            return this.$store.state.auth.user.id == this.$route.params.id ? 1 : 2
        },
        alterProfilePic(imageUrl){
            this.profilePicUrl = imageUrl
        },
        getProfile() {
            this.loading = true
            axios.get(`/profile/${this.profileId}`).then(async res => {
                this.profile = res.data
                this.profilePicUrl = res.data.profilePicUrl ? await this.generatePresignedUrl(res.data.profilePicUrl): ""
                this.setActivityItems(res.data)
                console.log(res.data, "profile")
                this.loading = false
            }).catch(err => {
                console.log(err, "ERROR")
                this.loading = false
            })
            if(this.identity() === 2){
                axios.get(`/follow/findFollow/${this.$store.state.auth.user.id}/${this.$route.params.id}`).then(res => {
                    console.log(res.data, "FIND FOLLOW")
                    this.followState = res.data
                })
            }
        }
        /*removeProfileImage(){            
            axios.delete(`/profile/deleteprofileimage?imageUrl=${this.profilePicUrl}&profileId=${this.profileId}`).then(res => {
                console.log(res)
                this.profilePicUrl = ""
                this.$store.dispatch("auth/changeProfileImage", null)
            }).catch(err => {
                this.profilePicUrl = ""
                this.$store.dispatch("auth/changeProfileImage", null)
                console.log(err.response)
            })
        }*/
    },
    computed: {
        formatDate(){
            const date = moment(this.profile.createdAt).format("Do MMM YYYY")
            return date === "Invalid date" ? "a year ago" : date
        }
    },
    created(){
        this.getProfile()
    },
    updated(){
        console.log(this.$store.state.auth.user, "AUTH USER")
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
.activity-items{
    display: flex;
    justify-content: center;
    align-items:center;
    padding: 14px;
    border-right: 1px solid rgba(34,36,38,.15);
    border-bottom: 1px solid rgba(34,36,38,.15);
    width: 50%;
}

.topic-item{
    /*color: rgba(117, 117, 117, 1);
    padding: 5px;
    background-color: rgba(242, 242, 242, 1);*/
    margin: 5px;
}

.profile-heading{
    margin: 0px 0px 10px 0px;
    font-size: 16px;
    font-weight: 700;
}

.social-media-button{
    width: 20px;
    margin: 15px 10px 0px 10px;
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
    .activity-items{
        width: 25%;
    }
    .activity-items:nth-child(4n + 4){
        border-right: none;
    }

    .activity-items:nth-last-child(-n+4) {
        border-bottom: none;
    }
}

/*BELOW 767 PX*/
@media only screen and (max-width: 767px){
    .activity-items{
        width: 50%;
    }

    .activity-items:nth-child(2n + 2){
        border-bottom: 1px solid rgba(34,36,38,.15);
        border-right: none;
    }
    .activity-items:nth-last-child(-n+2) {
        border-bottom: none;
    }
}

/*ABOVE 510 PX*/
@media only screen and (min-width: 510px){

}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){

}
</style>