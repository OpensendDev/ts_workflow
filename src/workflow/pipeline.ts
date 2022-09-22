import {BaseStage} from "./base_stage";
import {Stage} from "./stage";

export class Pipeline extends BaseStage {
    protected stages: Array<BaseStage> = [];

    constructor(stage: Stage, name: string = 'Pipeline') {
        super(name);
        this.stages.push(stage);
        this.name = `${this.name}:${name ? name : stage.name}`;
    }

    async * process(item: Record<string, any>): AsyncIterable<Record<string, any>> {
    };

    async * run(source: AsyncIterable<Record<string, any>>): AsyncIterable<Record<string, any>> {
        let sourceIter = source;
        for await (let stage of this.stages) {
            sourceIter = await stage.run(sourceIter);
        }
        yield* sourceIter;
    };

    addStage(stage: BaseStage, name?: string) {
        this.name = `${this.name}:${name ? name : stage.name}`;
        this.stages.push(stage);
        return this;
    }
}
