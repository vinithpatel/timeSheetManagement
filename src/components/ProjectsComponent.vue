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
                  <NewProjectPopup @getProjectsList="getProjectsList"/>
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

                  <th class="text-center">
                    Start Date
                  </th>

                  <th class="text-center">
                    
                    End Date
                    
                  </th>
                  <th class="text-center">
                    Description
                  </th>
                  
                  <th  >
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
                  <td class="text-center" >{{ getFormatedDateString(item.startDate) }}</td>
                  <td class="text-center" >{{ getFormatedDateString(item.endDate) }}</td>
                  <td><CommentPopup :comment="item.description" /></td>
                  
                  <td>{{ item.customer }}</td>
                  <td >
                    <div >
                      <div class="d-flex flex-row aling-center">{{ item.cost }}<p v-if="item.cost !== null">({{ item.currency }})</p></div>
                      <div v-if="item.type==='Billable' && item.costType==='Time & Material'" style="font-size:12px;">Time & Material</div>
                    </div>
                  </td>
                  <td>
                    <DeleteButton v-slot="{onOpenDialog}" @onRemove="onRemove" v-bind:id="item.projectId">
                      <v-btn icon="mdi-delete" variant="text" color="#a11a1a" @click="onOpenDialog">
                      
                      </v-btn>
                    </DeleteButton> 
                  </td>         
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
  import DeleteButton from './DeleteButton.vue'
  import NewProjectPopup from "./NewProjectPopup.vue"

  export default({
    data(){
      return ({
        searchProjectName:'',
        searchLoading:false,
        projectsList:'',
      })
    },

    components:{
      CommentPopup,DeleteButton,NewProjectPopup
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

      async onRemove(projectId){
          console.log("project delete")
          console.log(projectId)

          const url = `http://localhost:8001/project/delete/${projectId}`
          const options = {
            method:"DELETE",
            headers:{
              'Content-Type':'application/json'
            }
          }

          const response = await fetch(url, options) ;

          if(response.ok){
            const data = await response.json() ;
            console.log(data.message) ;
            this.getProjectsList()
          }
      } 

    },

    mounted() {
        this.getProjectsList()
      },

  })
</script>

<style scoped>

</style>