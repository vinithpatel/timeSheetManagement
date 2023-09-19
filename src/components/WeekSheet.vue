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
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </template>
  <script>
    import NonEditableTable from "./NonEditableTable.vue"

    export default {
      data: () => ({
        dialog: false,
        isLoading:false,
        weekData:[],
      }),

      components:{
        NonEditableTable,
      },

      props:[
        'title', 'timeSheet'
      ],

    }
  </script>

  <style scoped>
    .week-number-link{
        text-decoration: underline;
        color:blue;
       
    }
  </style>