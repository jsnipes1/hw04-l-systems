import {vec3, mat4} from 'gl-matrix';
import Turtle from './Turtle';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';

// CONCEPT: Jellybean tree
    // TODO: Fill in draw rules with calls that will draw a mesh
    // Not sure how to connect each mesh, the draw rules functions, and passing to GPU
    // Also not sure how to get dat.GUI inputs to function
export default class LSystem {
    currState: Turtle;
    axiom: string;
    grammar: string;
    depthLimit: number;
    drawRules: Map<string, any>;
    branch: Mesh;
    leaf: Mesh;

    // TODO: Set axiom and depthLimit through dat.GUI input
    // How do we connect them to the system itself?
    constructor(ax : string, lim: number) {
        this.currState = new Turtle(vec3.fromValues(0, 0, 0), vec3.fromValues(0, 90, 0));
        this.axiom = ax;
        this.grammar = '';
        this.depthLimit = lim;

        this.drawRules = new Map();
        this.drawRules.set('F', this.currState.moveForward.bind(this.currState));
        this.drawRules.set('X', this.currState.drawFlower.bind(this.currState));
        this.drawRules.set('+', this.currState.rotatePos.bind(this.currState));
        this.drawRules.set('-', this.currState.rotateNeg.bind(this.currState));
        this.drawRules.set('[', this.currState.saveState.bind(this.currState));
        this.drawRules.set(']', this.currState.restoreState.bind(this.currState));

        let obj0 : string = readTextFile('../resources/cylinder.obj');
        this.branch = new Mesh(obj0, vec3.fromValues(0, 0, 0));
        // this.branch.create();?

        // TODO -- make jellybean
        let obj1 : string = readTextFile('../resources/sphere.obj');
        this.leaf = new Mesh(obj1, vec3.fromValues(0, 0, 0));
        // this.leaf.create();?

        // Immediately expand the grammar
        this.expand(0, this.axiom);
    }

    // Appropriately expand the grammar
    expand(depth : number, expanded : string) {
        // Stop after a certain recursion depth is reached and set the member variable
        if (depth > this.depthLimit) {
            this.grammar = expanded;
            return;
        }

        // Create a new string to store the expansion of the current input
        let newStr : string = '';

        // Loop over all characters in the input string and add them to the new one
        for (var i = 0; i < expanded.length; ++i) {
            let currChar : string = expanded.charAt(i);
            let rand : number = Math.random();
            switch (currChar) {
                case 'F': {
                    if (rand < 0.4) {
                        newStr.concat('FF');
                    }
                    else {
                        newStr.concat('FX');
                    }
                    break;
                }
                case 'X': {
                    if (rand < 0.33) {
                        newStr.concat('[X+F[+FX]]');
                    }
                    else if (rand < 0.67) {
                        newStr.concat('XFX');
                    }
                    else {
                        newStr.concat('FFX');
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }

        // Recursively expand the grammar
        this.expand(depth + 1, newStr);
    }

    // Iterating over the string; get the current character, find the corresponding drawing
    // rule, and call the associated function
    drawBranch() : mat4[] {
        let transfs : mat4[];
        for (var i = 0; i < this.grammar.length; ++i) {
            let curr : string = this.grammar.charAt(i);
            let func = this.drawRules.get(curr);
            if (func) {
                let m : mat4 = func();
                if (curr != 'F') {
                    continue;
                }
                transfs.push(m);
            }
        }
        return transfs;
    }

    drawLeaf() : mat4[] {
        let transfs : mat4[];
        for (var i = 0; i < this.grammar.length; ++i) {
            let curr : string = this.grammar.charAt(i);
            let func = this.drawRules.get(curr);
            if (func) {
                if (curr != 'X') {
                    continue;
                }
                let m : mat4 = func();
                transfs.push(m);
            }
        }
        return transfs;
    }
}