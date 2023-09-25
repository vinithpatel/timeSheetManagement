<template>
    <v-container>
    <v-row justify="center">
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
            Submit TimeSheet
          </v-btn>          
        </template>
        
        <v-card>
          <v-card-title>
            <div class="w-100 d-flex flex-row justify-space-between">
              <span class="text-h5">TimeSheet</span>

              <TimesheetStatus v-if="timeSheetObj !== undefined" :status="timeSheetObj.status" />

              <input class="week-calendar-input" type="week" v-model="calendarValue"
                @change="onChangeWeek"
              />
            </div>
            
          </v-card-title>

          <v-card-text>
            
            <div >
              <div v-if="timeSheetObj === undefined" class="create-sheet-card d-flex flex-row align-center justify-center" >
                <v-btn color="#a83299" @click="createSheet" :loading="createSheetLoading">
                  Create Sheet
                </v-btn>
              </div>
            
              <EditableTable v-else-if="timeSheetObj.status === 'open'" v-bind:timeSheetObj="timeSheetObj" @getTimeSheet="getTimeSheet"/>
              <NonEditableTable v-else v-bind:timeSheetObj="timeSheetObj" />
            </div>
          

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
  import {mapState} from "vuex" ;
  //import TableVue from './TableVue.vue';
  import EditableTable from "./EditableTable.vue"
  import NonEditableTable from "./NonEditableTable.vue"
  import TimesheetStatus from "./TimesheetStatus.vue"
  import {getWeek} from "date-fns"

    export default {
    name:"TimeSheet",

      data: () => ({
        dialog: false,
        createSheetLoading:false,
        calendarValue:"",
        timeSheetObj:undefined,
      }),

      components:{
        EditableTable,NonEditableTable,TimesheetStatus//TableVue,
      },

      computed:{
        ...mapState([
          'startDate', 'endDate', 'employeeId'
        ]),

        checkWeekDataExist(){
          return this.$store.getters.isWeekDataExist
        }
      },

      methods:{
        
        onChangeWeek(){
          if(this.calendarValue !== ''){
            this.$store.dispatch('updateSelectedWeek', this.calendarValue) ;
            this.getTimeSheet()
          }          
        },

        async getTimeSheet(){
          
            const url = `http://localhost:8001/timesheet/employee/${this.employeeId}?start_date=${this.startDate}&&end_date=${this.endDate}`
          
            const options = {
              method:"GET",
              headers:{
                'Content-Type':'application/json',
              }
            }

            const response = await fetch(url, options) ;

            if(response.ok){
              const jsonData = await response.json() ;

              this.timeSheetObj = jsonData.data ;
              
            }
        },

        async createSheet(){

          this.createSheetLoading = true ;

          const url = "http://localhost:8001/timesheet/create"
          const body = {
            employeeId:this.employeeId,
            week:this.calendarValue,
            startDate:this.startDate,
            endDate:this.endDate
          }

          const options = {
            method:"POST",
            headers:{
              'Content-Type':"application/json",
              "Accept":"application/json"
            },
            body:JSON.stringify(body)
          }

          const response = await fetch(url, options) ;
          
          if(response.ok){
            const jsonData = await response.json() ;
            console.log(jsonData.timeSheetId) ;
                        
            this.timeSheetObj = {
              timeSheetId:jsonData.timeSheetId,
              week:this.calendarValue,
              status:'open'
            }

            
          }

          this.createSheetLoading = false;
        }
        
      },

      created(){
        const currentDate = new Date() ;

        // format Value ex:2023-W36

        const weekViewFormat = `${currentDate.getFullYear()}-W${getWeek(currentDate, {weekStartsOn:1, firstWeekContainsDate:2})}` ;
        
        //setting up the calendarValue data property to show current week in calendar
        this.calendarValue = weekViewFormat ;

        console.log()

        // passing weekFormat to store state 
        this.$store.dispatch('updateSelectedWeek', weekViewFormat) ;
        
        //const dataInStringFormat = localStorage.getItem('weeklyData')
        //const weeklyData = JSON.parse(dataInStringFormat) ;       
      },

      mounted(){
        this.getTimeSheet()
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

    .create-sheet-card{
      height:200px;
    }

  </style>