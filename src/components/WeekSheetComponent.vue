<template>
  <v-container class="w-100 h-100 d-flex flex-row justify-center align-start" >
    <div v-if="loading" class="d-flex flex-row align-center justify-center" style="height:200px; width:100%; border:1px solid red;">

    </div>
    <v-card width="1024" v-if="!loading" variant="elevated" elevation="10" :loading="loading" >
            <v-toolbar
            dark
            color="#6a70eb"
            height="50"
            >
                <v-toolbar-title>Week TimeSheet</v-toolbar-title>
            </v-toolbar>
            <v-card-title >
                <div class="d-flex flex-row justify-space-between">
                    <span class="text-h7">TimeSheet ID : {{ $route.params.timeSheetId }}</span>
                    <p style="font-size:14px;" >{{ getFormatedDateString(timeSheet.startDate) }} - {{ getFormatedDateString(timeSheet.endDate) }}</p>
                    <span class="text-h9">Employee ID: {{ timeSheet.employeeId }}</span>
                </div>
            </v-card-title>

            <v-card-text>
                <div>
                    <NonEditableTable v-bind:timeSheetObj="timeSheet" />
                </div>
            </v-card-text>

            
            <v-card-actions>
            <v-spacer></v-spacer>
            <div v-if="isAdmin && timeSheet.status === 'submited'">
                
                <AdminButton color="warning" text="Re-open" @onClickOpen="onClickOpen" :loading="openLoading"/>

                
                <AdminButton color="red" text="Deny" @onClickDeny="onClickDeny" :loading="denyLoading"/>

              
                <AdminButton color="green" text="Approve" @onClickApprove="onClickApprove" :loading="approveLoading" />
            </div>

            <!-- <div v-if="!isAdmin && timeSheet.status === 'open'" >
                <v-btn variant="outlined" color="green" @click="onClickSubmit" :loading="submitLoading" >
                  Submit
                </v-btn>
            </div> -->
            
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import NonEditableTable from "./NonEditableTable.vue"
import AdminButton from "./AdminButton.vue"
import {mapGetters, mapState} from "vuex" ;

export default {
    data(){
        return {
            loading:true,
            timesheet:{},
            openLoading:false,
            denyLoading:false,
            approveLoading:false,
            submitLoading:false,
        }
    },

    components:{
        NonEditableTable,AdminButton
    },

    computed:{
        ...mapState([
            'isAdmin'
        ]),

        ...mapGetters([
            'getFormatedDateString'
        ])
    },

    methods:{
        async getTimeSheet(){
        this.loading = true ;

        const url = `http://localhost:8001/timesheet/${this.$route.params.timeSheetId}` ;

        const options = {
            method:"GET",
            headers:{
                'Content-Type':"application/json",
            }
        };

        const response = await fetch(url, options) ;

        if(response.ok){
            const data = await response.json() ;
            console.log(data) ;
            this.timeSheet = data ;
            this.loading = false ; 
        }

        },
        async onClickApprove(message){
          const {timeSheetId, employeeName, startDate, endDate, officialMail} = this.timeSheet ;

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
               
            this.getTimeSheet() ;
            this.approveLoading = false ;
            
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

                this.getTimeSheet() ;

                this.submitLoading = false ;
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

            this.getTimeSheet() ;

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

            this.getTimeSheet() ;

            this.denyLoading = false ;
            this.dialog = false ;
        },
    },

    

    async mounted(){

        await this.getTimeSheet()
        this.$store.dispatch('updateSelectedWeek', this.timeSheet.week) ;
    }
}
</script>

<style>

</style>