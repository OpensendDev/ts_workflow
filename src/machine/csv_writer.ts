import {Consumer} from "../workflow/consumer";
import {ObjectStringifierHeader} from "csv-writer/src/lib/record";

const csvWriter = require('csv-writer');

export class CsvWriter extends Consumer {
    writer: any;

    constructor(csv_out: string, headers: ObjectStringifierHeader, name: string = 'CsvWriter') {
        super(name);
        this.writer = csvWriter.createObjectCsvWriter({
            path: csv_out,
            header: headers,
        })
    }

    async process(item: Record<string, any>): Promise<void> {
        await this.writer.writeRecords([item]);
    }
}
