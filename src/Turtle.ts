import {vec3} from 'gl-matrix';

export default class Turtle {
    position: vec3;
    orient: vec3;
    recDepth: number;
    stack: Turtle[];

    constructor(pos: vec3, ori: vec3) {
        this.position = pos;
        this.orient = ori;
        this.recDepth = 0;
        this.stack = [];
    }

    moveForward() {
        // How can we pass an anonymous vector as the third parameter if this syntax is invalid?
        // Scale orientation proportional to the recursion depth
        vec3.add(this.position, this.position, this.orient);
    }

    // Give the drawing rules a parameter that randomly chooses between rotating about x, y, or z
    rotateX(deg : number) {
        vec3.rotateX(this.orient, this.orient, this.position, deg);
    }

    rotateY(deg : number) {
        vec3.rotateY(this.orient, this.orient, this.position, deg);
    }

    rotateZ(deg : number) {
        vec3.rotateZ(this.orient, this.orient, this.position, deg);
    }

    rotatePos() {
        let rand : number = Math.random();
        let angle : number = Math.random() * 135.0;
        if (rand < 0.33) {
            this.rotateX(angle);
        }
        else if (rand < 0.67) {
            this.rotateY(angle);
        }
        else {
            this.rotateZ(angle);
        }
    }

    rotateNeg() {
        let rand : number = Math.random();
        let angle : number = -Math.random() * 135.0;
        if (rand < 0.33) {
            this.rotateX(angle);
        }
        else if (rand < 0.67) {
            this.rotateY(angle);
        }
        else {
            this.rotateZ(angle);
        }
    }

    saveState() {
        this.recDepth++;
        this.stack.push(new Turtle(this.position, this.orient));
    }

    restoreState() {
        this.recDepth--;
        let temp : Turtle = this.stack.pop();
        this.position = temp.position;
        this.orient = temp.orient;
    }

}