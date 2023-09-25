<template>
  <v-dialog v-model="dialog" width="500" persistent>
    <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="outlined" :color="color" :text="text" :loading="loading"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card :title="`Comment for ${text}`">
                <v-card-text>
                    <v-textarea
                    name="input-7-1"
                    variant="outlined"
                    auto-grow
                    v-model="comment"
                    :rules="commentRules"
                    ></v-textarea>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    text="Cancel"
                    @click="isActive.value = false"
                ></v-btn>
                <v-btn variant="outlined" @click="onClickActionButton" :text="text" :color="color" :disabled="comment.length < 1">
                    
                </v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>

export default {

    data(){
        return {
            dialog:false,
            comment:"",

            commentRules:[
                value => {
                    if(value.length > 0) return true 

                    return 'Comment Required' 
                }
            ]
        }
    },

    props:[
        'color', 'text', 'loading'
    ],

    methods:{
        async onClickActionButton(){

            if(this.text === "Approve"){
                this.$emit('onClickApprove', this.comment) ;
            }
            else if(this.text === "Deny"){
                this.$emit('onClickDeny', this.comment) ;
            }else if(this.text === "Re-open"){
                this.$emit('onClickOpen', this.comment) ;
            }

            this.dialog = false ;
        }
    }

}
</script>

<style>

</style>