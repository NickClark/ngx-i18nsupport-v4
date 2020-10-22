"use strict";
/*
 * Public API Surface of xliffmerge
 * In principle, there is only the bin file xliffmerge,
 * because this is not mentioned as a library.
 * But the tooling uses the configuration file type.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// The module is here only because ng-packagr needs it
tslib_1.__exportStar(require("./lib/xliffmerge.module"), exports);
var writer_to_string_1 = require("./common/writer-to-string");
exports.WriterToString = writer_to_string_1.WriterToString;
var command_output_1 = require("./common/command-output");
exports.CommandOutput = command_output_1.CommandOutput;
var xliff_merge_1 = require("./xliffmerge/xliff-merge");
exports.XliffMerge = xliff_merge_1.XliffMerge;
//# sourceMappingURL=public_api.js.map