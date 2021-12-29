<template>
    <div>
        <SuiModal :open="profileModalOpen" size="tiny" >
            <SuiModalHeader><SuiIcon name="cloud upload" style="margin-right: 11px;"/>Profile Image</SuiModalHeader>
            <SuiModalContent scrolling>
                <SuiModalDescription>
                    <!--SuiHeader dividing style="font-size: 16px;">Profile Image</SuiHeader-->
                    <SuiMessage v-if="!imageUrl">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <SuiImage :src="profileImageUploadIcon" size="mini" style="margin-bottom: 5px;" />
                            <div style="font-weight: 700; font-size: 15px;">
                                No Profile Image
                            </div>
                        </div>
                    </SuiMessage>
                    <div v-if="!!imageUrl && !uploadError" style="display: flex; flex-direction: column; align-items: center;">
                        <div style="border: 2px solid rgba(34,36,38,.15);  margin-bottom: 7px;">
                            <SuiImage :src="imageUrl" style="width: 180px; height: 180px; padding: 5px;" />
                        </div>
                        <div v-if="identity() === 1" >
                            <SuiButton icon="trash alternate" negative @click.native="deleteProfileImage" 
                                :loading="deleteLoading" style="margin-top: 10px; margin-bottom: 20px;" >Remove Profile Image</SuiButton>
                        </div>
                    </div>
                    <div v-if="identity() === 1" >
                        <SuiHeader dividing style="font-size: 16px;" >Add / Change Profile Image</SuiHeader>
                        <div>
                            <div id="uploader-div">
                                <input type="file" ref="imageInput" id="uploader-input" accept="image/*"
                                    @change="readURL($event.target.files)" />
                                <SuiImage :src="uploadImageIcon" style="width: 45px;" />
                                <span id="uploader-text">Drop your Image here</span>
                            </div>
                        </div>
                        <div :class="'info-message error'" v-if="uploadError" >
                            <div style="text-align: center;">
                                {{errorMessage}}
                            </div>
                        </div>
                    </div>
                </SuiModalDescription>
            </SuiModalContent>
            <SuiModalActions>
                <SuiButton icon="delete" negative @click.native="cancelUpload" :disabled="loading" >
                    Close</SuiButton>
                <SuiButton :disabled="!image || !imageUrl" icon="upload" positive v-if="identity() === 1"
                    :loading="loading" @click.native="updateProfileImage">Upload</SuiButton>
            </SuiModalActions>
        </SuiModal>
    </div>
</template>

<script>
import axios from "axios"
import {v4 as uuidv4} from "uuid"
import uploadImageIcon from "../../../static/Icons/ProfileIcons/imageUploadIcon.svg"
import profileImageUploadIcon from "../../../static/Icons/ProfileIcons/profileImageUploadIcon.svg"
import deleteIcon from "../../../static/Icons/delete.svg"
import AWS from 'aws-sdk'
require("dotenv").config()

export default {
    name: "ProfileImageModal",
    props: ["profileModalOpen", "openProfileModal", "profilePicUrl", "alterProfilePic", "profile"],
    data() {
        return {
            s3Bucket: process.env.VUE_APP_BUCKET_NAME,
            region: process.env.VUE_APP_BUCKET_REGION,
            myBucket: new AWS.S3({
                params: { Bucket: process.env.VUE_APP_BUCKET_NAME},
                signatureVersion: 'v4',
                region: process.env.VUE_APP_BUCKET_REGION
            }),
            image: null,
            imageUrl: this.profilePicUrl,
            errorMessage: "",
            uploadError: false,
            loading: false,
            deleteLoading: false,

            uploadImageIcon,
            profileImageUploadIcon,
            deleteIcon
        }
    },
    methods: {
        identity(){
            return this.$store.state.auth.user.id == this.$route.params.id ? 1 : 2
        },
        async uploadImageToS3() {
            const file = this.image
            const objectKey = uuidv4() + " - " + file.name
            const params = {                    
                Body: file,
                Bucket: this.s3Bucket,
                Key: objectKey,
                ContentType: file.type
            }                
            try{
                await this.myBucket.putObject(params).promise()
                console.log("UPLOADED")
            } catch(err){
                this.uploadError = true
                this.errorMessage = "An error occured"
                console.log(err, err.response)
                return
            }
            return objectKey
        },
        generatePresignedUrl(key){
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
                    return
                }
                console.log(url)
                this.alterProfilePic(url)
                this.$store.dispatch("auth/changeProfileImage", url)
            })
        },
        async updateProfileImage(){
            this.loading = true
            const url = await this.uploadImageToS3()
            console.log(url, this.$route.params.id, this.profile, "GENERATED URL")
            const profile = {...this.profile}
            profile.profilePicUrl = url
            axios.put(`/profile/${this.$route.params.id}`, profile).then(res => {
                console.log(res, "IMAGE UPLOADED SUCCESSFIULLY")
                this.generatePresignedUrl(res.data.profilePicUrl)
                this.loading = false
                this.openProfileModal()
            }).catch(err => {
                this.loading = false
                this.uploadError = true
                this.errorMessage = err.message
                console.log(err, err.response)
            })
        },
        deleteProfileImage(){
            this.deleteLoading = true
            const profile = {...this.profile}
            profile.profilePicUrl = ""
            axios.put(`/profile/${this.$route.params.id}`, profile).then(res => {
                console.log(res, "IMAGE UPLOADED SUCCESSFIULLY")
                this.deleteLoading = false
                this.alterProfilePic("")
                this.imageUrl = ""
                this.$store.dispatch("auth/changeProfileImage", "")
                this.openProfileModal()
            }).catch(err => {
                this.deleteLoading = false
                this.uploadError = true
                this.errorMessage = err.message
                console.log(err, err.response)
            })
        },
        readURL(files){
            const file = files ? files[0] : null
            if(file){
                var reader = new FileReader()
                reader.onload = () => {
                    var img = new Image;
                    img.onload = () => {
                        console.log("IMAGHE ON LOAD")
                        this.image = file
                        this.imageUrl = URL.createObjectURL(file)
                        this.uploadError = false
                        this.errorMessage = ""
                    }
                    img.onerror = () => {
                        // doesn't exist or error loading
                        console.log("doesnt support")
                        this.uploadError = true
                        this.errorMessage = "Invalid File Uploaded"
                        this.image = null
                        this.imageUrl = null
                        this.$refs.imageInput ? this.$refs.imageInput.value = "" : null
                    };
                    img.src = reader.result
                }
                reader.readAsDataURL(file);
            }
        },
        deleteImage(){
            this.image = null
            this.imageUrl = this.profilePicUrl
            this.uploadError = false
            this.errorMessage = ""
            this.$refs.imageInput ? this.$refs.imageInput.value = "" : null
        },
        cancelUpload(){
            this.deleteImage()
            this.openProfileModal()
        },
        uploadImage(){
            this.loading = true
            let data = new FormData()
            data.append('file', this.image)
            data.append('profileId', this.$store.state.auth.user.id)
            axios.post("/profile/uploadprofileimage", data).then(res => {
                console.log(res, "IMAGE UPLOADED SUCCESSFIULLY")
                this.alterProfilePic(res.data)
                this.$store.dispatch("auth/changeProfileImage", res.data)
                this.loading = false
                this.openProfileModal()
            }).catch(err => {
                console.log(err)
                this.loading = false
                this.openProfileModal()
            })
        },
    },
    created(){

    },
    updated(){
        console.log(this.image)
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

#uploader-div{
    height: 120px;
    border: 2px dashed gray;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    flex-direction: column;
}
#uploader-div:hover{
    background-color: #eee;
}
#uploader-input{
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0;
    cursor: pointer;
}
#uploader-text{
    color: gray;
    font-size: 16px;
}

.info-message{
    padding: 14px;
    margin-top: 10px;
    border-radius: .28571429rem;
    /*background-color: #21ba45;*/
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
}
.error{
    border: 1px solid #9f3a38;
    background-color: #ffdec3;
    color: #9f3a38;
}
.info{
    border: 1px solid #2c662d;
    background-color: #deffc3;
    color: #2c662d;
}

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
    
}

/*BELOW 767 PX*/
@media only screen and (max-width: 767px){
    
}

/*ABOVE 510 PX*/
@media only screen and (min-width: 510px){

}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){

}
</style>