/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by martin on 17.02.2017.
 * Collection of all parameters used by the tool.
 * The parameters are read form the profile or defaults are used.
 */
import * as fs from 'fs';
import { XliffMergeError } from './xliff-merge-error';
import { format } from 'util';
import { isArray, isNullOrUndefined } from '../common/util';
import { FileUtil } from '../common/file-util';
import { NgxTranslateExtractor } from './ngx-translate-extractor';
import { dirname, isAbsolute, join } from 'path';
/** @type {?} */
const PROFILE_CANDIDATES = ['package.json', '.angular-cli.json'];
export class XliffMergeParameters {
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
            content = fs.readFileSync(profilePath, 'UTF-8');
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
            content = fs.readFileSync(profilePath, 'UTF-8');
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
                if (fs.existsSync(apikeyPath)) {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype.usedProfilePath;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._quiet;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._verbose;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._allowIdChange;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._defaultLanguage;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._srcDir;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._i18nBaseFile;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._i18nFile;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._i18nFormat;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._encoding;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._genDir;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._languages;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._removeUnusedIds;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._supportNgxTranslate;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._ngxTranslateExtractionPattern;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._useSourceAsTarget;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._targetPraefix;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._targetSuffix;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._beautifyOutput;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._preserveOrder;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._autotranslate;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._apikey;
    /**
     * @type {?}
     * @private
     */
    XliffMergeParameters.prototype._apikeyfile;
    /** @type {?} */
    XliffMergeParameters.prototype.errorsFound;
    /** @type {?} */
    XliffMergeParameters.prototype.warningsFound;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYtbWVyZ2UtcGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsieGxpZmZtZXJnZS94bGlmZi1tZXJnZS1wYXJhbWV0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU1BLE9BQU8sS0FBSyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3pCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUdwRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDaEUsT0FBTyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFZLE1BQU0sTUFBTSxDQUFDOztNQUVwRCxrQkFBa0IsR0FBRyxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQztBQUVoRSxNQUFNLE9BQU8sb0JBQW9COzs7Ozs7O0lBa0N0QixNQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBdUIsRUFBRSxjQUE0Qjs7Y0FDM0UsVUFBVSxHQUFHLElBQUksb0JBQW9CLEVBQUU7UUFDN0MsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDOUMsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQzs7OztJQUVEO1FBQ0ksSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDNUIsQ0FBQzs7Ozs7Ozs7SUFRTyxNQUFNLENBQUMsb0JBQW9CLENBQUMsV0FBbUI7O1lBQy9DLE9BQWU7UUFDbkIsSUFBSTtZQUNBLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNuRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUM7U0FDZjs7Y0FDSyxhQUFhLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3RELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRTtZQUNsRCxPQUFPLGFBQWEsQ0FBQztTQUN4QjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7Ozs7Ozs7OztJQVFPLFNBQVMsQ0FBQyxPQUF1QixFQUFFLGNBQTRCO1FBQ25FLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDakIsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDOUM7O2NBQ0ssWUFBWSxHQUFZLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztRQUNoRCxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7U0FDL0I7UUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxZQUFZLEVBQUU7WUFDZCxJQUFJLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDMUMsaUZBQWlGO1lBQ2pGLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNyRCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM5QzthQUNKO1lBQ0QsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQzs7Ozs7OztJQU9PLFdBQVcsQ0FBQyxPQUF1Qjs7Y0FDakMsV0FBVyxHQUFXLE9BQU8sQ0FBQyxXQUFXO1FBQy9DLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDZCxLQUFLLE1BQU0sY0FBYyxJQUFJLGtCQUFrQixFQUFFOztzQkFDdkMsT0FBTyxHQUFHLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQztnQkFDekUsSUFBSSxPQUFPLEVBQUU7b0JBQ1QsSUFBSSxDQUFDLGVBQWUsR0FBRyxjQUFjLENBQUM7b0JBQ3RDLE9BQU8sT0FBTyxDQUFDO2lCQUNsQjthQUNKO1lBQ0QsT0FBTyxFQUFFLENBQUM7U0FDYjs7WUFDRyxPQUFlO1FBQ25CLElBQUk7WUFDQSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDbkQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLDBCQUEwQixHQUFHLFdBQVcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNGLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxJQUFJLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQzs7Y0FDN0IsY0FBYyxHQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQzs7O2NBRWpELGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxpQkFBaUI7UUFDMUQsaUJBQWlCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0YsaUJBQWlCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0YsaUJBQWlCLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkcsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQzs7Ozs7OztJQUVPLHVCQUF1QixDQUFDLFdBQW1CLEVBQUUsWUFBZ0M7UUFDakYsSUFBSSxDQUFDLFlBQVksSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDM0MsT0FBTyxZQUFZLENBQUM7U0FDdkI7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4RSxDQUFDOzs7Ozs7SUFFTyxvQkFBb0IsQ0FBQyxjQUEyQjtRQUNwRCxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ2pCLE9BQU87U0FDVjs7Y0FDSyxPQUFPLEdBQUcsY0FBYyxDQUFDLGlCQUFpQjtRQUNoRCxJQUFJLE9BQU8sRUFBRTtZQUNULElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzthQUMvQjtZQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUNuQztZQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQzthQUMvQztZQUNELElBQUksT0FBTyxDQUFDLGVBQWUsRUFBRTtnQkFDekIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7YUFDbkQ7WUFDRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUN2QztZQUNELElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQ2pDO1lBQ0QsSUFBSSxPQUFPLENBQUMsc0JBQXNCLEVBQUU7Z0JBQ2hDLElBQUksT0FBTyxDQUFDLHNCQUFzQixDQUFDLE1BQU0sRUFBRTtvQkFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDO2lCQUN4RDthQUNKO1lBQ0QsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUNoQiw0REFBNEQ7Z0JBQzVELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUNqQztZQUNELElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO2FBQzdDO1lBQ0QsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7YUFDckM7WUFDRCxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQzthQUN6QztZQUNELElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO2FBQ3JDO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUM7YUFDbkQ7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUM7YUFDM0Q7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLDZCQUE2QixDQUFDLEVBQUU7Z0JBQzNELElBQUksQ0FBQyw4QkFBOEIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUM7YUFDL0U7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7YUFDdkQ7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7YUFDL0M7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUMxQyxJQUFJLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUM7YUFDN0M7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7YUFDL0M7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFO2dCQUM1QyxJQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUM7YUFDakQ7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7YUFDL0M7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7YUFDakM7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUN4QyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7YUFDekM7U0FDSjthQUFNO1lBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsNkRBQTZELENBQUMsQ0FBQztTQUMxRjtJQUNMLENBQUM7Ozs7Ozs7SUFNTyxlQUFlO1FBQ25CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQztTQUN4RTtRQUNELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM5QixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxFQUFDLENBQUM7O1lBQ0MsS0FBWTs7WUFDWixHQUFRO1FBQ1osdUJBQXVCO1FBQ3ZCLElBQUk7WUFDQSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN0QztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNYO1FBQ0QsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1NBQ25HO1FBQ0QsdUJBQXVCO1FBQ3ZCLElBQUk7WUFDQSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN0QztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNYO1FBQ0QsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1NBQ25HO1FBQ0QseUJBQXlCO1FBQ3pCLElBQUk7WUFDQSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQztTQUNwRztRQUNELHFDQUFxQztRQUNyQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQy9GLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsNkNBQTZDLENBQUMsQ0FBQyxDQUFDO1NBQ2xJO1FBQ0QsaUNBQWlDO1FBQ2pDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLG1EQUFtRCxDQUFDLENBQUMsQ0FBQztTQUNuRztRQUNELDREQUE0RDtRQUM1RCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxPQUFPOzs7O1FBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQywwQkFBMEIsR0FBRyxJQUFJLEdBQUcsK0JBQStCLENBQUMsQ0FBQyxDQUFDO2FBQ25IO1lBQ0QsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRSxFQUFFO2dCQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDakIsSUFBSSxlQUFlLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxHQUFHLDJEQUEyRCxDQUFDLENBQUMsQ0FBQzthQUM3SDtRQUNMLENBQUMsRUFBQyxDQUFDO1FBQ0gsOEJBQThCO1FBQzlCLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUU7O2tCQUN0QixXQUFXLEdBQUcscUJBQXFCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO1lBQzVGLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ2pCLElBQUksZUFBZSxDQUFDLGlDQUFpQyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQzVIO1NBQ0o7UUFDRCx1Q0FBdUM7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFO1lBQzNCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNuQiw0QkFBNEIsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsNkRBQTZELENBQUMsQ0FBQzthQUM1SDtZQUNELElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUNuQiwyQkFBMkIsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsNkRBQTZELENBQUMsQ0FBQzthQUMxSDtTQUNKO0lBQ0osQ0FBQzs7Ozs7Ozs7O0lBUU0sbUJBQW1CLENBQUMsSUFBWTs7Y0FDOUIsT0FBTyxHQUFHLHdDQUF3QztRQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUN0RjtJQUNMLENBQUM7Ozs7SUFFTSxhQUFhO1FBQ2hCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQ2xGLENBQUM7Ozs7SUFFTSxPQUFPO1FBQ1YsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdEUsQ0FBQzs7OztJQUVNLEtBQUs7UUFDUixPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNsRSxDQUFDOzs7Ozs7SUFLTSxpQkFBaUIsQ0FBQyxhQUE0QjtRQUNqRCxhQUFhLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbkQsYUFBYSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDcEUsYUFBYSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUN0RSxhQUFhLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNwRCxhQUFhLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUNwRCxhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLGFBQWEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDeEQsYUFBYSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUN4RCxLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUNyQyxhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUMxRjtRQUNELGFBQWEsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDcEUsYUFBYSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFLEVBQUU7WUFDNUIsYUFBYSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDO1NBQ25HO1FBQ0QsYUFBYSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7WUFDMUIsYUFBYSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUNsRSxhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsYUFBYSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUNoRSxhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLGFBQWEsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDaEUsYUFBYSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUNoRSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN0QixhQUFhLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUM7WUFDckYsYUFBYSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZFLGFBQWEsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDN0Q7SUFDTCxDQUFDOzs7OztJQU1NLGVBQWU7UUFDbEIsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2hFLENBQUM7Ozs7O0lBTU0sU0FBUztRQUNaLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2xELENBQUM7Ozs7O0lBTU0sTUFBTTtRQUNULE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzdDLENBQUM7Ozs7OztJQU9NLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNoRSxDQUFDOzs7Ozs7SUFPTSxRQUFRO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUNyQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FDcEcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7Ozs7OztJQU9NLFVBQVU7UUFDYixPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQzs7Ozs7O0lBT00saUJBQWlCLENBQUMsSUFBWTtRQUNqQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvSCxDQUFDOzs7OztJQUVPLDBCQUEwQjtRQUM5QixRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUN2QixLQUFLLEtBQUs7Z0JBQ04sT0FBTyxLQUFLLENBQUM7WUFDakIsS0FBSyxNQUFNO2dCQUNQLE9BQU8sS0FBSyxDQUFDO1lBQ2pCLEtBQUssS0FBSztnQkFDTixPQUFPLEtBQUssQ0FBQztTQUNwQjtJQUNMLENBQUM7Ozs7OztJQU9NLHlCQUF5QixDQUFDLElBQVk7UUFDekMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BHLENBQUM7Ozs7O0lBTU0sUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3JELENBQUM7Ozs7OztJQU1NLE1BQU07UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUN2RCxDQUFDOzs7O0lBRU0sZUFBZTtRQUNsQixPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDckYsQ0FBQzs7OztJQUVNLG1CQUFtQjtRQUN0QixPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDOUYsQ0FBQzs7OztJQUVNLDZCQUE2QjtRQUNoQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELHFCQUFxQixDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUM7SUFDN0YsQ0FBQzs7Ozs7O0lBTU0saUJBQWlCO1FBQ3BCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztJQUN6RixDQUFDOzs7Ozs7SUFNTSxhQUFhO1FBQ2hCLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQy9FLENBQUM7Ozs7OztJQU1NLFlBQVk7UUFDZixPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM3RSxDQUFDOzs7OztJQUtNLGNBQWM7UUFDakIsT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDcEYsQ0FBQzs7Ozs7O0lBTU0sYUFBYTtRQUNoQixPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUNqRixDQUFDOzs7Ozs7SUFNTSxhQUFhO1FBQ2hCLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzlCLE9BQU8sQ0FBQyxtQkFBVSxJQUFJLENBQUMsY0FBYyxFQUFBLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsT0FBTyxtQkFBVSxJQUFJLENBQUMsY0FBYyxFQUFBLENBQUM7SUFDekMsQ0FBQzs7Ozs7O0lBTU0scUJBQXFCLENBQUMsSUFBWTtRQUNyQyxPQUFPLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0QsQ0FBQzs7Ozs7SUFLTSx1QkFBdUI7UUFDMUIsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsS0FBSyxLQUFLLEVBQUU7WUFDekUsT0FBTyxFQUFFLENBQUM7U0FDYjtRQUNELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUM5QixPQUFPLENBQUMsbUJBQVUsSUFBSSxDQUFDLGNBQWMsRUFBQSxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7SUFDakUsQ0FBQzs7Ozs7SUFNTSxNQUFNO1FBQ1QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdkI7YUFBTTs7a0JBQ0csVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7Z0JBQ25CLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDM0IsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztpQkFDN0M7cUJBQU07b0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMseUNBQXlDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztpQkFDbEY7YUFDSjtpQkFBTTtnQkFDSCxPQUFPLElBQUksQ0FBQzthQUNmO1NBQ0o7SUFDTCxDQUFDOzs7Ozs7SUFPTSxVQUFVO1FBQ2IsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUMzQjthQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7WUFDakMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztTQUNuQzthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7Q0FDSjs7Ozs7O0lBbGtCRywrQ0FBZ0M7Ozs7O0lBQ2hDLHNDQUF3Qjs7Ozs7SUFDeEIsd0NBQTBCOzs7OztJQUMxQiw4Q0FBZ0M7Ozs7O0lBQ2hDLGdEQUFpQzs7Ozs7SUFDakMsdUNBQXdCOzs7OztJQUN4Qiw2Q0FBOEI7Ozs7O0lBQzlCLHlDQUEwQjs7Ozs7SUFDMUIsMkNBQTRCOzs7OztJQUM1Qix5Q0FBMEI7Ozs7O0lBQzFCLHVDQUF3Qjs7Ozs7SUFDeEIsMENBQTZCOzs7OztJQUM3QixnREFBa0M7Ozs7O0lBQ2xDLG9EQUFzQzs7Ozs7SUFDdEMsOERBQStDOzs7OztJQUMvQyxrREFBb0M7Ozs7O0lBQ3BDLDhDQUErQjs7Ozs7SUFDL0IsNkNBQThCOzs7OztJQUM5QiwrQ0FBaUM7Ozs7O0lBQ2pDLDhDQUFnQzs7Ozs7SUFDaEMsOENBQXlDOzs7OztJQUN6Qyx1Q0FBd0I7Ozs7O0lBQ3hCLDJDQUE0Qjs7SUFFNUIsMkNBQXNDOztJQUN0Qyw2Q0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgbWFydGluIG9uIDE3LjAyLjIwMTcuXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCBwYXJhbWV0ZXJzIHVzZWQgYnkgdGhlIHRvb2wuXG4gKiBUaGUgcGFyYW1ldGVycyBhcmUgcmVhZCBmb3JtIHRoZSBwcm9maWxlIG9yIGRlZmF1bHRzIGFyZSB1c2VkLlxuICovXG5cbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7WGxpZmZNZXJnZUVycm9yfSBmcm9tICcuL3hsaWZmLW1lcmdlLWVycm9yJztcbmltcG9ydCB7U3RhdHN9IGZyb20gJ2ZzJztcbmltcG9ydCB7Q29tbWFuZE91dHB1dH0gZnJvbSAnLi4vY29tbW9uL2NvbW1hbmQtb3V0cHV0JztcbmltcG9ydCB7Zm9ybWF0fSBmcm9tICd1dGlsJztcbmltcG9ydCB7aXNBcnJheSwgaXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7UHJvZ3JhbU9wdGlvbnMsIElDb25maWdGaWxlfSBmcm9tICcuL2kteGxpZmYtbWVyZ2Utb3B0aW9ucyc7XG5pbXBvcnQge0ZpbGVVdGlsfSBmcm9tICcuLi9jb21tb24vZmlsZS11dGlsJztcbmltcG9ydCB7Tmd4VHJhbnNsYXRlRXh0cmFjdG9yfSBmcm9tICcuL25neC10cmFuc2xhdGUtZXh0cmFjdG9yJztcbmltcG9ydCB7ZGlybmFtZSwgaXNBYnNvbHV0ZSwgam9pbiwgbm9ybWFsaXplfSBmcm9tICdwYXRoJztcblxuY29uc3QgUFJPRklMRV9DQU5ESURBVEVTID0gWydwYWNrYWdlLmpzb24nLCAnLmFuZ3VsYXItY2xpLmpzb24nXTtcblxuZXhwb3J0IGNsYXNzIFhsaWZmTWVyZ2VQYXJhbWV0ZXJzIHtcblxuICAgIHByaXZhdGUgdXNlZFByb2ZpbGVQYXRoOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfcXVpZXQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfdmVyYm9zZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9hbGxvd0lkQ2hhbmdlOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2RlZmF1bHRMYW5ndWFnZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX3NyY0Rpcjogc3RyaW5nO1xuICAgIHByaXZhdGUgX2kxOG5CYXNlRmlsZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2kxOG5GaWxlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfaTE4bkZvcm1hdDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2VuY29kaW5nOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZ2VuRGlyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfbGFuZ3VhZ2VzOiBzdHJpbmdbXTtcbiAgICBwcml2YXRlIF9yZW1vdmVVbnVzZWRJZHM6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfc3VwcG9ydE5neFRyYW5zbGF0ZTogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9uZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybjogc3RyaW5nO1xuICAgIHByaXZhdGUgX3VzZVNvdXJjZUFzVGFyZ2V0OiBib29sZWFuO1xuICAgIHByaXZhdGUgX3RhcmdldFByYWVmaXg6IHN0cmluZztcbiAgICBwcml2YXRlIF90YXJnZXRTdWZmaXg6IHN0cmluZztcbiAgICBwcml2YXRlIF9iZWF1dGlmeU91dHB1dDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9wcmVzZXJ2ZU9yZGVyOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2F1dG90cmFuc2xhdGU6IGJvb2xlYW58c3RyaW5nW107XG4gICAgcHJpdmF0ZSBfYXBpa2V5OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfYXBpa2V5ZmlsZTogc3RyaW5nO1xuXG4gICAgcHVibGljIGVycm9yc0ZvdW5kOiBYbGlmZk1lcmdlRXJyb3JbXTtcbiAgICBwdWJsaWMgd2FybmluZ3NGb3VuZDogc3RyaW5nW107XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgUGFyYW1ldGVycy5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBjb21tYW5kIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gcHJvZmlsZUNvbnRlbnQgZ2l2ZW4gcHJvZmlsZSAoaWYgbm90LCBpdCBpcyByZWFkIGZyb20gdGhlIHByb2ZpbGUgcGF0aCBmcm9tIG9wdGlvbnMpLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlRnJvbU9wdGlvbnMob3B0aW9uczogUHJvZ3JhbU9wdGlvbnMsIHByb2ZpbGVDb250ZW50PzogSUNvbmZpZ0ZpbGUpIHtcbiAgICAgICAgY29uc3QgcGFyYW1ldGVycyA9IG5ldyBYbGlmZk1lcmdlUGFyYW1ldGVycygpO1xuICAgICAgICBwYXJhbWV0ZXJzLmNvbmZpZ3VyZShvcHRpb25zLCBwcm9maWxlQ29udGVudCk7XG4gICAgICAgIHJldHVybiBwYXJhbWV0ZXJzO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZXJyb3JzRm91bmQgPSBbXTtcbiAgICAgICAgdGhpcy53YXJuaW5nc0ZvdW5kID0gW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZCBwb3RlbnRpYWwgcHJvZmlsZS5cbiAgICAgKiBUbyBiZSBhIGNhbmRpZGF0ZSwgZmlsZSBtdXN0IGV4aXN0IGFuZCBjb250YWluIHByb3BlcnR5IFwieGxpZmZtZXJnZU9wdGlvbnNcIi5cbiAgICAgKiBAcGFyYW0gcHJvZmlsZVBhdGggcGF0aCBvZiBwcm9maWxlXG4gICAgICogQHJldHVybiBwYXJzZWQgY29udGVudCBvZiBmaWxlIG9yIG51bGwsIGlmIGZpbGUgZG9lcyBub3QgZXhpc3Qgb3IgaXMgbm90IGEgcHJvZmlsZSBjYW5kaWRhdGUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZFByb2ZpbGVDYW5kaWRhdGUocHJvZmlsZVBhdGg6IHN0cmluZyk6IElDb25maWdGaWxlIHtcbiAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocHJvZmlsZVBhdGgsICdVVEYtOCcpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcnNlZENvbnRlbnQ6IElDb25maWdGaWxlID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICAgICAgaWYgKHBhcnNlZENvbnRlbnQgJiYgcGFyc2VkQ29udGVudC54bGlmZm1lcmdlT3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlZENvbnRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemUgbWUgZnJvbSB0aGUgcHJvZmlsZSBjb250ZW50LlxuICAgICAqIChwdWJsaWMgb25seSBmb3IgdGVzdCB1c2FnZSkuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyBnaXZlbiBhdCBydW50aW1lIHZpYSBjb21tYW5kIGxpbmVcbiAgICAgKiBAcGFyYW0gcHJvZmlsZUNvbnRlbnQgaWYgbnVsbCwgcmVhZCBpdCBmcm9tIHByb2ZpbGUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjb25maWd1cmUob3B0aW9uczogUHJvZ3JhbU9wdGlvbnMsIHByb2ZpbGVDb250ZW50PzogSUNvbmZpZ0ZpbGUpIHtcbiAgICAgICAgdGhpcy5lcnJvcnNGb3VuZCA9IFtdO1xuICAgICAgICB0aGlzLndhcm5pbmdzRm91bmQgPSBbXTtcbiAgICAgICAgaWYgKCFwcm9maWxlQ29udGVudCkge1xuICAgICAgICAgICAgcHJvZmlsZUNvbnRlbnQgPSB0aGlzLnJlYWRQcm9maWxlKG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHZhbGlkUHJvZmlsZTogYm9vbGVhbiA9ICghIXByb2ZpbGVDb250ZW50KTtcbiAgICAgICAgaWYgKG9wdGlvbnMucXVpZXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1aWV0ID0gb3B0aW9ucy5xdWlldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICAgICAgICB0aGlzLl92ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWxpZFByb2ZpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZUZyb21Db25maWcocHJvZmlsZUNvbnRlbnQpO1xuICAgICAgICAgICAgLy8gaWYgbGFuZ3VhZ2VzIGFyZSBnaXZlbiBhcyBwYXJhbWV0ZXJzLCB0aGV5IG92dmVyaWRlIGV2ZXJ5dGhpbmcgc2FpZCBpbiBwcm9maWxlXG4gICAgICAgICAgICBpZiAoISFvcHRpb25zLmxhbmd1YWdlcyAmJiBvcHRpb25zLmxhbmd1YWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFuZ3VhZ2VzID0gb3B0aW9ucy5sYW5ndWFnZXM7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9kZWZhdWx0TGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVmYXVsdExhbmd1YWdlID0gdGhpcy5fbGFuZ3VhZ2VzWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tQYXJhbWV0ZXJzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIHByb2ZpbGUuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgcHJvZ3JhbSBvcHRpb25zXG4gICAgICogQHJldHVybiB0aGUgcmVhZCBwcm9maWxlIChlbXB0eSwgaWYgbm9uZSwgbnVsbCBpZiBlcnJvcnMpXG4gICAgICovXG4gICAgcHJpdmF0ZSByZWFkUHJvZmlsZShvcHRpb25zOiBQcm9ncmFtT3B0aW9ucyk6IElDb25maWdGaWxlIHtcbiAgICAgICAgY29uc3QgcHJvZmlsZVBhdGg6IHN0cmluZyA9IG9wdGlvbnMucHJvZmlsZVBhdGg7XG4gICAgICAgIGlmICghcHJvZmlsZVBhdGgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY29uZmlnZmlsZW5hbWUgb2YgUFJPRklMRV9DQU5ESURBVEVTKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZmlsZSA9IFhsaWZmTWVyZ2VQYXJhbWV0ZXJzLnJlYWRQcm9maWxlQ2FuZGlkYXRlKGNvbmZpZ2ZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvZmlsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZWRQcm9maWxlUGF0aCA9IGNvbmZpZ2ZpbGVuYW1lO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZmlsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocHJvZmlsZVBhdGgsICdVVEYtOCcpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzRm91bmQucHVzaChuZXcgWGxpZmZNZXJnZUVycm9yKCdjb3VsZCBub3QgcmVhZCBwcm9maWxlIFwiJyArIHByb2ZpbGVQYXRoICsgJ1wiJykpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51c2VkUHJvZmlsZVBhdGggPSBwcm9maWxlUGF0aDtcbiAgICAgICAgY29uc3QgcHJvZmlsZUNvbnRlbnQ6IElDb25maWdGaWxlID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICAgICAgLy8gcmVwbGFjZSBhbGwgcGF0aGVzIGluIG9wdGlvbnMgYnkgYWJzb2x1dGUgcGF0aHNcbiAgICAgICAgY29uc3QgeGxpZmZtZXJnZU9wdGlvbnMgPSBwcm9maWxlQ29udGVudC54bGlmZm1lcmdlT3B0aW9ucztcbiAgICAgICAgeGxpZmZtZXJnZU9wdGlvbnMuc3JjRGlyID0gdGhpcy5hZGp1c3RQYXRoVG9Qcm9maWxlUGF0aChwcm9maWxlUGF0aCwgeGxpZmZtZXJnZU9wdGlvbnMuc3JjRGlyKTtcbiAgICAgICAgeGxpZmZtZXJnZU9wdGlvbnMuZ2VuRGlyID0gdGhpcy5hZGp1c3RQYXRoVG9Qcm9maWxlUGF0aChwcm9maWxlUGF0aCwgeGxpZmZtZXJnZU9wdGlvbnMuZ2VuRGlyKTtcbiAgICAgICAgeGxpZmZtZXJnZU9wdGlvbnMuYXBpa2V5ZmlsZSA9IHRoaXMuYWRqdXN0UGF0aFRvUHJvZmlsZVBhdGgocHJvZmlsZVBhdGgsIHhsaWZmbWVyZ2VPcHRpb25zLmFwaWtleWZpbGUpO1xuICAgICAgICByZXR1cm4gcHJvZmlsZUNvbnRlbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGp1c3RQYXRoVG9Qcm9maWxlUGF0aChwcm9maWxlUGF0aDogc3RyaW5nLCBwYXRoVG9BZGp1c3Q6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghcGF0aFRvQWRqdXN0IHx8IGlzQWJzb2x1dGUocGF0aFRvQWRqdXN0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdGhUb0FkanVzdDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gam9pbihkaXJuYW1lKHByb2ZpbGVQYXRoKSwgcGF0aFRvQWRqdXN0KS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0aWFsaXplRnJvbUNvbmZpZyhwcm9maWxlQ29udGVudDogSUNvbmZpZ0ZpbGUpIHtcbiAgICAgICAgaWYgKCFwcm9maWxlQ29udGVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb2ZpbGUgPSBwcm9maWxlQ29udGVudC54bGlmZm1lcmdlT3B0aW9ucztcbiAgICAgICAgaWYgKHByb2ZpbGUpIHtcbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS5xdWlldCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9xdWlldCA9IHByb2ZpbGUucXVpZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUudmVyYm9zZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl92ZXJib3NlID0gcHJvZmlsZS52ZXJib3NlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLmFsbG93SWRDaGFuZ2UpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYWxsb3dJZENoYW5nZSA9IHByb2ZpbGUuYWxsb3dJZENoYW5nZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9maWxlLmRlZmF1bHRMYW5ndWFnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRMYW5ndWFnZSA9IHByb2ZpbGUuZGVmYXVsdExhbmd1YWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb2ZpbGUubGFuZ3VhZ2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFuZ3VhZ2VzID0gcHJvZmlsZS5sYW5ndWFnZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvZmlsZS5zcmNEaXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcmNEaXIgPSBwcm9maWxlLnNyY0RpcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9maWxlLmFuZ3VsYXJDb21waWxlck9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvZmlsZS5hbmd1bGFyQ29tcGlsZXJPcHRpb25zLmdlbkRpcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nZW5EaXIgPSBwcm9maWxlLmFuZ3VsYXJDb21waWxlck9wdGlvbnMuZ2VuRGlyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9maWxlLmdlbkRpcikge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgbXVzdCBiZSBhZnRlciBhbmd1bGFyQ29tcGlsZXJPcHRpb25zIHRvIGJlIHByZWZlcnJlZFxuICAgICAgICAgICAgICAgIHRoaXMuX2dlbkRpciA9IHByb2ZpbGUuZ2VuRGlyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb2ZpbGUuaTE4bkJhc2VGaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faTE4bkJhc2VGaWxlID0gcHJvZmlsZS5pMThuQmFzZUZpbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvZmlsZS5pMThuRmlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2kxOG5GaWxlID0gcHJvZmlsZS5pMThuRmlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9maWxlLmkxOG5Gb3JtYXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pMThuRm9ybWF0ID0gcHJvZmlsZS5pMThuRm9ybWF0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb2ZpbGUuZW5jb2RpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbmNvZGluZyA9IHByb2ZpbGUuZW5jb2Rpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUucmVtb3ZlVW51c2VkSWRzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZVVudXNlZElkcyA9IHByb2ZpbGUucmVtb3ZlVW51c2VkSWRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLnN1cHBvcnROZ3hUcmFuc2xhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3VwcG9ydE5neFRyYW5zbGF0ZSA9IHByb2ZpbGUuc3VwcG9ydE5neFRyYW5zbGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS5uZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9uZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybiA9IHByb2ZpbGUubmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUudXNlU291cmNlQXNUYXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXNlU291cmNlQXNUYXJnZXQgPSBwcm9maWxlLnVzZVNvdXJjZUFzVGFyZ2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLnRhcmdldFByYWVmaXgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGFyZ2V0UHJhZWZpeCA9IHByb2ZpbGUudGFyZ2V0UHJhZWZpeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS50YXJnZXRTdWZmaXgpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGFyZ2V0U3VmZml4ID0gcHJvZmlsZS50YXJnZXRTdWZmaXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUuYXV0b3RyYW5zbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvdHJhbnNsYXRlID0gcHJvZmlsZS5hdXRvdHJhbnNsYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLmJlYXV0aWZ5T3V0cHV0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2JlYXV0aWZ5T3V0cHV0ID0gcHJvZmlsZS5iZWF1dGlmeU91dHB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS5wcmVzZXJ2ZU9yZGVyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ByZXNlcnZlT3JkZXIgPSBwcm9maWxlLnByZXNlcnZlT3JkZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUuYXBpa2V5KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FwaWtleSA9IHByb2ZpbGUuYXBpa2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLmFwaWtleWZpbGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBpa2V5ZmlsZSA9IHByb2ZpbGUuYXBpa2V5ZmlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMud2FybmluZ3NGb3VuZC5wdXNoKCdkaWQgbm90IGZpbmQgXCJ4bGlmZm1lcmdlT3B0aW9uc1wiIGluIHByb2ZpbGUsIHVzaW5nIGRlZmF1bHRzJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBhbGwgUGFyYW1ldGVycywgd2V0aGVyIHRoZXkgYXJlIGNvbXBsZXRlIGFuZCBjb25zaXN0ZW50LlxuICAgICAqIGlmIHNvbWV0aGluZyBpcyB3cm9uZyB3aXRoIHRoZSBwYXJhbWV0ZXJzLCBpdCBpcyBjb2xsZWN0ZWQgaW4gZXJyb3JzRm91bmQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGVja1BhcmFtZXRlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hlY2tMYW5ndWFnZVN5bnRheCh0aGlzLmRlZmF1bHRMYW5ndWFnZSgpKTtcbiAgICAgICAgaWYgKHRoaXMubGFuZ3VhZ2VzKCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yc0ZvdW5kLnB1c2gobmV3IFhsaWZmTWVyZ2VFcnJvcignbm8gbGFuZ3VhZ2VzIHNwZWNpZmllZCcpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhbmd1YWdlcygpLmZvckVhY2goKGxhbmcpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tMYW5ndWFnZVN5bnRheChsYW5nKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBzdGF0czogU3RhdHM7XG4gICAgICAgIGxldCBlcnI6IGFueTtcbiAgICAgICAgLy8gc3JjRGlyIHNob3VsZCBleGlzdHNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN0YXRzID0gZnMuc3RhdFN5bmModGhpcy5zcmNEaXIoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGVyciA9IGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhZXJyIHx8ICFzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yc0ZvdW5kLnB1c2gobmV3IFhsaWZmTWVyZ2VFcnJvcignc3JjRGlyIFwiJyArIHRoaXMuc3JjRGlyKCkgKyAnXCIgaXMgbm90IGEgZGlyZWN0b3J5JykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGdlbkRpciBzaG91bGQgZXhpc3RzXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzdGF0cyA9IGZzLnN0YXRTeW5jKHRoaXMuZ2VuRGlyKCkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghIWVyciB8fCAhc3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnNGb3VuZC5wdXNoKG5ldyBYbGlmZk1lcmdlRXJyb3IoJ2dlbkRpciBcIicgKyB0aGlzLmdlbkRpcigpICsgJ1wiIGlzIG5vdCBhIGRpcmVjdG9yeScpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYXN0ZXIgZmlsZSBNVVNUIGV4aXN0XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmcy5hY2Nlc3NTeW5jKHRoaXMuaTE4bkZpbGUoKSwgZnMuY29uc3RhbnRzLlJfT0spO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzRm91bmQucHVzaChuZXcgWGxpZmZNZXJnZUVycm9yKCdpMThuRmlsZSBcIicgKyB0aGlzLmkxOG5GaWxlKCkgKyAnXCIgaXMgbm90IHJlYWRhYmxlJykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGkxOG5Gb3JtYXQgbXVzdCBiZSB4bGYgeGxmMiBvciB4bWJcbiAgICAgICAgaWYgKCEodGhpcy5pMThuRm9ybWF0KCkgPT09ICd4bGYnIHx8IHRoaXMuaTE4bkZvcm1hdCgpID09PSAneGxmMicgfHwgdGhpcy5pMThuRm9ybWF0KCkgPT09ICd4bWInKSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnNGb3VuZC5wdXNoKG5ldyBYbGlmZk1lcmdlRXJyb3IoJ2kxOG5Gb3JtYXQgXCInICsgdGhpcy5pMThuRm9ybWF0KCkgKyAnXCIgaW52YWxpZCwgbXVzdCBiZSBcInhsZlwiIG9yIFwieGxmMlwiIG9yIFwieG1iXCInKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXV0b3RyYW5zbGF0ZSByZXF1aXJlcyBhcGkga2V5XG4gICAgICAgIGlmICh0aGlzLmF1dG90cmFuc2xhdGUoKSAmJiAhdGhpcy5hcGlrZXkoKSkge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnNGb3VuZC5wdXNoKG5ldyBYbGlmZk1lcmdlRXJyb3IoJ2F1dG90cmFuc2xhdGUgcmVxdWlyZXMgYW4gQVBJIGtleSwgcGxlYXNlIHNldCBvbmUnKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXV0b3RyYW5zbGF0ZWQgbGFuZ3VhZ2VzIG11c3QgYmUgaW4gbGlzdCBvZiBhbGwgbGFuZ3VhZ2VzXG4gICAgICAgIHRoaXMuYXV0b3RyYW5zbGF0ZWRMYW5ndWFnZXMoKS5mb3JFYWNoKChsYW5nKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5sYW5ndWFnZXMoKS5pbmRleE9mKGxhbmcpIDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzRm91bmQucHVzaChuZXcgWGxpZmZNZXJnZUVycm9yKCdhdXRvdHJhbnNsYXRlIGxhbmd1YWdlIFwiJyArIGxhbmcgKyAnXCIgaXMgbm90IGluIGxpc3Qgb2YgbGFuZ3VhZ2VzJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxhbmcgPT09IHRoaXMuZGVmYXVsdExhbmd1YWdlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yc0ZvdW5kLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIG5ldyBYbGlmZk1lcmdlRXJyb3IoJ2F1dG90cmFuc2xhdGUgbGFuZ3VhZ2UgXCInICsgbGFuZyArICdcIiBjYW5ub3QgYmUgdHJhbnNsYXRlZCwgYmVjYXVzZSBpdCBpcyB0aGUgc291cmNlIGxhbmd1YWdlJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gbmd4IHRyYW5zbGF0ZSBwYXR0ZXJuIGNoZWNrXG4gICAgICAgIGlmICh0aGlzLnN1cHBvcnROZ3hUcmFuc2xhdGUoKSkge1xuICAgICAgICAgICAgY29uc3QgY2hlY2tSZXN1bHQgPSBOZ3hUcmFuc2xhdGVFeHRyYWN0b3IuY2hlY2tQYXR0ZXJuKHRoaXMubmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm4oKSk7XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKGNoZWNrUmVzdWx0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzRm91bmQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgbmV3IFhsaWZmTWVyZ2VFcnJvcignbmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm4gXCInICsgdGhpcy5uZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybigpICsgJ1wiOiAnICsgY2hlY2tSZXN1bHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB0YXJnZXRQcmFlZml4IGFuZCB0YXJnZXRTdWZmaXggY2hlY2tcbiAgICAgICAgaWYgKCF0aGlzLnVzZVNvdXJjZUFzVGFyZ2V0KCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldFByYWVmaXgoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nc0ZvdW5kLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICdjb25maWd1cmVkIHRhcmdldFByYWVmaXggXCInICsgdGhpcy50YXJnZXRQcmFlZml4KCkgKyAnXCIgd2lsbCBub3QgYmUgdXNlZCBiZWNhdXNlIFwidXNlU291cmNlQXNUYXJnZXRcIiBpcyBkaXNhYmxlZFwiJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXRTdWZmaXgoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nc0ZvdW5kLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICdjb25maWd1cmVkIHRhcmdldFN1ZmZpeCBcIicgKyB0aGlzLnRhcmdldFN1ZmZpeCgpICsgJ1wiIHdpbGwgbm90IGJlIHVzZWQgYmVjYXVzZSBcInVzZVNvdXJjZUFzVGFyZ2V0XCIgaXMgZGlzYWJsZWRcIicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIHN5bnRheCBvZiBsYW5ndWFnZS5cbiAgICAgKiBNdXN0IGJlIGNvbXBhdGlibGUgd2l0aCBYTUwgU2NoZW1hIHR5cGUgeHNkOmxhbmd1YWdlLlxuICAgICAqIFBhdHRlcm46IFthLXpBLVpdezEsOH0oKC18XylbYS16QS1aMC05XXsxLDh9KSpcbiAgICAgKiBAcGFyYW0gbGFuZyBsYW5ndWFnZSB0byBjaGVja1xuICAgICAqL1xuICAgIHByaXZhdGUgY2hlY2tMYW5ndWFnZVN5bnRheChsYW5nOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcGF0dGVybiA9IC9eW2EtekEtWl17MSw4fShbLV9dW2EtekEtWjAtOV17MSw4fSkqJC87XG4gICAgICAgIGlmICghcGF0dGVybi50ZXN0KGxhbmcpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yc0ZvdW5kLnB1c2gobmV3IFhsaWZmTWVyZ2VFcnJvcignbGFuZ3VhZ2UgXCInICsgbGFuZyArICdcIiBpcyBub3QgdmFsaWQnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYWxsb3dJZENoYW5nZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl9hbGxvd0lkQ2hhbmdlKSkgPyBmYWxzZSA6IHRoaXMuX2FsbG93SWRDaGFuZ2U7XG4gICAgfVxuXG4gICAgcHVibGljIHZlcmJvc2UoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fdmVyYm9zZSkpID8gZmFsc2UgOiB0aGlzLl92ZXJib3NlO1xuICAgIH1cblxuICAgIHB1YmxpYyBxdWlldCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl9xdWlldCkpID8gZmFsc2UgOiB0aGlzLl9xdWlldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWJ1ZyBvdXRwdXQgYWxsIHBhcmFtZXRlcnMgdG8gY29tbWFuZE91dHB1dC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2hvd0FsbFBhcmFtZXRlcnMoY29tbWFuZE91dHB1dDogQ29tbWFuZE91dHB1dCk6IHZvaWQge1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCd4bGlmZm1lcmdlIFVzZWQgUGFyYW1ldGVyczonKTtcbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygndXNlZFByb2ZpbGVQYXRoOlxcdFwiJXNcIicsIHRoaXMudXNlZFByb2ZpbGVQYXRoKTtcbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygnZGVmYXVsdExhbmd1YWdlOlxcdFwiJXNcIicsIHRoaXMuZGVmYXVsdExhbmd1YWdlKCkpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdzcmNEaXI6XFx0XCIlc1wiJywgdGhpcy5zcmNEaXIoKSk7XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ2dlbkRpcjpcXHRcIiVzXCInLCB0aGlzLmdlbkRpcigpKTtcbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygnaTE4bkJhc2VGaWxlOlxcdFwiJXNcIicsIHRoaXMuaTE4bkJhc2VGaWxlKCkpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdpMThuRmlsZTpcXHRcIiVzXCInLCB0aGlzLmkxOG5GaWxlKCkpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdsYW5ndWFnZXM6XFx0JXMnLCB0aGlzLmxhbmd1YWdlcygpKTtcbiAgICAgICAgZm9yIChjb25zdCBsYW5ndWFnZSBvZiB0aGlzLmxhbmd1YWdlcygpKSB7XG4gICAgICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdvdXRwdXRGaWxlWyVzXTpcXHQlcycsIGxhbmd1YWdlLCB0aGlzLmdlbmVyYXRlZEkxOG5GaWxlKGxhbmd1YWdlKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygncmVtb3ZlVW51c2VkSWRzOlxcdCVzJywgdGhpcy5yZW1vdmVVbnVzZWRJZHMoKSk7XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ3N1cHBvcnROZ3hUcmFuc2xhdGU6XFx0JXMnLCB0aGlzLnN1cHBvcnROZ3hUcmFuc2xhdGUoKSk7XG4gICAgICAgIGlmICh0aGlzLnN1cHBvcnROZ3hUcmFuc2xhdGUoKSkge1xuICAgICAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1Zygnbmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm46XFx0JXMnLCB0aGlzLm5neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ3VzZVNvdXJjZUFzVGFyZ2V0OlxcdCVzJywgdGhpcy51c2VTb3VyY2VBc1RhcmdldCgpKTtcbiAgICAgICAgaWYgKHRoaXMudXNlU291cmNlQXNUYXJnZXQoKSkge1xuICAgICAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygndGFyZ2V0UHJhZWZpeDpcXHRcIiVzXCInLCB0aGlzLnRhcmdldFByYWVmaXgoKSk7XG4gICAgICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCd0YXJnZXRTdWZmaXg6XFx0XCIlc1wiJywgdGhpcy50YXJnZXRTdWZmaXgoKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygnYWxsb3dJZENoYW5nZTpcXHQlcycsIHRoaXMuYWxsb3dJZENoYW5nZSgpKTtcbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygnYmVhdXRpZnlPdXRwdXQ6XFx0JXMnLCB0aGlzLmJlYXV0aWZ5T3V0cHV0KCkpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdwcmVzZXJ2ZU9yZGVyOlxcdCVzJywgdGhpcy5wcmVzZXJ2ZU9yZGVyKCkpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdhdXRvdHJhbnNsYXRlOlxcdCVzJywgdGhpcy5hdXRvdHJhbnNsYXRlKCkpO1xuICAgICAgICBpZiAodGhpcy5hdXRvdHJhbnNsYXRlKCkpIHtcbiAgICAgICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ2F1dG90cmFuc2xhdGVkIGxhbmd1YWdlczpcXHQlcycsIHRoaXMuYXV0b3RyYW5zbGF0ZWRMYW5ndWFnZXMoKSk7XG4gICAgICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdhcGlrZXk6XFx0JXMnLCB0aGlzLmFwaWtleSgpID8gJyoqKionIDogJ05PVCBTRVQnKTtcbiAgICAgICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ2FwaWtleWZpbGU6XFx0JXMnLCB0aGlzLmFwaWtleWZpbGUoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0LUxhbmd1YWdlLCBkZWZhdWx0IGVuLlxuICAgICAqIEByZXR1cm4gZGVmYXVsdCBsYW5ndWFnZVxuICAgICAqL1xuICAgIHB1YmxpYyBkZWZhdWx0TGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRMYW5ndWFnZSA/IHRoaXMuX2RlZmF1bHRMYW5ndWFnZSA6ICdlbic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGlzdGUgZGVyIHp1IGJlYXJiZWl0ZW5kZW4gU3ByYWNoZW4uXG4gICAgICogQHJldHVybiBsYW5ndWFnZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgbGFuZ3VhZ2VzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmd1YWdlcyA/IHRoaXMuX2xhbmd1YWdlcyA6IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHNyYyBkaXJlY3RvcnksIHdoZXJlIHRoZSBtYXN0ZXIgeGxpZiBpcyBsb2NhdGVkLlxuICAgICAqIEByZXR1cm4gc3JjRGlyXG4gICAgICovXG4gICAgcHVibGljIHNyY0RpcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3JjRGlyID8gdGhpcy5fc3JjRGlyIDogJy4nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGZpbGUgbmFtZSBvZiB0aGUgeGxpZiBmaWxlIGZvciBpbnB1dCBhbmQgb3V0cHV0LlxuICAgICAqIERlZmF1bHQgaXMgbWVzc2FnZXNcbiAgICAgKiBAcmV0dXJuIGJhc2UgZmlsZVxuICAgICAqL1xuICAgIHB1YmxpYyBpMThuQmFzZUZpbGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2kxOG5CYXNlRmlsZSA/IHRoaXMuX2kxOG5CYXNlRmlsZSA6ICdtZXNzYWdlcyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIG1hc3RlciB4bGlmIGZpbGUgKHRoZSBvbmUgZ2VuZXJhdGVkIGJ5IG5nLXhpMThuKS5cbiAgICAgKiBEZWZhdWx0IGlzIDxzcmNEaXI+LzxpMThuQmFzZUZpbGU+LnhsZi5cbiAgICAgKiBAcmV0dXJuIG1hc3RlciBmaWxlXG4gICAgICovXG4gICAgcHVibGljIGkxOG5GaWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBqb2luKHRoaXMuc3JjRGlyKCksXG4gICAgICAgICAgICAodGhpcy5faTE4bkZpbGUgPyB0aGlzLl9pMThuRmlsZSA6IHRoaXMuaTE4bkJhc2VGaWxlKCkgKyAnLicgKyB0aGlzLnN1ZmZpeEZvckdlbmVyYXRlZEkxOG5GaWxlKCkpXG4gICAgICAgICkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZvcm1hdCBvZiB0aGUgbWFzdGVyIHhsaWYgZmlsZS5cbiAgICAgKiBEZWZhdWx0IGlzIFwieGxmXCIsIHBvc3NpYmxlIGFyZSBcInhsZlwiIG9yIFwieGxmMlwiIG9yIFwieG1iXCIuXG4gICAgICogQHJldHVybiBmb3JtYXRcbiAgICAgKi9cbiAgICBwdWJsaWMgaTE4bkZvcm1hdCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2kxOG5Gb3JtYXQgPyB0aGlzLl9pMThuRm9ybWF0IDogJ3hsZicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHBvdGVudGlhbGx5IHRvIGJlIGdlbmVyYXRlZCBJMThuLUZpbGUgd2l0aCB0aGUgdHJhbnNsYXRpb25zIGZvciBvbmUgbGFuZ3VhZ2UuXG4gICAgICogQHBhcmFtIGxhbmcgbGFuZ3VhZ2Ugc2hvcnRjdXRcbiAgICAgKiBAcmV0dXJuIFBhdGggb2YgZmlsZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZW5lcmF0ZWRJMThuRmlsZShsYW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gam9pbih0aGlzLmdlbkRpcigpLCB0aGlzLmkxOG5CYXNlRmlsZSgpICsgJy4nICsgbGFuZyArICcuJyArIHRoaXMuc3VmZml4Rm9yR2VuZXJhdGVkSTE4bkZpbGUoKSkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3VmZml4Rm9yR2VuZXJhdGVkSTE4bkZpbGUoKTogc3RyaW5nIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmkxOG5Gb3JtYXQoKSkge1xuICAgICAgICAgICAgY2FzZSAneGxmJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3hsZic7XG4gICAgICAgICAgICBjYXNlICd4bGYyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3hsZic7XG4gICAgICAgICAgICBjYXNlICd4bWInOlxuICAgICAgICAgICAgICAgIHJldHVybiAneHRiJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHBvdGVudGlhbGx5IHRvIGJlIGdlbmVyYXRlZCB0cmFuc2xhdGUtRmlsZSBmb3Igbmd4LXRyYW5zbGF0ZSB3aXRoIHRoZSB0cmFuc2xhdGlvbnMgZm9yIG9uZSBsYW5ndWFnZS5cbiAgICAgKiBAcGFyYW0gbGFuZyBsYW5ndWFnZSBzaG9ydGN1dFxuICAgICAqIEByZXR1cm4gUGF0aCBvZiBmaWxlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlZE5neFRyYW5zbGF0ZUZpbGUobGFuZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGpvaW4odGhpcy5nZW5EaXIoKSwgdGhpcy5pMThuQmFzZUZpbGUoKSArICcuJyArIGxhbmcgKyAnLicgKyAnanNvbicpLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZW5jb2RpbmcgdXNlZCB0byB3cml0ZSBuZXcgWExJRkYtZmlsZXMuXG4gICAgICogQHJldHVybiBlbmNvZGluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBlbmNvZGluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW5jb2RpbmcgPyB0aGlzLl9lbmNvZGluZyA6ICdVVEYtOCc7XG4gICAgfVxuXG4gICAgIC8qKlxuICAgICAgKiBPdXRwdXQtRGlyZWN0b3J5LCB3aGVyZSB0aGUgb3V0cHV0IGlzIHdyaXR0ZW4gdG8uXG4gICAgICAqIERlZmF1bHQgaXMgPHNyY0Rpcj4uXG4gICAgICovXG4gICAgcHVibGljIGdlbkRpcigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2VuRGlyID8gdGhpcy5fZ2VuRGlyIDogdGhpcy5zcmNEaXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlVW51c2VkSWRzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX3JlbW92ZVVudXNlZElkcykpID8gdHJ1ZSA6IHRoaXMuX3JlbW92ZVVudXNlZElkcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3VwcG9ydE5neFRyYW5zbGF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl9zdXBwb3J0Tmd4VHJhbnNsYXRlKSkgPyBmYWxzZSA6IHRoaXMuX3N1cHBvcnROZ3hUcmFuc2xhdGU7XG4gICAgfVxuXG4gICAgcHVibGljIG5neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fbmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm4pKSA/XG4gICAgICAgICAgICBOZ3hUcmFuc2xhdGVFeHRyYWN0b3IuRGVmYXVsdEV4dHJhY3Rpb25QYXR0ZXJuIDogdGhpcy5fbmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBzb3VyY2UgbXVzdCBiZSB1c2VkIGFzIHRhcmdldCBmb3IgbmV3IHRyYW5zLXVuaXRzXG4gICAgICogRGVmYXVsdCBpcyB0cnVlXG4gICAgICovXG4gICAgcHVibGljIHVzZVNvdXJjZUFzVGFyZ2V0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX3VzZVNvdXJjZUFzVGFyZ2V0KSkgPyB0cnVlIDogdGhpcy5fdXNlU291cmNlQXNUYXJnZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJhZWZpeCB1c2VkIGZvciB0YXJnZXQgd2hlbiBjb3B5aW5nIG5ldyB0cmFucy11bml0c1xuICAgICAqIERlZmF1bHQgaXMgXCJcIlxuICAgICAqL1xuICAgIHB1YmxpYyB0YXJnZXRQcmFlZml4KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fdGFyZ2V0UHJhZWZpeCkpID8gJycgOiB0aGlzLl90YXJnZXRQcmFlZml4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1ZmZpeCB1c2VkIGZvciB0YXJnZXQgd2hlbiBjb3B5aW5nIG5ldyB0cmFucy11bml0c1xuICAgICAqIERlZmF1bHQgaXMgXCJcIlxuICAgICAqL1xuICAgIHB1YmxpYyB0YXJnZXRTdWZmaXgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl90YXJnZXRTdWZmaXgpKSA/ICcnIDogdGhpcy5fdGFyZ2V0U3VmZml4O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHNldCwgcnVuIHhtbCByZXN1bHQgdGhyb3VnaCBiZWF1dGlmaWVyIChwcmV0dHktZGF0YSkuXG4gICAgICovXG4gICAgcHVibGljIGJlYXV0aWZ5T3V0cHV0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2JlYXV0aWZ5T3V0cHV0KSkgPyBmYWxzZSA6IHRoaXMuX2JlYXV0aWZ5T3V0cHV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHNldCwgb3JkZXIgb2YgbmV3IHRyYW5zIHVuaXRzIHdpbGwgYmUgYXMgaW4gbWFzdGVyLlxuICAgICAqIE90aGVyd2lzZSB0aGV5IGFyZSBhZGRlZCBhdCB0aGUgZW5kLlxuICAgICAqL1xuICAgIHB1YmxpYyBwcmVzZXJ2ZU9yZGVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX3ByZXNlcnZlT3JkZXIpKSA/IHRydWUgOiB0aGlzLl9wcmVzZXJ2ZU9yZGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gdXNlIGF1dG90cmFuc2xhdGUgZm9yIG5ldyB0cmFucy11bml0c1xuICAgICAqIERlZmF1bHQgaXMgZmFsc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgYXV0b3RyYW5zbGF0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2F1dG90cmFuc2xhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXkodGhpcy5fYXV0b3RyYW5zbGF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoPHN0cmluZ1tdPnRoaXMuX2F1dG90cmFuc2xhdGUpLmxlbmd0aCA+IDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDxib29sZWFuPiB0aGlzLl9hdXRvdHJhbnNsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdG8gdXNlIGF1dG90cmFuc2xhdGUgZm9yIGEgZ2l2ZW4gbGFuZ3VhZ2UuXG4gICAgICogQHBhcmFtIGxhbmcgbGFuZ3VhZ2UgY29kZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXV0b3RyYW5zbGF0ZUxhbmd1YWdlKGxhbmc6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRvdHJhbnNsYXRlZExhbmd1YWdlcygpLmluZGV4T2YobGFuZykgPj0gMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYSBsaXN0IG9mIGxhbmd1YWdlcyB0byBiZSBhdXRvdHJhbnNsYXRlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXV0b3RyYW5zbGF0ZWRMYW5ndWFnZXMoKTogc3RyaW5nW10ge1xuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fYXV0b3RyYW5zbGF0ZSkgfHwgdGhpcy5fYXV0b3RyYW5zbGF0ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheSh0aGlzLl9hdXRvdHJhbnNsYXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuICg8c3RyaW5nW10+dGhpcy5fYXV0b3RyYW5zbGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubGFuZ3VhZ2VzKCkuc2xpY2UoMSk7IC8vIGZpcnN0IGlzIHNvdXJjZSBsYW5ndWFnZVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFQSSBrZXkgdG8gYmUgdXNlZCBmb3IgR29vZ2xlIFRyYW5zbGF0ZVxuICAgICAqIEByZXR1cm4gYXBpIGtleVxuICAgICAqL1xuICAgIHB1YmxpYyBhcGlrZXkoKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZCh0aGlzLl9hcGlrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXBpa2V5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYXBpa2V5UGF0aCA9IHRoaXMuYXBpa2V5ZmlsZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXBpa2V5ZmlsZSgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoYXBpa2V5UGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZpbGVVdGlsLnJlYWQoYXBpa2V5UGF0aCwgJ3V0Zi04Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdCgnYXBpIGtleSBmaWxlIG5vdCBmb3VuZDogQVBJX0tFWV9GSUxFPSVzJywgYXBpa2V5UGF0aCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBmaWxlIG5hbWUgZm9yIEFQSSBrZXkgdG8gYmUgdXNlZCBmb3IgR29vZ2xlIFRyYW5zbGF0ZS5cbiAgICAgKiBFeHBsaWNpdGx5IHNldCBvciByZWFkIGZyb20gZW52IHZhciBBUElfS0VZX0ZJTEUuXG4gICAgICogQHJldHVybiBmaWxlIG9mIGFwaSBrZXlcbiAgICAgKi9cbiAgICBwdWJsaWMgYXBpa2V5ZmlsZSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5fYXBpa2V5ZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FwaWtleWZpbGU7XG4gICAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuQVBJX0tFWV9GSUxFKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvY2Vzcy5lbnYuQVBJX0tFWV9GSUxFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=