import * as ts from "typescript";
import * as Lint from "../lint";
export declare class Rule extends Lint.Rules.AbstractRule {
    static metadata: Lint.IRuleMetadata;
    static FAILURE_STRING_ARRAY: string;
    static FAILURE_STRING_GENERIC: string;
    apply(sourceFile: ts.SourceFile): Lint.RuleFailure[];
}
