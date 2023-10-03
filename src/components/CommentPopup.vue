<template>
    <div>
        <v-card 
            variant="text"
        >
        <div class="d-flex flex-row align-center justify-center">
            <slot></slot>
            <v-btn v-if="isCommentValid" variant="text" icon="mdi-comment" size="small"
                @click="onClickIcon"
            ></v-btn>
        </div>           
        </v-card>
        <v-dialog width="500" v-model="dialog">
            <v-card>
                <v-card-text>
                    {{ comment }}
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                    text="Close"
                    @click="onClose"
                    ></v-btn>
                </v-card-actions>
            </v-card>
    </v-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return ({
            dialog:false,
        })
    },

    props:[
        'comment'
    ],
    computed:{
        isCommentValid(){
            if(this.comment === 'null' || this.comment === '' || this.comment === null){
                return false ;
            }
            
            return true ;
        }
    },

    methods:{
        onClickIcon(){
            this.dialog = true ;
        },

        onClose(){
            this.dialog = false ;
        }
    }

}
</script>

<style>

</style>