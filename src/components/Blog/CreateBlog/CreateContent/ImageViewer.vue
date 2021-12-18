<template>
    <div>
        <div style="text-align: center; margin: 10px;">
            <div style="position: relative; display: inline-block;" @mouseover="() => {showPopup = true}" @mouseleave="() => {showPopup = false}">
                <div :class="addBorder ? 'editorClass' : '' +' '+'editorHover'">
                    <div :id="imageId" >
                        <SuiImage :src="getImageSrc()" :alt="items.alternateText" 
                            :style="renderStyles()" />
                    </div>
                    <figcaption class="captions" v-if="items.showCaptions">
                        {{items.captions}}
                    </figcaption>
                </div>
                <div>
                    <PopUp id="popup" :showPopup="showPopup" :style="'position: absolute;'" >
                        <SuiIcon name="trash alternate" style="cursor: pointer; margin: 0px 10px 0px 0px;" size="large"
                            @click="deleteImage"/>
                        <SuiIcon name="edit" style="cursor: pointer; margin: 0px;" size="large"
                            @click="editImageModalOpen = true" />
                    </PopUp>
                </div>
            </div>
        </div>
        <EditImageModal :editImageModalOpen="editImageModalOpen" :alterState="alterState" :items="items" 
            :editImageFunc="editImageFunc"/>
    </div>
</template>

<script>
//import {v4 as uuidv4} from "uuid"
import PopUp from "./PopUp.vue"
import EditImageModal from "./EditImageModal.vue"
import axios from "axios"

export default {
    name: "ImageViewer",
    components: {PopUp, EditImageModal},
    props: ["imageId", "index", "removeItemBlogObjectList", "items", "setImageProperties", 
        "removeImageList", "removeImage", "uploadedImages", "inMemoryImages"],
    data(){
        return {
            addBorder: false,
            showPopup: false,
            editImageModalOpen: false
        }
    },
    methods: {
        getImageSrc(){
            if(this.items.status === "UPLOADED"){
                return this.uploadedImages[this.items.content]
            } else {
                return this.inMemoryImages[this.items.content]
            }
        },
        alterState(stateObj, value){
            console.log(stateObj, value)
            this[stateObj] = value
        },
        editImageFunc(style){
            this.setImageProperties(style, this.index)
        },
        renderStyles(){
            return {
                width: this.items.imageWidth + 'px',
                border: this.items.borderWidth + 'px ' + this.items.borderStyle + ' ' + this.items.borderColor,
                padding: this.items.spaceAround + 'px'
            }
        },
        deleteImage(){
            this.removeImage(this.items.content, this.items.status)
            this.removeItemBlogObjectList(this.index)
        },
        deleteImage2(){
            if(this.items.imageSource === "1"){
                axios.delete(`/image/delete?imageUrl=${this.items.imageUrl}&imageId=${this.items.databaseId}`).then(res => {
                    console.log(res, "IMAGE DELETED")
                    this.removeItemBlogObjectList(this.index)
                    this.removeImageList(this.items.id)
                }).catch(err => {
                    console.log(err.response)
                })
            } else {
                this.removeItemBlogObjectList(this.index)
            }
        }
    },
    updated() {
        console.log(this.items)
    }
}
</script>

<style scoped>
    .editorHover:hover{
        outline: 2px solid #2276d2;
    }
    .editorClass{
        outline: 2px solid #2276d2;
    }
    .captions{
        padding: 9px;
        line-height: 1.4;
        color: rgba(0,0,0,.68);
    }
</style>