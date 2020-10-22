import { NgModule } from '@angular/core';
import { Writable } from 'stream';
import chalk from 'chalk';
import { format } from 'util';
import { existsSync, readFileSync, writeFileSync, openSync, readSync, writeSync, closeSync, readdirSync, lstatSync, unlinkSync, rmdirSync, statSync, accessSync, constants } from 'fs';
import { NORMALIZATION_FORMAT_NGXTRANSLATE, TranslationMessagesFileFactory, STATE_NEW, FORMAT_XMB, FORMAT_XTB, STATE_FINAL, STATE_TRANSLATED, NORMALIZATION_FORMAT_DEFAULT } from '@ngx-i18nsupport/ngx-i18nsupport-lib';
import { isAbsolute, join, dirname, resolve } from 'path';
import { of, throwError, forkJoin, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { decode } from 'he';
import * as request from 'request';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// not used, only there to make ng-packagr happy
class XliffmergeModule {
}
XliffmergeModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
                declarations: [],
                exports: []
            },] }
];

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
class WriterToString extends Writable {
    constructor() {
        super();
        this.resultString = '';
    }
    /**
     * @param {?} chunk
     * @param {?} encoding
     * @param {?} callback
     * @return {?}
     */
    _write(chunk, encoding, callback) {
        /** @type {?} */
        let chunkString;
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
    }
    /**
     * Returns a string of everything, that was written to the stream so far.
     * @return {?} written data
     */
    writtenData() {
        return this.resultString;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const LogLevel = {
    'ERROR': 0,
    'WARN': 1,
    'INFO': 2,
    'DEBUG': 3,
};
LogLevel[LogLevel['ERROR']] = 'ERROR';
LogLevel[LogLevel['WARN']] = 'WARN';
LogLevel[LogLevel['INFO']] = 'INFO';
LogLevel[LogLevel['DEBUG']] = 'DEBUG';
class CommandOutput {
    /**
     * @param {?=} stdout
     */
    constructor(stdout) {
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
    setVerbose() {
        this._verbose = true;
    }
    /**
     * @return {?}
     */
    setQuiet() {
        this._quiet = true;
    }
    /**
     * Test, wether verbose is enabled.
     * @return {?} wether verbose is enabled.
     */
    verbose() {
        return this._verbose;
    }
    /**
     * Test, wether quiet is enabled.
     * @return {?} wether quiet is enabled.
     */
    quiet() {
        return this._quiet;
    }
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    error(msg, ...params) {
        this.log(LogLevel.ERROR, msg, params);
    }
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    warn(msg, ...params) {
        this.log(LogLevel.WARN, msg, params);
    }
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    info(msg, ...params) {
        this.log(LogLevel.INFO, msg, params);
    }
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    debug(msg, ...params) {
        this.log(LogLevel.DEBUG, msg, params);
    }
    /**
     * @private
     * @param {?} level
     * @param {?} msg
     * @param {?} params
     * @return {?}
     */
    log(level, msg, params) {
        if (!this.isOutputEnabled(level)) {
            return;
        }
        /** @type {?} */
        let coloredMessage;
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
        const outMsg = format(coloredMessage, ...params);
        this.outputStream.write(outMsg + '\n');
    }
    /**
     * @private
     * @param {?} level
     * @return {?}
     */
    isOutputEnabled(level) {
        /** @type {?} */
        let quietEnabled;
        /** @type {?} */
        let verboseEnabled;
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
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by martin on 17.02.2017.
 */
class XliffMergeError extends Error {
    /**
     * @param {?} msg
     */
    constructor(msg) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, XliffMergeError.prototype);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by martin on 17.02.2017.
 * Some (a few) simple utils for file operations.
 * Just for convenience.
 */
class FileUtil {
    /**
     * Check for existence.
     * @param {?} filename filename
     * @return {?} wether file exists
     */
    static exists(filename) {
        return existsSync(filename);
    }
    /**
     * Read a file.
     * @param {?} filename filename
     * @param {?} encoding encoding
     * @return {?} content of file
     */
    static read(filename, encoding) {
        return readFileSync(filename, encoding);
    }
    /**
     * Write a file with given content.
     * @param {?} filename filename
     * @param {?} newContent newContent
     * @param {?} encoding encoding
     * @return {?}
     */
    static replaceContent(filename, newContent, encoding) {
        writeFileSync(filename, newContent, { encoding: encoding });
    }
    /**
     * @param {?} srcFile
     * @param {?} destFile
     * @return {?}
     */
    static copy(srcFile, destFile) {
        /** @type {?} */
        const BUF_LENGTH = 64 * 1024;
        /** @type {?} */
        const buff = Buffer.alloc(BUF_LENGTH);
        /** @type {?} */
        const fdr = openSync(srcFile, 'r');
        /** @type {?} */
        const fdw = openSync(destFile, 'w');
        /** @type {?} */
        let bytesRead = 1;
        /** @type {?} */
        let pos = 0;
        while (bytesRead > 0) {
            bytesRead = readSync(fdr, buff, 0, BUF_LENGTH, pos);
            writeSync(fdw, buff, 0, bytesRead);
            pos += bytesRead;
        }
        closeSync(fdr);
        closeSync(fdw);
    }
    /**
     * Delete the folder and all of its content (rm -rf).
     * @param {?} path path
     * @return {?}
     */
    static deleteFolderRecursive(path) {
        /** @type {?} */
        let files = [];
        if (existsSync(path)) {
            files = readdirSync(path);
            files.forEach((/**
             * @param {?} file
             * @return {?}
             */
            function (file) {
                /** @type {?} */
                const curPath = path + '/' + file;
                if (lstatSync(curPath).isDirectory()) { // recurse
                    FileUtil.deleteFolderRecursive(curPath);
                }
                else { // delete file
                    unlinkSync(curPath);
                }
            }));
            rmdirSync(path);
        }
    }
    /**
     * Delete folders content recursively, but do not delete folder.
     * Folder is left empty at the end.
     * @param {?} path path
     * @return {?}
     */
    static deleteFolderContentRecursive(path) {
        /** @type {?} */
        let files = [];
        if (existsSync(path)) {
            files = readdirSync(path);
            files.forEach((/**
             * @param {?} file
             * @return {?}
             */
            function (file) {
                /** @type {?} */
                const curPath = path + '/' + file;
                if (lstatSync(curPath).isDirectory()) { // recurse
                    FileUtil.deleteFolderRecursive(curPath);
                }
                else { // delete file
                    unlinkSync(curPath);
                }
            }));
        }
    }
    /**
     * Delete a file.
     * @param {?} path path
     * @return {?}
     */
    static deleteFile(path) {
        unlinkSync(path);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Helper class to parse ngx translate extraction pattern
 * and to decide wether a given message matches the pattern.
 */
class NgxTranslateExtractionPattern {
    /**
     * Construct the pattern from given description string
     * @throws an error, if there is a syntax error
     * @param {?} extractionPatternString extractionPatternString
     */
    constructor(extractionPatternString) {
        this.extractionPatternString = extractionPatternString;
        /** @type {?} */
        const parts = extractionPatternString.split('|');
        this._matchExplicitId = false;
        this._descriptionPatterns = [];
        for (let i = 0; i < parts.length; i++) {
            /** @type {?} */
            const part = parts[i];
            if (part === '@@') {
                if (this._matchExplicitId) {
                    throw new Error('extraction pattern must not contain @@ twice');
                }
                this._matchExplicitId = true;
            }
            else {
                /** @type {?} */
                const errorString = this.checkValidDescriptionPattern(part);
                if (errorString) {
                    throw new Error(errorString);
                }
                this._descriptionPatterns.push(part);
            }
        }
    }
    /**
     * Check, wether an explicitly set id matches the pattern.
     * @param {?} id id
     * @return {?} wether an explicitly set id matches the pattern.
     */
    isExplicitIdMatched(id) {
        return id && this._matchExplicitId;
    }
    /**
     * Check, wether a given description matches the pattern.
     * @param {?} description description
     * @return {?} wether a given description matches the pattern.
     */
    isDescriptionMatched(description) {
        return this._descriptionPatterns.indexOf(description) >= 0;
    }
    /**
     * @private
     * @param {?} descriptionPattern
     * @return {?}
     */
    checkValidDescriptionPattern(descriptionPattern) {
        if (!descriptionPattern) {
            return 'empty value not allowed';
        }
        if (/^[a-zA-Z_][a-zA-Z_-]*$/.test(descriptionPattern)) {
            return null; // it is ok
        }
        else {
            return 'description pattern must be an identifier containing only letters, digits, _ or -';
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxTranslateExtractor {
    /**
     * @param {?} messagesFile
     * @param {?} extractionPatternString
     */
    constructor(messagesFile, extractionPatternString) {
        this.messagesFile = messagesFile;
        this.extractionPattern = new NgxTranslateExtractionPattern(extractionPatternString);
    }
    /**
     * Check, wether extractionPattern has valid syntax.
     * @param {?} extractionPatternString extractionPatternString
     * @return {?} null, if pattern is ok, string describing the error, if it is not ok.
     */
    static checkPattern(extractionPatternString) {
        try {
            if (new NgxTranslateExtractionPattern(extractionPatternString)) {
                return null;
            }
        }
        catch (error) {
            return error.message;
        }
        return null;
    }
    /**
     * @param {?} messagesFile
     * @param {?} extractionPattern
     * @param {?} outputFile
     * @return {?}
     */
    static extract(messagesFile, extractionPattern, outputFile) {
        new NgxTranslateExtractor(messagesFile, extractionPattern).extractTo(outputFile);
    }
    /**
     * Extact messages and write them to a file.
     * @param {?} outputFile outputFile
     * @return {?}
     */
    extractTo(outputFile) {
        /** @type {?} */
        const translations = this.toNgxTranslations(this.extract());
        if (translations && Object.keys(translations).length > 0) {
            FileUtil.replaceContent(outputFile, JSON.stringify(translations, null, 4), 'UTF-8');
        }
        else {
            if (FileUtil.exists(outputFile)) {
                FileUtil.deleteFile(outputFile);
            }
        }
    }
    /**
     *  Extract messages and convert them to ngx translations.
     * @private
     * @return {?} the translation objects.
     */
    extract() {
        /** @type {?} */
        const result = [];
        this.messagesFile.forEachTransUnit((/**
         * @param {?} tu
         * @return {?}
         */
        (tu) => {
            /** @type {?} */
            const ngxId = this.ngxTranslateIdFromTU(tu);
            if (ngxId) {
                /** @type {?} */
                const messagetext = tu.targetContentNormalized().asDisplayString(NORMALIZATION_FORMAT_NGXTRANSLATE);
                result.push({ id: ngxId, message: messagetext });
            }
        }));
        return result;
    }
    /**
     * Check, wether this tu should be extracted for ngx-translate usage, and return its id for ngx-translate.
     * There are 2 possibilities:
     * 1. description is set to "ngx-translate" and meaning contains the id.
     * 2. id is explicitly set to a string.
     * @private
     * @param {?} tu tu
     * @return {?} an ngx id or null, if this tu should not be extracted.
     */
    ngxTranslateIdFromTU(tu) {
        if (this.isExplicitlySetId(tu.id)) {
            if (this.extractionPattern.isExplicitIdMatched(tu.id)) {
                return tu.id;
            }
            else {
                return null;
            }
        }
        /** @type {?} */
        const description = tu.description();
        if (description && this.extractionPattern.isDescriptionMatched(description)) {
            return tu.meaning();
        }
    }
    /**
     * Test, wether ID was explicitly set (via i18n="\@myid).
     * Just heuristic, an ID is explicitly, if it does not look like a generated one.
     * @private
     * @param {?} id id
     * @return {?} wether ID was explicitly set (via i18n="\@myid).
     */
    isExplicitlySetId(id) {
        if (isNullOrUndefined(id)) {
            return false;
        }
        // generated IDs are either decimal or sha1 hex
        /** @type {?} */
        const reForGeneratedId = /^[0-9a-f]{11,}$/;
        return !reForGeneratedId.test(id);
    }
    /**
     * Convert list of relevant TUs to ngx translations object.
     * @private
     * @param {?} msgList msgList
     * @return {?}
     */
    toNgxTranslations(msgList) {
        /** @type {?} */
        const translationObject = {};
        msgList.forEach((/**
         * @param {?} msg
         * @return {?}
         */
        (msg) => {
            this.putInTranslationObject(translationObject, msg);
        }));
        return translationObject;
    }
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
    putInTranslationObject(translationObject, msg) {
        /** @type {?} */
        let firstPartOfId;
        /** @type {?} */
        let restOfId;
        /** @type {?} */
        const indexOfDot = msg.id.indexOf('.');
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
        let object = translationObject[firstPartOfId];
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
    }
}
NgxTranslateExtractor.DefaultExtractionPattern = '@@|ngx-translate';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const PROFILE_CANDIDATES = ['package.json', '.angular-cli.json'];
class XliffMergeParameters {
    /**
     * Create Parameters.
     * @param {?} options command options
     * @param {?=} profileContent given profile (if not, it is read from the profile path from options).
     * @return {?}
     */
    static createFromOptions(options, profileContent) {
        /** @type {?} */
        const parameters = new XliffMergeParameters();
        parameters.configure(options, profileContent);
        return parameters;
    }
    /**
     * @private
     */
    constructor() {
        this.errorsFound = [];
        this.warningsFound = [];
    }
    /**
     * Read potential profile.
     * To be a candidate, file must exist and contain property "xliffmergeOptions".
     * @private
     * @param {?} profilePath path of profile
     * @return {?} parsed content of file or null, if file does not exist or is not a profile candidate.
     */
    static readProfileCandidate(profilePath) {
        /** @type {?} */
        let content;
        try {
            content = readFileSync(profilePath, 'UTF-8');
        }
        catch (err) {
            return null;
        }
        /** @type {?} */
        const parsedContent = JSON.parse(content);
        if (parsedContent && parsedContent.xliffmergeOptions) {
            return parsedContent;
        }
        else {
            return null;
        }
    }
    /**
     * Initialize me from the profile content.
     * (public only for test usage).
     * @private
     * @param {?} options options given at runtime via command line
     * @param {?=} profileContent if null, read it from profile.
     * @return {?}
     */
    configure(options, profileContent) {
        this.errorsFound = [];
        this.warningsFound = [];
        if (!profileContent) {
            profileContent = this.readProfile(options);
        }
        /** @type {?} */
        const validProfile = (!!profileContent);
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
    }
    /**
     * Read profile.
     * @private
     * @param {?} options program options
     * @return {?} the read profile (empty, if none, null if errors)
     */
    readProfile(options) {
        /** @type {?} */
        const profilePath = options.profilePath;
        if (!profilePath) {
            for (const configfilename of PROFILE_CANDIDATES) {
                /** @type {?} */
                const profile = XliffMergeParameters.readProfileCandidate(configfilename);
                if (profile) {
                    this.usedProfilePath = configfilename;
                    return profile;
                }
            }
            return {};
        }
        /** @type {?} */
        let content;
        try {
            content = readFileSync(profilePath, 'UTF-8');
        }
        catch (err) {
            this.errorsFound.push(new XliffMergeError('could not read profile "' + profilePath + '"'));
            return null;
        }
        this.usedProfilePath = profilePath;
        /** @type {?} */
        const profileContent = JSON.parse(content);
        // replace all pathes in options by absolute paths
        /** @type {?} */
        const xliffmergeOptions = profileContent.xliffmergeOptions;
        xliffmergeOptions.srcDir = this.adjustPathToProfilePath(profilePath, xliffmergeOptions.srcDir);
        xliffmergeOptions.genDir = this.adjustPathToProfilePath(profilePath, xliffmergeOptions.genDir);
        xliffmergeOptions.apikeyfile = this.adjustPathToProfilePath(profilePath, xliffmergeOptions.apikeyfile);
        return profileContent;
    }
    /**
     * @private
     * @param {?} profilePath
     * @param {?} pathToAdjust
     * @return {?}
     */
    adjustPathToProfilePath(profilePath, pathToAdjust) {
        if (!pathToAdjust || isAbsolute(pathToAdjust)) {
            return pathToAdjust;
        }
        return join(dirname(profilePath), pathToAdjust).replace(/\\/g, '/');
    }
    /**
     * @private
     * @param {?} profileContent
     * @return {?}
     */
    initializeFromConfig(profileContent) {
        if (!profileContent) {
            return;
        }
        /** @type {?} */
        const profile = profileContent.xliffmergeOptions;
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
    }
    /**
     * Check all Parameters, wether they are complete and consistent.
     * if something is wrong with the parameters, it is collected in errorsFound.
     * @private
     * @return {?}
     */
    checkParameters() {
        this.checkLanguageSyntax(this.defaultLanguage());
        if (this.languages().length === 0) {
            this.errorsFound.push(new XliffMergeError('no languages specified'));
        }
        this.languages().forEach((/**
         * @param {?} lang
         * @return {?}
         */
        (lang) => {
            this.checkLanguageSyntax(lang);
        }));
        /** @type {?} */
        let stats;
        /** @type {?} */
        let err;
        // srcDir should exists
        try {
            stats = statSync(this.srcDir());
        }
        catch (e) {
            err = e;
        }
        if (!!err || !stats.isDirectory()) {
            this.errorsFound.push(new XliffMergeError('srcDir "' + this.srcDir() + '" is not a directory'));
        }
        // genDir should exists
        try {
            stats = statSync(this.genDir());
        }
        catch (e) {
            err = e;
        }
        if (!!err || !stats.isDirectory()) {
            this.errorsFound.push(new XliffMergeError('genDir "' + this.genDir() + '" is not a directory'));
        }
        // master file MUST exist
        try {
            accessSync(this.i18nFile(), constants.R_OK);
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
        (lang) => {
            if (this.languages().indexOf(lang) < 0) {
                this.errorsFound.push(new XliffMergeError('autotranslate language "' + lang + '" is not in list of languages'));
            }
            if (lang === this.defaultLanguage()) {
                this.errorsFound.push(new XliffMergeError('autotranslate language "' + lang + '" cannot be translated, because it is the source language'));
            }
        }));
        // ngx translate pattern check
        if (this.supportNgxTranslate()) {
            /** @type {?} */
            const checkResult = NgxTranslateExtractor.checkPattern(this.ngxTranslateExtractionPattern());
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
    }
    /**
     * Check syntax of language.
     * Must be compatible with XML Schema type xsd:language.
     * Pattern: [a-zA-Z]{1,8}((-|_)[a-zA-Z0-9]{1,8})*
     * @private
     * @param {?} lang language to check
     * @return {?}
     */
    checkLanguageSyntax(lang) {
        /** @type {?} */
        const pattern = /^[a-zA-Z]{1,8}([-_][a-zA-Z0-9]{1,8})*$/;
        if (!pattern.test(lang)) {
            this.errorsFound.push(new XliffMergeError('language "' + lang + '" is not valid'));
        }
    }
    /**
     * @return {?}
     */
    allowIdChange() {
        return (isNullOrUndefined(this._allowIdChange)) ? false : this._allowIdChange;
    }
    /**
     * @return {?}
     */
    verbose() {
        return (isNullOrUndefined(this._verbose)) ? false : this._verbose;
    }
    /**
     * @return {?}
     */
    quiet() {
        return (isNullOrUndefined(this._quiet)) ? false : this._quiet;
    }
    /**
     * Debug output all parameters to commandOutput.
     * @param {?} commandOutput
     * @return {?}
     */
    showAllParameters(commandOutput) {
        commandOutput.debug('xliffmerge Used Parameters:');
        commandOutput.debug('usedProfilePath:\t"%s"', this.usedProfilePath);
        commandOutput.debug('defaultLanguage:\t"%s"', this.defaultLanguage());
        commandOutput.debug('srcDir:\t"%s"', this.srcDir());
        commandOutput.debug('genDir:\t"%s"', this.genDir());
        commandOutput.debug('i18nBaseFile:\t"%s"', this.i18nBaseFile());
        commandOutput.debug('i18nFile:\t"%s"', this.i18nFile());
        commandOutput.debug('languages:\t%s', this.languages());
        for (const language of this.languages()) {
            commandOutput.debug('outputFile[%s]:\t%s', language, this.generatedI18nFile(language));
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
    }
    /**
     * Default-Language, default en.
     * @return {?} default language
     */
    defaultLanguage() {
        return this._defaultLanguage ? this._defaultLanguage : 'en';
    }
    /**
     * Liste der zu bearbeitenden Sprachen.
     * @return {?} languages
     */
    languages() {
        return this._languages ? this._languages : [];
    }
    /**
     * src directory, where the master xlif is located.
     * @return {?} srcDir
     */
    srcDir() {
        return this._srcDir ? this._srcDir : '.';
    }
    /**
     * The base file name of the xlif file for input and output.
     * Default is messages
     * @return {?} base file
     */
    i18nBaseFile() {
        return this._i18nBaseFile ? this._i18nBaseFile : 'messages';
    }
    /**
     * The master xlif file (the one generated by ng-xi18n).
     * Default is <srcDir>/<i18nBaseFile>.xlf.
     * @return {?} master file
     */
    i18nFile() {
        return join(this.srcDir(), (this._i18nFile ? this._i18nFile : this.i18nBaseFile() + '.' + this.suffixForGeneratedI18nFile())).replace(/\\/g, '/');
    }
    /**
     * Format of the master xlif file.
     * Default is "xlf", possible are "xlf" or "xlf2" or "xmb".
     * @return {?} format
     */
    i18nFormat() {
        return (this._i18nFormat ? this._i18nFormat : 'xlf');
    }
    /**
     * potentially to be generated I18n-File with the translations for one language.
     * @param {?} lang language shortcut
     * @return {?} Path of file
     */
    generatedI18nFile(lang) {
        return join(this.genDir(), this.i18nBaseFile() + '.' + lang + '.' + this.suffixForGeneratedI18nFile()).replace(/\\/g, '/');
    }
    /**
     * @private
     * @return {?}
     */
    suffixForGeneratedI18nFile() {
        switch (this.i18nFormat()) {
            case 'xlf':
                return 'xlf';
            case 'xlf2':
                return 'xlf';
            case 'xmb':
                return 'xtb';
        }
    }
    /**
     * potentially to be generated translate-File for ngx-translate with the translations for one language.
     * @param {?} lang language shortcut
     * @return {?} Path of file
     */
    generatedNgxTranslateFile(lang) {
        return join(this.genDir(), this.i18nBaseFile() + '.' + lang + '.' + 'json').replace(/\\/g, '/');
    }
    /**
     * The encoding used to write new XLIFF-files.
     * @return {?} encoding
     */
    encoding() {
        return this._encoding ? this._encoding : 'UTF-8';
    }
    /**
     * Output-Directory, where the output is written to.
     * Default is <srcDir>.
     * @return {?}
     */
    genDir() {
        return this._genDir ? this._genDir : this.srcDir();
    }
    /**
     * @return {?}
     */
    removeUnusedIds() {
        return (isNullOrUndefined(this._removeUnusedIds)) ? true : this._removeUnusedIds;
    }
    /**
     * @return {?}
     */
    supportNgxTranslate() {
        return (isNullOrUndefined(this._supportNgxTranslate)) ? false : this._supportNgxTranslate;
    }
    /**
     * @return {?}
     */
    ngxTranslateExtractionPattern() {
        return (isNullOrUndefined(this._ngxTranslateExtractionPattern)) ?
            NgxTranslateExtractor.DefaultExtractionPattern : this._ngxTranslateExtractionPattern;
    }
    /**
     * Whether source must be used as target for new trans-units
     * Default is true
     * @return {?}
     */
    useSourceAsTarget() {
        return (isNullOrUndefined(this._useSourceAsTarget)) ? true : this._useSourceAsTarget;
    }
    /**
     * Praefix used for target when copying new trans-units
     * Default is ""
     * @return {?}
     */
    targetPraefix() {
        return (isNullOrUndefined(this._targetPraefix)) ? '' : this._targetPraefix;
    }
    /**
     * Suffix used for target when copying new trans-units
     * Default is ""
     * @return {?}
     */
    targetSuffix() {
        return (isNullOrUndefined(this._targetSuffix)) ? '' : this._targetSuffix;
    }
    /**
     * If set, run xml result through beautifier (pretty-data).
     * @return {?}
     */
    beautifyOutput() {
        return (isNullOrUndefined(this._beautifyOutput)) ? false : this._beautifyOutput;
    }
    /**
     * If set, order of new trans units will be as in master.
     * Otherwise they are added at the end.
     * @return {?}
     */
    preserveOrder() {
        return (isNullOrUndefined(this._preserveOrder)) ? true : this._preserveOrder;
    }
    /**
     * Whether to use autotranslate for new trans-units
     * Default is false
     * @return {?}
     */
    autotranslate() {
        if (isNullOrUndefined(this._autotranslate)) {
            return false;
        }
        if (isArray(this._autotranslate)) {
            return ((/** @type {?} */ (this._autotranslate))).length > 0;
        }
        return (/** @type {?} */ (this._autotranslate));
    }
    /**
     * Whether to use autotranslate for a given language.
     * @param {?} lang language code.
     * @return {?}
     */
    autotranslateLanguage(lang) {
        return this.autotranslatedLanguages().indexOf(lang) >= 0;
    }
    /**
     * Return a list of languages to be autotranslated.
     * @return {?}
     */
    autotranslatedLanguages() {
        if (isNullOrUndefined(this._autotranslate) || this._autotranslate === false) {
            return [];
        }
        if (isArray(this._autotranslate)) {
            return ((/** @type {?} */ (this._autotranslate)));
        }
        return this.languages().slice(1); // first is source language
    }
    /**
     * API key to be used for Google Translate
     * @return {?} api key
     */
    apikey() {
        if (!isNullOrUndefined(this._apikey)) {
            return this._apikey;
        }
        else {
            /** @type {?} */
            const apikeyPath = this.apikeyfile();
            if (this.apikeyfile()) {
                if (existsSync(apikeyPath)) {
                    return FileUtil.read(apikeyPath, 'utf-8');
                }
                else {
                    throw new Error(format('api key file not found: API_KEY_FILE=%s', apikeyPath));
                }
            }
            else {
                return null;
            }
        }
    }
    /**
     * file name for API key to be used for Google Translate.
     * Explicitly set or read from env var API_KEY_FILE.
     * @return {?} file of api key
     */
    apikeyfile() {
        if (this._apikeyfile) {
            return this._apikeyfile;
        }
        else if (process.env.API_KEY_FILE) {
            return process.env.API_KEY_FILE;
        }
        else {
            return null;
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
let pkg = null;
try {
    pkg = require(resolve(__dirname, '..', 'package.json'));
}
catch (e) {
    try {
        pkg = require(resolve(__dirname, '..', '..', 'package.json'));
    }
    catch (e) {
        pkg = null;
    }
}
/** @type {?} */
const VERSION = (pkg ? pkg.version : 'unknown');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by martin on 10.03.2017.
 * Helper class to read XMl with a correct encoding.
 */
class XmlReader {
    /**
     * Read an xml-File.
     * @param {?} path Path to file
     * @param {?=} encoding optional encoding of the xml.
     * This is read from the file, but if you know it before, you can avoid reading the file twice.
     * @return {?} file content and encoding found in the file.
     */
    static readXmlFileContent(path, encoding) {
        if (!encoding) {
            encoding = XmlReader.DEFAULT_ENCODING;
        }
        /** @type {?} */
        let content = FileUtil.read(path, encoding);
        /** @type {?} */
        const foundEncoding = XmlReader.encodingFromXml(content);
        if (foundEncoding !== encoding) {
            // read again with the correct encoding
            content = FileUtil.read(path, foundEncoding);
        }
        return {
            content: content,
            encoding: foundEncoding
        };
    }
    /**
     * Read the encoding from the xml.
     * xml File starts with .. encoding=".."
     * @private
     * @param {?} xmlString xmlString
     * @return {?} encoding
     */
    static encodingFromXml(xmlString) {
        /** @type {?} */
        const index = xmlString.indexOf('encoding="');
        if (index < 0) {
            return this.DEFAULT_ENCODING; // default in xml if not explicitly set
        }
        /** @type {?} */
        const endIndex = xmlString.indexOf('"', index + 10);
        return xmlString.substring(index + 10, endIndex);
    }
}
XmlReader.DEFAULT_ENCODING = 'UTF-8';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Helper class to read translation files depending on format.
 */
class TranslationMessagesFileReader {
    /**
     * Read file function, result depends on format, either XliffFile or XmbFile.
     * @param {?} i18nFormat format
     * @param {?} path path
     * @param {?} encoding encoding
     * @param {?=} optionalMasterFilePath optionalMasterFilePath
     * @return {?} XliffFile
     */
    static fromFile(i18nFormat, path, encoding, optionalMasterFilePath) {
        /** @type {?} */
        const xmlContent = XmlReader.readXmlFileContent(path, encoding);
        /** @type {?} */
        const optionalMaster = TranslationMessagesFileReader.masterFileContent(optionalMasterFilePath, encoding);
        return TranslationMessagesFileFactory.fromFileContent(i18nFormat, xmlContent.content, path, xmlContent.encoding, optionalMaster);
    }
    /**
     * Read file function, result depends on format, either XliffFile or XmbFile.
     * @param {?} path path
     * @param {?} encoding encoding
     * @param {?=} optionalMasterFilePath optionalMasterFilePath
     * @return {?} XliffFile
     */
    static fromUnknownFormatFile(path, encoding, optionalMasterFilePath) {
        /** @type {?} */
        const xmlContent = XmlReader.readXmlFileContent(path, encoding);
        /** @type {?} */
        const optionalMaster = TranslationMessagesFileReader.masterFileContent(optionalMasterFilePath, encoding);
        return TranslationMessagesFileFactory.fromUnknownFormatFileContent(xmlContent.content, path, xmlContent.encoding, optionalMaster);
    }
    /**
     * Read master xmb file
     * @private
     * @param {?} optionalMasterFilePath optionalMasterFilePath
     * @param {?} encoding encoding
     * @return {?} content and encoding of file
     */
    static masterFileContent(optionalMasterFilePath, encoding) {
        if (optionalMasterFilePath) {
            /** @type {?} */
            const masterXmlContent = XmlReader.readXmlFileContent(optionalMasterFilePath, encoding);
            return {
                xmlContent: masterXmlContent.content,
                path: optionalMasterFilePath,
                encoding: masterXmlContent.encoding
            };
        }
        else {
            return null;
        }
    }
    /**
     * Save edited file.
     * @param {?} messagesFile messagesFile
     * @param {?=} beautifyOutput Flag whether to use pretty-data to format the output.
     * XMLSerializer produces some correct but strangely formatted output, which pretty-data can correct.
     * See issue #64 for details.
     * Default is false.
     * @return {?}
     */
    static save(messagesFile, beautifyOutput) {
        FileUtil.replaceContent(messagesFile.filename(), messagesFile.editedContent(beautifyOutput), messagesFile.encoding());
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const MAX_SEGMENTS = 128;
class AutoTranslateService {
    /**
     * Strip region code and convert to lower
     * @param {?} lang lang
     * @return {?} lang without region code and in lower case.
     */
    static stripRegioncode(lang) {
        /** @type {?} */
        const langLower = lang.toLowerCase();
        for (let i = 0; i < langLower.length; i++) {
            /** @type {?} */
            const c = langLower.charAt(i);
            if (c < 'a' || c > 'z') {
                return langLower.substring(0, i);
            }
        }
        return langLower;
    }
    /**
     * @param {?} apiKey
     */
    constructor(apiKey) {
        this._request = request;
        this._apiKey = apiKey;
        this._rootUrl = 'https://translation.googleapis.com/';
    }
    /**
     * Change API key (just for tests).
     * @param {?} apikey apikey
     * @return {?}
     */
    setApiKey(apikey) {
        this._apiKey = apikey;
    }
    /**
     * Translate an array of messages at once.
     * @param {?} messages the messages to be translated
     * @param {?} from source language code
     * @param {?} to target language code
     * @return {?} Observable with translated messages or error
     */
    translateMultipleStrings(messages, from, to) {
        // empty array needs no translation and always works ... (#78)
        if (messages.length === 0) {
            return of([]);
        }
        if (!this._apiKey) {
            return throwError('cannot autotranslate: no api key');
        }
        if (!from || !to) {
            return throwError('cannot autotranslate: source and target language must be set');
        }
        from = AutoTranslateService.stripRegioncode(from);
        to = AutoTranslateService.stripRegioncode(to);
        /** @type {?} */
        const allRequests = this.splitMessagesToGoogleLimit(messages).map((/**
         * @param {?} partialMessages
         * @return {?}
         */
        (partialMessages) => {
            return this.limitedTranslateMultipleStrings(partialMessages, from, to);
        }));
        return forkJoin(allRequests).pipe(map((/**
         * @param {?} allTranslations
         * @return {?}
         */
        (allTranslations) => {
            /** @type {?} */
            let all = [];
            for (let i = 0; i < allTranslations.length; i++) {
                all = all.concat(allTranslations[i]);
            }
            return all;
        })));
    }
    /**
     * @private
     * @param {?} messages
     * @return {?}
     */
    splitMessagesToGoogleLimit(messages) {
        if (messages.length <= MAX_SEGMENTS) {
            return [messages];
        }
        /** @type {?} */
        const result = [];
        /** @type {?} */
        let currentPackage = [];
        /** @type {?} */
        let packageSize = 0;
        for (let i = 0; i < messages.length; i++) {
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
    }
    /**
     * Return translation request, but messages must be limited to google limits.
     * Not more that 128 single messages.
     * @private
     * @param {?} messages messages
     * @param {?} from from
     * @param {?} to to
     * @return {?} the translated strings
     */
    limitedTranslateMultipleStrings(messages, from, to) {
        /** @type {?} */
        const realUrl = this._rootUrl + 'language/translate/v2' + '?key=' + this._apiKey;
        /** @type {?} */
        const translateRequest = {
            q: messages,
            target: to,
            source: from,
        };
        /** @type {?} */
        const options = {
            url: realUrl,
            body: translateRequest,
            json: true,
        };
        return this.post(realUrl, options).pipe(map((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            /** @type {?} */
            const body = data.body;
            if (!body) {
                throw new Error('no result received');
            }
            if (body.error) {
                if (body.error.code === 400) {
                    if (body.error.message === 'Invalid Value') {
                        throw new Error(format('Translation from "%s" to "%s" not supported', from, to));
                    }
                    throw new Error(format('Invalid request: %s', body.error.message));
                }
                else {
                    throw new Error(format('Error %s: %s', body.error.code, body.error.message));
                }
            }
            /** @type {?} */
            const result = body.data;
            return result.translations.map((/**
             * @param {?} translation
             * @return {?}
             */
            (translation) => {
                return translation.translatedText;
            }));
        })));
    }
    /**
     * Function to do a POST HTTP request
     *
     * @param {?} uri uri
     * @param {?=} options options
     *
     * @return {?} response
     */
    post(uri, options) {
        return (/** @type {?} */ (this._call.apply(this, [].concat('post', (/** @type {?} */ (uri)), (/** @type {?} */ (Object.assign({}, options || {})))))));
    }
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
    _call(method, uri, options) {
        return (/** @type {?} */ (Observable.create((/**
         * @param {?} observer
         * @return {?}
         */
        (observer) => {
            // build params array
            /** @type {?} */
            const params = [].concat((/** @type {?} */ (uri)), (/** @type {?} */ (Object.assign({}, options || {}))), (/**
             * @template RequestCallback
             * @param {?} error
             * @param {?} response
             * @param {?} body
             * @return {?}
             */
            (error, response, body) => {
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
                this._request[(/** @type {?} */ (method))].apply((/** @type {?} */ (this._request)), params);
            }
            catch (error) {
                observer.error(error);
            }
        }))));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by martin on 29.06.2017.
 */
class AutoTranslateResult {
    /**
     * @param {?} _success
     * @param {?} _details
     */
    constructor(_success, _details) {
        this._success = _success;
        this._details = _details;
    }
    /**
     * @return {?}
     */
    success() {
        return this._success;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * A report about a run of Google Translate over all untranslated unit.
 * * Created by martin on 29.06.2017.
 */
class AutoTranslateSummaryReport {
    /**
     * @param {?} from
     * @param {?} to
     */
    constructor(from, to) {
        this._from = from;
        this._to = to;
        this._total = 0;
        this._ignored = 0;
        this._success = 0;
        this._failed = 0;
    }
    /**
     * Set error if total call failed (e.g. "invalid api key" or "no connection" ...)
     * @param {?} error error
     * @param {?} total total
     * @return {?}
     */
    setError(error, total) {
        this._error = error;
        this._total = total;
        this._failed = total;
    }
    /**
     * @return {?}
     */
    error() {
        return this._error;
    }
    /**
     * @param {?} ignored
     * @return {?}
     */
    setIgnored(ignored) {
        this._total += ignored;
        this._ignored = ignored;
    }
    /**
     * Add a single result to the summary.
     * @param {?} tu tu
     * @param {?} result result
     * @return {?}
     */
    addSingleResult(tu, result) {
        this._total++;
        if (result.success()) {
            this._success++;
        }
        else {
            this._failed++;
        }
    }
    /**
     * Merge another summary into this one.
     * @param {?} anotherSummary anotherSummary
     * @return {?}
     */
    merge(anotherSummary) {
        if (!this._error) {
            this._error = anotherSummary._error;
        }
        this._total += anotherSummary.total();
        this._ignored += anotherSummary.ignored();
        this._success += anotherSummary.success();
        this._failed += anotherSummary.failed();
    }
    /**
     * @return {?}
     */
    total() {
        return this._total;
    }
    /**
     * @return {?}
     */
    ignored() {
        return this._ignored;
    }
    /**
     * @return {?}
     */
    success() {
        return this._success;
    }
    /**
     * @return {?}
     */
    failed() {
        return this._failed;
    }
    /**
     * Human readable version of report
     * @return {?}
     */
    content() {
        /** @type {?} */
        let result;
        if (this._error) {
            result = format('Auto translation from "%s" to "%s" failed: "%s", failed units: %s', this._from, this._to, this._error, this._failed);
        }
        else {
            result = format('Auto translation from "%s" to "%s", total auto translated units: %s, ignored: %s, succesful: %s, failed: %s', this._from, this._to, this._total, this._ignored, this._success, this._failed);
        }
        return result;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by martin on 07.07.2017.
 * Service to autotranslate Transunits via Google Translate.
 */
class XliffMergeAutoTranslateService {
    /**
     * @param {?} apikey
     */
    constructor(apikey) {
        this.autoTranslateService = new AutoTranslateService(apikey);
    }
    /**
     * Auto translate file via Google Translate.
     * Will translate all new units in file.
     * @param {?} from from
     * @param {?} to to
     * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
     * @return {?} a promise with the execution result as a summary report.
     */
    autoTranslate(from, to, languageSpecificMessagesFile) {
        return forkJoin([
            this.doAutoTranslateNonICUMessages(from, to, languageSpecificMessagesFile),
            ...this.doAutoTranslateICUMessages(from, to, languageSpecificMessagesFile)
        ])
            .pipe(map((/**
         * @param {?} summaries
         * @return {?}
         */
        (summaries) => {
            /** @type {?} */
            const summary = summaries[0];
            for (let i = 1; i < summaries.length; i++) {
                summary.merge(summaries[i]);
            }
            return summary;
        })));
    }
    /**
     * Collect all units that are untranslated.
     * @private
     * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
     * @return {?} all untranslated units
     */
    allUntranslatedTUs(languageSpecificMessagesFile) {
        // collect all units, that should be auto translated
        /** @type {?} */
        const allUntranslated = [];
        languageSpecificMessagesFile.forEachTransUnit((/**
         * @param {?} tu
         * @return {?}
         */
        (tu) => {
            if (tu.targetState() === STATE_NEW) {
                allUntranslated.push(tu);
            }
        }));
        return allUntranslated;
    }
    /**
     * @private
     * @param {?} from
     * @param {?} to
     * @param {?} languageSpecificMessagesFile
     * @return {?}
     */
    doAutoTranslateNonICUMessages(from, to, languageSpecificMessagesFile) {
        /** @type {?} */
        const allUntranslated = this.allUntranslatedTUs(languageSpecificMessagesFile);
        /** @type {?} */
        const allTranslatable = allUntranslated.filter((/**
         * @param {?} tu
         * @return {?}
         */
        (tu) => isNullOrUndefined(tu.sourceContentNormalized().getICUMessage())));
        /** @type {?} */
        const allMessages = allTranslatable.map((/**
         * @param {?} tu
         * @return {?}
         */
        (tu) => {
            return tu.sourceContentNormalized().asDisplayString();
        }));
        return this.autoTranslateService.translateMultipleStrings(allMessages, from, to)
            .pipe(
        // #94 google translate might return &#.. entity refs, that must be decoded
        map((/**
         * @param {?} translations
         * @return {?}
         */
        (translations) => translations.map((/**
         * @param {?} encodedTranslation
         * @return {?}
         */
        encodedTranslation => decode(encodedTranslation))))), map((/**
         * @param {?} translations
         * @return {?}
         */
        (translations) => {
            /** @type {?} */
            const summary = new AutoTranslateSummaryReport(from, to);
            summary.setIgnored(allUntranslated.length - allTranslatable.length);
            for (let i = 0; i < translations.length; i++) {
                /** @type {?} */
                const tu = allTranslatable[i];
                /** @type {?} */
                const translationText = translations[i];
                /** @type {?} */
                const result = this.autoTranslateNonICUUnit(tu, translationText);
                summary.addSingleResult(tu, result);
            }
            return summary;
        })), catchError((/**
         * @param {?} err
         * @return {?}
         */
        (err) => {
            /** @type {?} */
            const failSummary = new AutoTranslateSummaryReport(from, to);
            failSummary.setError(err.message, allMessages.length);
            return of(failSummary);
        })));
    }
    /**
     * @private
     * @param {?} from
     * @param {?} to
     * @param {?} languageSpecificMessagesFile
     * @return {?}
     */
    doAutoTranslateICUMessages(from, to, languageSpecificMessagesFile) {
        /** @type {?} */
        const allUntranslated = this.allUntranslatedTUs(languageSpecificMessagesFile);
        /** @type {?} */
        const allTranslatableICU = allUntranslated.filter((/**
         * @param {?} tu
         * @return {?}
         */
        (tu) => !isNullOrUndefined(tu.sourceContentNormalized().getICUMessage())));
        return allTranslatableICU.map((/**
         * @param {?} tu
         * @return {?}
         */
        (tu) => {
            return this.doAutoTranslateICUMessage(from, to, tu);
        }));
    }
    /**
     * Translate single ICU Messages.
     * @private
     * @param {?} from from
     * @param {?} to to
     * @param {?} tu transunit to translate (must contain ICU Message)
     * @return {?} summary report
     */
    doAutoTranslateICUMessage(from, to, tu) {
        /** @type {?} */
        const icuMessage = tu.sourceContentNormalized().getICUMessage();
        /** @type {?} */
        const categories = icuMessage.getCategories();
        // check for nested ICUs, we do not support that
        if (categories.find((/**
         * @param {?} category
         * @return {?}
         */
        (category) => !isNullOrUndefined(category.getMessageNormalized().getICUMessage())))) {
            /** @type {?} */
            const summary = new AutoTranslateSummaryReport(from, to);
            summary.setIgnored(1);
            return of(summary);
        }
        /** @type {?} */
        const allMessages = categories.map((/**
         * @param {?} category
         * @return {?}
         */
        (category) => category.getMessageNormalized().asDisplayString()));
        return this.autoTranslateService.translateMultipleStrings(allMessages, from, to)
            .pipe(
        // #94 google translate might return &#.. entity refs, that must be decoded
        map((/**
         * @param {?} translations
         * @return {?}
         */
        (translations) => translations.map((/**
         * @param {?} encodedTranslation
         * @return {?}
         */
        encodedTranslation => decode(encodedTranslation))))), map((/**
         * @param {?} translations
         * @return {?}
         */
        (translations) => {
            /** @type {?} */
            const summary = new AutoTranslateSummaryReport(from, to);
            /** @type {?} */
            const icuTranslation = {};
            for (let i = 0; i < translations.length; i++) {
                icuTranslation[categories[i].getCategory()] = translations[i];
            }
            /** @type {?} */
            const result = this.autoTranslateICUUnit(tu, icuTranslation);
            summary.addSingleResult(tu, result);
            return summary;
        })), catchError((/**
         * @param {?} err
         * @return {?}
         */
        (err) => {
            /** @type {?} */
            const failSummary = new AutoTranslateSummaryReport(from, to);
            failSummary.setError(err.message, allMessages.length);
            return of(failSummary);
        })));
    }
    /**
     * @private
     * @param {?} tu
     * @param {?} translatedMessage
     * @return {?}
     */
    autoTranslateNonICUUnit(tu, translatedMessage) {
        return this.autoTranslateUnit(tu, tu.sourceContentNormalized().translate(translatedMessage));
    }
    /**
     * @private
     * @param {?} tu
     * @param {?} translation
     * @return {?}
     */
    autoTranslateICUUnit(tu, translation) {
        return this.autoTranslateUnit(tu, tu.sourceContentNormalized().translateICUMessage(translation));
    }
    /**
     * @private
     * @param {?} tu
     * @param {?} translatedMessage
     * @return {?}
     */
    autoTranslateUnit(tu, translatedMessage) {
        /** @type {?} */
        const errors = translatedMessage.validate();
        /** @type {?} */
        const warnings = translatedMessage.validateWarnings();
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
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by martin on 17.02.2017.
 * XliffMerge - read xliff or xmb file and put untranslated parts in language specific xliff or xmb files.
 *
 */
class XliffMerge {
    /**
     * @param {?} argv
     * @return {?}
     */
    static main(argv) {
        /** @type {?} */
        const options = XliffMerge.parseArgs(argv);
        if (options) {
            new XliffMerge(new CommandOutput(process.stdout), options).run((/**
             * @param {?} result
             * @return {?}
             */
            (result) => {
                process.exit(result);
            }));
        }
    }
    /**
     * @param {?} argv
     * @return {?}
     */
    static parseArgs(argv) {
        /** @type {?} */
        const options = {
            languages: []
        };
        for (let i = 2; i < argv.length; i++) {
            /** @type {?} */
            const arg = argv[i];
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
    }
    /**
     * @return {?}
     */
    static showUsage() {
        console.log('usage: xliffmerge <option>* <language>*');
        console.log('Options');
        console.log('\t-p|--profile a json configuration file containing all relevant parameters.');
        console.log('\t\tfor details please consult the home page https://github.com/martinroob/ngx-i18nsupport');
        console.log('\t-v|--verbose show some output for debugging purposes');
        console.log('\t-q|--quiet only show errors, nothing else');
        console.log('\t-version|--version show version string');
        console.log('');
        console.log('\t<language> has to be a valid language short string, e,g. "en", "de", "de-ch"');
    }
    /**
     * For Tests, create instance with given profile
     * @param {?} commandOutput commandOutput
     * @param {?} options options
     * @param {?=} profileContent profileContent
     * @return {?}
     */
    static createFromOptions(commandOutput, options, profileContent) {
        /** @type {?} */
        const instance = new XliffMerge(commandOutput, options);
        instance.parameters = XliffMergeParameters.createFromOptions(options, profileContent);
        return instance;
    }
    /**
     * @param {?} commandOutput
     * @param {?} options
     */
    constructor(commandOutput, options) {
        this.commandOutput = commandOutput;
        this.options = options;
        this.parameters = null;
    }
    /**
     * Run the command.
     * This runs async.
     * @param {?=} callbackFunction when command is executed, called with the return code (0 for ok), if given.
     * @param {?=} errorFunction callbackFunction for error handling
     * @return {?}
     */
    run(callbackFunction, errorFunction) {
        this.runAsync()
            .subscribe((/**
         * @param {?} retcode
         * @return {?}
         */
        (retcode) => {
            if (!isNullOrUndefined(callbackFunction)) {
                callbackFunction(retcode);
            }
        }), (/**
         * @param {?} error
         * @return {?}
         */
        (error) => {
            if (!isNullOrUndefined(errorFunction)) {
                errorFunction(error);
            }
        }));
    }
    /**
     * Execute merge-Process.
     * @return {?} Async operation, on completion returns retcode 0=ok, other = error.
     */
    runAsync() {
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
            for (const err of this.parameters.errorsFound) {
                this.commandOutput.error(err.message);
            }
            return of(-1);
        }
        if (this.parameters.warningsFound.length > 0) {
            for (const warn of this.parameters.warningsFound) {
                this.commandOutput.warn(warn);
            }
        }
        this.readMaster();
        if (this.parameters.autotranslate()) {
            this.autoTranslateService = new XliffMergeAutoTranslateService(this.parameters.apikey());
        }
        /** @type {?} */
        const executionForAllLanguages = [];
        this.parameters.languages().forEach((/**
         * @param {?} lang
         * @return {?}
         */
        (lang) => {
            executionForAllLanguages.push(this.processLanguage(lang));
        }));
        return forkJoin(executionForAllLanguages).pipe(map((/**
         * @param {?} retcodes
         * @return {?}
         */
        (retcodes) => this.totalRetcode(retcodes))));
    }
    /**
     * Give an array of retcodes for the different languages, return the total retcode.
     * If all are 0, it is 0, otherwise the first non zero.
     * @private
     * @param {?} retcodes retcodes
     * @return {?} number
     */
    totalRetcode(retcodes) {
        for (let i = 0; i < retcodes.length; i++) {
            if (retcodes[i] !== 0) {
                return retcodes[i];
            }
        }
        return 0;
    }
    /**
     * Return the name of the generated file for given lang.
     * @param {?} lang language
     * @return {?} name of generated file
     */
    generatedI18nFile(lang) {
        return this.parameters.generatedI18nFile(lang);
    }
    /**
     * Return the name of the generated ngx-translation file for given lang.
     * @param {?} lang language
     * @return {?} name of translate file
     */
    generatedNgxTranslateFile(lang) {
        return this.parameters.generatedNgxTranslateFile(lang);
    }
    /**
     * Warnings found during the run.
     * @return {?} warnings
     */
    warnings() {
        return this.parameters.warningsFound;
    }
    /**
     * @private
     * @return {?}
     */
    readMaster() {
        try {
            this.master = TranslationMessagesFileReader.fromFile(this.parameters.i18nFormat(), this.parameters.i18nFile(), this.parameters.encoding());
            this.master.warnings().forEach((/**
             * @param {?} warning
             * @return {?}
             */
            (warning) => {
                this.commandOutput.warn(warning);
            }));
            /** @type {?} */
            const count = this.master.numberOfTransUnits();
            /** @type {?} */
            const missingIdCount = this.master.numberOfTransUnitsWithMissingId();
            this.commandOutput.info('master contains %s trans-units', count);
            if (missingIdCount > 0) {
                this.commandOutput.warn('master contains %s trans-units, but there are %s without id', count, missingIdCount);
            }
            /** @type {?} */
            const sourceLang = this.master.sourceLanguage();
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
                return of(-1);
            }
            else {
                // unhandled
                /** @type {?} */
                const currentFilename = this.parameters.i18nFile();
                /** @type {?} */
                const filenameString = (currentFilename) ? format('file "%s", ', currentFilename) : '';
                this.commandOutput.error(filenameString + 'oops ' + err);
                throw err;
            }
        }
    }
    /**
     * Process the given language.
     * Async operation.
     * @private
     * @param {?} lang language
     * @return {?} on completion 0 for ok, other for error
     */
    processLanguage(lang) {
        this.commandOutput.debug('processing language %s', lang);
        /** @type {?} */
        const languageXliffFile = this.parameters.generatedI18nFile(lang);
        /** @type {?} */
        const currentFilename = languageXliffFile;
        /** @type {?} */
        let result;
        if (!FileUtil.exists(languageXliffFile)) {
            result = this.createUntranslatedXliff(lang, languageXliffFile);
        }
        else {
            result = this.mergeMasterTo(lang, languageXliffFile);
        }
        return result
            .pipe(map((/**
         * @return {?}
         */
        () => {
            if (this.parameters.supportNgxTranslate()) {
                /** @type {?} */
                const languageSpecificMessagesFile = TranslationMessagesFileReader.fromFile(this.translationFormat(this.parameters.i18nFormat()), languageXliffFile, this.parameters.encoding(), this.master.filename());
                NgxTranslateExtractor.extract(languageSpecificMessagesFile, this.parameters.ngxTranslateExtractionPattern(), this.parameters.generatedNgxTranslateFile(lang));
            }
            return 0;
        })), catchError((/**
         * @param {?} err
         * @return {?}
         */
        (err) => {
            if (err instanceof XliffMergeError) {
                this.commandOutput.error(err.message);
                return of(-1);
            }
            else {
                // unhandled
                /** @type {?} */
                const filenameString = (currentFilename) ? format('file "%s", ', currentFilename) : '';
                this.commandOutput.error(filenameString + 'oops ' + err);
                throw err;
            }
        })));
    }
    /**
     * create a new file for the language, which contains no translations, but all keys.
     * in principle, this is just a copy of the master with target-language set.
     * @private
     * @param {?} lang language
     * @param {?} languageXliffFilePath name of file
     * @return {?}
     */
    createUntranslatedXliff(lang, languageXliffFilePath) {
        // copy master ...
        // and set target-language
        // and copy source to target if necessary
        /** @type {?} */
        const isDefaultLang = (lang === this.parameters.defaultLanguage());
        this.master.setNewTransUnitTargetPraefix(this.parameters.targetPraefix());
        this.master.setNewTransUnitTargetSuffix(this.parameters.targetSuffix());
        /** @type {?} */
        const languageSpecificMessagesFile = this.master.createTranslationFileForLang(lang, languageXliffFilePath, isDefaultLang, this.parameters.useSourceAsTarget());
        return this.autoTranslate(this.master.sourceLanguage(), lang, languageSpecificMessagesFile).pipe(map((/**
         * @return {?}
         */
        ( /* summary */) => {
            // write it to file
            TranslationMessagesFileReader.save(languageSpecificMessagesFile, this.parameters.beautifyOutput());
            this.commandOutput.info('created new file "%s" for target-language="%s"', languageXliffFilePath, lang);
            if (!isDefaultLang) {
                this.commandOutput.warn('please translate file "%s" to target-language="%s"', languageXliffFilePath, lang);
            }
            return null;
        })));
    }
    /**
     * Map the input format to the format of the translation.
     * Normally they are the same but for xmb the translation format is xtb.
     * @private
     * @param {?} i18nFormat format
     * @return {?}
     */
    translationFormat(i18nFormat) {
        if (i18nFormat === FORMAT_XMB) {
            return FORMAT_XTB;
        }
        else {
            return i18nFormat;
        }
    }
    /**
     * Merge all
     * @private
     * @param {?} lang language
     * @param {?} languageXliffFilePath filename
     * @return {?}
     */
    mergeMasterTo(lang, languageXliffFilePath) {
        // read lang specific file
        /** @type {?} */
        const languageSpecificMessagesFile = TranslationMessagesFileReader.fromFile(this.translationFormat(this.parameters.i18nFormat()), languageXliffFilePath, this.parameters.encoding());
        /** @type {?} */
        const isDefaultLang = (lang === this.parameters.defaultLanguage());
        /** @type {?} */
        let newCount = 0;
        /** @type {?} */
        let correctSourceContentCount = 0;
        /** @type {?} */
        let correctSourceRefCount = 0;
        /** @type {?} */
        let correctDescriptionOrMeaningCount = 0;
        /** @type {?} */
        let idChangedCount = 0;
        languageSpecificMessagesFile.setNewTransUnitTargetPraefix(this.parameters.targetPraefix());
        languageSpecificMessagesFile.setNewTransUnitTargetSuffix(this.parameters.targetSuffix());
        /** @type {?} */
        let lastProcessedUnit = null;
        this.master.forEachTransUnit((/**
         * @param {?} masterTransUnit
         * @return {?}
         */
        (masterTransUnit) => {
            /** @type {?} */
            const transUnit = languageSpecificMessagesFile.transUnitWithId(masterTransUnit.id);
            if (!transUnit) {
                // oops, no translation, must be a new key, so add it
                /** @type {?} */
                let newUnit;
                if (this.parameters.allowIdChange()
                    && (newUnit = this.processChangedIdUnit(masterTransUnit, languageSpecificMessagesFile, lastProcessedUnit))) {
                    lastProcessedUnit = newUnit;
                    idChangedCount++;
                }
                else {
                    lastProcessedUnit = languageSpecificMessagesFile.importNewTransUnit(masterTransUnit, isDefaultLang, this.parameters.useSourceAsTarget(), (this.parameters.preserveOrder()) ? lastProcessedUnit : undefined);
                    newCount++;
                }
            }
            else {
                // check for changed source content and change it if needed
                // (can only happen if ID is explicitely set, otherwise ID would change if source content is changed.
                if (transUnit.supportsSetSourceContent() && !this.areSourcesNearlyEqual(masterTransUnit, transUnit)) {
                    transUnit.setSourceContent(masterTransUnit.sourceContent());
                    if (isDefaultLang) {
                        // #81 changed source must be copied to target for default lang
                        transUnit.translate(masterTransUnit.sourceContent());
                        transUnit.setTargetState(STATE_FINAL);
                    }
                    else {
                        if (transUnit.targetState() === STATE_FINAL) {
                            // source is changed, so translation has to be checked again
                            transUnit.setTargetState(STATE_TRANSLATED);
                        }
                    }
                    correctSourceContentCount++;
                }
                // check for missing or changed source ref and add it if needed
                if (transUnit.supportsSetSourceReferences()
                    && !this.areSourceReferencesEqual(masterTransUnit.sourceReferences(), transUnit.sourceReferences())) {
                    transUnit.setSourceReferences(masterTransUnit.sourceReferences());
                    correctSourceRefCount++;
                }
                // check for changed description or meaning
                if (transUnit.supportsSetDescriptionAndMeaning()) {
                    /** @type {?} */
                    let changed = false;
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
        let removeCount = 0;
        languageSpecificMessagesFile.forEachTransUnit((/**
         * @param {?} transUnit
         * @return {?}
         */
        (transUnit) => {
            /** @type {?} */
            const existsInMaster = !isNullOrUndefined(this.master.transUnitWithId(transUnit.id));
            if (!existsInMaster) {
                if (this.parameters.removeUnusedIds()) {
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
            return of(null);
        }
        else {
            return this.autoTranslate(this.master.sourceLanguage(), lang, languageSpecificMessagesFile)
                .pipe(map((/**
             * @return {?}
             */
            () => {
                // write it to file
                TranslationMessagesFileReader.save(languageSpecificMessagesFile, this.parameters.beautifyOutput());
                this.commandOutput.info('updated file "%s" for target-language="%s"', languageXliffFilePath, lang);
                if (newCount > 0 && !isDefaultLang) {
                    this.commandOutput.warn('please translate file "%s" to target-language="%s"', languageXliffFilePath, lang);
                }
                return null;
            })));
        }
    }
    /**
     * Handle the case of changed id due to small white space changes.
     * @private
     * @param {?} masterTransUnit unit in master file
     * @param {?} languageSpecificMessagesFile translation file
     * @param {?} lastProcessedUnit Unit before the one processed here. New unit will be inserted after this one.
     * @return {?} processed unit, if done, null if no changed unit found
     */
    processChangedIdUnit(masterTransUnit, languageSpecificMessagesFile, lastProcessedUnit) {
        /** @type {?} */
        let changedTransUnit = null;
        languageSpecificMessagesFile.forEachTransUnit((/**
         * @param {?} languageTransUnit
         * @return {?}
         */
        (languageTransUnit) => {
            if (this.areSourcesNearlyEqual(languageTransUnit, masterTransUnit)) {
                changedTransUnit = languageTransUnit;
            }
        }));
        if (!changedTransUnit) {
            return null;
        }
        /** @type {?} */
        const mergedTransUnit = languageSpecificMessagesFile.importNewTransUnit(masterTransUnit, false, false, (this.parameters.preserveOrder()) ? lastProcessedUnit : undefined);
        /** @type {?} */
        const translatedContent = changedTransUnit.targetContent();
        if (translatedContent) { // issue #68 set translated only, if it is really translated
            mergedTransUnit.translate(translatedContent);
            mergedTransUnit.setTargetState(STATE_TRANSLATED);
        }
        return mergedTransUnit;
    }
    /**
     * test wether the sources of 2 trans units are equal ignoring white spaces.
     * @private
     * @param {?} tu1 tu1
     * @param {?} tu2 tu2
     * @return {?}
     */
    areSourcesNearlyEqual(tu1, tu2) {
        if ((tu1 && !tu2) || (tu2 && !tu1)) {
            return false;
        }
        /** @type {?} */
        const tu1Normalized = tu1.sourceContentNormalized();
        /** @type {?} */
        const tu2Normalized = tu2.sourceContentNormalized();
        if (tu1Normalized.isICUMessage()) {
            if (tu2Normalized.isICUMessage()) {
                /** @type {?} */
                const icu1Normalized = tu1Normalized.getICUMessage().asNativeString().trim();
                /** @type {?} */
                const icu2Normalized = tu2Normalized.getICUMessage().asNativeString().trim();
                return icu1Normalized === icu2Normalized;
            }
            else {
                return false;
            }
        }
        if (tu1Normalized.containsICUMessageRef()) {
            /** @type {?} */
            const icuref1Normalized = tu1Normalized.asNativeString().trim();
            /** @type {?} */
            const icuref2Normalized = tu2Normalized.asNativeString().trim();
            return icuref1Normalized === icuref2Normalized;
        }
        /** @type {?} */
        const s1Normalized = tu1Normalized.asDisplayString(NORMALIZATION_FORMAT_DEFAULT).trim();
        /** @type {?} */
        const s2Normalized = tu2Normalized.asDisplayString(NORMALIZATION_FORMAT_DEFAULT).trim();
        return s1Normalized === s2Normalized;
    }
    /**
     * @private
     * @param {?} ref1
     * @param {?} ref2
     * @return {?}
     */
    areSourceReferencesEqual(ref1, ref2) {
        if ((isNullOrUndefined(ref1) && !isNullOrUndefined(ref2)) || (isNullOrUndefined(ref2) && !isNullOrUndefined(ref1))) {
            return false;
        }
        if (isNullOrUndefined(ref1) && isNullOrUndefined(ref2)) {
            return true;
        }
        // bot refs are set now, convert to set to compare them
        /** @type {?} */
        const set1 = new Set();
        ref1.forEach((/**
         * @param {?} ref
         * @return {?}
         */
        (ref) => { set1.add(ref.sourcefile + ':' + ref.linenumber); }));
        /** @type {?} */
        const set2 = new Set();
        ref2.forEach((/**
         * @param {?} ref
         * @return {?}
         */
        (ref) => { set2.add(ref.sourcefile + ':' + ref.linenumber); }));
        if (set1.size !== set2.size) {
            return false;
        }
        /** @type {?} */
        let match = true;
        set2.forEach((/**
         * @param {?} ref
         * @return {?}
         */
        (ref) => {
            if (!set1.has(ref)) {
                match = false;
            }
        }));
        return match;
    }
    /**
     * Auto translate file via Google Translate.
     * Will translate all new units in file.
     * @private
     * @param {?} from from
     * @param {?} to to
     * @param {?} languageSpecificMessagesFile languageSpecificMessagesFile
     * @return {?} a promise with the execution result as a summary report.
     */
    autoTranslate(from, to, languageSpecificMessagesFile) {
        /** @type {?} */
        let serviceCall;
        /** @type {?} */
        const autotranslateEnabled = this.parameters.autotranslateLanguage(to);
        if (autotranslateEnabled) {
            serviceCall = this.autoTranslateService.autoTranslate(from, to, languageSpecificMessagesFile);
        }
        else {
            serviceCall = of(new AutoTranslateSummaryReport(from, to));
        }
        return serviceCall.pipe(map((/**
         * @param {?} summary
         * @return {?}
         */
        (summary) => {
            if (autotranslateEnabled) {
                if (summary.error() || summary.failed() > 0) {
                    this.commandOutput.error(summary.content());
                }
                else {
                    this.commandOutput.warn(summary.content());
                }
            }
            return summary;
        })));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { CommandOutput, WriterToString, XliffMerge, XliffmergeModule };
//# sourceMappingURL=ngx-i18nsupport-ngx-i18nsupport.js.map
