<template>
    <v-container>
        <v-row>
            <v-table >
                <thead>
                <tr>
                    <th class="text-left" width="250px">
                    Projects
                    </th>
                    <th style="font-size:13px;" class="text-left" v-for="dateFormat in $store.state.daysOfWeek" v-bind:key="dateFormat">
                        {{dateFormat}}
                    </th>
                    <th style="font-size:14px; font-weight:bold; color:black;">
                        Total:
                    </th>
                    
                </tr>
                </thead>
                <tbody >
                    <tr
                    v-for="rowObj in weeklyProjectHoursList[selectedWeek]"
                    :key="rowObj.id"
                    >
                    <td>
                        <div class="mt-6 mb-6">        
                            <select
                                class="projects-list-input-select"
                                @change="setProject($event,{id:rowObj.id,name:'project'})"
                                v-bind:value="rowObj.project"
                                
                            >
                            <option value="" disabled selected hidden>Select Project ▼</option>
                                <option 
                                    v-for="option in projectList" 
                                    v-bind:key="option"
                                    v-bind:value="option"
                                >
                                    {{ option }}
                                </option>
                            </select>
                        </div>
                    </td>
                    <td class="text-center" >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @change = "setValue($event, {id:rowObj.id, name:'monday'})"
                        @input = "restrictChar($event, {id:rowObj.id, name:'monday'})"
                        v-bind:model-value="rowObj.monday"
                        v-bind:v-model="rowObj.monday"
                        maxlength="3"
                        >
                        
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @change= "setValue($event, {id:rowObj.id, name:'tuesday'})"
                        @input = 'restrictChar'
                        v-bind:model-value="rowObj.tuesday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @change = "setValue($event, {id:rowObj.id, name:'wednesday'})"
                        @input = 'restrictChar'
                        v-bind:model-value="rowObj.wednesday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @change = "setValue($event, {id:rowObj.id, name:'thursday'})"
                        @input = 'restrictChar'
                        v-bind:model-value="rowObj.thursday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @change = "setValue($event, {id:rowObj.id, name:'friday'})"
                        @input = 'restrictChar'
                        v-bind:model-value="rowObj.friday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @change = "setValue($event, {id:rowObj.id, name:'saturday'})"
                        @input = 'restrictChar'
                        v-bind:model-value="rowObj.saturday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @change = "setValue($event, {id:rowObj.id, name:'sunday'})"
                        @input = 'restrictChar'
                        v-bind:model-value="rowObj.sunday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <p>
                            {{ totalHoursOnProject(rowObj) }}
                        </p>
                    </td>
                    <td>
                        <v-btn icon="mdi-close" variant="text" size="small" v-on:click="onClickDeleteRow(rowObj.id)" >
                        
                        </v-btn>
                    </td>
                </tr>
                <tr
                >
                    <td>
                        <p>
                            Total :
                        </p>
                    </td>
                    <td class="text-center" >
                        {{ getTotalHoursOfDay('monday') }}
                    </td>
                    <td class="text-center" >
                        {{ getTotalHoursOfDay('tuesday') }}
                    </td>
                    <td class="text-center" >
                        {{ getTotalHoursOfDay('wednesday') }}
                    </td>
                    <td class="text-center" >
                        {{ getTotalHoursOfDay('thursday') }}
                    </td>
                    <td class="text-center" >
                        {{ getTotalHoursOfDay('friday') }}
                    </td>
                    <td class="text-center" >
                        {{ getTotalHoursOfDay('saturday') }}
                    </td>
                    <td class="text-center" >
                        {{ getTotalHoursOfDay('sunday') }}
                    </td>
                    <td class="text-center" >
                        {{ $store.getters.totalHours }}
                    </td>
                </tr>
                </tbody>
            </v-table>
        </v-row>
    </v-container>
</template>

<script>
    import {mapState} from "vuex"

    export default({
        data(){
            return (
                {
                    selectValue:"",
                    projectList:[],
                }
            )
        },

        computed:mapState([
            'employeeId','selectedWeek','weeklyProjectHoursList'
        ]),

        methods:{

            restrictChar(event, obj){
                const {id, name} = obj ;
                let value = event.target.value ;                

                const lastChar = value.charAt(value.length-1)
                

                if((lastChar > '9' || lastChar < '1') && lastChar !== '.'){
                    event.target.value = value.slice(0, value.length -1);
                }
                else if(parseFloat(value) > 8){
                
                    event.target.value = "";
                    
                }else{
                    value = isNaN(parseFloat(value)) ? null : parseFloat(parseFloat(value).toFixed(1)) ;
                    this.$store.dispatch('updateRowInput', {
                        id, 
                        name,
                        value,
                     })
                }
            }, 

            setProject(event, obj){
                const {id, name} = obj ;
                const value = event.target.value

                this.$store.dispatch('updateRowInput', {
                    id, 
                    name,
                    value,
                })
            },

            setValue(event, obj){
                console.log(event.target.value = "0") ;
                console.log(obj) ;
                /** 
                const {id, name} = obj ;
                console.log(event.target.value) ;

                

                if(this.getTotalHoursOfDay(name) > 8){
                    this.$store.dispatch('updateRowInput', {
                    id, 
                    name,
                    value:null,
                })
                }

                */
            },

            totalHoursOnProject(rowObj){

                const total = (rowObj.monday+rowObj.tuesday+rowObj.wednesday+rowObj.thursday+rowObj.friday+rowObj.saturday+rowObj.sunday)
                return total.toFixed(1) ;
            },

            getTotalHoursOfDay(dayName){
                const list = this.weeklyProjectHoursList[this.selectedWeek] ;

                let totalHours = 0 ;
                list.forEach((eachObj)=>{
                    totalHours += eachObj[dayName] ;
                })

                return totalHours.toFixed(1)
            },

            onClickDeleteRow(rowId){
                this.$store.dispatch('deleteRow', rowId)
            },

            async getProjectData(){
                const url = `http://localhost:8001/projects/${this.employeeId}`;

                const options = {
                    method:"GET",
                    headers:{
                        'Content-Type':'application/json',
                    },
                }

                const response = await fetch(url,options)
                
                if(response.ok){
                    const data = await response.json() ;
                    this.projectList = data ;
                }
            }

        },

        mounted(){
            this.getProjectData()
        }
    })
</script>

<style scoped>
    .projects-list-input-select{
        width:200px;
        border:1px solid #cbced4;
        padding:5px;
        border-radius:5px;
        outline:none;
    }
</style>