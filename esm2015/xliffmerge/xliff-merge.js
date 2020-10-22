/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { CommandOutput } from '../common/command-output';
import { XliffMergeParameters } from './xliff-merge-parameters';
import { XliffMergeError } from './xliff-merge-error';
import { FileUtil } from '../common/file-util';
import { VERSION } from './version';
import { format } from 'util';
import { isNullOrUndefined } from '../common/util';
import { FORMAT_XMB, FORMAT_XTB, NORMALIZATION_FORMAT_DEFAULT, STATE_FINAL, STATE_TRANSLATED } from '@ngx-i18nsupport/ngx-i18nsupport-lib';
import { NgxTranslateExtractor } from './ngx-translate-extractor';
import { TranslationMessagesFileReader } from './translation-messages-file-reader';
import { of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { XliffMergeAutoTranslateService } from '../autotranslate/xliff-merge-auto-translate-service';
import { AutoTranslateSummaryReport } from '../autotranslate/auto-translate-summary-report';
/**
 * Created by martin on 17.02.2017.
 * XliffMerge - read xliff or xmb file and put untranslated parts in language specific xliff or xmb files.
 *
 */
export class XliffMerge {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    XliffMerge.prototype.commandOutput;
    /**
     * @type {?}
     * @private
     */
    XliffMerge.prototype.options;
    /**
     * @type {?}
     * @private
     */
    XliffMerge.prototype.parameters;
    /**
     * The read master xlf file.
     * @type {?}
     * @private
     */
    XliffMerge.prototype.master;
    /**
     * @type {?}
     * @private
     */
    XliffMerge.prototype.autoTranslateService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYtbWVyZ2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbInhsaWZmbWVyZ2UveGxpZmYtbWVyZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDbEMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQ0gsVUFBVSxFQUFFLFVBQVUsRUFDdEIsNEJBQTRCLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFFN0csT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDakYsT0FBTyxFQUFhLEVBQUUsRUFBRSxRQUFRLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEVBQUMsOEJBQThCLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUNuRyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxnREFBZ0QsQ0FBQzs7Ozs7O0FBUTFGLE1BQU0sT0FBTyxVQUFVOzs7OztJQWVuQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQWM7O2NBQ2hCLE9B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TyxDQUFDLEtBQUssRUFBRSxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2lCQUMvQztxQkFBTTtvQkFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDOUM7YUFDSjtZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUMsRUFBQyxDQUFDLENBQUM7SUFDUixDQUFDO0NBRUo7Ozs7OztJQXRqQkcsbUNBQThDOzs7OztJQUU5Qyw2QkFBeUM7Ozs7O0lBRXpDLGdDQUF5Qzs7Ozs7O0lBS3pDLDRCQUF5Qzs7Ozs7SUFFekMsMENBQTZEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21tYW5kT3V0cHV0fSBmcm9tICcuLi9jb21tb24vY29tbWFuZC1vdXRwdXQnO1xuaW1wb3J0IHtYbGlmZk1lcmdlUGFyYW1ldGVyc30gZnJvbSAnLi94bGlmZi1tZXJnZS1wYXJhbWV0ZXJzJztcbmltcG9ydCB7WGxpZmZNZXJnZUVycm9yfSBmcm9tICcuL3hsaWZmLW1lcmdlLWVycm9yJztcbmltcG9ydCB7RmlsZVV0aWx9IGZyb20gJy4uL2NvbW1vbi9maWxlLXV0aWwnO1xuaW1wb3J0IHtWRVJTSU9OfSBmcm9tICcuL3ZlcnNpb24nO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHtJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUsIElUcmFuc1VuaXQsXG4gICAgRk9STUFUX1hNQiwgRk9STUFUX1hUQixcbiAgICBOT1JNQUxJWkFUSU9OX0ZPUk1BVF9ERUZBVUxULCBTVEFURV9GSU5BTCwgU1RBVEVfVFJBTlNMQVRFRH0gZnJvbSAnQG5neC1pMThuc3VwcG9ydC9uZ3gtaTE4bnN1cHBvcnQtbGliJztcbmltcG9ydCB7UHJvZ3JhbU9wdGlvbnMsIElDb25maWdGaWxlfSBmcm9tICcuL2kteGxpZmYtbWVyZ2Utb3B0aW9ucyc7XG5pbXBvcnQge05neFRyYW5zbGF0ZUV4dHJhY3Rvcn0gZnJvbSAnLi9uZ3gtdHJhbnNsYXRlLWV4dHJhY3Rvcic7XG5pbXBvcnQge1RyYW5zbGF0aW9uTWVzc2FnZXNGaWxlUmVhZGVyfSBmcm9tICcuL3RyYW5zbGF0aW9uLW1lc3NhZ2VzLWZpbGUtcmVhZGVyJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgb2YsIGZvcmtKb2lufSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBjYXRjaEVycm9yfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1hsaWZmTWVyZ2VBdXRvVHJhbnNsYXRlU2VydmljZX0gZnJvbSAnLi4vYXV0b3RyYW5zbGF0ZS94bGlmZi1tZXJnZS1hdXRvLXRyYW5zbGF0ZS1zZXJ2aWNlJztcbmltcG9ydCB7QXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnR9IGZyb20gJy4uL2F1dG90cmFuc2xhdGUvYXV0by10cmFuc2xhdGUtc3VtbWFyeS1yZXBvcnQnO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgbWFydGluIG9uIDE3LjAyLjIwMTcuXG4gKiBYbGlmZk1lcmdlIC0gcmVhZCB4bGlmZiBvciB4bWIgZmlsZSBhbmQgcHV0IHVudHJhbnNsYXRlZCBwYXJ0cyBpbiBsYW5ndWFnZSBzcGVjaWZpYyB4bGlmZiBvciB4bWIgZmlsZXMuXG4gKlxuICovXG5cbmV4cG9ydCBjbGFzcyBYbGlmZk1lcmdlIHtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tbWFuZE91dHB1dDogQ29tbWFuZE91dHB1dDtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgb3B0aW9uczogUHJvZ3JhbU9wdGlvbnM7XG5cbiAgICBwcml2YXRlIHBhcmFtZXRlcnM6IFhsaWZmTWVyZ2VQYXJhbWV0ZXJzO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlYWQgbWFzdGVyIHhsZiBmaWxlLlxuICAgICAqL1xuICAgIHByaXZhdGUgbWFzdGVyOiBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGU7IC8vIFhsaWZmRmlsZSBvciBYbGlmZjJGaWxlIG9yIFhtYkZpbGVcblxuICAgIHByaXZhdGUgYXV0b1RyYW5zbGF0ZVNlcnZpY2U6IFhsaWZmTWVyZ2VBdXRvVHJhbnNsYXRlU2VydmljZTtcblxuICAgIHN0YXRpYyBtYWluKGFyZ3Y6IHN0cmluZ1tdKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBYbGlmZk1lcmdlLnBhcnNlQXJncyhhcmd2KTtcbiAgICAgICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIG5ldyBYbGlmZk1lcmdlKG5ldyBDb21tYW5kT3V0cHV0KHByb2Nlc3Muc3Rkb3V0KSwgb3B0aW9ucykucnVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQocmVzdWx0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhdGljIHBhcnNlQXJncyhhcmd2OiBzdHJpbmdbXSk6IFByb2dyYW1PcHRpb25zIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogUHJvZ3JhbU9wdGlvbnMgPSB7XG4gICAgICAgICAgICBsYW5ndWFnZXM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIGZvciAobGV0IGkgPSAyOyBpIDwgYXJndi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYXJnID0gYXJndltpXTtcbiAgICAgICAgICAgIGlmIChhcmcgPT09ICctLXZlcnNpb24nIHx8IGFyZyA9PT0gJy12ZXJzaW9uJykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd4bGlmZm1lcmdlICcgKyBWRVJTSU9OKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnID09PSAnLS12ZXJib3NlJyB8fCBhcmcgPT09ICctdicpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnZlcmJvc2UgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgPT09ICctLXByb2ZpbGUnIHx8IGFyZyA9PT0gJy1wJykge1xuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICBpZiAoaSA+PSBhcmd2Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbWlzc2luZyBjb25maWcgZmlsZScpO1xuICAgICAgICAgICAgICAgICAgICBYbGlmZk1lcmdlLnNob3dVc2FnZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnByb2ZpbGVQYXRoID0gYXJndltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFyZyA9PT0gJy0tcXVpZXQnIHx8IGFyZyA9PT0gJy1xJykge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMucXVpZXQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcgPT09ICctLWhlbHAnIHx8IGFyZyA9PT0gJy1oZWxwJyB8fCBhcmcgPT09ICctaCcpIHtcbiAgICAgICAgICAgICAgICBYbGlmZk1lcmdlLnNob3dVc2FnZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoID4gMCAmJiBhcmcuY2hhckF0KDApID09PSAnLScpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndW5rbm93biBvcHRpb24nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5sYW5ndWFnZXMucHVzaChhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cblxuICAgIHN0YXRpYyBzaG93VXNhZ2UoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCd1c2FnZTogeGxpZmZtZXJnZSA8b3B0aW9uPiogPGxhbmd1YWdlPionKTtcbiAgICAgICAgY29uc29sZS5sb2coJ09wdGlvbnMnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1xcdC1wfC0tcHJvZmlsZSBhIGpzb24gY29uZmlndXJhdGlvbiBmaWxlIGNvbnRhaW5pbmcgYWxsIHJlbGV2YW50IHBhcmFtZXRlcnMuJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdcXHRcXHRmb3IgZGV0YWlscyBwbGVhc2UgY29uc3VsdCB0aGUgaG9tZSBwYWdlIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJ0aW5yb29iL25neC1pMThuc3VwcG9ydCcpO1xuICAgICAgICBjb25zb2xlLmxvZygnXFx0LXZ8LS12ZXJib3NlIHNob3cgc29tZSBvdXRwdXQgZm9yIGRlYnVnZ2luZyBwdXJwb3NlcycpO1xuICAgICAgICBjb25zb2xlLmxvZygnXFx0LXF8LS1xdWlldCBvbmx5IHNob3cgZXJyb3JzLCBub3RoaW5nIGVsc2UnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1xcdC12ZXJzaW9ufC0tdmVyc2lvbiBzaG93IHZlcnNpb24gc3RyaW5nJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1xcdDxsYW5ndWFnZT4gaGFzIHRvIGJlIGEgdmFsaWQgbGFuZ3VhZ2Ugc2hvcnQgc3RyaW5nLCBlLGcuIFwiZW5cIiwgXCJkZVwiLCBcImRlLWNoXCInKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGb3IgVGVzdHMsIGNyZWF0ZSBpbnN0YW5jZSB3aXRoIGdpdmVuIHByb2ZpbGVcbiAgICAgKiBAcGFyYW0gY29tbWFuZE91dHB1dCBjb21tYW5kT3V0cHV0XG4gICAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9uc1xuICAgICAqIEBwYXJhbSBwcm9maWxlQ29udGVudCBwcm9maWxlQ29udGVudFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRnJvbU9wdGlvbnMoY29tbWFuZE91dHB1dDogQ29tbWFuZE91dHB1dCwgb3B0aW9uczogUHJvZ3JhbU9wdGlvbnMsIHByb2ZpbGVDb250ZW50PzogSUNvbmZpZ0ZpbGUpIHtcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgWGxpZmZNZXJnZShjb21tYW5kT3V0cHV0LCBvcHRpb25zKTtcbiAgICAgICAgaW5zdGFuY2UucGFyYW1ldGVycyA9IFhsaWZmTWVyZ2VQYXJhbWV0ZXJzLmNyZWF0ZUZyb21PcHRpb25zKG9wdGlvbnMsIHByb2ZpbGVDb250ZW50KTtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNvbW1hbmRPdXRwdXQ6IENvbW1hbmRPdXRwdXQsIG9wdGlvbnM6IFByb2dyYW1PcHRpb25zKSB7XG4gICAgICAgIHRoaXMuY29tbWFuZE91dHB1dCA9IGNvbW1hbmRPdXRwdXQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBjb21tYW5kLlxuICAgICAqIFRoaXMgcnVucyBhc3luYy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tGdW5jdGlvbiB3aGVuIGNvbW1hbmQgaXMgZXhlY3V0ZWQsIGNhbGxlZCB3aXRoIHRoZSByZXR1cm4gY29kZSAoMCBmb3Igb2spLCBpZiBnaXZlbi5cbiAgICAgKiBAcGFyYW0gZXJyb3JGdW5jdGlvbiBjYWxsYmFja0Z1bmN0aW9uIGZvciBlcnJvciBoYW5kbGluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBydW4oY2FsbGJhY2tGdW5jdGlvbj86ICgocmV0Y29kZTogbnVtYmVyKSA9PiBhbnkpLCBlcnJvckZ1bmN0aW9uPzogKChlcnJvcjogYW55KSA9PiBhbnkpKSB7XG4gICAgICAgIHRoaXMucnVuQXN5bmMoKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgocmV0Y29kZTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChjYWxsYmFja0Z1bmN0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja0Z1bmN0aW9uKHJldGNvZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQoZXJyb3JGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JGdW5jdGlvbihlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBtZXJnZS1Qcm9jZXNzLlxuICAgICAqIEByZXR1cm4gQXN5bmMgb3BlcmF0aW9uLCBvbiBjb21wbGV0aW9uIHJldHVybnMgcmV0Y29kZSAwPW9rLCBvdGhlciA9IGVycm9yLlxuICAgICAqL1xuICAgIHB1YmxpYyBydW5Bc3luYygpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5xdWlldCkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0LnNldFF1aWV0KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMudmVyYm9zZSkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0LnNldFZlcmJvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMucGFyYW1ldGVycykge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gWGxpZmZNZXJnZVBhcmFtZXRlcnMuY3JlYXRlRnJvbU9wdGlvbnModGhpcy5vcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbW1hbmRPdXRwdXQuaW5mbygneGxpZmZtZXJnZSB2ZXJzaW9uICVzJywgVkVSU0lPTik7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtZXRlcnMudmVyYm9zZSgpKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMuc2hvd0FsbFBhcmFtZXRlcnModGhpcy5jb21tYW5kT3V0cHV0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJhbWV0ZXJzLmVycm9yc0ZvdW5kLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZXJyIG9mIHRoaXMucGFyYW1ldGVycy5lcnJvcnNGb3VuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZE91dHB1dC5lcnJvcihlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2YoLTEpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcmFtZXRlcnMud2FybmluZ3NGb3VuZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHdhcm4gb2YgdGhpcy5wYXJhbWV0ZXJzLndhcm5pbmdzRm91bmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1hbmRPdXRwdXQud2Fybih3YXJuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlYWRNYXN0ZXIoKTtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1ldGVycy5hdXRvdHJhbnNsYXRlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYXV0b1RyYW5zbGF0ZVNlcnZpY2UgPSBuZXcgWGxpZmZNZXJnZUF1dG9UcmFuc2xhdGVTZXJ2aWNlKHRoaXMucGFyYW1ldGVycy5hcGlrZXkoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXhlY3V0aW9uRm9yQWxsTGFuZ3VhZ2VzOiBPYnNlcnZhYmxlPG51bWJlcj5bXSA9IFtdO1xuICAgICAgICB0aGlzLnBhcmFtZXRlcnMubGFuZ3VhZ2VzKCkuZm9yRWFjaCgobGFuZzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBleGVjdXRpb25Gb3JBbGxMYW5ndWFnZXMucHVzaCh0aGlzLnByb2Nlc3NMYW5ndWFnZShsYW5nKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZm9ya0pvaW4oZXhlY3V0aW9uRm9yQWxsTGFuZ3VhZ2VzKS5waXBlKFxuICAgICAgICAgICAgbWFwKChyZXRjb2RlczogbnVtYmVyW10pID0+IHRoaXMudG90YWxSZXRjb2RlKHJldGNvZGVzKSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdpdmUgYW4gYXJyYXkgb2YgcmV0Y29kZXMgZm9yIHRoZSBkaWZmZXJlbnQgbGFuZ3VhZ2VzLCByZXR1cm4gdGhlIHRvdGFsIHJldGNvZGUuXG4gICAgICogSWYgYWxsIGFyZSAwLCBpdCBpcyAwLCBvdGhlcndpc2UgdGhlIGZpcnN0IG5vbiB6ZXJvLlxuICAgICAqIEBwYXJhbSByZXRjb2RlcyByZXRjb2Rlc1xuICAgICAqIEByZXR1cm4gbnVtYmVyXG4gICAgICovXG4gICAgcHJpdmF0ZSB0b3RhbFJldGNvZGUocmV0Y29kZXM6IG51bWJlcltdKTogbnVtYmVyIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXRjb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJldGNvZGVzW2ldICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldGNvZGVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgbmFtZSBvZiB0aGUgZ2VuZXJhdGVkIGZpbGUgZm9yIGdpdmVuIGxhbmcuXG4gICAgICogQHBhcmFtIGxhbmcgbGFuZ3VhZ2VcbiAgICAgKiBAcmV0dXJuIG5hbWUgb2YgZ2VuZXJhdGVkIGZpbGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuZXJhdGVkSTE4bkZpbGUobGFuZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1ldGVycy5nZW5lcmF0ZWRJMThuRmlsZShsYW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIG5hbWUgb2YgdGhlIGdlbmVyYXRlZCBuZ3gtdHJhbnNsYXRpb24gZmlsZSBmb3IgZ2l2ZW4gbGFuZy5cbiAgICAgKiBAcGFyYW0gbGFuZyBsYW5ndWFnZVxuICAgICAqIEByZXR1cm4gbmFtZSBvZiB0cmFuc2xhdGUgZmlsZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZW5lcmF0ZWROZ3hUcmFuc2xhdGVGaWxlKGxhbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmFtZXRlcnMuZ2VuZXJhdGVkTmd4VHJhbnNsYXRlRmlsZShsYW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXYXJuaW5ncyBmb3VuZCBkdXJpbmcgdGhlIHJ1bi5cbiAgICAgKiBAcmV0dXJuIHdhcm5pbmdzXG4gICAgICovXG4gICAgcHVibGljIHdhcm5pbmdzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyYW1ldGVycy53YXJuaW5nc0ZvdW5kO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVhZE1hc3RlcigpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMubWFzdGVyID0gVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGVSZWFkZXIuZnJvbUZpbGUoXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLmkxOG5Gb3JtYXQoKSxcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMuaTE4bkZpbGUoKSxcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMuZW5jb2RpbmcoKSk7XG4gICAgICAgICAgICB0aGlzLm1hc3Rlci53YXJuaW5ncygpLmZvckVhY2goKHdhcm5pbmc6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZE91dHB1dC53YXJuKHdhcm5pbmcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IHRoaXMubWFzdGVyLm51bWJlck9mVHJhbnNVbml0cygpO1xuICAgICAgICAgICAgY29uc3QgbWlzc2luZ0lkQ291bnQgPSB0aGlzLm1hc3Rlci5udW1iZXJPZlRyYW5zVW5pdHNXaXRoTWlzc2luZ0lkKCk7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRPdXRwdXQuaW5mbygnbWFzdGVyIGNvbnRhaW5zICVzIHRyYW5zLXVuaXRzJywgY291bnQpO1xuICAgICAgICAgICAgaWYgKG1pc3NpbmdJZENvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZE91dHB1dC53YXJuKCdtYXN0ZXIgY29udGFpbnMgJXMgdHJhbnMtdW5pdHMsIGJ1dCB0aGVyZSBhcmUgJXMgd2l0aG91dCBpZCcsIGNvdW50LCBtaXNzaW5nSWRDb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VMYW5nOiBzdHJpbmcgPSB0aGlzLm1hc3Rlci5zb3VyY2VMYW5ndWFnZSgpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUxhbmcgJiYgc291cmNlTGFuZyAhPT0gdGhpcy5wYXJhbWV0ZXJzLmRlZmF1bHRMYW5ndWFnZSgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0Lndhcm4oXG4gICAgICAgICAgICAgICAgICAgICdtYXN0ZXIgc2F5cyB0byBoYXZlIHNvdXJjZS1sYW5ndWFnZT1cIiVzXCIsIHNob3VsZCBiZSBcIiVzXCIgKHlvdXIgZGVmYXVsdExhbmd1YWdlKScsXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUxhbmcsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5kZWZhdWx0TGFuZ3VhZ2UoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXN0ZXIuc2V0U291cmNlTGFuZ3VhZ2UodGhpcy5wYXJhbWV0ZXJzLmRlZmF1bHRMYW5ndWFnZSgpKTtcbiAgICAgICAgICAgICAgICBUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZVJlYWRlci5zYXZlKHRoaXMubWFzdGVyLCB0aGlzLnBhcmFtZXRlcnMuYmVhdXRpZnlPdXRwdXQoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0Lndhcm4oJ2NoYW5nZWQgbWFzdGVyIHNvdXJjZS1sYW5ndWFnZT1cIiVzXCIgdG8gXCIlc1wiJywgc291cmNlTGFuZywgdGhpcy5wYXJhbWV0ZXJzLmRlZmF1bHRMYW5ndWFnZSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgWGxpZmZNZXJnZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0LmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2YoLTEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB1bmhhbmRsZWRcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50RmlsZW5hbWUgPSB0aGlzLnBhcmFtZXRlcnMuaTE4bkZpbGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlbmFtZVN0cmluZyA9IChjdXJyZW50RmlsZW5hbWUpID8gZm9ybWF0KCdmaWxlIFwiJXNcIiwgJywgY3VycmVudEZpbGVuYW1lKSA6ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZE91dHB1dC5lcnJvcihmaWxlbmFtZVN0cmluZyArICdvb3BzICcgKyBlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgdGhlIGdpdmVuIGxhbmd1YWdlLlxuICAgICAqIEFzeW5jIG9wZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0gbGFuZyBsYW5ndWFnZVxuICAgICAqIEByZXR1cm4gb24gY29tcGxldGlvbiAwIGZvciBvaywgb3RoZXIgZm9yIGVycm9yXG4gICAgICovXG4gICAgcHJpdmF0ZSBwcm9jZXNzTGFuZ3VhZ2UobGFuZzogc3RyaW5nKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0LmRlYnVnKCdwcm9jZXNzaW5nIGxhbmd1YWdlICVzJywgbGFuZyk7XG4gICAgICAgIGNvbnN0IGxhbmd1YWdlWGxpZmZGaWxlID0gdGhpcy5wYXJhbWV0ZXJzLmdlbmVyYXRlZEkxOG5GaWxlKGxhbmcpO1xuICAgICAgICBjb25zdCBjdXJyZW50RmlsZW5hbWUgPSBsYW5ndWFnZVhsaWZmRmlsZTtcbiAgICAgICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZTx2b2lkPjtcbiAgICAgICAgaWYgKCFGaWxlVXRpbC5leGlzdHMobGFuZ3VhZ2VYbGlmZkZpbGUpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmNyZWF0ZVVudHJhbnNsYXRlZFhsaWZmKGxhbmcsIGxhbmd1YWdlWGxpZmZGaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMubWVyZ2VNYXN0ZXJUbyhsYW5nLCBsYW5ndWFnZVhsaWZmRmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgLnBpcGUobWFwKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJhbWV0ZXJzLnN1cHBvcnROZ3hUcmFuc2xhdGUoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlOiBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGVSZWFkZXIuZnJvbUZpbGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2xhdGlvbkZvcm1hdCh0aGlzLnBhcmFtZXRlcnMuaTE4bkZvcm1hdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZVhsaWZmRmlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMuZW5jb2RpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hc3Rlci5maWxlbmFtZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgTmd4VHJhbnNsYXRlRXh0cmFjdG9yLmV4dHJhY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLm5neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuKCksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMuZ2VuZXJhdGVkTmd4VHJhbnNsYXRlRmlsZShsYW5nKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSksIGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBYbGlmZk1lcmdlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0LmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKC0xKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyB1bmhhbmRsZWRcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZW5hbWVTdHJpbmcgPSAoY3VycmVudEZpbGVuYW1lKSA/IGZvcm1hdCgnZmlsZSBcIiVzXCIsICcsIGN1cnJlbnRGaWxlbmFtZSkgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0LmVycm9yKGZpbGVuYW1lU3RyaW5nICsgJ29vcHMgJyArIGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY3JlYXRlIGEgbmV3IGZpbGUgZm9yIHRoZSBsYW5ndWFnZSwgd2hpY2ggY29udGFpbnMgbm8gdHJhbnNsYXRpb25zLCBidXQgYWxsIGtleXMuXG4gICAgICogaW4gcHJpbmNpcGxlLCB0aGlzIGlzIGp1c3QgYSBjb3B5IG9mIHRoZSBtYXN0ZXIgd2l0aCB0YXJnZXQtbGFuZ3VhZ2Ugc2V0LlxuICAgICAqIEBwYXJhbSBsYW5nIGxhbmd1YWdlXG4gICAgICogQHBhcmFtIGxhbmd1YWdlWGxpZmZGaWxlUGF0aCBuYW1lIG9mIGZpbGVcbiAgICAgKi9cbiAgICBwcml2YXRlIGNyZWF0ZVVudHJhbnNsYXRlZFhsaWZmKGxhbmc6IHN0cmluZywgbGFuZ3VhZ2VYbGlmZkZpbGVQYXRoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICAgICAgLy8gY29weSBtYXN0ZXIgLi4uXG4gICAgICAgIC8vIGFuZCBzZXQgdGFyZ2V0LWxhbmd1YWdlXG4gICAgICAgIC8vIGFuZCBjb3B5IHNvdXJjZSB0byB0YXJnZXQgaWYgbmVjZXNzYXJ5XG4gICAgICAgIGNvbnN0IGlzRGVmYXVsdExhbmc6IGJvb2xlYW4gPSAobGFuZyA9PT0gdGhpcy5wYXJhbWV0ZXJzLmRlZmF1bHRMYW5ndWFnZSgpKTtcbiAgICAgICAgdGhpcy5tYXN0ZXIuc2V0TmV3VHJhbnNVbml0VGFyZ2V0UHJhZWZpeCh0aGlzLnBhcmFtZXRlcnMudGFyZ2V0UHJhZWZpeCgpKTtcbiAgICAgICAgdGhpcy5tYXN0ZXIuc2V0TmV3VHJhbnNVbml0VGFyZ2V0U3VmZml4KHRoaXMucGFyYW1ldGVycy50YXJnZXRTdWZmaXgoKSk7XG4gICAgICAgIGNvbnN0IGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGU6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSA9XG4gICAgICAgICAgICB0aGlzLm1hc3Rlci5jcmVhdGVUcmFuc2xhdGlvbkZpbGVGb3JMYW5nKGxhbmcsIGxhbmd1YWdlWGxpZmZGaWxlUGF0aCwgaXNEZWZhdWx0TGFuZywgdGhpcy5wYXJhbWV0ZXJzLnVzZVNvdXJjZUFzVGFyZ2V0KCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRvVHJhbnNsYXRlKHRoaXMubWFzdGVyLnNvdXJjZUxhbmd1YWdlKCksIGxhbmcsIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGUpLnBpcGUoXG4gICAgICAgICAgICBtYXAoKC8qIHN1bW1hcnkgKi8pID0+IHtcbiAgICAgICAgICAgIC8vIHdyaXRlIGl0IHRvIGZpbGVcbiAgICAgICAgICAgIFRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlUmVhZGVyLnNhdmUobGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZSwgdGhpcy5wYXJhbWV0ZXJzLmJlYXV0aWZ5T3V0cHV0KCkpO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0LmluZm8oJ2NyZWF0ZWQgbmV3IGZpbGUgXCIlc1wiIGZvciB0YXJnZXQtbGFuZ3VhZ2U9XCIlc1wiJywgbGFuZ3VhZ2VYbGlmZkZpbGVQYXRoLCBsYW5nKTtcbiAgICAgICAgICAgIGlmICghaXNEZWZhdWx0TGFuZykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZE91dHB1dC53YXJuKCdwbGVhc2UgdHJhbnNsYXRlIGZpbGUgXCIlc1wiIHRvIHRhcmdldC1sYW5ndWFnZT1cIiVzXCInLCBsYW5ndWFnZVhsaWZmRmlsZVBhdGgsIGxhbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNYXAgdGhlIGlucHV0IGZvcm1hdCB0byB0aGUgZm9ybWF0IG9mIHRoZSB0cmFuc2xhdGlvbi5cbiAgICAgKiBOb3JtYWxseSB0aGV5IGFyZSB0aGUgc2FtZSBidXQgZm9yIHhtYiB0aGUgdHJhbnNsYXRpb24gZm9ybWF0IGlzIHh0Yi5cbiAgICAgKiBAcGFyYW0gaTE4bkZvcm1hdCBmb3JtYXRcbiAgICAgKi9cbiAgICBwcml2YXRlIHRyYW5zbGF0aW9uRm9ybWF0KGkxOG5Gb3JtYXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGlmIChpMThuRm9ybWF0ID09PSBGT1JNQVRfWE1CKSB7XG4gICAgICAgICAgICByZXR1cm4gRk9STUFUX1hUQjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpMThuRm9ybWF0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWVyZ2UgYWxsXG4gICAgICogQHBhcmFtIGxhbmcgbGFuZ3VhZ2VcbiAgICAgKiBAcGFyYW0gbGFuZ3VhZ2VYbGlmZkZpbGVQYXRoIGZpbGVuYW1lXG4gICAgICovXG4gICAgcHJpdmF0ZSBtZXJnZU1hc3RlclRvKGxhbmc6IHN0cmluZywgbGFuZ3VhZ2VYbGlmZkZpbGVQYXRoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICAgICAgLy8gcmVhZCBsYW5nIHNwZWNpZmljIGZpbGVcbiAgICAgICAgY29uc3QgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZTogSVRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlID1cbiAgICAgICAgICAgIFRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlUmVhZGVyLmZyb21GaWxlKFxuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNsYXRpb25Gb3JtYXQodGhpcy5wYXJhbWV0ZXJzLmkxOG5Gb3JtYXQoKSksXG4gICAgICAgICAgICAgICAgbGFuZ3VhZ2VYbGlmZkZpbGVQYXRoLFxuICAgICAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycy5lbmNvZGluZygpKTtcbiAgICAgICAgY29uc3QgaXNEZWZhdWx0TGFuZzogYm9vbGVhbiA9IChsYW5nID09PSB0aGlzLnBhcmFtZXRlcnMuZGVmYXVsdExhbmd1YWdlKCkpO1xuICAgICAgICBsZXQgbmV3Q291bnQgPSAwO1xuICAgICAgICBsZXQgY29ycmVjdFNvdXJjZUNvbnRlbnRDb3VudCA9IDA7XG4gICAgICAgIGxldCBjb3JyZWN0U291cmNlUmVmQ291bnQgPSAwO1xuICAgICAgICBsZXQgY29ycmVjdERlc2NyaXB0aW9uT3JNZWFuaW5nQ291bnQgPSAwO1xuICAgICAgICBsZXQgaWRDaGFuZ2VkQ291bnQgPSAwO1xuICAgICAgICBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlLnNldE5ld1RyYW5zVW5pdFRhcmdldFByYWVmaXgodGhpcy5wYXJhbWV0ZXJzLnRhcmdldFByYWVmaXgoKSk7XG4gICAgICAgIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGUuc2V0TmV3VHJhbnNVbml0VGFyZ2V0U3VmZml4KHRoaXMucGFyYW1ldGVycy50YXJnZXRTdWZmaXgoKSk7XG4gICAgICAgIGxldCBsYXN0UHJvY2Vzc2VkVW5pdDogSVRyYW5zVW5pdCA9IG51bGw7XG4gICAgICAgIHRoaXMubWFzdGVyLmZvckVhY2hUcmFuc1VuaXQoKG1hc3RlclRyYW5zVW5pdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHJhbnNVbml0OiBJVHJhbnNVbml0ID0gbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZS50cmFuc1VuaXRXaXRoSWQobWFzdGVyVHJhbnNVbml0LmlkKTtcblxuICAgICAgICAgICAgaWYgKCF0cmFuc1VuaXQpIHtcbiAgICAgICAgICAgICAgICAvLyBvb3BzLCBubyB0cmFuc2xhdGlvbiwgbXVzdCBiZSBhIG5ldyBrZXksIHNvIGFkZCBpdFxuICAgICAgICAgICAgICAgIGxldCBuZXdVbml0O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtZXRlcnMuYWxsb3dJZENoYW5nZSgpXG4gICAgICAgICAgICAgICAgICAgICYmIChuZXdVbml0ID0gdGhpcy5wcm9jZXNzQ2hhbmdlZElkVW5pdChtYXN0ZXJUcmFuc1VuaXQsIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGUsIGxhc3RQcm9jZXNzZWRVbml0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFByb2Nlc3NlZFVuaXQgPSBuZXdVbml0O1xuICAgICAgICAgICAgICAgICAgICBpZENoYW5nZWRDb3VudCsrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RQcm9jZXNzZWRVbml0ID0gbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZS5pbXBvcnROZXdUcmFuc1VuaXQoXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXN0ZXJUcmFuc1VuaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0RlZmF1bHRMYW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzLnVzZVNvdXJjZUFzVGFyZ2V0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5wYXJhbWV0ZXJzLnByZXNlcnZlT3JkZXIoKSkgPyBsYXN0UHJvY2Vzc2VkVW5pdCA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgY2hhbmdlZCBzb3VyY2UgY29udGVudCBhbmQgY2hhbmdlIGl0IGlmIG5lZWRlZFxuICAgICAgICAgICAgICAgIC8vIChjYW4gb25seSBoYXBwZW4gaWYgSUQgaXMgZXhwbGljaXRlbHkgc2V0LCBvdGhlcndpc2UgSUQgd291bGQgY2hhbmdlIGlmIHNvdXJjZSBjb250ZW50IGlzIGNoYW5nZWQuXG4gICAgICAgICAgICAgICAgaWYgKHRyYW5zVW5pdC5zdXBwb3J0c1NldFNvdXJjZUNvbnRlbnQoKSAmJiAhdGhpcy5hcmVTb3VyY2VzTmVhcmx5RXF1YWwobWFzdGVyVHJhbnNVbml0LCB0cmFuc1VuaXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zVW5pdC5zZXRTb3VyY2VDb250ZW50KG1hc3RlclRyYW5zVW5pdC5zb3VyY2VDb250ZW50KCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNEZWZhdWx0TGFuZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gIzgxIGNoYW5nZWQgc291cmNlIG11c3QgYmUgY29waWVkIHRvIHRhcmdldCBmb3IgZGVmYXVsdCBsYW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc1VuaXQudHJhbnNsYXRlKG1hc3RlclRyYW5zVW5pdC5zb3VyY2VDb250ZW50KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNVbml0LnNldFRhcmdldFN0YXRlKFNUQVRFX0ZJTkFMKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc1VuaXQudGFyZ2V0U3RhdGUoKSA9PT0gU1RBVEVfRklOQUwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzb3VyY2UgaXMgY2hhbmdlZCwgc28gdHJhbnNsYXRpb24gaGFzIHRvIGJlIGNoZWNrZWQgYWdhaW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc1VuaXQuc2V0VGFyZ2V0U3RhdGUoU1RBVEVfVFJBTlNMQVRFRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdFNvdXJjZUNvbnRlbnRDb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3IgbWlzc2luZyBvciBjaGFuZ2VkIHNvdXJjZSByZWYgYW5kIGFkZCBpdCBpZiBuZWVkZWRcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNVbml0LnN1cHBvcnRzU2V0U291cmNlUmVmZXJlbmNlcygpXG4gICAgICAgICAgICAgICAgICAgICYmICF0aGlzLmFyZVNvdXJjZVJlZmVyZW5jZXNFcXVhbChtYXN0ZXJUcmFuc1VuaXQuc291cmNlUmVmZXJlbmNlcygpLCB0cmFuc1VuaXQuc291cmNlUmVmZXJlbmNlcygpKSkge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc1VuaXQuc2V0U291cmNlUmVmZXJlbmNlcyhtYXN0ZXJUcmFuc1VuaXQuc291cmNlUmVmZXJlbmNlcygpKTtcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdFNvdXJjZVJlZkNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBjaGFuZ2VkIGRlc2NyaXB0aW9uIG9yIG1lYW5pbmdcbiAgICAgICAgICAgICAgICBpZiAodHJhbnNVbml0LnN1cHBvcnRzU2V0RGVzY3JpcHRpb25BbmRNZWFuaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zVW5pdC5kZXNjcmlwdGlvbigpICE9PSBtYXN0ZXJUcmFuc1VuaXQuZGVzY3JpcHRpb24oKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNVbml0LnNldERlc2NyaXB0aW9uKG1hc3RlclRyYW5zVW5pdC5kZXNjcmlwdGlvbigpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc1VuaXQubWVhbmluZygpICE9PSBtYXN0ZXJUcmFuc1VuaXQubWVhbmluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc1VuaXQuc2V0TWVhbmluZyhtYXN0ZXJUcmFuc1VuaXQubWVhbmluZygpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3JyZWN0RGVzY3JpcHRpb25Pck1lYW5pbmdDb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RQcm9jZXNzZWRVbml0ID0gdHJhbnNVbml0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG5ld0NvdW50ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0Lndhcm4oJ21lcmdlZCAlcyB0cmFucy11bml0cyBmcm9tIG1hc3RlciB0byBcIiVzXCInLCBuZXdDb3VudCwgbGFuZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvcnJlY3RTb3VyY2VDb250ZW50Q291bnQgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRPdXRwdXQud2FybigndHJhbnNmZXJyZWQgJXMgY2hhbmdlZCBzb3VyY2UgY29udGVudCBmcm9tIG1hc3RlciB0byBcIiVzXCInLCBjb3JyZWN0U291cmNlQ29udGVudENvdW50LCBsYW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29ycmVjdFNvdXJjZVJlZkNvdW50ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0Lndhcm4oJ3RyYW5zZmVycmVkICVzIHNvdXJjZSByZWZlcmVuY2VzIGZyb20gbWFzdGVyIHRvIFwiJXNcIicsIGNvcnJlY3RTb3VyY2VSZWZDb3VudCwgbGFuZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkQ2hhbmdlZENvdW50ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0Lndhcm4oJ2ZvdW5kICVzIGNoYW5nZWQgaWRcXCdzIGluIFwiJXNcIicsIGlkQ2hhbmdlZENvdW50LCBsYW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29ycmVjdERlc2NyaXB0aW9uT3JNZWFuaW5nQ291bnQgPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmNvbW1hbmRPdXRwdXQud2FybihcbiAgICAgICAgICAgICAgICAndHJhbnNmZXJyZWQgJXMgY2hhbmdlZCBkZXNjcmlwdGlvbnMvbWVhbmluZ3MgZnJvbSBtYXN0ZXIgdG8gXCIlc1wiJywgY29ycmVjdERlc2NyaXB0aW9uT3JNZWFuaW5nQ291bnQsIGxhbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBlbGVtZW50cyB0aGF0IGFyZSBubyBsb25nZXIgdXNlZFxuICAgICAgICBsZXQgcmVtb3ZlQ291bnQgPSAwO1xuICAgICAgICBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlLmZvckVhY2hUcmFuc1VuaXQoKHRyYW5zVW5pdDogSVRyYW5zVW5pdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RzSW5NYXN0ZXIgPSAhaXNOdWxsT3JVbmRlZmluZWQodGhpcy5tYXN0ZXIudHJhbnNVbml0V2l0aElkKHRyYW5zVW5pdC5pZCkpO1xuICAgICAgICAgICAgaWYgKCFleGlzdHNJbk1hc3Rlcikge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtZXRlcnMucmVtb3ZlVW51c2VkSWRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZS5yZW1vdmVUcmFuc1VuaXRXaXRoSWQodHJhbnNVbml0LmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVtb3ZlQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZW1vdmVDb3VudCA+IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtZXRlcnMucmVtb3ZlVW51c2VkSWRzKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1hbmRPdXRwdXQud2FybigncmVtb3ZlZCAlcyB1bnVzZWQgdHJhbnMtdW5pdHMgaW4gXCIlc1wiJywgcmVtb3ZlQ291bnQsIGxhbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1hbmRPdXRwdXQud2Fybigna2VlcGluZyAlcyB1bnVzZWQgdHJhbnMtdW5pdHMgaW4gXCIlc1wiLCBiZWNhdXNlIHJlbW92ZVVudXNlZCBpcyBkaXNhYmxlZCcsIHJlbW92ZUNvdW50LCBsYW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdDb3VudCA9PT0gMCAmJiByZW1vdmVDb3VudCA9PT0gMCAmJiBjb3JyZWN0U291cmNlQ29udGVudENvdW50ID09PSAwXG4gICAgICAgICAgICAmJiBjb3JyZWN0U291cmNlUmVmQ291bnQgPT09IDAgJiYgY29ycmVjdERlc2NyaXB0aW9uT3JNZWFuaW5nQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWFuZE91dHB1dC5pbmZvKCdmaWxlIGZvciBcIiVzXCIgd2FzIHVwIHRvIGRhdGUnLCBsYW5nKTtcbiAgICAgICAgICAgIHJldHVybiBvZihudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF1dG9UcmFuc2xhdGUodGhpcy5tYXN0ZXIuc291cmNlTGFuZ3VhZ2UoKSwgbGFuZywgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZSlcbiAgICAgICAgICAgICAgICAucGlwZShtYXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyB3cml0ZSBpdCB0byBmaWxlXG4gICAgICAgICAgICAgICAgICAgIFRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlUmVhZGVyLnNhdmUobGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZSwgdGhpcy5wYXJhbWV0ZXJzLmJlYXV0aWZ5T3V0cHV0KCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbW1hbmRPdXRwdXQuaW5mbygndXBkYXRlZCBmaWxlIFwiJXNcIiBmb3IgdGFyZ2V0LWxhbmd1YWdlPVwiJXNcIicsIGxhbmd1YWdlWGxpZmZGaWxlUGF0aCwgbGFuZyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdDb3VudCA+IDAgJiYgIWlzRGVmYXVsdExhbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZE91dHB1dC53YXJuKCdwbGVhc2UgdHJhbnNsYXRlIGZpbGUgXCIlc1wiIHRvIHRhcmdldC1sYW5ndWFnZT1cIiVzXCInLCBsYW5ndWFnZVhsaWZmRmlsZVBhdGgsIGxhbmcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgY2FzZSBvZiBjaGFuZ2VkIGlkIGR1ZSB0byBzbWFsbCB3aGl0ZSBzcGFjZSBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSBtYXN0ZXJUcmFuc1VuaXQgdW5pdCBpbiBtYXN0ZXIgZmlsZVxuICAgICAqIEBwYXJhbSBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlIHRyYW5zbGF0aW9uIGZpbGVcbiAgICAgKiBAcGFyYW0gbGFzdFByb2Nlc3NlZFVuaXQgVW5pdCBiZWZvcmUgdGhlIG9uZSBwcm9jZXNzZWQgaGVyZS4gTmV3IHVuaXQgd2lsbCBiZSBpbnNlcnRlZCBhZnRlciB0aGlzIG9uZS5cbiAgICAgKiBAcmV0dXJuIHByb2Nlc3NlZCB1bml0LCBpZiBkb25lLCBudWxsIGlmIG5vIGNoYW5nZWQgdW5pdCBmb3VuZFxuICAgICAqL1xuICAgIHByaXZhdGUgcHJvY2Vzc0NoYW5nZWRJZFVuaXQoXG4gICAgICAgIG1hc3RlclRyYW5zVW5pdDogSVRyYW5zVW5pdCxcbiAgICAgICAgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZTogSVRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlLFxuICAgICAgICBsYXN0UHJvY2Vzc2VkVW5pdDogSVRyYW5zVW5pdCk6IElUcmFuc1VuaXQge1xuXG4gICAgICAgIGxldCBjaGFuZ2VkVHJhbnNVbml0OiBJVHJhbnNVbml0ID0gbnVsbDtcbiAgICAgICAgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZS5mb3JFYWNoVHJhbnNVbml0KChsYW5ndWFnZVRyYW5zVW5pdCkgPT4ge1xuICAgICAgICAgICAgIGlmICh0aGlzLmFyZVNvdXJjZXNOZWFybHlFcXVhbChsYW5ndWFnZVRyYW5zVW5pdCwgbWFzdGVyVHJhbnNVbml0KSkge1xuICAgICAgICAgICAgICAgICBjaGFuZ2VkVHJhbnNVbml0ID0gbGFuZ3VhZ2VUcmFuc1VuaXQ7XG4gICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFjaGFuZ2VkVHJhbnNVbml0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZXJnZWRUcmFuc1VuaXQgPSBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlLmltcG9ydE5ld1RyYW5zVW5pdChcbiAgICAgICAgICAgIG1hc3RlclRyYW5zVW5pdCxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAodGhpcy5wYXJhbWV0ZXJzLnByZXNlcnZlT3JkZXIoKSkgPyBsYXN0UHJvY2Vzc2VkVW5pdCA6IHVuZGVmaW5lZCk7XG4gICAgICAgIGNvbnN0IHRyYW5zbGF0ZWRDb250ZW50ID0gY2hhbmdlZFRyYW5zVW5pdC50YXJnZXRDb250ZW50KCk7XG4gICAgICAgIGlmICh0cmFuc2xhdGVkQ29udGVudCkgeyAvLyBpc3N1ZSAjNjggc2V0IHRyYW5zbGF0ZWQgb25seSwgaWYgaXQgaXMgcmVhbGx5IHRyYW5zbGF0ZWRcbiAgICAgICAgICAgIG1lcmdlZFRyYW5zVW5pdC50cmFuc2xhdGUodHJhbnNsYXRlZENvbnRlbnQpO1xuICAgICAgICAgICAgbWVyZ2VkVHJhbnNVbml0LnNldFRhcmdldFN0YXRlKFNUQVRFX1RSQU5TTEFURUQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXJnZWRUcmFuc1VuaXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGVzdCB3ZXRoZXIgdGhlIHNvdXJjZXMgb2YgMiB0cmFucyB1bml0cyBhcmUgZXF1YWwgaWdub3Jpbmcgd2hpdGUgc3BhY2VzLlxuICAgICAqIEBwYXJhbSB0dTEgdHUxXG4gICAgICogQHBhcmFtIHR1MiB0dTJcbiAgICAgKi9cbiAgICBwcml2YXRlIGFyZVNvdXJjZXNOZWFybHlFcXVhbCh0dTE6IElUcmFuc1VuaXQsIHR1MjogSVRyYW5zVW5pdCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoKHR1MSAmJiAhdHUyKSB8fCAodHUyICYmICF0dTEpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdHUxTm9ybWFsaXplZCA9IHR1MS5zb3VyY2VDb250ZW50Tm9ybWFsaXplZCgpO1xuICAgICAgICBjb25zdCB0dTJOb3JtYWxpemVkID0gdHUyLnNvdXJjZUNvbnRlbnROb3JtYWxpemVkKCk7XG4gICAgICAgIGlmICh0dTFOb3JtYWxpemVkLmlzSUNVTWVzc2FnZSgpKSB7XG4gICAgICAgICAgICBpZiAodHUyTm9ybWFsaXplZC5pc0lDVU1lc3NhZ2UoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGljdTFOb3JtYWxpemVkID0gdHUxTm9ybWFsaXplZC5nZXRJQ1VNZXNzYWdlKCkuYXNOYXRpdmVTdHJpbmcoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaWN1Mk5vcm1hbGl6ZWQgPSB0dTJOb3JtYWxpemVkLmdldElDVU1lc3NhZ2UoKS5hc05hdGl2ZVN0cmluZygpLnRyaW0oKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWN1MU5vcm1hbGl6ZWQgPT09IGljdTJOb3JtYWxpemVkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR1MU5vcm1hbGl6ZWQuY29udGFpbnNJQ1VNZXNzYWdlUmVmKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGljdXJlZjFOb3JtYWxpemVkID0gdHUxTm9ybWFsaXplZC5hc05hdGl2ZVN0cmluZygpLnRyaW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGljdXJlZjJOb3JtYWxpemVkID0gdHUyTm9ybWFsaXplZC5hc05hdGl2ZVN0cmluZygpLnRyaW0oKTtcbiAgICAgICAgICAgIHJldHVybiBpY3VyZWYxTm9ybWFsaXplZCA9PT0gaWN1cmVmMk5vcm1hbGl6ZWQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgczFOb3JtYWxpemVkID0gdHUxTm9ybWFsaXplZC5hc0Rpc3BsYXlTdHJpbmcoTk9STUFMSVpBVElPTl9GT1JNQVRfREVGQVVMVCkudHJpbSgpO1xuICAgICAgICBjb25zdCBzMk5vcm1hbGl6ZWQgPSB0dTJOb3JtYWxpemVkLmFzRGlzcGxheVN0cmluZyhOT1JNQUxJWkFUSU9OX0ZPUk1BVF9ERUZBVUxUKS50cmltKCk7XG4gICAgICAgIHJldHVybiBzMU5vcm1hbGl6ZWQgPT09IHMyTm9ybWFsaXplZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFyZVNvdXJjZVJlZmVyZW5jZXNFcXVhbChcbiAgICAgICAgcmVmMToge3NvdXJjZWZpbGU6IHN0cmluZzsgbGluZW51bWJlcjogbnVtYmVyOyB9W10sXG4gICAgICAgIHJlZjI6IHtzb3VyY2VmaWxlOiBzdHJpbmc7IGxpbmVudW1iZXI6IG51bWJlcjsgfVtdKTogYm9vbGVhbiB7XG5cbiAgICAgICAgaWYgKChpc051bGxPclVuZGVmaW5lZChyZWYxKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVmMikpIHx8IChpc051bGxPclVuZGVmaW5lZChyZWYyKSAmJiAhaXNOdWxsT3JVbmRlZmluZWQocmVmMSkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKHJlZjEpICYmIGlzTnVsbE9yVW5kZWZpbmVkKHJlZjIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBib3QgcmVmcyBhcmUgc2V0IG5vdywgY29udmVydCB0byBzZXQgdG8gY29tcGFyZSB0aGVtXG4gICAgICAgIGNvbnN0IHNldDE6IFNldDxzdHJpbmc+ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICAgIHJlZjEuZm9yRWFjaCgocmVmKSA9PiB7c2V0MS5hZGQocmVmLnNvdXJjZWZpbGUgKyAnOicgKyByZWYubGluZW51bWJlcik7IH0pO1xuICAgICAgICBjb25zdCBzZXQyOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgICByZWYyLmZvckVhY2goKHJlZikgPT4ge3NldDIuYWRkKHJlZi5zb3VyY2VmaWxlICsgJzonICsgcmVmLmxpbmVudW1iZXIpOyB9KTtcbiAgICAgICAgaWYgKHNldDEuc2l6ZSAhPT0gc2V0Mi5zaXplKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1hdGNoID0gdHJ1ZTtcbiAgICAgICAgc2V0Mi5mb3JFYWNoKChyZWYpID0+IHtcbiAgICAgICAgICAgIGlmICghc2V0MS5oYXMocmVmKSkge1xuICAgICAgICAgICAgICAgIG1hdGNoID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXV0byB0cmFuc2xhdGUgZmlsZSB2aWEgR29vZ2xlIFRyYW5zbGF0ZS5cbiAgICAgKiBXaWxsIHRyYW5zbGF0ZSBhbGwgbmV3IHVuaXRzIGluIGZpbGUuXG4gICAgICogQHBhcmFtIGZyb20gZnJvbVxuICAgICAqIEBwYXJhbSB0byB0b1xuICAgICAqIEBwYXJhbSBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGVcbiAgICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB3aXRoIHRoZSBleGVjdXRpb24gcmVzdWx0IGFzIGEgc3VtbWFyeSByZXBvcnQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhdXRvVHJhbnNsYXRlKFxuICAgICAgICBmcm9tOiBzdHJpbmcsXG4gICAgICAgIHRvOiBzdHJpbmcsXG4gICAgICAgIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGU6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSk6IE9ic2VydmFibGU8QXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnQ+IHtcblxuICAgICAgICBsZXQgc2VydmljZUNhbGw6IE9ic2VydmFibGU8QXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnQ+O1xuICAgICAgICBjb25zdCBhdXRvdHJhbnNsYXRlRW5hYmxlZDogYm9vbGVhbiA9IHRoaXMucGFyYW1ldGVycy5hdXRvdHJhbnNsYXRlTGFuZ3VhZ2UodG8pO1xuICAgICAgICBpZiAoYXV0b3RyYW5zbGF0ZUVuYWJsZWQpIHtcbiAgICAgICAgICAgIHNlcnZpY2VDYWxsID0gdGhpcy5hdXRvVHJhbnNsYXRlU2VydmljZS5hdXRvVHJhbnNsYXRlKGZyb20sIHRvLCBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlcnZpY2VDYWxsID0gb2YobmV3IEF1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0KGZyb20sIHRvKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlcnZpY2VDYWxsLnBpcGUobWFwKChzdW1tYXJ5KSA9PiB7XG4gICAgICAgICAgICBpZiAoYXV0b3RyYW5zbGF0ZUVuYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3VtbWFyeS5lcnJvcigpIHx8IHN1bW1hcnkuZmFpbGVkKCkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWFuZE91dHB1dC5lcnJvcihzdW1tYXJ5LmNvbnRlbnQoKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21tYW5kT3V0cHV0Lndhcm4oc3VtbWFyeS5jb250ZW50KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdW1tYXJ5O1xuICAgICAgICB9KSk7XG4gICAgfVxuXG59XG4iXX0=