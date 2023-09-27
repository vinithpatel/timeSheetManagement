<template>
  <v-container fluid class="w-100 h-100" >
    <v-card width="100%" height="100%" variant="elevated" elevation="10" :loading="loading" >
        <v-toolbar
        dark
        color="#6a70eb"
        height="50"
        >
        <v-toolbar-title>Employee TimeSheet</v-toolbar-title>
        <v-toolbar-items>
          <v-btn @click="exportMonthly">
            Export
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
        <v-card-title >
          <v-row align="end">
          <v-col cols="12" md="6" v-if="timePeriod === 'customDate'">   
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
                  <th >
                    TimeSheet Id
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
                  
                  <th class="text-center" >
                    Status
                  </th>

                </tr>
              </thead>

              <thead>
                <tr>
                  <th class="text-left pa-0" width="200px">
                    <v-text-field
                      :loading="loading"
                      density="compact"
                      variant="outlined"
                      
                      hide-details
                      placeholder="Search TimeSheet Id"
                      type="number"
                      v-model="timeSheetId"
                      @input="onupdateInput"
                      
                      
                    ></v-text-field>
                  </th>
                  <th class="text-left pa-0" width="200px">
                    <v-text-field
                      :loading="loading"
                      density="compact"
                      variant="outlined"
                      
                      hide-details
                      placeholder="Search Employee Id"
                      v-model="employeeId"
                      @input="onupdateInput"
                      
                    ></v-text-field>
                  </th>
                  <th class="text-left pa-0">
                    <v-text-field
                      :loading="loading"
                      density="compact"
                      variant="outlined"
                      
                      hide-details
                      placeholder="Search Name"
                      v-model="employeeName"
                      @input="onupdateInput"
                    ></v-text-field>
                  </th>
                  <th class="text-left pa-0" width="250px">
                    
                    <v-select
                    :items="timePeriodOptions"
                    item-title="title"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                    placeholder="Select a Time Period"
                    hide-details
                    v-model="timePeriod"
                    @update:modelValue="onupdateInput"
                  ></v-select>
                    
                  </th>
                  <th class="text-center pa-0" width="150px">
                    
                    <v-text-field
                      :loading="loading"
                      density="compact"
                      variant="outlined"                      
                      hide-details
                      placeholder="Search Hours"
                      type="number"
                      v-model="logHours"
                      @input="onupdateInput"
                    ></v-text-field>
                  </th>
                  
                  <th class="text-center pa-0" >
                    <v-select                   
                    :items="statusOptions"
                    item-title="title"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                    placeholder="Status"
                    hide-details
                    v-model="status"
                    @update:modelValue="onupdateInput"
                  ></v-select>
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
                  <td class="text-center">
                      <WeekSheet :title="item.week" :timeSheet="item" @getTimeSheets="getTimeSheets" />
                  </td>
                  <td class="text-center">{{ item.logHours }}</td>
                  
                  <td class="text-center">
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
import jsPDF from "jspdf" ;
import "jspdf-autotable";

  export default {
  name:"TimeSheet",

    data: () => ({
      dialog: false,
      loading:false,
      timeSheetId:"",
      employeeId:"",
      employeeName:"",
      logHours:"",
      status:"",

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

      

      dateRange:{
        startDate:new Date() ,
        endDate:new Date(),
      },

      
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
        {
          employeeId:1001,
          employeeName:'vinith kumar',
          week:'2023-W37',
          logHours:"40",
          status:"Pending",

        },
        {
          employeeId:1002,
          employeeName:'Rahul',
          week:'2023-W36',
          logHours:"39",
          status:"submited",
        }
      ]    
    }),

    components:{
      DateRange, WeekSheet,TimesheetStatus
    },


    watch:{
      timeSheetId(value){
        if(value === null){
          this.timeSheetId = "";
        }
      },

      employeeId(value){
        if(value === null){
          this.employeeId = "" ;
        }
      },

      employeeName(value){
        if(value === null){
          this.employeeName = "" ;
        }
      },

      logHours(value){
        if(value === null){
          this.logHours = "" ;
        }
      },

      status(value){
        if(value === null){
          this.filterStatus = "" ;
        }
      }
    },

    methods:{

      async onupdateInput(){
        this.loading = true ;

        await this.getTimeSheets() ;

        this.loading = false ;
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
        
        const {startDate, endDate} = this.getStartAndEndDate()

        const url=`http://localhost:8001/timesheets?timesheet_id=${this.timeSheetId}&&employee_id=${this.employeeId}&&employee_name=${this.employeeName}&&log_hours=${this.logHours}&&start_date=${startDate}&&end_date=${endDate}&&status=${this.status}` ;

        const options = {
          method:"GET",
          headers:{
            'Content-Type':'application/json'
          }
        }

        const response = await fetch(url, options) 

        if(response.ok){
          const data = await response.json() ;
          
          this.timeSheets = data ;
        }
      },

      updateDateRange(data){
        this.dateRange = data ;
      },

      async exportMonthly(){
        
        //const {startDate, endDate} = this.getStartAndEndDate()

        const url=`http://localhost:8001/timesheet/monthly_report/1001` ;

        const options = {
          method:"GET",
          headers:{
            'Content-Type':'application/json'
          }
        }

        const response = await fetch(url, options) 

        if(response.ok){
          const data = await response.json();
          this.downloadPDF(data)
        }
      },

      async downloadPDF(data) {
      // Create a new jsPDF instance
          const doc = new jsPDF();

          // Add content to the PDF (e.g., timesheet data)
          //doc.text(`Employee ID : ${this.timeSheet.employeeId}`, 10, 10);
          //doc.text(`Employee Name : ${this.timeSheet.employeeName}`, 10, 20);
          //doc.text(`Period : ${this.getFormatedDateString(this.timeSheet.startDate)} - ${this.getFormatedDateString(this.timeSheet.endDate)}`, 10, 30) ;
          // Add more text or data as needed...


          const columns = ["Project Id", "Project Name", "Hours", "Cost"] ;

          let totalCost = 0 ;
          let totalHours = 0 ; 

          const tableData = data.map(each => {
                totalCost += each.cost ;
                totalHours += each.total ;

                return [each.projectId, each.projectName, each.total,  each.cost] ;
          })

          tableData.push(['Total', '', totalHours, totalCost]) ;

          doc.autoTable({
            head:[columns],
            body:tableData,
            startY:50, //adjust the vertical starting position
          })

            // Save the PDF
          doc.save("monthly_timesheet_report.pdf");
          this.$store.dispatch('showNotification', 'Pdf Downloading..')
        },

      
    },

    mounted(){
      this.getTimeSheets()
    },

    computed:{
     
    }
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