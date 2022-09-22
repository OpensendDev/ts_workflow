import {Stage} from "../workflow/stage";

export class RecordFilter extends Stage {
    protected validator: CallableFunction;

    constructor(validator: CallableFunction, name: string = 'RecordFilter') {
        super(name);
        this.validator = validator;
    }

    * process(item: Record<string, any>): IterableIterator<Record<string, any>> {
        if (this.validator(item)) {
            yield item;
        }
    };
}
