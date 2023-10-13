<template>
    <v-container fluid class="w-100 h-100" >
    <v-card width="100%" height="100%" variant="elevated" elevation="10" :loading="searchLoading" >
        <v-toolbar
        dark
        color="#6a70eb"
        height="50"
        >
        <v-toolbar-title>Customers</v-toolbar-title>
        
      </v-toolbar>
        <v-card-title >
          <v-row justify="space-between" align="center">
          <v-col cols="12" md="6" >   
              <div class="d-flex flex-row align-center">
                  <NewCustomerPopup @getCustomersList="getCustomersList"/>
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
                      placeholder="Search Customer"
                      v-model="searchCustomer"
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
                    Id
                  </th>

                  <th >
                    Name
                  </th>

                  <th >
                    Email
                  </th>

                  <th>
                    Contact Person
                  </th>

                  <th>
                    Contact No
                  </th>

                  <th class="text-center">
                    Address
                  </th>


                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in customersList"
                  :key="item"
                >
                  <td >{{ item.customerId }}</td>
                  <td>{{ item.name}}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.contactPerson }}</td>
                  <td>{{ item.contactNumber }}</td>
                  
                  <td><CommentPopup :comment="item.address" /></td>
                  
                  <td>
                    <DeleteButton v-slot="{onOpenDialog}" @onRemove="onRemove" v-bind:id="item.customerId">
                      <v-btn icon="mdi-delete" variant="text" color="#a11a1a" @click="onOpenDialog">
                      
                      </v-btn>
                    </DeleteButton>   
                  </td>         
                </tr>

              </tbody>
            </v-table>
        </v-card-text>

        <div v-if="customersList.length === 0" class="d-flex flex-row justify-center align-center">
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
  import NewCustomerPopup from "./NewCustomerPopup.vue"

  export default({
    data(){
      return ({
        searchCustomer:'',
        searchLoading:false,
        customersList:'',
      })
    },

    components:{
      CommentPopup,DeleteButton,NewCustomerPopup
    },

    computed:{
      ...mapGetters(['getFormatedDateString','getHeaders'])
    },


    methods:{
      onupdateInput(){
        this.getCustomersList()
      },

      async getCustomersList(){
        this.searchLoading = true

        const url = `http://localhost:8001/customers?name=${this.searchCustomer}`

        const options = {
          method:"GET",
          ...this.getHeaders,
        }

        const response = await fetch(url, options) ;
        if(response.ok){
          const data = await response.json() ;
          this.customersList = data ;
          this.searchLoading = false ;
          
        }
      },

      async onRemove(id){

          const url = `http://localhost:8001/customer/delete/${id}`
          const options = {
            method:"DELETE",
            ...this.getHeaders,
          }

          const response = await fetch(url, options) ;

          if(response.ok){
            const data = await response.json() ;
            console.log(data.message) ;
            this.getCustomersList()
          }
      } 

    },

    mounted() {
        this.getCustomersList()
      },

  })
</script>

<style scoped>

</style>