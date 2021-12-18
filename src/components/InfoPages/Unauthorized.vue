<template>
    <div>
        <InfoPage :icon="unauthorizedIcon" message="Uh Oh! It seems you are not authorized to visit here." />
    </div>
</template>

<script>
import unauthorizedIcon from "../../static/Icons/AuthIcons/unauthorizedIcon.svg"
import InfoPage from "../UI/InfoPage"

export default {
    name: "Unauthorized",
    components: {InfoPage},
    data(){
        return {
           unauthorizedIcon 
        }
    },
}
</script>

<style scoped>

</style>