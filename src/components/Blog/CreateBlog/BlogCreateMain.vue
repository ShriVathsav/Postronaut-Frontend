<template>
<div style="margin-top: 20px;">
    <div :style="step === 1 ? '' : 'display: none;'">
        <CreateBlog :blogObjectList="blogObjectList" :imagesList="imagesList" :coverPicUrl="coverPicUrl"
            :blogSubmitHandler="submitAgainHandler" :alterStep="alterStep" :imageBlobList="imageBlobList"
            :alterStateParent="alterState" :deletedImages="[]" :inMemoryImages="inMemoryImages"
            :uploadedImages="uploadedImages" />
    </div>
    <div :style="step === 2 ? '' : 'display: none;'">
        <PublishBlog :blogSubmitHandler="uploadImagesAndSubmit" :alterStep="alterStep" :deleteCoverPicUrl="deleteCoverPicUrl"
            :initialTopicList="[]" :blogEditState="editBlogEnum.CREATE" :blog="{}" />
    </div>
    <div :style="step === 3 ? '' : 'display: none;'">
        <InfoPage message="Post has been created successfully" :icon="blogSuccessIcon" />
    </div>
</div>
</template>

<script>
import CreateBlog from "./CreateBlog.vue"
import PublishBlog from "./PublishBlog.vue"
import InfoPage from "../../UI/InfoPage.vue"
import axios from "axios"
//import {v4 as uuidv4} from "uuid"
//import {textTemplate, titleTemplate} from "../../Utility/Utility"
import {editBlogEnum} from "../BlogModels/Enums"
import Title from "../BlogModels/Title"
import Text from "../BlogModels/Text"
import AWS from 'aws-sdk'
require("dotenv").config()
import blogSuccessIcon from "../../../static/Icons/AuthIcons/createPostIcon.svg"

import jsonFormData from'json-form-data'

export default {
    name: "BlogCreateMain",
    components: {CreateBlog, PublishBlog, InfoPage},
    data(){
        return {
            s3Bucket: process.env.VUE_APP_BUCKET_NAME,
            region: process.env.VUE_APP_BUCKET_REGION,
            myBucket: new AWS.S3({
                params: { Bucket: this.s3Bucket},
                signatureVersion: 'v4',
                region: this.region
            }),
            profileId: this.$store.state.auth.user.id,
            blogObjectList: [],
            imagesList: [],
            imageBlobList: {},
            uploadedImages: {},
            inMemoryImages: {},
            coverPicUrl: null,
            uploadedObjectKeysArray: [],
            step: 1,
            editBlogEnum,

            blogSuccessIcon
        }
    },
    methods: {
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
        async uploadImagesAndSubmit(selectedTopicList, coverPhoto) {
            console.log("UPLOADING IMAGE", this.imageBlobList)
            for (const [fileName, file] of Object.entries(this.imageBlobList)) {
                console.log(file, fileName)
                await this.uploadToS3(file, fileName)
                console.log(this.uploadedObjectKeysArray, fileName, "UPLOADED OBJECT KEYS ARRAY WHILE ITERATING")
            }    
            const imagesList = [...this.uploadedObjectKeysArray]
            console.log(imagesList, "FINAL IMAGES LIST")
            this.submitAgainHandler(selectedTopicList, coverPhoto, imagesList)
        },
        prepareSearchableTextContent(){
            let combinedStr = ""
            for(const i of this.blogObjectList){
                if(i.textContent){
                    combinedStr += i.textContent
                }
            }
            return combinedStr
        },
        submitAgainHandler(selectedTopicList, coverPhoto, imagesList){
            console.log(imagesList, 'IMAGWES LIST')
            if(selectedTopicList.length !== 0){
                const jsd = JSON.stringify(this.blogObjectList)
                //console.log(jsd, typeof jsd)
                const jst = JSON.parse(jsd)
                console.log(typeof jst)
                const requ = {
                    blog: {
                        blogTitle: this.blogObjectList[0].content,
                        blogContent: jsd,
                        textContent: this.prepareSearchableTextContent(),
                        blogStatus: "saved",
                        imagesList: JSON.stringify(imagesList),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    topicList: selectedTopicList,
                    //coverPhoto
                }

                let data = new FormData()
                data.append('blogString', JSON.stringify(requ))
                data.append('coverPhoto', coverPhoto)

                /*for(const i of data.entries()){
                    console.log(i[0], i[1], "form data value")
                }*/

                console.log(coverPhoto, "COVER PHOTO FROM CREATE BLOG MAIN")
                axios.post(`/blog/create/${this.profileId}`, data).then(res => {
                    console.log(res)
                    this.step = 3
                    this.blogObjectList = []
                    this.coverPicUrl = null
                }).catch(err => {
                    console.log(err.response, err)
                })
            }
        },
        deleteCoverPicUrl(obj) {
            console.log(obj)
            this.coverPicUrl = null
        },
        alterStep(val){
            this.step = val
        },
        formDataConvert(formFields) {
            const options = {
                initialFormData: new FormData(),
                showLeafArrayIndexes: true,
                includeNullValues: false,
                mapping: function(value) {
                    if (typeof value === 'boolean') {
                        return +value ? '1': '0';
                    }
                    return value;
                }
            };
            const formData = jsonFormData({blogString: formFields}, options);
            for (var pair of formData.entries()) {
                console.log(pair[0]+ ', ' + pair[1]); 
            }
            return formData
        },
        alterState(state, value){
            this[state] = value
        }
    },
    created(){
        this.blogObjectList.push(new Title(), new Text())
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

</style>