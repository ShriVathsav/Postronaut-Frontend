<template>
    <div style="margin-top: 50px;">
        <div style="display: flex; align-items: center; flex-direction: column;">
            <SuiImage :src="topicIcon" size="small" style="width: 100px;"/>
            <SuiHeader style="font-size: 30px; margin-bottom: 50px; text-align: center;">Create Topic</SuiHeader>
        </div>
        <SuiGrid>
            <SuiGridColumn :mobile="16" :tablet="12" :computer="13">
                <SuiForm>
                    <SuiFormField>
                        <input placeholder="Enter the name of the topic" :value="topicName" fluid ref="topicInput"
                            @input="onTopicNameChange($event)" />
                    </SuiFormField>
                </SuiForm>
            </SuiGridColumn>
            <SuiGridColumn :mobile="16" :tablet="4" :computer="3" >
                <SuiButton fluid color="red" style="border-radius: 0px;" :loading="loading"
                        :disabled="topicNameValid()" @click.native="onTopicCreate">
                    <SuiIcon name="plus" />CREATE TOPIC
                </SuiButton>
            </SuiGridColumn>
            <SuiGridColumn :width="16" style="text-align: center; font-size: 16px;">
                <div class="info-message info" v-if="createSuccess === 1" >
                    <SuiIcon name="thumbs up" />Topic created successfully
                </div>
                <div class="info-message error" v-if="createSuccess === 0" >
                    <SuiIcon name="delete" />An error has occured. Please try again later
                </div>
            </SuiGridColumn>
        </SuiGrid>
    </div>
</template>

<script>
import axios from 'axios'
import {removeSpacesFromTextInput} from "../Utility/ValidateInputs"

import topicIcon from "../../static/Icons/TopicIcons/topicIcon2.svg"

export default {
    name: "CreateTopic",
    components: {},
    data(){
        return {
            topicList: [],
            topicName: "",
            loading: false,
            createSuccess: -1,
            topicIcon
        }
    },
    methods: {
        onTopicNameChange(e){
            const val = e.target.value
            this.topicName = removeSpacesFromTextInput(val)
            this.$refs["topicInput"].value = this.topicName
        },
        onTopicCreate(){
            const topic = {
                topicName: this.topicName
            }
            this.topicName = ""
            this.loading = true
            console.log(topic)
            axios.post("/topic/", topic).then(res => {
                console.log(res)
                this.createSuccess = 1
                this.loading = false
            }).catch(err => {
                console.log(err)
                this.createSuccess = 0
                this.loading = false
            })
        },
        topicNameValid(){
            return this.topicName === "" || this.topicName === " "
        }
    },
}
</script>

<style scoped>
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

}
</style>