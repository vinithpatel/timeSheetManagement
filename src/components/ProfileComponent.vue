<template>
    <v-container fluid class="h-100 w-100" > 
      <v-sheet v-if="!loading" variant="elevated" >
          <v-toolbar height="50" theme="dark" color="primary">
            <v-toolbar-title>PROFILE</v-toolbar-title>
            <v-toolbar-items>
              <!-- <v-btn variant="tonal" @click="onClickSave" >Save</v-btn> -->
            </v-toolbar-items>
          </v-toolbar>
          <v-container fluid>
            <v-row justify="center">
                <v-col cols="2">
                    <v-avatar
                        color="brown"
                        size="large"
                        >
                        <span class="text-h5">{{ employeeDetails.employeeName[0] }}</span>
                    </v-avatar>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="3">
                    <div class="text-h5">
                        {{ employeeDetails.employeeName }}
                    </div>
                    <div >
                        {{`Id:  ${employeeDetails.employeeId} `}}
                    </div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="3">
                    <div>
                        {{`Personal Mail: ${employeeDetails.personalMail} `}}
                    </div>
                </v-col>
                <v-col cols="3">
                    <div>
                        {{`Official Mail: ${employeeDetails.officialMail} `}}
                    </div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="3">
                    <div>
                        {{`Position : ${employeeDetails.positionName} `}}
                        
                    </div>
                </v-col>
                <v-col cols="3">
                    <div>
                        {{`Department : ${employeeDetails.departmentName} `}}
                        
                    </div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="3">
                    {{ `Admin : ${employeeDetails.isAdmin === 1 ? 'Yes' : 'No'}` }}
                </v-col>

                <v-col cols="3">
                    <div class="d-flex flex-row">
                        <span class="text-weight-medium">Reporting Manager : </span>
                        {{ employeeDetails.reportingManagerName }}
                    </div>
                </v-col>
            </v-row>
          </v-container>
      </v-sheet>
  </v-container>
</template>

<script>
import {mapState} from "vuex" ;

    export default({
        data(){
            return ({

            })
        },

        computed:{
            ...mapState(['employeeDetails']) ,
        }
    })
</script>