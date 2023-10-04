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
            Add Project
          </v-card-title>

          <v-card-text>
            <v-form v-model="form">
                <v-row align="center"  >
                    <v-col cols="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            
                            :rules="projectNameRules"
                            placeholder="Select Project Name"
                            v-model="projectName"
                                                       
                        ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <v-select
                            density="compact"
                            variant="outlined"
                            
                            :rules="projectTypeRules"
                            placeholder="Project Type"
                            v-model="projectType"
                            :items="['Billable', 'Non-Billable']"                      
                        ></v-select>
                    </v-col>

                </v-row>
                    
                <v-row v-if="projectType === 'Billable'">
                    <v-col cols="4">
                            <v-text-field
                                density="compact"
                                variant="outlined"
                                
                                :rules="projectNameRules"
                                placeholder="Customer"
                                v-model="customerId"
                                                        
                            ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                            <v-text-field
                                density="compact"
                                variant="outlined"
                                type="number"
                                
                                :rules="projectNameRules"
                                placeholder="cost"
                                v-model="cost"
                                                        
                            ></v-text-field>
                    </v-col>

                    <v-col cols="3">
                        <v-select
                            density="compact"
                            variant="outlined"
                            
                            :rules="projectTypeRules"
                            placeholder="Currency"
                            v-model="currency"
                            :items="['USD', 'Euro', 'INR', 'CHF']"
                        ></v-select>
                    </v-col>

                </v-row>

                <v-row>
                    <v-col cols="8">
                        <v-textarea
                                density="compact"
                                variant="outlined"
                                label="Description"
                                placeholder="Description"
                                v-model="description"
                                :rules="projectNameRules"
                                                        
                            ></v-textarea>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col  cols="8">
                        <DateRange @updateDateRange="updateDateRange"/>
                    </v-col>
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

            <v-btn :disabled="!form" color="primary" variant="outlined" @click="onAddProject" :loading="addLoading">
                Add
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
    
</v-container>
</template>

<script>
    import DateRange from './DateRange.vue';
    import {format} from "date-fns"

    export default({
    data() {
        return ({
            dialog: false,
            form:false,
            projectName: null,
            addLoading:false,
            projectNameRules: [

                value => {
                    
                    if (value === null || value === '') {
                        return 'Required'
                    }
                    
                    return true;
                }
            ],
            projectType:null,
            projectTypeRules:[
                value => {

                    if (value === null || value === '') {
                        return 'Required'
                    }
                    
                    return true;
                }
            ],
            customerId:null,
            
            cost:null,
            currency:null,
            description:null,
            startDate:null,
            endDate:null,
        });
    },
    components: { DateRange },

    methods:{
        updateDateRange({startDate, endDate}){
            
            this.startDate = format(startDate, 'yyyy-MM-dd') ;
            this.endDate = format(endDate, 'yyyy-MM-dd') ;
                
        },

        async onAddProject(){
            
            this.addLoading = true ;

            const url = "http://localhost:8001/project/create/" ;

            const data = {
                projectName:this.projectName,
                projectType:this.projectType,
                customerId:this.projectType === 'Billable'? this.customerId : null,
                cost:this.projectType === 'Billable' ? this.cost : null,
                currency:this.projectType === 'Billable' ? this.currency : null,
                description:this.description,
                startDate:this.startDate,
                endDate:this.endDate
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

                console.log(`new project id : ${data.projectId}`)

                this.addLoading = false ;

                this.dialog = false;
                this.$emit('getProjectsList') ;
            }

        }
    }
})
</script>

<style>
    
</style>