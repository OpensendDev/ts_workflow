import {ColumnFilter} from "./column_filter";
import {Consumer} from "./consumer";
import {Pipeline} from "./pipeline";
import {Producer} from "./producer";
import {RecordFilter} from "./record_filter";
import {Stage} from "./stage";
import {StreamProducer} from "./stream_producer";
import {Task} from "./task";


function* generateStream(): IterableIterator<Record<string, any>> {
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
    * process(item: Record<string, any>): IterableIterator<Record<string, any>> {
        yield {
            'sum': item.operand1 + item.operand2,
        };
    }
}


class ConsoleLogConsumer extends Consumer {
    process(item: Record<string, any>): void {
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
