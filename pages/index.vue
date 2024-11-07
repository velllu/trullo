<script setup lang="ts">
import TextEditor from "~/ components/TextEditor.vue";
import TuringMachineViewer from "~/ components/TuringMachineViewer.vue";
const turing_machine = new TuringMachine();
</script>

<template>
    <fieldset>
        <legend>Turing Machine</legend>
        <TuringMachineViewer :turing_machine="turing_machine"/>
    </fieldset>

    <fieldset>
        <legend>Input</legend>
        <TextEditor :turing_machine="turing_machine"/>
    </fieldset>
</template>

<style>
body {
    background-color: #1d2021;
}

p, legend {
    color: white;
}

fieldset {
    margin-bottom: 1rem;
}
</style>