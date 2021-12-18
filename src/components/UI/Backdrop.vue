<template>
    <div>
        <div id="backdrop" @click="toggleSideDraw()" >
        </div>
    </div>
</template>

<script>


export default {
    name: "Backdrop",
    props: ["toggleSideDraw"],
    data(){
        return {
            
        }
    },
    methods: {
        side(){
            this.sideDrawOpen = false
        }
    }
}
</script>

<style scoped>
#backdrop{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: black;
    opacity: 0.5;
    z-index: 100;
    height: 100%;
    width: 100%;
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

}

/*BELOW 510 PX*/
@media only screen and (max-width: 510px){

}
</style>