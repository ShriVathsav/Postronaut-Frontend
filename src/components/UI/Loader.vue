<template>
    <div>
        <SuiSegment :style="`height: ${height}px;`">
            <SuiDimmer active inverted>
                <SuiLoader :size="size">Loading</SuiLoader>
            </SuiDimmer>
            <SuiImage class="dimmer-image" :src="loaderImage" />
        </SuiSegment>
    </div>
</template>

<script>
import loaderImage from "../../static/Images/LoadingImage.png"

export default {
    name: "Loader",
    props: ["height", "size"],
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
    height: 100%;
}
</style>