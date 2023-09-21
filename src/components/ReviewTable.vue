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
                        <div class="mt-6 mb-6">        
                            <p>{{ getProjectName(rowObj.projectId) }}</p>
                        </div>
                    </td>
                    <td class="text-center" >
                        <p>{{ rowObj.monday }}</p>
                    </td>
                    <td class="text-center">
                        <p>{{ rowObj.tuesday }}</p>
                    </td>
                    <td class="text-center">
                        <p>{{ rowObj.wednesday }}</p>
                    </td>
                    
                    <td class="text-center">
                        <p>{{ rowObj.thursday }}</p>
                    </td>
                    <td class="text-center">
                        <p>{{ rowObj.friday }}</p>
                    </td>
                    <td class="text-center">
                        {{ rowObj.satuarday }}
                    </td>
                    <td class="text-center">
                        {{ rowObj.sunday }}
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
            }
        }
    })
</script>