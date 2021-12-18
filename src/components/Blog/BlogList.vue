<template>
    <div>
        <SuiGrid>     
            <SuiGridColumn :mobile="16" :tablet="16" :computer="8" v-for="blog in blogList" :key="blog.id">
                <div >
                    <BlogCard :blog="blog" />
                </div>
            </SuiGridColumn>
        </SuiGrid>
        <infinite-loading @infinite="loadMore" spinner="bubbles">
            <div slot="no-more" class="no-more-results">No More Results</div>
            <div slot="no-results" class="no-more-results">No More Results</div>
        </infinite-loading>
    </div>
</template>

<script>
import BlogCard from "./BlogCard.vue"

export default {
    name: "BlogList",
    components: {BlogCard},
    props: ["blogList", "loadMore"],
    data(){
        return {
            profileId: this.$store.state.auth.user.id,
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
    .no-more-results{
        font-size: 16px;
        font-weight: 700;
        margin-top: 10px;
    }
</style>