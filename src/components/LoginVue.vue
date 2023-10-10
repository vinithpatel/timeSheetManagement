<template>
    <v-container fluid class="login-bg-container d-flex align-center justify-center">
        <v-row  justify="center" align="center" class="row" >
            <v-col cols="12" sm="12" md="10" lg="8" class="column"  >
                <v-sheet class="d-flex flex-row justify-center" height="100%" rounded >
                    <v-sheet width="60%" class="pa-5 d-none d-sm-block" rounded >
                        <v-img
                        class="flex-grow-0"
                        width="100%"
                        cover
                        src="https://img.freepik.com/free-vector/time-management-successful-teamwork-deadline-stress-overcoming-with-task-planning-control-alarm-clock-flat-composition-vector-illustration_1284-30802.jpg?w=740&t=st=1694003246~exp=1694003846~hmac=19639599c6bb0ae75a0c689223304441d8bf319b08536ff2f287e8401382c940"
                        ></v-img>
                    </v-sheet>
            
                    <v-sheet 
                        min-width="40%"
                        class="form-sheet mx-auto pa-5 d-flex flex-column justify-center align-center" 
                        rounded       
                    >
                    <v-sheet width="100%" class="d-sm-none" rounded >
                        <v-img
                        class="flex-grow-0"
                        width="100%"
                        cover
                        src="https://img.freepik.com/premium-vector/woman-sitting-hourglass_165488-4217.jpg?w=740"
                        ></v-img>
                    </v-sheet >

                    <h1 class="user-login-heading">USER LOGIN</h1>
                    <v-form
                        v-model="form"
                        @submit.prevent="onSubmit"
                        class="w-100"
                    >
                    <v-text-field
                        density="compact"
                        placeholder="Employee Id"
                        prepend-inner-icon="mdi-account"
                        variant="outlined"
                        :rules="employeeIdRule"
                        class="mb-3"
                        v-model="employeeId"
                    ></v-text-field>

                    <v-text-field
                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        density="compact"
                        placeholder="Password"
                        prepend-inner-icon="mdi-lock-outline"
                        variant="outlined"
                        @click:append-inner="visible = !visible"                   
                        :rules="[rules.required, rules.min]"
                        v-model="password"
                    ></v-text-field>

                        <br>
                        <p class="error-msg">{{ errorMsg }}</p>

                        
                        <v-btn
                        :disabled="!form"
                        :loading="loading"
                        block
                        color="primary"
                        size="large"
                        type="submit"
                        variant="elevated"
                        >
                        Log In
                        </v-btn>
                        
                    </v-form>
                </v-sheet>
            </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import router from "../router.js"

    export default {
    data () {
      return {
        visible: false,
        loading:false,
        form:false,
        password: '',
        employeeId:'',
        errorMsg:'',

        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
        },
        employeeIdRule:[
            value => {
                if(value.length > 0) return true
                return "Required"
            }
        ]

      }
    },
    methods:{
        async onSubmit(){
            if(!this.form) return 
            this.loading = true

            const loginData = {
                employeeId:this.employeeId,
                password:this.password,
            }

            const options = {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(loginData),
            }

            const response = await fetch("http://localhost:8001/login", options)
            const data = await response.json() ;
            console.log(data) ;

            if(response.ok){
                this.$store.commit('updateEmployeeDetailsAndLogin', data) ;
                this.$store.commit('updateLoginDetailsInLocal', data) ;
                router.push("/")
            }
            else{
                this.errorMsg = data.text ;
            }

            this.loading = false;


        }
    }
  }
</script>

<style scoped>
    .login-bg-container{
        width:100vw;
        height:100vh;

        background-image:linear-gradient(to right, #6f03fc,#bd6bed);
        background-size:cover;
        
    }
    .user-login-heading{
        font-size:22px;
        font-weight:500;
        color:#b547a6 ;
        margin-bottom:20px;
    }

    .router-link{
        text-decoration: none;
    }

    @media(max-width:600px){
        .row,.column{
            height:100%;
            
        }
    }

    @media(max-width:600px){
        .form-sheet{
            width:100%;
        }
    }

    .error-msg{
        color:red;
        font-size:12px;
    }

</style>