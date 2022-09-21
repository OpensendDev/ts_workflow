export class Consumer {
    public name: string = 'Consumer';

    process(item: string): void {};
    consume(source: IterableIterator<string>): void {
        let sourceIter = source.next();
        while(sourceIter.done == false) {
            this.process(sourceIter.value);
            sourceIter = source.next();
        }

    }
}
