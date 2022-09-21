import {Producer} from "./producer";


export class SerialProducer extends Producer{
    public name: string = 'SerialProducer';
    private readonly source: IterableIterator<string>;

    constructor(source: IterableIterator<string>) {
        super();
        this.source = source;
    }
    *toStream(): IterableIterator<string> {
        yield* this.source;
    }
}
