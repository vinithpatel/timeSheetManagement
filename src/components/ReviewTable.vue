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
                    v-for="(rowObj, index) in timeSheetList"
                    :key="index"
                    >
                    <td>
                        <div class="mt-6 mb-6 font-weight-medium">        
                            <p>{{ getProjectName(rowObj.projectId) }}</p>
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
                            {{ totalHoursOnProject(rowObj) }}
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
</template>

<script>
    import {mapState} from "vuex" 
    import CommentPopup from "./CommentPopup.vue"

    export default({
        data(){
            return (
                {
                    timeSheetList: this.weekData,
                }
            )
        },

        props:[
            'weekData'
        ],

        components:{
            CommentPopup,
        },

        watch:{
            weekData(newValue){
                this.timeSheetList = newValue ;
            }
        },

        computed:{
            ...mapState(['projectList']),

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

            totalHoursOnProject(rowObj){     

            const total = (rowObj.monday+rowObj.tuesday+rowObj.wednesday+rowObj.thursday+rowObj.friday+rowObj.satuarday+rowObj.sunday)

            return total.toFixed(1) ;
            },

            getProjectName(projectId){
                
                const obj = this.projectList.find((each) => each.projectId === projectId) ;
           
                return obj.projectName ;
            },

            checkAndGetValue(value){
                if(value === 0){
                    return null
                }
                
                return value ;
            }
        }
    })
</script>