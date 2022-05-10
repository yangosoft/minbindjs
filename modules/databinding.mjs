// @ts-check

import { Observable } from "./observable.mjs";
import { Computable } from "./computable.mjs"

/**
 * Class supports data-binding operations
 */
export class DataBinding {

    /**
     * Simple evaluation
     * @param {string} js The JavaScript to evaluate 
     */
    execute(js) {
        return eval(js);
    }

    /**
     * Evaluates JavaScript with a constrained context (scope)
     * @param {string} src The JavaScript to evaluate 
     * @param {object} context The context (data) to evaluate with
     * @returns {object} The result of the evaluation 
     */
    executeInContext(src, context, attachBindingHelpers = false) {
        if (attachBindingHelpers) {
            context.observable = this.observable;
            context.computed = this.computed;
            context.bindValue = this.bindValue;
        }
        return this.execute.call(context, src);
    }

    /**
     * A simple observable implementation
     * @param {object} value Any value to observe
     * @returns {Observable} The observable instance to use
     */
    observable(value) {
        console.log("Creating new observable " + value);
        return new Observable(value);
    }

    /**
     * Creates an observed computed property
     * @param {function} calculation Calculated value 
     * @param {Observable[]} deps The list of dependent observables
     * @returns {Computable} The observable computed value 
     */
    computed(calculation, deps) {
        return new Computable(calculation, deps);
    }

    /**
     * Binds an input element to an observable value
     * @param {HTMLInputElement} input The element to bind to 
     * @param {Observable} observable The observable instance to bind to 
     */
    bindValue(input, observable) {
        console.log("bindValue()", input, observable);
        const initialValue = observable.value;
        input.value = initialValue;
        observable.subscribe(() => input.value = observable.value);
        /**
         * Converts the values 
         * @param {object} value 
         */
        let converter = value => value;
        if (typeof initialValue === "number") {
            converter = num => isNaN(num = parseFloat(num)) ? 0 : num;
        }
        input.onkeyup = () => {
            observable.value = converter(input.value);
        };
    }

    /**
     * 
     * @param {HTMLElement} elem The parent element 
     * @param {object} context The context to use for binding 
     */
    bindAll(elem, context) {
        this.bindLists(elem, context);
        this.bindObservables(elem, context);
        this.bindComponents(elem, context);
    }

    /**
     * Searches for "data-bind" attribute to data-bind observables
     * @param {HTMLElement} elem The parent element to search 
     * @param {object} context The context to use for binding 
     */
    bindObservables(elem, context) {
        const dataBinding = elem.querySelectorAll("[data-bind]");
        console.log(context);
        if (undefined != context.bindings) {
            console.log("------- EXIOSTS!");
            console.log(context.bindings.val.text1);

            dataBinding.forEach(elem => {
                console.log("->", elem.getAttribute("data-bind"), context.bindings.val.text1);
                this.bindValue(elem, context.bindings.val.text1);
            });
        } else {

            dataBinding.forEach(elem => {
                console.log("->", elem.getAttribute("data-bind"), context[elem.getAttribute("data-bind")]);
                this.bindValue(elem, context[elem.getAttribute("data-bind")]);
            });
        }
    }

    /**
     * Searches for "repeat" attribute to data-bind lists
     * @param {HTMLElement} elem The parent element to search 
     * @param {object} context The context to use for binding 
     */
    bindLists(elem, context) {
        const listBinding = elem.querySelectorAll("[repeat]");
        listBinding.forEach(elem => {
            const parent = elem.parentElement;
            const expression = elem.getAttribute("repeat");
            elem.removeAttribute("repeat");
            const template = elem.outerHTML;
            parent.removeChild(elem);
            context[expression].forEach(item => {
                console.log("ITEM: " + item);
                let newTemplate = `${template}`;
                const matches = newTemplate.match(/\{\{([^\}]*?)\}\}/g);
                if (matches) {
                    matches.forEach(match => {
                        match = match.replace("{{", "").replace("}}", "");
                        const value = this.executeInContext(`this.${match}`, { item });
                        newTemplate = newTemplate.replace(`{{${match}}}`, value);
                    });
                    parent.innerHTML += newTemplate;
                }
            });
        });
    }

    bindComponents(elem, context) {

        const listBinding = elem.querySelectorAll("[component]");
        listBinding.forEach(elem => {
            const parent = elem.parentElement;
            const expression = elem.getAttribute("component");
            //console.log("expression = " + expression);
            elem.removeAttribute("component");
            const template = elem.outerHTML;

            try {
                parent.removeChild(elem);
            } catch (e) {

            }

            let newTemplate = `${template}`;
            const matches = newTemplate.match(/\{\{([^\}]*?)\}\}/g);
            if (matches) {
                matches.forEach(match => {
                    match = match.replace("{{", "").replace("}}", "");
                    //console.log("MATCH: " + match);
                    //console.log("CONTEXT:" + JSON.stringify({ context }));
                    const value = this.executeInContext(`this.context.${match}`, { context });
                    newTemplate = newTemplate.replace(`{{${match}}}`, value);
                });
                parent.innerHTML += newTemplate;
            }

        });
    }
}
