import { Observable } from './observable.mjs';
import { Computable } from './computable.mjs';

class MinBindingJS {

    constructor() {
        this.bindings = {};

    }

    bindValue(input, observable) {
        input.value = observable.value;
        observable.subscribe(() => input.value = observable.value);
        input.onkeyup = () => observable.value = input.value;
    }


    applyBindings() {
        let that = this;
        document.querySelectorAll("[data-bind]").forEach(elem => {
            const obs = that.bindings[elem.getAttribute("data-bind")];
            that.bindValue(elem, obs);
        });
    }

    run() {
        this.applyBindings();
        console.log("Running");
    }
}

export { MinBindingJS, Observable, Computable };