export abstract class BaseStage {
    name: string;
    protected inputColumns: Array<string> = [];
    protected outputColumns: Array<string> = [];

    protected constructor(name: string = 'BaseStage') {
        this.name = name;
    }

    protected getInputItem(item: Record<string, any>): Record<string, any> {
        if (this.inputColumns.length > 0) {
            return Object.fromEntries(
                Object.entries(item).filter(([key]) => this.inputColumns.indexOf(key) != -1)
            );
        } else {
            return item;
        }
    };

    protected getOutputData(item: Record<string, any>): Record<string, any> {
        if (this.outputColumns.length > 0) {
            return Object.fromEntries(
                Object.entries(item).filter(([key]) => this.outputColumns.indexOf(key) != -1)
            );
        } else {
            return item;
        }

    };

    abstract process(item: Record<string, any>): IterableIterator<Record<string, any>>;

    abstract run(source: IterableIterator<Record<string, any>>): IterableIterator<Record<string, any>>;
}
