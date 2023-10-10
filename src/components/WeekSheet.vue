<template>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        width="1024"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            v-bind="props"
            class="week-number-link"
            @click="onClickWeek"
          >
            {{title}}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <div class="d-flex flex-row justify-space-between">
                <span class="text-h7">TimeSheet ID : {{ timeSheet.timeSheetId }}</span>
                <p style="font-size:14px;" >{{ getFormatedDateString(timeSheet.startDate) }} - {{ getFormatedDateString(timeSheet.endDate) }}</p>
                <span class="text-h9">Employee ID: {{ timeSheet.employeeId }}</span>
            </div>
            
          </v-card-title>
          <v-card-text>
            <NonEditableTable v-bind:timeSheetObj="timeSheet" />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-export-variant" @click="downloadPDF">

            </v-btn>
            <v-btn
                color="blue-darken-1"
                variant="text"
                @click="dialog = false"
                >
                  Cancel
            </v-btn>

            <div v-if="isAdmin && timeSheet.status === 'submited'">
                
                <AdminButton color="warning" text="Re-open" @onClickOpen="onClickOpen" :loading="openLoading"/>

                
                <AdminButton color="red" text="Deny" @onClickDeny="onClickDeny" :loading="denyLoading"/>

              
                <AdminButton color="green" text="Approve" @onClickApprove="onClickApprove" :loading="approveLoading" />
            </div>

            <div v-if="!isAdmin && timeSheet.status === 'open'" >
                <router-link :to="`submit_timesheet/?calendarValue=${timeSheet.week}`">
                  <v-btn variant="outlined" color="green" >
                    Edit & Submit
                  </v-btn>
                </router-link>
            </div>
            <div v-if="!isAdmin && timeSheet.status === 'denied'">
              <router-link :to="`submit_timesheet/?calendarValue=${timeSheet.week}`">
                  <v-btn variant="outlined" color="green" >
                    Re-Open
                  </v-btn>
                </router-link>
            </div>
           
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>

  <script>
    import {mapState, mapGetters} from "vuex" ;
    import NonEditableTable from "./NonEditableTable.vue"
    import AdminButton from "./AdminButton.vue";
    import jsPDF from "jspdf";
    import "jspdf-autotable";



    export default {
      data: () => ({
        dialog: false,
        isLoading:false,
        approveLoading:false,
        denyLoading:false,
        openLoading:false,
      }),

      computed:{
        ...mapState([
          'employeeId', 'employeeName', 'isAdmin'
        ]),

        ...mapGetters([
          'getFormatedDateString' 
        ]),

      },

      components:{
        NonEditableTable,AdminButton
      },

      props:[
        'title', 'timeSheet'
      ],

      methods:{

        onClickWeek(){
          this.$store.dispatch('updateSelectedWeek', this.timeSheet.week) ;
        },

        async onClickApprove(message){
          const {timeSheetId, employeeName, startDate, endDate,officialMail} = this.timeSheet ;

            this.approveLoading = true ;
               
               await this.$store.dispatch('approveTimeSheet', this.timeSheet.timeSheetId) ;
               await this.$store.dispatch('sendEmailOnAction',{
              timeSheetId,
              employeeName,
              startDate,
              endDate,
              message,
              officialMail,
              action:'Approved',
            } )
               
               this.$emit('getTimeSheets') ;
               this.dialog = false ;

            this.approveLoading = false ;
            this.dialog = false ;
        },


        async onClickOpen(message){
          const {timeSheetId, employeeName, startDate, endDate, officialMail} = this.timeSheet ;

            this.openLoading = true ;

            await this.$store.dispatch('openTimeSheet', this.timeSheet.timeSheetId) ;  
            await this.$store.dispatch('sendEmailOnAction',{
              timeSheetId,
              employeeName,
              startDate,
              endDate,
              message,
              officialMail,
              action:'Re-Opened',
            } )

            this.$emit('getTimeSheets') ;

            this.openLoading = false ;
            this.dialog = false ;
        },

        async onClickDeny(message){

            const {timeSheetId, employeeName, startDate, endDate,officialMail} = this.timeSheet ;

            this.denyLoading = true ;

            await this.$store.dispatch('denyTimeSheet', this.timeSheet.timeSheetId) ; 
            await this.$store.dispatch('sendEmailOnAction',{
              timeSheetId,
              employeeName,
              startDate,
              endDate,
              message,
              officialMail,
              action:'Denied',
            } )      

            this.$emit('getTimeSheets') ;

            this.denyLoading = false ;
            this.dialog = false ;
        },

        async downloadPDF() {
      // Create a new jsPDF instance
          const doc = new jsPDF();

          // Add content to the PDF (e.g., timesheet data)
          doc.text(`Employee ID : ${this.timeSheet.employeeId}`, 10, 10);
          doc.text(`Employee Name : ${this.timeSheet.employeeName}`, 10, 20);
          doc.text(`Period : ${this.getFormatedDateString(this.timeSheet.startDate)} - ${this.getFormatedDateString(this.timeSheet.endDate)}`, 10, 30) ;
          // Add more text or data as needed...

          const options={
            method:"GET",
            'Content-Type':'application/json'
          }

          const response = await fetch(`http://localhost:8001/timesheet/export/${this.timeSheet.timeSheetId}`, options) ;

          if(response.ok){
            const data = await response.json() ;

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
            doc.save("weekly_timesheet_report.pdf");
            this.$store.dispatch('showNotification', 'Pdf Downloading..')

          }
        },
      }

    }
  </script>

  <style scoped>
    .week-number-link{
        text-decoration: underline;
        color:blue;
       
    }
  </style>