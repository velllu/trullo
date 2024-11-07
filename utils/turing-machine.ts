// TODO: Every single cell is a string and that is very wasteful since we need a single

import { Direction, type State } from "./parser";

// char
type Element = string | null | undefined;

/**
 * A turing machine is an hypothetical machine that uses an infinite tape to store data,
 * it has a pointer pointing to a cell, it can go both right and left
 */
export class TuringMachine {
    /** The infinite tape that holds all the elements from the start to the right */
    private tape: Ref<Element[]>;

    /**
     * The infinite tape that holds all the elements from the start to the left (the
     * "negative" elements)
     */
    private tape_negative: Ref<Element[]>;

    /** The number the user is currently working with, can be negative too */
    private pointer: Ref<number>;

    /** The state the machine is using */
    public state: Ref<string>;

    constructor() {
        this.tape = ref([null]);
        this.tape_negative = ref([]);
        this.state = ref("start");
        this.pointer = ref(0);
    }

    /** Reads any address even if it isn't initialized */
    private read_arbitrary(index: number): Element {
        if (index >= 0) {
            return this.tape.value[index];
        }

        return this.tape_negative.value[-index - 1];
    }

    /** Reads the value at the current pointer position */
    public read(): Element {
        return this.read_arbitrary(this.pointer.value);
    }

    /** Writes `element` at the current pointer position */
    public write(element: Element) {
        if (element === "-")
            element = null;

        if (this.pointer.value >= 0) {
            this.tape.value[this.pointer.value] = element;
            return;
        }

        this.tape_negative.value[-this.pointer - 1] = element;
    }

    /** Move the pointer one to the right */
    public move_right() {
        this.pointer.value += 1;

        if (this.read() === undefined)
            this.write(null);
    }

    /** Move the pointer one to the left */
    public move_left() {
        this.pointer.value -= 1;

        if (this.read() === undefined)
            this.write(null);
    }

    public try_to_run_state(state: State): boolean {
        function null_to_dash(string: Element): string {
            if (string == null)
                return "-";

            return string;
        }

        const is_state_equal = this.state.value === state.if_state;
        const is_character_equal = null_to_dash(this.read()) === state.if_character;

        if (is_state_equal && is_character_equal) {
            this.write(state.to_character);
            this.state.value = state.to_state;

            switch (state.direction) {
                case Direction.Left: this.pointer.value -= 1; break;
                case Direction.Right: this.pointer.value += 1; break;
            }

            return true;
        }

        return false;
    }

    /** Gets a list of elements near the pointer */
    public get_viewport(): Element[] {
        const NUMBER_OF_ELEMENTS = 10;
        const start = this.pointer.value - (NUMBER_OF_ELEMENTS / 2);
        const end = this.pointer.value + (NUMBER_OF_ELEMENTS / 2) + 1;
        const elements: Element[] = [];

        for (let i = start; i < end; i++) {
            elements.push(this.read_arbitrary(i));
        }

        return elements;
    }
}
