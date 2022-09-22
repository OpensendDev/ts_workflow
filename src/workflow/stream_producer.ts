import {Producer} from "./producer";

export class StreamProducer extends Producer {
    protected source: IterableIterator<Record<string, any>>;

    constructor(source: IterableIterator<Record<string, any>>, name: string = 'StreamProducer') {
        super(name);
        this.source = source;
    }

    * toStream(): IterableIterator<Record<string, any>> {
        yield* this.source;
    }
}
