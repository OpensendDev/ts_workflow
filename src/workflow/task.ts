import { Consumer } from "./consumer";
import { Pipeline } from "./pipeline";
import { Producer } from "./producer";

export abstract class Task {
    name: string;

    constructor(name: string = 'Task') {
        this.name = name;
    }

    abstract getPipeline(): Pipeline;

    abstract getProducer(): Producer;

    abstract getConsumer(): Consumer;

    async main(): Promise<void> {
        let pipeline = this.getPipeline(),
            producer = this.getProducer(),
            consumer = this.getConsumer();
        await consumer.consume(pipeline.run(producer.stream)).then(() => { console.log('Done'); });
    }
}
