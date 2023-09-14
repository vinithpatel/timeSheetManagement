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
                    v-for="rowObj in timeSheetList"
                    :key="rowObj.projectId"
                    >
                    <td>
                        <div class="mt-6 mb-6">        
                            <select
                                class="projects-list-input-select"
                                v-bind:value="rowObj.projectName"
                                
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
                        @input = "restrictChar($event,{id:rowObj.projectId,name:'monday'})"
                        v-bind:model-value="rowObj.monday"
                        v-bind:v-model="rowObj.monday"
                        maxlength="3"
                        >
                        
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @input = "restrictChar($event,{id:rowObj.projectId,name:'tuesday'})"
                        v-bind:model-value="rowObj.tuesday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @input = "restrictChar($event,{id:rowObj.projectId,name:'wednesday'})"
                        v-bind:model-value="rowObj.wednesday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{id:rowObj.projectId,name:'thursday'})"
                        v-bind:model-value="rowObj.thursday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{id:rowObj.projectId,name:'friday'})"
                        v-bind:model-value="rowObj.friday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{id:rowObj.projectId,name:'satuarday'})"
                        v-bind:model-value="rowObj.satuarday"
                        maxlength="3"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{id:rowObj.projectId,name:'sunday'})"
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
                        <v-btn icon="mdi-close" variant="text" size="small" @click="onClickDelete(rowObj.projectId)" >
                        
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
                        {{ getTotalHoursOfDay('satuarday') }}
                    </td>
                    <td class="text-center" >
                        {{ getTotalHoursOfDay('sunday') }}
                    </td>
                    <td class="text-center" >
                        {{ getTotal}}
                    </td>
                </tr>
                </tbody>
            </v-table>
        </v-row>
        <v-btn color="#0047ba" prepend-icon="mdi-plus" @click="addNewRow">
                  New Row
        </v-btn>
    </v-container>
</template>

<script>
    import {v4 as uuidV4} from "uuid";
    import {mapState} from "vuex"

    export default({
        data(){
            return (
                {
                    selectValue:"",
                    projectList:"",
                    timeSheetList: this.timeSheetData,
                }
            )
        },

        props:[
            'timeSheetData'
        ],

        watch:{
            timeSheetData(newValue){
                this.timeSheetList = newValue ;
            }
        },

        computed:{
            ...mapState([
                'employeeId','selectedWeek','weeklyProjectHoursList'
            ]),

            getTotal(){
                const list = this.timeSheetData ;

                let totalHours = 0 ;
                list.forEach((eachObj)=>{
                    totalHours += eachObj['total'] ;
                })

                return totalHours.toFixed(1)
            }
        },

        methods:{

            restrictChar(event, data){
                
                let value = event.target.value ;                

                const lastChar = value.charAt(value.length-1)
                

                if((lastChar > '9' || lastChar < '1') && lastChar !== '.'){
                    event.target.value = value.slice(0, value.length -1);
                }
                else if(parseFloat(value) > 8){
                
                    event.target.value = "";
                }
                else{
                    value = isNaN(parseFloat(value)) ? null : parseFloat(parseFloat(value).toFixed(1)) ;
                    this.updateRowInput({...data, value}) ;
                }

                
            },

            getTotalHoursOfDay(dayName){
                
                const list = this.timeSheetList;

                let totalHours = 0 ;
                list.forEach((eachObj)=>{
                    totalHours += eachObj[dayName] ;
                })

                return totalHours.toFixed(1)

                
            },

            addNewRow(){
                const newRow = {
                    projectId:uuidV4(),
                    projectName:null,
                    monday:null,
                    tuesday:null,
                    wednesday:null,
                    thursday:null,
                    friday:null,
                    satuarday:null,
                    sunday:null,
                    total:null,
                }

                this.timeSheetList = [...this.timeSheetList, newRow] ;
                //this.$store.dispatch('createNewRow')
            },

            updateRowInput(data){
            
                const {id, name, value} = data ;
                

            const updatedList = this.timeSheetList.map(eachObj => {
                console.log(eachObj.projectId) ;
                console.log(id) ;
                
                if(eachObj.projectId === id){
                    const requiredObj = {...eachObj} ;
                    requiredObj[name] = value 

                    return requiredObj
                }
                return eachObj
            })
            this.timeSheetList = updatedList;

            
        },

        totalHoursOnProject(rowObj){     

            const total = (rowObj.monday+rowObj.tuesday+rowObj.wednesday+rowObj.thursday+rowObj.friday+rowObj.satuarday+rowObj.sunday)
            
            return total.toFixed(1) ;
        },

        onClickDelete(id){
            console.log(id) ;

            const updatedList = this.timeSheetList.filter((each) => (each.projectId !== id))
            this.timeSheetList = updatedList ;
        },

            /*

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
                 
                const {id, name} = obj ;
                console.log(event.target.value) ;

                

                if(this.getTotalHoursOfDay(name) > 8){
                    this.$store.dispatch('updateRowInput', {
                    id, 
                    name,
                    value:null,
                })
                }

                
            },
            

            onClickDeleteRow(rowId){
                this.$store.dispatch('deleteRow', rowId)
            },

            */

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