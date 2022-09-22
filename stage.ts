import {BaseStage} from "./base_stage";

export abstract class Stage extends BaseStage {
    constructor(name: string = 'Stage') {
        super(name);
    }

    * run(source: IterableIterator<Record<string, any>>): IterableIterator<Record<string, any>> {
        for (let sourceValue of source) {
            for (let processedItemValue of this.process(this.getInputItem(sourceValue))) {
                yield this.getOutputData(processedItemValue)
            }
        }
    };
}
