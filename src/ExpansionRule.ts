export default class ExpansionRule {
    expRule: Map<string, string>;

    constructor() {
        this.expRule = new Map();
        // this.expRule.set('F', 'FF');
        // this.expRule.set('F', 'FX');
        // this.expRule.set('X', '[X+F[+FX]]');
        // this.expRule.set('X', 'XFX');
    }

    set(letter : string, expand : string) : boolean {
        if (!this.expRule.get(letter)) {
            this.expRule.set(letter, expand);
            return true;
        }
        return false;
    }

}