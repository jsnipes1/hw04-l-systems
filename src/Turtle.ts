import {vec3, mat4, quat} from 'gl-matrix';

export default class Turtle {
    position: vec3;
    orient: vec3;
    worldUp: vec3;
    recDepth: number;
    theta: number;
    stack: Turtle[];

    constructor(pos: vec3, ori: vec3, theta: number) {
        this.position = pos;
        this.orient = ori;
        this.theta = theta;
        this.worldUp = vec3.fromValues(0, 1, 0);
        this.recDepth = 0;
        this.stack = [];
    }

    // Drawing functions, including probabilistic functionality
    moveForward() : mat4 {
        let s : number = 1;//1.0 / (this.recDepth + 1.0);
        let m : mat4 = mat4.create();
        let q : quat = quat.create();
        // quat.rotationTo(q, this.orient, this.worldUp);

        let o : vec3 = vec3.create();
        vec3.scale(o, this.orient, 1);
        vec3.add(this.position, this.position, o);

        mat4.fromRotationTranslationScale(m, q, this.position, vec3.fromValues(0.2, 0.8, 0.2));
        return m;
    }

    drawFlower() : mat4 {
        let s : number = 1;//1.0 / (this.recDepth + 1.0);
        let m : mat4 = mat4.create();
        let q : quat = quat.create();
        // quat.rotationTo(q, this.orient, this.worldUp);
        mat4.fromRotationTranslationScale(m, q, this.position, vec3.fromValues(s, s, s));
        return m;
    }

    rotatePos() : mat4 {
        let rand : number = Math.random();
        let angle : number = Math.random() * this.theta * 0.01745329251;
        let r : mat4 = mat4.create();
        let o : vec3 = vec3.fromValues(0, 0, 0);
        if (rand < 0.33) {
            vec3.rotateX(this.orient, this.position, o, angle);
            mat4.fromXRotation(r, angle);
            return r;
        }
        else if (rand < 0.67) {
            vec3.rotateY(this.orient, this.position, o, angle);
            mat4.fromYRotation(r, angle);
            return r;
        }
        else {
            vec3.rotateZ(this.orient, this.position, o, angle);
            mat4.fromZRotation(r, angle);
            return r;
        }
    }

    rotateNeg() : mat4 {
        let rand : number = Math.random();
        let angle : number = -Math.random() * this.theta * 0.01745329251;
        let r : mat4 = mat4.create();
        let o : vec3 = vec3.fromValues(0, 0, 0);
        mat4.identity(r);
        if (rand < 0.33) {
            vec3.rotateX(this.orient, this.position, o, angle);
            mat4.fromXRotation(r, angle);
            return r;
        }
        else if (rand < 0.67) {
            vec3.rotateY(this.orient, this.position, o, angle);
            mat4.fromYRotation(r, angle);
            return r;
        }
        else {
            vec3.rotateZ(this.orient, this.position, o, angle);
            mat4.fromZRotation(r, angle);
            return r;
        }
    }

    saveState() : mat4 {
        this.recDepth++;
        this.stack.push(new Turtle(this.position, this.orient, this.theta));
        let i : mat4 = mat4.create();
        return i;
    }

    restoreState() : mat4 {
        this.recDepth--;
        let temp : Turtle = this.stack.pop();
        this.position = temp.position;
        this.orient = temp.orient;
        this.theta = temp.theta;
        let i : mat4 = mat4.create();
        return i;
    }

}