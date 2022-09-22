import {Producer} from '../workflow/producer';

const csvParser = require('csv-parser');
const fs = require('fs');

export class CsvReader extends Producer {
    protected csv_in: string;

    constructor(csv_in: string, name: string = 'CsvReader') {
        super(name);
        this.csv_in = csv_in;
    }

    async* toStream(): AsyncIterable<Record<string, any>> {
        yield* fs.createReadStream(this.csv_in, {encoding: 'utf-8'})
            .pipe(csvParser())
    }
}
