<template>
    <div>
        <div style="display: flex; align-items: center; flex-flow: row wrap;">
            <div style="" class="image-display">            
                <SuiMessage v-if="!imageUrl" style="height: 100%; margin: 0px; display: flex; flex-direction: column; align-items: center; justify-content: center;">                    
                    <SuiImage :src="coverPhotoIcon" size="mini" />
                    <div style="font-weight: 700; font-size: 15px; margin: 5px 0px;">
                        No Cover Photo Uploaded
                    </div>
                    <div style="text-align: center; font-size: 12px; color: gray;">
                        This will show up as a thumbnail in the blog listing page.</div>
                </SuiMessage>
                <div v-if="!!imageUrl && !uploadError" style="position: relative; display: flex; flex-direction: column; align-items: center;">                    
                    <SuiImage :src="imageUrl" style=" width: 100%; height: 172px; padding: 5px; border: 1px solid rgba(34,36,38,.15);" />
                    <SuiPopup content="Remove Image" inverted position="bottom right" >
                        <SuiImage slot="trigger" :src="deleteIcon" @click.native="deleteImage"
                            style="cursor: pointer; position: absolute; top: 12px; right: 12px; width: 25px;" />
                    </SuiPopup>
                </div>
            </div>

            <div class="image-upload">
                <div id="uploader-div">
                    <input type="file" ref="imageInput" id="uploader-input" accept="image/*" 
                        @change="readURL($event.target.files)" />
                    <SuiImage :src="imageUploadIcon" style="width: 45px;" />
                    <span id="uploader-text">Drop your Image here</span>
                    <span style="color: red; font-weight: 700;" v-if="uploadError">Invalid File Uploaded</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
import coverPhotoIcon from "../../../static/Icons/CreateBlogIcons/coverPhotoIcon.svg"
import imageUploadIcon from "../../../static/Icons/ProfileIcons/profileImageUploadIcon.svg"
import deleteIcon from "../../../static/Icons/delete.svg"

export default {
    name: "CoverPicUpload",
    props: ["addCoverPicture", "coverPicUrl", "deleteCoverPicUrl"],
    data() {
        return {
            imageUrl: this.coverPicUrl || null,
            uploadError: false,

            coverPhotoIcon,
            imageUploadIcon,
            deleteIcon
        }
    },
    methods: {
        readURL(files) {
            if (files && files[0]) {
                const that1 = this
                this.imageUrl = URL.createObjectURL(files[0])
                const img = new Image()
                img.onload = function(e, that2=that1) {
                    that2.uploadError = false
                    that2.addCoverPicture(files[0])
                    that2.imageUrl = URL.createObjectURL(files[0])
                }
                img.onerror = function(e, that2=that1) {
                    // doesn't exist or error loading
                    console.log("doesnt support", that2)
                    that2.uploadError = true
                    that2.addCoverPicture(null)
                    that2.imageUrl = ""
                    that2.$refs.imageInput ? that2.$refs.imageInput.value = "" : null
                };
                img.src = this.imageUrl;
            }
        },
        deleteImage(){
            this.addCoverPicture(null)
            this.imageUrl = ""
            this.deleteCoverPicUrl()
            this.uploadError = false
            this.$refs.imageInput ? this.$refs.imageInput.value = "" : null
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
    }
}
</script>

<style scoped>

#uploader-div{
    height: 172px;
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
    margin-bottom: 5px;
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

.image-display{
    max-width: 350px;
    padding: 14px;
    height: 200px;
}
.image-upload{
    max-width: 350px;
    padding: 14px;
    height: 200px;
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
    .image-display{
        width: 50%;
    }
    .image-upload{
        width: 50%;
    }
}

/*BELOW 767 PX*/
@media only screen and (max-width: 767px){
    .image-display{
        width: 100%;
    }
    .image-upload{
        width: 100%;
    }
}

/*ABOVE 510 PX*/
@media only screen and (min-width: 510px){

}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){

}
</style>