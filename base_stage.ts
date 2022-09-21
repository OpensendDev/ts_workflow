
export abstract class BaseStage {
    public name: string = 'BaseStage';

    public inputColumns: Array<string> = [];
    public outputColumns: Array<string> = [];

    protected getInputData() {
    }

    protected getOutputData() {
    }

    // abstract setUp(item: string): IterableIterator<string>;

    abstract process(item: string): IterableIterator<string>;

    // abstract tearDown(item: string): IterableIterator<string>;

    abstract run(source: IterableIterator<string>): IterableIterator<string>;
}
