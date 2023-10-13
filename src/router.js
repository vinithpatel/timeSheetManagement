import {createRouter, createWebHistory} from "vue-router" ;

import store from "./store/index.js"

import LoginVue from "./components/LoginVue.vue"
import HomeVue from "./components/HomeVue.vue"
//import EmployeeTimesheet from "./components/EmployeeTimesheet.vue"
import SearchTimesheet from "./components/SearchTimesheet.vue"
import ExportComponent from "./components/ExportComponent.vue" ;
import WeekSheetComponent from "./components/WeekSheetComponent.vue"
import EmployeesComponent from "./components/EmployeesComponent.vue"
import ProjectsComponent from "./components/ProjectsComponent.vue"
import CustomersComponent from "./components/CustomersComponent.vue"
import Timesheet from "./components/TimeSheet.vue"
import ReviewTimesheet from "./components/ReviewTimesheet.vue"
import ProjectAssignment from "./components/ProjectAssignment.vue"
import ProfileComponent from "./components/ProfileComponent.vue"
import NotFound from "./components/NotFound.vue"

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
            name:"Submit Timesheet",
            path:"/submit_timesheet", component:Timesheet,
        },
        {
            name:"Employee TimeSheet",
            path:'/employee_timesheet/:timeSheetId', component:WeekSheetComponent
        },

        {
            name:"Search TimeSheet",
            path:'/search_timesheet', component:SearchTimesheet
        },

        {
            name:"Export" ,
            path:'/export',
            component:ExportComponent,
        },

        {
            name:"Employees",
            path:"/employees",
            component:EmployeesComponent,
        },

        {
            name:"Projects",
            path:"/projects",
            component:ProjectsComponent,
        },

        {
            name:"Customers",
            path:"/customers",
            component:CustomersComponent,
        },

        {
            name:"Review Timesheet",
            path:"/review_timesheets",
            component:ReviewTimesheet,
        },

        {
            name:"Project Assignment",
            path:"/project_assignment/:employeeId",
            component:ProjectAssignment
        },
        {
            name:"Profile",
            path:'/profile',
            component:ProfileComponent
        },

        {
            name:"Not Found",
            path:'/:catchAll(.*)',
            component:NotFound,
        }
    ]
})


router.beforeEach((to, from, next)=>{
    const isLogin = store.getters.getIsLogin;
    
    if(to.fullPath !== '/login'){
        store.commit('setRedirectPath', to.fullPath) ;
    }
    
    if(to.name !== "Login" && !isLogin){
        next({name:'Login'})
    }else{
        next() ;
    }
})



export default router