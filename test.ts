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

