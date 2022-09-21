import {Pipeline} from "./pipeline";
import {Producer} from "./producer";
import {Consumer} from "./consumer";


export abstract class Task {
    public name: string = 'Consumer';

    abstract getPipeline(): Pipeline;

    abstract getProducer(): Producer;

    abstract getConsumer(): Consumer;

    main(): void {
        let pipeline = this.getPipeline(), producer = this.getProducer(), consumer = this.getConsumer();
        consumer.consume(pipeline.run(producer.stream));
    }
}
