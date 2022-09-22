import {Stage} from "../workflow/stage";

export class ColumnFilter extends Stage {
    constructor(outputColumns: Array<string>, name: string = 'ColumnFilter') {
        super(name);
        this.outputColumns = outputColumns;
    }

    async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
        yield item;
    };
}
