<template>
        <div>
        <v-card 
                @mouseenter="onHover"
                @mouseleave="offHover"
            >
                <slot v-bind:isHovered="isHovered" v-bind:onClickIcon="onClickIcon" >
                    
                </slot>
        </v-card>      
        <v-dialog 
            width="500"
            v-model="dialog"
            persistent
        >
        <v-card title="Add Comment">
                    <v-textarea 
                    variant="outlined" 
                    v-model="newComment"
                    >
                    </v-textarea>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        text="Save Changes"
                        @click="onSaveClicked"
                        color="#4287f5"
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
            isHovered:false,
            dialog:false,
            newComment:this.comment,
        })
    },

    props:[
        'comment', 'obj'
    ],

    watch:{
        comment(value){
            this.newComment = value ;
            console.log(value) ;
            console.log(this.newComment) ;
        }
    },
    
    methods:{
        onHover(){
            this.isHovered = true ;
        },

        offHover(){
            this.isHovered = false ;
        },

        onClickIcon(){
            this.dialog = true ;
        },

        onSaveClicked(){
            this.dialog = false;

            this.$emit('setRowValue', this.newComment, this.obj) ;
        }
    }
}
</script>

<style>

</style>