<template>
    <SuiModal :open="editImageModalOpen" size="tiny">
        <SuiModalHeader ><SuiIcon name="images outline" style="margin-right: 11px;"/>Edit Image</SuiModalHeader>
        <SuiModalContent scrolling>
            <SuiModalDescription>
                <SuiForm>
                    <SuiGrid >
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Image Width (px)</label>
                                <input :value="imageWidth" ref="imageWidth" placeholder="Image Width in px" 
                                    @input="handleImageHeight($event, 'imageWidth', 1, 3000)" />
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Border Color</label>
                                <input ref="borderColor" placeholder="Enter color name or hex code" 
                                    v-model="borderColor" />
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Border Width (px)</label>
                                <input :value="borderWidth" ref="borderWidth" placeholder="Border Width in px" 
                                    @input="handleImageHeight($event, 'borderWidth', 1, 200)" />
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Border Style</label>
                                <SuiDropdown placeholder="Select" selection :options="borderStylesList" v-model="borderStyle" />
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Space Around Image (px)</label>
                                <input :value="spaceAround" ref="spaceAround" placeholder="Space Around Image in px" 
                                    @input="handleImageHeight($event, 'spaceAround', 1, 100)" />
                            </SuiFormField>
                        </SuiGridColumn>                        
                        <SuiGridColumn :width="8" >
                            <SuiFormField>
                                <label>Enable Captions</label>
                                <SuiCheckbox toggle v-model="showCaptions"/>
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="16" v-if="showCaptions">
                            <SuiFormField required>
                                <label>Caption</label>
                                <input placeholder="Type caption for image" :value="captions" ref="captions"
                                    @input="textInputChange($event, 'captions')"/>
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="16" >
                            <SuiFormField required>
                                <label>Alternative Text</label>
                                <input placeholder="Type alternative text for image" :value="alternativeText" ref="alternateText"
                                    @input="textInputChange($event, 'alternativeText')"/>
                            </SuiFormField>
                        </SuiGridColumn>
                    </SuiGrid>
                </SuiForm>
            </SuiModalDescription>
        </SuiModalContent>
        <SuiModalActions>
            <SuiButton icon="cancel" negative @click.native="alterState('editImageModalOpen', false)">Cancel</SuiButton>
            <SuiButton icon="check" positive @click.native="saveImageProperties">Save</SuiButton>
        </SuiModalActions>
    </SuiModal>
</template>

<script>
import {validateNumeric, removeSpacesFromTextInput} from "../../../Utility/ValidateInputs.js"

const borderStylesList = [
    {key: 0, text: "No Border", value: "none"},
    {key: 1, text: "Solid", value: "solid"},
    {key: 2, text: "Dotted", value: "dotted"},
    {key: 3, text: "Dashed", value: "dashed"},
    {key: 4, text: "Double", value: "double"},
    {key: 5, text: "Groove", value: "groove"},
    {key: 6, text: "Ridge", value: "ridge"},
    {key: 7, text: "Inset", value: "inset"},
    {key: 8, text: "Outset", value: "outset"},
    {key: 9, text: "Hidden", value: "hidden"}
]

export default {
    name: "EditImageModal",
    props: ["editImageModalOpen", "alterState", "items", "editImageFunc"],
    data(){
        return {
            borderStylesList,
            validateNumeric,
            removeSpacesFromTextInput,
            borderStyle: this.items.borderStyle,
            //imageHeight: this.items.imageHeight,
            imageWidth: this.items.imageWidth,
            borderWidth: this.items.borderWidth,
            borderColor: this.items.borderColor,
            spaceAround: this.items.spaceAround,
            showCaptions: this.items.showCaptions,
            captions: this.items.captions,
            alternativeText: this.items.alternativeText
        }
    },
    methods: {
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
        prepareFirstContent(item){
            const imageStyle = `width: ${this.imageWidth}px; border: ${this.borderWidth}px ${this.borderStyle} ${this.borderColor}; padding: ${this.spaceAround}px; max-width: 100%;`
            return `<img alt='${this.alternativeText}' style='${imageStyle}' src='`
        },
        prepareThirdContent(item){
            const captionStyle = "padding: 9px; line-height: 1.4; color: rgba(0,0,0,.68);"
            return this.showCaptions ? `' /><figcaption style='${captionStyle}' >${this.captions}</figcaption>` : " />"
        },
        saveImageProperties(){
            const style = {
                borderStyle: this.borderStyle,
                //imageHeight: this.imageHeight,
                imageWidth: this.imageWidth,
                borderWidth: this.borderWidth,
                borderColor: this.borderColor,
                showCaptions: this.showCaptions,
                spaceAround: this.spaceAround,
                captions: this.captions,
                alternativeText: this.alternativeText,
                firstContent: this.prepareFirstContent(),
                thirdContent: this.prepareThirdContent()
            }
            this.editImageFunc(style)
            this.alterState('editImageModalOpen', false)
        }
    },
    updated(){
        console.log(this.items, "width")
    }
}
</script>

<style scoped>

</style>