<template>
    <v-container fluid class="h-100 w-100" > 
      <v-sheet variant="elevated" >
          <v-toolbar height="50" theme="dark" color="primary">
            <v-toolbar-title>PROFILE</v-toolbar-title>
            <v-toolbar-items>
              <!-- <v-btn variant="tonal" @click="onClickSave" >Save</v-btn> -->
            </v-toolbar-items>
          </v-toolbar>
          <v-container fluid>
            <v-row justify="center">
                <v-col cols="1">
                    <v-avatar
                        color="brown"
                        size="large"
                        >
                        <span class="text-h5">{{ employeeDetails.employeeName[0] }}</span>
                    </v-avatar>
                </v-col>
                <v-col cols="2">
                    <div class="text-h5">
                        {{ employeeDetails.employeeName }}
                    </div>
                    <div >
                        {{`Id:  ${employeeDetails.employeeId} `}}
                    </div>
                </v-col>
            </v-row>
            
            <v-row justify="center">
                <v-col cols="4">
                    <div>
                        <span class="font-weight-medium">Personal Mail: </span>
                        {{`${employeeDetails.personalMail} `}}
                    </div>
                </v-col>
                <v-col cols="4">
                    <div>
                        <span class="font-weight-medium">Official Mail: </span>
                        {{` ${employeeDetails.officialMail} `}}
                    </div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="4">
                    <div>
                        <span class="font-weight-medium">Position : </span>
                        {{` ${employeeDetails.positionName} `}}
                        
                    </div>
                </v-col>
                <v-col cols="4">
                    <div>
                        <span class="font-weight-medium">Department : </span>
                        {{` ${employeeDetails.departmentName} `}}
                        
                    </div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="4">
                    <span class="font-weight-medium">Admin : </span>
                    {{ ` ${employeeDetails.isAdmin === 1 ? 'Yes' : 'No'}` }}
                </v-col>

                <v-col cols="4">
                    <div >
                        <span class="font-weight-medium">Reporting Manager : </span>
                        {{`${employeeDetails.reportingManagerName} `}}
                    </div>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="6">
                <v-card min-width="400" height="400" class="overflow-y-auto">
                    <v-toolbar>
                        <v-toolbar-title>
                            Assigned Projects
                        </v-toolbar-title>
                    </v-toolbar>
                    
                    <v-card-text>
                        <v-list lines="one"
                        >
                        <v-list-item
                            v-for="(project,index) in projectList"
                            :key="project.projectId"
                            :title="`${index+1} ${project.projectName}`"
                        ></v-list-item>
                        <v-list-item 
                            v-if="projectList.length === 0"
                            title="No Projects Assigned"
                        ></v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="6">
                <v-card min-width="400" height="400" class="overflow-y-auto">
                    <v-toolbar>
                        <v-toolbar-title>
                            Assigned Employees
                        </v-toolbar-title>
                    </v-toolbar>
                    
                    <v-card-text>
                        <v-list lines="one"
                            
                        >
                        <v-list-item
                            v-for="employeeObj in reportingManagerEmployeesList"
                            :key="employeeObj.employeeId"
                            :title="`${employeeObj.employeeId} - ${employeeObj.employeeName}`"
                        ></v-list-item>
                        <v-list-item 
                            v-if="reportingManagerEmployeesList.length === 0"
                            title="No Employees Assigned"
                        ></v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
            </v-row>
          </v-container>
      </v-sheet>
  </v-container>
</template>

<script>
import {mapState, mapGetters} from "vuex" ;

    export default({
        data(){
            return ({
                reportingManagerEmployeesList:[]
            })
        },

        computed:{
            ...mapState(['employeeDetails','projectList', 'employeeId']) ,
            ...mapGetters(['getHeaders'])
        },

        methods:{
            async getReportingManagerEmployees(){
                const url = `http://localhost:8001/reporting_manager/employees/${this.employeeId}`
                const options = {
                    method:"GET",
                    ...this.getHeaders,
                }

                const response = await fetch(url, options);

                if(response.ok){
                    this.reportingManagerEmployeesList = await response.json() ;
                }
            }
        },

        mounted(){
            this.getReportingManagerEmployees()
        }
    })
</script>