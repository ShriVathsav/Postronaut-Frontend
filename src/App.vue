<template>
    <div id="body">
        <portal-target name="semantic-ui-vue" />
        <div>
            <Header />
        </div>
        <div id="main">
            <SuiContainer>
                <router-view :key="$route.fullPath" />
            </SuiContainer>
        </div>
        <div><Footer /></div>
    </div>
</template>

<script>
import Header from "./components/UI/Header";
import Footer from "./components/UI/Footer";
import { setAxiosHeader } from "./components/Utility/Utility";

//import axios from "axios";

export default {
    name: "App",
    components: { Header, Footer },
    created() {
        setAxiosHeader();
    },
};
</script>

<style scoped>
#body {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    line-height: normal;
}

#main {
    flex: 1 0 auto;
    margin-top: 74px;
}
</style>
