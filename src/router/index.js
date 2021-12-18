import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from "@/components/Dashboard";
import BlogCreateMain from "@/components/Blog/CreateBlog/BlogCreateMain";
import BlogUpdateMain from "@/components/Blog/CreateBlog/BlogUpdateMain";
import BlogDisplay from "@/components/Blog/DisplayBlog/BlogDisplay";
import Profile from "@/components/Profile/Profile";
import CreateProfile from "@/components/Profile/EditProfile/CreateProfile";
import ProfileBlogs from "@/components/Profile/ProfileBlogs";
import TopicList from "@/components/TopicList";
import CreateTopic from "@/components/CreateTopic/CreateTopic";
import Login from "@/components/Authentication/Login"
import Register from "@/components/Authentication/Register"
import NotFound from "@/components/InfoPages/Error404Page"

import store from "../store"

Vue.use(Router)

const router = new Router({
    mode: "history",
    routes: [
        {path: "/", component: Dashboard, meta: {requireAuth: true}},
        {path: "/signin", component: Login},
        {path: "/signup", component: Register},
        {path: "/new", component: BlogCreateMain, meta: {requireAuth: true}},
        {path: "/blog/:id/edit", component: BlogUpdateMain, meta: {requireAuth: true}},
        {path: "/blog/:id", component: BlogDisplay, meta: {requireAuth: true}},
        {path: "/profile/:id", component: Profile, meta: {requireAuth: true}},
        {path: "/profile/:id/edit/", component: CreateProfile, meta: {requireAuth: true}},
        {path: "/profile/:id/posts/", component: ProfileBlogs, meta: {requireAuth: true}},
        {path: "/create-topic", component: CreateTopic, meta: {requireAuth: true}},
        {path: "/topics", component: TopicList, meta: {requireAuth: true}},
        {path: "/:notFound(.*)", component: NotFound},
    ]
})

router.beforeEach((to, from, next) => {
    if(to.meta.requireAuth){
        console.log(store, store.state.auth.status.loggedIn)
        if(store.state.auth.status.loggedIn){
            next()
        } else{
            next("/signin")
        }
    }else {
        next()
    }
})

export default router
