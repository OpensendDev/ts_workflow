export abstract class Consumer {
    name: string;
    protected requiredColumns: Array<string> = [];

    constructor(name: string = 'Consumer') {
        this.name = name;
    }

    abstract process(item: Record<string, any>): Promise<void>;

    async consume(source: AsyncIterable<Record<string, any>>): Promise<void> {
        for await (let sourceValue of source) {
            if (
                this.requiredColumns.length > 0 &&
                this.requiredColumns.some((column) => Object.keys(sourceValue).indexOf(column) != -1)
            ) {
                throw new Error(`Invalid data ${sourceValue}. Required columns: ${this.requiredColumns}`);
            }
            await this.process(sourceValue);
        }
    }
}
