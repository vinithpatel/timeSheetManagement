<template>
  <v-container fluid class="container w-100 h-100 d-flex flex-row justify-center align-center">
    <v-row justify="center">
        <v-col cols="6">
            <div class="w-100 h-100 d-flex flex-row align-center justify-center w-50">
                <v-img
                width="50%"
                height="100%"
                cover
                src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?w=740&t=st=1698066246~exp=1698066846~hmac=ce505c999e731c262b639e09b6ace46346ccdc37c9db5c8662954cab6f7c3fb0"
                >
                </v-img>
                <v-sheet class="w-50">
                    <v-form>
                        <v-text-field
                            label="Email"

                        ></v-text-field>
                    </v-form>
                </v-sheet>
            </div>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {

}
</script>

<style>
    .container{
        width:100vw;
        height:100vh;

        background-image:linear-gradient(to right, #6f03fc,#bd6bed);
        background-size:cover;
    }
</style>