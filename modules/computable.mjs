import { Observable } from './observable.mjs';

class Computable extends Observable {
    constructor(value, deps) {
        super(value());
        const listener = () => {
            this.val = value();
            this.notify();
        }
        deps.forEach(dep => dep.subscribe(listener));
    }

    get value() {
        return this.val;
    }

    set value(_) {
        throw "Cannot set computed property";
    }
}

export { Computable };