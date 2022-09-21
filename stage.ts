import {BaseStage} from "./base_stage";

export abstract class Stage extends BaseStage{
    public name: string = 'Stage';


    // abstract setUp(item: string): IterableIterator<string>;

    abstract process(item: string): IterableIterator<string>;

    // abstract tearDown(item: string): IterableIterator<string>;

    *run(source: IterableIterator<string>): IterableIterator<string> {
        let sourceIter = source.next();
        while(sourceIter.done == false) {
            yield* this.process(sourceIter.value);
            sourceIter = source.next();
        }
    };
}
