import {Consumer} from "../workflow/consumer";
import {Pipeline} from "../workflow/pipeline";
import {Producer} from "../workflow/producer";
import {Stage} from "../workflow/stage";
import {Task} from "../workflow/task";
import {CsvWriter} from "../machine/csv_writer";
import {CsvReader} from "../machine/csv_reader";

const hash = require('object-hash');


class EmailValidatingStage extends Stage {
    protected regex = new RegExp('.*@.*\..*');

    async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
        if (this.regex.test(item.email)) {
            yield item;
        }
    }
}

class HashingStage extends Stage {
    async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
        yield {
            'email': item.email,
            'md5': hash(item.email, {algorithm: 'md5'}),
            'sha1': hash(item.email, {algorithm: 'sha1'}),
            'sha256': hash(item.email, {algorithm: 'sha256'}),
        };
    }
}


class SimpleTask extends Task {
    getPipeline(): Pipeline {
        return new Pipeline(
            new EmailValidatingStage()
        ).addStage(
            new HashingStage()
        );
    };

    getProducer(): Producer {
        let csv_in: string = `${__dirname}/csv_in.csv`;
        return new CsvReader(csv_in);
    };

    getConsumer(): Consumer {
        let headers = [
            {id: 'email', title: 'Email'},
            {id: 'md5', title: 'Md5'},
            {id: 'sha1', title: 'Sha1'},
            {id: 'sha256', title: 'Sha256'},
        ];
        let csv_out: string = `${__dirname}/csv_out.csv`;
        return new CsvWriter(csv_out, headers);
    };
}

new SimpleTask('TestTask').main()
