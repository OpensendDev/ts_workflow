# workflow
A simple data processing workflow

```diagram
data                        stage --- consumer
  |                       /
producer --- stage --- stage --- stage --- consumer
                          \          \
                           \           stage --- consumer
                             consumer
```
# Introduction
### 1. Producers:
- Producer: parse data to data stream
- SingleItemProducer (input is a dictionary)
- SerialProducer (input is an iterator)
### 2. Stages:
- Stage: a middle step to process the data
- Pipeline: a sequence of stages
### 3. Consumers:
- Consumer: an endpoint to ingest output of pipeline
- HybridConsumer: a consumer with its own pipeline; or a group of consumers
### 4. Workers:
Put these above stuffs together to create a complete data processing workflow
- Job: receives config from terminal
- Task: config is set while initializing the object.
# Examples
### Test scripts
```bash
npx ts-node src/tests/simple_log_consumer.ts
npx ts-node src/tests/read_write_csv.ts
```

### Usage example

```typescript
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
```
