<template>
    <div class="d-flex flex-row align-center">
        <div class="d-flex flex-column mr-3 w-50">
            <label class="calender-input-label">Start Date</label>
            <input class="calendar-input" type="date" v-model="startDate" v-on:change="onDateChange"/>
        </div>
        <div class="d-flex flex-column w-50">
            <label class="calender-input-label">End Date</label>
            <input class="calendar-input" type="date" v-model="endDate" v-on:change="onDateChange" />
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return({
            startDate:null,
            endDate:null,
        })
    },


    methods:{
        
        onDateChange(){           
            this.$emit('updateDateRange', {startDate:new Date(this.startDate), endDate:new Date(this.endDate)}) ;
        }
    }
}
</script>

<style scoped>
    .calendar-input{
        font-size:14px;
        font-weight:normal;
        height:40px;
        
        border:1px solid #d2d5d9 ;
        padding:5px;
    }

    .calender-input-label{
        font-size:13px;
        color:#4d4f54;
    }
</style>