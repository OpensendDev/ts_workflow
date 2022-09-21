import {BaseStage} from "./base_stage";
import {Stage} from "./stage";

export class Pipeline extends BaseStage {
    public name: string = 'Pipeline';
    protected stages: Array<BaseStage> = [];

    constructor(stage: Stage, name?: string) {
        super();
        this.stages.push(stage);
        this.name = `${this.name}:${name ? name: stage.name}`;
    }
    *process(item: string): IterableIterator<string> {};

    *run(source: IterableIterator<string>): IterableIterator<string> {
        let sourceIter = source;
        for(let stage of this.stages) {
            sourceIter = stage.run(sourceIter);
        }
        yield* sourceIter;
    };

    addStage(stage: BaseStage, name?: string) {
        this.name = `${this.name}:${name ? name: stage.name}`;
        this.stages.push(stage);
        return this;
    }
}
