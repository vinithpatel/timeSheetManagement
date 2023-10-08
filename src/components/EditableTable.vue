<template>
    <div>
        <div class="w-100 d-flex flex-row align-center justify-end">
            <v-btn 
                v-if="!isSaved && ! isMoreEightHours && getTotal <=40" 
                color="primary" class="mr-2" @click="onClickSave" :loading="saveLodaing">
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
                v-bind:disabled="!isSaved || isMoreEightHours || getTotal < 40 || getTotal > 40 || isTimeSheetValid"
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
            <v-table  height="400px">
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
                    <td>
                        <div class="mt-6 mb-6" >
                            <v-select
                            label="Select Project"
                            :items="localProjectsList"
                            variant="outlined"
                            :model-value="rowObj.projectName"
                            hide-details
                            @update:model-value="setProjectValue($event,{rowId:rowObj.id, name:'projectName'})"              
                            ></v-select>              
                        </div>
                    </td>
                    <td class="text-center pa-1" style="width:95px;">
                        <InputField 
                            v-slot="{isHovered, onClickIcon}" 
                            :comment="rowObj.mondayComment" 
                            :obj="{rowId:rowObj.id, name:'mondayComment'}" 
                            @setRowValue="setRowValue" 
                        >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                            @input = "restrictChar($event,{rowId:rowObj.id,name:'monday'})"
                            v-bind:model-value="rowObj.monday"
                            type="number"
                            v-bind:v-model="rowObj.monday"
                            :append-inner-icon="isHovered ? 'mdi-comment' : ''"
                            @click:append-inner="onClickIcon"         
                        >           
                        </v-text-field>
                    </InputField>
                                                  
                    </td>
                    <td class="text-center pa-1" style="width:95px;">
                        <InputField 
                            v-slot="{isHovered, onClickIcon}" 
                            :comment="rowObj.tuesdayComment"
                            :obj="{rowId:rowObj.id, name:'tuesdayComment'}" 
                            @setRowValue="setRowValue"
                        >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'tuesday'})"
                        v-bind:model-value="rowObj.tuesday"
                        type="number"
                        :append-inner-icon="isHovered ? 'mdi-comment' : ''"
                        @click:append-inner="onClickIcon" 
                        >
                        </v-text-field>
                        </InputField>
                    </td>
                    <td class="text-center pa-1" style="width:95px;">
                        <InputField 
                            v-slot="{isHovered, onClickIcon}" 
                            :comment="rowObj.wednesdayComment"
                            :obj="{rowId:rowObj.id, name:'wednesdayComment'}" 
                            @setRowValue="setRowValue"
                        >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'wednesday'})"
                        v-bind:model-value="rowObj.wednesday"
                        type="number"
                        :append-inner-icon="isHovered ? 'mdi-comment' : ''"
                        @click:append-inner="onClickIcon" 
                        >
                        </v-text-field>
                    </InputField>
                    </td>
                    <td class="text-center pa-1" style="width:95px;">
                        <InputField 
                            v-slot="{isHovered, onClickIcon}" 
                            :comment="rowObj.thursdayComment"
                            :obj="{rowId:rowObj.id, name:'thursdayComment'}" 
                            @setRowValue="setRowValue"
                        >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'thursday'})"
                        v-bind:model-value="rowObj.thursday"
                        type="number"
                        :append-inner-icon="isHovered ? 'mdi-comment' : ''"
                        @click:append-inner="onClickIcon" 
                        >
                        </v-text-field>
                    </InputField>
                    </td>
                    <td class="text-center pa-1" style="width:95px;">
                        <InputField 
                            v-slot="{isHovered, onClickIcon}" 
                            :comment="rowObj.fridayComment"
                            :obj="{rowId:rowObj.id, name:'fridayComment'}" 
                            @setRowValue="setRowValue"
                        >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'friday'})"
                        v-bind:model-value="rowObj.friday"
                        type="number"
                        :append-inner-icon="isHovered ? 'mdi-comment' : ''"
                        @click:append-inner="onClickIcon" 
                        >
                        </v-text-field>
                    </InputField>
                    </td>
                    <td class="text-center pa-1" style="width:95px;">
                        <InputField 
                            v-slot="{isHovered, onClickIcon}" 
                            :comment="rowObj.satuardayComment"
                            :obj="{rowId:rowObj.id, name:'satuardayComment'}" 
                            @setRowValue="setRowValue"
                        >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'satuarday'})"
                        v-bind:model-value="rowObj.satuarday"
                        type="number"
                        :append-inner-icon="isHovered ? 'mdi-comment' : ''"
                        @click:append-inner="onClickIcon" 
                        >
                        </v-text-field>
                    </InputField>
                    </td>
                    <td class="text-center pa-1" style="width:95px;">
                        <InputField 
                            v-slot="{isHovered, onClickIcon}" 
                            :comment="rowObj.sundayComment"
                            :obj="{rowId:rowObj.id, name:'sundayComment'}" 
                            @setRowValue="setRowValue"
                        >
                        <v-text-field  variant="outlined" density="comfortable" hide-details
                        
                        @input = "restrictChar($event,{rowId:rowObj.id,name:'sunday'})"
                        v-bind:model-value="rowObj.sunday"
                        type="number"
                        :append-inner-icon="isHovered ? 'mdi-comment' : ''"
                        @click:append-inner="onClickIcon" 
                        >
                        </v-text-field>
                    </InputField>
                    </td>

                    <td class="text-center">
                        <p>
                            {{ totalHoursOnProject(rowObj) }}
                        </p>
                    </td>

                    <td class="pa-0">
                        <v-btn icon="mdi-close" variant="text" size="small" @click="onClickDelete(rowObj.id)" >
                        
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
                    
                    <td class="text-center" v-for="day in daysList" :key="day" >
                        <div>
                            <p :class="getTotalHoursOfDay(day) > 8 ? 'error' : '' ">{{ getTotalHoursOfDay(day) }}</p>
                            <p v-if="getTotalHoursOfDay(day) > 8" class="error-message error">8 Hours allowed</p>
                        </div>
                    </td>
                   

                    <td class="text-center" >
                        <p v-bind:class="getTotal > 40 ? 'error' : ''" >{{ getTotal}}</p>
                        <p v-if="getTotal > 40" class="error-message error" >40HRS allowed</p>
                    </td>
                </tr>
                </tbody>
            </v-table>
        </v-row>
        <div class="mt-4 d-flex flex-row align-center justify-space-between">
            <v-btn v-if="timeSheetList.length < projectList.length" color="#0047ba" prepend-icon="mdi-plus"  @click="addNewRow" >
                  New Row
            </v-btn>
            
            <div>
                <p class="error-message">*Maxmium 8 hours per day allowed</p>
                <p class="error-message">*40 hours per week allowed</p>
            </div>
        </div>
        
    </v-container>
</div>
</template>

<script>
    import {v4 as uuidV4} from "uuid";
    import {mapState} from "vuex"
    import ReviewTable from "./ReviewTable.vue";
    import InputField from "./InputField.vue" ;


    export default({
        data(){
            return (
                {
                    isHovering:false,
                    dialog:false,
                    sheetObj:this.timeSheetObj,
                    saveLodaing:false ,
                    isSaved: true ,
                    timeSheetList:[],
                    localProjectsList:[],
                    submitLoading:false ,
                    daysList:['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'satuarday', 'sunday'],
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
            },
            
            timeSheetList(){
                this.updateLocalProjectList()
            }

        },

        components:{
            ReviewTable,InputField
        },
    
        computed:{
            ...mapState([
                'employeeId','employeeName','selectedWeek','projectList'
            ]),

            getTotal(){
                const list = this.timeSheetList ;

                let totalHours = 0 ;
                list.forEach((eachObj)=>{
                    totalHours += eachObj.monday+eachObj.tuesday+eachObj.wednesday+eachObj.thursday+eachObj.friday+eachObj.satuarday+eachObj.sunday ;
                })

                return totalHours.toFixed(1)
            },

            isMoreEightHours(){
                for(let day of this.daysList){

                    if(this.getTotalHoursOfDay(day) > 8){
                        return true ;
                    }
                }

                return false ;
            },

            isTimeSheetValid(){
                if(this.timeSheetList.length > 0){
                    return this.timeSheetList[0].projectId === null
                }

                return true
            },

        },

        methods:{

        restrictChar(event, data){
                
                let value = event.target.value ;
          
                if(parseFloat(value) > 8 || parseFloat(value) < 0){
            
                    event.target.value = null;
                    value = null
                }
               
                value = isNaN(parseFloat(value)) ? null : parseFloat(parseFloat(value).toFixed(1)) ;

                /*
                if(this.isTotalMoreThanEight(value,data)){
                    this.isMoreEightHours = true ;
                    event.target.value = null;
                    value = null ;
                }else{
                    this.isMoreEightHours = false ;
                    
                }
                */

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
                    mondayComment:null,
                    tuesdayComment:null,
                    wednesdayComment:null,
                    thursdayComment:null,
                    fridayComment:null,
                    satuardayComment:null,
                    sundayComment:null
                }

                this.timeSheetList = [...this.timeSheetList, newRow] ;
                //this.$store.dispatch('createNewRow')
        },

        setProjectValue(projectName, obj){
            const projectObj = this.projectList.find(each => each.projectName === projectName)

            console.log(projectObj.projectId)
            console.log(projectObj.projectName)

            this.setRowValue(projectObj.projectId, {...obj,name:'projectId'}) ; //overwring the obj 
            this.setRowValue(projectObj.projectName, obj) ;
            this.updateLocalProjectList()
        },

        setRowValue(value, obj){
                const {rowId, name} = obj ;
                
                const row = this.timeSheetList.find((each) => each.id === rowId)

                if(row){
                    row[name] = value ;
                }


                this.isSaved = false ;
                
        },

        updateLocalProjectList(){
            const filterList = this.projectList.filter((eachObj) => {
                    const condition = this.timeSheetList.every(timeSheetObj => timeSheetObj.projectId !== eachObj.projectId)
                    return condition
            })
        
            this.localProjectsList =  filterList.map(each => each.projectName) ;
        },
            
        totalHoursOnProject(rowObj){     

            const total = (rowObj.monday+rowObj.tuesday+rowObj.wednesday+rowObj.thursday+rowObj.friday+rowObj.satuarday+rowObj.sunday)
            
            return total.toFixed(1) ;
        },

        onClickDelete(id){
            this.isSaved = false;

            const updatedList = this.timeSheetList.filter((each) => (each.id !== id))
            this.timeSheetList = updatedList ;
        },

        async getProjectData(){
                await this.$store.dispatch('getProjectData') 
                this.localProjectsList = this.projectList.map(each => each.projectName);
        },

        async getTimeSheetData(){
                const url = `http://localhost:8001/timesheet/projects/${this.sheetObj.timeSheetId}` ;
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

                await this.$store.dispatch('submitTimeSheet', this.sheetObj.timeSheetId) ;  
                await this.$store.dispatch('sendEmail',
                     
                    {
                        timeSheetId:this.sheetObj.timeSheetId,
                        startDate:this.sheetObj.startDate,
                        endDate:this.sheetObj.endDate ,
                    }
                ) ;     

                this.dialog = false ;
                this.submitLoading = false;
                this.$emit('getTimeSheet') ;
                
            },

        },

        created(){
            this.getProjectData() ;
            this.getTimeSheetData() ;
        },
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
        font-size:10px;
    }

    .error{
        color:red;
    }

    v-text-field, v-con{
        font-size:12px;
    }

</style>