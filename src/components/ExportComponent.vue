<template>
    <v-container fluid class="w-100" style="height:100vh" >
      <v-card class="overflow-y-auto" width="100%" height="100%" variant="elevated" elevation="10" >
          <v-toolbar
          dark
          color="#6a70eb"
          height="50"
        >
          <v-toolbar-title>Export Timesheet</v-toolbar-title>
          
        </v-toolbar>
          <v-card-title >
            <v-row >
              <v-col cols="12" md="3">
                  <div class="d-flex flex-row align-center">
                      <v-select
                      :items="timePeriodOptions"
                      item-title="title"
                      item-value="value"
                      density="compact"
                      variant="outlined"
                      placeholder="Time Period"
                      hide-details
                      v-model="timePeriod"
                      @update:modelValue="onSelectTimePeriod"
                      ></v-select>       
                  </div>               
              </v-col>

              <v-col cols="12" md="3">
                <div v-if="timePeriod==='week'">
                    <input type="week" class="week-calendar-input" v-model="weekValue" />
                </div>
                <div v-if="timePeriod==='month'">
                  <input type="month" class="week-calendar-input" v-model="monthValue" />
                </div>
                <div v-if="timePeriod==='custom'">
                  <DateRange v-on:updateDateRange="updateDateRange" />
                </div>
              </v-col>
          </v-row>

          <v-row>
            <v-col cols="2">
              <div>
                <v-radio-group
                  v-model="exportType"
                  inline
                  
                >
                  <v-radio
                    label="PDF"
                    value="pdf"
                  ></v-radio>
                  <v-radio
                    label="EXCEL"
                    value="excel"
                  ></v-radio>
                </v-radio-group>
              </div>
            </v-col>
              
            <v-col cols="2">
              <div >
              <v-btn color="success" @click="onClickExportButton" :loading="exportLoading">
                Export
              </v-btn>
              <p class="errorMsg">{{ emptyMsg }}</p>
            </div>

            </v-col>
            
            </v-row>
            <v-row justify="end">

              <v-col cols="12" md="3">
                  <div>
                    <v-text-field
                        density="compact"
                        variant="outlined"
                        type="number"
                        hide-details
                        placeholder="Search Employee Id"
                        v-model="searchEmployeeId"
                        @input="onupdateinput"
                                        
                      ></v-text-field>
                      <p class="errorMsg">{{ employeeIdMsg }}</p>
                  </div>
              </v-col>
              <v-col cols="12" md="3">
                  <div>
                    <v-text-field
                        density="compact"
                        variant="outlined"
                        
                        hide-details
                        placeholder="Search Employee Name"
                        v-model="searchEmployeeName"
                        @input="onupdateinput"
                                        
                      ></v-text-field>
                      <p class="errorMsg">{{ employeeIdMsg }}</p>
                  </div>
              </v-col>
              </v-row>
             

          </v-card-title>
          <v-table density="compact">
              
              <thead>
                <tr>
                  <th>
                    <v-checkbox
                      v-model="isSelectAll"
                      label="All"
                      color="primary"
                      hide-details
                      @update:modelValue="onClickSelectAll"
                    ></v-checkbox>
                  </th>
                  <th >
                    Employee Id
                  </th>

                  <th >
                    Employee Name
                  </th>

                  <th >
                    Email
                  </th>

                  <th>
                    Position
                  </th>

                </tr>
              </thead>

              <tbody>

                <tr
                  v-for="item in employeesList"
                  :key="item"
                >
                  <td>
                    <v-checkbox
                      v-model="selectedEmployeeIds"
                      color="primary"
                      :value="item.employeeId"
                      hide-details
                    ></v-checkbox>
                  </td>
                  <td >{{ item.employeeId }}</td>
                  <td>{{ item.employeeName}}</td>
                  <td>{{ item.employeeEmail }}</td>
                  <td>{{ item.positionName }}</td>         
                </tr>

              </tbody>
            </v-table>
          <v-card-text>
            
            
          </v-card-text>         
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
  </v-container>

</template>

  <script>
    import DateRange from "./DateRange.vue" ;
    import {format, startOfWeek, addWeeks, addDays} from "date-fns" ;
    import jsPDF from "jspdf" ;
    import "jspdf-autotable";
    import {mapGetters} from "vuex" ;
    import { utils, writeFile } from 'xlsx';

    export default {
      data(){
        return ({
          weekValue:'',
          monthValue:'',
          timePeriod:null,
          exportLoading:false,
          emptyMsg:'',
          employeeIdMsg:'',
          searchEmployeeId:'',
          searchEmployeeName:'',
          employeesList:[],
          exportType:null,
          timePeriodOptions:[
            {
              title:"Export By Week",
              value:'week'
            },
            {
              title:"Export By Month",
              value:'month'
            },
            {
              title:"Custom Date",
              value:'custom'
            }
          ],

          selectedEmployeeIds:[],
          isSelectAll:false,
          startDate:null,
          endDate:null,
        })
      },

      components:{
        DateRange,
      },

      computed:{
        ...mapGetters([
          'getEmployeeDetails', 'getFormatedDateString'
        ])
      },

      watch:{
        selectedEmployeeIds(value){
          if(value.length !== this.employeesList.length){
            this.isSelectAll = false ;
          }else{
            this.isSelectAll = true ;
          }
        }
      },

      methods:{

        onClickSelectAll(value){
          if(value){
              this.selectedEmployeeIds = this.employeesList.map(each => each.employeeId)
            }else{
              this.selectedEmployeeIds = [] ;
          }
        },

        onSelectTimePeriod(value){
          this.timePeriod = value ;
        },

        onupdateinput(){
          this.getEmployees()
        },

        updateDateRange({startDate, endDate}){
            this.startDate = format(startDate, 'yyyy-MM-dd') ;
            this.endDate = format(endDate, 'yyyy-MM-dd') ;

        },

        async onClickExportButton(){
          this.emptyMsg = ''
          this.employeeIdMsg = ''
          this.exportLoading = true ;

          let dataList = []

          for (let employeeId of this.selectedEmployeeIds){

              const employeeData = await this.getEmployeeDetails(employeeId) ;

              let data = [] ;
              if(this.timePeriod === "week"){                
                data = await this.getWeekData(employeeId) ;                
              }
              else if(this.timePeriod === "month"){                     
                data = await this.getMonthData(employeeId) ;                
              }
              else if(this.timePeriod === 'custom'){
                data = await this.getCustomDateData(employeeId)
              }

              dataList.push({employeeData, data})

          }

          if(dataList.length !== 0){
            
            if(this.exportType === 'pdf'){
              this.downloadPDF(dataList) ;
            }else{
              this.downloadExcel(dataList) ;
            }
            
          }else{
            this.emptyMsg = 'No Data Availble'
          }

          this.exportLoading = false;
        },

        async getWeekData(employeeId){
          const url = `http://localhost:8001/timesheet/employee/${employeeId}/weekly_export/${this.weekValue}`
          console.log(url) ;
          const options = {
            method:"GET",
            headers:{
              'Content-Type':'application/json',
            },
          }

          const response = await fetch(url, options) ;

          if(response.ok){
            return await response.json() ;
          }

          return []
        },

        getPeriod(){
          if(this.timePeriod === "week"){
            const [year, weekNumber] = this.weekValue ;

            //calculat the first day of the specified week in the year
            const januaryFirst = new Date(year, 0, 1) ;
            const weekStart = startOfWeek(januaryFirst, {weekStartsOn:1}) ;


            //calculate the first day of the desired week by adding the number of weeks
            const firstDayOfTheWeek = addWeeks(weekStart, weekNumber)
            const lastDayOfTheWeek = addDays(firstDayOfTheWeek,6)

            return `${format(firstDayOfTheWeek, 'MMM dd')} - ${format(lastDayOfTheWeek, 'MMM dd')} (${this.weekValue})`
            
          }
          else if(this.timePeriod === "month"){
            const [year, month] = this.monthValue.split("-") ;

            const startDate = new Date(year, month-1, 1) ;

            return format(startDate, 'LLL-yyyy') ;
            
          }
          else if(this.timePeriod === "custom"){
            return `${this.getFormatedDateString(this.startDate)} - ${this.getFormatedDateString(this.endDate)}` ;
          }

          return '-'
        },


        async getMonthData(employeeId){
          
            const url = `http://localhost:8001/timesheet/employee/${employeeId}/monthly_export/${this.monthValue}`
            
            const options = {
              method:"GET",
              headers:{
                'Content-Type':'application/json',
              },
            }

            const response = await fetch(url, options) ;

            if(response.ok){
              const data = await response.json() ;
              return data
            }

          
            return [];
        },


        async getCustomDateData(employeeId){
          const url = `http://localhost:8001/timesheet/employee/${employeeId}/custom_export/?startDate=${this.startDate}&&endDate=${this.endDate}`
            
            const options = {
              method:"GET",
              headers:{
                'Content-Type':'application/json',
              },
            }

            const response = await fetch(url, options) ;

            if(response.ok){
              const data = await response.json() ;
              return data
            }

          
            return [];
        },

        async downloadPDF(dataList) {

          
          // Create a new jsPDF instance
          const doc = new jsPDF();

          
          for(let obj of dataList){

                const {employeeData, data} = obj ;

                // Add content to the PDF (e.g., timesheet data)
                doc.text(`Employee ID : ${employeeData.employeeId}`, 10, 10);
                doc.text(`Employee Name : ${employeeData.employeeName}`, 10, 20);
                doc.text(`Position : ${employeeData.position}`,10, 30);
                doc.text(`Period : ${this.getPeriod()}`, 10, 40)
                //doc.text(`Period : ${this.getFormatedDateString(this.timeSheet.startDate)} - ${this.getFormatedDateString(this.timeSheet.endDate)}`, 10, 30) ;
                // Add more text or data as needed...


                const columns = ["Project Id", "Project Name", "Hours", "Cost (Euros)"] ;

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

                if(dataList[dataList.length-1] !== obj){
                  doc.addPage() ;
                }
                
          }

          // Save the PDF
          if(this.timePeriod === "week"){
            doc.save("weekly_report_report.pdf");
          }else if(this.timePeriod === 'month'){
            doc.save("monthly_report.pdf");
          }else if(this.timePeriod === 'custom'){
            doc.save("custom_date_report.pdf")
          }
          
          this.$store.dispatch('showNotification', 'Pdf Downloading..')
        },

        downloadExcel(dataList){
          //creating work book 
          const wb = utils.book_new();

          for (let obj of dataList){
            const {employeeData, data} = obj ;
            let totalCost = 0 ;
            let totalHours = 0 ;

            const tableData = data.map(each => {
                  totalCost += each.cost ;
                  totalHours += each.total ;

                  return [each.projectId, each.projectName, each.total,each.rate, each.cost] ;
            })
  
            const exportData = [
              ["Employee Id",employeeData.employeeId],
              ["Employee name",employeeData.employeeName],
              ["Position",employeeData.position],
              ["Period", this.getPeriod()],
              [],
              ["Project Id", "Project Name", "Hours","Rate", "Cost (Euros)"],
              ...tableData,
              ["Total", '', totalHours,'', totalCost]
            ];

            //creating work sheet for each employee
            const ws = utils.json_to_sheet(exportData);
            utils.book_append_sheet(wb, ws, employeeData.employeeName) ;
            
          }
          
          
          writeFile(wb, this.timePeriod === "week" ? 'weekly_timesheet_report.xlsx' : 'monthly_timesheet_report.xlsx') ;

        },

        async getEmployees(){
            this.loading = true ;

            const url = `http://localhost:8001/employees?employeeId=${this.searchEmployeeId}&&employeeName=${this.searchEmployeeName}`
            const options = {
              method:"GET",
              headers:{
                'Content-Type':"application/json",
              }
            }

            const response = await fetch(url, options) ;

            if(response.ok){
              const data = await response.json() ;
              this.employeesList = data
              this.loading = false
              
            }
        },

      },

      mounted(){
        this.getEmployees() ;
      }
    }
  </script>

  <style scoped>
    .week-calendar-input{
      width:250px;
      height:40px;
      border:1px solid #acadaa;
      padding-left:5px;
      padding-right:5px;
      font-size:15px;
    }

    .errorMsg{
      color:red;
    }
  </style>