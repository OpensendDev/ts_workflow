export abstract class Producer {
    name: string;

    protected constructor(name: string = 'Producer') {
        this.name = name;
    }

    get stream(): AsyncIterable<Record<string, any>> {
        return this.toStream();
    }

    abstract toStream(): AsyncIterable<Record<string, any>>;
}
