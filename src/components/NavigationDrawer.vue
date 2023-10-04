<template>
    <v-navigation-drawer
        expand-on-hover
        rail
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="Employee"
          nav
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <div class="mb-5">
            <v-list-subheader class="text-subtitle-1">EMPLOYEE</v-list-subheader>      
            <v-list-item prepend-icon="mdi-file-send" title="Submit Timesheet" value="home"><TimeSheet /></v-list-item>
            <router-link to="/" class="router-link">
              <v-list-item prepend-icon="mdi-text-box-search" title="Search Timesheet" value="searchTimesheet"></v-list-item>
            </router-link>
          </div>
          <div v-if="isAdmin">
              <v-list-subheader class="text-subtitle-1">Admin</v-list-subheader>      
              <router-link to="/" class="router-link">
                <v-list-item prepend-icon="mdi-account-search" title="Employee Timesheet" value="employeeTimesheet"></v-list-item>
              </router-link>

              <router-link to="/employees" class="router-link">
                <v-list-item prepend-icon="mdi-account-supervisor" title="Employees" value="employees"></v-list-item>
              </router-link>

              <router-link to="/customers" class="router-link">
                <v-list-item prepend-icon="mdi-domain" title="Customers" value="customers"></v-list-item>
              </router-link>

              <router-link to="/projects" class="router-link">
                  <v-list-item prepend-icon="mdi-file-multiple" title="Projects" value="projects"></v-list-item>
              </router-link>

              <router-link to="/export" class="router-link">
                <v-list-item prepend-icon="mdi-export" title="Export Timesheet" value="export"></v-list-item>
              </router-link>
            </div>
        </v-list>
      </v-navigation-drawer>
</template>

<script>
  import TimeSheet from './TimeSheet.vue';
  import {mapState} from "vuex"
    export default({
        data(){
            return ({

            })
        },

        components:{
          TimeSheet,
        },

        computed:{
        ...mapState(['isAdmin'])
        },

    })
</script>

<style scoped>
  .router-link{
    text-decoration: none;
    color:black;
  }
</style>