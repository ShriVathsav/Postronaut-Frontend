<template>
    <div>
        <SuiModal :open="imageUploaderOpen" size="small" >
            <SuiModalHeader><SuiIcon name="upload" style="margin-right: 11px;"/>Upload Image</SuiModalHeader>
            <SuiModalContent>
                <SuiModalDescription>
                    <div style="margin-bottom: 20px;">
                        <div id="uploader-div">
                            <input type="file" ref="imageInput" id="uploader-input" accept="image/*" multiple
                                @change="generateUrlAndBlob($event.target.files)" />
                            <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
                                <img :src="imageUpload2Icon" style="height: 35px; width: 35px; margin-bottom: 10px;" />
                                <h3 style="margin: 0px 0px 5px 0px; color: #00b782; font-size: 20px;">Drag and drop to upload image!</h3>
                                <div class="color: gray; font-size: 14px;">...or click to select a file from your computer</div>
                            </div>
                        </div>
                        <div v-if="imageUrl" style="display: flex; align-items: center; justify-content: center; 
                                margin-top: 25px;" >
                            <img :src="imageUrl" style="height: 270px; width: 270px; border: 2px solid #6435c9; padding: 10px;" />
                        </div>
                        <div v-if="uploadError" style="padding: 14px; margin-top: 16px; background-color: #FF5252; color: white;" >
                            {{errorMessage}}
                        </div>
                    </div>
                </SuiModalDescription>
            </SuiModalContent>
            <SuiModalActions>
                <SuiButton icon="cancel" negative 
                    @click.native="() => {discardChanges(); alterState('imageUploaderOpen', !imageUploaderOpen)}">
                        Discard
                </SuiButton>
                <SuiButton icon="check" positive @click.native="saveImage" :disabled="!imageUrl && !image">Save</SuiButton>
            </SuiModalActions>
        </SuiModal>
    </div>
</template>

<script>
import deleteIcon from "../../../../static/Icons/delete.svg"
import {v4 as uuidv4} from "uuid"
import axios from "axios"
import ImageItem from "../../BlogModels/ImageItem"
import imageUpload2Icon from "../../../../static/Icons/ImageUploadIcons/imageUpload2.svg"
import uploadImageIcon from "../../../../static/Icons/ImageUploadIcons/upload-image.svg"

export default {
    name: "UploadImageModal",
    props: ["imageUploaderOpen", "alterState", "addImageList", "imageTemplate", "alterStateParent",
        "addItemBlogObjectList", 'imageBlobList', "inMemoryImages"],
    components: {},
    data(){
        return {
            image: null,
            imageHeight: 0,
            imageWidth: 0,
            imageUrl: "",
            imageFileName: "",
            deleteIcon,
            uploadError: false,
            errorMessage: "",
            databaseId: 5,
            uploadImageIcon,
            imageUpload2Icon,
        }
    },
    methods: {
        handleImageWidth(e){
            const values = e.target.value > 20 ? 30 : 40
            this.imageWidth = values
            //e.target.value = values
            this.$refs.width.value = values
        },
        addImageContent() {
            return new ImageItem(this.imageFileName, this.imageWidth, this.image)
        },
        generateUrlAndBlob(files) {
            if (files && files[0]) {
                this.image = files[0]
                var reader = new FileReader();
                const file = files[0]
                reader.onload = () => {
                    var img = new Image;
                    img.onload = () => {
                        console.log("The dimensions of the image is " + img.width + "px. "+ img.height + "px.")
                        this.image = file
                        this.imageFileName = uuidv4() + " - " + file.name
                        this.imageUrl = URL.createObjectURL(file)
                        this.imageWidth = img.width
                        this.errorMessage = ""
                        this.uploadError = false
                    }
                    img.onerror = () => {
                        // doesn't exist or error loading
                        console.log("doesnt support")
                        this.errorMessage = "Invalid File Uploaded"
                        this.uploadError = true
                    };
                    img.src = reader.result;
                }
                reader.readAsDataURL(files[0]);
            }
        },
        saveImage(){
            const inMemoryImages = {...this.inMemoryImages}
            inMemoryImages[this.imageFileName] = this.imageUrl
            this.alterStateParent("inMemoryImages", inMemoryImages)

            const imageBlobList = {...this.imageBlobList}
            imageBlobList[this.imageFileName] = this.image
            console.log(JSON.stringify(this.image), "JSON STRINGIFIED FILE")
            console.log(imageBlobList, "IN MEMORY IMAGES")
            this.alterStateParent("imageBlobList", imageBlobList)
            console.log(imageBlobList, inMemoryImages)
            this.finishUpload()
        },
        discardChanges(){
            this.image = null          
            this.imageWidth = 0
            this.$refs.imageInput ? this.$refs.imageInput.value = "" : null
            this.imageUrl = ""
            this.uploadError = false
            this.errorMessage = ""
        },
        uploadImageToS3(){
            if(this.imageSource === "imageSourceEnum.LOCAL"){
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
            this.addItemBlogObjectList(imageItem)
            this.alterState('imageUploaderOpen', !this.imageUploaderOpen)
            this.resetState()
        },
        resetState(){
            this.image = {},
            //this.imageHeight = 0,
            this.imageWidth = 0,
            this.imageUrl = "",
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
        /*onModalClose(){
            if(!this.imageUploaderOpen){
                this.image = {}
                this.$refs.imageInput.value = ""
                this.imageUrl = ""
            }
            return
        }*/
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
    height: 150px;
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