<template>
    <v-container fluid class="login-bg-container d-flex align-center justify-center">
        <v-row  justify="center" align="center" class="row" >
            <v-col cols="12" sm="12" md="10" lg="8" class="column"  >
                <v-sheet class="d-flex flex-row justify-center" height="100%" rounded >
                    <v-sheet width="55%" class="pa-5 d-none d-sm-block" rounded >
                        <v-img
                        class="flex-grow-0"
                        width="100%"
                        cover
                        src="https://img.freepik.com/free-vector/time-management-successful-teamwork-deadline-stress-overcoming-with-task-planning-control-alarm-clock-flat-composition-vector-illustration_1284-30802.jpg?w=740&t=st=1694003246~exp=1694003846~hmac=19639599c6bb0ae75a0c689223304441d8bf319b08536ff2f287e8401382c940"
                        ></v-img>
                    </v-sheet>

                    <v-sheet 
                            min-width="45%"
                            class="d-flex flex-row align-center justify-center"
                           
                        >
                    <v-slide-x-transition>
                    <v-sheet 
                            min-width="95%"
                            class="form-sheet mx-auto pa-5 d-flex flex-column justify-center align-center" 
                            rounded
                            
                            v-if="isLoginView"
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
                            :rules="[fieldRules.required]"
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
                            :rules="[fieldRules.required, rules.min]"
                            v-model="password"
                        ></v-text-field>


                        <div class="w-100 d-flex flex-row justify-end">      
                            <v-btn
                            variant="text"
                            color="blue"
                            @click="toggleLoginView"
                            >Forgot Password ?</v-btn>
                        </div>

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
                    </v-slide-x-transition>

                    <v-slide-x-reverse-transition>
                    <v-sheet 
                            min-width="95%"
                            class="form-sheet mx-auto pa-5 d-flex flex-column justify-center align-center" 
                            rounded
                            
                            v-if="isForgotView"
                            
                        >
                        
                            <div>
                        <v-sheet width="100%" class="d-sm-none" rounded >
                            <v-img
                            class="flex-grow-0"
                            width="100%"
                            cover
                            src="https://img.freepik.com/premium-vector/woman-sitting-hourglass_165488-4217.jpg?w=740"
                            ></v-img>
                        </v-sheet >

                        <h1 class="user-login-heading">RESET PASSWORD</h1>
                        <v-form
                            v-model="form"
                            @submit.prevent="onSubmit"
                            class="w-100"
                        >

                        <div v-if="!isEmailVerified">
                            <p class="reset-mail-para">
                                Please enter your email address. We'll send you a link to reset your password
                            </p>
                            <v-text-field
                                density="compact"
                                placeholder="Verify you Email"
                                prepend-inner-icon="mdi-email"
                                variant="outlined"
                                :rules="[fieldRules.required, fieldRules.email]"
                                class="mb-3"
                                v-model="email"
                            ></v-text-field>
                        </div>
                        <div v-if="isEmailVerified" class="reset-mail-para">
                            <p>Rest Password link sucessfully sent to <span class="email-highlight">{{ email }}</span></p>
                        </div>

                        <div class="w-100 d-flex flex-row justify-end">      
                            <v-btn
                            variant="text"
                            color="blue"
                            @click="goToLogin"
                            >Go To Login</v-btn>
                        </div>

                            <br>
                            <p class="error-msg">{{ emailErrorMsg }}</p>

                            
                            <v-btn
                            
                            :loading="emailVerifyLoading"
                            block
                            color="primary"
                            size="large"
                            variant="elevated"
                            @click="verifyAndSendLink"
                            v-if="!isEmailVerified"
                            >
                            Verify and Send
                            </v-btn>
                            
                        </v-form>
                        </div>
                             
                    </v-sheet>
                </v-slide-x-reverse-transition>
                </v-sheet>
            </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import {mapState} from "vuex" ;

    export default {
    data () {
      return {
        visible: false,
        loading:false,
        form:false,
        password: '',
        employeeId:'',
        errorMsg:'',
        isLoginView:true,
        isForgotView:false,
        emailErrorMsg:null,
        emailVerifyLoading:false,
        isEmailVerified:false,
        email:null,
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

    computed:{
        ...mapState(['fieldRules']),
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

            if(response.ok){
                await this.$store.dispatch('onSuccesfullLogin', data.jwtToken) ;
            }
            else{
                this.errorMsg = data.text ;
            }

            this.loading = false;


        },

        toggleLoginView(){
            this.isLoginView = !this.isLoginView 

            setTimeout(()=>{
                this.isForgotView = !this.isForgotView 
            }, 400)
        },

        goToLogin(){
            this.isForgotView = !this.isForgotView ;

            setTimeout(()=>{
                this.isLoginView = !this.isLoginView ;
            }, 400)

            this.email = null ;
            this.employeeId = null ;
            this.password = null ;
        },

        async verifyAndSendLink(){
            this.emailVerifyLoading = true ;
            const url = `http://localhost:8001/forgot-password/` ;

            const options = {
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({email:this.email}),
            }

            const response = await fetch(url, options) ;
            const data = await response.json() ;

            if(response.ok){ 
                console.log(data)  ;
                this.isEmailVerified = true ;
            }else{
                this.emailErrorMsg = data.message ;
            }     
            this.emailVerifyLoading = false ;
            console.log(data.message) ;

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

    .reset-mail-para{
        font-size:12px;
        width:280px;
    }

    .email-highlight{
        color:green;
    }

</style>