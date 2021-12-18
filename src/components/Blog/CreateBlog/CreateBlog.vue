<template>
<div>
    <div style="display: flex; align-items: center;">
        <div style="width: 37%">
            <SuiButton inverted color="blue" content="Next" icon="right arrow" :disabled="!blogValid()"
                @click.native="() => alterStep(2)" style="border-radius: 0px;" label-position="right" />
        </div>
        <div style="width: 63%; color: gray; font-size: 16px;">
            Please click on the Save button to save changes.
        </div>
    </div>
    
    <div style='margin-top: 20px;'>
        <div :key='items.id' v-for="(items, ind) in blogObjectList">
            <div v-if="items.type === 'Title'">
                <TitleEditor slot="trigger" :setEditorContent="setEditorContent" :index="ind"
                    :items="items" />
            </div>
            <div v-if="items.type === blogContentEnum.TEXT">
                <TextEditor :items="items" :editorId="items.id" :setEditorContent="setEditorContent" 
                    :index="ind" :removeItemBlogObjectList="removeItemBlogObjectList"/>
            </div>
            <div v-if="items.type === blogContentEnum.HEADING">
                <HeadingEditor :items="items" :editorId="items.id" :setEditorContent="setEditorContent" 
                    :index="ind" :removeItemBlogObjectList="removeItemBlogObjectList"/>
            </div>
            <div v-if="items.type === blogContentEnum.IMAGE">
                <ImageViewer :items="items" :imageId="items.id" :index="ind" :setImageProperties="setImageProperties"
                    :removeItemBlogObjectList="removeItemBlogObjectList" :removeImageList="removeImageList"
                    :removeImage="removeImage" :inMemoryImages="inMemoryImages" :uploadedImages="uploadedImages" />
            </div>
            <div v-if="items.type === blogContentEnum.BLOCKQUOTE">
                <BlockquoteEditor :items="items" :quoteId="items.id" :index="ind" :setBlockquoteProperties="setBlockquoteProperties"
                    :removeItemBlogObjectList="removeItemBlogObjectList" :setEditorContent="setEditorContent" />
            </div>
        </div>
        <!--<Playground />-->
        <AddContent :blogObjectList="blogObjectList" :alterState="alterState"/>
        <UploadImageModal :imageUploaderOpen="imageUploaderOpen" :alterState="alterState" :alterStateParent="alterStateParent" 
            :imageTemplate="imageTemplate" :addItemBlogObjectList="addItemBlogObjectList" 
            :imageBlobList="imageBlobList" :inMemoryImages="inMemoryImages" />
    </div>
</div>
</template>

<script>
//import addImage from "../../../static/Icons/CreateBlogIcons/addImage.svg"
//import addText from "../../../static/Icons/CreateBlogIcons/addText.svg"
import {blogContentEnum} from "../BlogModels/Enums"

//import {v4 as uuidv4} from "uuid"

import UploadImageModal from "./CreateContent/UploadImageModal.vue"
import TextEditor from "./CreateContent/TextEditor.vue"
import TitleEditor from "./CreateContent/TitleEditor.vue"
import HeadingEditor from "./CreateContent/HeadingEditor.vue"
import AddContent from "./AddContent.vue"
import ImageViewer from "./CreateContent/ImageViewer.vue"
import BlockquoteEditor from "./CreateContent/BlockquoteEditor.vue"
import {imageTemplate} from "../../Utility/Utility"


export default {
    name: "CreateBlog",
    components: {TextEditor, TitleEditor, AddContent, UploadImageModal, ImageViewer, BlockquoteEditor, 
            HeadingEditor},
    props: ["blogObjectList", "imagesList", "deletedImagesList", "coverPicUrl", "blogSubmitHandler", 
        "alterStep", 'alterStateParent', "deletedImages", "uploadedImages", "inMemoryImages", 'imageBlobList'],
    data(){
        return {
            imageUploaderOpen: false,
            imageTemplate,
            contentList: [],
            blogContentEnum,
            
        }
    },
    methods: {
        alterState(stateObj, value){
            this[stateObj] = value
        },
        removeImage(imageKey, status){
            console.log(imageKey, status, "PRINTING WHILE DELETING IMAGE")
            if(status === "UPLOADED"){
                const upImages = {...this.uploadedImages}
                const delImages = [...this.deletedImages]
                delImages.push(imageKey)
                this.alterStateParent("deletedImages", delImages)
                delete upImages[imageKey]
                this.alterStateParent("uploadedImages", upImages)
            } else {
                const inMemImages = {...this.inMemoryImages}
                inMemImages[imageKey] = undefined
                this.alterStateParent("inMemoryImages", inMemImages)
            }            
        },
        addItemBlogObjectList(obj){
            this.blogObjectList.push(obj)
        },
        removeItemBlogObjectList(index){
            this.blogObjectList.splice(index, 1)
        },
        setEditorContent(content, textContent, index){
            this.blogObjectList[index].content = content
            this.blogObjectList[index].textContent = textContent
        },
        setImageProperties(style, index){
            const {imageHeight, imageWidth, borderWidth, borderColor, borderStyle, alternativeText, 
                spaceAround, showCaptions, captions, firstContent, thirdContent} = style
            const image = this.blogObjectList[index]
            if(image.type === "Image"){
                image.imageHeight = imageHeight,
                image.imageWidth = imageWidth,
                image.borderWidth = borderWidth,
                image.borderColor = borderColor,
                image.borderStyle = borderStyle,
                image.spaceAround = spaceAround
                image.alternativeText = alternativeText,
                image.showCaptions = showCaptions,
                image.captions = captions
                image.firstContent = firstContent
                image.thirdContent = thirdContent
            }
        },
        setBlockquoteProperties(style, index){
            const {color, backgroundColor, padding, borderThickness, content} = style
            const quote = this.blogObjectList[index]
            if(quote.type === "Blockquote"){
                quote.color = color
                quote.backgroundColor = backgroundColor
                quote.padding = padding
                quote.borderThickness = borderThickness
                quote.content = content
            }
        },
        prepareTitleContent(item){
            return {
                contentType: item.type,
                firstContent: "<h1>",
                secondContent: item.content,
                thirdContent: "</h1>",
                blob: "null"
            }
        },
        prepareTextContent(item){
            return {
                contentType: item.type,
                firstContent: "",
                secondContent: item.content,
                thirdContent: "",
                blob: "null"
            }
        },
        prepareImageContent(item){
            const imageStyle = `height: ${item.imageHeight}px; width: ${item.imageWidth}px; border: ${item.borderWidth}px ${item.borderStyle} ${item.borderColor}; padding: ${item.spaceAround}px`
            const captionStyle = "padding: 9px; line-height: 1.4; color: rgba(0,0,0,.68);"
            return {
                contentType: item.type,
                firstContent: `<img alt='${item.alternativeText}' style='${imageStyle}' src='`,
                secondContent: item.src,
                thirdContent: item.showCaptions ? `' /><figcaption style='${captionStyle}' >${item.captions}</figcaption>` : " />",
                blob: "null"
            }
        },
        prepareBlockquoteContent(item){
            const quoteStyle = `border-left: ${item.borderThickness}px solid ${item.color}; background-color: ${item.backgroundColor};  padding: ${item.padding}px;`
            return {
                contentType: item.type,
                firstContent: `<blockquote style='${quoteStyle}' >`,
                secondContent: item.content,
                thirdContent: `</blockquote>`,
                blob: "null"
            }
        },
        submitHandler(){
            this.blogObjectList.map(item => {
                if(item.type === "Title"){
                    this.contentList.push(this.prepareTitleContent(item))
                } else if(item.type === "Text"){
                    this.contentList.push(this.prepareTextContent(item))
                } else if(item.type === "Image"){
                    this.contentList.push(this.prepareImageContent(item))
                } else if(item.type === "Blockquote"){
                    this.contentList.push(this.prepareBlockquoteContent(item))
                }
            })
            console.log(this.contentList, "PRINTING CONTENT LIST")
        },
        blogValid(){
            if(this.blogObjectList[0] && this.blogObjectList[1]){
                return !!this.blogObjectList[0].content && !!this.blogObjectList[1].content
            }
            return false
        }
    },
    updated(){
        console.log(this.uploadedImages, this.deletedImages, "PRINTING WHILE DELETING IMAGE 2")
    }
}
</script>

<style scoped>

</style>