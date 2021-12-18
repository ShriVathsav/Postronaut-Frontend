<template>
    <div style="display: flex; flex-direction: column; align-items: center;">
        <SuiImage :src="pageNotFoundIcon" style="width: 120px;" />
        <SuiHeader style="margin: 26px 0px; text-align: center;">
            Hmm! It seems the page you are looking for doesn`t exist
        </SuiHeader>
        <SuiButton color="orange" size="large" @click.native="$router.push('/')">
            <SuiIcon name="home"  />Go to HomePage
        </SuiButton>
    </div>
</template>

<script>
import pageNotFoundIcon from "../../static/Icons/AuthIcons/pageNotFound.svg"

export default {
    name: "PageNotFound",
    data(){
        return {
           pageNotFoundIcon 
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>

</style>