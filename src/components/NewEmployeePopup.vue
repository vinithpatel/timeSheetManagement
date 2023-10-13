<template>
    <v-container>
    
      <v-dialog
        v-model="dialog"
        persistent
        width="1024"
      >
      
        <template v-slot:activator="{ props }">
            <v-btn variant="outlined" prepend-icon="mdi-plus" color="primary" v-bind="props">
                    New
            </v-btn>
                 
        </template>
        
        <v-card>
          <v-card-title>
            Add Employee
          </v-card-title>

          <v-card-text>
            <v-form v-model="form">
                <v-row align="center"  >
                    <v-col cols="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Employee Name"
                            :rules="[rules.required]"
                            placeholder="Employee Name"
                            v-model="employeeName"
                                                       
                        ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Contact Number"
                            type="number"
                            :rules="[rules.required]"
                            placeholder="Contact Number"
                            v-model="contactNumber"
                                                       
                        ></v-text-field>
                    </v-col>
                    
                </v-row>
                <v-row>
                    <v-col cols="4">
                            <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Personal Main Id"
                            :rules="[rules.required, rules.email]"
                            placeholder="Personal Mail Id"
                            v-model="personalMail"
                                                       
                        ></v-text-field>

                    </v-col>

                    <v-col cols="4">
                            <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Official Mail Id"
                            :rules="[rules.required, rules.email]"
                            placeholder="Official Mail Id"
                            v-model="officialMail"
                                                       
                            ></v-text-field>

                    </v-col>

                </v-row>

                <v-row>
                    <v-col  cols="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            :rules="[rules.required]"
                            placeholder="Date Of Joining"
                            label="Date of Joining"
                            v-model="doj"
                            type="date"
                                                       
                        ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <v-select
                            density="compact"
                            variant="outlined"
                            label="Reporting Manger"
                            :items="employeesList"
                            item-value="employeeId"
                            item-title="employeeName"
                            :rules="[rules.required]"
                            placeholder="Reporting Manager"
                            v-model="reportingManagerId"                                             
                        ></v-select>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                            <v-select
                            density="compact"
                            variant="outlined"
                            
                            :items="positionsList"
                            item-value="positionId"
                            item-title="positionName"
                            :rules="[rules.required]"
                            placeholder="Designation"
                            v-model="positionId"
                                                       
                        ></v-select>
                    </v-col>

                    <v-col cols="4">
                            <v-select
                            density="compact"
                            variant="outlined"
                            
                            :items="departmentsList"
                            item-value="departmentId"
                            item-title="departmentName"
                            :rules="[rules.required]"
                            placeholder="Department"
                            v-model="departmentId"
                                                       
                        ></v-select>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="8">
                        <v-textarea
                                density="compact"
                                variant="outlined"
                                label="Address"
                                placeholder="Address"
                                v-model="address"
                                :rules="[rules.required]"                                                       
                            ></v-textarea>
                    </v-col>
                </v-row>

                <v-row>
                    
                </v-row>
            </v-form>
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

            <v-btn :disabled="!form" color="primary" variant="outlined" @click="onAddEmployee" :loading="addLoading">
                Add
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
    
</v-container>
</template>

<script>
    //import {format} from "date-fns"
    import {mapGetters} from "vuex" ;

    export default({
    data() {
        return ({
            dialog: false,
            form:false,
            
            employeeName:null,
            contactNumber:null,
            personalMail:null,
            officialMail:null,
            doj:null,
            address:null,
            positionId:null,
            positionsList:[],
            departmentId:null,
            departmentsList:[],
            reportingManagerId:null,
            employeesList:[],

            addLoading:false,
            rules: {
                    required(value){      
                        if (value === null || value === '') {
                            return 'Required'
                        }
                        
                        return true;       
                    },

                    email(value){
                        if(value.includes('@') && value.includes('.com')){
                            return true
                        }

                        return "Invalid Email Address"
                    },
                },
        });
    },

    computed:{
        ...mapGetters(['getHeaders'])
    },

    methods:{
        
        async onAddEmployee(){
            
            this.addLoading = true ;

            const url = "http://localhost:8001/employee/create/" ;

            const data = {
                employeeName:this.employeeName,
                contactNumber:this.contactNumber,
                personalMail:this.personalMail,
                officailMail:this.officialMail,
                doj:this.doj,
                positionId:this.positionId,
                positionsList:[],
                departmentId:this.departmentId,
                address:this.address,
                reportingManagerId:this.reportingManagerId
            }

            const options ={
                method:"POST",
                ...this.getHeaders,
                body:JSON.stringify(data) 
            }

            const response = await fetch(url, options) ;

            if(response.ok){
                const data = await response.json() ;

                console.log(`new employee id : ${data.employeeId}`)

                this.addLoading = false ;

                this.dialog = false;

                this.employeeName= null ;
                this.contactNumber= null ;
                this.email= null ;
                this.doj= null ;
                this.designation= null ;
                this.department = null ;
                this.address = null ;
                
                this.$emit('getEmployees') ;
            }

        },

        async getEmployeesList(){
                const url = `http://localhost:8001/employees/`

                const options = {
                method:"GET",
                ...this.getHeaders,
                }

                const response = await fetch(url, options) ;
                if(response.ok){
                    const data = await response.json() ;
                    this.employeesList = data ;
                
                }
        },
        

        async getPositionsList(){
            const url = `http://localhost:8001/positions`

            const options = {
                method:"GET",
                ...this.getHeaders,
            }

            const response = await fetch(url, options)

            if(response.ok){
                const data = await response.json() ;
                this.positionsList = data ;
            }
        },

        async getDepartementsList(){
            const url = `http://localhost:8001/departments`

            const options = {
                method:"GET",
                ...this.getHeaders,
            }

            const response = await fetch(url, options)

            if(response.ok){
                const data = await response.json() ;
                this.departmentsList = data ;
            }
        },

    },

    created(){
        this.getEmployeesList() ;
        this.getPositionsList() ;
        this.getDepartementsList() ;
    }
})
</script>

<style>
    .date-input{

        height: 44px;
        width:100%;
        
        border:1px solid #bfbfbf;
        border-radius: 5px;
        padding:0px 5px 0px 5px;
    }
</style>