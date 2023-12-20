<template>
  <v-container fluid class="container w-100 h-100 d-flex flex-row justify-center align-center">
    <v-sheet 
        min-width="55%"
        class="form-sheet mx-auto pa-5 d-flex flex-row justify-center align-center" 
        rounded
        v-if="responseStatus === 200"
    >
        <div class="w-50 d-none d-md-block">
            <v-img
            class="flex-grow-0"
            cover
            src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?w=740&t=st=1698296974~exp=1698297574~hmac=40d9021866084c2ec121b0099c9ca32ae990d76c3d02080043fdc18d554f8f72"
            ></v-img>
        </div>
        <div style="min-width: 50%;" v-if="!isPasswordReset">
        <h1 class="user-login-heading">RESET PASSWORD</h1>
        <v-form
            v-model="form"
            @submit.prevent="onResetPassword"
            class="w-100"
        >
        <v-text-field
            density="compact"
            placeholder="New Password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            :rules="[fieldRules.required, fieldRules.password]"
            class="mb-3"
            v-model="newPassword"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="visible = !visible"
            :type="visible ? 'text' : 'password'"
        ></v-text-field>

        <v-text-field
            
            density="compact"
            placeholder="Confirm Password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
                               
            :rules="[fieldRules.required,fieldRules.password, confirmPasswordRule]"
            v-model="confirmPassword"
        ></v-text-field>

            <br>
            <p class="error-msg">{{ errorMsg }}</p>
            <v-btn
            :disabled="!form"
            block
            color="primary"
            size="large"
            type="submit"
            variant="elevated"
            :loading="buttonLoading"
            >
            Reset Password
            </v-btn>
            
            </v-form>    
        </div>        
        <div v-if="isPasswordReset">
            Password Reset sucessfull, redirecting to login...
        </div>
        </v-sheet>

        <v-sheet 
        min-width="55%"
        class="form-sheet mx-auto pa-5 d-flex flex-row justify-center align-center" 
        rounded
        v-if="responseStatus === 400"
        >
            Link Expired
        </v-sheet>

        <v-sheet 
        min-width="55%"
        class="form-sheet mx-auto pa-5 d-flex flex-row justify-center align-center" 
        rounded
        v-if="responseStatus === 404"
        >
            Invalid URL
        </v-sheet>
        
        <v-sheet 
        min-width="55%"
        class="form-sheet mx-auto pa-5 d-flex flex-row justify-center align-center" 
        rounded
        v-if="pageLoading"
        >
            <v-progress-circular
            indeterminate
            color="primary"
            ></v-progress-circular>
        </v-sheet>

  </v-container>
</template>

<script>
    import { mapGetters, mapState} from "vuex" ;

export default {
    data(){
        return {
            pageLoading:true,
            form:false,
            visible:false,
            newPassword:null,
            confirmPassword:null,
            responseStatus:null,
            buttonLoading:false,
            isPasswordReset:false,
            errorMsg:'',
            confirmPasswordRule:(value) => {

                if(value === this.newPassword){
                    return true ;
                }

                return "Password doesn't match"
            }
            
        }
    },

    computed:{
        ...mapState(['fieldRules']),
        ...mapGetters(['getHeaders'])
    },

    methods:{
        async checkResetPage(){

            this.pageLoading = true ;

            const {resetToken} = this.$route.params ;

            const url = `http://localhost:8001/reset-link-verify/${resetToken}` ;

            const options = {
                method:"GET",
                ...this.getHeaders,
            }

            const response = await fetch(url, options) ;
            
            this.responseStatus = response.status ;
            console.log(this.responseStatus)

            if(response.status !== 500){
                const data = await response.json() ;
                console.log(data.message) ;
            }   
            
            this.pageLoading = false ;

        },

        async onResetPassword(){
            this.buttonLoading = true ;
            const {resetToken} = this.$route.params ;

            const url = "http://localhost:8001/reset-password/" ;

            const options = {
                method:"PUT",
                ...this.getHeaders,
                body:JSON.stringify({newPassword:this.newPassword,confirmPassword:this.confirmPassword,resetToken})
            }

            const response = await fetch(url, options) ;
            const data = await response.json() ;
            this.errorMsg = data.message ;
            this.buttonLoading = false ;

            if(response.ok){
                this.isPasswordReset = true ;
                setTimeout(()=>{
                    this.$router.replace("/login")
                }, 2000) ;
            }
                
        

            
        }

    },

    mounted(){
        this.checkResetPage() ;
    }
}
</script>

<style>
    .container{
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

    .error-msg{
        color:red;
        font-size:12px;
    }
</style>