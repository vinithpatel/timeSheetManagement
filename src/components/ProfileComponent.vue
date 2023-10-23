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
                <v-col cols="3">
                    <div class="text-h5">
                        {{ employeeDetails.employeeName }}
                    </div>
                    <div >
                        {{`Id:  ${employeeDetails.employeeId} `}}
                    </div>
                </v-col>
                <v-col cols="4">
                    <v-dialog height="480" width="400">
                        <template v-slot:activator="{ props }">
                            <v-btn variant="text" color="blue"  v-bind="props">
                                Change Password
                            </v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                    
                        <v-card width="400" height="480">
                            <v-card-title>
                                <div class="w-100 d-flex flex-row align-center justify-space-between">
                                    Change Password
                                    <v-btn @click="onCloseDialog(isActive)" icon="mdi-close" variant="text">
                                    </v-btn>
                                </div>
                            </v-card-title>
                            <v-card-text>
                                <v-form v-model="changePasswordForm" @submit.prevent="onClickChangePassword(isActive)">
                                    <v-row>
                                        <v-col cols="12">
                                            <v-text-field
                                            v-model="currentPassword"
                                            label="Current Password"
                                            :type="currentPasswordVisible ? 'text': 'password'"
                                            :append-inner-icon="currentPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                            @click:append-inner="currentPasswordVisible = !currentPasswordVisible"
                                            :rules="[fieldRules.required, fieldRules.password]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field
                                            v-model="newPassword"
                                            label="New Password"
                                            :type="newPasswordVisible ? 'text': 'password'"
                                            :append-inner-icon="newPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                            @click:append-inner="newPasswordVisible = !newPasswordVisible"
                                            :rules="[fieldRules.required, fieldRules.password]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field
                                            label="Confirm New Password"
                                            v-model="confirmNewPassword"
                                            :rules="[fieldRules.required,passwordMatchRule]"
                                            :type="confirmNewPasswordVisible ? 'text': 'password'"
                                            :append-inner-icon="confirmNewPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                            @click:append-inner="confirmNewPasswordVisible = !confirmNewPasswordVisible"
                                            ></v-text-field>
                                        </v-col>
                                        
                                    </v-row>

                                    <v-row>
                                        <v-col v-if="!isPasswordValid" >
                                            <p style="font-size:11px; color:red;">
                                                {{ passwordError }}
                                            </p>
                                        </v-col>
                                        <v-col cols="12" >
                                            <v-btn
                                            type="submit"
                                            block
                                            color="blue"
                                            text="Change Password"
                                            :disabled="!changePasswordForm"
                                            :loading="changePasswordLoading"
                                            ></v-btn>
                                        </v-col>
                                    </v-row>                              
                             </v-form>
                            </v-card-text>
                        </v-card>
                        </template>
                    </v-dialog>
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
                changePasswordForm:false,
                currentPassword:null,
                newPassword:null,
                confirmNewPassword:null,
                reportingManagerEmployeesList:[],

                currentPasswordVisible:false,
                newPasswordVisible:false,
                confirmNewPasswordVisible:false,
                isPasswordValid:true ,
                passwordError:null,
                changePasswordLoading:false,

                passwordMatchRule:() => {
                    if(this.newPassword !== this.confirmNewPassword){
                        return "Password Doesn't Match" ;
                    }

                    return true ;
                }
            })
        },


        computed:{
            ...mapState(['employeeDetails','projectList', 'employeeId','fieldRules']) ,
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
            },

            async onClickChangePassword(isActive){
                this.changePasswordLoading = true ;

                const url = "http://localhost:8001/password/reset" ;

                const options = {
                    method:"PUT",
                    ...this.getHeaders,
                    body: JSON.stringify({currentPassword:this.currentPassword,newPassword:this.newPassword})
                }

                const response = await fetch(url, options) ;
                const data = await response.json() ;

                if(response.ok){
                    this.onCloseDialog(isActive)
                }else{
                    this.isPasswordValid = false ;
                    this.passwordError = data.message ;
                    console.log(data.message)
                }

                this.changePasswordLoading = false ;
            },

            onCloseDialog(isActive){
                isActive.value = false ;

                //reseting data properties
                this.changePasswordForm = false ;
                this.currentPassword = null ;
                this.newPassword = null ;
                this.confirmNewPassword = null ;
                

                this.currentPasswordVisible = false;
                this.newPasswordVisible = false ;
                this.confirmNewPasswordVisible = false ;
                this.isPasswordValid = true  ;
                this.passwordError =null ;
            }
        },

        mounted(){
            this.getReportingManagerEmployees() ;
            
        }
    })
</script>