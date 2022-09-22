import {Producer} from "./producer";

export class SingleItemProducer extends Producer {
    protected item: Record<string, any>;

    constructor(item: Record<string, any>, name: string = 'SingleItemProducer') {
        super(name);
        this.item = item;
    }

    * toStream(): IterableIterator<Record<string, any>> {
        yield this.item;
    }
}
