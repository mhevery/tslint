"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Lint = require("../lint");
var OPTION_ARRAY = "array";
var OPTION_GENERIC = "generic";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var alignWalker = new ArrayTypeWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(alignWalker);
    };
    Rule.metadata = {
        ruleName: "array-type",
        description: "Requires using either 'T[]' or 'Array<T>' for arrays.",
        optionsDescription: (_a = ["\n            One of the following arguments must be provided:\n\n            * `\"", "\"` enforces use of 'T[]'.\n            * `\"", "\"` enforces use of 'Array<T>'."], _a.raw = ["\n            One of the following arguments must be provided:\n\n            * \\`\"", "\"\\` enforces use of 'T[]'.\n            * \\`\"", "\"\\` enforces use of 'Array<T>'."], Lint.Utils.dedent(_a, OPTION_ARRAY, OPTION_GENERIC)),
        options: {
            type: "string",
            enum: [OPTION_ARRAY, OPTION_GENERIC],
        },
        optionExamples: ["[true, array]", "[true, generic]"],
        type: "style",
    };
    Rule.FAILURE_STRING_ARRAY = "Array type using 'Array<T>' is forbidden. Use 'T[]' instead.";
    Rule.FAILURE_STRING_GENERIC = "Array type using 'T[]' is forbidden. Use 'Array<T>' instead.";
    return Rule;
    var _a;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ArrayTypeWalker = (function (_super) {
    __extends(ArrayTypeWalker, _super);
    function ArrayTypeWalker() {
        _super.apply(this, arguments);
    }
    ArrayTypeWalker.prototype.visitArrayType = function (node) {
        if (this.hasOption(OPTION_GENERIC)) {
            var typeName = node.elementType;
            var fix = new Lint.Fix(Rule.metadata.ruleName, [
                this.appendText(typeName.getStart(), "Array<"),
                this.createReplacement(typeName.getEnd(), node.getEnd() - typeName.getEnd(), ">"),
            ]);
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_GENERIC, fix));
        }
        _super.prototype.visitArrayType.call(this, node);
    };
    ArrayTypeWalker.prototype.visitTypeReference = function (node) {
        var typeName = node.typeName.getText();
        if (this.hasOption(OPTION_ARRAY) && typeName === "Array") {
            var typeArgs = node.typeArguments;
            var fix = void 0;
            if (!typeArgs || typeArgs.length === 0) {
                fix = new Lint.Fix(Rule.metadata.ruleName, [
                    this.createReplacement(node.getStart(), node.getWidth(), "any[]"),
                ]);
            }
            else if (typeArgs && typeArgs.length === 1) {
                var typeStart = typeArgs[0].getStart();
                var typeEnd = typeArgs[0].getEnd();
                fix = new Lint.Fix(Rule.metadata.ruleName, [
                    this.deleteText(node.getStart(), typeStart - node.getStart()),
                    this.createReplacement(typeEnd, node.getEnd() - typeEnd, "[]"),
                ]);
            }
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_ARRAY, fix));
        }
        _super.prototype.visitTypeReference.call(this, node);
    };
    return ArrayTypeWalker;
}(Lint.RuleWalker));
