<template>
    <div>
        <v-chip
        class="ma-2"
        :color="colorName"
        >
        {{ statusName }}
        </v-chip>
    </div>
</template>

<script>
export default {
    props:[
        'status'
    ],

    computed:{
        colorName(){
            if(this.status === 'open'){
                return 'blue';
            }
            else if(this.status === 'submited'){
                return 'success';
            }else if(this.status === "approved"){
                return 'teal' ;
            }else if(this.status === 'denied'){
                return 'red' ;
            }

            return ''
        },

        statusName(){
            if(this.status === 'open'){
                return "Open" ;
            }else if(this.status === 'submited'){
                return "Submitted" ;
            }else if(this.status === 'approved'){
                return "Approved" ;
            }else if(this.status === "denied"){
                return "Denied" ;
            }

            return 'invalid'
        }
        
    }
}
</script>

<style>

</style>