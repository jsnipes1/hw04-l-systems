import {vec3} from 'gl-matrix';
import Turtle from 'Turtle';
import ExpansionRule from 'ExpansionRule';

export default class LSystem {
    currState: Turtle;
    grammar: string;
    expansion: Map<string, ExpansionRule>;
    drawRules: Map<string, any>;

    constructor(gram : string) {
        this.currState = new Turtle(new vec3(0, 0, 0), new vec3(0, 90, 0));
        this.grammar = gram;
    }

    expand(recDepth : number) {
        
    }
}