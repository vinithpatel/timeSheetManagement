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
          >
            {{title}}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <div class="d-flex flex-row justify-space-between">
                <span class="text-h7">TimeSheet ID : {{ timeSheet.timeSheetId }}</span>
                <span class="text-h8" >{{ timeSheet.startDate }} to {{ timeSheet.endDate }}</span>
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
                <v-btn variant="outlined" color="warning" @click="onClickOpen" :loading="openLoading">
                    Re-Open
                </v-btn>
                <v-btn variant="outlined" color="red" @click="onClickDeny" :loading="denyLoading" >
                    Deny
                </v-btn>

                <v-btn variant="outlined" color="green" @click="onClickApprove()" :loading="approveLoading" >
                  Approve
                </v-btn>
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
    import {mapState} from "vuex" ;
    import NonEditableTable from "./NonEditableTable.vue"

    export default {
      data: () => ({
        dialog: false,
        isLoading:false,
        submitLoading:false,
        approveLoading:false,
        denyLoading:false,
        openLoading:false,
        weekData:[],
      }),

      computed:{
        ...mapState([
          'employeeId', 'employeeName', 'isAdmin'
        ]),

      },

      components:{
        NonEditableTable,
      },

      props:[
        'title', 'timeSheet'
      ],

      methods:{
        async onClickApprove(){

            this.approveLoading = true ;
               
               await this.$store.dispatch('approveTimeSheet', this.timeSheet.timeSheetId) ;
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

        async onClickOpen(){
            this.openLoading = true ;

            await this.$store.dispatch('openTimeSheet', this.timeSheet.timeSheetId) ;       
            this.$emit('getTimeSheets') ;

            this.openLoading = false ;
            this.dialog = false ;
        },

        async onClickDeny(){
            this.denyLoading = true ;

            await this.$store.dispatch('denyTimeSheet', this.timeSheet.timeSheetId) ;       
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