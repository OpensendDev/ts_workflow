import {Producer} from "./producer";

export class StreamProducer extends Producer {
    protected source: AsyncIterable<Record<string, any>>;

    constructor(source: AsyncIterable<Record<string, any>>, name: string = 'StreamProducer') {
        super(name);
        this.source = source;
    }

    async* toStream(): AsyncIterable<Record<string, any>> {
        yield* this.source;
    }
}
