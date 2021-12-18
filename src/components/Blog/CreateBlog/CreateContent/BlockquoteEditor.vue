<template>
    <div >
        <div style="position: relative;" @mouseover="() => {showPopup = true}" @mouseleave="() => {showPopup = false}" >
            <div style="padding: 0.1px;" :class="addBorder ? 'editorClass' : '' +' '+'editorHover'">
                <blockquote :id="quoteId" style="outline: none; margin: 28px 40px 0px 40px" :style="renderStyles()" class="quote-editor">
                    <p></p>
                </blockquote>
            </div>
            <div>
                <PopUp id="popup" :showPopup="showPopup" :style="'position: absolute;'" >
                    <SuiIcon name="trash alternate" style="cursor: pointer; margin: 0px 10px 0px 0px;" size="large"
                        @click="removeItemBlogObjectList(index)"/>
                    <SuiIcon name="edit" style="cursor: pointer; margin: 0px;" size="large"
                        @click="editBlockquoteModalOpen = true" />
                </PopUp>
            </div>
        </div>
        <EditBlockquoteModal :editBlockquoteModalOpen="editBlockquoteModalOpen" :alterState="alterState" 
            :items="items" :editBlockquoteFunc="editBlockquoteFunc"/>
    </div>
</template>

<script>
import {blockquoteEditorConfig} from "../TinyMceConfig.js"
import PopUp from "./PopUp.vue"
import EditBlockquoteModal from "./EditBlockquoteModal.vue"

export default {
    name: "BlockquoteEditor",
    props: ["index", "setEditorContent", "quoteId", "removeItemBlogObjectList", "items",
        "setBlockquoteProperties"],
    components: {PopUp, EditBlockquoteModal},
    data(){
        return {
            addBorder: false,
            showPopup: false,
            editBlockquoteModalOpen: false
        }
    },
    methods: {
        getContentFromEditor(e, ed){
            console.log('the event object ', e)
            console.log('the editor object ', ed)
            this.setEditorContent(ed.getContent(), ed.getContent({format: "text"}), this.index)
            console.log('the content ', ed.getContent(), typeof ed.getContent())
        },
        addBorderToEditor(val){
            this.addBorder = val
        },
        alterState(stateObj, value){
            console.log(stateObj, value)
            this[stateObj] = value
        },
        editBlockquoteFunc(style){
            this.setBlockquoteProperties(style, this.index)
        },
        renderStyles(){
            return {
                borderLeft: this.items.borderThickness + 'px solid ' + this.items.color,
                backgroundColor: this.items.backgroundColor,
                padding: this.items.padding + 'px'
            }
        }
    },
    mounted() {
        console.log("TITLE EDITOR MOUNTING")
        window.tinymce.init(blockquoteEditorConfig(this.quoteId, this.getContentFromEditor, 
                this.addBorderToEditor, this.items.content))
    },
    updated(){
        console.log(this.items, "TBLOCKQUOTEITLE EDITOR UPDATING")
    }
}
</script>

<style scoped>
.editorHover{
    outline: 2px hidden #2276d2;
}
.editorHover:hover{
    outline: 2px solid #2276d2;
}
.editorClass{
    outline: 2px solid #2276d2;
}
</style>