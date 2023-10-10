<template>
  <v-container fluid class="h-100 w-100" > 
      <v-sheet v-if="!loading" variant="elevated" >
          <v-toolbar height="50" theme="dark" color="primary">
            <v-toolbar-title>PROJECT ASSIGNMENT</v-toolbar-title>
            <v-toolbar-items>
              <!-- <v-btn variant="tonal" @click="onClickSave" >Save</v-btn> -->
            </v-toolbar-items>
          </v-toolbar>
          <v-container fluid>
            <v-row >
              <v-col cols="12">
                <div class="font-weight-medium text-uppercase">
                  {{ `Name : ${employeeObj.employeeName}` }}
                </div>
                <div>
                  {{ `Email : ${employeeObj.employeeEmail}` }}
                </div>
                <div class="text-subtitle-2 font-weight-light" >
                  {{ `Position :${employeeObj.position}` }}
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
                    <v-card height="500" class="overflow-y-auto">
                      
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

                          <v-expansion-panels>
                            <v-expansion-panel
                              v-for="projectObj in distinctProjectsList"
                              :key="projectObj.projectId"
                              :title="projectObj.projectName"
                            >
                              <v-expansion-panel-text>
                                <ProjectAssignmentExpansion v-slot="{form, projectDetails}" :projectData="{projectId:projectObj.projectId,projectType:projectObj.projectType,startDate:null, endDate:null, roleId:null}">                            
                                <v-row justify="end">
                                  <v-col cols="2" class="mt-1">
                                    <v-btn :disabled="!form" @click="onClickAddProject(projectDetails)" color="primary"
                                    :loading="addLoading"
                                    >
                                      Add
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </ProjectAssignmentExpansion>
                                
                              </v-expansion-panel-text>
                          </v-expansion-panel>
                          </v-expansion-panels>

                          <div
                            class="d-flex justify-center text-subtitle-1"
                            v-if="distinctProjectsList.length === 0"
                          > No Projects Available
                        </div>
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
                    <v-card height="500" class="overflow-y-auto">

                        <v-card-text>

                          <v-expansion-panels>
                            <v-expansion-panel
                              v-for="projectObj in employeeProjectsList"
                              :key="projectObj.projectId"
                              :title="projectObj.projectName"
                            >
                              <v-expansion-panel-text>
                                <ProjectAssignmentExpansion v-slot="{form, projectDetails}" :projectData="projectObj" >
                                  <v-row justify="end">
                                    
                                    <v-col cols="3">
                                      <v-btn :disabled="!form" color="primary" variant="outlined" @click="onClickUpdateProject(projectDetails)"
                                      :loading="updateLoading"
                                      >
                                        Update
                                      </v-btn>
                                    </v-col>

                                    <v-col cols="3">
                                        <v-btn color="red" variant="outlined" @click="onClickRemoveProject(projectObj.projectId)" 
                                          :loading="removeLoading"
                                        >
                                            Remove
                                        </v-btn>
                                    </v-col>
                                  </v-row>
                                  
                              </ProjectAssignmentExpansion>
                              </v-expansion-panel-text>
                          </v-expansion-panel>
                          </v-expansion-panels>

                          <div 
                            class="d-flex justify-center text-subtitle-1"
                            v-if="employeeProjectsList.length === 0"
                          > No Projects Available
                          </div>
                          
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
  
  </v-container>
</template>

<script>
  import { mapState,mapGetters } from 'vuex';
  import ProjectAssignmentExpansion from './ProjectAssignmentExpansion.vue';

export default {
    data(){
        return ({
            employeeObj:{},
            loading:false,
            projectsLoading:false,
            employeeProjectsLoading:false,
            addLoading:false,
            removeLoading:false,
            updateLoading:false,
           
            projectsList:[],
            employeeProjectsList:[],
            searchProjectName:'',
            costPerHour:null,
            role:null,
            positionsList:[],
            positionId:null,
        })
    },

    props:[
      
    ],

    components:{
      ProjectAssignmentExpansion,
    },

    computed:{
      ...mapState(['fieldRules']),

      ...mapGetters(['getEmployeeDetails']),

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

      async onClickAddProject(projectDetails){
        this.addLoading = true ;

         const url = `http://localhost:8001/project/employee/save/${this.employeeObj.employeeId}`

         const options = {
            method:"PUT",
            headers:{
              'Content-Type':"application/json",
            },
            body:JSON.stringify(projectDetails)
          }

          const response = await fetch(url, options) ;

          if(response.ok){
            this.getEmployeeProjectsList() ;
            this.$store.dispatch('showNotification', 'Project Added')
          }

          this.addLoading = false ;

      },

      async onClickRemoveProject(projectId){

        this.removeLoading = true ;

        const url = `http://localhost:8001/project/employee/remove/${this.employeeObj.employeeId}`

        const data = {
          projectId,
        }

        const options = {
            method:"DELETE",
            headers:{
              'Content-Type':"application/json",
            },
            body:JSON.stringify(data)
          }

          const response = await fetch(url, options) ;

          if(response.ok){
            this.getEmployeeProjectsList() ;
            this.$store.dispatch('showNotification', 'Project Removed')
          }
          
          this.removeLoading = false ;
      },

      async onClickUpdateProject(projectDetails){
        this.updateLoading = true ;

        const url = `http://localhost:8001/project/employee/update/${this.employeeObj.employeeId}`

         const options = {
            method:"PUT",
            headers:{
              'Content-Type':"application/json",
            },
            body:JSON.stringify(projectDetails)
          }

          const response = await fetch(url, options) ;

          if(response.ok){
            this.getEmployeeProjectsList() ;
            this.$store.dispatch('showNotification', 'Project updated')
          }

          this.updateLoading = false ;
      },

      async onClickSave(){
          
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
            
            this.dialog = false ;
            this.$store.dispatch('showNotification', 'Projects List Updated')
          }

      },

      async getEmployeeData(){
        const data = await this.getEmployeeDetails(this.$route.params.employeeId) ;
        this.employeeObj = data ;
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

        const url = `http://localhost:8001/projects/employee/${this.employeeObj.employeeId}`

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
      },
    },

    async mounted(){
      await this.getEmployeeData() ;
      await this.getProjectsList() ;
      await this.getEmployeeProjectsList() ;

    }
}
</script>

<style>

</style>