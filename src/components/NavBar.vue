<template>
  <v-container fluid>
        <v-row class="nav-bar-card">
            <v-col cols="8">
                <div>
                    <router-link to="/">
                        <img class="website-logo" src="https://static.wixstatic.com/media/a2c5d8_c4200c39dc3647a0a3a0bebebd9ab1c3~mv2.png/v1/fill/w_640,h_184,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/a2c5d8_c4200c39dc3647a0a3a0bebebd9ab1c3~mv2.png" />
                    </router-link>  
                </div>
            </v-col>
            <v-col>
                <div class="nav-items-card d-flex flex-row align-center justify-space-around">
                    <div class="nav-item">
                        <v-menu
                            open-on-hover
                            >
                            <template v-slot:activator="{ props }">
                                <v-btn
                                color="primary"
                                v-bind="props"
                                >
                                TimeSheet
                                </v-btn>
                            </template>

                            <v-list>
                                <v-list-item
                                >
                                <v-list-item-title>
                                    <TimeSheet /> 
                                </v-list-item-title>
                                </v-list-item>

                                <v-list-item v-if="!isAdmin">
                                    <v-list-item-title>
                                        <router-link to="/">
                                            <v-btn
                                                    variant="text"
                                                    color="primary"
                                                >
                                                    Search Timesheet
                                            </v-btn> 
                                        </router-link>
                                    </v-list-item-title>
                                </v-list-item>

                                <v-list-item v-if="isAdmin">
                                    <v-list-item-title>
                                        <router-link to="/">
                                            <v-btn
                                                variant="text"
                                                color="primary"
                                                >
                                                Employee Timesheet
                                            </v-btn>
                                        </router-link>
                                    </v-list-item-title>
                                </v-list-item>

                                <v-list-item v-if="isAdmin">
                                    <v-list-item-title>
                                        <router-link to="/export">
                                            <v-btn
                                                variant="text"
                                                color="primary"
                                                >
                                                Export Timesheet
                                            </v-btn>
                                        </router-link>
                                    </v-list-item-title>
                                </v-list-item>

                            </v-list>
                        </v-menu>                        
                    </div>
                                       
                    <div class="nav-item">
                        <v-btn color="warning" v-on:click="$store.dispatch('onLogout')">
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
    import TimeSheet from "./TimeSheet.vue"
    //import SearchTimeSheet from "./SearchTimesheet.vue" ;
    //import EmployeeTimeSheet from "./EmployeeTimesheet.vue" 

export default {
    
    components:{
            TimeSheet,//SearchTimeSheet, //EmployeeTimeSheet
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