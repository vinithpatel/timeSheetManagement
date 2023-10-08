<template>
  <v-container >
    <v-row justify="end">
      
        <slot v-bind:openDialog="openDialog"></slot>
     
    </v-row>
     
    <v-dialog v-model="dialog" max-width="1024" persistent>
      <v-sheet v-if="!loading" variant="elevated" >
          <v-toolbar height="50" theme="dark" color="primary">
            <v-toolbar-title>PROJECT ASSIGNMENT</v-toolbar-title>
            <v-toolbar-items>
              <v-btn variant="tonal" @click="onClickSave" :loading="saveLoading ">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-container>
            <v-row >
              <v-col cols="12">
                <div class="font-weight-medium text-uppercase">
                  {{ `Name : ${employeeObj.employeeName}` }}
                </div>
                <div>
                  {{ `Email : ${employeeObj.employeeEmail}` }}
                </div>
                <div class="text-subtitle-2 font-weight-light" >
                  {{ `Position :${employeeObj.positionName}` }}
                </div>
              </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                  <v-card>
                    <v-toolbar
                        dark
                        color="#6a70eb"
                        height="40"
                        >
                        <v-toolbar-title>Projects List</v-toolbar-title>
                        </v-toolbar>
                    <v-card height="400" class="overflow-y-auto">
                      
                        <v-card-title>
                          <v-text-field
                            variant="outlined"
                            placeholder="Search Project"
                            @input="onSearchProjects"
                            v-model="searchProjectName"
                          >    
                          </v-text-field>
                        </v-card-title>
                        <v-card-text>

                          <v-list v-if="!projectsLoading">

                            <v-list-item v-for="projectObj in distinctProjectsList"
                            :title="projectObj.projectName"
                            :key="projectObj.projectId"
                            append-icon="mdi-plus-box"
                            @click="onClickAddProject(projectObj)"
                            >
                            <v-dialog v-model="assignProjectDialog" width="400" height="400">
                                <v-card >
                                    <v-card-title>
                                      <div>
                                        Project Name : {{ projectObj.projectName }}
                                      </div>
                                      <div>
                                        Cost Type : {{ projectObj.costType }}
                                      </div>
                                    </v-card-title>
                                    <v-card-text>
                                      <div>
                                        <v-select
                                          variant="outlined"
                                          placeholder="Select Role"
                                          v-model="role"
                                          
                                          :rules="[value => value === null || value.length === 0 ? 'Required' : true]"
                                        >

                                        </v-select>
                                        <v-text-field
                                          variant="outlined"
                                          placeholder="Cost Per Hour"
                                          v-model="costPerHour"
                                          type="number"
                                          :rules="[value => value === null || value.length === 0 ? 'Required' : true]"
                                        >

                                        </v-text-field>
                                      </div>
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                            </v-list-item>



                            <v-list-item
                              title="No Projects Available"
                              v-if="distinctProjectsList.length === 0"
                            > 
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                    </v-card>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-toolbar
                        dark
                        color="#95d3f0"
                        height="40"
                        >
                        <v-toolbar-title>Assigned Projects</v-toolbar-title>
                        </v-toolbar>
                    <v-card height="400" class="overflow-y-auto">

                        <v-card-text>
                          <v-list>
                            
                            <v-list-item v-for="projectObj in employeeProjectsList"
                            :title="projectObj.projectName"
                            :key="projectObj.projectId"
                            append-icon="mdi-minus-box"
                            @click="onClickRemoveProject(projectObj.projectId)"
                            >
                            </v-list-item>

                            <v-list-item
                              title="No Projects Available"
                              v-if="employeeProjectsList.length === 0"
                            > 
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                    </v-card>
                  </v-card>
                </v-col>
                
              </v-row>
        </v-container>   
      </v-sheet>
      <div v-if="loading" style="height:400px; width:100%;" class="d-flex flex-row align-center justify-center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
      </div>
    </v-dialog>
  
  </v-container>
</template>

<script>
export default {
    data(){
        return ({
            dialog:false,
            assignProjectDialog:false,
            loading:false,
            projectsLoading:false,
            employeeProjectsLoading:false,
            saveLoading:false,
            projectsList:[],
            employeeProjectsList:[],
            searchProjectName:'',
            costPerHour:null,
            role:null,
        })
    },

    props:[
      'employeeObj'
    ],

    computed:{
      distinctProjectsList(){
        return this.projectsList.filter(projectObj => this.employeeProjectsList.every(each => (each.projectId !== projectObj.projectId)))
      },
    },

    methods:{
      openDialog(){
        this.dialog=true ;
      },

      onSearchProjects(){
        this.getProjectsList() ;
      },

      onClickAddProject(projectObj){
        if(projectObj.costType === "Time & Material"){
            this.assignProjectDialog = true ;
        }else{
          this.employeeProjectsList.push(projectObj)
        }
      },

      onClickRemoveProject(projectId){
        const filterList = this.employeeProjectsList.filter((each) => (each.projectId !== projectId))
        this.employeeProjectsList = filterList ;
      },

      async onClickSave(){
          this.saveLoading = true; 
          const url = `http://localhost:8001/projects/save/${this.employeeObj.employeeId}`
          const options = {
            method:"PUT",
            headers:{
              'Content-Type':"application/json",
            },
            body:JSON.stringify({projectsList:this.employeeProjectsList})
          }
          
          const response = await fetch(url, options) ;

          if(response.ok){
            this.saveLoading = false; 
            this.dialog = false ;
            this.$store.dispatch('showNotification', 'Projects List Updated')
          }

      },

      async getProjectsList(){
        this.projectsLoading = true

        const url = `http://localhost:8001/projects?projectName=${this.searchProjectName}`
        const options = {
          method:"GET",
          headers:{
            'Content-Type':"application/json"
          }
        }

        const response = await fetch(url, options) ;
        if(response.ok){
          const data = await response.json() ;
          this.projectsList = data ;
          this.projectsLoading = false
        }
      },

      async getEmployeeProjectsList(){
        this.employeeProjectsLoading = true

        const url = `http://localhost:8001/projects/${this.employeeObj.employeeId}`

        const options = {
          method:"GET",
          headers:{
            'Content-Type':"application/json"
          }
        }

        const response = await fetch(url, options) ;

        if(response.ok){
          const data = await response.json() ;
          this.employeeProjectsList = data ;
          this.employeeProjectsLoading = false
        }
      }
    },

    mounted(){
      this.getProjectsList()
      this.getEmployeeProjectsList()
    }
}
</script>

<style>

</style>