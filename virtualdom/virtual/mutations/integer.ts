import { MutationEngine } from "./engine.js";

export class IntegralMutationEngine extends MutationEngine<number> {
    next(current: number): number {
        return current + 1;
    }
    default(): number {
        return 0;
    }

}
