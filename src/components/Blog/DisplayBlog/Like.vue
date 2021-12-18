<template>
    <div>
        <div style="display: flex; justify-content: center; align-items: center; margin: 30px 0px 10px 0px;">
            <SuiPopup content="Like" inverted position="top center">
                <SuiImage slot="trigger" :src="liked ? likeIcon : likeOutline" style="cursor: pointer; margin-right: 7px;" size="mini"
                    @click.native="alterLike"/>
            </SuiPopup>
            <SuiPopup content="People who liked this post" inverted position="top center">
                <div slot="trigger" style="cursor: pointer;" @click="likeModalOpen = true" id="likeCount">{{likeCount ? likeCount : 0}}</div>
            </SuiPopup>
        </div>
        <div style="text-align: center; color: gray; margin-bottom: 20px;" v-if="liked">
            You have liked this post
        </div>
        <div v-if="likeModalOpen">
            <LikeModal :blogId="blogId" :blogLikes="blogLikes" :likeModalOpen="likeModalOpen" :closeLikeModal="closeLikeModal" />
        </div>
    </div>
</template>

<script>
import likeOutline from "../../../static/Icons/DisplayBlogIcons/likeOutline.svg"
import likeIcon from "../../../static/Icons/DisplayBlogIcons/like.svg"

import LikeModal from "./LikeModal"
//import axios from "axios"

export default {
    name: "Like",
    components: {LikeModal},
    props: ["blogId", "blogLikes", "liked", "alterLike", "likeCount"],
    data(){
        return {
            likeOutline,
            likeIcon,
            //liked: false,
            likeModalOpen: false
        }
    },
    methods: {
        closeLikeModal(){
            this.likeModalOpen = false
        }
    },
    created(){
        
    },
    updated(){
        console.log(this.liked, "liked")
    }
}
</script>

<style scoped>
#likeCount{
    cursor: pointer;
    font-size: 19px;
}

#likeCount:hover{
    text-decoration: underline;
}
</style>