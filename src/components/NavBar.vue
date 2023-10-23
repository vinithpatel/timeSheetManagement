<template>
  <v-container fluid>
        <v-row  justify="space-between" class="nav-bar-card">
            <v-col cols="4">
                <div>
                    <router-link to="/">
                        <img class="website-logo" src="https://static.wixstatic.com/media/a2c5d8_c4200c39dc3647a0a3a0bebebd9ab1c3~mv2.png/v1/fill/w_640,h_184,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/a2c5d8_c4200c39dc3647a0a3a0bebebd9ab1c3~mv2.png" />
                    </router-link>  
                </div>
            </v-col>
            <v-col cols="2">
                <div class="nav-items-card d-flex flex-row align-center justify-space-around">
                                                         
                    <div class="nav-item">
                        <v-btn variant="outlined" color="warning" v-on:click="$store.dispatch('onLogout')">
                            Logout
                        </v-btn>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapState} from "vuex" ;
    //import TimeSheet from "./TimeSheet.vue"
    //import SearchTimeSheet from "./SearchTimesheet.vue" ;
    //import EmployeeTimeSheet from "./EmployeeTimesheet.vue" 

export default {
    
    components:{
            //TimeSheet,//SearchTimeSheet, //EmployeeTimeSheet
    },

    computed:{
        ...mapState(['isAdmin'])
    }
}
</script>

<style>
     .nav-bar-card{
        background-image:url("https://img.freepik.com/free-vector/v915_53876-169281.jpg?size=626&ext=jpg&ga=GA1.2.667574115.1686675570&semt=ais") ;
        background-size:cover;
    }
    .nav-item-title{
        font-size:20px;
        background-color:blue ;
    }

    .website-logo{
        height:40px;
    }
</style>