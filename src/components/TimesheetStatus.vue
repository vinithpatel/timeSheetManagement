<template>
    <div>
        <v-chip
        class="ma-2"
        :color="colorName"
        >
        {{ status }}
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
        }
        
    }
}
</script>

<style>

</style>