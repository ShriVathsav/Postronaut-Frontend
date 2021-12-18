<template>
    <div>
        <InfoPage :icon="pageNotFoundIcon" message="Oops! The page you are looking for doesn`t exist." />
    </div>
</template>

<script>
import pageNotFoundIcon from "../../static/Icons/AuthIcons/pageNotFound.svg"
import InfoPage from "../UI/InfoPage"

export default {
    name: "PageNotFound",
    components: {InfoPage},
    data(){
        return {
           pageNotFoundIcon 
        }
    }
}
</script>

<style scoped>

</style>