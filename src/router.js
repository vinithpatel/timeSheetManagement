import {createRouter, createWebHistory} from "vue-router" ;

//import store from "./store/index.js"

import LoginVue from "./components/LoginVue.vue"
import HomeVue from "./components/HomeVue.vue"

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            name:'Login',
            path:"/login", component:LoginVue ,
        },
        {
            name:"Home",
            path:"/", component:HomeVue,
        }
    ]
})

/*
router.beforeEach((to, from, next)=>{
    const isLogin = store.getters.getIsLogin;
    
    if(to.name === "Home" && !isLogin){
        next({name:'Login'})
    }else{
        next() ;
    }
})
*/


export default router