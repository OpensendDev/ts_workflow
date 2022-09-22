import {BaseStage} from "./base_stage";

export abstract class Stage extends BaseStage {
    constructor(name: string = 'Stage') {
        super(name);
    }

    async* run(source: AsyncIterable<Record<string, any>>): AsyncIterable<Record<string, any>> {
        for await (let sourceValue of source) {
            for await (let processedItemValue of this.process(this.getInputItem(sourceValue))) {
                yield this.getOutputData(processedItemValue)
            }
        }
    };
}
