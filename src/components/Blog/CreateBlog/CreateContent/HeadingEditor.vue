<template>
    <div>
    <div style="position: relative;" @mouseover="() => {showPopup = true}" @mouseleave="() => {showPopup = false}">
        <div :id="editorId" :class="addBorder ? 'editorClass' : '' +' '+'editorHover'" class="heading-editor"
                style="overflow: hidden; padding: 14px 14px; line-height: normal;">
        </div>
        <div v-if="index !== 1">
            <PopUp id="popup" :showPopup="showPopup" :style="'position: absolute;'" >
                <SuiIcon name="trash alternate" style="cursor: pointer; margin: 0px;" size="large"
                    @click="removeItemBlogObjectList(index)"/>
            </PopUp>
        </div>
    </div>
    </div>
</template>

<script>
import {headingEditorConfig, conf} from "../TinyMceConfig.js"
import PopUp from "./PopUp.vue"

export default {
    name: "HeadingEditor",
    props: ["editorId", "index", "setEditorContent", "removeItemBlogObjectList", "items"],
    components: {PopUp},
    data(){
        return {
            addBorder: false,
            showPopup: false
        }
    },
    methods: {
        getContentFromEditor(e, ed){
            //console.log('the event object ', e)
            //console.log('the editor object ', ed)
            this.setEditorContent(ed.getContent(), ed.getContent({format: "text"}), this.index)
            console.log('the content ', ed.getContent(), typeof ed.getContent())
        },
        addBorderToEditor(val){
            this.addBorder = val
        }
    },
    mounted() {
        tinymce.init(headingEditorConfig(this.editorId, this.getContentFromEditor, this.addBorderToEditor, this.items.content))
        //tinymce.init(conf)
        console.log(this.editorId, "EDITOR ID")
    },
    updated(){
        console.log(this.addBorder)
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
</style>