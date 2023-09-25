<template>
  <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="text" icon="mdi-comment" size="small"></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Comment">
            <v-card-text>
                {{ comment }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                text="Close"
                @click="isActive.value = false"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
export default {
    props:[
        'comment'
    ],

}
</script>

<style>

</style>