class Observable {

    constructor(value) {
        this.lst_listeners = [];
        this.val = value;
    }

    notify() {
        this.lst_listeners.forEach(listener => listener(this.value));
    }

    subscribe(listener) {
        this.lst_listeners.push(listener);
    }

    get value() {
        return this.val;
    }

    set value(val) {
        if (val !== this.val) {
            this.val = val;
            this.notify();
        }
    }
}

export { Observable };