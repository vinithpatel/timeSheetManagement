<template>
    <div>
        <div class="w-100 d-flex flex-row align-center justify-end">
            <v-btn v-if="!isSaved && !isMoreEightHours" color="primary" class="mr-2" @click="onClickSave" :loading="saveLodaing">
                Save
            </v-btn>

            <v-dialog 
                v-model="dialog"
                persistent
                width="auto"
            >
            <template v-slot:activator="{ props }">
                <v-btn
                variant="outlined" 
                color="#b93bd9"
                v-bind="props"
                >
                    Review and Submit
                </v-btn>
            </template>
                <v-card>
                    <v-card-title class="text-h5">
                        <div class="d-flex flex-row justify-space-between">
                            <span class="text-h7">TimeSheet ID : {{ sheetObj.timeSheetId }}</span>
                            
                            <span class="text-h9">Employee ID: {{ employeeId }}</span>
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <ReviewTable v-bind:weekData="timeSheetList" />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" @click="dialog = false" color="#454df5">
                            Cancel
                        </v-btn>
                        <v-btn variant="outlined" color="#b93bd9" :loading="submitLoading" @click="onClickSubmit">
                            Submit
                        </v-btn>
                    </v-card-actions>
                </v-card>
      
            </v-dialog>

        </div>
    <v-container >
        <v-row >
            <v-table >
                <thead>
                <tr>
                    <th class="text-left" width="250px" >
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
                    :key="rowObj.id"
                    >
                    <td >
                        <div class="mt-6 mb-6" >
                            <v-select
                            label="Select Project"
                            :items="projectList"
                            item-title="projectName"
                            item-value="projectId"
                            variant="outlined"
                            :model-value="rowObj.projectId"
                            hide-details
                            @update:model-value="setRowValue($event,{rowId:rowObj.id, name:'projectId'})"
                            
                            ></v-select> 
                        </div>
                    </td>
                    <td class="text-center pa-1" >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'monday'})"
                        v-bind:model-value="rowObj.monday"
                        type="number"
                        v-bind:v-model="rowObj.monday"
                        
                        >
                        
                        </v-text-field>
                    </td>
                    <td class="text-center pa-1">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'tuesday'})"
                        v-bind:model-value="rowObj.tuesday"
                        type="number"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center pa-1">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'wednesday'})"
                        v-bind:model-value="rowObj.wednesday"
                        type="number"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center pa-1">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'thursday'})"
                        v-bind:model-value="rowObj.thursday"
                        type="number"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center pa-1">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'friday'})"
                        v-bind:model-value="rowObj.friday"
                        type="number"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center pa-1">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'satuarday'})"
                        v-bind:model-value="rowObj.satuarday"
                        type="number"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center pa-1">
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'sunday'})"
                        v-bind:model-value="rowObj.sunday"
                        type="number"
                        >
                        </v-text-field>
                    </td>
                    <td class="text-center">
                        <p>
                            {{ totalHoursOnProject(rowObj) }}
                        </p>
                    </td>

                    <td class="pa-0">
                        <v-dialog width="500">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" variant="text" icon="mdi-comment" size="small"></v-btn>
                            </template>

                            <template v-slot:default="{ isActive }">
                                <v-card title="Add Comment">
                                <v-textarea 
                                variant="outlined" 
                                :model-value="rowObj.comment" 
                                @input = "setRowValue($event.target.value,{rowId:rowObj.id,name:'comment'})">
                                    
                                </v-textarea>

                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                    <v-btn
                                    text="Save Changes"
                                    @click="isActive.value = false"
                                    color="#4287f5"
                                    ></v-btn>
                                </v-card-actions>
                                </v-card>
                            </template>
                        </v-dialog>
                    </td>

                    <td class="pa-0">
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
        <div class="mt-4 d-flex flex-row align-center justify-space-between">
            <v-btn color="#0047ba" prepend-icon="mdi-plus" @click="addNewRow">
                  New Row
            </v-btn>
            <p v-if="isMoreEightHours" style="color:red ;" class="error-message">Error:Maxmium 8 hours per day allowed</p>
            <p v-else class="error-message">*Maxmium 8 hours per day allowed</p>
        </div>
        
    </v-container>
</div>
</template>

<script>
    import {v4 as uuidV4} from "uuid";
    import {mapState} from "vuex"
    import ReviewTable from "./ReviewTable.vue";


    export default({
        data(){
            return (
                {
                    dialog:false,
                    sheetObj:this.timeSheetObj,
                    saveLodaing:false ,
                    isSaved: true ,
                    projectList:[],
                    timeSheetList:[],
                    isMoreEightHours:false,
                    submitLoading:false ,
                }
            )
        },

        props:[
            'timeSheetObj'
        ],

        watch:{
            timeSheetObj(newValue){
                this.sheetObj = newValue ;
                this.getTimeSheetData()
            }
        },

        components:{
            ReviewTable,
        },
    
        computed:{
            ...mapState([
                'employeeId','selectedWeek','weeklyProjectHoursList'
            ]),

            getTotal(){
                const list = this.timeSheetList ;

                let totalHours = 0 ;
                list.forEach((eachObj)=>{
                    totalHours += eachObj['total'] ;
                })

                return totalHours.toFixed(1)
            },
        },

        methods:{
            checkDropDown(obj){

                console.log(obj.rowId, obj.name) ;
                console.log(this.selectValue) ;

            },

            restrictChar(event, data){
                
                let value = event.target.value ;
          
                if(parseFloat(value) > 8 || parseFloat(value) < 0){
            
                    event.target.value = null;
                    value = null
                }
               
                value = isNaN(parseFloat(value)) ? null : parseFloat(parseFloat(value).toFixed(1)) ;

                if(this.isTotalMoreThanEight(value,data)){
                    this.isMoreEightHours = true ;
                    event.target.value = null;
                    value = null ;
                }else{
                    this.isMoreEightHours = false ;
                    
                }

                this.setRowValue(value, data) ;
            },

            isTotalMoreThanEight(value,data){
                const {rowId, name} = data ;

                const copyOfList = this.timeSheetList.map((eachObj) => {
                    if(eachObj.id === rowId){
                        const newObj = {...eachObj}
                        newObj[name] = value;
                        return newObj ;
                    }

                    return {...eachObj}
                })

                let totalHours = 0 ;

                copyOfList.forEach(eachObj => {
                    totalHours += eachObj[name]
                })

                return totalHours > 8 ;

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
                    id:uuidV4(),
                    projectId:null,
                    projectName:null,
                    monday:null,
                    tuesday:null,
                    wednesday:null,
                    thursday:null,
                    friday:null,
                    satuarday:null,
                    sunday:null,
                    total:null,
                    comment:null,
                }

                this.timeSheetList = [...this.timeSheetList, newRow] ;
                //this.$store.dispatch('createNewRow')
            },


            setRowValue(value, obj){
                const {rowId, name} = obj ;

                console.log(value) ;
                console.log(obj) ;
                
                const row = this.timeSheetList.find((each) => each.id === rowId)

                if(row){
                    row[name] = value ;
                }

                this.isSaved = false ;
                
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
            },

            async getTimeSheetData(){
                const url = `http://localhost:8001/timesheet/${this.sheetObj.timeSheetId}` ;
                const options = {
                    method:"GET",
                    headers:{
                        'Content-Type':'application/json',
                    }
                }

                const response = await fetch(url, options) ;

                

                if(response.ok){
                    const data = await response.json() ;
                    this.timeSheetList = data ;

                    if(this.timeSheetList.length === 0){
                        this.addNewRow()
                        
                    }
                }
            },

            async onClickSave(){
                this.saveLodaing = true;


                const url = `http://localhost:8001/timesheet/save/${this.sheetObj.timeSheetId}`

                const options = {
                    method:"PUT",
                    headers:{
                        'Content-Type':"application/json",
                        'Accept':"application/json",
                    },

                    body:JSON.stringify({arr:this.timeSheetList}) 
                }

                const response = await fetch(url, options)

                if(response.ok){
                    const data = await response.json()
                    console.log(data.text) ;
                }

                this.saveLodaing = false
                this.isSaved = true ;
            },

            async onClickSubmit(){
                this.submitLoading = true ;

                const url = `http://localhost:8001/timesheet/submit/${this.sheetObj.timeSheetId}`
                const options = {
                    method:"PUT",
                    headers:{
                        'Content-Type':"application/json",
                        'Accept':"application/json"
                    }
                }

                const response = await fetch(url, options) ;

                if(response.ok){
                    const data = await response.json() ;
                    console.log(data.text) ;
                    this.dialog = false ;
                }

                this.submitLoading = false;
                
            }

        },

        mounted(){
            this.getProjectData() ;
            this.getTimeSheetData() ;
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
    .error-message{
        font-size:12px;
    }
</style>