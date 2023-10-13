<template>
    <div>
        <div v-if="loading" class="w-100 d-flex flex-row align-center justify-center" style="height:200px">
            <v-progress-circular color="primary" indeterminate></v-progress-circular>
        </div>
        <v-container v-if="!loading">
        <v-row >
            <v-table>
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
                    v-for="(rowObj, index) in timeSheetList"
                    :key="index"
                    >
                    <td>
                        <div class="mt-6 mb-6 font-weight-medium">        
                            <p>{{ rowObj.projectName }}</p>
                        </div>
                    </td>
                    <td class="text-center" >
                        <CommentPopup :comment="rowObj.mondayComment" >
                            <p>{{ checkAndGetValue(rowObj.monday) }}</p>
                        </CommentPopup>
                    </td>
                    <td class="text-center">
                        <CommentPopup :comment="rowObj.tuesdayComment">
                            <p>{{ checkAndGetValue(rowObj.tuesday) }}</p>
                        </CommentPopup>
                    </td>
                    <td class="text-center">
                        <CommentPopup :comment="rowObj.wednesdayComment">
                            <p>{{ checkAndGetValue(rowObj.wednesday) }}</p>
                        </CommentPopup>
                    </td>
                    
                    <td class="text-center">
                        <CommentPopup :comment="rowObj.thursdayComment" >
                            <p>{{ checkAndGetValue(rowObj.thursday) }}</p>
                        </CommentPopup>
                    </td>
                    <td class="text-center">
                        <CommentPopup :comment="rowObj.fridayComment" >
                            <p>{{ checkAndGetValue(rowObj.friday) }}</p>
                        </CommentPopup>
                    </td>
                    <td class="text-center">
                        <CommentPopup :comment="rowObj.satuardayComment">
                            <p>{{ checkAndGetValue(rowObj.satuarday) }}</p>
                        </CommentPopup>
                    </td>
                    <td class="text-center">
                        <CommentPopup :comment="rowObj.sundayComment" >
                            <p>{{ checkAndGetValue(rowObj.sunday) }}</p>
                        </CommentPopup>
                    </td>


                    <td class="text-center">
                        <p>
                            {{ rowObj.total }}
                        </p>
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
    </v-container>
</div>
</template>

<script>
    import CommentPopup from "./CommentPopup.vue"
    import { mapGetters } from "vuex";

    export default({
        data(){
            return (
                {
                    selectValue:"",
                    loading:false,
                    timeSheetList: [],
                    sheetObj:this.timeSheetObj,
                }
            )
        },

        props:[
            'timeSheetObj'
        ],

        components:{
            CommentPopup,
        },

        watch:{
            timeSheetObj(newValue){
                this.sheetObj = newValue ;
                this.getTimeSheetData() ;
            }
        },

        computed:{

            ...mapGetters(['getHeaders']),

            getTotal(){
               
                const list = this.timeSheetList ;

                let totalHours = 0 ;
                list.forEach((eachObj)=>{
                    totalHours += eachObj.monday+eachObj.tuesday+eachObj.wednesday+eachObj.thursday+eachObj.friday+eachObj.satuarday+eachObj.sunday ;
                })

                return totalHours.toFixed(1)
            },
            
        },

        methods:{

            getTotalHoursOfDay(dayName){
                
                const list = this.timeSheetList;

                let totalHours = 0 ;
                list.forEach((eachObj)=>{
                    totalHours += eachObj[dayName] ;
                })

                return totalHours.toFixed(1)

                
            },

            async getTimeSheetData(){
                this.loading = true ;

                const url = `http://localhost:8001/timesheet/projects/${this.sheetObj.timeSheetId}` ;
                const options = {
                    method:"GET",
                    ...this.getHeaders,
                }

                try{
                    const response = await fetch(url, options) ;
                    if(response.ok){
                    const data = await response.json() ;
                    this.timeSheetList = data ;

                }
                }
                catch(error){
                    console.log(error) ;
                }               

                this.loading = false;
            },

            checkAndGetValue(value){
                if(value === 0){
                    return null
                }
                
                return value ;
            }
        },
        
        mounted(){
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
</style>