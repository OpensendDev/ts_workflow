import {Stage} from "../workflow/stage";

export class RecordFilter extends Stage {
    protected validator: CallableFunction;

    constructor(validator: CallableFunction, name: string = 'RecordFilter') {
        super(name);
        this.validator = validator;
    }

    async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
        if (this.validator(item)) {
            yield item;
        }
    };
}
