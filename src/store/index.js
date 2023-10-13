import {createStore} from "vuex" 
import {startOfWeek, addDays, format, addWeeks} from "date-fns" ;
import emailjs from 'emailjs-com' ;

import router from "../router.js" ;


export default createStore({
    state:{
        jwtToken:'',
        redirectPath:'/',
        employeeDetails:{},
        employeeId:null,
        employeeName:'',
        email:'',
        isAdmin:false ,
        isLogin:false,
        daysOfWeek:[],
        selectedWeek:'2023-W36',
        startDate:"",        //format '2023-10-31'
        endDate:"",          //format '2023-10-31'
        projectList:[],
        notificationObj:{
            show:false,
            message:'',
        },

        fieldRules:{

            required(value){      
                if (value === null || value === '') {
                    return 'Required'
                }
                
                return true;       
            },

            email(value){
                if(value.includes('@') && value.includes('.com')){
                    return true
                }

                return "Invalid Email Address"
            },
        },

    },

    mutations:{

        updateJwtToken(state,jwtToken){
            state.jwtToken = jwtToken ;
            localStorage.setItem('timesheetJwtToken', JSON.stringify(jwtToken)) ;
        },

        updateEmployeeDetailsAndLogin(state, obj){
            state.employeeId = obj.employeeId ;
            state.employeeName = obj.employeeName ;
            state.email = obj.officialMail ;
            state.isAdmin = obj.isAdmin ;

            state.employeeDetails = obj ;

            state.isLogin = true ;
            router.push(state.redirectPath) ;
            
        },

        setRedirectPath(state, redirectPath){
            state.redirectPath = redirectPath ;
        },

        updateDaysOfWeek(state){
            const {selectedWeek} = state 

            const [year, weekNumber] = selectedWeek.split('-W') ;
            
            //calculat the first day of the specified week in the year
            const januaryFirst = new Date(year, 0, 1) ;
            const weekStart = startOfWeek(januaryFirst, {weekStartsOn:1}) ;


            //calculate the first day of the desired week by adding the number of weeks
            const firstDayOfTheWeek = addWeeks(weekStart, weekNumber)
            const dateFormat = format(firstDayOfTheWeek, 'E,MMM dd')

                const daysOfWeek = [dateFormat,] ; // intializing the array with first day of week with format

                let date = null
                for(let i = 1; i<=6 ; i++){

                    date = addDays(firstDayOfTheWeek,i)
                    
                    daysOfWeek.push(format(date, 'E,MMM dd'))
                    
                }

                state.daysOfWeek = daysOfWeek ;
                state.startDate = format(firstDayOfTheWeek, "yyyy-MM-dd") ;
                state.endDate = format(date, 'yyyy-MM-dd') ;

        },


        updateRowInput(state, obj){
            const {weeklyProjectHoursList, selectedWeek} = state ;
            const {id, name, value} = obj

            const updatedList = weeklyProjectHoursList[selectedWeek].map(eachObj => {
                
                if(eachObj.id === id){
                    const requiredObj = {...eachObj} ;

                    requiredObj[name] = value 

                    return requiredObj
                }
                return eachObj
            })

            state.weeklyProjectHoursList[selectedWeek] = updatedList;
        },

        updateSelectedWeek(state, value){
            
            state.selectedWeek = value ;
        },

        deleteRow(state, rowId){
            const {weeklyProjectHoursList, selectedWeek} = state 

            const updatedList = weeklyProjectHoursList[selectedWeek].filter((eachRowObj) => eachRowObj.id !== rowId)

            state.weeklyProjectHoursList[selectedWeek] = updatedList ;
        },

        onLogout(state){
            state.isLogin = false ;

            localStorage.removeItem('timesheetJwtToken') ;
        },

        showNotification(state, message){
            state.notificationObj = {
                show:true,
                message,
            }
        },

        hideNotification(state){
            state.notificationObj = {
                show:false,
                message:'',
            }
        }
    },

    actions:{
        async onSuccesfullLogin(store, jwtToken){
            store.commit('updateJwtToken', jwtToken) ;          
            await this.dispatch('getEmployeeProfileDetails') ;
        },

        checkUserValidity(store){
            let jwtToken = localStorage.getItem('timesheetJwtToken') ;

            jwtToken = JSON.parse(jwtToken) ;


            if(jwtToken !== null){
                store.state.jwtToken = jwtToken ;
                this.dispatch('getEmployeeProfileDetails')
            }
        },

        async getEmployeeProfileDetails(store){
            const url = "http://localhost:8001/employee/profile"

            const options = {
                method:"GET",
                headers:{
                    'Content-Type':"application/json",
                    "Accept":"application/json",
                    'Authorization': `Bearer ${store.state.jwtToken}`
                }
            }

            const response = await fetch(url, options) ;
            
            if(response.ok){
                const data = await response.json() ;
                console.log(data) ;
                store.commit('updateEmployeeDetailsAndLogin', data) ;
                this.dispatch('getProjectData') ;
            }
        },

        showNotification(store, message){
            store.commit('showNotification', message) 

            setTimeout(()=>{
                store.commit('hideNotification') ;
            })
            
        },

        hideNotification(store){
            store.commit('hideNotification') ;
        },

        updateRowInput(store, obj){
            store.commit('updateRowInput', obj);

        },

        updateSelectedWeek(store, value){
            store.commit('updateSelectedWeek', value);
            store.commit('updateDaysOfWeek') ;
        },

        onLogout(store){
            store.commit('onLogout') ;
            router.push('/login') ;
        },

        async getProjectData(store){
            const url = `http://localhost:8001/projects/employee/${store.state.employeeId}`;

            const options = {
                method:"GET",
                headers:{
                    'Content-Type':'application/json',
                },
            }

            const response = await fetch(url,options)
            
            if(response.ok){
                const data = await response.json() ;

                store.state.projectList = data ;
                
                console.log(store.state.projectList) ;
            }
        },



        async approveTimeSheet(store, timeSheetId){
            const url = `http://localhost:8001/timesheet/approve/${timeSheetId}` 
            const options = {
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                }
            }

            const response = await fetch(url, options) ;

            if(response.ok){
                const data = await response.json() ;
                store.commit('showNotification', 'Timesheet Approved')
                console.log(data)
            }
        },

        async submitTimeSheet(store, timeSheetId){
            const url = `http://localhost:8001/timesheet/submit/${timeSheetId}`

            const options = {
                method:"PUT",
                headers:{
                    'Content-Type':'application/json',
                    'Accept':"application/json"
                }
            }

            const response = await fetch(url, options) ;

            if(response.ok){
                const data = await response.json() ;
                
                store.commit('showNotification', data.text)
                console.log(data.text) ;
            }
        },

        async denyTimeSheet(store, timeSheetId){
            const url = `http://localhost:8001/timesheet/deny/${timeSheetId}` 
            const options = {
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                }
            }

            const response = await fetch(url, options) ;

            if(response.ok){
                const data = await response.json() ;
                store.commit('showNotification', 'Timesheet Denied')
                console.log(data) ;
            }
        },

        async openTimeSheet(store, timeSheetId){
            const url = `http://localhost:8001/timesheet/open/${timeSheetId}` 
            const options = {
                method:"PUT",
                headers:{
                    'Content-Type':'application/json'
                }
            }

            const response = await fetch(url, options) ;

            if(response.ok){
                const data = await response.json() ;
                store.commit('showNotification', 'Timesheet Re-opened')
                console.log(data) ;
            }
        },

        async sendEmail(store, obj){

            console.log(obj)

            // const {timeSheetId, startDate, endDate} = obj ;

            // try{
            //     const response = await emailjs.send('service_evxhn1b','template_vcdvhmt',
            //     {
            //         employeeName: store.state.employeeName,
            //         employeeId:store.state.employeeId,
            //         timesheetId:timeSheetId,
            //         startDate,
            //         endDate,
            //         email:store.state.employeeDetails.reportingManagerMail

            //     }, '75B7CIXrKgR0C1weF')
            //     console.log( response)
            // }catch(error){
            //     console.log(error) ;
            // }
            
        },

        async sendEmailOnAction(store, obj){
            const {timeSheetId, employeeName, startDate, endDate, message,officialMail, action} = obj

            console.log(officialMail) ;
            console.log(store.state.employeeDetails.officialMail) ;

            try{
                await emailjs.send('service_evxhn1b', 'template_pdlg2yl', {
                    action,
                    employeeName,
                    timeSheetId,
                    startDate,
                    endDate,
                    message,
                    toMail:officialMail !== null ? officialMail : '',
                    fromMail:store.state.employeeDetails.officialMail,
                }, '75B7CIXrKgR0C1weF')
            }catch(error){
                console.log(error) ;
            }
        },

        
    },

    getters:{
        getIsLogin(state){
            return state.isLogin ;
        },

        getFormatedDateString(){
            return (dateString) => {

                if(dateString === null || dateString === ''){
                    return '-'
                }

                const date = new Date(dateString) ;


                const dateFormat = format(date, "dd, MMM yyyy") ;
                
                return (dateFormat) ;
            }
        },

        getEmployeeDetails(state){
            return async (employeeId) => {
                const url = `http://localhost:8001/employee/${employeeId}`
                const options = {
                    method:"GET",
                    headers:{
                        'Content-Type':'application/json',
                        'Accept':"application/json",
                        Authorization:`Bearer ${state.jwtToken}`
                    }
                }

                const response = await fetch(url, options)

                if(response.ok){
                    return await response.json() ;
                }

                return {}
 
            }
        },

        getHeaders(state){
            return (
                {
                    headers:{
                        'Content-Type':"application/json",
                        'Accept':"application/json",
                        Authorization:`Bearer ${state.jwtToken}`
                    }
                }
            )
        }
    },

})

