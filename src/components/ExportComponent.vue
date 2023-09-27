<template>
    <v-container fluid class="w-100 h-100" >
      <v-card width="100%" height="100%" variant="elevated" elevation="10" >
          <v-toolbar
          dark
          color="#6a70eb"
          height="50"
        >
          <v-toolbar-title>Export Timesheet</v-toolbar-title>
          
        </v-toolbar>
          <v-card-title >
            
          </v-card-title>

          <v-card-text>
            <v-row justify="center">
            
            <v-col cols="12" md="3">
                <div class="d-flex flex-row align-center">
                    <v-select
                    :items="timePeriodOptions"
                    item-title="title"
                    item-value="value"
                    density="compact"
                    variant="outlined"
                    placeholder="Select Export Type"
                    hide-details
                    v-model="timePeriod"
                    @update:modelValue="onupdateInput"
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
            </v-col>

          </v-row>
          <v-row justify="center">

            <v-col cols="12" md="3">
                <div>
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      
                      hide-details
                      placeholder="Search Employee Id"
                      v-model="employeeId"
                                       
                    ></v-text-field>
                    <p class="errorMsg">{{ employeeIdMsg }}</p>
                </div>
            </v-col>
            <v-col cols="12" md="3">

            </v-col>
            </v-row>
            <v-row justify="center">
            <v-col cols="12" md="6">
              <div >
              <v-btn color="success" @click="onClickExportButton" :loading="exportLoading">
                Export
              </v-btn>
              <p class="errorMsg">{{ emptyMsg }}</p>
            </div>
            </v-col>
            

            <v-col cols="12" md="12" v-if="timePeriod === 'customDate'">   
              <div class="d-flex flex-row align-center">
                  <DateRange v-on:updateDateRange="updateDateRange" />
                  <v-btn variant="text" icon="mdi mdi-magnify" class="mt-7" @click="onupdateInput">
                  </v-btn>
              </div>
            </v-col>

            
            </v-row>
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

    export default {
      data(){
        return ({
          weekValue:'',
          monthValue:'',
          timePeriod:null,
          exportLoading:false,
          emptyMsg:'',
          employeeIdMsg:'',
          employeeId:'',
          timePeriodOptions:[
            {
              title:"Export By Week",
              value:'week'
            },
            {
              title:"Export By Month",
              value:'month'
            }
          ]
        })
      },
      components:{
        DateRange,
      },

      computed:{
        ...mapGetters([
          'getEmployeeDetails'
        ])
      },

      methods:{
        onupdateInput(value){
          this.timePeriod = value ;
        },

        async onClickExportButton(){
          this.emptyMsg = ''
          this.employeeIdMsg = ''
          this.exportLoading = false ;

          const employeeData = await this.getEmployeeDetails(this.employeeId) ;
          if(employeeData === undefined){
              this.employeeIdMsg = 'Id not exist'
              return 
          }

          let data = [] ;

          if(this.timePeriod === "week"){
            console.log("weekly export")
            data = await this.getWeekData() ;
            console.log(data) ; 
          }
          else if(this.timePeriod === "month"){
            console.log("weekly export")
            data = await this.getMonthData() ;
            console.log(data) ;
          }

          if(data.length !== 0){
            const obj = {
              employeeData,
              data
            }

            this.downloadPDF(obj) ;
          }else{
            this.emptyMsg = 'No Data Availble'
          }

          this.exportLoading = false;
        },

        async getWeekData(){
          const url = `http://localhost:8001/timesheet/employee/${this.employeeId}/weekly_export/${this.weekValue}`
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

          return '-'
        },


        async getMonthData(){
          

          const url = `http://localhost:8001/timesheet/employee/${this.employeeId}/monthly_export/${this.monthValue}`
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

          return [];
        },
        async downloadPDF(obj) {
          const {employeeData, data} = obj ;

        // Create a new jsPDF instance
          const doc = new jsPDF();

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

            // Save the PDF
            if(this.timePeriod === "week"){
              doc.save("weekly_timesheet_report.pdf");
            }else{
              doc.save("monthly_timesheet_report.pdf");
            }
          
          this.$store.dispatch('showNotification', 'Pdf Downloading..')
        },

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