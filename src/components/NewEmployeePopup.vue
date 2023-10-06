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
                            
                            :rules="[rules.required]"
                            placeholder="Employee Name"
                            v-model="employeeName"
                                                       
                        ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            
                            type="number"
                            :rules="[rules.required]"
                            placeholder="Cotact Number"
                            v-model="contactNumber"
                                                       
                        ></v-text-field>
                    </v-col>
                    
                </v-row>
                <v-row>
                    <v-col cols="4">
                            <v-text-field
                            density="compact"
                            variant="outlined"
                            
                            :rules="[rules.required, rules.email]"
                            placeholder="Email"
                            v-model="email"
                                                       
                        ></v-text-field>
                    </v-col>

                </v-row>

                <v-row>
                    <v-col  cols="4">
                        <div>
                            <label>Date of Joining</label>
                            <input type="date" class="date-input" placeholder="Date of Joining" v-model="doj" />
                        </div>
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
                            
                            :items="['Human Resources(HR)', 'Payroll Department', 'Project Managers', 'Senior Management', 'Architectural Design','Cunsulting Services', 'Traning and Education']"
                            :rules="[rules.required]"
                            placeholder="Department"
                            v-model="department"
                                                       
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

    export default({
    data() {
        return ({
            dialog: false,
            form:false,
            
            employeeName:null,
            contactNumber:null,
            email:null,
            doj:null,
            address:null,
            positionId:null,
            department:null,

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

    methods:{
        
        async onAddEmployee(){
            
            this.addLoading = true ;

            const url = "http://localhost:8001/employee/create/" ;

            const data = {
                employeeName:this.employeeName,
                contactNumber:this.contactNumber,
                email:this.email,
                doj:this.doj,
                positionId:this.positionId,
                positionsList:[],
                department:this.department,
                address:this.address,
            }

            const options ={
                method:"POST",
                headers:{
                    'Content-Type':"application/json",
                },

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
                const url = `http://localhost:8001/customers/`

                const options = {
                method:"GET",
                headers:{
                    'Content-Type':"application/json"
                }
                }

                const response = await fetch(url, options) ;
                if(response.ok){
                    const data = await response.json() ;
                    this.customersList = data ;
                
                }
        },

        async getPositionsList(){
            const url = `http://localhost:8001/positions`

            const options = {
                method:"GET",
                headers:{
                    'Content-Type':'application/json',
                }
            }

            const response = await fetch(url, options)

            if(response.ok){
                const data = await response.json() ;
                this.positionsList = data ;
            }
        }
    },

    created(){
        this.getEmployeesList() ;
        this.getPositionsList()
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