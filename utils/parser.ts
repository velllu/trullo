export function parse_script(script: string): State[] {
    const states: State[] = [];

    for (const line of script.split('\n')) {
        const new_state = parse_line(line);

        if (new_state)
            states.push(new_state);
    }

    return states;
}

/**
 * Parses a single line of a script.
 * Example of line: (start, -, end, 0, >)
 */
function parse_line(line: string): State | null {
    let is_first_character = true;
    let should_end = false;
    let what_is_parsing = WhatIsParsing.IfState;

    // These variables track all of the four fields
    let if_state = "";
    let to_state = "";
    let if_character = "";
    let to_character = "";
    let direction: Direction = Direction.Left;

    for (const character of line.split('')) {
        // We want to skip empty characters
        if (character == '\n' || character == ' ')
            continue;

        // If the program should end but we found another character, there's an issue
        // with the line
        if (should_end && character != ')')
            throw "expected ending parenthesis";

        // ... and if we actually find the ending parenthesis, then we can finish
        if (should_end && character == ')') {
            return {
                if_state,
                to_state,
                if_character,
                to_character,
                direction
            }
        }

        // The first actual character of the line *must* be a parenthesis
        if (is_first_character && character != '(')
            throw "text outside of the starting parenthesis";

        // When we find the actual parenthesis we can start filling in the fields
        if (is_first_character && character == '(') {
            is_first_character = false;
            continue;
        }

        // Commas separate the fields
        if (character == ",") {
            what_is_parsing += 1;
            continue;
        }

        switch (what_is_parsing) {
            case WhatIsParsing.IfState: if_state += character; break;
            case WhatIsParsing.ToState: to_state += character; break;
            case WhatIsParsing.IfCharacter: if_character += character; break;
            case WhatIsParsing.ToCharacter: to_character += character; break;
            case WhatIsParsing.Direction: {
                if (character == ">") {
                    direction = Direction.Right;
                    should_end = true;
                    continue;
                }

                if (character == "<") {
                    direction = Direction.Left;
                    should_end = true;
                    continue;
                }

                throw "no direction given"
            }
        }
    }

    return null;
}

enum WhatIsParsing {
    IfState,
    IfCharacter,
    ToState,
    ToCharacter,
    Direction
}

export interface State {
    if_state: string,
    if_character: string,
    to_state: string,
    to_character: string,
    direction: Direction
}

export enum Direction {
    Left,
    Right
}
