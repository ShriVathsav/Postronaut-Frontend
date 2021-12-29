<template>
    <SuiSegment id="footer" inverted >
        <SuiContainer>
            <div id="menu" >
                <div style="width: 100%;">                         
                    <router-link to="/">
                        <div style="display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <SuiImage :src="mainIcon" size="mini" style="margin-right: 16px;"/>
                            <div style="display: flex; flex-direction: column; color: white;">
                                <span style="font-size: 28px; font-weight: 700;">Postronaut</span>
                                <span style="font-size: 12px;">Launch your posts!</span>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="footer-info">
                    Made with <SuiIcon color="red" name="heart" /> by Shrivaathsav S
                </div>
                <div class="footer-info">
                    Copyrights <SuiIcon color="violet" name="copyright" />{{new Date().getFullYear()}} - Postronaut. All Rights are Reserved.
                </div>
            </div>
        </SuiContainer>
    </SuiSegment>
</template>

<script>
import mainIcon from "../../static/Icons/mainIcon.svg"

export default {
    name: "Footer",
    data(){
        return {
            mainIcon
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
#footer{
    background-color: #54c8ff;
    border-radius: 0px;
    padding: 25px;
    width: 100%;
    margin-top: 30px;

}

#menu{
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-flow: row wrap;
}

.footer-info{
    margin-top: 14px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
}

/*ABOVE 990 PX*/
@media only screen and (min-width: 990px){

}

/*BELOW 990 PX*/
@media only screen and (max-width: 990px){

}

/*ABOVE 767 PX*/
@media only screen and (min-width: 767px){
    .footer-info{
        width: 50%;
    } 
}

/*BELOW 767 PX*/
@media only screen and (max-width: 767px){
    .footer-info{
        width: 100%;
    }
}

/*ABOVE 510 PX*/
@media only screen and (min-width: 510px){
    
}


/*BELOW 510 PX*/
@media only screen and (max-width: 510px){
    
}
</style>