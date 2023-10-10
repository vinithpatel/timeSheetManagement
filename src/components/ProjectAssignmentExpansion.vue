<template>
    <v-form v-model="form">

        <v-row >
            <v-col cols="12">
            <v-select
                density="compact"
                variant="outlined"
                
                :items="positionsList"
                item-value="positionId"
                item-title="positionName"
                :rules="[fieldRules.required]"
                placeholder="Select Role"
                v-model="projectDetails.roleId"
                                        
            ></v-select>
            </v-col>
            
        </v-row>

        <v-row v-if="projectDetails.projectType === 'Billable'">
            <v-col cols="6">
            <v-text-field
                density="compact"
                variant="outlined"
                type="number"
                
                :rules="[fieldRules.required]"
                placeholder="cost"
                v-model="projectDetails.cost"
                                        
            ></v-text-field>
            </v-col>
            <v-col cols="6">
            <v-select
                density="compact"
                variant="outlined"
                
                :rules="[fieldRules.required]"
                placeholder="Currency"
                v-model="projectDetails.currency"
                :items="['USD', 'Euro', 'INR', 'CHF']"
            ></v-select>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="6">
            <v-text-field
            :rules="[fieldRules.required]"
                label="Start date"
                type="date"
                v-model="projectDetails.startDate"
            ></v-text-field>
            </v-col>

            <v-col cols="6">
            <v-text-field
                :rules="[fieldRules.required]"
                label="End date"
                type="date"
                v-model="projectDetails.endDate"
            ></v-text-field>
            </v-col>
        </v-row>

        <slot v-bind:form="form" v-bind:projectDetails="projectDetails">

        </slot>
    </v-form>
</template>

<script>
    import { mapState } from 'vuex';

    export default({
        data(){
            return ({
                form:false,
                projectDetails:{
                    projectId:this.projectData.projectId,
                    projectType:this.projectData.projectType,
                    startDate:this.projectData.startDate,
                    endDate:this.projectData.endDate,
                    roleId:this.projectData.roleId,
                    cost:this.projectData.cost,
                    currency:this.projectData.currency,
                },

                positionsList:[],
            })
        },

        props:[
            'projectData'
        ],

        computed:{
            ...mapState(['fieldRules']),
        },

        methods:{
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
            },
        },

        mounted(){
            this.getPositionsList() ;
        }
    })
</script>