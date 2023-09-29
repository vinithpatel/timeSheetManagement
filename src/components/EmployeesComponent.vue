<template>
  <v-container fluid class="w-100 h-100" >
    <v-card class="h-100" variant="elevated" elevation="10">
        <v-toolbar
        dark
        color="#6a70eb"
        height="50"
        >
        <v-toolbar-title>Employee TimeSheet</v-toolbar-title>
        </v-toolbar>
        <v-card-title>
          <v-row>
                <v-col cols="12" md="3" >
                    <v-text-field
                      :loading="loading"
                      density="compact"
                      variant="outlined"
                      
                      hide-details
                      placeholder="Search Employee Id"
                      v-model="employeeId"
                      @input="onupdateInput"
                      
                ></v-text-field>
                </v-col> 
                <v-col cols="12" md="3">
                    <v-text-field
                      :loading="loading"
                      density="compact"
                      variant="outlined"
                      
                      hide-details
                      placeholder="Search Name"
                      v-model="employeeName"
                      @input="onupdateInput"
                    ></v-text-field>
                </v-col>   
        </v-row>
        </v-card-title>
        <v-card-text>
          <v-list v-if="!loading">
            <v-list-item
            v-for="item in employeesList"
            :key="item.employeeId"
            :title="`${item.employeeId} - ${item.employeeName}`"
            :subtitle="`Position : ${item.positionName}`"
            elevation="4"
            lines="three"
            variant="elevated"
            class="mb-2"
            :rounded="true"
          >
    
            <ProjectAssignment :employeeObj="item">
              <template v-slot="{openDialog}">
                <v-btn color="primary" @click="openDialog">Edit Projects</v-btn>
              </template>
            </ProjectAssignment>
           
        </v-list-item>
          </v-list>
          <div v-if="employeesList.length === 0" class="d-flex flex-row justify-center">
              No Data Found
          </div>
        </v-card-text>
        
         
            <div v-if="loading" style="height:400px; width:100%;" class="d-flex flex-row align-center justify-center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
            
    </v-card>
  </v-container>
</template>

<script>
import ProjectAssignment from './ProjectAssignment.vue'

export default {

  data(){
    return ({
      loading:true,
      employeeId:'',
      employeeName:'',
      employeesList:[],
    })
  },

  components:{
      ProjectAssignment
  },

  methods:{
    onupdateInput(){
      this.getEmployees() 
    },

    async getEmployees(){
      this.loading = true ;

      const url = `http://localhost:8001/employees?employeeId=${this.employeeId}&&employeeName=${this.employeeName}`
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
        console.log(data) ;
      }
    }
  },

  mounted(){
      this.getEmployees() ;
  }

}
</script>

<style>

</style>