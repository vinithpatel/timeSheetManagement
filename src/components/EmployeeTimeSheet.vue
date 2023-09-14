<template>
    <v-container>
    <v-row justify="center" >
      <v-dialog
        v-model="dialog"
        persistent
        width="1024"  
      >
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            color="primary"
            v-bind="props"
            v-on:click="$store.commit('updateDaysOfWeek')"
          >
            Search TimeSheet
          </v-btn>          
        </template>
        
        <v-card>
          <v-card-title >
            <v-row align="end">
            <v-col cols="12"> 
                <div class="w-100 d-flex flex-row justify-space-between">
                <span class="text-h5">Search TimeSheet</span>
                </div>
            </v-col>
            <v-col cols="12" md="3">
                <div class="d-flex flex-row align-center">
                    <v-select
                    :items="searchByOptions"
                    item-title="title"
                    item-value="value"
                    density="compact"
                    label="Search By"
                    hide-details
                    v-model="searchBy"
                    ></v-select>
                </div>
                
            </v-col>
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
                    ></v-select>
                </div>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :loading="loading"
                density="compact"
                label="Search"
                append-inner-icon="mdi-magnify"
                single-line
                hide-details
                @click:append-inner="onClick"
                v-model="search"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" v-if="timePeriod === 'customDate'">   
                <div>
                    <DateRange v-on:updateDateRange="updateDateRange" />
                </div>
            </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left">
                      Employee Id
                    </th>
                    <th class="text-left">
                      employee Name
                    </th>
                    <th class="text-left">
                      
                      Week
                      
                    </th>
                    <th class="text-left">
                      Log Hours
                    </th>
                    <th class="text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in timeSheets"
                    :key="item.name"
                  >
                    <td>{{ item.employeeId}}</td>
                    <td>{{ item.employeeName }}</td>
                    <td><a href="#">{{ item.week}}</a></td>
                    <td>{{ item.logHours }}</td>
                    <td>{{item.status==0 ? "Pending" : "Submited"}}</td>
                  </tr>
                </tbody>
              </v-table>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
</v-container>

  </template>

  <script>
  import {subDays, subYears, format} from 'date-fns'
  import DateRange from "./DateRange.vue" 

    export default {
    name:"TimeSheet",

      data: () => ({
        dialog: false,
        loading:false,
        search:null,

        dateRange:{
          startDate:new Date() ,
          endDate:new Date(),
        },

        searchByOptions:[
          {value:"id", title:"Employee Id"},
          {value:"name",title:"Employee Name"} 
        ] ,
        
        searchBy:null,
        
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
        DateRange
      },

      methods:{

        async onClick(){
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

          const url=`http://localhost:8001/timesheets?search_by=${this.searchBy}&&start_date=${startDate}&&end_date=${endDate}&&search_q=${this.search}` ;

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
        }
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