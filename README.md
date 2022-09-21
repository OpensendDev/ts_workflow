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
import {Pipeline} from "./pipeline";
import {Producer} from "./producer";
import {Consumer} from "./consumer";
import {Stage} from "./stage";
import {SerialProducer} from "./serial_producer";
import {Task} from "./task";


function* generateStream(): IterableIterator<string> {
    for (let i = 0; i < 10; i++) {
        yield i.toString();
    }
}

class ProcessStage extends Stage {
    * process(item: string): IterableIterator<string> {
        yield `"${item}"`;
    }
}


class ConsoleLogConsumer extends Consumer {
    process(item: string): void {
        console.log(`I consumed ${item}`);
    }
}

class SimpleTask extends Task {
    public name: string = 'SimpleTask';

    getPipeline(): Pipeline {
        return new Pipeline(new ProcessStage()).addStage(new ProcessStage());
    };

    getProducer(): Producer {
        return new SerialProducer(generateStream());
    };

    getConsumer(): Consumer {
        return new ConsoleLogConsumer();
    };
}

new SimpleTask().main()

```
