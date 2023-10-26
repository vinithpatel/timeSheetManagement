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
        <div class="">
        <h1 class="user-login-heading">REST PASSWORD</h1>
        <v-form
            v-model="form"
            @submit.prevent="onSubmit"
            class="w-100"
        >
        <v-text-field
            density="compact"
            placeholder="New Password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            :rules="[fieldRules.required]"
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
                               
            :rules="[fieldRules.required]"
            v-model="confirmPassword"
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
            Reset Password
            </v-btn>
            
            </v-form>    
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
        }
    },

    computed:{
        ...mapState(['fieldRules']),
        ...mapGetters(['getHeaders'])
    },

    methods:{
        async checkResetPage(){
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
</style>