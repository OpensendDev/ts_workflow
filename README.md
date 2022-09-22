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
### Test script
```bash
# Copy test.ts to parent directory
npx ts-node test.ts
```

### Usage example

```typescript
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
```
