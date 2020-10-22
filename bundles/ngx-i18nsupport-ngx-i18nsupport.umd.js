(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('stream'), require('chalk'), require('util'), require('fs'), require('@ngx-i18nsupport/ngx-i18nsupport-lib'), require('path'), require('rxjs'), require('rxjs/operators'), require('he'), require('request')) :
    typeof define === 'function' && define.amd ? define('@ngx-i18nsupport/ngx-i18nsupport', ['exports', '@angular/core', 'stream', 'chalk', 'util', 'fs', '@ngx-i18nsupport/ngx-i18nsupport-lib', 'path', 'rxjs', 'rxjs/operators', 'he', 'request'], factory) :
    (global = global || self, factory((global['ngx-i18nsupport'] = global['ngx-i18nsupport'] || {}, global['ngx-i18nsupport']['ngx-i18nsupport'] = {}), global.ng.core, global.stream, global.chalk, global.util, global.fs, global.ngxI18nsupportLib, global.path, global.rxjs, global.rxjs.operators, global.he, global.request));
}(this, function (exports, core, stream, chalk, util, fs, ngxI18nsupportLib, path, rxjs, operators, he, request) { 'use strict';

    chalk = chalk && chalk.hasOwnProperty('default') ? chalk['default'] : chalk;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // not used, only there to make ng-packagr happy
    var XliffmergeModule = /** @class */ (function () {
        function XliffmergeModule() {
        }
        XliffmergeModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [],
                        declarations: [],
                        exports: []
                    },] }
        ];
        return XliffmergeModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Collection of utility functions that are deprecated in nodes util.
     */
    /**
     * Replaces node isNullOrUndefined.
     * @param {?} value
     * @return {?}
     */
    function isNullOrUndefined(value) {
        return value === undefined || value === null;
    }
    /**
     * Replaces node isString.
     * @param {?} value
     * @return {?}
     */
    function isString(value) {
        return typeof value === 'string';
    }
    /**
     * Replaces node isArray.
     * @param {?} value
     * @return {?}
     */
    function isArray(value) {
        return Array.isArray(value);
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Created by martin on 20.02.2017.
     * A helper class for testing.
     * Can be used as a WritableStream and writes everything (synchronously) into a string,
     * that can easily be read by the tests.
     */
    var   /**
     * Created by martin on 20.02.2017.
     * A helper class for testing.
     * Can be used as a WritableStream and writes everything (synchronously) into a string,
     * that can easily be read by the tests.
     */
    WriterToString = /** @class */ (function (_super) {
        __extends(WriterToString, _super);
        function WriterToString() {
            var _this = _super.call(this) || this;
            _this.resultString = '';
            return _this;
        }
        /**
         * @param {?} chunk
         * @param {?} encoding
         * @param {?} callback
         * @return {?}
         */
        WriterToString.prototype._write = /**
         * @param {?} chunk
         * @param {?} encoding
         * @param {?} callback
         * @return {?}
         */
        function (chunk, encoding, callback) {
            /** @type {?} */
            var chunkString;
            if (isString(chunk)) {
                chunkString = chunk;
            }
            else if (chunk instanceof Buffer) {
                chunkString = chunk.toString();
            }
            else {
                chunkString = Buffer.alloc(chunk).toString(encoding);
            }
            this.resultString = this.resultString + chunkString;
            callback();
        };
        /**
         * Returns a string of everything, that was written to the stream so far.
         * @return written data
         */
        /**
         * Returns a string of everything, that was written to the stream so far.
         * @return {?} written data
         */
        WriterToString.prototype.writtenData = /**
         * Returns a string of everything, that was written to the stream so far.
         * @return {?} written data
         */
        function () {
            return this.resultString;
        };
        return WriterToString;
    }(stream.Writable));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {number} */
    var LogLevel = {
        'ERROR': 0,
        'WARN': 1,
        'INFO': 2,
        'DEBUG': 3,
    };
    LogLevel[LogLevel['ERROR']] = 'ERROR';
    LogLevel[LogLevel['WARN']] = 'WARN';
    LogLevel[LogLevel['INFO']] = 'INFO';
    LogLevel[LogLevel['DEBUG']] = 'DEBUG';
    var CommandOutput = /** @class */ (function () {
        function CommandOutput(stdout) {
            this._quiet = false;
            this._verbose = false;
            if (stdout) {
                this.outputStream = stdout;
            }
            else {
                this.outputStream = process.stdout;
            }
        }
        /**
         * @return {?}
         */
        CommandOutput.prototype.setVerbose = /**
         * @return {?}
         */
        function () {
            this._verbose = true;
        };
        /**
         * @return {?}
         */
        CommandOutput.prototype.setQuiet = /**
         * @return {?}
         */
        function () {
            this._quiet = true;
        };
        /**
         * Test, wether verbose is enabled.
         * @return wether verbose is enabled.
         */
        /**
         * Test, wether verbose is enabled.
         * @return {?} wether verbose is enabled.
         */
        CommandOutput.prototype.verbose = /**
         * Test, wether verbose is enabled.
         * @return {?} wether verbose is enabled.
         */
        function () {
            return this._verbose;
        };
        /**
         * Test, wether quiet is enabled.
         * @return wether quiet is enabled.
         */
        /**
         * Test, wether quiet is enabled.
         * @return {?} wether quiet is enabled.
         */
        CommandOutput.prototype.quiet = /**
         * Test, wether quiet is enabled.
         * @return {?} wether quiet is enabled.
         */
        function () {
            return this._quiet;
        };
        /**
         * @param {?} msg
         * @param {...?} params
         * @return {?}
         */
        CommandOutput.prototype.error = /**
         * @param {?} msg
         * @param {...?} params
         * @return {?}
         */
        function (msg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            this.log(LogLevel.ERROR, msg, params);
        };
        /**
         * @param {?} msg
         * @param {...?} params
         * @return {?}
         */
        CommandOutput.prototype.warn = /**
         * @param {?} msg
         * @param {...?} params
         * @return {?}
         */
        function (msg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            this.log(LogLevel.WARN, msg, params);
        };
        /**
         * @param {?} msg
         * @param {...?} params
         * @return {?}
         */
        CommandOutput.prototype.info = /**
         * @param {?} msg
         * @param {...?} params
         * @return {?}
         */
        function (msg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            this.log(LogLevel.INFO, msg, params);
        };
        /**
         * @param {?} msg
         * @param {...?} params
         * @return {?}
         */
        CommandOutput.prototype.debug = /**
         * @param {?} msg
         * @param {...?} params
         * @return {?}
         */
        function (msg) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            this.log(LogLevel.DEBUG, msg, params);
        };
        /**
         * @private
         * @param {?} level
         * @param {?} msg
         * @param {?} params
         * @return {?}
         */
        CommandOutput.prototype.log = /**
         * @private
         * @param {?} level
         * @param {?} msg
         * @param {?} params
         * @return {?}
         */
        function (level, msg, params) {
            if (!this.isOutputEnabled(level)) {
                return;
            }
            /** @type {?} */
            var coloredMessage;
            switch (level) {
                case LogLevel.ERROR:
                    coloredMessage = chalk.red('ERROR: ' + msg);
                    break;
                case LogLevel.WARN:
                    coloredMessage = chalk.magenta('WARNING: ' + msg);
                    break;
                default:
                    coloredMessage = chalk.gray('* ' + msg);
                    break;
            }
            /** @type {?} */
            var outMsg = util.format.apply(void 0, __spread([coloredMessage], params));
            this.outputStream.write(outMsg + '\n');
        };
        /**
         * @private
         * @param {?} level
         * @return {?}
         */
        CommandOutput.prototype.isOutputEnabled = /**
         * @private
         * @param {?} level
         * @return {?}
         */
        function (level) {
            /** @type {?} */
            var quietEnabled;
            /** @type {?} */
            var verboseEnabled;
            if (this._quiet && this._verbose) {
                quietEnabled = false;
                verboseEnabled = false;
            }
            else {
                quietEnabled = this._quiet;
                verboseEnabled = this._verbose;
            }
            switch (level) {
                case LogLevel.ERROR:
                    return true; // always output errors
                case LogLevel.WARN:
                    return (!quietEnabled);
                case LogLevel.INFO:
                    return (verboseEnabled && !quietEnabled);
                case LogLevel.DEBUG:
                    return verboseEnabled;
                default:
                    return true;
            }
        };
        return CommandOutput;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Created by martin on 17.02.2017.
     */
    var XliffMergeError = /** @class */ (function (_super) {
        __extends(XliffMergeError, _super);
        function XliffMergeError(msg) {
            var _this = _super.call(this, msg) || this;
            // Set the prototype explicitly.
            Object.setPrototypeOf(_this, XliffMergeError.prototype);
            return _this;
        }
        return XliffMergeError;
    }(Error));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Created by martin on 17.02.2017.
     * Some (a few) simple utils for file operations.
     * Just for convenience.
     */
    var /**
     * Created by martin on 17.02.2017.
     * Some (a few) simple utils for file operations.
     * Just for convenience.
     */
    FileUtil = /** @class */ (function () {
        function FileUtil() {
        }
        /**
         * Check for existence.
         * @param filename filename
         * @return wether file exists
         */
        /**
         * Check for existence.
         * @param {?} filename filename
         * @return {?} wether file exists
         */
        FileUtil.exists = /**
         * Check for existence.
         * @param {?} filename filename
         * @return {?} wether file exists
         */
        function (filename) {
            return fs.existsSync(filename);
        };
        /**
         * Read a file.
         * @param filename filename
         * @param encoding encoding
         * @return content of file
         */
        /**
         * Read a file.
         * @param {?} filename filename
         * @param {?} encoding encoding
         * @return {?} content of file
         */
        FileUtil.read = /**
         * Read a file.
         * @param {?} filename filename
         * @param {?} encoding encoding
         * @return {?} content of file
         */
        function (filename, encoding) {
            return fs.readFileSync(filename, encoding);
        };
        /**
         * Write a file with given content.
         * @param filename filename
         * @param newContent newContent
         * @param encoding encoding
         */
        /**
         * Write a file with given content.
         * @param {?} filename filename
         * @param {?} newContent newContent
         * @param {?} encoding encoding
         * @return {?}
         */
        FileUtil.replaceContent = /**
         * Write a file with given content.
         * @param {?} filename filename
         * @param {?} newContent newContent
         * @param {?} encoding encoding
         * @return {?}
         */
        function (filename, newContent, encoding) {
            fs.writeFileSync(filename, newContent, { encoding: encoding });
        };
        /**
         * @param {?} srcFile
         * @param {?} destFile
         * @return {?}
         */
        FileUtil.copy = /**
         * @param {?} srcFile
         * @param {?} destFile
         * @return {?}
         */
        function (srcFile, destFile) {
            /** @type {?} */
            var BUF_LENGTH = 64 * 1024;
            /** @type {?} */
            var buff = Buffer.alloc(BUF_LENGTH);
            /** @type {?} */
            var fdr = fs.openSync(srcFile, 'r');
            /** @type {?} */
            var fdw = fs.openSync(destFile, 'w');
            /** @type {?} */
            var bytesRead = 1;
            /** @type {?} */
            var pos = 0;
            while (bytesRead > 0) {
                bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
                fs.writeSync(fdw, buff, 0, bytesRead);
                pos += bytesRead;
            }
            fs.closeSync(fdr);
            fs.closeSync(fdw);
        };
        /**
         * Delete the folder and all of its content (rm -rf).
         * @param path path
         */
        /**
         * Delete the folder and all of its content (rm -rf).
         * @param {?} path path
         * @return {?}
         */
        FileUtil.deleteFolderRecursive = /**
         * Delete the folder and all of its content (rm -rf).
         * @param {?} path path
         * @return {?}
         */
        function (path) {
            /** @type {?} */
            var files = [];
            if (fs.existsSync(path)) {
                files = fs.readdirSync(path);
                files.forEach((/**
                 * @param {?} file
                 * @return {?}
                 */
                function (file) {
                    /** @type {?} */
                    var curPath = path + '/' + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        FileUtil.deleteFolderRecursive(curPath);
                    }
                    else { // delete file
                        fs.unlinkSync(curPath);
                    }
                }));
                fs.rmdirSync(path);
            }
        };
        /**
         * Delete folders content recursively, but do not delete folder.
         * Folder is left empty at the end.
         * @param path path
         */
        /**
         * Delete folders content recursively, but do not delete folder.
         * Folder is left empty at the end.
         * @param {?} path path
         * @return {?}
         */
        FileUtil.deleteFolderContentRecursive = /**
         * Delete folders content recursively, but do not delete folder.
         * Folder is left empty at the end.
         * @param {?} path path
         * @return {?}
         */
        function (path) {
            /** @type {?} */
            var files = [];
            if (fs.existsSync(path)) {
                files = fs.readdirSync(path);
                files.forEach((/**
                 * @param {?} file
                 * @return {?}
                 */
                function (file) {
                    /** @type {?} */
                    var curPath = path + '/' + file;
                    if (fs.lstatSync(curPath).isDirectory()) { // recurse
                        FileUtil.deleteFolderRecursive(curPath);
                    }
                    else { // delete file
                        fs.unlinkSync(curPath);
                    }
                }));
            }
        };
        /**
         * Delete a file.
         * @param path path
         */
        /**
         * Delete a file.
         * @param {?} path path
         * @return {?}
         */
        FileUtil.deleteFile = /**
         * Delete a file.
         * @param {?} path path
         * @return {?}
         */
        function (path) {
            fs.unlinkSync(path);
        };
        return FileUtil;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Helper class to parse ngx translate extraction pattern
     * and to decide wether a given message matches the pattern.
     */
    var /**
     * Helper class to parse ngx translate extraction pattern
     * and to decide wether a given message matches the pattern.
     */
    NgxTranslateExtractionPattern = /** @class */ (function () {
        /**
         * Construct the pattern from given description string
         * @param extractionPatternString extractionPatternString
         * @throws an error, if there is a syntax error
         */
        function NgxTranslateExtractionPattern(extractionPatternString) {
            this.extractionPatternString = extractionPatternString;
            /** @type {?} */
            var parts = extractionPatternString.split('|');
            this._matchExplicitId = false;
            this._descriptionPatterns = [];
            for (var i = 0; i < parts.length; i++) {
                /** @type {?} */
                var part = parts[i];
                if (part === '@@') {
                    if (this._matchExplicitId) {
                        throw new Error('extraction pattern must not contain @@ twice');
                    }
                    this._matchExplicitId = true;
                }
                else {
                    /** @type {?} */
                    var errorString = this.checkValidDescriptionPattern(part);
                    if (errorString) {
                        throw new Error(errorString);
                    }
                    this._descriptionPatterns.push(part);
                }
            }
        }
        /**
         * Check, wether an explicitly set id matches the pattern.
         * @param id id
         * @return wether an explicitly set id matches the pattern.
         */
        /**
         * Check, wether an explicitly set id matches the pattern.
         * @param {?} id id
         * @return {?} wether an explicitly set id matches the pattern.
         */
        NgxTranslateExtractionPattern.prototype.isExplicitIdMatched = /**
         * Check, wether an explicitly set id matches the pattern.
         * @param {?} id id
         * @return {?} wether an explicitly set id matches the pattern.
         */
        function (id) {
            return id && this._matchExplicitId;
        };
        /**
         * Check, wether a given description matches the pattern.
         * @param description description
         * @return wether a given description matches the pattern.
         */
        /**
         * Check, wether a given description matches the pattern.
         * @param {?} description description
         * @return {?} wether a given description matches the pattern.
         */
        NgxTranslateExtractionPattern.prototype.isDescriptionMatched = /**
         * Check, wether a given description matches the pattern.
         * @param {?} description description
         * @return {?} wether a given description matches the pattern.
         */
        function (description) {
            return this._descriptionPatterns.indexOf(description) >= 0;
        };
        /**
         * @private
         * @param {?} descriptionPattern
         * @return {?}
         */
        NgxTranslateExtractionPattern.prototype.checkValidDescriptionPattern = /**
         * @private
         * @param {?} descriptionPattern
         * @return {?}
         */
        function (descriptionPattern) {
            if (!descriptionPattern) {
                return 'empty value not allowed';
            }
            if (/^[a-zA-Z_][a-zA-Z_-]*$/.test(descriptionPattern)) {
                return null; // it is ok
            }
            else {
                return 'description pattern must be an identifier containing only letters, digits, _ or -';
            }
        };
        return NgxTranslateExtractionPattern;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxTranslateExtractor = /** @class */ (function () {
        function NgxTranslateExtractor(messagesFile, extractionPatternString) {
            this.messagesFile = messagesFile;
            this.extractionPattern = new NgxTranslateExtractionPattern(extractionPatternString);
        }
        /**
         * Check, wether extractionPattern has valid syntax.
         * @param extractionPatternString extractionPatternString
         * @return null, if pattern is ok, string describing the error, if it is not ok.
         */
        /**
         * Check, wether extractionPattern has valid syntax.
         * @param {?} extractionPatternString extractionPatternString
         * @return {?} null, if pattern is ok, string describing the error, if it is not ok.
         */
        NgxTranslateExtractor.checkPattern = /**
         * Check, wether extractionPattern has valid syntax.
         * @param {?} extractionPatternString extractionPatternString
         * @return {?} null, if pattern is ok, string describing the error, if it is not ok.
         */
        function (extractionPatternString) {
            try {
                if (new NgxTranslateExtractionPattern(extractionPatternString)) {
                    return null;
                }
            }
            catch (error) {
                return error.message;
            }
            return null;
        };
        /**
         * @param {?} messagesFile
         * @param {?} extractionPattern
         * @param {?} outputFile
         * @return {?}
         */
        NgxTranslateExtractor.extract = /**
         * @param {?} messagesFile
         * @param {?} extractionPattern
         * @param {?} outputFile
         * @return {?}
         */
        function (messagesFile, extractionPattern, outputFile) {
            new NgxTranslateExtractor(messagesFile, extractionPattern).extractTo(outputFile);
        };
        /**
         * Extact messages and write them to a file.
         * @param outputFile outputFile
         */
        /**
         * Extact messages and write them to a file.
         * @param {?} outputFile outputFile
         * @return {?}
         */
        NgxTranslateExtractor.prototype.extractTo = /**
         * Extact messages and write them to a file.
         * @param {?} outputFile outputFile
         * @return {?}
         */
        function (outputFile) {
            /** @type {?} */
            var translations = this.toNgxTranslations(this.extract());
            if (translations && Object.keys(translations).length > 0) {
                FileUtil.replaceContent(outputFile, JSON.stringify(translations, null, 4), 'UTF-8');
            }
            else {
                if (FileUtil.exists(outputFile)) {
                    FileUtil.deleteFile(outputFile);
                }
            }
        };
        /**
         *  Extract messages and convert them to ngx translations.
         *  @return the translation objects.
         */
        /**
         *  Extract messages and convert them to ngx translations.
         * @private
         * @return {?} the translation objects.
         */
        NgxTranslateExtractor.prototype.extract = /**
         *  Extract messages and convert them to ngx translations.
         * @private
         * @return {?} the translation objects.
         */
        function () {
            var _this = this;
            /** @type {?} */
            var result = [];
            this.messagesFile.forEachTransUnit((/**
             * @param {?} tu
             * @return {?}
             */
            function (tu) {
                /** @type {?} */
                var ngxId = _this.ngxTranslateIdFromTU(tu);
                if (ngxId) {
                    /** @type {?} */
                    var messagetext = tu.targetContentNormalized().asDisplayString(ngxI18nsupportLib.NORMALIZATION_FORMAT_NGXTRANSLATE);
                    result.push({ id: ngxId, message: messagetext });
                }
            }));
            return result;
        };
        /**
         * Check, wether this tu should be extracted for ngx-translate usage, and return its id for ngx-translate.
         * There are 2 possibilities:
         * 1. description is set to "ngx-translate" and meaning contains the id.
         * 2. id is explicitly set to a string.
         * @param tu tu
         * @return an ngx id or null, if this tu should not be extracted.
         */
        /**
         * Check, wether this tu should be extracted for ngx-translate usage, and return its id for ngx-translate.
         * There are 2 possibilities:
         * 1. description is set to "ngx-translate" and meaning contains the id.
         * 2. id is explicitly set to a string.
         * @private
         * @param {?} tu tu
         * @return {?} an ngx id or null, if this tu should not be extracted.
         */
        NgxTranslateExtractor.prototype.ngxTranslateIdFromTU = /**
         * Check, wether this tu should be extracted for ngx-translate usage, and return its id for ngx-translate.
         * There are 2 possibilities:
         * 1. description is set to "ngx-translate" and meaning contains the id.
         * 2. id is explicitly set to a string.
         * @private
         * @param {?} tu tu
         * @return {?} an ngx id or null, if this tu should not be extracted.
         */
        function (tu) {
            if (this.isExplicitlySetId(tu.id)) {
                if (this.extractionPattern.isExplicitIdMatched(tu.id)) {
                    return tu.id;
                }
                else {
                    return null;
                }
            }
            /** @type {?} */
            var description = tu.description();
            if (description && this.extractionPattern.isDescriptionMatched(description)) {
                return tu.meaning();
            }
        };
        /**
         * Test, wether ID was explicitly set (via i18n="@myid).
         * Just heuristic, an ID is explicitly, if it does not look like a generated one.
         * @param id id
         * @return wether ID was explicitly set (via i18n="@myid).
         */
        /**
         * Test, wether ID was explicitly set (via i18n="\@myid).
         * Just heuristic, an ID is explicitly, if it does not look like a generated one.
         * @private
         * @param {?} id id
         * @return {?} wether ID was explicitly set (via i18n="\@myid).
         */
        NgxTranslateExtractor.prototype.isExplicitlySetId = /**
         * Test, wether ID was explicitly set (via i18n="\@myid).
         * Just heuristic, an ID is explicitly, if it does not look like a generated one.
         * @private
         * @param {?} id id
         * @return {?} wether ID was explicitly set (via i18n="\@myid).
         */
        function (id) {
            if (isNullOrUndefined(id)) {
                return false;
            }
            // generated IDs are either decimal or sha1 hex
            /** @type {?} */
            var reForGeneratedId = /^[0-9a-f]{11,}$/;
            return !reForGeneratedId.test(id);
        };
        /**
         * Convert list of relevant TUs to ngx translations object.
         * @param msgList msgList
         */
        /**
         * Convert list of relevant TUs to ngx translations object.
         * @private
         * @param {?} msgList msgList
         * @return {?}
         */
        NgxTranslateExtractor.prototype.toNgxTranslations = /**
         * Convert list of relevant TUs to ngx translations object.
         * @private
         * @param {?} msgList msgList
         * @return {?}
         */
        function (msgList) {
            var _this = this;
            /** @type {?} */
            var translationObject = {};
            msgList.forEach((/**
             * @param {?} msg
             * @return {?}
             */
            function (msg) {
                _this.putInTranslationObject(translationObject, msg);
            }));
            return translationObject;
        };
        /**
         * Put a new messages into the translation data object.
         * If you add, e.g. "{id: 'myapp.example', message: 'test'}",
         * the translation object will then contain an object myapp that has property example:
         * {myapp: {
         *   example: 'test'
         *   }}
         * @param translationObject translationObject
         * @param msg msg
         */
        /**
         * Put a new messages into the translation data object.
         * If you add, e.g. "{id: 'myapp.example', message: 'test'}",
         * the translation object will then contain an object myapp that has property example:
         * {myapp: {
         *   example: 'test'
         *   }}
         * @private
         * @param {?} translationObject translationObject
         * @param {?} msg msg
         * @return {?}
         */
        NgxTranslateExtractor.prototype.putInTranslationObject = /**
         * Put a new messages into the translation data object.
         * If you add, e.g. "{id: 'myapp.example', message: 'test'}",
         * the translation object will then contain an object myapp that has property example:
         * {myapp: {
         *   example: 'test'
         *   }}
         * @private
         * @param {?} translationObject translationObject
         * @param {?} msg msg
         * @return {?}
         */
        function (translationObject, msg) {
            /** @type {?} */
            var firstPartOfId;
            /** @type {?} */
            var restOfId;
            /** @type {?} */
            var indexOfDot = msg.id.indexOf('.');
            if (indexOfDot === 0 || indexOfDot === (msg.id.length - 1)) {
                throw new Error('bad nxg-translate id "' + msg.id + '"');
            }
            if (indexOfDot < 0) {
                firstPartOfId = msg.id;
                restOfId = '';
            }
            else {
                firstPartOfId = msg.id.substring(0, indexOfDot);
                restOfId = msg.id.substring(indexOfDot + 1);
            }
            /** @type {?} */
            var object = translationObject[firstPartOfId];
            if (isNullOrUndefined(object)) {
                if (restOfId === '') {
                    translationObject[firstPartOfId] = msg.message;
                    return;
                }
                object = {};
                translationObject[firstPartOfId] = object;
            }
            else {
                if (restOfId === '') {
                    throw new Error('duplicate id praefix "' + msg.id + '"');
                }
            }
            this.putInTranslationObject((/** @type {?} */ (object)), { id: restOfId, message: msg.message });
        };
        NgxTranslateExtractor.DefaultExtractionPattern = '@@|ngx-translate';
        return NgxTranslateExtractor;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var PROFILE_CANDIDATES = ['package.json', '.angular-cli.json'];
    var XliffMergeParameters = /** @class */ (function () {
        function XliffMergeParameters() {
            this.errorsFound = [];
            this.warningsFound = [];
        }
        /**
         * Create Parameters.
         * @param options command options
         * @param profileContent given profile (if not, it is read from the profile path from options).
         */
        /**
         * Create Parameters.
         * @param {?} options command options
         * @param {?=} profileContent given profile (if not, it is read from the profile path from options).
         * @return {?}
         */
        XliffMergeParameters.createFromOptions = /**
         * Create Parameters.
         * @param {?} options command options
         * @param {?=} profileContent given profile (if not, it is read from the profile path from options).
         * @return {?}
         */
        function (options, profileContent) {
            /** @type {?} */
            var parameters = new XliffMergeParameters();
            parameters.configure(options, profileContent);
            return parameters;
        };
        /**
         * Read potential profile.
         * To be a candidate, file must exist and contain property "xliffmergeOptions".
         * @param profilePath path of profile
         * @return parsed content of file or null, if file does not exist or is not a profile candidate.
         */
        /**
         * Read potential profile.
         * To be a candidate, file must exist and contain property "xliffmergeOptions".
         * @private
         * @param {?} profilePath path of profile
         * @return {?} parsed content of file or null, if file does not exist or is not a profile candidate.
         */
        XliffMergeParameters.readProfileCandidate = /**
         * Read potential profile.
         * To be a candidate, file must exist and contain property "xliffmergeOptions".
         * @private
         * @param {?} profilePath path of profile
         * @return {?} parsed content of file or null, if file does not exist or is not a profile candidate.
         */
        function (profilePath) {
            /** @type {?} */
            var content;
            try {
                content = fs.readFileSync(profilePath, 'UTF-8');
            }
            catch (err) {
                return null;
            }
            /** @type {?} */
            var parsedContent = JSON.parse(content);
            if (parsedContent && parsedContent.xliffmergeOptions) {
                return parsedContent;
            }
            else {
                return null;
            }
        };
        /**
         * Initialize me from the profile content.
         * (public only for test usage).
         * @param options options given at runtime via command line
         * @param profileContent if null, read it from profile.
         */
        /**
         * Initialize me from the profile content.
         * (public only for test usage).
         * @private
         * @param {?} options options given at runtime via command line
         * @param {?=} profileContent if null, read it from profile.
         * @return {?}
         */
        XliffMergeParameters.prototype.configure = /**
         * Initialize me from the profile content.
         * (public only for test usage).
         * @private
         * @param {?} options options given at runtime via command line
         * @param {?=} profileContent if null, read it from profile.
         * @return {?}
         */
        function (options, profileContent) {
            this.errorsFound = [];
            this.warningsFound = [];
            if (!profileContent) {
                profileContent = this.readProfile(options);
            }
            /** @type {?} */
            var validProfile = (!!profileContent);
            if (options.quiet) {
                this._quiet = options.quiet;
            }
            if (options.verbose) {
                this._verbose = options.verbose;
            }
            if (validProfile) {
                this.initializeFromConfig(profileContent);
                // if languages are given as parameters, they ovveride everything said in profile
                if (!!options.languages && options.languages.length > 0) {
                    this._languages = options.languages;
                    if (!this._defaultLanguage) {
                        this._defaultLanguage = this._languages[0];
                    }
                }
                this.checkParameters();
            }
        };
        /**
         * Read profile.
         * @param options program options
         * @return the read profile (empty, if none, null if errors)
         */
        /**
         * Read profile.
         * @private
         * @param {?} options program options
         * @return {?} the read profile (empty, if none, null if errors)
         */
        XliffMergeParameters.prototype.readProfile = /**
         * Read profile.
         * @private
         * @param {?} options program options
         * @return {?} the read profile (empty, if none, null if errors)
         */
        function (options) {
            var e_1, _a;
            /** @type {?} */
            var profilePath = options.profilePath;
            if (!profilePath) {
                try {
                    for (var PROFILE_CANDIDATES_1 = __values(PROFILE_CANDIDATES), PROFILE_CANDIDATES_1_1 = PROFILE_CANDIDATES_1.next(); !PROFILE_CANDIDATES_1_1.done; PROFILE_CANDIDATES_1_1 = PROFILE_CANDIDATES_1.next()) {
                        var configfilename = PROFILE_CANDIDATES_1_1.value;
                        /** @type {?} */
                        var profile = XliffMergeParameters.readProfileCandidate(configfilename);
                        if (profile) {
                            this.usedProfilePath = configfilename;
                            return profile;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (PROFILE_CANDIDATES_1_1 && !PROFILE_CANDIDATES_1_1.done && (_a = PROFILE_CANDIDATES_1.return)) _a.call(PROFILE_CANDIDATES_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return {};
            }
            /** @type {?} */
            var content;
            try {
                content = fs.readFileSync(profilePath, 'UTF-8');
            }
            catch (err) {
                this.errorsFound.push(new XliffMergeError('could not read profile "' + profilePath + '"'));
                return null;
            }
            this.usedProfilePath = profilePath;
            /** @type {?} */
            var profileContent = JSON.parse(content);
            // replace all pathes in options by absolute paths
            /** @type {?} */
            var xliffmergeOptions = profileContent.xliffmergeOptions;
            xliffmergeOptions.srcDir = this.adjustPathToProfilePath(profilePath, xliffmergeOptions.srcDir);
            xliffmergeOptions.genDir = this.adjustPathToProfilePath(profilePath, xliffmergeOptions.genDir);
            xliffmergeOptions.apikeyfile = this.adjustPathToProfilePath(profilePath, xliffmergeOptions.apikeyfile);
            return profileContent;
        };
        /**
         * @private
         * @param {?} profilePath
         * @param {?} pathToAdjust
         * @return {?}
         */
        XliffMergeParameters.prototype.adjustPathToProfilePath = /**
         * @private
         * @param {?} profilePath
         * @param {?} pathToAdjust
         * @return {?}
         */
        function (profilePath, pathToAdjust) {
            if (!pathToAdjust || path.isAbsolute(pathToAdjust)) {
                return pathToAdjust;
            }
            return path.join(path.dirname(profilePath), pathToAdjust).replace(/\\/g, '/');
        };
        /**
         * @private
         * @param {?} profileContent
         * @return {?}
         */
        XliffMergeParameters.prototype.initializeFromConfig = /**
         * @private
         * @param {?} profileContent
         * @return {?}
         */
        function (profileContent) {
            if (!profileContent) {
                return;
            }
            /** @type {?} */
            var profile = profileContent.xliffmergeOptions;
            if (profile) {
                if (!isNullOrUndefined(profile.quiet)) {
                    this._quiet = profile.quiet;
                }
                if (!isNullOrUndefined(profile.verbose)) {
                    this._verbose = profile.verbose;
                }
                if (!isNullOrUndefined(profile.allowIdChange)) {
                    this._allowIdChange = profile.allowIdChange;
                }
                if (profile.defaultLanguage) {
                    this._defaultLanguage = profile.defaultLanguage;
                }
                if (profile.languages) {
                    this._languages = profile.languages;
                }
                if (profile.srcDir) {
                    this._srcDir = profile.srcDir;
                }
                if (profile.angularCompilerOptions) {
                    if (profile.angularCompilerOptions.genDir) {
                        this._genDir = profile.angularCompilerOptions.genDir;
                    }
                }
                if (profile.genDir) {
                    // this must be after angularCompilerOptions to be preferred
                    this._genDir = profile.genDir;
                }
                if (profile.i18nBaseFile) {
                    this._i18nBaseFile = profile.i18nBaseFile;
                }
                if (profile.i18nFile) {
                    this._i18nFile = profile.i18nFile;
                }
                if (profile.i18nFormat) {
                    this._i18nFormat = profile.i18nFormat;
                }
                if (profile.encoding) {
                    this._encoding = profile.encoding;
                }
                if (!isNullOrUndefined(profile.removeUnusedIds)) {
                    this._removeUnusedIds = profile.removeUnusedIds;
                }
                if (!isNullOrUndefined(profile.supportNgxTranslate)) {
                    this._supportNgxTranslate = profile.supportNgxTranslate;
                }
                if (!isNullOrUndefined(profile.ngxTranslateExtractionPattern)) {
                    this._ngxTranslateExtractionPattern = profile.ngxTranslateExtractionPattern;
                }
                if (!isNullOrUndefined(profile.useSourceAsTarget)) {
                    this._useSourceAsTarget = profile.useSourceAsTarget;
                }
                if (!isNullOrUndefined(profile.targetPraefix)) {
                    this._targetPraefix = profile.targetPraefix;
                }
                if (!isNullOrUndefined(profile.targetSuffix)) {
                    this._targetSuffix = profile.targetSuffix;
                }
                if (!isNullOrUndefined(profile.autotranslate)) {
                    this._autotranslate = profile.autotranslate;
                }
                if (!isNullOrUndefined(profile.beautifyOutput)) {
                    this._beautifyOutput = profile.beautifyOutput;
                }
                if (!isNullOrUndefined(profile.preserveOrder)) {
                    this._preserveOrder = profile.preserveOrder;
                }
                if (!isNullOrUndefined(profile.apikey)) {
                    this._apikey = profile.apikey;
                }
                if (!isNullOrUndefined(profile.apikeyfile)) {
                    this._apikeyfile = profile.apikeyfile;
                }
            }
            else {
                this.warningsFound.push('did not find "xliffmergeOptions" in profile, using defaults');
            }
        };
        /**
         * Check all Parameters, wether they are complete and consistent.
         * if something is wrong with the parameters, it is collected in errorsFound.
         */
        /**
         * Check all Parameters, wether they are complete and consistent.
         * if something is wrong with the parameters, it is collected in errorsFound.
         * @private
         * @return {?}
         */
        XliffMergeParameters.prototype.checkParameters = /**
         * Check all Parameters, wether they are complete and consistent.
         * if something is wrong with the parameters, it is collected in errorsFound.
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            this.checkLanguageSyntax(this.defaultLanguage());
            if (this.languages().length === 0) {
                this.errorsFound.push(new XliffMergeError('no languages specified'));
            }
            this.languages().forEach((/**
             * @param {?} lang
             * @return {?}
             */
            function (lang) {
                _this.checkLanguageSyntax(lang);
            }));
            /** @type {?} */
            var stats;
            /** @type {?} */
            var err;
            // srcDir should exists
            try {
                stats = fs.statSync(this.srcDir());
            }
            catch (e) {
                err = e;
            }
            if (!!err || !stats.isDirectory()) {
                this.errorsFound.push(new XliffMergeError('srcDir "' + this.srcDir() + '" is not a directory'));
            }
            // genDir should exists
            try {
                stats = fs.statSync(this.genDir());
            }
            catch (e) {
                err = e;
            }
            if (!!err || !stats.isDirectory()) {
                this.errorsFound.push(new XliffMergeError('genDir "' + this.genDir() + '" is not a directory'));
            }
            // master file MUST exist
            try {
                fs.accessSync(this.i18nFile(), fs.constants.R_OK);
            }
            catch (err) {
                this.errorsFound.push(new XliffMergeError('i18nFile "' + this.i18nFile() + '" is not readable'));
            }
            // i18nFormat must be xlf xlf2 or xmb
            if (!(this.i18nFormat() === 'xlf' || this.i18nFormat() === 'xlf2' || this.i18nFormat() === 'xmb')) {
                this.errorsFound.push(new XliffMergeError('i18nFormat "' + this.i18nFormat() + '" invalid, must be "xlf" or "xlf2" or "xmb"'));
            }
            // autotranslate requires api key
            if (this.autotranslate() && !this.apikey()) {
                this.errorsFound.push(new XliffMergeError('autotranslate requires an API key, please set one'));
            }
            // autotranslated languages must be in list of all languages
            this.autotranslatedLanguages().forEach((/**
             * @param {?} lang
             * @return {?}
             */
            function (lang) {
                if (_this.languages().indexOf(lang) < 0) {
                    _this.errorsFound.push(new XliffMergeError('autotranslate language "' + lang + '" is not in list of languages'));
                }
                if (lang === _this.defaultLanguage()) {
                    _this.errorsFound.push(new XliffMergeError('autotranslate language "' + lang + '" cannot be translated, because it is the source language'));
                }
            }));
            // ngx translate pattern check
            if (this.supportNgxTranslate()) {
                /** @type {?} */
                var checkResult = NgxTranslateExtractor.checkPattern(this.ngxTranslateExtractionPattern());
                if (!isNullOrUndefined(checkResult)) {
                    this.errorsFound.push(new XliffMergeError('ngxTranslateExtractionPattern "' + this.ngxTranslateExtractionPattern() + '": ' + checkResult));
                }
            }
            // targetPraefix and targetSuffix check
            if (!this.useSourceAsTarget()) {
                if (this.targetPraefix().length > 0) {
                    this.warningsFound.push('configured targetPraefix "' + this.targetPraefix() + '" will not be used because "useSourceAsTarget" is disabled"');
                }
                if (this.targetSuffix().length > 0) {
                    this.warningsFound.push('configured targetSuffix "' + this.targetSuffix() + '" will not be used because "useSourceAsTarget" is disabled"');
                }
            }
        };
        /**
         * Check syntax of language.
         * Must be compatible with XML Schema type xsd:language.
         * Pattern: [a-zA-Z]{1,8}((-|_)[a-zA-Z0-9]{1,8})*
         * @param lang language to check
         */
        /**
         * Check syntax of language.
         * Must be compatible with XML Schema type xsd:language.
         * Pattern: [a-zA-Z]{1,8}((-|_)[a-zA-Z0-9]{1,8})*
         * @private
         * @param {?} lang language to check
         * @return {?}
         */
        XliffMergeParameters.prototype.checkLanguageSyntax = /**
         * Check syntax of language.
         * Must be compatible with XML Schema type xsd:language.
         * Pattern: [a-zA-Z]{1,8}((-|_)[a-zA-Z0-9]{1,8})*
         * @private
         * @param {?} lang language to check
         * @return {?}
         */
        function (lang) {
            /** @type {?} */
            var pattern = /^[a-zA-Z]{1,8}([-_][a-zA-Z0-9]{1,8})*$/;
            if (!pattern.test(lang)) {
                this.errorsFound.push(new XliffMergeError('language "' + lang + '" is not valid'));
            }
        };
        /**
         * @return {?}
         */
        XliffMergeParameters.prototype.allowIdChange = /**
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._allowIdChange)) ? false : this._allowIdChange;
        };
        /**
         * @return {?}
         */
        XliffMergeParameters.prototype.verbose = /**
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._verbose)) ? false : this._verbose;
        };
        /**
         * @return {?}
         */
        XliffMergeParameters.prototype.quiet = /**
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._quiet)) ? false : this._quiet;
        };
        /**
         * Debug output all parameters to commandOutput.
         */
        /**
         * Debug output all parameters to commandOutput.
         * @param {?} commandOutput
         * @return {?}
         */
        XliffMergeParameters.prototype.showAllParameters = /**
         * Debug output all parameters to commandOutput.
         * @param {?} commandOutput
         * @return {?}
         */
        function (commandOutput) {
            var e_2, _a;
            commandOutput.debug('xliffmerge Used Parameters:');
            commandOutput.debug('usedProfilePath:\t"%s"', this.usedProfilePath);
            commandOutput.debug('defaultLanguage:\t"%s"', this.defaultLanguage());
            commandOutput.debug('srcDir:\t"%s"', this.srcDir());
            commandOutput.debug('genDir:\t"%s"', this.genDir());
            commandOutput.debug('i18nBaseFile:\t"%s"', this.i18nBaseFile());
            commandOutput.debug('i18nFile:\t"%s"', this.i18nFile());
            commandOutput.debug('languages:\t%s', this.languages());
            try {
                for (var _b = __values(this.languages()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var language = _c.value;
                    commandOutput.debug('outputFile[%s]:\t%s', language, this.generatedI18nFile(language));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            commandOutput.debug('removeUnusedIds:\t%s', this.removeUnusedIds());
            commandOutput.debug('supportNgxTranslate:\t%s', this.supportNgxTranslate());
            if (this.supportNgxTranslate()) {
                commandOutput.debug('ngxTranslateExtractionPattern:\t%s', this.ngxTranslateExtractionPattern());
            }
            commandOutput.debug('useSourceAsTarget:\t%s', this.useSourceAsTarget());
            if (this.useSourceAsTarget()) {
                commandOutput.debug('targetPraefix:\t"%s"', this.targetPraefix());
                commandOutput.debug('targetSuffix:\t"%s"', this.targetSuffix());
            }
            commandOutput.debug('allowIdChange:\t%s', this.allowIdChange());
            commandOutput.debug('beautifyOutput:\t%s', this.beautifyOutput());
            commandOutput.debug('preserveOrder:\t%s', this.preserveOrder());
            commandOutput.debug('autotranslate:\t%s', this.autotranslate());
            if (this.autotranslate()) {
                commandOutput.debug('autotranslated languages:\t%s', this.autotranslatedLanguages());
                commandOutput.debug('apikey:\t%s', this.apikey() ? '****' : 'NOT SET');
                commandOutput.debug('apikeyfile:\t%s', this.apikeyfile());
            }
        };
        /**
         * Default-Language, default en.
         * @return default language
         */
        /**
         * Default-Language, default en.
         * @return {?} default language
         */
        XliffMergeParameters.prototype.defaultLanguage = /**
         * Default-Language, default en.
         * @return {?} default language
         */
        function () {
            return this._defaultLanguage ? this._defaultLanguage : 'en';
        };
        /**
         * Liste der zu bearbeitenden Sprachen.
         * @return languages
         */
        /**
         * Liste der zu bearbeitenden Sprachen.
         * @return {?} languages
         */
        XliffMergeParameters.prototype.languages = /**
         * Liste der zu bearbeitenden Sprachen.
         * @return {?} languages
         */
        function () {
            return this._languages ? this._languages : [];
        };
        /**
         * src directory, where the master xlif is located.
         * @return srcDir
         */
        /**
         * src directory, where the master xlif is located.
         * @return {?} srcDir
         */
        XliffMergeParameters.prototype.srcDir = /**
         * src directory, where the master xlif is located.
         * @return {?} srcDir
         */
        function () {
            return this._srcDir ? this._srcDir : '.';
        };
        /**
         * The base file name of the xlif file for input and output.
         * Default is messages
         * @return base file
         */
        /**
         * The base file name of the xlif file for input and output.
         * Default is messages
         * @return {?} base file
         */
        XliffMergeParameters.prototype.i18nBaseFile = /**
         * The base file name of the xlif file for input and output.
         * Default is messages
         * @return {?} base file
         */
        function () {
            return this._i18nBaseFile ? this._i18nBaseFile : 'messages';
        };
        /**
         * The master xlif file (the one generated by ng-xi18n).
         * Default is <srcDir>/<i18nBaseFile>.xlf.
         * @return master file
         */
        /**
         * The master xlif file (the one generated by ng-xi18n).
         * Default is <srcDir>/<i18nBaseFile>.xlf.
         * @return {?} master file
         */
        XliffMergeParameters.prototype.i18nFile = /**
         * The master xlif file (the one generated by ng-xi18n).
         * Default is <srcDir>/<i18nBaseFile>.xlf.
         * @return {?} master file
         */
        function () {
            return path.join(this.srcDir(), (this._i18nFile ? this._i18nFile : this.i18nBaseFile() + '.' + this.suffixForGeneratedI18nFile())).replace(/\\/g, '/');
        };
        /**
         * Format of the master xlif file.
         * Default is "xlf", possible are "xlf" or "xlf2" or "xmb".
         * @return format
         */
        /**
         * Format of the master xlif file.
         * Default is "xlf", possible are "xlf" or "xlf2" or "xmb".
         * @return {?} format
         */
        XliffMergeParameters.prototype.i18nFormat = /**
         * Format of the master xlif file.
         * Default is "xlf", possible are "xlf" or "xlf2" or "xmb".
         * @return {?} format
         */
        function () {
            return (this._i18nFormat ? this._i18nFormat : 'xlf');
        };
        /**
         * potentially to be generated I18n-File with the translations for one language.
         * @param lang language shortcut
         * @return Path of file
         */
        /**
         * potentially to be generated I18n-File with the translations for one language.
         * @param {?} lang language shortcut
         * @return {?} Path of file
         */
        XliffMergeParameters.prototype.generatedI18nFile = /**
         * potentially to be generated I18n-File with the translations for one language.
         * @param {?} lang language shortcut
         * @return {?} Path of file
         */
        function (lang) {
            return path.join(this.genDir(), this.i18nBaseFile() + '.' + lang + '.' + this.suffixForGeneratedI18nFile()).replace(/\\/g, '/');
        };
        /**
         * @private
         * @return {?}
         */
        XliffMergeParameters.prototype.suffixForGeneratedI18nFile = /**
         * @private
         * @return {?}
         */
        function () {
            switch (this.i18nFormat()) {
                case 'xlf':
                    return 'xlf';
                case 'xlf2':
                    return 'xlf';
                case 'xmb':
                    return 'xtb';
            }
        };
        /**
         * potentially to be generated translate-File for ngx-translate with the translations for one language.
         * @param lang language shortcut
         * @return Path of file
         */
        /**
         * potentially to be generated translate-File for ngx-translate with the translations for one language.
         * @param {?} lang language shortcut
         * @return {?} Path of file
         */
        XliffMergeParameters.prototype.generatedNgxTranslateFile = /**
         * potentially to be generated translate-File for ngx-translate with the translations for one language.
         * @param {?} lang language shortcut
         * @return {?} Path of file
         */
        function (lang) {
            return path.join(this.genDir(), this.i18nBaseFile() + '.' + lang + '.' + 'json').replace(/\\/g, '/');
        };
        /**
         * The encoding used to write new XLIFF-files.
         * @return encoding
         */
        /**
         * The encoding used to write new XLIFF-files.
         * @return {?} encoding
         */
        XliffMergeParameters.prototype.encoding = /**
         * The encoding used to write new XLIFF-files.
         * @return {?} encoding
         */
        function () {
            return this._encoding ? this._encoding : 'UTF-8';
        };
        /**
         * Output-Directory, where the output is written to.
         * Default is <srcDir>.
        */
        /**
         * Output-Directory, where the output is written to.
         * Default is <srcDir>.
         * @return {?}
         */
        XliffMergeParameters.prototype.genDir = /**
         * Output-Directory, where the output is written to.
         * Default is <srcDir>.
         * @return {?}
         */
        function () {
            return this._genDir ? this._genDir : this.srcDir();
        };
        /**
         * @return {?}
         */
        XliffMergeParameters.prototype.removeUnusedIds = /**
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._removeUnusedIds)) ? true : this._removeUnusedIds;
        };
        /**
         * @return {?}
         */
        XliffMergeParameters.prototype.supportNgxTranslate = /**
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._supportNgxTranslate)) ? false : this._supportNgxTranslate;
        };
        /**
         * @return {?}
         */
        XliffMergeParameters.prototype.ngxTranslateExtractionPattern = /**
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._ngxTranslateExtractionPattern)) ?
                NgxTranslateExtractor.DefaultExtractionPattern : this._ngxTranslateExtractionPattern;
        };
        /**
         * Whether source must be used as target for new trans-units
         * Default is true
         */
        /**
         * Whether source must be used as target for new trans-units
         * Default is true
         * @return {?}
         */
        XliffMergeParameters.prototype.useSourceAsTarget = /**
         * Whether source must be used as target for new trans-units
         * Default is true
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._useSourceAsTarget)) ? true : this._useSourceAsTarget;
        };
        /**
         * Praefix used for target when copying new trans-units
         * Default is ""
         */
        /**
         * Praefix used for target when copying new trans-units
         * Default is ""
         * @return {?}
         */
        XliffMergeParameters.prototype.targetPraefix = /**
         * Praefix used for target when copying new trans-units
         * Default is ""
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._targetPraefix)) ? '' : this._targetPraefix;
        };
        /**
         * Suffix used for target when copying new trans-units
         * Default is ""
         */
        /**
         * Suffix used for target when copying new trans-units
         * Default is ""
         * @return {?}
         */
        XliffMergeParameters.prototype.targetSuffix = /**
         * Suffix used for target when copying new trans-units
         * Default is ""
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._targetSuffix)) ? '' : this._targetSuffix;
        };
        /**
         * If set, run xml result through beautifier (pretty-data).
         */
        /**
         * If set, run xml result through beautifier (pretty-data).
         * @return {?}
         */
        XliffMergeParameters.prototype.beautifyOutput = /**
         * If set, run xml result through beautifier (pretty-data).
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._beautifyOutput)) ? false : this._beautifyOutput;
        };
        /**
         * If set, order of new trans units will be as in master.
         * Otherwise they are added at the end.
         */
        /**
         * If set, order of new trans units will be as in master.
         * Otherwise they are added at the end.
         * @return {?}
         */
        XliffMergeParameters.prototype.preserveOrder = /**
         * If set, order of new trans units will be as in master.
         * Otherwise they are added at the end.
         * @return {?}
         */
        function () {
            return (isNullOrUndefined(this._preserveOrder)) ? true : this._preserveOrder;
        };
        /**
         * Whether to use autotranslate for new trans-units
         * Default is false
         */
        /**
         * Whether to use autotranslate for new trans-units
         * Default is false
         * @return {?}
         */
        XliffMergeParameters.prototype.autotranslate = /**
         * Whether to use autotranslate for new trans-units
         * Default is false
         * @return {?}
         */
        function () {
            if (isNullOrUndefined(this._autotranslate)) {
                return false;
            }
            if (isArray(this._autotranslate)) {
                return ((/** @type {?} */ (this._autotranslate))).length > 0;
            }
            return (/** @type {?} */ (this._autotranslate));
        };
        /**
         * Whether to use autotranslate for a given language.
         * @param lang language code.
         */
        /**
         * Whether to use autotranslate for a given language.
         * @param {?} lang language code.
         * @return {?}
         */
        XliffMergeParameters.prototype.autotranslateLanguage = /**
         * Whether to use autotranslate for a given language.
         * @param {?} lang language code.
         * @return {?}
         */
        function (lang) {
            return this.autotranslatedLanguages().indexOf(lang) >= 0;
        };
        /**
         * Return a list of languages to be autotranslated.
         */
        /**
         * Return a list of languages to be autotranslated.
         * @return {?}
         */
        XliffMergeParameters.prototype.autotranslatedLanguages = /**
         * Return a list of languages to be autotranslated.
         * @return {?}
         */
        function () {
            if (isNullOrUndefined(this._autotranslate) || this._autotranslate === false) {
                return [];
            }
            if (isArray(this._autotranslate)) {
                return ((/** @type {?} */ (this._autotranslate)));
            }
            return this.languages().slice(1); // first is source language
        };
        /**
         * API key to be used for Google Translate
         * @return api key
         */
        /**
         * API key to be used for Google Translate
         * @return {?} api key
         */
        XliffMergeParameters.prototype.apikey = /**
         * API key to be used for Google Translate
         * @return {?} api key
         */
        function () {
            if (!isNullOrUndefined(this._apikey)) {
                return this._apikey;
            }
            else {
                /** @type {?} */
                var apikeyPath = this.apikeyfile();
                if (this.apikeyfile()) {
                    if (fs.existsSync(apikeyPath)) {
                        return FileUtil.read(apikeyPath, 'utf-8');
                    }
                    else {
                        throw new Error(util.format('api key file not found: API_KEY_FILE=%s', apikeyPath));
                    }
                }
                else {
                    return null;
                }
            }
        };
        /**
         * file name for API key to be used for Google Translate.
         * Explicitly set or read from env var API_KEY_FILE.
         * @return file of api key
         */
        /**
         * file name for API key to be used for Google Translate.
         * Explicitly set or read from env var API_KEY_FILE.
         * @return {?} file of api key
         */
        XliffMergeParameters.prototype.apikeyfile = /**
         * file name for API key to be used for Google Translate.
         * Explicitly set or read from env var API_KEY_FILE.
         * @return {?} file of api key
         */
        function () {
            if (this._apikeyfile) {
                return this._apikeyfile;
            }
            else if (process.env.API_KEY_FILE) {
                return process.env.API_KEY_FILE;
            }
            else {
                return null;
            }
        };
        return XliffMergeParameters;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var pkg = null;
    try {
        pkg = require(path.resolve(__dirname, '..', 'package.json'));
    }
    catch (e) {
        try {
            pkg = require(path.resolve(__dirname, '..', '..', 'package.json'));
        }
        catch (e) {
            pkg = null;
        }
    }
    /** @type {?} */
    var VERSION = (pkg ? pkg.version : 'unknown');

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Created by martin on 10.03.2017.
     * Helper class to read XMl with a correct encoding.
     */
    var XmlReader = /** @class */ (function () {
        function XmlReader() {
        }
        /**
         * Read an xml-File.
         * @param path Path to file
         * @param encoding optional encoding of the xml.
         * This is read from the file, but if you know it before, you can avoid reading the file twice.
         * @return file content and encoding found in the file.
         */
        /**
         * Read an xml-File.
         * @param {?} path Path to file
         * @param {?=} encoding optional encoding of the xml.
         * This is read from the file, but if you know it before, you can avoid reading the file twice.
         * @return {?} file content and encoding found in the file.
         */
        XmlReader.readXmlFileContent = /**
         * Read an xml-File.
         * @param {?} path Path to file
         * @param {?=} encoding optional encoding of the xml.
         * This is read from the file, but if you know it before, you can avoid reading the file twice.
         * @return {?} file content and encoding found in the file.
         */
        function (path, encoding) {
            if (!encoding) {
                encoding = XmlReader.DEFAULT_ENCODING;
            }
            /** @type {?} */
            var content = FileUtil.read(path, encoding);
            /** @type {?} */
            var foundEncoding = XmlReader.encodingFromXml(content);
            if (foundEncoding !== encoding) {
                // read again with the correct encoding
                content = FileUtil.read(path, foundEncoding);
            }
            return {
                content: content,
                encoding: foundEncoding
            };
        };
        /**
         * Read the encoding from the xml.
         * xml File starts with .. encoding=".."
         * @param xmlString xmlString
         * @return encoding
         */
        /**
         * Read the encoding from the xml.
         * xml File starts with .. encoding=".."
         * @private
         * @param {?} xmlString xmlString
         * @return {?} encoding
         */
        XmlReader.encodingFromXml = /**
         * Read the encoding from the xml.
         * xml File starts with .. encoding=".."
         * @private
         * @param {?} xmlString xmlString
         * @return {?} encoding
         */
        function (xmlString) {
            /** @type {?} */
            var index = xmlString.indexOf('encoding="');
            if (index < 0) {
                return this.DEFAULT_ENCODING; // default in xml if not explicitly set
            }
            /** @type {?} */
            var endIndex = xmlString.indexOf('"', index + 10);
            return xmlString.substring(index + 10, endIndex);
        };
        XmlReader.DEFAULT_ENCODING = 'UTF-8';
        return XmlReader;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Helper class to read translation files depending on format.
     */
    var /**
     * Helper class to read translation files depending on format.
     */
    TranslationMessagesFileReader = /** @class */ (function () {
        function TranslationMessagesFileReader() {
        }
        /**
         * Read file function, result depends on format, either XliffFile or XmbFile.
         * @param i18nFormat format
         * @param path path
         * @param encoding encoding
         * @param optionalMasterFilePath optionalMasterFilePath
         * @return XliffFile
         */
        /**
         * Read file function, result depends on format, either XliffFile or XmbFile.
         * @param {?} i18nFormat format
         * @param {?} path path
         * @param {?} encoding encoding
         * @param {?=} optionalMasterFilePath optionalMasterFilePath
         * @return {?} XliffFile
         */
        TranslationMessagesFileReader.fromFile = /**
         * Read file function, result depends on format, either XliffFile or XmbFile.
         * @param {?} i18nFormat format
         * @param {?} path path
         * @param {?} encoding encoding
         * @param {?=} optionalMasterFilePath optionalMasterFilePath
         * @return {?} XliffFile
         */
        function (i18nFormat, path, encoding, optionalMasterFilePath) {
            /** @type {?} */
            var xmlContent = XmlReader.readXmlFileContent(path, encoding);
            /** @type {?} */
            var optionalMaster = TranslationMessagesFileReader.masterFileContent(optionalMasterFilePath, encoding);
            return ngxI18nsupportLib.TranslationMessagesFileFactory.fromFileContent(i18nFormat, xmlContent.content, path, xmlContent.encoding, optionalMaster);
        };
        /**
         * Read file function, result depends on format, either XliffFile or XmbFile.
         * @param path path
         * @param encoding encoding
         * @param optionalMasterFilePath optionalMasterFilePath
         * @return XliffFile
         */
        /**
         * Read file function, result depends on format, either XliffFile or XmbFile.
         * @param {?} path path
         * @param {?} encoding encoding
         * @param {?=} optionalMasterFilePath optionalMasterFilePath
         * @return {?} XliffFile
         */
        TranslationMessagesFileReader.fromUnknownFormatFile = /**
         * Read file function, result depends on format, either XliffFile or XmbFile.
         * @param {?} path path
         * @param {?} encoding encoding
         * @param {?=} optionalMasterFilePath optionalMasterFilePath
         * @return {?} XliffFile
         */
        function (path, encoding, optionalMasterFilePath) {
            /** @type {?} */
            var xmlContent = XmlReader.readXmlFileContent(path, encoding);
            /** @type {?} */
            var optionalMaster = TranslationMessagesFileReader.masterFileContent(optionalMasterFilePath, encoding);
            return ngxI18nsupportLib.TranslationMessagesFileFactory.fromUnknownFormatFileContent(xmlContent.content, path, xmlContent.encoding, optionalMaster);
        };
        /**
         * Read master xmb file
         * @param optionalMasterFilePath optionalMasterFilePath
         * @param encoding encoding
         * @return content and encoding of file
         */
        /**
         * Read master xmb file
         * @private
         * @param {?} optionalMasterFilePath optionalMasterFilePath
         * @param {?} encoding encoding
         * @return {?} content and encoding of file
         */
        TranslationMessagesFileReader.masterFileContent = /**
         * Read master xmb file
         * @private
         * @param {?} optionalMasterFilePath optionalMasterFilePath
         * @param {?} encoding encoding
         * @return {?} content and encoding of file
         */
        function (optionalMasterFilePath, encoding) {
            if (optionalMasterFilePath) {
                /** @type {?} */
                var masterXmlContent = XmlReader.readXmlFileContent(optionalMasterFilePath, encoding);
                return {
                    xmlContent: masterXmlContent.content,
                    path: optionalMasterFilePath,
                    encoding: masterXmlContent.encoding
                };
            }
            else {
                return null;
            }
        };
        /**
         * Save edited file.
         * @param messagesFile messagesFile
         * @param beautifyOutput Flag whether to use pretty-data to format the output.
         * XMLSerializer produces some correct but strangely formatted output, which pretty-data can correct.
         * See issue #64 for details.
         * Default is false.
         */
        /**
         * Save edited file.
         * @param {?} messagesFile messagesFile
         * @param {?=} beautifyOutput Flag whether to use pretty-data to format the output.
         * XMLSerializer produces some correct but strangely formatted output, which pretty-data can correct.
         * See issue #64 for details.
         * Default is false.
         * @return {?}
         */
        TranslationMessagesFileReader.save = /**
         * Save edited file.
         * @param {?} messagesFile messagesFile
         * @param {?=} beautifyOutput Flag whether to use pretty-data to format the output.
         * XMLSerializer produces some correct but strangely formatted output, which pretty-data can correct.
         * See issue #64 for details.
         * Default is false.
         * @return {?}
         */
        function (messagesFile, beautifyOutput) {
            FileUtil.replaceContent(messagesFile.filename(), messagesFile.editedContent(beautifyOutput), messagesFile.encoding());
        };
        return TranslationMessagesFileReader;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var MAX_SEGMENTS = 128;
    var AutoTranslateService = /** @class */ (function () {
        function AutoTranslateService(apiKey) {
            this._request = request;
            this._apiKey = apiKey;
            this._rootUrl = 'https://translation.googleapis.com/';
        }
        /**
         * Strip region code and convert to lower
         * @param lang lang
         * @return lang without region code and in lower case.
         */
        /**
         * Strip region code and convert to lower
         * @param {?} lang lang
         * @return {?} lang without region code and in lower case.
         */
        AutoTranslateService.stripRegioncode = /**
         * Strip region code and convert to lower
         * @param {?} lang lang
         * @return {?} lang without region code and in lower case.
         */
        function (lang) {
            /** @type {?} */
            var langLower = lang.toLowerCase();
            for (var i = 0; i < langLower.length; i++) {
                /** @type {?} */
                var c = langLower.charAt(i);
                if (c < 'a' || c > 'z') {
                    return langLower.substring(0, i);
                }
            }
            return langLower;
        };
        /**
         * Change API key (just for tests).
         * @param apikey apikey
         */
        /**
         * Change API key (just for tests).
         * @param {?} apikey apikey
         * @return {?}
         */
        AutoTranslateService.prototype.setApiKey = /**
         * Change API key (just for tests).
         * @param {?} apikey apikey
         * @return {?}
         */
        function (apikey) {
            this._apiKey = apikey;
        };
        /**
         * Translate an array of messages at once.
         * @param messages the messages to be translated
         * @param from source language code
         * @param to target language code
         * @return Observable with translated messages or error
         */
        /**
         * Translate an array of messages at once.
         * @param {?} messages the messages to be translated
         * @param {?} from source language code
         * @param {?} to target language code
         * @return {?} Observable with translated messages or error
         */
        AutoTranslateService.prototype.translateMultipleStrings = /**
         * Translate an array of messages at once.
         * @param {?} messages the messages to be translated
         * @param {?} from source language code
         * @param {?} to target language code
         * @return {?} Observable with translated messages or error
         */
        function (messages, from, to) {
            var _this = this;
            // empty array needs no translation and always works ... (#78)
            if (messages.length === 0) {
                return rxjs.of([]);
            }
            if (!this._apiKey) {
                return rxjs.throwError('cannot autotranslate: no api key');
            }
            if (!from || !to) {
                return rxjs.throwError('cannot autotranslate: source and target language must be set');
            }
            from = AutoTranslateService.stripRegioncode(from);
            to = AutoTranslateService.stripRegioncode(to);
            /** @type {?} */
            var allRequests = this.splitMessagesToGoogleLimit(messages).map((/**
             * @param {?} partialMessages
             * @return {?}
             */
            function (partialMessages) {
                return _this.limitedTranslateMultipleStrings(partialMessages, from, to);
            }));
            return rxjs.forkJoin(allRequests).pipe(operators.map((/**
             * @param {?} allTranslations
             * @return {?}
             */
            function (allTranslations) {
                /** @type {?} */
                var all = [];
                for (var i = 0; i < allTranslations.length; i++) {
                    all = all.concat(allTranslations[i]);
                }
                return all;
            })));
        };
        /**
         * @private
         * @param {?} messages
         * @return {?}
         */
        AutoTranslateService.prototype.splitMessagesToGoogleLimit = /**
         * @private
         * @param {?} messages
         * @return {?}
         */
        function (messages) {
            if (messages.length <= MAX_SEGMENTS) {
                return [messages];
            }
            /** @type {?} */
            var result = [];
            /** @type {?} */
            var currentPackage = [];
            /** @type {?} */
            var packageSize = 0;
            for (var i = 0; i < messages.length; i++) {
                currentPackage.push(messages[i]);
                packageSize++;
                if (packageSize >= MAX_SEGMENTS) {
                    result.push(currentPackage);
                    currentPackage = [];
                    packageSize = 0;
                }
            }
            if (currentPackage.length > 0) {
                result.push(currentPackage);
            }
            return result;
        };
        /**
         * Return translation request, but messages must be limited to google limits.
         * Not more that 128 single messages.
         * @param messages messages
         * @param from from
         * @param to to
         * @return the translated strings
         */
        /**
         * Return translation request, but messages must be limited to google limits.
         * Not more that 128 single messages.
         * @private
         * @param {?} messages messages
         * @param {?} from from
         * @param {?} to to
         * @return {?} the translated strings
         */
        AutoTranslateService.prototype.limitedTranslateMultipleStrings = /**
         * Return translation request, but messages must be limited to google limits.
         * Not more that 128 single messages.
         * @private
         * @param {?} messages messages
         * @param {?} from from
         * @param {?} to to
         * @return {?} the translated strings
         */
        function (messages, from, to) {
            /** @type {?} */
            var realUrl = this._rootUrl + 'language/translate/v2' + '?key=' + this._apiKey;
            /** @type {?} */
            var translateRequest = {
                q: messages,
                target: to,
                source: from,
            };
            /** @type {?} */
            var options = {
                url: realUrl,
                body: translateRequest,
                json: true,
            };
            return this.post(realUrl, options).pipe(operators.map((/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                /** @type {?} */
                var body = data.body;
                if (!body) {
                    throw new Error('no result received');
                }
                if (body.error) {
                    if (body.error.code === 400) {
                        if (body.error.message === 'Invalid Value') {
                            throw new Error(util.format('Translation from "%s" to "%s" not supported', from, to));
                        }
                        throw new Error(util.format('Invalid request: %s', body.error.message));
                    }
                    else {
                        throw new Error(util.format('Error %s: %s', body.error.code, body.error.message));
                    }
                }
                /** @type {?} */
                var result = body.data;
                return result.translations.map((/**
                 * @param {?} translation
                 * @return {?}
                 */
                function (translation) {
                    return translation.translatedText;
                }));
            })));
        };
        /**
         * Function to do a POST HTTP request
         *
         * @param uri uri
         * @param options options
         *
         * @return response
         */
        /**
         * Function to do a POST HTTP request
         *
         * @param {?} uri uri
         * @param {?=} options options
         *
         * @return {?} response
         */
        AutoTranslateService.prototype.post = /**
         * Function to do a POST HTTP request
         *
         * @param {?} uri uri
         * @param {?=} options options
         *
         * @return {?} response
         */
        function (uri, options) {
            return (/** @type {?} */ (this._call.apply(this, [].concat('post', (/** @type {?} */ (uri)), (/** @type {?} */ (Object.assign({}, options || {})))))));
        };
        /**
         * Function to do a HTTP request for given method
         *
         * @param method method
         * @param uri uri
         * @param options options
         *
         * @return response
         *
         */
        /**
         * Function to do a HTTP request for given method
         *
         * @private
         * @param {?} method method
         * @param {?} uri uri
         * @param {?=} options options
         *
         * @return {?} response
         *
         */
        AutoTranslateService.prototype._call = /**
         * Function to do a HTTP request for given method
         *
         * @private
         * @param {?} method method
         * @param {?} uri uri
         * @param {?=} options options
         *
         * @return {?} response
         *
         */
        function (method, uri, options) {
            var _this = this;
            return (/** @type {?} */ (rxjs.Observable.create((/**
             * @param {?} observer
             * @return {?}
             */
            function (observer) {
                // build params array
                /** @type {?} */
                var params = [].concat((/** @type {?} */ (uri)), (/** @type {?} */ (Object.assign({}, options || {}))), (/**
                 * @template RequestCallback
                 * @param {?} error
                 * @param {?} response
                 * @param {?} body
                 * @return {?}
                 */
                function (error, response, body) {
                    if (error) {
                        return observer.error(error);
                    }
                    observer.next((/** @type {?} */ (Object.assign({}, {
                        response: (/** @type {?} */ (response)),
                        body: (/** @type {?} */ (body))
                    }))));
                    observer.complete();
                }));
                // _call request method
                try {
                    _this._request[(/** @type {?} */ (method))].apply((/** @type {?} */ (_this._request)), params);
                }
                catch (error) {
                    observer.error(error);
                }
            }))));
        };
        return AutoTranslateService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Created by martin on 29.06.2017.
     */
    var AutoTranslateResult = /** @class */ (function () {
        function AutoTranslateResult(_success, _details) {
            this._success = _success;
            this._details = _details;
        }
        /**
         * @return {?}
         */
        AutoTranslateResult.prototype.success = /**
         * @return {?}
         */
        function () {
            return this._success;
        };
        return AutoTranslateResult;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * A report about a run of Google Translate over all untranslated unit.
     * * Created by martin on 29.06.2017.
     */
    var /**
     * A report about a run of Google Translate over all untranslated unit.
     * * Created by martin on 29.06.2017.
     */
    AutoTranslateSummaryReport = /** @class */ (function () {
        function AutoTranslateSummaryReport(from, to) {
            this._from = from;
            this._to = to;
            this._total = 0;
            this._ignored = 0;
            this._success = 0;
            this._failed = 0;
        }
        /**
         * Set error if total call failed (e.g. "invalid api key" or "no connection" ...)
         * @param error error
         * @param total total
         */
        /**
         * Set error if total call failed (e.g. "invalid api key" or "no connection" ...)
         * @param {?} error error
         * @param {?} total total
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.setError = /**
         * Set error if total call failed (e.g. "invalid api key" or "no connection" ...)
         * @param {?} error error
         * @param {?} total total
         * @return {?}
         */
        function (error, total) {
            this._error = error;
            this._total = total;
            this._failed = total;
        };
        /**
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.error = /**
         * @return {?}
         */
        function () {
            return this._error;
        };
        /**
         * @param {?} ignored
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.setIgnored = /**
         * @param {?} ignored
         * @return {?}
         */
        function (ignored) {
            this._total += ignored;
            this._ignored = ignored;
        };
        /**
         * Add a single result to the summary.
         * @param tu tu
         * @param result result
         */
        /**
         * Add a single result to the summary.
         * @param {?} tu tu
         * @param {?} result result
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.addSingleResult = /**
         * Add a single result to the summary.
         * @param {?} tu tu
         * @param {?} result result
         * @return {?}
         */
        function (tu, result) {
            this._total++;
            if (result.success()) {
                this._success++;
            }
            else {
                this._failed++;
            }
        };
        /**
         * Merge another summary into this one.
         * @param anotherSummary anotherSummary
         */
        /**
         * Merge another summary into this one.
         * @param {?} anotherSummary anotherSummary
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.merge = /**
         * Merge another summary into this one.
         * @param {?} anotherSummary anotherSummary
         * @return {?}
         */
        function (anotherSummary) {
            if (!this._error) {
                this._error = anotherSummary._error;
            }
            this._total += anotherSummary.total();
            this._ignored += anotherSummary.ignored();
            this._success += anotherSummary.success();
            this._failed += anotherSummary.failed();
        };
        /**
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.total = /**
         * @return {?}
         */
        function () {
            return this._total;
        };
        /**
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.ignored = /**
         * @return {?}
         */
        function () {
            return this._ignored;
        };
        /**
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.success = /**
         * @return {?}
         */
        function () {
            return this._success;
        };
        /**
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.failed = /**
         * @return {?}
         */
        function () {
            return this._failed;
        };
        /**
         * Human readable version of report
         */
        /**
         * Human readable version of report
         * @return {?}
         */
        AutoTranslateSummaryReport.prototype.content = /**
         * Human readable version of report
         * @return {?}
         */
        function () {
            /** @type {?} */
            var result;
            if (this._error) {
                result = util.format('Auto translation from "%s" to "%s" failed: "%s", failed units: %s', this._from, this._to, this._error, this._failed);
            }
            else {
                result = util.format('Auto translation from "%s" to "%s", total auto translated units: %s, ignored: %s, succesful: %s, failed: %s', this._from, this._to, this._total, this._ignored, this._success, this._failed);
            }
            return result;
        };
        return AutoTranslateSummaryReport;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Created by martin on 07.07.2017.
     * Service to autotranslate Transunits via Google Translate.
     */
    var /**
     * Created by martin on 07.07.2017.
     * Service to autotranslate Transunits via Google Translate.
     */
    XliffMergeAutoTranslateService = /** @class */ (function () {
        function XliffMergeAutoTranslateService(apikey) {
            this.autoTranslateService = new AutoTranslateService(apikey);
        }
        /**
         * Auto translate file via Google Translate.
         * Will translate all new units in file.
         * @param from from
         * @param to to
         * @param languageSpecificMessagesFile languageSpecificMessagesFile
         * @return a promise with the execution result as a summary report.
         */
        /**
         * Auto translate file via Google Translate.
         * Will translate all new units in file.
         * @param {?} from from
         * @param {?} to to
         * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
         * @return {?} a promise with the execution result as a summary report.
         */
        XliffMergeAutoTranslateService.prototype.autoTranslate = /**
         * Auto translate file via Google Translate.
         * Will translate all new units in file.
         * @param {?} from from
         * @param {?} to to
         * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
         * @return {?} a promise with the execution result as a summary report.
         */
        function (from, to, languageSpecificMessagesFile) {
            return rxjs.forkJoin(__spread([
                this.doAutoTranslateNonICUMessages(from, to, languageSpecificMessagesFile)
            ], this.doAutoTranslateICUMessages(from, to, languageSpecificMessagesFile)))
                .pipe(operators.map((/**
             * @param {?} summaries
             * @return {?}
             */
            function (summaries) {
                /** @type {?} */
                var summary = summaries[0];
                for (var i = 1; i < summaries.length; i++) {
                    summary.merge(summaries[i]);
                }
                return summary;
            })));
        };
        /**
         * Collect all units that are untranslated.
         * @param languageSpecificMessagesFile languageSpecificMessagesFile
         * @return all untranslated units
         */
        /**
         * Collect all units that are untranslated.
         * @private
         * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
         * @return {?} all untranslated units
         */
        XliffMergeAutoTranslateService.prototype.allUntranslatedTUs = /**
         * Collect all units that are untranslated.
         * @private
         * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
         * @return {?} all untranslated units
         */
        function (languageSpecificMessagesFile) {
            // collect all units, that should be auto translated
            /** @type {?} */
            var allUntranslated = [];
            languageSpecificMessagesFile.forEachTransUnit((/**
             * @param {?} tu
             * @return {?}
             */
            function (tu) {
                if (tu.targetState() === ngxI18nsupportLib.STATE_NEW) {
                    allUntranslated.push(tu);
                }
            }));
            return allUntranslated;
        };
        /**
         * @private
         * @param {?} from
         * @param {?} to
         * @param {?} languageSpecificMessagesFile
         * @return {?}
         */
        XliffMergeAutoTranslateService.prototype.doAutoTranslateNonICUMessages = /**
         * @private
         * @param {?} from
         * @param {?} to
         * @param {?} languageSpecificMessagesFile
         * @return {?}
         */
        function (from, to, languageSpecificMessagesFile) {
            var _this = this;
            /** @type {?} */
            var allUntranslated = this.allUntranslatedTUs(languageSpecificMessagesFile);
            /** @type {?} */
            var allTranslatable = allUntranslated.filter((/**
             * @param {?} tu
             * @return {?}
             */
            function (tu) { return isNullOrUndefined(tu.sourceContentNormalized().getICUMessage()); }));
            /** @type {?} */
            var allMessages = allTranslatable.map((/**
             * @param {?} tu
             * @return {?}
             */
            function (tu) {
                return tu.sourceContentNormalized().asDisplayString();
            }));
            return this.autoTranslateService.translateMultipleStrings(allMessages, from, to)
                .pipe(
            // #94 google translate might return &#.. entity refs, that must be decoded
            operators.map((/**
             * @param {?} translations
             * @return {?}
             */
            function (translations) { return translations.map((/**
             * @param {?} encodedTranslation
             * @return {?}
             */
            function (encodedTranslation) { return he.decode(encodedTranslation); })); })), operators.map((/**
             * @param {?} translations
             * @return {?}
             */
            function (translations) {
                /** @type {?} */
                var summary = new AutoTranslateSummaryReport(from, to);
                summary.setIgnored(allUntranslated.length - allTranslatable.length);
                for (var i = 0; i < translations.length; i++) {
                    /** @type {?} */
                    var tu = allTranslatable[i];
                    /** @type {?} */
                    var translationText = translations[i];
                    /** @type {?} */
                    var result = _this.autoTranslateNonICUUnit(tu, translationText);
                    summary.addSingleResult(tu, result);
                }
                return summary;
            })), operators.catchError((/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                /** @type {?} */
                var failSummary = new AutoTranslateSummaryReport(from, to);
                failSummary.setError(err.message, allMessages.length);
                return rxjs.of(failSummary);
            })));
        };
        /**
         * @private
         * @param {?} from
         * @param {?} to
         * @param {?} languageSpecificMessagesFile
         * @return {?}
         */
        XliffMergeAutoTranslateService.prototype.doAutoTranslateICUMessages = /**
         * @private
         * @param {?} from
         * @param {?} to
         * @param {?} languageSpecificMessagesFile
         * @return {?}
         */
        function (from, to, languageSpecificMessagesFile) {
            var _this = this;
            /** @type {?} */
            var allUntranslated = this.allUntranslatedTUs(languageSpecificMessagesFile);
            /** @type {?} */
            var allTranslatableICU = allUntranslated.filter((/**
             * @param {?} tu
             * @return {?}
             */
            function (tu) { return !isNullOrUndefined(tu.sourceContentNormalized().getICUMessage()); }));
            return allTranslatableICU.map((/**
             * @param {?} tu
             * @return {?}
             */
            function (tu) {
                return _this.doAutoTranslateICUMessage(from, to, tu);
            }));
        };
        /**
         * Translate single ICU Messages.
         * @param from from
         * @param to to
         * @param tu transunit to translate (must contain ICU Message)
         * @return summary report
         */
        /**
         * Translate single ICU Messages.
         * @private
         * @param {?} from from
         * @param {?} to to
         * @param {?} tu transunit to translate (must contain ICU Message)
         * @return {?} summary report
         */
        XliffMergeAutoTranslateService.prototype.doAutoTranslateICUMessage = /**
         * Translate single ICU Messages.
         * @private
         * @param {?} from from
         * @param {?} to to
         * @param {?} tu transunit to translate (must contain ICU Message)
         * @return {?} summary report
         */
        function (from, to, tu) {
            var _this = this;
            /** @type {?} */
            var icuMessage = tu.sourceContentNormalized().getICUMessage();
            /** @type {?} */
            var categories = icuMessage.getCategories();
            // check for nested ICUs, we do not support that
            if (categories.find((/**
             * @param {?} category
             * @return {?}
             */
            function (category) { return !isNullOrUndefined(category.getMessageNormalized().getICUMessage()); }))) {
                /** @type {?} */
                var summary = new AutoTranslateSummaryReport(from, to);
                summary.setIgnored(1);
                return rxjs.of(summary);
            }
            /** @type {?} */
            var allMessages = categories.map((/**
             * @param {?} category
             * @return {?}
             */
            function (category) { return category.getMessageNormalized().asDisplayString(); }));
            return this.autoTranslateService.translateMultipleStrings(allMessages, from, to)
                .pipe(
            // #94 google translate might return &#.. entity refs, that must be decoded
            operators.map((/**
             * @param {?} translations
             * @return {?}
             */
            function (translations) { return translations.map((/**
             * @param {?} encodedTranslation
             * @return {?}
             */
            function (encodedTranslation) { return he.decode(encodedTranslation); })); })), operators.map((/**
             * @param {?} translations
             * @return {?}
             */
            function (translations) {
                /** @type {?} */
                var summary = new AutoTranslateSummaryReport(from, to);
                /** @type {?} */
                var icuTranslation = {};
                for (var i = 0; i < translations.length; i++) {
                    icuTranslation[categories[i].getCategory()] = translations[i];
                }
                /** @type {?} */
                var result = _this.autoTranslateICUUnit(tu, icuTranslation);
                summary.addSingleResult(tu, result);
                return summary;
            })), operators.catchError((/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                /** @type {?} */
                var failSummary = new AutoTranslateSummaryReport(from, to);
                failSummary.setError(err.message, allMessages.length);
                return rxjs.of(failSummary);
            })));
        };
        /**
         * @private
         * @param {?} tu
         * @param {?} translatedMessage
         * @return {?}
         */
        XliffMergeAutoTranslateService.prototype.autoTranslateNonICUUnit = /**
         * @private
         * @param {?} tu
         * @param {?} translatedMessage
         * @return {?}
         */
        function (tu, translatedMessage) {
            return this.autoTranslateUnit(tu, tu.sourceContentNormalized().translate(translatedMessage));
        };
        /**
         * @private
         * @param {?} tu
         * @param {?} translation
         * @return {?}
         */
        XliffMergeAutoTranslateService.prototype.autoTranslateICUUnit = /**
         * @private
         * @param {?} tu
         * @param {?} translation
         * @return {?}
         */
        function (tu, translation) {
            return this.autoTranslateUnit(tu, tu.sourceContentNormalized().translateICUMessage(translation));
        };
        /**
         * @private
         * @param {?} tu
         * @param {?} translatedMessage
         * @return {?}
         */
        XliffMergeAutoTranslateService.prototype.autoTranslateUnit = /**
         * @private
         * @param {?} tu
         * @param {?} translatedMessage
         * @return {?}
         */
        function (tu, translatedMessage) {
            /** @type {?} */
            var errors = translatedMessage.validate();
            /** @type {?} */
            var warnings = translatedMessage.validateWarnings();
            if (!isNullOrUndefined(errors)) {
                return new AutoTranslateResult(false, 'errors detected, not translated');
            }
            else if (!isNullOrUndefined(warnings)) {
                return new AutoTranslateResult(false, 'warnings detected, not translated');
            }
            else {
                tu.translate(translatedMessage);
                return new AutoTranslateResult(true, null); // success
            }
        };
        return XliffMergeAutoTranslateService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Created by martin on 17.02.2017.
     * XliffMerge - read xliff or xmb file and put untranslated parts in language specific xliff or xmb files.
     *
     */
    var   /**
     * Created by martin on 17.02.2017.
     * XliffMerge - read xliff or xmb file and put untranslated parts in language specific xliff or xmb files.
     *
     */
    XliffMerge = /** @class */ (function () {
        function XliffMerge(commandOutput, options) {
            this.commandOutput = commandOutput;
            this.options = options;
            this.parameters = null;
        }
        /**
         * @param {?} argv
         * @return {?}
         */
        XliffMerge.main = /**
         * @param {?} argv
         * @return {?}
         */
        function (argv) {
            /** @type {?} */
            var options = XliffMerge.parseArgs(argv);
            if (options) {
                new XliffMerge(new CommandOutput(process.stdout), options).run((/**
                 * @param {?} result
                 * @return {?}
                 */
                function (result) {
                    process.exit(result);
                }));
            }
        };
        /**
         * @param {?} argv
         * @return {?}
         */
        XliffMerge.parseArgs = /**
         * @param {?} argv
         * @return {?}
         */
        function (argv) {
            /** @type {?} */
            var options = {
                languages: []
            };
            for (var i = 2; i < argv.length; i++) {
                /** @type {?} */
                var arg = argv[i];
                if (arg === '--version' || arg === '-version') {
                    console.log('xliffmerge ' + VERSION);
                }
                else if (arg === '--verbose' || arg === '-v') {
                    options.verbose = true;
                }
                else if (arg === '--profile' || arg === '-p') {
                    i++;
                    if (i >= argv.length) {
                        console.log('missing config file');
                        XliffMerge.showUsage();
                        return null;
                    }
                    else {
                        options.profilePath = argv[i];
                    }
                }
                else if (arg === '--quiet' || arg === '-q') {
                    options.quiet = true;
                }
                else if (arg === '--help' || arg === '-help' || arg === '-h') {
                    XliffMerge.showUsage();
                }
                else if (arg.length > 0 && arg.charAt(0) === '-') {
                    console.log('unknown option');
                    return null;
                }
                else {
                    options.languages.push(arg);
                }
            }
            return options;
        };
        /**
         * @return {?}
         */
        XliffMerge.showUsage = /**
         * @return {?}
         */
        function () {
            console.log('usage: xliffmerge <option>* <language>*');
            console.log('Options');
            console.log('\t-p|--profile a json configuration file containing all relevant parameters.');
            console.log('\t\tfor details please consult the home page https://github.com/martinroob/ngx-i18nsupport');
            console.log('\t-v|--verbose show some output for debugging purposes');
            console.log('\t-q|--quiet only show errors, nothing else');
            console.log('\t-version|--version show version string');
            console.log('');
            console.log('\t<language> has to be a valid language short string, e,g. "en", "de", "de-ch"');
        };
        /**
         * For Tests, create instance with given profile
         * @param commandOutput commandOutput
         * @param options options
         * @param profileContent profileContent
         */
        /**
         * For Tests, create instance with given profile
         * @param {?} commandOutput commandOutput
         * @param {?} options options
         * @param {?=} profileContent profileContent
         * @return {?}
         */
        XliffMerge.createFromOptions = /**
         * For Tests, create instance with given profile
         * @param {?} commandOutput commandOutput
         * @param {?} options options
         * @param {?=} profileContent profileContent
         * @return {?}
         */
        function (commandOutput, options, profileContent) {
            /** @type {?} */
            var instance = new XliffMerge(commandOutput, options);
            instance.parameters = XliffMergeParameters.createFromOptions(options, profileContent);
            return instance;
        };
        /**
         * Run the command.
         * This runs async.
         * @param callbackFunction when command is executed, called with the return code (0 for ok), if given.
         * @param errorFunction callbackFunction for error handling
         */
        /**
         * Run the command.
         * This runs async.
         * @param {?=} callbackFunction when command is executed, called with the return code (0 for ok), if given.
         * @param {?=} errorFunction callbackFunction for error handling
         * @return {?}
         */
        XliffMerge.prototype.run = /**
         * Run the command.
         * This runs async.
         * @param {?=} callbackFunction when command is executed, called with the return code (0 for ok), if given.
         * @param {?=} errorFunction callbackFunction for error handling
         * @return {?}
         */
        function (callbackFunction, errorFunction) {
            this.runAsync()
                .subscribe((/**
             * @param {?} retcode
             * @return {?}
             */
            function (retcode) {
                if (!isNullOrUndefined(callbackFunction)) {
                    callbackFunction(retcode);
                }
            }), (/**
             * @param {?} error
             * @return {?}
             */
            function (error) {
                if (!isNullOrUndefined(errorFunction)) {
                    errorFunction(error);
                }
            }));
        };
        /**
         * Execute merge-Process.
         * @return Async operation, on completion returns retcode 0=ok, other = error.
         */
        /**
         * Execute merge-Process.
         * @return {?} Async operation, on completion returns retcode 0=ok, other = error.
         */
        XliffMerge.prototype.runAsync = /**
         * Execute merge-Process.
         * @return {?} Async operation, on completion returns retcode 0=ok, other = error.
         */
        function () {
            var _this = this;
            var e_1, _a, e_2, _b;
            if (this.options && this.options.quiet) {
                this.commandOutput.setQuiet();
            }
            if (this.options && this.options.verbose) {
                this.commandOutput.setVerbose();
            }
            if (!this.parameters) {
                this.parameters = XliffMergeParameters.createFromOptions(this.options);
            }
            this.commandOutput.info('xliffmerge version %s', VERSION);
            if (this.parameters.verbose()) {
                this.parameters.showAllParameters(this.commandOutput);
            }
            if (this.parameters.errorsFound.length > 0) {
                try {
                    for (var _c = __values(this.parameters.errorsFound), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var err = _d.value;
                        this.commandOutput.error(err.message);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return rxjs.of(-1);
            }
            if (this.parameters.warningsFound.length > 0) {
                try {
                    for (var _e = __values(this.parameters.warningsFound), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var warn = _f.value;
                        this.commandOutput.warn(warn);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            this.readMaster();
            if (this.parameters.autotranslate()) {
                this.autoTranslateService = new XliffMergeAutoTranslateService(this.parameters.apikey());
            }
            /** @type {?} */
            var executionForAllLanguages = [];
            this.parameters.languages().forEach((/**
             * @param {?} lang
             * @return {?}
             */
            function (lang) {
                executionForAllLanguages.push(_this.processLanguage(lang));
            }));
            return rxjs.forkJoin(executionForAllLanguages).pipe(operators.map((/**
             * @param {?} retcodes
             * @return {?}
             */
            function (retcodes) { return _this.totalRetcode(retcodes); })));
        };
        /**
         * Give an array of retcodes for the different languages, return the total retcode.
         * If all are 0, it is 0, otherwise the first non zero.
         * @param retcodes retcodes
         * @return number
         */
        /**
         * Give an array of retcodes for the different languages, return the total retcode.
         * If all are 0, it is 0, otherwise the first non zero.
         * @private
         * @param {?} retcodes retcodes
         * @return {?} number
         */
        XliffMerge.prototype.totalRetcode = /**
         * Give an array of retcodes for the different languages, return the total retcode.
         * If all are 0, it is 0, otherwise the first non zero.
         * @private
         * @param {?} retcodes retcodes
         * @return {?} number
         */
        function (retcodes) {
            for (var i = 0; i < retcodes.length; i++) {
                if (retcodes[i] !== 0) {
                    return retcodes[i];
                }
            }
            return 0;
        };
        /**
         * Return the name of the generated file for given lang.
         * @param lang language
         * @return name of generated file
         */
        /**
         * Return the name of the generated file for given lang.
         * @param {?} lang language
         * @return {?} name of generated file
         */
        XliffMerge.prototype.generatedI18nFile = /**
         * Return the name of the generated file for given lang.
         * @param {?} lang language
         * @return {?} name of generated file
         */
        function (lang) {
            return this.parameters.generatedI18nFile(lang);
        };
        /**
         * Return the name of the generated ngx-translation file for given lang.
         * @param lang language
         * @return name of translate file
         */
        /**
         * Return the name of the generated ngx-translation file for given lang.
         * @param {?} lang language
         * @return {?} name of translate file
         */
        XliffMerge.prototype.generatedNgxTranslateFile = /**
         * Return the name of the generated ngx-translation file for given lang.
         * @param {?} lang language
         * @return {?} name of translate file
         */
        function (lang) {
            return this.parameters.generatedNgxTranslateFile(lang);
        };
        /**
         * Warnings found during the run.
         * @return warnings
         */
        /**
         * Warnings found during the run.
         * @return {?} warnings
         */
        XliffMerge.prototype.warnings = /**
         * Warnings found during the run.
         * @return {?} warnings
         */
        function () {
            return this.parameters.warningsFound;
        };
        /**
         * @private
         * @return {?}
         */
        XliffMerge.prototype.readMaster = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            try {
                this.master = TranslationMessagesFileReader.fromFile(this.parameters.i18nFormat(), this.parameters.i18nFile(), this.parameters.encoding());
                this.master.warnings().forEach((/**
                 * @param {?} warning
                 * @return {?}
                 */
                function (warning) {
                    _this.commandOutput.warn(warning);
                }));
                /** @type {?} */
                var count = this.master.numberOfTransUnits();
                /** @type {?} */
                var missingIdCount = this.master.numberOfTransUnitsWithMissingId();
                this.commandOutput.info('master contains %s trans-units', count);
                if (missingIdCount > 0) {
                    this.commandOutput.warn('master contains %s trans-units, but there are %s without id', count, missingIdCount);
                }
                /** @type {?} */
                var sourceLang = this.master.sourceLanguage();
                if (sourceLang && sourceLang !== this.parameters.defaultLanguage()) {
                    this.commandOutput.warn('master says to have source-language="%s", should be "%s" (your defaultLanguage)', sourceLang, this.parameters.defaultLanguage());
                    this.master.setSourceLanguage(this.parameters.defaultLanguage());
                    TranslationMessagesFileReader.save(this.master, this.parameters.beautifyOutput());
                    this.commandOutput.warn('changed master source-language="%s" to "%s"', sourceLang, this.parameters.defaultLanguage());
                }
            }
            catch (err) {
                if (err instanceof XliffMergeError) {
                    this.commandOutput.error(err.message);
                    return rxjs.of(-1);
                }
                else {
                    // unhandled
                    /** @type {?} */
                    var currentFilename = this.parameters.i18nFile();
                    /** @type {?} */
                    var filenameString = (currentFilename) ? util.format('file "%s", ', currentFilename) : '';
                    this.commandOutput.error(filenameString + 'oops ' + err);
                    throw err;
                }
            }
        };
        /**
         * Process the given language.
         * Async operation.
         * @param lang language
         * @return on completion 0 for ok, other for error
         */
        /**
         * Process the given language.
         * Async operation.
         * @private
         * @param {?} lang language
         * @return {?} on completion 0 for ok, other for error
         */
        XliffMerge.prototype.processLanguage = /**
         * Process the given language.
         * Async operation.
         * @private
         * @param {?} lang language
         * @return {?} on completion 0 for ok, other for error
         */
        function (lang) {
            var _this = this;
            this.commandOutput.debug('processing language %s', lang);
            /** @type {?} */
            var languageXliffFile = this.parameters.generatedI18nFile(lang);
            /** @type {?} */
            var currentFilename = languageXliffFile;
            /** @type {?} */
            var result;
            if (!FileUtil.exists(languageXliffFile)) {
                result = this.createUntranslatedXliff(lang, languageXliffFile);
            }
            else {
                result = this.mergeMasterTo(lang, languageXliffFile);
            }
            return result
                .pipe(operators.map((/**
             * @return {?}
             */
            function () {
                if (_this.parameters.supportNgxTranslate()) {
                    /** @type {?} */
                    var languageSpecificMessagesFile = TranslationMessagesFileReader.fromFile(_this.translationFormat(_this.parameters.i18nFormat()), languageXliffFile, _this.parameters.encoding(), _this.master.filename());
                    NgxTranslateExtractor.extract(languageSpecificMessagesFile, _this.parameters.ngxTranslateExtractionPattern(), _this.parameters.generatedNgxTranslateFile(lang));
                }
                return 0;
            })), operators.catchError((/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                if (err instanceof XliffMergeError) {
                    _this.commandOutput.error(err.message);
                    return rxjs.of(-1);
                }
                else {
                    // unhandled
                    /** @type {?} */
                    var filenameString = (currentFilename) ? util.format('file "%s", ', currentFilename) : '';
                    _this.commandOutput.error(filenameString + 'oops ' + err);
                    throw err;
                }
            })));
        };
        /**
         * create a new file for the language, which contains no translations, but all keys.
         * in principle, this is just a copy of the master with target-language set.
         * @param lang language
         * @param languageXliffFilePath name of file
         */
        /**
         * create a new file for the language, which contains no translations, but all keys.
         * in principle, this is just a copy of the master with target-language set.
         * @private
         * @param {?} lang language
         * @param {?} languageXliffFilePath name of file
         * @return {?}
         */
        XliffMerge.prototype.createUntranslatedXliff = /**
         * create a new file for the language, which contains no translations, but all keys.
         * in principle, this is just a copy of the master with target-language set.
         * @private
         * @param {?} lang language
         * @param {?} languageXliffFilePath name of file
         * @return {?}
         */
        function (lang, languageXliffFilePath) {
            var _this = this;
            // copy master ...
            // and set target-language
            // and copy source to target if necessary
            /** @type {?} */
            var isDefaultLang = (lang === this.parameters.defaultLanguage());
            this.master.setNewTransUnitTargetPraefix(this.parameters.targetPraefix());
            this.master.setNewTransUnitTargetSuffix(this.parameters.targetSuffix());
            /** @type {?} */
            var languageSpecificMessagesFile = this.master.createTranslationFileForLang(lang, languageXliffFilePath, isDefaultLang, this.parameters.useSourceAsTarget());
            return this.autoTranslate(this.master.sourceLanguage(), lang, languageSpecificMessagesFile).pipe(operators.map((/**
             * @return {?}
             */
            function ( /* summary */) {
                // write it to file
                TranslationMessagesFileReader.save(languageSpecificMessagesFile, _this.parameters.beautifyOutput());
                _this.commandOutput.info('created new file "%s" for target-language="%s"', languageXliffFilePath, lang);
                if (!isDefaultLang) {
                    _this.commandOutput.warn('please translate file "%s" to target-language="%s"', languageXliffFilePath, lang);
                }
                return null;
            })));
        };
        /**
         * Map the input format to the format of the translation.
         * Normally they are the same but for xmb the translation format is xtb.
         * @param i18nFormat format
         */
        /**
         * Map the input format to the format of the translation.
         * Normally they are the same but for xmb the translation format is xtb.
         * @private
         * @param {?} i18nFormat format
         * @return {?}
         */
        XliffMerge.prototype.translationFormat = /**
         * Map the input format to the format of the translation.
         * Normally they are the same but for xmb the translation format is xtb.
         * @private
         * @param {?} i18nFormat format
         * @return {?}
         */
        function (i18nFormat) {
            if (i18nFormat === ngxI18nsupportLib.FORMAT_XMB) {
                return ngxI18nsupportLib.FORMAT_XTB;
            }
            else {
                return i18nFormat;
            }
        };
        /**
         * Merge all
         * @param lang language
         * @param languageXliffFilePath filename
         */
        /**
         * Merge all
         * @private
         * @param {?} lang language
         * @param {?} languageXliffFilePath filename
         * @return {?}
         */
        XliffMerge.prototype.mergeMasterTo = /**
         * Merge all
         * @private
         * @param {?} lang language
         * @param {?} languageXliffFilePath filename
         * @return {?}
         */
        function (lang, languageXliffFilePath) {
            var _this = this;
            // read lang specific file
            /** @type {?} */
            var languageSpecificMessagesFile = TranslationMessagesFileReader.fromFile(this.translationFormat(this.parameters.i18nFormat()), languageXliffFilePath, this.parameters.encoding());
            /** @type {?} */
            var isDefaultLang = (lang === this.parameters.defaultLanguage());
            /** @type {?} */
            var newCount = 0;
            /** @type {?} */
            var correctSourceContentCount = 0;
            /** @type {?} */
            var correctSourceRefCount = 0;
            /** @type {?} */
            var correctDescriptionOrMeaningCount = 0;
            /** @type {?} */
            var idChangedCount = 0;
            languageSpecificMessagesFile.setNewTransUnitTargetPraefix(this.parameters.targetPraefix());
            languageSpecificMessagesFile.setNewTransUnitTargetSuffix(this.parameters.targetSuffix());
            /** @type {?} */
            var lastProcessedUnit = null;
            this.master.forEachTransUnit((/**
             * @param {?} masterTransUnit
             * @return {?}
             */
            function (masterTransUnit) {
                /** @type {?} */
                var transUnit = languageSpecificMessagesFile.transUnitWithId(masterTransUnit.id);
                if (!transUnit) {
                    // oops, no translation, must be a new key, so add it
                    /** @type {?} */
                    var newUnit = void 0;
                    if (_this.parameters.allowIdChange()
                        && (newUnit = _this.processChangedIdUnit(masterTransUnit, languageSpecificMessagesFile, lastProcessedUnit))) {
                        lastProcessedUnit = newUnit;
                        idChangedCount++;
                    }
                    else {
                        lastProcessedUnit = languageSpecificMessagesFile.importNewTransUnit(masterTransUnit, isDefaultLang, _this.parameters.useSourceAsTarget(), (_this.parameters.preserveOrder()) ? lastProcessedUnit : undefined);
                        newCount++;
                    }
                }
                else {
                    // check for changed source content and change it if needed
                    // (can only happen if ID is explicitely set, otherwise ID would change if source content is changed.
                    if (transUnit.supportsSetSourceContent() && !_this.areSourcesNearlyEqual(masterTransUnit, transUnit)) {
                        transUnit.setSourceContent(masterTransUnit.sourceContent());
                        if (isDefaultLang) {
                            // #81 changed source must be copied to target for default lang
                            transUnit.translate(masterTransUnit.sourceContent());
                            transUnit.setTargetState(ngxI18nsupportLib.STATE_FINAL);
                        }
                        else {
                            if (transUnit.targetState() === ngxI18nsupportLib.STATE_FINAL) {
                                // source is changed, so translation has to be checked again
                                transUnit.setTargetState(ngxI18nsupportLib.STATE_TRANSLATED);
                            }
                        }
                        correctSourceContentCount++;
                    }
                    // check for missing or changed source ref and add it if needed
                    if (transUnit.supportsSetSourceReferences()
                        && !_this.areSourceReferencesEqual(masterTransUnit.sourceReferences(), transUnit.sourceReferences())) {
                        transUnit.setSourceReferences(masterTransUnit.sourceReferences());
                        correctSourceRefCount++;
                    }
                    // check for changed description or meaning
                    if (transUnit.supportsSetDescriptionAndMeaning()) {
                        /** @type {?} */
                        var changed = false;
                        if (transUnit.description() !== masterTransUnit.description()) {
                            transUnit.setDescription(masterTransUnit.description());
                            changed = true;
                        }
                        if (transUnit.meaning() !== masterTransUnit.meaning()) {
                            transUnit.setMeaning(masterTransUnit.meaning());
                            changed = true;
                        }
                        if (changed) {
                            correctDescriptionOrMeaningCount++;
                        }
                    }
                    lastProcessedUnit = transUnit;
                }
            }));
            if (newCount > 0) {
                this.commandOutput.warn('merged %s trans-units from master to "%s"', newCount, lang);
            }
            if (correctSourceContentCount > 0) {
                this.commandOutput.warn('transferred %s changed source content from master to "%s"', correctSourceContentCount, lang);
            }
            if (correctSourceRefCount > 0) {
                this.commandOutput.warn('transferred %s source references from master to "%s"', correctSourceRefCount, lang);
            }
            if (idChangedCount > 0) {
                this.commandOutput.warn('found %s changed id\'s in "%s"', idChangedCount, lang);
            }
            if (correctDescriptionOrMeaningCount > 0) {
                this.commandOutput.warn('transferred %s changed descriptions/meanings from master to "%s"', correctDescriptionOrMeaningCount, lang);
            }
            // remove all elements that are no longer used
            /** @type {?} */
            var removeCount = 0;
            languageSpecificMessagesFile.forEachTransUnit((/**
             * @param {?} transUnit
             * @return {?}
             */
            function (transUnit) {
                /** @type {?} */
                var existsInMaster = !isNullOrUndefined(_this.master.transUnitWithId(transUnit.id));
                if (!existsInMaster) {
                    if (_this.parameters.removeUnusedIds()) {
                        languageSpecificMessagesFile.removeTransUnitWithId(transUnit.id);
                    }
                    removeCount++;
                }
            }));
            if (removeCount > 0) {
                if (this.parameters.removeUnusedIds()) {
                    this.commandOutput.warn('removed %s unused trans-units in "%s"', removeCount, lang);
                }
                else {
                    this.commandOutput.warn('keeping %s unused trans-units in "%s", because removeUnused is disabled', removeCount, lang);
                }
            }
            if (newCount === 0 && removeCount === 0 && correctSourceContentCount === 0
                && correctSourceRefCount === 0 && correctDescriptionOrMeaningCount === 0) {
                this.commandOutput.info('file for "%s" was up to date', lang);
                return rxjs.of(null);
            }
            else {
                return this.autoTranslate(this.master.sourceLanguage(), lang, languageSpecificMessagesFile)
                    .pipe(operators.map((/**
                 * @return {?}
                 */
                function () {
                    // write it to file
                    TranslationMessagesFileReader.save(languageSpecificMessagesFile, _this.parameters.beautifyOutput());
                    _this.commandOutput.info('updated file "%s" for target-language="%s"', languageXliffFilePath, lang);
                    if (newCount > 0 && !isDefaultLang) {
                        _this.commandOutput.warn('please translate file "%s" to target-language="%s"', languageXliffFilePath, lang);
                    }
                    return null;
                })));
            }
        };
        /**
         * Handle the case of changed id due to small white space changes.
         * @param masterTransUnit unit in master file
         * @param languageSpecificMessagesFile translation file
         * @param lastProcessedUnit Unit before the one processed here. New unit will be inserted after this one.
         * @return processed unit, if done, null if no changed unit found
         */
        /**
         * Handle the case of changed id due to small white space changes.
         * @private
         * @param {?} masterTransUnit unit in master file
         * @param {?} languageSpecificMessagesFile translation file
         * @param {?} lastProcessedUnit Unit before the one processed here. New unit will be inserted after this one.
         * @return {?} processed unit, if done, null if no changed unit found
         */
        XliffMerge.prototype.processChangedIdUnit = /**
         * Handle the case of changed id due to small white space changes.
         * @private
         * @param {?} masterTransUnit unit in master file
         * @param {?} languageSpecificMessagesFile translation file
         * @param {?} lastProcessedUnit Unit before the one processed here. New unit will be inserted after this one.
         * @return {?} processed unit, if done, null if no changed unit found
         */
        function (masterTransUnit, languageSpecificMessagesFile, lastProcessedUnit) {
            var _this = this;
            /** @type {?} */
            var changedTransUnit = null;
            languageSpecificMessagesFile.forEachTransUnit((/**
             * @param {?} languageTransUnit
             * @return {?}
             */
            function (languageTransUnit) {
                if (_this.areSourcesNearlyEqual(languageTransUnit, masterTransUnit)) {
                    changedTransUnit = languageTransUnit;
                }
            }));
            if (!changedTransUnit) {
                return null;
            }
            /** @type {?} */
            var mergedTransUnit = languageSpecificMessagesFile.importNewTransUnit(masterTransUnit, false, false, (this.parameters.preserveOrder()) ? lastProcessedUnit : undefined);
            /** @type {?} */
            var translatedContent = changedTransUnit.targetContent();
            if (translatedContent) { // issue #68 set translated only, if it is really translated
                mergedTransUnit.translate(translatedContent);
                mergedTransUnit.setTargetState(ngxI18nsupportLib.STATE_TRANSLATED);
            }
            return mergedTransUnit;
        };
        /**
         * test wether the sources of 2 trans units are equal ignoring white spaces.
         * @param tu1 tu1
         * @param tu2 tu2
         */
        /**
         * test wether the sources of 2 trans units are equal ignoring white spaces.
         * @private
         * @param {?} tu1 tu1
         * @param {?} tu2 tu2
         * @return {?}
         */
        XliffMerge.prototype.areSourcesNearlyEqual = /**
         * test wether the sources of 2 trans units are equal ignoring white spaces.
         * @private
         * @param {?} tu1 tu1
         * @param {?} tu2 tu2
         * @return {?}
         */
        function (tu1, tu2) {
            if ((tu1 && !tu2) || (tu2 && !tu1)) {
                return false;
            }
            /** @type {?} */
            var tu1Normalized = tu1.sourceContentNormalized();
            /** @type {?} */
            var tu2Normalized = tu2.sourceContentNormalized();
            if (tu1Normalized.isICUMessage()) {
                if (tu2Normalized.isICUMessage()) {
                    /** @type {?} */
                    var icu1Normalized = tu1Normalized.getICUMessage().asNativeString().trim();
                    /** @type {?} */
                    var icu2Normalized = tu2Normalized.getICUMessage().asNativeString().trim();
                    return icu1Normalized === icu2Normalized;
                }
                else {
                    return false;
                }
            }
            if (tu1Normalized.containsICUMessageRef()) {
                /** @type {?} */
                var icuref1Normalized = tu1Normalized.asNativeString().trim();
                /** @type {?} */
                var icuref2Normalized = tu2Normalized.asNativeString().trim();
                return icuref1Normalized === icuref2Normalized;
            }
            /** @type {?} */
            var s1Normalized = tu1Normalized.asDisplayString(ngxI18nsupportLib.NORMALIZATION_FORMAT_DEFAULT).trim();
            /** @type {?} */
            var s2Normalized = tu2Normalized.asDisplayString(ngxI18nsupportLib.NORMALIZATION_FORMAT_DEFAULT).trim();
            return s1Normalized === s2Normalized;
        };
        /**
         * @private
         * @param {?} ref1
         * @param {?} ref2
         * @return {?}
         */
        XliffMerge.prototype.areSourceReferencesEqual = /**
         * @private
         * @param {?} ref1
         * @param {?} ref2
         * @return {?}
         */
        function (ref1, ref2) {
            if ((isNullOrUndefined(ref1) && !isNullOrUndefined(ref2)) || (isNullOrUndefined(ref2) && !isNullOrUndefined(ref1))) {
                return false;
            }
            if (isNullOrUndefined(ref1) && isNullOrUndefined(ref2)) {
                return true;
            }
            // bot refs are set now, convert to set to compare them
            /** @type {?} */
            var set1 = new Set();
            ref1.forEach((/**
             * @param {?} ref
             * @return {?}
             */
            function (ref) { set1.add(ref.sourcefile + ':' + ref.linenumber); }));
            /** @type {?} */
            var set2 = new Set();
            ref2.forEach((/**
             * @param {?} ref
             * @return {?}
             */
            function (ref) { set2.add(ref.sourcefile + ':' + ref.linenumber); }));
            if (set1.size !== set2.size) {
                return false;
            }
            /** @type {?} */
            var match = true;
            set2.forEach((/**
             * @param {?} ref
             * @return {?}
             */
            function (ref) {
                if (!set1.has(ref)) {
                    match = false;
                }
            }));
            return match;
        };
        /**
         * Auto translate file via Google Translate.
         * Will translate all new units in file.
         * @param from from
         * @param to to
         * @param languageSpecificMessagesFile languageSpecificMessagesFile
         * @return a promise with the execution result as a summary report.
         */
        /**
         * Auto translate file via Google Translate.
         * Will translate all new units in file.
         * @private
         * @param {?} from from
         * @param {?} to to
         * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
         * @return {?} a promise with the execution result as a summary report.
         */
        XliffMerge.prototype.autoTranslate = /**
         * Auto translate file via Google Translate.
         * Will translate all new units in file.
         * @private
         * @param {?} from from
         * @param {?} to to
         * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
         * @return {?} a promise with the execution result as a summary report.
         */
        function (from, to, languageSpecificMessagesFile) {
            var _this = this;
            /** @type {?} */
            var serviceCall;
            /** @type {?} */
            var autotranslateEnabled = this.parameters.autotranslateLanguage(to);
            if (autotranslateEnabled) {
                serviceCall = this.autoTranslateService.autoTranslate(from, to, languageSpecificMessagesFile);
            }
            else {
                serviceCall = rxjs.of(new AutoTranslateSummaryReport(from, to));
            }
            return serviceCall.pipe(operators.map((/**
             * @param {?} summary
             * @return {?}
             */
            function (summary) {
                if (autotranslateEnabled) {
                    if (summary.error() || summary.failed() > 0) {
                        _this.commandOutput.error(summary.content());
                    }
                    else {
                        _this.commandOutput.warn(summary.content());
                    }
                }
                return summary;
            })));
        };
        return XliffMerge;
    }());

    exports.CommandOutput = CommandOutput;
    exports.WriterToString = WriterToString;
    exports.XliffMerge = XliffMerge;
    exports.XliffmergeModule = XliffmergeModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-i18nsupport-ngx-i18nsupport.umd.js.map
