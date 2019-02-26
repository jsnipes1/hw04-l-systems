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
    // Replace 45 with some random amount
    rotateX() {
        vec3.rotateX(this.orient, this.orient, this.position, 45.0);
    }

    rotateY() {
        vec3.rotateY(this.orient, this.orient, this.position, 45.0);
    }

    rotateZ() {
        vec3.rotateZ(this.orient, this.orient, this.position, 45.0);
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