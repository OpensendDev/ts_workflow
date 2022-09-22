import {Stage} from "./stage";

export class ColumnFilter extends Stage {
    constructor(outputColumns: Array<string>, name: string = 'ColumnFilter') {
        super(name);
        this.outputColumns = outputColumns;
    }

    * process(item: Record<string, any>): IterableIterator<Record<string, any>> {
        yield item;
    };
}
