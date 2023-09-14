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
              <input class="week-calendar-input" type="week" v-model="calendarValue"
                @change="onChangeWeek"
              />
            </div>
            
          </v-card-title>

          <v-card-text>
            
            <div >
              <EditableTable v-if="timeSheetData.length === 0 || timeSheetData[0].isSubmited === 0" v-bind:timeSheetData="timeSheetData"/>
              <NonEditableTable v-else v-bind:timeSheetData="timeSheetData" />
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
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = false"
              v-bind:disabled="timeSheetData.length === 0 || timeSheetData[0].isSubmited === 1"
            >
              Submit
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
  import {getWeek} from "date-fns"

    export default {
    name:"TimeSheet",

      data: () => ({
        dialog: false,
        calendarValue:"",
        timeSheetData:[],
      }),

      components:{
        EditableTable,NonEditableTable,//TableVue,
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
          this.$store.dispatch('updateSelectedWeek', this.calendarValue) ;
          this.getTimeSheet()
        },

        async getTimeSheet(){
          
            const url = `http://localhost:8001/timesheet/?employee_id=${this.employeeId}&&start_date=${this.startDate}&&end_date=${this.endDate}`
            
            const options = {
              method:"GET",
              headers:{
                'Content-Type':'application/json',
              }
            }

            const response = await fetch(url, options) ;

            if(response.ok){
              const data = await response.json() ;
              console.log(data);
              this.timeSheetData = data ;
            }
        }

      },

      created(){
        const currentDate = new Date() ;

        // format Value ex:2023-W36

        const weekViewFormat = `${currentDate.getFullYear()}-W${getWeek(currentDate, {weekStartsOn:1, firstWeekContainsDate:2})}` ;
        
        //setting up the calendarValue data property to show current week in calendar
        this.calendarValue = weekViewFormat ;

        // passing weekFormat to store state 
        this.$store.dispatch('updateSelectedWeek', weekViewFormat) ;

        //check the week data exist or not using store getter method
        const isWeekDataExist = this.$store.getters.isWeekDataExist ;
        
        if(!isWeekDataExist){
          this.$store.dispatch('createNewRow') ;
        }
        
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

  </style>