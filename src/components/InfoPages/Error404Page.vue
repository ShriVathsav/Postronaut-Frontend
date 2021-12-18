<template>
    <div>
        <InfoPage :icon="error404Icon" message="Uh Oh! It seems you are lost. Click on the below button to navigate to Homepage." />
    </div>
</template>

<script>
import error404Icon from "../../static/Icons/AuthIcons/error404.svg"
import InfoPage from "../UI/InfoPage"

export default {
    name: "Error404page",
    components: {InfoPage},
    data(){
        return {
           error404Icon 
        }
    }
}
</script>

<style scoped>

</style>