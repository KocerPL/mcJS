export class Task {
    func;
    caller;
    label;
    constructor(func, calledBy, label) {
        this.func = func;
        this.caller = calledBy;
        this.label = label;
    }
}
