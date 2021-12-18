<template>
    <div>
        <SuiModal :open="topicModalOpen" size="tiny" >
            <SuiModalHeader><SuiIcon name="slack hash" style="margin-right: 11px;"/>Topics you are interested in</SuiModalHeader>
            <SuiModalContent>
                <SuiModalDescription>
                    <div style="margin-bottom: 28px;">
                        <SuiHeader dividing>Topics Interested ({{myTopicList.length}})</SuiHeader>
                        <div style="margin: 7px 0px;">
                            <div v-if="myTopicList.length === 0" style="font-size: 16px; color: gray;">
                                No Topics Selected. Please select one or more topics to view posts based on your interests.
                            </div>
                            <div v-else style="display: flex; flex-flow: row wrap;">
                                <div v-for="topic in myTopicList" :key="topic.id" class="topic-item">
                                    {{topic.topicName}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <SuiHeader dividing>Add / Remove Interested Topics</SuiHeader>
                        <SuiForm>
                            <SuiFormField required>
                                <label>Select Topics of your interests</label>
                                <SuiDropdown :options="topicList" placeholder="Select Topics" search
                                    fluid multiple selection v-model="selectedTopicList" />
                                <div style="margin-top: 14px;">
                                    <span style="margin-right: 10px;">
                                        {{!!selectedTopicList ? selectedTopicList.length : "0"}} topics selected
                                    </span>
                                    <span id="clear-topics" @click="clearTopics()" >
                                        <SuiIcon name="delete" />Clear entries
                                    </span>
                                </div>
                                <div class="info-message error" v-if="errorPresence" >
                                    <div style="text-align: center;">
                                        An error has occured
                                    </div>
                                </div>
                            </SuiFormField>
                        </SuiForm>
                    </div>
                </SuiModalDescription>
            </SuiModalContent>
            <SuiModalActions>
                <SuiButton icon="delete" negative @click.native="closeModal">Close</SuiButton>
                <SuiButton :loading="loading" icon="check" positive @click.native="makeChangesToTopics">Save</SuiButton>
            </SuiModalActions>
        </SuiModal>
    </div>
</template>

<script>
import axios from "axios"


export default {
    name: "AddTopicModal",
    props: ["topicModalOpen", "openTopicModal", "profile"],
    data() {
        return {
            topicList: [],
            selectedTopicList: this.prepareSelectedTopics(this.profile.topic),
            myTopicList: this.profile.topic,
            loading: false,
            errorPresence: false
        }
    },
    methods: {
        makeChangesToTopics(){
            this.loading = true
            this.errorPresence = false
            axios.post(`/profile/addtopic/${this.$store.state.auth.user.id}`, this.selectedTopicList).then(res => {
                console.log(res)
                this.loading = false
                this.openTopicModal()
                this.profile.topic = res.data.topic
            }).catch(err => {
                console.log(err.response.data, err)
                this.loading = false
                this.errorPresence = true
            })
        },
        generateTopicList(list){
            const arr = []
            for(const item of list){
                arr.push({
                    key: item.id,
                    value: item.id,
                    text: item.topicName
                })
            }
            console.log(arr, "topic list")
            this.topicList = arr
        },
        prepareSelectedTopics(list){
            let arr = []
            for(const i of list){
                arr.push(i.id)
            }
            return arr
        },
        clearTopics(){
            this.selectedTopicList = []
        },
        topicListValid(){
            if(this.selectedTopicList){
                console.log(this.selectedTopicList.length)
                if(this.selectedTopicList.length === 0){
                    console.log("Hello")
                    return true
                }
                return false
            } else {
                return true
            }
        },
        closeModal(){
            this.selectedTopicList = this.prepareSelectedTopics(this.profile.topic)
            this.openTopicModal()            
        }
    },
    created(){
        axios.get("/topic/").then(res => {
            this.generateTopicList(res.data)
        }).catch(err => {
            console.log(err, err.response)
        })
    },
    updated(){

    },
    mounted(){
        //this.selectedTopicList = [1,2]
    }
}
</script>

<style scoped>
#clear-topics{
    cursor: pointer;
}
#clear-topics:hover{
    text-decoration: underline;
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
.error{
    border: 1px solid #9f3a38;
    background-color: #ffdec3;
    color: #9f3a38;
}
.topic-item{
    color: rgba(117, 117, 117, 1);
    background-color: rgba(242, 242, 242, 1);
    margin: 5px;
    padding: 5px;
}

/*ABOVE 990 PX*/
@media only screen and (min-width: 990px){
    #profile-segment{
        max-width: 800px;
    }
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