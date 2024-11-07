<script setup lang="ts">
import { TuringMachine } from '#imports';
const { turing_machine } = defineProps<{ turing_machine: TuringMachine; }>();

const input = useTemplateRef("input");

function run() {
    const text = input.value?.value!;
    const states = parse_script(text);

    for (const state of states) {
        if (turing_machine.try_to_run_state(state))
            break;
    }
}
</script>

<template>
    <textarea rows="20" cols="50" ref="input"></textarea> <br>
    <button @click="run">Step</button>
</template>