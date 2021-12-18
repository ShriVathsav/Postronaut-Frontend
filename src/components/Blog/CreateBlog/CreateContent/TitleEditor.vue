<template>
    <h1 id="titleEditorId" style='overflow: hidden; padding: 14px; font-size: 36px;'>
        <p></p>
    </h1>
</template>

<script>
import {titleEditorConfig} from "../TinyMceConfig.js"

export default {
    name: "TitleEditor",
    props: ["index", "setEditorContent", "items"],
    data(){
        return {

        }
    },
    methods: {
        getContentFromEditor(e, ed){
            console.log('the event object ', e)
            console.log('the editor object ', ed)
            this.setEditorContent(ed.getContent(), ed.getContent({format: "text"}), this.index)
            console.log('the content ', ed.getContent(), typeof ed.getContent())
        }
    },
    mounted() {
        console.log(window.tinymce, "TITLE EDITOR MOUNTING")
        window.tinymce.init(titleEditorConfig(this.getContentFromEditor, this.items.content))
    },
    updated(){
        console.log("TITLE EDITOR UPDATING")
    }
}
</script>

<style scoped>
#titleEditorId{
    outline: none;
}
#titleEditorId:hover{
    outline: 2px solid #2276d2;
}
#titleEditorId:click{
    outline: 2px solid #2276d2;
}
</style>