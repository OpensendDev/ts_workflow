import {Producer} from "./producer";


export class SingleItemProducer extends Producer{
    public name: string = 'SingleItemProducer';
    private readonly item: string;
    constructor(item: string) {
        super();
        this.item = item;
    }
    *toStream(): IterableIterator<string> {
        yield this.item;
    }
}
