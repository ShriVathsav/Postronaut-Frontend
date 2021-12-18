<template>
    <div style="height: 100%; margin-top: 20px;">
        <SuiSegment style="height: 100%;">
            <SuiDimmer active inverted>
                <SuiLoader size="massive">Loading</SuiLoader>
            </SuiDimmer>
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
}
</style>