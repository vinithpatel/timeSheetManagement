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
                <v-btn variant="outlined" color="green" @click="onClickSubmit" :loading="submitLoading" >
                  Submit
                </v-btn>
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

    export default {
      data: () => ({
        dialog: false,
        isLoading:false,
        submitLoading:false,
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
          const {timeSheetId, employeeName, startDate, endDate} = this.timeSheet ;

            this.approveLoading = true ;
               
               await this.$store.dispatch('approveTimeSheet', this.timeSheet.timeSheetId) ;
               await this.$store.dispatch('sendEmailOnAction',{
              timeSheetId,
              employeeName,
              startDate,
              endDate,
              message,
              action:'Approved',
            } )
               
               this.$emit('getTimeSheets') ;
               this.dialog = false ;

            this.approveLoading = false ;
            this.dialog = false ;
        },

        async onClickSubmit(){

              this.submitLoading = true ;

                await this.$store.dispatch('submitTimeSheet', this.timeSheet.timeSheetId) ;       
                await this.$store.dispatch('sendEmail', 
                    {
                        timeSheetId:this.timeSheet.timeSheetId,
                        startDate:this.timeSheet.startDate,
                        endDate:this.timeSheet.endDate ,
                    }  
                ) ;

                this.$emit('getTimeSheets') ;

                this.submitLoading = false ;
                this.dialog = false ;
                
        },

        async onClickOpen(message){
          const {timeSheetId, employeeName, startDate, endDate} = this.timeSheet ;

            this.openLoading = true ;

            await this.$store.dispatch('openTimeSheet', this.timeSheet.timeSheetId) ;  
            await this.$store.dispatch('sendEmailOnAction',{
              timeSheetId,
              employeeName,
              startDate,
              endDate,
              message,
              action:'Re-Opened',
            } )

            this.$emit('getTimeSheets') ;

            this.openLoading = false ;
            this.dialog = false ;
        },

        async onClickDeny(message){

            const {timeSheetId, employeeName, startDate, endDate} = this.timeSheet ;

            this.denyLoading = true ;

            await this.$store.dispatch('denyTimeSheet', this.timeSheet.timeSheetId) ; 
            await this.$store.dispatch('sendEmailOnAction',{
              timeSheetId,
              employeeName,
              startDate,
              endDate,
              message,
              action:'Denied',
            } )      

            this.$emit('getTimeSheets') ;

            this.denyLoading = false ;
            this.dialog = false ;
        }
      }

    }
  </script>

  <style scoped>
    .week-number-link{
        text-decoration: underline;
        color:blue;
       
    }
  </style>