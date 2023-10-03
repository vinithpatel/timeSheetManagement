<template>
  <v-app>
    
    <v-layout>
      <NavigationDrawer v-if="isLogin"/>
      <v-app-bar v-if="isLogin" >
      <NavBar />
    </v-app-bar>

      <v-main class="d-flex align-center justify-center" >
          <router-view></router-view>
      </v-main>
      
    </v-layout>
      <!-- 
      <NotificationBar /> -->
      
    </v-app>
</template>

<script>
  import {mapState} from "vuex"
  import NavBar from "./components/NavBar.vue"
  //import NotificationBar from "./components/NotificationBar.vue";
  import NavigationDrawer from "./components/NavigationDrawer.vue";

export default {
  name: 'App',

  data: () => ({
    isUserLogin: false ,
    
  }),

  components:{
   NavBar,NavigationDrawer//NotificationBar 
  },

  computed:{
    ...mapState(['isLogin']), 
  },

  created(){
    this.$store.commit('updateLoginDetailsInState') ;
  }

}
</script>
