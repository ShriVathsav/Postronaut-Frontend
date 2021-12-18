<template>
    <div style="margin-top: 30px;">
        <div v-if="!loading">
            <div v-if="blogNotFound">
                <PageNotFound />
            </div>
            <div v-else>
                <div v-if="authorized">
                    <div :style="step === 1 ? '' : 'display: none;'">
                        <CreateBlog :blogObjectList="blogObjectList" :uploadedImages="uploadedImages" 
                            :coverPicUrl="coverPicUrl" :inMemoryImages="inMemoryImages" :alterStateParent="alterState"
                            :blogSubmitHandler="submitAgainHandler" :alterStep="alterStep"
                            :deletedImages='deletedImages' :imageBlobList="imageBlobList" />
                    </div>
                    <div :style="step === 2 ? '' : 'display: none;'">
                        <PublishBlog :blogSubmitHandler="uploadImagesAndSubmit" :alterStep="alterStep" :coverPicUrl="coverPicUrl"
                            :initialTopicList="initialTopicList" :blog="blog" :blogEditState="editBlogEnum.UPDATE" 
                            :deleteCoverPicUrl="deleteCoverPicUrl" />
                    </div>
                    <div :style="step === 3 ? '' : 'display: none;'">
                        <InfoPage message="Post has been updated successfully" :icon="blogSuccessIcon" />
                    </div>
                </div> 
                <div v-else>
                    <Unauthorized />
                </div>
            </div>
        </div>
        <div v-else>
            <FullPageLoader />
        </div>
    </div>
</template>

<script>
import CreateBlog from "./CreateBlog.vue"
import PublishBlog from "./PublishBlog.vue"
import Unauthorized from "../../InfoPages/Unauthorized"
import PageNotFound from "../../InfoPages/PageNotFound"
import FullPageLoader from "../../UI/FullPageLoader"
import axios from "axios"
import {editBlogEnum, blogContentEnum} from "../BlogModels/Enums"
import InfoPage from "../../UI/InfoPage.vue"

import Text from "../BlogModels/Text"
import Heading from "../BlogModels/Heading"
import ImageItem from "../BlogModels/ImageItem"
import Blockquote from "../BlogModels/Blockquote"
import Title from "../BlogModels/Title"
import AWS from "aws-sdk"

import blogSuccessIcon from "../../../static/Icons/AuthIcons/createPostIcon.svg"

export default {
    name: "BlogUpdateMain",
    components: {CreateBlog, Unauthorized, PublishBlog, InfoPage, PageNotFound, FullPageLoader},
    data(){
        return {
            s3Bucket: process.env.VUE_APP_BUCKET_NAME,
            region: process.env.VUE_APP_BUCKET_REGION,
            myBucket: new AWS.S3({
                params: { Bucket: process.env.VUE_APP_BUCKET_NAME},
                signatureVersion: 'v4',
                region: process.env.VUE_APP_BUCKET_REGION
            }),
            blog: null,
            blogObjectList: [],
            initialTopicList: [],
            uploadedObjectKeysArray: [],
            uploadedImages: {},
            inMemoryImages: {},
            imageBlobList: {},
            deletedImages: [],
            id: this.$route.params.id,
            coverPicUrl: null,
            blogAuthorId: -1,
            authorized: false,
            step: 1,
            editBlogEnum,
            loading: true,
            blogNotFound: false,

            blogSuccessIcon
        }
    },
    created(){
        axios.get(`/blog/${this.$route.params.id}`).then(res => {
            console.log(res)            
            if(res.data.profile.id === this.$store.state.auth.user.id){
                this.setBlogState(res)
                this.authorized = true                
            } else {
                this.authorized = false
                this.loading = false
            }
        }).catch(err => {
            console.log(err.response)
            this.loading = false
            if(err.response.status === 404){
                this.blogNotFound = true
            }
        })
    },
    methods: {
        alterState(state, value){
            this[state] = value
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
                this.uploadedImages = imagesList
            }
            this.blog = res.data
            this.blogObjectList = this.prepareBlogContent(JSON.parse(res.data.blogContent))
            this.coverPicUrl = res.data.coverPicUrl
            this.initialTopicList = res.data.topic
            this.loading = false
        },
        async uploadToS3(file, fileName){
            const params = {
                Body: file,
                Bucket: this.s3Bucket,
                Key: fileName,
                ContentType: file.type
            }                
            console.log("UPLOADING TO S3")
            try{
                const res = await this.myBucket.putObject(params).promise()
                console.log(res, "RESPONSE AFTER UPLOAD")
                const objectKeysArray = [...this.uploadedObjectKeysArray]
                objectKeysArray.push(fileName)
                this.uploadedObjectKeysArray = objectKeysArray
            } catch(err){
                this.error = true
                this.errorMessage = "An error occured"
                console.log(err, err.response)
                return
            }
            //return objectKeysArray
            //let imagesList = this.uploadImageToS3()
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
        prepareImagesList() {
            const uploadedImagesCopy = {...this.uploadedImages}
            console.log(this.uploadedImages, this.deletedImages, 'OUTPUT FROM PREPARE IMAGES LIST 11')
            for (const image of this.deletedImages) {
                delete uploadedImagesCopy[image]
            }
            console.log(uploadedImagesCopy, 'OUTPUT FROM PREPARE IMAGES LIST')
            return uploadedImagesCopy
        },
        async uploadImagesAndSubmit(selectedTopicList, coverPhoto) {
            console.log("UPLOADING IMAGE", this.imageBlobList)
            for (const [fileName, file] of Object.entries(this.imageBlobList)) {
                console.log(file, fileName)
                await this.uploadToS3(file, fileName)
                console.log(this.uploadedObjectKeysArray, fileName, "UPLOADED OBJECT KEYS ARRAY WHILE ITERATING")
            }    
            const imagesList = [...Object.keys(this.prepareImagesList()), ...this.uploadedObjectKeysArray]
            console.log(imagesList, "FINAL IMAGES LIST")
            this.submitAgainHandler(selectedTopicList, coverPhoto, imagesList)
        },
        deleteCoverPicUrl(obj) {
            console.log(obj)
            this.coverPicUrl = null
        },
        prepareBlogContent(blogObjectList) {
            let arr = []
            for(let item of blogObjectList){
                if(item.type === blogContentEnum.TEXT){
                    console.log(item, "TEXT TEXT")
                    arr.push(new Text(item.id, item.content, item.textContent))
                } else if(item.type === blogContentEnum.HEADING){
                    console.log(item, "HEADING")
                    arr.push(new Heading(item.id, item.content, item.textContent))
                } else if(item.type === blogContentEnum.IMAGE){                    
                    console.log(item, "IMAGE")
                    arr.push(new ImageItem(item.content, item.imageWidth, null, "UPLOADED", 
                        item.id, item.borderWidth, item.borderColor, item.borderStyle, item.spaceAround,
                        item.alternativeText, item.showCaptions, item.captions))
                } else if(item.type === blogContentEnum.BLOCKQUOTE){                    
                    console.log(item, "BLOCKQUOTE")
                    arr.push(new Blockquote(item.id, item.color, item.backgroundColor, item.padding, 
                        item.borderThickness, item.content, item.textContent))
                } else if(item.type === blogContentEnum.TITLE){
                    console.log(item, "TITLE")
                    arr.push(new Title(item.id, item.content, item.textContent))
                }
            }
            return arr
        },
        prepareSearchableTextContent(){
            let combinedStr = ""
            for(const i of this.blogObjectList){
                if(i.textContent){
                    combinedStr += i.textContent + " "
                }
            }
            return combinedStr
        },
        submitAgainHandler(selectedTopicList, coverPhoto, imagesList){
            if(selectedTopicList.length === 0){
                const jsd = JSON.stringify(this.blogObjectList)
                //console.log(jsd, typeof jsd)
                const jst = JSON.parse(jsd)
                console.log(typeof jst)
                console.log(imagesList, "IMAGES LIST FINAL")
                const requ = {
                    blog: {
                        blogTitle: this.blogObjectList[0].content,
                        blogContent: jsd,
                        textContent: this.prepareSearchableTextContent(),
                        coverPicUrl: this.coverPicUrl,
                        blogStatus: "published",
                        imagesList: JSON.stringify(imagesList),
                        updatedAt: new Date()
                    },
                    topicList: selectedTopicList
                }

                let data = new FormData()
                data.append('blogString', JSON.stringify(requ))
                data.append('coverPhoto', coverPhoto)

                axios.put(`/blog/${this.blog.id}`, data).then(res => {
                    console.log(res)
                    this.step = 3
                    this.blogObjectList = []
                    this.coverPicUrl = null
                    this.initialTopicList = []
                }).catch(err => {
                    console.log(err.response, err)
                })
            }
        },
        alterStep(val){
            this.step = val
        },
    },
    beforeCreate(){
        AWS.config.update({
            accessKeyId: process.env.VUE_APP_ACCESS_KEY,
            secretAccessKey: process.env.VUE_APP_SECRET_ACCESS_KEY
        })
    },
    updated(){
        console.log(this.uploadedImages, this.deletedImages, "PRINTING WHILE DELETING IMAGE 2")
    }
}
</script>

<style scoped>

</style>