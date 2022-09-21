
export class Producer {
    public name: string = 'Producer';

    get stream(): IterableIterator<string> {
        return this.toStream();
    }

    *toStream(): IterableIterator<string> {}
}
