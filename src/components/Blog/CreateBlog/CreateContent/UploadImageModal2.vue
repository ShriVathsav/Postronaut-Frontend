<template>
    <div>
        <SuiModal :open="imageUploaderOpen" size="tiny" >
            <SuiModalHeader><SuiIcon name="upload" style="margin-right: 11px;"/>Upload Image</SuiModalHeader>
            <SuiModalContent>
                <SuiModalDescription>
                    <div style="display: flex; margin-bottom: 21px;">
                        <div style="width: 50%; text-align: center;">
                            <SuiCheckbox label="From Computer" radio :value="imageSourceEnum.LOCAL" v-model="imageSource" />
                        </div>
                        <div style="width: 50%; text-align: center;">
                            <SuiCheckbox label="Via Link" radio :value="imageSourceEnum.LINK" v-model="imageSource" />      
                        </div>
                    </div>
                    <div v-if="imageSource === imageSourceEnum.LINK" >
                        <SuiForm>
                            <SuiFormField required>
                                <label>Image Url</label>
                                <SuiInput placeholder="Enter the url for the image" v-model="uploadUrl" 
                                    @change="(e) => handleLinkImageUpload(e.target.value)"/>
                                <div v-if="uploadError"><SuiLabel basic color="red" pointing>Please enter a url for Image</SuiLabel></div>
                            </SuiFormField>
                        </SuiForm>
                    </div>
                    <div v-if="imageSource === imageSourceEnum.LOCAL">
                        <div id="uploader-div">
                            <input type="file" ref="imageInput" id="uploader-input" accept="image/*" 
                                @change="readURL($event.target.files)" />
                            <span id="uploader-text">Drop your Images here</span>
                        </div>
                        <div v-if="uploadError"><SuiLabel basic color="red" pointing>Please Upload an Image</SuiLabel></div>
                    </div>
                    <div class="info-message info" v-if="uploadSuccess === 1 && imageSource === imageSourceEnum.LOCAL" >
                        <div style="width: 50%;">
                            <h5 is="sui-header" style="font-size: 12px; margin-bottom: 4px;">File Uploaded Successfully</h5>
                            {{ image.name }}
                        </div>
                        <div style="width: 50%;">
                            <SuiImage :src="deleteIcon" @click.native="cancelUpload"
                                style="cursor: pointer; float: right; height: 22px;"/>
                        </div>
                    </div>
                    <div class="info-message error" v-if="uploadSuccess === 0" >
                        <div>
                            {{ errorMessage }}
                        </div>
                    </div>
                </SuiModalDescription>
            </SuiModalContent>
            <SuiModalActions>
                <SuiButton icon="cancel" negative 
                    @click.native="() => {cancelUpload(); alterState('imageUploaderOpen', !imageUploaderOpen)}">Cancel</SuiButton>
                <SuiButton icon="check" positive @click.native="uploadImage">Save</SuiButton>
            </SuiModalActions>
        </SuiModal>
    </div>
</template>

<script>
import {v4 as uuidv4} from "uuid"
import deleteIcon from "../../../../static/Icons/delete.svg"
import axios from "axios"
import {imageSourceEnum} from "../../BlogModels/Enums"
import ImageItem from "../../BlogModels/ImageItem"

export default {
    name: "UploadImageModal",
    props: ["imageUploaderOpen", "alterState", "addImageList", "imageTemplate",
        "addItemBlogObjectList"],
    data(){
        return {
            image: {},
            imageHeight: 0,
            imageWidth: 0,
            imageUrl: "",
            uploadSuccess: -1,
            deleteIcon,
            imageSource: imageSourceEnum.LOCAL,
            uploadUrl: "",
            uploadError: false,
            errorMessage: "",
            databaseId: 0,
            imageSourceEnum
        }
    },
    methods: {
        handleImageWidth(e){
            const values = e.target.value > 20 ? 30 : 40
            this.imageWidth = values
            //e.target.value = values
            this.$refs.width.value = values
        },
        handleImageHeight(e, stateObj, min, max){
            const val = e.target.value
            this[stateObj] = val !== "" ? (validateNumeric(val, min, max) ? val : this[stateObj]) : ""
            this.$refs[stateObj].value = this[stateObj]
        },
        numericInputChange(e, stateObj, min, max){
            const val = e.target.value
            this[stateObj] = val !== "" ? (validateNumeric(val, 1, 20) ? val : this[stateObj]) : ""
            this.$refs[stateObj].value = this[stateObj]
        },
        textInputChange(e, stateObj){
            const val = e.target.value
            this[stateObj] = val !== "" ? removeSpacesFromTextInput(val) : ''
            this.$refs[stateObj].value = this[stateObj]
        },
        addImageContent2(){
            const createImageTemplate = this.imageTemplate()
            createImageTemplate.id = uuidv4()
            createImageTemplate.blob = this.image
            createImageTemplate.databaseId = this.databaseId
            createImageTemplate.imageWidth = this.imageWidth
            //createImageTemplate.imageHeight = this.imageHeight
            createImageTemplate.imageSource = this.imageSource
            console.log(this.imageUrl, 'PRINTINH IMAGE URL')
            createImageTemplate.content = this.imageSource === imageSourceEnum.LOCAL ? this.imageUrl : this.uploadUrl
            console.log(this.imageHeight, this.imageWidth, "DIMENSIONS")
            return createImageTemplate
        },
        addImageContent() {
            return new ImageItem(this.databaseId, this.imageSource === imageSourceEnum.LOCAL ? this.imageUrl : this.uploadUrl, 
                this.imageWidth, this.imageSource, this.image)
        },
        readURL(files) {
            if (files && files[0]) {
                this.image = files[0]
                this.imageUrl = URL.createObjectURL(files[0])
                var reader = new FileReader();
                const that = this
                reader.onload = function (e, that1=that) {
                    var img = new Image;
                    img.onload = function(e, that2=that1) {
                        console.log("The dimensions of the image is " + img.width + "px. "+ img.height + "px.")
                        //that2.imageHeight = img.height
                        that2.imageWidth = img.width
                        that2.uploadSuccess = 1
                        that2.uploadError = false
                    }
                    img.onerror = function() {
                        // doesn't exist or error loading
                        console.log("doesnt support")
                        that1.errorMessage = "Invalid File Uploaded"
                        that1.uploadSuccess = 0
                    };
                    img.src = reader.result;
                }
                reader.readAsDataURL(files[0]);
            }
        },
        handleBlobImageUpload(){

        },
        handleLinkImageUpload(val){
            console.log(this.imageUrl)
            const img = new Image();
            img.onload = () => {
                console.log("no IN UIPLOAIDNG")
                const height = img.height
                const width = img.width
                //this.imageHeight = img.height
                this.imageWidth = img.width
                this.uploadSuccess = 1
                this.uploadError = false
            // code here to use the dimensions
            }
            
            img.onerror = () => {
                // doesn't exist or error loading
                console.log("ERROR IN UIPLOAIDNG")
                this.errorMessage = "Invalid File Uploaded"
                this.uploadSuccess = 0
            }

            img.src = this.uploadUrl;
        },
        cancelUpload(){
            this.image = {}
            //this.imageHeight = 0
            this.imageWidth = 0
            this.$refs.imageInput ? this.$refs.imageInput.value = "" : null
            this.uploadSuccess = -1
            this.uploadUrl = ""
            this.uploadError = false
        },
        uploadImage(){
            if((this.image.name === undefined && this.imageSource === imageSourceEnum.LOCAL) || (this.uploadUrl === "" && this.imageSource === imageSourceEnum.LINK)){
                console.log("IN FIRST")
                this.uploadError = true
                this.errorMessage = "Please upload an image"
            }else if(this.uploadSuccess){
                console.log("IN SECXOND")
                this.uploadImageToS3()
            }
        },
        uploadImageToS3(){
            if(this.imageSource === imageSourceEnum.LOCAL){
                let data = new FormData()
                data.append('file', this.image)
                axios.post("/image/create", data).then(res => {
                    console.log(res, "IMAGE UPLOADED SUCCESSFIULLY")
                    this.imageUrl = res.data.imageUrl
                    this.databaseId = res.data.id
                    this.finishUpload()
                }).catch(err => console.log(err))
            }else {
                this.finishUpload()
            }
        },
        finishUpload(){
            const imageItem = this.addImageContent()
            this.addImageList(this.databaseId)
            this.addItemBlogObjectList(imageItem)
            this.alterState('imageUploaderOpen', !this.imageUploaderOpen)
            this.resetState()
        },
        resetState(){
            this.image = {},
            //this.imageHeight = 0,
            this.imageWidth = 0,
            this.imageUrl = "",
            this.uploadSuccess = -1,
            this.imageSource = imageSourceEnum.LOCAL,
            this.uploadUrl = "",
            this.uploadError = false,
            this.errorMessage = ""
        }
    },
    computed: {
        heights() {
            return {
                get: function() {
                    return this.imageHeight
                },
                set: function(val) {
                    this.imageHeight = val > 20 ? 30 : 40;
                    this.$refs.height.value = val > 20 ? 30 : 40
                    // If necessary, also copy val into an external variable here
                }
            }
        },
        onImageSourceChange(){
            if(this.imageSource === imageSourceEnum.LOCAL){
                this.uploadUrl = ""
            }
            else if(this.imageSource === imageSourceEnum.LINK){
                this.image = {}
            }
        },
        onModalClose(){
            if(!this.imageUploaderOpen){
                this.image = {}
                this.$refs.imageInput.value = ""
                this.uploadUrl = ""
            }
        }
    },
    updated(){
        //console.log(this.imageHeight, "width")
        //console.log(this.image, "IM PRINTINMG IMAGE")
        //console.log(this.uploadSuccess, "UPLOAD SUCCESS")
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

.info{
    border: 1px solid #2c662d;
    background-color: #deffc3;
    color: #2c662d;
}

.error{
    border: 1px solid #9f3a38;
    background-color: #ffdec3;
    color: #9f3a38;
}
</style>