<template>
    <SuiSegment id="header" inverted style="display: flex; ">
        <SuiContainer>
            <SuiMenu id="menu" inverted secondary>
                <SuiMenuItem id="draw-sui-button" style="margin-right: 14px;" >
                    <SuiButton id="hamburger-button" @click='() => console.log("prev => !prev")'>
                        <SuiImage :src="hamburgerMenu" style="width: 16px;"/>
                    </SuiButton>                    
                </SuiMenuItem>
                
                <SuiMenuItem >                            
                    <router-link to="/">
                        <div style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <SuiImage :src="mainIcon" size="mini" style="margin-right: 16px;"/>
                            <div style="display: flex; align-items: flex-end;">
                                <span style="font-size: 25px; font-weight: 700;">Pencil</span>
                                <!--span style="font-size: 16px;">.com</span-->
                            </div>
                        </div>
                    </router-link>
                </SuiMenuItem>
                <SuiMenuMenu position="right">
                    <SuiButton  @click.native="handleItemClick('home')" 
                            class="header-item" >
                        <SuiIcon name="sign-in" />SIGN IN
                    </SuiButton>
                    <SuiButton @click.native="handleItemClick('messages')" 
                            class="header-item" style="background-color: blue; font-weight: 700;" >
                        <SuiIcon name="signup" />SIGN UP
                    </SuiButton>
                </SuiMenuMenu>
            </SuiMenu>
        </SuiContainer>
    </SuiSegment>
</template>

<script>
import hamburgerMenu from "../../static/Icons/list2.svg"
import mainIcon from "../../static/Icons/pencil.svg"

export default {
    name: "Header",
    data(){
        return {
            hamburgerMenu,
            mainIcon,

            activeItem: "home"
        }
    },
    methods: {
        handleItemClick(name){
            this.activeItem = name
        }
    }
}
</script>

<style scoped>
#header{
    background-color: #54c8ff;
    border-radius: 0px;
    padding: 5px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 120;
    height: 70px;
}

#menu {
    background-color: #54c8ff;
}

#hamburger-button{
    background-color: #ff851b;
    padding: 10px 17px;
}

.header-item{
    cursor: pointer;
    padding: 13px 15px;
}
</style>