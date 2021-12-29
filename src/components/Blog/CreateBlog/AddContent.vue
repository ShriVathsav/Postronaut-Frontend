<template>
<div>
    <div style="display: flex; justify-content: center">
        <SuiSegment compact style='border-radius: 0; text-align: center; margin: 14px 0px; vertical-align: middle; padding: 14px 7px'>
            <div style='font-size: 16px; font-weight: 700; color: gray; margin-bottom: 5px;'>
                <SuiIcon name="plus" />
                <span>Add Content</span>
            </div>
            <div style='display: flex; justify-content: center; flex-flow: row wrap;'>
                <div id="content-item" @click="blogObjectList.push(addHeadingContent())">
                    <SuiImage :src="heading" id="content-image" />
                    <div id="content-sub-text">Heading</div>
                </div>
                <div id="content-item" @click="blogObjectList.push(addTextContent())">
                    <SuiImage :src="addText" id="content-image" />
                    <div id="content-sub-text">Text</div>
                </div>
                <div id="content-item" @click="alterState('imageUploaderOpen', true)">
                    <SuiImage :src="addImage" id="content-image" />
                    <div id="content-sub-text">Image</div>
                </div>
                <div id="content-item" @click="blogObjectList.push(addBlockquoteContent())">
                    <SuiImage :src="blockquote" id="content-image" />
                    <div id="content-sub-text">Blockquote</div>
                </div>
                <!--div id="content-item" @click="blogObjectList.push(addBlockquoteContent())">
                    <SuiImage :src="addCode" id="content-image" />
                    <div id="content-sub-text">Code</div>
                </div-->
            </div>
        </SuiSegment>
    </div>
</div>
</template>

<script>
import {v4 as uuidv4} from "uuid"

import addImage from "../../../static/Icons/CreateBlogIcons/picture.svg"
import addText from "../../../static/Icons/CreateBlogIcons/notes.svg"
import blockquote from "../../../static/Icons/CreateBlogIcons/blockquote.svg"
import heading from "../../../static/Icons/CreateBlogIcons/heading.svg"
import addCode from "../../../static/Icons/CreateBlogIcons/codeIcon.svg"

import Text from "../BlogModels/Text"
import Heading from "../BlogModels/Heading"
//import ImageItem from "../BlogModels/ImageItem"
import Blockquote from "../BlogModels/Blockquote"

import {textTemplate, blockquoteTemplate, headingTemplate} from "../../Utility/Utility"

export default {
    name: "AddContent",
    props: ["blogObjectList", "imageUploaderOpen", "alterState"],
    data(){
        return {
            addImage,
            addText,
            blockquote,
            heading,
            addCode,
            
            headingTemplate,
            textTemplate,
            blockquoteTemplate
        }
    },
    methods: {
        addTextContent2(){
            const createTextTemplate = textTemplate()
            createTextTemplate.id = uuidv4()
            createTextTemplate.index = this.blogObjectList.length
            return createTextTemplate
        },
        addBlockquoteContent2(){
            const createBlockquoteTemplate = blockquoteTemplate()
            createBlockquoteTemplate.id = uuidv4()
            createBlockquoteTemplate.index = this.blogObjectList.length
            return createBlockquoteTemplate
        },
        addHeadingContent2(){
            const createHeadingTemplate = headingTemplate()
            createHeadingTemplate.id = uuidv4()
            createHeadingTemplate.index = this.blogObjectList.length
            return createHeadingTemplate
        },
        addTextContent() {
            return new Text()
        },
        addBlockquoteContent() {
            return new Blockquote()
        },
        addHeadingContent() {
            return new Heading()
        }
    },
    created() {
        
    }
}
</script>

<style scoped>
#content-item{
    border: 1px solid gray; 
    text-align: center; 
    width: 90px; 
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 10px 20px;
    cursor: pointer;
}

#content-item:hover{
    border : 1px solid #6435c9;
    color: #6435c9;
}

#content-image{
    margin-bottom: 7px;
    width: 30px;
    height: 30px;
}

#content-sub-text{
    font-size: 14px;
    font-weight: 700;
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
}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){
    #content-item{
        margin: 5px;
    }
}
</style>