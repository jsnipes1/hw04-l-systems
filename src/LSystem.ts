import {vec3} from 'gl-matrix';
import Turtle from 'Turtle';
// import ExpansionRule from 'ExpansionRule';

export default class LSystem {
    currState: Turtle;
    axiom: string;
    grammar: string;
    // expansion: Map<string, ExpansionRule>;
    drawRules: Map<string, any>;

    constructor(ax : string) {
        this.currState = new Turtle(vec3.fromValues(0, 0, 0), vec3.fromValues(0, 90, 0));
        this.axiom = ax;
        this.grammar = '';

        this.drawRules = new Map();
        this.drawRules.set('F', this.currState.moveForward.bind(this.currState));

    }

    expand(depth : number) {
        if (depth >= this.axiom.length) {
            return;
        }

        // Get current string character
        let currChar : string = this.axiom.charAt(depth);

        // Generate random number
        let rand : number = Math.random();

        switch (currChar) {
            case 'F': {
                if (rand < 0.5) {
                    this.axiom.concat('FF');
                }
                else {
                    this.axiom.concat('FX');
                }
                break;
            }
            case 'X': {
                if (rand < 0.33) {
                    this.axiom.concat('[X+F[+FX]]');
                }
                else if (rand < 0.67) {
                    this.axiom.concat('XFX');
                }
                else {
                    this.axiom.concat('FFX');
                }
                break;
            }
            default: {
                break;
            }
        }

        // Recursively expand the grammar
        this.expand(depth + 1);
    }

    draw() {

    }
}