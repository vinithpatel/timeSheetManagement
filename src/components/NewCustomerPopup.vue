<template>
    <v-container>
    
      <v-dialog
        v-model="dialog"
        persistent
        width="1024"
      >
      
        <template v-slot:activator="{ props }">
            <v-btn variant="outlined" prepend-icon="mdi-plus" color="primary" v-bind="props">
                    New
            </v-btn>
                 
        </template>
        
        <v-card>
          <v-card-title>
            Add Customer
          </v-card-title>

          <v-card-text>
            <v-form v-model="form">
                <v-row align="center"  >
                    <v-col cols="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Customer"
                            
                            :rules="[rules.required]"
                            placeholder="Customer"
                            v-model="name"
                                                       
                        ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Contact Number"

                            type="number"
                            :rules="[rules.required]"
                            placeholder="Contact Number"
                            v-model="number"
                                                       
                        ></v-text-field>
                    </v-col>

                </v-row>
                
                <v-row>
                    <v-col cols="4">
                        <v-text-field
                            density="compact"
                            variant="outlined"
                            label="Email"

                            :rules="[rules.required, rules.email]"
                            placeholder="Email"
                            v-model="email"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="8">
                        <v-textarea
                                density="compact"
                                variant="outlined"
                                label="Address"

                                placeholder="Address"
                                v-model="address"
                                :rules="[rules.required]"
                                                        
                            ></v-textarea>
                    </v-col>
                </v-row>

            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="dialog = false"
            >
              Cancel
            </v-btn>

            <v-btn :disabled="!form" color="primary" variant="outlined" @click="onAddCustomer" :loading="addLoading">
                Add
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
    
</v-container>
</template>

<script>

    export default({
        data() {
            return ({
                dialog: false,
                form:false,
                name: null,
                number:null,
                email:null,

                addLoading:false,
                rules: {
                    required(value){      
                        if (value === null || value === '') {
                            return 'Required'
                        }
                        
                        return true;       
                    },

                    email(value){
                        if(value.includes('@') && value.includes('.com')){
                            return true
                        }

                        return "Invalid Email Address"
                    },
                },
                
                address:null,
            })
        },

        methods:{
            
            async onAddCustomer(){
                
                this.addLoading = true ;

                const url = "http://localhost:8001/customer/create/" ;

                const data = {
                    name:this.name,
                    contactNumber:this.number,
                    email:this.email,
                    address:this.address
                }

                const options ={
                    method:"POST",
                    headers:{
                        'Content-Type':"application/json",
                    },

                    body:JSON.stringify(data) 
                }

                const response = await fetch(url, options) ;

                if(response.ok){
                    const data = await response.json() ;

                    console.log(`new customer id : ${data.customerId}`)

                    this.addLoading = false ;
                    this.$emit('getCustomersList') ;

                    this.dialog = false;
                    
                }

            }
        }
})
</script>

<style>
    
</style>