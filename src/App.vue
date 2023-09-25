<template>
  <v-app>
      <NavBar v-if="isLogin" />
      <NotificationBar />
      <v-main>
          <router-view></router-view>
      </v-main>
    </v-app>
</template>

<script>
  import {mapState} from "vuex"
  import NavBar from "./components/NavBar.vue"
  import NotificationBar from "./components/NotificationBar.vue";

export default {
  name: 'App',

  data: () => ({
    isUserLogin: false ,
  }),

  components:{
    NavBar,NotificationBar
  },

  computed:{
    ...mapState(['isLogin']),
  },

}
</script>
