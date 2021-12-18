<template>
    <div>
        <SuiModal :open="likeModalOpen" size="tiny" >
            <SuiModalHeader><SuiIcon name="thumbs up" style="margin-right: 11px;"/>
                People who liked this post ({{blogLikes.length}})</SuiModalHeader>
            <SuiModalContent scrolling>
                <SuiModalDescription>
                    <div v-if="loading">
                        <Loader size="medium" height="100" />
                    </div>
                    <div id="likeDiv" v-else>
                        <div v-if="blogLikes.length === 0" style="display: flex; flex-direction: column; align-items: center; font-size: 18px; margin: 14px 0px;">
                            <SuiImage :src="likesIcon" style="width: 120px; margin-bottom: 10px;" />
                            <span>It seems no one has liked this post yet.</span>
                        </div>
                        <div v-for="like in blogLikes" :key="like.id" class="profile-like">
                            <div style="display: flex; align-items: center;">
                                <SuiImage :src="like.profile.profilePicUrl || unknownUser" avatar style="width: 40px; height: 40px;" />
                                <div style="margin-left: 7px;">
                                    <div style="font-weight: 700; cursor: pointer; font-size: 15px;" @click="$router.push(`/profile/${like.profile.id}`)" >
                                        {{like.profile.userName}}
                                    </div>
                                    <div>{{like.profile.description}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SuiModalDescription>
            </SuiModalContent>
            <SuiModalActions>
                <SuiButton icon="cancel" negative 
                    @click.native="closeLikeModal()">Close</SuiButton>
            </SuiModalActions>
        </SuiModal>
    </div>
</template>

<script>
import likeOutline from "../../../static/Icons/DisplayBlogIcons/likeOutline.svg"
import likeIcon from "../../../static/Icons/DisplayBlogIcons/like.svg"
import likesIcon from "../../../static/Icons/ProfileIcons/like.svg"
import unknownUser from "../../../static/Icons/ProfileIcons/unknownUser3.svg"

import axios from "axios"
import Loader from "../../UI/Loader"

export default {
    name: "LikeModal",
    components: {Loader},
    props: ["blogId", "likeModalOpen", "closeLikeModal"],
    data(){
        return {
            likeOutline,
            likeIcon,
            likesIcon,
            unknownUser,

            liked: false,
            loading: true,
            blogLikes: []
        }
    },
    methods: {
    },
    computed: {
        
    },
    created(){
        axios.get(`/like/${this.blogId}`).then(res => {
            console.log(res)
            this.blogLikes = res.data.content
            this.loading = false
        }).catch(err => {
            this.loading = false
            console.log(err)
        })
    },
    updated(){
        console.log(this.liked, "liked")
    }
}
</script>

<style scoped>
#likeDiv{
    border: 1px solid rgba(34,36,38,.15);
    border-radius: .28571429rem;
    padding: 0px 14px;
}
.profile-like{
    padding: 14px 0px;
    border-bottom: 1px solid rgba(34,36,38,.15);
}
.profile-like:last-of-type{
    border: none;
}
</style>