<template>
    <SuiSegment style="cursor: pointer;" @click.native="$router.push(`/blog/${blog.id}`)">
        <SuiGrid>
            <SuiGridColumn id="card-image">
                <div style="height: 150px; border: 1px solid #E7E7E7;">
                    <SuiImage :src="coverImageUrl || emptyImage" style="width: 100%; height: 100%; max-height: 150px;" />
                </div>
            </SuiGridColumn>
            <SuiGridColumn id="card-content">
                <div style="padding-bottom: 14px;" class="flexClass">
                    <div style="width: 50%; display: flex; flex-direction: column;">
                        <div style="font-size: 9px; margin-bottom: 3px; color: gray;">
                            Last Edited on {{formatDate}} by
                        </div>
                        <div style="font-size: 13px; font-weight: 700;">
                            {{blog.profile.userName}}
                        </div>
                    </div>
                    <div style="width: 25%; padding: 0px 7px;" class="flexClass" >
                        <SuiImage :src="likeCard" size="mini" style="width: 28px;" class="iconclass" />
                        <div style="font-weight: 700; font-size: 12px;">{{blog.likeCount ? blog.likeCount : 0}}</div>
                    </div>
                    <div style="width: 25%;" class="flexClass" >
                        <SuiImage :src="commentCard" size="mini" style="width: 28px;" class="iconclass" />
                        <div style="font-weight: 700; font-size: 12px;">{{blog.commentCount ? blog.commentCount : 0}}</div>
                    </div>
                </div>
                <SuiDivider style="margin: 0px;"/>
                <SuiHeader style="margin-top: 14px;" v-html="blog.blogTitle">{{blog.blogTitle}}</SuiHeader>                
            </SuiGridColumn>
        </SuiGrid>
    </SuiSegment>
</template>

<script>
import emptyImage from "../../static/Images/emptyImage.png"
import commentCard from "../../static/Icons/DisplayBlogIcons/commentCard.svg"
import likeCard from "../../static/Icons/DisplayBlogIcons/likeCard.svg"
import moment from "moment"
import AWS from 'aws-sdk'
require("dotenv").config()

export default {
    name: "BlogCard",
    props: ["blog"],
    data(){
        return {
            s3Bucket: process.env.VUE_APP_BUCKET_NAME,
            region: process.env.VUE_APP_BUCKET_REGION,
            myBucket: new AWS.S3({
                params: { Bucket: process.env.VUE_APP_BUCKET_NAME},
                signatureVersion: 'v4',
                region: process.env.VUE_APP_BUCKET_REGION
            }),
            emptyImage,
            commentCard,
            coverImageUrl: "",
            likeCard
        }
    },
    computed: {
        formatDate(){
            return moment(this.blog.createdAt).format("Do MMM YYYY")
        }
    },
    created(){        
        const imagesList = JSON.parse(this.blog.imagesList)
        console.log(imagesList, this.blog)
        if(imagesList && imagesList.length !== 0){
            const myBucket = this.s3Bucket
            const myKey = imagesList[0]
            const signedUrlExpireSeconds = 60 * 5
            const params = {
                Bucket: myBucket,
                Key: myKey,
                Expires: signedUrlExpireSeconds
            }
            this.myBucket.getSignedUrl('getObject', params, (err, url) => {
                if (err) {
                    console.log(err)
                    return
                }
                //console.log(url)
                this.coverImageUrl = url
            })
        }
    },
    beforeCreate(){
        AWS.config.update({
            accessKeyId: process.env.VUE_APP_ACCESS_KEY,
            secretAccessKey: process.env.VUE_APP_SECRET_ACCESS_KEY
        })
    },
    updated(){
        console.log(this.blog, "BLOG FROM BLOG CARD")
    }
}
</script>

<style scoped>
.flexClass{
    display: flex;
    align-items: center;
    justify-content: center;
}
.iconclass{
    width: 28px;
    margin-right: 5px;
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
    #card-image{
        width: 40%;          
    }
    #card-content{
        width: 60%;
        padding: 14px 14px 14px 0px;
    }
}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){
    #card-image{
        width: 100%;
    }
    #card-content{
        width: 100%;
        padding: 0px 14px 14px 14px;
    }
}
</style>