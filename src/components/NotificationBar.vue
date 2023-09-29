<template>
    <div class="text-center">
        
      <v-snackbar
        v-model="notificationObj.show"
        :timeout="timeout"
        
      >
        {{ notificationObj.message  }}
  
        <template v-slot:actions>
          <v-btn
            color="blue"
            variant="text"
            @click="closeSnackBar"
            icon="mdi-close"
          >
          </v-btn>
        </template>
      </v-snackbar>
    </div>
   
  </template>

<script>
    import {mapState, mapActions} from "vuex" ;

    export default {
    data: () => ({
        snackbar: false,
        text: 'Timesheet Submitted Successfull',
        timeout: 2000,
    }),

    computed:{
        ...mapState(['notificationObj'])
    },

    methods:{
        ...mapActions(['hideNotification']),

        closeSnackBar(){
            this.hideNotification() ;
        }
    },

    
    }
</script>

<style scoped>
    
</style>