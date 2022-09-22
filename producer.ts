export abstract class Producer {
    name: string;

    protected constructor(name: string = 'Producer') {
        this.name = name;
    }

    get stream(): IterableIterator<Record<string, any>> {
        return this.toStream();
    }

    abstract toStream(): IterableIterator<Record<string, any>>;
}
