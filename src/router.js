import {createRouter, createWebHistory} from "vue-router" ;

import store from "./store/index.js"

import LoginVue from "./components/LoginVue.vue"
import HomeVue from "./components/HomeVue.vue"
import EmployeeTimesheet from "./components/EmployeeTimesheet.vue"
import SearchTimesheet from "./components/SearchTimesheet"

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
        },
        {
            name:"Employee TimeSheet",
            path:'/employee_timesheet', component:EmployeeTimesheet
        },

        {
            name:"Search TimeSheet",
            path:'/search_timesheet', component:SearchTimesheet
        }
    ]
})


router.beforeEach((to, from, next)=>{
    const isLogin = store.getters.getIsLogin;
    
    if(to.name !== "Login" && !isLogin){
        next({name:'Login'})
    }else{
        next() ;
    }
})



export default router