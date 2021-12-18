<template>
    <div>
        <SuiHeader style="margin-top: 25px;">{{identity() === 1 ? "Your" : `${profile.userName}'s`}} Activity</SuiHeader>
        <SuiDivider style="margin-bottom: 25px;" />
        <SuiMenu attached="top" tabular style="text-align: center;">
            <SuiMenuItem style="padding: 0px;" class="main-menu-item"
                v-for="item in items" :key="item[0]" :active="isActive(item[0])" @click="select(item[0])" >
                <div class="menu-item-prof">
                    {{ item[0] }}
                    <SuiLabel :color="item[2]" class="prof-label" id="label-prof">{{item[1]}}</SuiLabel>
                </div>
            </SuiMenuItem>
        </SuiMenu>
        <SuiSegment attached="bottom" style="padding: 30px 14px;">
            <div v-if="isActive('Liked Posts')">
                <LikedPosts :profile="profile" />
            </div>
            <div v-if="isActive('Posts Commented')">
                <CommentedPosts :profile="profile" />
            </div>
            <div v-if="isActive('Followers')">
                <Followers :profile="profile" />
            </div>
            <div v-if="isActive('Following')">
                <Following :profile="profile" />
            </div>
        </SuiSegment>
    </div>
</template>

<script>
import Followers from "./Followers"
import Following from "./Following"
import CommentedPosts from "./CommentedPosts"
import LikedPosts from "./LikedPosts"

export default {
    name: "ProfileMenu",
    components: {Followers, Following, CommentedPosts, LikedPosts},
    props: ["profile", "items"],
    data(){
        return {
            profileId: this.$route.params.id,
            active: "Liked Posts"
        }
    },
    methods: {
        isActive(name) {
            return this.active === name;
        },
        select(name) {
            this.active = name;
        },
        identity(){
            return this.$store.state.auth.user.id == this.$route.params.id ? 1 : 2
        }
    },
    updated(){
        //console.log(this.identity, "PROFILE FROM PROFILE MENU")
    }
}
</script>

<style scoped>
.menu-item-prof{
    text-align: center;
    padding: 18px 6px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.main-menu-item{
    display: flex;
    justify-content: center;
    cursor: pointer;
    margin-bottom: -2px;
}


/*ABOVE 990 PX*/
@media only screen and (min-width: 990px){

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
    .main-menu-item{
        width: 25%;
    }
    #label-prof{
        margin-left: 8px;
    }
}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){
    .menu-item-prof{
        font-size: 12px;
        padding: 12px 6px;
        flex-direction: column;
    }
    .prof-label{
        margin: 3px 0px 0px 0px;
        margin-left: 0px;
        padding: 3px 5px;
        font-size: 10px;
    }
    .main-menu-item{
        width: 25%;
    }
}
</style>