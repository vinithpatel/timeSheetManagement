import {createStore} from "vuex" 
import {startOfWeek, addDays, format, addWeeks} from "date-fns" ;
import {v4 as uuidV4} from "uuid";
import emailjs from 'emailjs-com' ;

import router from "../router.js" ;


export default createStore({
    state:{
        employeeId:1001,
        employeeName:'',
        email:'',
        isAdmin:false ,
        isLogin:false,
        daysOfWeek:[],
        selectedWeek:'2023-W36',
        startDate:"",        //format '2023-10-31'
        endDate:"",          //format '2023-10-31'
        projectList:[],

        weeklyProjectHoursList:{
            '2023-W36':[
                {
                    id:uuidV4(),
                    project:"TimeSheet Managment",
                    monday:1,
                    tuesday:1,
                    wednesday:1,
                    thursday:1,
                    friday:1,
                    saturday:1,
                    sunday:1,
            }
        ],
        '2023-W35':[
            {
                id:uuidV4(),
                project:"TimeSheet Managment",
                monday:0,
                tuesday:0,
                wednesday:0,
                thursday:0,
                friday:0,
                saturday:0,
                sunday:1,
        }
    ],
        }
    },

    mutations:{
        updateLogin(state){
            state.isLogin = !state.isLogin ;
        },

        updateEmployeeDetails(state, obj){
            state.employeeId = obj.employeeId ;
            state.employeeName = obj.employeeName ;
            state.email = obj.email ;
            state.isAdmin = obj.isAdmin ;

            console.log(obj) ;
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

        createNewRow(state){
            const newRow = {
                id:uuidV4(),
                project:null,
                monday:null,
                tuesday:null,
                wednesday:null,
                thursday:null,
                friday:null,
                saturday:null,
                sunday:null,
            }

            const {weeklyProjectHoursList, selectedWeek} = state ;
            
            if(weeklyProjectHoursList[selectedWeek] === undefined){
                weeklyProjectHoursList[selectedWeek] = [] ;
            }

            const updatedArray = [...weeklyProjectHoursList[selectedWeek], newRow]

            state.weeklyProjectHoursList[selectedWeek] = updatedArray ;
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
        }
    },

    actions:{
        updateLogin(store){
            store.commit('updateLogin');
        },
    
        createNewRow(store){
            store.commit('createNewRow') ;
            
        },

        updateRowInput(store, obj){
            store.commit('updateRowInput', obj);

        },

        updateSelectedWeek(store, value){
            store.commit('updateSelectedWeek', value);
            store.commit('updateDaysOfWeek') ;

            if(store.state.weeklyProjectHoursList[value] === undefined){
                store.commit('createNewRow') ;
            }
            
        },

        onLogout(store){
            store.commit('onLogout') ;
            router.push('/login') ;
        },

        async getProjectData(store){
            const url = `http://localhost:8001/projects/${store.state.employeeId}`;

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
                console.log(data) ;
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
                console.log(data) ;
            }
        },

        async sendEmail(store, obj){

            const {timeSheetId, startDate, endDate} = obj ;

            try{
                await emailjs.send('service_evxhn1b','template_vcdvhmt',
                {
                    employeeName: store.state.employeeName,
                    employeeId:store.state.employeeId,
                    timesheetId:timeSheetId,
                    startDate,
                    endDate

                }, '75B7CIXrKgR0C1weF')
            }catch(error){
                console.log(error) ;
            }
        }
    },

    getters:{
        getIsLogin(state){
            return state.isLogin ;
        },

        isWeekDataExist(state){
            const {selectedWeek, weeklyProjectHoursList} = state ;

            return weeklyProjectHoursList[selectedWeek] !== undefined ;
        },

        totalHours(state){
            const {weeklyProjectHoursList, selectedWeek} = state 

            let total = 0;
            weeklyProjectHoursList[selectedWeek].forEach(eachObj => {
                total+= eachObj.monday
                        +eachObj.tuesday
                        +eachObj.wednesday
                        +eachObj.thursday
                        +eachObj.friday
                        +eachObj.saturday
                        +eachObj.sunday ;
            })

            return total.toFixed(1) ;
        }
    }
})