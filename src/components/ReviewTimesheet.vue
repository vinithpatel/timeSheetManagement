<template>
    <v-container fluid class="w-100 h-100" >
      <v-card width="100%" height="100%" variant="elevated" elevation="10" :loading="loading">
          <v-toolbar
          dark
          color="#6a70eb"
          height="50"
        >
          <v-toolbar-title>Review TimeSheet</v-toolbar-title>
          
        </v-toolbar>
          <v-card-title >
            <v-row align="end">
            
            <v-col cols="12" md="3">
                <div class="d-flex flex-row align-center">
                    <v-select
                    :items="timePeriodOptions"
                    item-title="title"
                    item-value="value"
                    density="compact"
                    label="Select a Time Period"
                    hide-details
                    v-model="timePeriod"
                    @update:modelValue="onupdateInput"
                    ></v-select>
                </div>
            </v-col>
            
            <v-col cols="12" md="3">
              <v-text-field                   
                    density="compact"
                    variant="outlined"
                    placeholder="Employee Id"
                    type="number"
                    hide-details
                    v-model="searchEmployeeId"
                    @update:modelValue="onupdateInput"
                  ></v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field                   
                    density="compact"
                    variant="outlined"
                    placeholder="Employee Name"
                    type="number"
                    hide-details
                    v-model="searchEmployeeId"
                    @update:modelValue="onupdateInput"
                  ></v-text-field>
            </v-col>

            <v-col cols="12" md="12" v-if="timePeriod === 'customDate'">   
              <div class="d-flex flex-row align-center">
                  <DateRange v-on:updateDateRange="updateDateRange" />
                  <v-btn variant="text" icon="mdi mdi-magnify" class="mt-7" @click="onupdateInput">
                  </v-btn>
              </div>
            </v-col>

            
            </v-row>
          </v-card-title>

          <v-card-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left">
                      Timesheet Id
                    </th>
                    <th class="text-left">
                      Employee Id
                    </th>
                    <th class="text-left">
                      employee Name
                    </th>
                    <th class="text-center">
                      
                      Week
                      
                    </th>
                    <th class="text-center">
                      Log Hours
                    </th>
                    <th class="text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in timeSheets"
                    :key="item.name"
                  >
                    <td>{{ item.timeSheetId }}</td>
                    <td>{{ item.employeeId}}</td>
                    <td>{{ item.employeeName }}</td>
                    <td>
                        <WeekSheet :title="item.week" :timeSheet="item" @getTimeSheets="getTimeSheets" />
                    </td>
                    <td class="text-center">{{ item.logHours }}</td>
                    <td class="text-center" >
                      
                      <TimesheetStatus :status="item.status" />
                      
                    </td>
                  </tr>          
                </tbody>
              </v-table>
          </v-card-text>

          <div v-if="timeSheets.length === 0" class="d-flex flex-row justify-center align-center">
                      <p class="font-weight-medium">No Data Available</p>
          </div>
          
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
</v-container>

  </template>

  <script>
  import {subDays, subYears, format} from 'date-fns'
  import DateRange from "./DateRange.vue" 
  import WeekSheet from "./WeekSheet.vue" ;
  import TimesheetStatus from "./TimesheetStatus.vue"
  import {mapState, mapGetters} from "vuex" ;

    export default {
    name:"TimeSheet",

      data: () => ({
        dialog: false,
        loading:false,
        status:"",
        searchEmployeeId:'',
        searchEmployeeName:'',

        dateRange:{
          startDate:new Date() ,
          endDate:new Date(),
        },

        statusOptions:[
        {
          title:"All", value:""
        },
        {
          title:"Open", value:"open"
        },
        {
          title:"Submited", value:"submited"
        },
        {
          title:"Approved", value:"approved"
        },
        {
          title:"Denied", value:"denied"
        }
      ],
        
        
        timePeriodOptions:[
          {value:"month1",title:"Last 1 Month"},
          {value:"month3",title: "Last 3 Months"}, 
          {value:"month6",title:"Last 6 Months"}, 
          {value:"lastYear",title:"Previous Year"},
          {value:"currentYear",title:"Current Year"}, 
          {value:"customDate",title:"Custom Date"}
        ],

        timePeriod:null,
        
        timeSheets:[
        ]    
      }),

      components:{
        DateRange, WeekSheet, TimesheetStatus
      },

      computed:{
        ...mapState([
          'employeeId',
        ]),

        ...mapGetters([
          'getHeaders'
        ])
      },

      methods:{

        onupdateInput(){
          this.getTimeSheets() ;
        },

        getStartAndEndDate(){
          const date = new Date() ;
          let startDate = null ;
          let endDate = date ;


          switch(this.timePeriod){
            case 'month1' :
              startDate = subDays(date, 30) ;
              break;
            case 'month3' :
              startDate = subDays(date, 30*3);
              break;
            case 'month6' :
              startDate = subDays(date, 30*6);
              break;
            case 'lastYear' :
              startDate = subYears(new Date(date.getFullYear(),0,1), 1)
              endDate = subYears(new Date(date.getFullYear(),11,31), 1)
              break ;
            case 'currentYear':
              startDate = new Date(date.getFullYear(), 0, 1) ;
              break;
            case 'customDate' :
              startDate = this.dateRange.startDate ;
              endDate = this.dateRange.endDate ;
              break;
            default:
              startDate = new Date(date.getFullYear(), 0, 1) ;
              break ;
          }

          return ({
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
          })
        },

        async getTimeSheets(){

          this.loading = true ;
          
          const {startDate, endDate} = this.getStartAndEndDate()

          const url=`http://localhost:8001/reporting_manager/employees/pending_timesheets/${this.employeeId}?employee_id=${this.searchEmployeeId}&&employee_name=${this.searchEmployeeName}&&start_date=${startDate}&&end_date=${endDate}&&status=${this.status}` ;

          const options = {
            method:"GET",
            ...this.getHeaders,
          }

          const response = await fetch(url, options) 

          if(response.ok){
            const data = await response.json() ;
            this.timeSheets = data ;
            console.log(this.timeSheets)
          }
          
          this.loading = false

        },

        updateDateRange(data){
          this.dateRange = data ;
        }
      },

      mounted(){
        this.getTimeSheets()
      },

      
    }
  </script>

  <style scoped>
    .week-calendar-input{
      width:200px;
      border:1px solid #acadaa;
      padding-left:5px;
      padding-right:5px;
      font-size:15px;
    }

  </style>