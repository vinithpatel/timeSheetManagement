<template>
    <div class="home-bg-container">
        <EmployeeTimesheet v-if="$store.state.isAdmin" />
        <SearchTimesheet v-else />
    </div>           
</template>

<script>
    import EmployeeTimesheet from "./EmployeeTimesheet.vue"
    import SearchTimesheet from "./SearchTimesheet.vue"

    export default({
         components:{
            EmployeeTimesheet, SearchTimesheet
         }
    })
</script>

<style scoped>
    .home-bg-container{
        background-image:url("https://img.freepik.com/free-vector/illustration-landing-page-with-time-management-concept_23-2148241780.jpg?w=740&t=st=1694585091~exp=1694585691~hmac=958c650831ed550e23c3a91d70aad94d283b5ee372a60d93fadaebf395695227") ;
        background-size:cover;
        height:100vh;
        width:100vw;
    }
   
</style>
