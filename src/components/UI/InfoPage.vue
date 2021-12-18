<template>
    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 70px;">
        <SuiImage :src="icon" style="width: 120px;" />
        <SuiHeader style="margin: 26px 0px; text-align: center;">
            {{message}}
        </SuiHeader>
        <SuiButton color="violet" size="large" @click.native="$router.push('/')" id="info-button">
            <SuiImage size="mini" :src="homePageIcon" style="margin-right: 16px;"  />
            <span>GO TO HOMEPAGE</span>
        </SuiButton>
    </div>
</template>

<script>
import homePageIcon from "../../static/Icons/homePageIcon4.svg"

export default {
    name: "InfoPage",
    props: ["message", "icon"],
    data(){
        return {
           homePageIcon
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
#info-button{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /*border-radius: 0px;
    background-color: #54c8ff;
    color: white;*/
}
</style>