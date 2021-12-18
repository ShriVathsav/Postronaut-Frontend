<template>
    <div class="main-div" id="popup" :style="!showPopup ? 'visibility: hidden;' : ''">
        <div class="sub-div"></div>
        <div id="sub-div2">
            <slot />
        </div>
    </div>
</template>

<script>

export default {
    name: "PopUp",
    props: ["showPopup"],
    data(){
        return {

        }
    },
    methods: {

    }
}
</script>

<style scoped>
.main-div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
}
.sub-div{
    border-top: 1px solid #d4d4d5;
    border-left: 1px solid #d4d4d5;
    transform: rotate(45deg);
    height: 15.14px;
    width: 15.14px;
    margin-bottom: -7.5px;
    background-color: white;
    box-shadow: -1px 4px -1px 2px #bababc;
}
#sub-div2{
    border: 1px solid #d4d4d5;
    background-color: white;
    padding: 10px;
    border-radius: .28571429rem;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
}
</style>