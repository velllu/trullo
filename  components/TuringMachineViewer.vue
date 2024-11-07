<script setup lang="ts">
import { TuringMachine } from '#imports';
defineProps<{ turing_machine: TuringMachine; }>();
</script>

<template>
    <p>Current State: `{{ turing_machine.state }}`</p>

    <div class="center">
        <div v-for="element in turing_machine.get_viewport()" class="element">
            <p v-if="!element">-</p>
            <p v-else>{{ element }}</p>
        </div>
    </div>
</template>

<style>
.center {
    display: flex;
}

.element {
    width: 50px;
    height: 50px;

    background-color: rgb(195, 195, 195);
    border: 1px solid rgb(50, 50, 50);

    text-align: center;
}

.element p {
    color: black;
}
</style>