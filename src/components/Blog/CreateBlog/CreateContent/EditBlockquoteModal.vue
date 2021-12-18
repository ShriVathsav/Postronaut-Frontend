<template>
    <SuiModal :open="editBlockquoteModalOpen" size="tiny">
        <SuiModalHeader ><SuiIcon name="quote right" style="margin-right: 11px;"/>Customize Blockquote Appearance</SuiModalHeader>
        <SuiModalContent>
            <SuiModalDescription>
                <SuiForm>
                    <SuiGrid >
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Border Thickness (px)</label>
                                <input :value="borderThickness" ref="borderThickness" placeholder="Border Thickness in px" 
                                    @input="handleImageHeight($event, 'borderThickness', 1, 1000)" />
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Space around quote (px)</label>
                                <input :value="padding" ref="padding" placeholder="Padding in px" 
                                    @input="handleImageHeight($event, 'padding', 1, 3000)" />
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Color</label>
                                <input ref="color" placeholder="Enter color name or hex code" 
                                    v-model="color" />
                            </SuiFormField>
                        </SuiGridColumn>
                        <SuiGridColumn :width="8" >
                            <SuiFormField required>
                                <label>Background Color</label>
                                <input ref="backgroundColor" placeholder="Enter color name or hex code" 
                                    v-model="backgroundColor" />
                            </SuiFormField>
                        </SuiGridColumn>
                    </SuiGrid>
                </SuiForm>
            </SuiModalDescription>
        </SuiModalContent>
        <SuiModalActions>
            <SuiButton icon="cancel" negative @click.native="alterState('editBlockquoteModalOpen', false)">Cancel</SuiButton>
            <SuiButton icon="check" positive @click.native="saveBlockquoteProperties">Save</SuiButton>
        </SuiModalActions>
    </SuiModal>
</template>

<script>
import {validateNumeric, removeSpacesFromTextInput} from "../../../Utility/ValidateInputs.js"

export default {
    name: "EditBlockquoteModal",
    props: ["editBlockquoteModalOpen", "alterState", "items", "editBlockquoteFunc"],
    data(){
        return {
            validateNumeric,
            removeSpacesFromTextInput,
            borderThickness: this.items.borderThickness,
            padding: this.items.padding,
            color: this.items.color,
            backgroundColor: this.items.backgroundColor
        }
    },
    methods: {
        handleImageHeight(e, stateObj, min, max){
            const val = e.target.value
            this[stateObj] = val !== "" ? (validateNumeric(val, min, max) ? val : this[stateObj]) : ""
            this.$refs[stateObj].value = this[stateObj]
        },
        /*numericInputChange(e, stateObj, min, max){
            const val = e.target.value
            this[stateObj] = val !== "" ? (validateNumeric(val, 1, 20) ? val : this[stateObj]) : ""
            this.$refs[stateObj].value = this[stateObj]
        },*/
        textInputChange(e, stateObj){
            const val = e.target.value
            this[stateObj] = val !== "" ? removeSpacesFromTextInput(val) : ''
            this.$refs[stateObj].value = this[stateObj]
        },
        saveBlockquoteProperties(){
            const style = {
                borderThickness: this.borderThickness,
                padding: this.padding,
                color: this.color,
                backgroundColor: this.backgroundColor,
                firstContent: `<blockquote style="border-left: ${this.borderThickness}px solid ${this.color}; background-color: ${this.backgroundColor};  padding: ${this.padding}px;" >`
            }
            this.editBlockquoteFunc(style)
            this.alterState('editBlockquoteModalOpen', false)
        }
    },
    updated(){
        console.log(this.items, "FROM BLOCKQUOTE")
    }
}
</script>

<style scoped>

</style>