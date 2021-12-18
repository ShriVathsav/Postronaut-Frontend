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
                                No Profile Image Uploaded
                            </div>
                        </div>
                    </SuiMessage>
                    <div v-if="!!imageUrl && errorPresence !== 2" style="display: flex; flex-direction: column; align-items: center;">
                        <div style="border: 2px solid rgba(34,36,38,.15);  margin-bottom: 7px;">
                            <SuiImage :src="imageUrl" style="width: 180px; height: 180px; padding: 5px;" />
                        </div>
                    </div>
                    <SuiHeader dividing style="font-size: 16px;" >Add / Change Profile Image</SuiHeader>
                    <div>
                        <div id="uploader-div">
                            <input type="file" ref="imageInput" id="uploader-input" accept="image/*" 
                                @change="readURL($event.target.files)" />
                            <SuiImage :src="uploadImageIcon" style="width: 45px;" />
                            <span id="uploader-text">Drop your Image here</span>
                        </div>
                    </div>
                    <div :class="'info-message ' + addMessageClass()" v-if="errorPresence !== -1" >
                        <div v-if="errorPresence === 1">
                            File Saved {{ image.name }}
                        </div>
                        <div v-if="errorPresence === 2" style="text-align: center;">
                            Invalid File Uploaded. Please upload an Image.
                        </div>
                    </div>
                </SuiModalDescription>
            </SuiModalContent>
            <SuiModalActions>
                <SuiButton icon="delete" negative @click.native="cancelUpload">Close</SuiButton>
                <SuiButton :disabled="!image || !imageUrl" icon="upload" positive 
                    :loading="loading" @click.native="uploadImage">Upload</SuiButton>
            </SuiModalActions>
        </SuiModal>
    </div>
</template>

<script>
import axios from "axios"
import uploadImageIcon from "../../../static/Icons/ProfileIcons/imageUploadIcon.svg"
import profileImageUploadIcon from "../../../static/Icons/ProfileIcons/profileImageUploadIcon.svg"
import deleteIcon from "../../../static/Icons/delete.svg"

export default {
    name: "ProfileImageModal",
    props: ["profileModalOpen", "openProfileModal", "profilePicUrl", "alterProfilePic"],
    data() {
        return {
            image: null,
            imageUrl: this.profilePicUrl,
            errorPresence: -1,
            uploadError: true,
            loading: false,

            uploadImageIcon,
            profileImageUploadIcon,
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

                    that2.errorPresence = 1
                    that2.image = files[0]
                    that2.imageUrl = URL.createObjectURL(files[0])
                }
                img.onerror = function(e, that2=that1) {
                    // doesn't exist or error loading
                    console.log("doesnt support", that2)
                    that2.errorPresence = 2
                    that2.image = null
                    that2.imageUrl = null
                    that2.$refs.imageInput ? that2.$refs.imageInput.value = "" : null
                };
                img.src = this.imageUrl;
            }
        },
        deleteImage(){
            this.image = null
            this.imageUrl = this.profilePicUrl
            this.errorPresence = -1
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
        addMessageClass(){
            if(this.errorPresence === 1){
                return "info"
            } else if(this.errorPresence === 2){
                return "error"
            } else {
                return ""
            }
        }
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