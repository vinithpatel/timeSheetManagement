<template>
    <v-container fluid class="w-100 h-100" >
    <v-card width="100%" height="100%" variant="elevated" elevation="10" :loading="searchLoading" >
        <v-toolbar
        dark
        color="#6a70eb"
        height="50"
        >
        <v-toolbar-title>Projects</v-toolbar-title>
        
      </v-toolbar>
        <v-card-title >
          <v-row justify="space-between" align="center">
          <v-col cols="12" md="6" >   
              <div class="d-flex flex-row align-center">
                  <v-btn prepend-icon="mdi-plus" color="primary"  @click="onupdateInput">
                    New
                  </v-btn>
              </div>
          </v-col>
          <v-col cols="3">
            <div>
                <v-text-field
                      :loading="searchLoading"
                      density="compact"
                      variant="outlined"
                      prepend-icon="mdi-filter"
                      
                      hide-details
                      placeholder="Search Project Name"
                      v-model="searchProjectName"
                      @input="onupdateInput"
                      
                      
                    ></v-text-field>
            </div>
          </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
            <v-table density="compact">
              
              <thead>
                <tr>
                  <th >
                    Project Id
                  </th>

                  <th >
                    Project Name
                  </th>

                  <th >
                    Type
                  </th>

                  <th >
                    Start Date
                  </th>

                  <th >
                    
                    End Date
                    
                  </th>
                  <th class="text-center">
                    Description
                  </th>
                  
                  <th class="text-center" >
                    Customer
                  </th>

                  <th class="text-center" >
                    Cost
                  </th>

                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in projectsList"
                  :key="item"
                >
                  <td >{{ item.projectId }}</td>
                  <td>{{ item.projectName}}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ getFormatedDateString(item.startDate) }}</td>
                  <td>{{ getFormatedDateString(item.endDate) }}</td>
                  <td><CommentPopup :comment="item.description" /></td>
                  
                  <td>{{ item.customer }}</td>
                  <td>{{ item.cost }}</td>                    
                </tr>

              </tbody>
            </v-table>
        </v-card-text>

        <div v-if="projectsList.length === 0" class="d-flex flex-row justify-center align-center">
            <p class="font-weight-medium">No Data Available</p>
        </div>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          
        </v-card-actions>
      </v-card>
</v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CommentPopup from './CommentPopup.vue'

  export default({
    data(){
      return ({
        searchProjectName:'',
        searchLoading:false,
        projectsList:'',
      })
    },

    components:{
      CommentPopup
    },

    computed:{
      ...mapGetters(['getFormatedDateString'])
    },


    methods:{
      onupdateInput(){
        this.getProjectsList()
      },

      async getProjectsList(){
        this.searchLoading = true

        const url = `http://localhost:8001/projects?projectName=${this.searchProjectName}`
        const options = {
          method:"GET",
          headers:{
            'Content-Type':"application/json"
          }
        }

        const response = await fetch(url, options) ;
        if(response.ok){
          const data = await response.json() ;
          this.projectsList = data ;
          this.searchLoading = false ;
          
        }
      },
    },

    mounted() {
        this.getProjectsList()
      },

  })
</script>

<style scoped>

</style>