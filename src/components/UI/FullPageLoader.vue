<template>
    <div style="height: 65vh; margin-top: 10px;">
        <SuiSegment style="height: 100%;">
            <SuiDimmer active inverted style="z-index: 10" >
                <SuiLoader size="massive">Loading</SuiLoader>
            </SuiDimmer>
            <SuiImage class="dimmer-image" :src='loaderImage' />
            <SuiImage class="dimmer-image" :src='loaderImage' />
            <SuiImage class="dimmer-image" :src='loaderImage' />
            <SuiImage class="dimmer-image" :src='loaderImage' />
        </SuiSegment>
    </div>
</template>

<script>
import loaderImage from "../../static/Images/LoadingImage.png"

export default {
    name: "FullPageLoader",
    data(){
        return {
            loaderImage
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
.dimmer-image{
    width: 100%;
    height: 25%;
}
</style>