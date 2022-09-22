import {ColumnFilter} from "../machine/column_filter";
import {Consumer} from "../workflow/consumer";
import {Pipeline} from "../workflow/pipeline";
import {Producer} from "../workflow/producer";
import {RecordFilter} from "../machine/record_filter";
import {Stage} from "../workflow/stage";
import {StreamProducer} from "../workflow/stream_producer";
import {Task} from "../workflow/task";


async function* generateStream(): AsyncIterable<Record<string, any>> {
    for (let i = 0; i < 10; i++) {
        yield {
            'operand1': 2 * i,
            'operand2': 2 * i + 1,
            'operand3': 'unnecessary data',
        };
    }
}

function operandsNotTen(item: Record<string, number>): boolean {
    if (!(item.operand1 == 10 || item.operand2 == 10)) {
        return true
    }
    console.log(`One of the Operands is 10: ${JSON.stringify(item)}. Skip this record.`)
    return false
}

class SumStage extends Stage {
    async* process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
        yield {
            'sum': item.operand1 + item.operand2,
        };
    }
}


class ConsoleLogConsumer extends Consumer {
    async process(item: Record<string, any>): Promise<void> {
        console.log(`I consumed ${JSON.stringify(item)}`);
    }
}

class SimpleTask extends Task {
    getPipeline(): Pipeline {
        return new Pipeline(
            new ColumnFilter(['operand1', 'operand2'])
        ).addStage(
            new RecordFilter(operandsNotTen)
        ).addStage(
            new SumStage()
        );
    };

    getProducer(): Producer {
        return new StreamProducer(generateStream());
    };

    getConsumer(): Consumer {
        return new ConsoleLogConsumer();
    };
}

new SimpleTask('TestTask').main()
