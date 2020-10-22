/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
                for (var PROFILE_CANDIDATES_1 = tslib_1.__values(PROFILE_CANDIDATES), PROFILE_CANDIDATES_1_1 = PROFILE_CANDIDATES_1.next(); !PROFILE_CANDIDATES_1_1.done; PROFILE_CANDIDATES_1_1 = PROFILE_CANDIDATES_1.next()) {
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
        if (!pathToAdjust || isAbsolute(pathToAdjust)) {
            return pathToAdjust;
        }
        return join(dirname(profilePath), pathToAdjust).replace(/\\/g, '/');
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
            for (var _b = tslib_1.__values(this.languages()), _c = _b.next(); !_c.done; _c = _b.next()) {
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
        return join(this.srcDir(), (this._i18nFile ? this._i18nFile : this.i18nBaseFile() + '.' + this.suffixForGeneratedI18nFile())).replace(/\\/g, '/');
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
        return join(this.genDir(), this.i18nBaseFile() + '.' + lang + '.' + this.suffixForGeneratedI18nFile()).replace(/\\/g, '/');
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
        return join(this.genDir(), this.i18nBaseFile() + '.' + lang + '.' + 'json').replace(/\\/g, '/');
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
                    throw new Error(format('api key file not found: API_KEY_FILE=%s', apikeyPath));
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
export { XliffMergeParameters };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYtbWVyZ2UtcGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsieGxpZmZtZXJnZS94bGlmZi1tZXJnZS1wYXJhbWV0ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFNQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQztBQUN6QixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFHcEQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBWSxNQUFNLE1BQU0sQ0FBQzs7SUFFcEQsa0JBQWtCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsbUJBQW1CLENBQUM7QUFFaEU7SUF3Q0k7UUFDSSxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBZEQ7Ozs7T0FJRzs7Ozs7OztJQUNXLHNDQUFpQjs7Ozs7O0lBQS9CLFVBQWdDLE9BQXVCLEVBQUUsY0FBNEI7O1lBQzNFLFVBQVUsR0FBRyxJQUFJLG9CQUFvQixFQUFFO1FBQzdDLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFPRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDWSx5Q0FBb0I7Ozs7Ozs7SUFBbkMsVUFBb0MsV0FBbUI7O1lBQy9DLE9BQWU7UUFDbkIsSUFBSTtZQUNBLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNuRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUM7U0FDZjs7WUFDSyxhQUFhLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3RELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRTtZQUNsRCxPQUFPLGFBQWEsQ0FBQztTQUN4QjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7O0lBQ0ssd0NBQVM7Ozs7Ozs7O0lBQWpCLFVBQWtCLE9BQXVCLEVBQUUsY0FBNEI7UUFDbkUsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQixjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5Qzs7WUFDSyxZQUFZLEdBQVksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ2hELElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztTQUMvQjtRQUNELElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7U0FDbkM7UUFDRCxJQUFJLFlBQVksRUFBRTtZQUNkLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMxQyxpRkFBaUY7WUFDakYsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3JELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzlDO2FBQ0o7WUFDRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7OztJQUNLLDBDQUFXOzs7Ozs7SUFBbkIsVUFBb0IsT0FBdUI7OztZQUNqQyxXQUFXLEdBQVcsT0FBTyxDQUFDLFdBQVc7UUFDL0MsSUFBSSxDQUFDLFdBQVcsRUFBRTs7Z0JBQ2QsS0FBNkIsSUFBQSx1QkFBQSxpQkFBQSxrQkFBa0IsQ0FBQSxzREFBQSxzRkFBRTtvQkFBNUMsSUFBTSxjQUFjLCtCQUFBOzt3QkFDZixPQUFPLEdBQUcsb0JBQW9CLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDO29CQUN6RSxJQUFJLE9BQU8sRUFBRTt3QkFDVCxJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQzt3QkFDdEMsT0FBTyxPQUFPLENBQUM7cUJBQ2xCO2lCQUNKOzs7Ozs7Ozs7WUFDRCxPQUFPLEVBQUUsQ0FBQztTQUNiOztZQUNHLE9BQWU7UUFDbkIsSUFBSTtZQUNBLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNuRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFlLENBQUMsMEJBQTBCLEdBQUcsV0FBVyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDM0YsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELElBQUksQ0FBQyxlQUFlLEdBQUcsV0FBVyxDQUFDOztZQUM3QixjQUFjLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDOzs7WUFFakQsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLGlCQUFpQjtRQUMxRCxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRixpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvRixpQkFBaUIsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2RyxPQUFPLGNBQWMsQ0FBQztJQUMxQixDQUFDOzs7Ozs7O0lBRU8sc0RBQXVCOzs7Ozs7SUFBL0IsVUFBZ0MsV0FBbUIsRUFBRSxZQUFnQztRQUNqRixJQUFJLENBQUMsWUFBWSxJQUFJLFVBQVUsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUMzQyxPQUFPLFlBQVksQ0FBQztTQUN2QjtRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7Ozs7OztJQUVPLG1EQUFvQjs7Ozs7SUFBNUIsVUFBNkIsY0FBMkI7UUFDcEQsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQixPQUFPO1NBQ1Y7O1lBQ0ssT0FBTyxHQUFHLGNBQWMsQ0FBQyxpQkFBaUI7UUFDaEQsSUFBSSxPQUFPLEVBQUU7WUFDVCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7YUFDL0I7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNyQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDbkM7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUMzQyxJQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7YUFDL0M7WUFDRCxJQUFJLE9BQU8sQ0FBQyxlQUFlLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO2FBQ25EO1lBQ0QsSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7YUFDdkM7WUFDRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUNqQztZQUNELElBQUksT0FBTyxDQUFDLHNCQUFzQixFQUFFO2dCQUNoQyxJQUFJLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUU7b0JBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQztpQkFDeEQ7YUFDSjtZQUNELElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDaEIsNERBQTREO2dCQUM1RCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7YUFDakM7WUFDRCxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQzthQUM3QztZQUNELElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO2FBQ3JDO1lBQ0QsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO2dCQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7YUFDekM7WUFDRCxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQzthQUNyQztZQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO2FBQ25EO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO2dCQUNqRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2FBQzNEO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFO2dCQUMzRCxJQUFJLENBQUMsOEJBQThCLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDO2FBQy9FO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUMvQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO2FBQ3ZEO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDMUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO2FBQzdDO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDO2FBQ2pEO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQ2pDO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO2FBQ3pDO1NBQ0o7YUFBTTtZQUNILElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLDZEQUE2RCxDQUFDLENBQUM7U0FDMUY7SUFDTCxDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7O0lBQ0ssOENBQWU7Ozs7OztJQUF2QjtRQUFBLGlCQXVFRTtRQXRFRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDakQsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7U0FDeEU7UUFDRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTzs7OztRQUFDLFVBQUMsSUFBSTtZQUMxQixLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxFQUFDLENBQUM7O1lBQ0MsS0FBWTs7WUFDWixHQUFRO1FBQ1osdUJBQXVCO1FBQ3ZCLElBQUk7WUFDQSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN0QztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNYO1FBQ0QsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1NBQ25HO1FBQ0QsdUJBQXVCO1FBQ3ZCLElBQUk7WUFDQSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUN0QztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUNYO1FBQ0QsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO1NBQ25HO1FBQ0QseUJBQXlCO1FBQ3pCLElBQUk7WUFDQSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQztTQUNwRztRQUNELHFDQUFxQztRQUNyQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQy9GLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsNkNBQTZDLENBQUMsQ0FBQyxDQUFDO1NBQ2xJO1FBQ0QsaUNBQWlDO1FBQ2pDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLG1EQUFtRCxDQUFDLENBQUMsQ0FBQztTQUNuRztRQUNELDREQUE0RDtRQUM1RCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQyxJQUFJO1lBQ3hDLElBQUksS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLDBCQUEwQixHQUFHLElBQUksR0FBRywrQkFBK0IsQ0FBQyxDQUFDLENBQUM7YUFDbkg7WUFDRCxJQUFJLElBQUksS0FBSyxLQUFJLENBQUMsZUFBZSxFQUFFLEVBQUU7Z0JBQ2pDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNqQixJQUFJLGVBQWUsQ0FBQywwQkFBMEIsR0FBRyxJQUFJLEdBQUcsMkRBQTJELENBQUMsQ0FBQyxDQUFDO2FBQzdIO1FBQ0wsQ0FBQyxFQUFDLENBQUM7UUFDSCw4QkFBOEI7UUFDOUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBRTs7Z0JBQ3RCLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7WUFDNUYsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUNqQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FDakIsSUFBSSxlQUFlLENBQUMsaUNBQWlDLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUM7YUFDNUg7U0FDSjtRQUNELHVDQUF1QztRQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7WUFDM0IsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDakMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ25CLDRCQUE0QixHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyw2REFBNkQsQ0FBQyxDQUFDO2FBQzVIO1lBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQ25CLDJCQUEyQixHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyw2REFBNkQsQ0FBQyxDQUFDO2FBQzFIO1NBQ0o7SUFDSixDQUFDO0lBRUY7Ozs7O09BS0c7Ozs7Ozs7OztJQUNLLGtEQUFtQjs7Ozs7Ozs7SUFBM0IsVUFBNEIsSUFBWTs7WUFDOUIsT0FBTyxHQUFHLHdDQUF3QztRQUN4RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQWUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUN0RjtJQUNMLENBQUM7Ozs7SUFFTSw0Q0FBYTs7O0lBQXBCO1FBQ0ksT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDbEYsQ0FBQzs7OztJQUVNLHNDQUFPOzs7SUFBZDtRQUNJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3RFLENBQUM7Ozs7SUFFTSxvQ0FBSzs7O0lBQVo7UUFDSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNsRSxDQUFDO0lBRUQ7O09BRUc7Ozs7OztJQUNJLGdEQUFpQjs7Ozs7SUFBeEIsVUFBeUIsYUFBNEI7O1FBQ2pELGFBQWEsQ0FBQyxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUNuRCxhQUFhLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNwRSxhQUFhLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELGFBQWEsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELGFBQWEsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFDaEUsYUFBYSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4RCxhQUFhLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDOztZQUN4RCxLQUF1QixJQUFBLEtBQUEsaUJBQUEsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBLGdCQUFBLDRCQUFFO2dCQUFwQyxJQUFNLFFBQVEsV0FBQTtnQkFDZixhQUFhLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzthQUMxRjs7Ozs7Ozs7O1FBQ0QsYUFBYSxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUNwRSxhQUFhLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUM7UUFDNUUsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsRUFBRTtZQUM1QixhQUFhLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUM7U0FDbkc7UUFDRCxhQUFhLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUM7UUFDeEUsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtZQUMxQixhQUFhLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLGFBQWEsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDbkU7UUFDRCxhQUFhLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLGFBQWEsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDbEUsYUFBYSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUNoRSxhQUFhLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ2hFLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3RCLGFBQWEsQ0FBQyxLQUFLLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztZQUNyRixhQUFhLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkUsYUFBYSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztTQUM3RDtJQUNMLENBQUM7SUFFRDs7O09BR0c7Ozs7O0lBQ0ksOENBQWU7Ozs7SUFBdEI7UUFDSSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7SUFDSSx3Q0FBUzs7OztJQUFoQjtRQUNJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFFRDs7O09BR0c7Ozs7O0lBQ0kscUNBQU07Ozs7SUFBYjtRQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7OztPQUlHOzs7Ozs7SUFDSSwyQ0FBWTs7Ozs7SUFBbkI7UUFDSSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNoRSxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7O0lBQ0ksdUNBQVE7Ozs7O0lBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQ3JCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUNwRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7OztJQUNJLHlDQUFVOzs7OztJQUFqQjtRQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7O0lBQ0ksZ0RBQWlCOzs7OztJQUF4QixVQUF5QixJQUFZO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9ILENBQUM7Ozs7O0lBRU8seURBQTBCOzs7O0lBQWxDO1FBQ0ksUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDdkIsS0FBSyxLQUFLO2dCQUNOLE9BQU8sS0FBSyxDQUFDO1lBQ2pCLEtBQUssTUFBTTtnQkFDUCxPQUFPLEtBQUssQ0FBQztZQUNqQixLQUFLLEtBQUs7Z0JBQ04sT0FBTyxLQUFLLENBQUM7U0FDcEI7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRzs7Ozs7O0lBQ0ksd0RBQXlCOzs7OztJQUFoQyxVQUFpQyxJQUFZO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNwRyxDQUFDO0lBRUQ7OztPQUdHOzs7OztJQUNJLHVDQUFROzs7O0lBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNyRCxDQUFDO0lBRUE7OztNQUdFOzs7Ozs7SUFDSSxxQ0FBTTs7Ozs7SUFBYjtRQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZELENBQUM7Ozs7SUFFTSw4Q0FBZTs7O0lBQXRCO1FBQ0ksT0FBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQ3JGLENBQUM7Ozs7SUFFTSxrREFBbUI7OztJQUExQjtRQUNJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztJQUM5RixDQUFDOzs7O0lBRU0sNERBQTZCOzs7SUFBcEM7UUFDSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELHFCQUFxQixDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUM7SUFDN0YsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7O0lBQ0ksZ0RBQWlCOzs7OztJQUF4QjtRQUNJLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztJQUN6RixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7SUFDSSw0Q0FBYTs7Ozs7SUFBcEI7UUFDSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvRSxDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7SUFDSSwyQ0FBWTs7Ozs7SUFBbkI7UUFDSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM3RSxDQUFDO0lBRUQ7O09BRUc7Ozs7O0lBQ0ksNkNBQWM7Ozs7SUFBckI7UUFDSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUNwRixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7SUFDSSw0Q0FBYTs7Ozs7SUFBcEI7UUFDSSxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUNqRixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7SUFDSSw0Q0FBYTs7Ozs7SUFBcEI7UUFDSSxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUN4QyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUNELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUM5QixPQUFPLENBQUMsbUJBQVUsSUFBSSxDQUFDLGNBQWMsRUFBQSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztTQUNyRDtRQUNELE9BQU8sbUJBQVUsSUFBSSxDQUFDLGNBQWMsRUFBQSxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7O09BR0c7Ozs7OztJQUNJLG9EQUFxQjs7Ozs7SUFBNUIsVUFBNkIsSUFBWTtRQUNyQyxPQUFPLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVEOztPQUVHOzs7OztJQUNJLHNEQUF1Qjs7OztJQUE5QjtRQUNJLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssS0FBSyxFQUFFO1lBQ3pFLE9BQU8sRUFBRSxDQUFDO1NBQ2I7UUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDOUIsT0FBTyxDQUFDLG1CQUFVLElBQUksQ0FBQyxjQUFjLEVBQUEsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMkJBQTJCO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7Ozs7O0lBQ0kscUNBQU07Ozs7SUFBYjtRQUNJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3ZCO2FBQU07O2dCQUNHLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUNuQixJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQzNCLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQzdDO3FCQUFNO29CQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLHlDQUF5QyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7aUJBQ2xGO2FBQ0o7aUJBQU07Z0JBQ0gsT0FBTyxJQUFJLENBQUM7YUFDZjtTQUNKO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7Ozs7OztJQUNJLHlDQUFVOzs7OztJQUFqQjtRQUNJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNsQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDM0I7YUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFO1lBQ2pDLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7U0FDbkM7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDO0lBQ0wsMkJBQUM7QUFBRCxDQUFDLEFBcGtCRCxJQW9rQkM7Ozs7Ozs7SUFsa0JHLCtDQUFnQzs7Ozs7SUFDaEMsc0NBQXdCOzs7OztJQUN4Qix3Q0FBMEI7Ozs7O0lBQzFCLDhDQUFnQzs7Ozs7SUFDaEMsZ0RBQWlDOzs7OztJQUNqQyx1Q0FBd0I7Ozs7O0lBQ3hCLDZDQUE4Qjs7Ozs7SUFDOUIseUNBQTBCOzs7OztJQUMxQiwyQ0FBNEI7Ozs7O0lBQzVCLHlDQUEwQjs7Ozs7SUFDMUIsdUNBQXdCOzs7OztJQUN4QiwwQ0FBNkI7Ozs7O0lBQzdCLGdEQUFrQzs7Ozs7SUFDbEMsb0RBQXNDOzs7OztJQUN0Qyw4REFBK0M7Ozs7O0lBQy9DLGtEQUFvQzs7Ozs7SUFDcEMsOENBQStCOzs7OztJQUMvQiw2Q0FBOEI7Ozs7O0lBQzlCLCtDQUFpQzs7Ozs7SUFDakMsOENBQWdDOzs7OztJQUNoQyw4Q0FBeUM7Ozs7O0lBQ3pDLHVDQUF3Qjs7Ozs7SUFDeEIsMkNBQTRCOztJQUU1QiwyQ0FBc0M7O0lBQ3RDLDZDQUErQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBtYXJ0aW4gb24gMTcuMDIuMjAxNy5cbiAqIENvbGxlY3Rpb24gb2YgYWxsIHBhcmFtZXRlcnMgdXNlZCBieSB0aGUgdG9vbC5cbiAqIFRoZSBwYXJhbWV0ZXJzIGFyZSByZWFkIGZvcm0gdGhlIHByb2ZpbGUgb3IgZGVmYXVsdHMgYXJlIHVzZWQuXG4gKi9cblxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHtYbGlmZk1lcmdlRXJyb3J9IGZyb20gJy4veGxpZmYtbWVyZ2UtZXJyb3InO1xuaW1wb3J0IHtTdGF0c30gZnJvbSAnZnMnO1xuaW1wb3J0IHtDb21tYW5kT3V0cHV0fSBmcm9tICcuLi9jb21tb24vY29tbWFuZC1vdXRwdXQnO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHtpc0FycmF5LCBpc051bGxPclVuZGVmaW5lZH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHtQcm9ncmFtT3B0aW9ucywgSUNvbmZpZ0ZpbGV9IGZyb20gJy4vaS14bGlmZi1tZXJnZS1vcHRpb25zJztcbmltcG9ydCB7RmlsZVV0aWx9IGZyb20gJy4uL2NvbW1vbi9maWxlLXV0aWwnO1xuaW1wb3J0IHtOZ3hUcmFuc2xhdGVFeHRyYWN0b3J9IGZyb20gJy4vbmd4LXRyYW5zbGF0ZS1leHRyYWN0b3InO1xuaW1wb3J0IHtkaXJuYW1lLCBpc0Fic29sdXRlLCBqb2luLCBub3JtYWxpemV9IGZyb20gJ3BhdGgnO1xuXG5jb25zdCBQUk9GSUxFX0NBTkRJREFURVMgPSBbJ3BhY2thZ2UuanNvbicsICcuYW5ndWxhci1jbGkuanNvbiddO1xuXG5leHBvcnQgY2xhc3MgWGxpZmZNZXJnZVBhcmFtZXRlcnMge1xuXG4gICAgcHJpdmF0ZSB1c2VkUHJvZmlsZVBhdGg6IHN0cmluZztcbiAgICBwcml2YXRlIF9xdWlldDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF92ZXJib3NlOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2FsbG93SWRDaGFuZ2U6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfZGVmYXVsdExhbmd1YWdlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfc3JjRGlyOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfaTE4bkJhc2VGaWxlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfaTE4bkZpbGU6IHN0cmluZztcbiAgICBwcml2YXRlIF9pMThuRm9ybWF0OiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfZW5jb2Rpbmc6IHN0cmluZztcbiAgICBwcml2YXRlIF9nZW5EaXI6IHN0cmluZztcbiAgICBwcml2YXRlIF9sYW5ndWFnZXM6IHN0cmluZ1tdO1xuICAgIHByaXZhdGUgX3JlbW92ZVVudXNlZElkczogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9zdXBwb3J0Tmd4VHJhbnNsYXRlOiBib29sZWFuO1xuICAgIHByaXZhdGUgX25neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfdXNlU291cmNlQXNUYXJnZXQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfdGFyZ2V0UHJhZWZpeDogc3RyaW5nO1xuICAgIHByaXZhdGUgX3RhcmdldFN1ZmZpeDogc3RyaW5nO1xuICAgIHByaXZhdGUgX2JlYXV0aWZ5T3V0cHV0OiBib29sZWFuO1xuICAgIHByaXZhdGUgX3ByZXNlcnZlT3JkZXI6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfYXV0b3RyYW5zbGF0ZTogYm9vbGVhbnxzdHJpbmdbXTtcbiAgICBwcml2YXRlIF9hcGlrZXk6IHN0cmluZztcbiAgICBwcml2YXRlIF9hcGlrZXlmaWxlOiBzdHJpbmc7XG5cbiAgICBwdWJsaWMgZXJyb3JzRm91bmQ6IFhsaWZmTWVyZ2VFcnJvcltdO1xuICAgIHB1YmxpYyB3YXJuaW5nc0ZvdW5kOiBzdHJpbmdbXTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBQYXJhbWV0ZXJzLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIGNvbW1hbmQgb3B0aW9uc1xuICAgICAqIEBwYXJhbSBwcm9maWxlQ29udGVudCBnaXZlbiBwcm9maWxlIChpZiBub3QsIGl0IGlzIHJlYWQgZnJvbSB0aGUgcHJvZmlsZSBwYXRoIGZyb20gb3B0aW9ucykuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGVGcm9tT3B0aW9ucyhvcHRpb25zOiBQcm9ncmFtT3B0aW9ucywgcHJvZmlsZUNvbnRlbnQ/OiBJQ29uZmlnRmlsZSkge1xuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gbmV3IFhsaWZmTWVyZ2VQYXJhbWV0ZXJzKCk7XG4gICAgICAgIHBhcmFtZXRlcnMuY29uZmlndXJlKG9wdGlvbnMsIHByb2ZpbGVDb250ZW50KTtcbiAgICAgICAgcmV0dXJuIHBhcmFtZXRlcnM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5lcnJvcnNGb3VuZCA9IFtdO1xuICAgICAgICB0aGlzLndhcm5pbmdzRm91bmQgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIHBvdGVudGlhbCBwcm9maWxlLlxuICAgICAqIFRvIGJlIGEgY2FuZGlkYXRlLCBmaWxlIG11c3QgZXhpc3QgYW5kIGNvbnRhaW4gcHJvcGVydHkgXCJ4bGlmZm1lcmdlT3B0aW9uc1wiLlxuICAgICAqIEBwYXJhbSBwcm9maWxlUGF0aCBwYXRoIG9mIHByb2ZpbGVcbiAgICAgKiBAcmV0dXJuIHBhcnNlZCBjb250ZW50IG9mIGZpbGUgb3IgbnVsbCwgaWYgZmlsZSBkb2VzIG5vdCBleGlzdCBvciBpcyBub3QgYSBwcm9maWxlIGNhbmRpZGF0ZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHN0YXRpYyByZWFkUHJvZmlsZUNhbmRpZGF0ZShwcm9maWxlUGF0aDogc3RyaW5nKTogSUNvbmZpZ0ZpbGUge1xuICAgICAgICBsZXQgY29udGVudDogc3RyaW5nO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhwcm9maWxlUGF0aCwgJ1VURi04Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyc2VkQ29udGVudDogSUNvbmZpZ0ZpbGUgPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuICAgICAgICBpZiAocGFyc2VkQ29udGVudCAmJiBwYXJzZWRDb250ZW50LnhsaWZmbWVyZ2VPcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VkQ29udGVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZSBtZSBmcm9tIHRoZSBwcm9maWxlIGNvbnRlbnQuXG4gICAgICogKHB1YmxpYyBvbmx5IGZvciB0ZXN0IHVzYWdlKS5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGdpdmVuIGF0IHJ1bnRpbWUgdmlhIGNvbW1hbmQgbGluZVxuICAgICAqIEBwYXJhbSBwcm9maWxlQ29udGVudCBpZiBudWxsLCByZWFkIGl0IGZyb20gcHJvZmlsZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGNvbmZpZ3VyZShvcHRpb25zOiBQcm9ncmFtT3B0aW9ucywgcHJvZmlsZUNvbnRlbnQ/OiBJQ29uZmlnRmlsZSkge1xuICAgICAgICB0aGlzLmVycm9yc0ZvdW5kID0gW107XG4gICAgICAgIHRoaXMud2FybmluZ3NGb3VuZCA9IFtdO1xuICAgICAgICBpZiAoIXByb2ZpbGVDb250ZW50KSB7XG4gICAgICAgICAgICBwcm9maWxlQ29udGVudCA9IHRoaXMucmVhZFByb2ZpbGUob3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmFsaWRQcm9maWxlOiBib29sZWFuID0gKCEhcHJvZmlsZUNvbnRlbnQpO1xuICAgICAgICBpZiAob3B0aW9ucy5xdWlldCkge1xuICAgICAgICAgICAgdGhpcy5fcXVpZXQgPSBvcHRpb25zLnF1aWV0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnZlcmJvc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbGlkUHJvZmlsZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplRnJvbUNvbmZpZyhwcm9maWxlQ29udGVudCk7XG4gICAgICAgICAgICAvLyBpZiBsYW5ndWFnZXMgYXJlIGdpdmVuIGFzIHBhcmFtZXRlcnMsIHRoZXkgb3Z2ZXJpZGUgZXZlcnl0aGluZyBzYWlkIGluIHByb2ZpbGVcbiAgICAgICAgICAgIGlmICghIW9wdGlvbnMubGFuZ3VhZ2VzICYmIG9wdGlvbnMubGFuZ3VhZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYW5ndWFnZXMgPSBvcHRpb25zLmxhbmd1YWdlcztcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2RlZmF1bHRMYW5ndWFnZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWZhdWx0TGFuZ3VhZ2UgPSB0aGlzLl9sYW5ndWFnZXNbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jaGVja1BhcmFtZXRlcnMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWQgcHJvZmlsZS5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBwcm9ncmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJuIHRoZSByZWFkIHByb2ZpbGUgKGVtcHR5LCBpZiBub25lLCBudWxsIGlmIGVycm9ycylcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlYWRQcm9maWxlKG9wdGlvbnM6IFByb2dyYW1PcHRpb25zKTogSUNvbmZpZ0ZpbGUge1xuICAgICAgICBjb25zdCBwcm9maWxlUGF0aDogc3RyaW5nID0gb3B0aW9ucy5wcm9maWxlUGF0aDtcbiAgICAgICAgaWYgKCFwcm9maWxlUGF0aCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjb25maWdmaWxlbmFtZSBvZiBQUk9GSUxFX0NBTkRJREFURVMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlID0gWGxpZmZNZXJnZVBhcmFtZXRlcnMucmVhZFByb2ZpbGVDYW5kaWRhdGUoY29uZmlnZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlZFByb2ZpbGVQYXRoID0gY29uZmlnZmlsZW5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9maWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY29udGVudDogc3RyaW5nO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhwcm9maWxlUGF0aCwgJ1VURi04Jyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnNGb3VuZC5wdXNoKG5ldyBYbGlmZk1lcmdlRXJyb3IoJ2NvdWxkIG5vdCByZWFkIHByb2ZpbGUgXCInICsgcHJvZmlsZVBhdGggKyAnXCInKSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVzZWRQcm9maWxlUGF0aCA9IHByb2ZpbGVQYXRoO1xuICAgICAgICBjb25zdCBwcm9maWxlQ29udGVudDogSUNvbmZpZ0ZpbGUgPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuICAgICAgICAvLyByZXBsYWNlIGFsbCBwYXRoZXMgaW4gb3B0aW9ucyBieSBhYnNvbHV0ZSBwYXRoc1xuICAgICAgICBjb25zdCB4bGlmZm1lcmdlT3B0aW9ucyA9IHByb2ZpbGVDb250ZW50LnhsaWZmbWVyZ2VPcHRpb25zO1xuICAgICAgICB4bGlmZm1lcmdlT3B0aW9ucy5zcmNEaXIgPSB0aGlzLmFkanVzdFBhdGhUb1Byb2ZpbGVQYXRoKHByb2ZpbGVQYXRoLCB4bGlmZm1lcmdlT3B0aW9ucy5zcmNEaXIpO1xuICAgICAgICB4bGlmZm1lcmdlT3B0aW9ucy5nZW5EaXIgPSB0aGlzLmFkanVzdFBhdGhUb1Byb2ZpbGVQYXRoKHByb2ZpbGVQYXRoLCB4bGlmZm1lcmdlT3B0aW9ucy5nZW5EaXIpO1xuICAgICAgICB4bGlmZm1lcmdlT3B0aW9ucy5hcGlrZXlmaWxlID0gdGhpcy5hZGp1c3RQYXRoVG9Qcm9maWxlUGF0aChwcm9maWxlUGF0aCwgeGxpZmZtZXJnZU9wdGlvbnMuYXBpa2V5ZmlsZSk7XG4gICAgICAgIHJldHVybiBwcm9maWxlQ29udGVudDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkanVzdFBhdGhUb1Byb2ZpbGVQYXRoKHByb2ZpbGVQYXRoOiBzdHJpbmcsIHBhdGhUb0FkanVzdDogc3RyaW5nIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKCFwYXRoVG9BZGp1c3QgfHwgaXNBYnNvbHV0ZShwYXRoVG9BZGp1c3QpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGF0aFRvQWRqdXN0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBqb2luKGRpcm5hbWUocHJvZmlsZVBhdGgpLCBwYXRoVG9BZGp1c3QpLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemVGcm9tQ29uZmlnKHByb2ZpbGVDb250ZW50OiBJQ29uZmlnRmlsZSkge1xuICAgICAgICBpZiAoIXByb2ZpbGVDb250ZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvZmlsZSA9IHByb2ZpbGVDb250ZW50LnhsaWZmbWVyZ2VPcHRpb25zO1xuICAgICAgICBpZiAocHJvZmlsZSkge1xuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLnF1aWV0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3F1aWV0ID0gcHJvZmlsZS5xdWlldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS52ZXJib3NlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcmJvc2UgPSBwcm9maWxlLnZlcmJvc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUuYWxsb3dJZENoYW5nZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hbGxvd0lkQ2hhbmdlID0gcHJvZmlsZS5hbGxvd0lkQ2hhbmdlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb2ZpbGUuZGVmYXVsdExhbmd1YWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmYXVsdExhbmd1YWdlID0gcHJvZmlsZS5kZWZhdWx0TGFuZ3VhZ2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvZmlsZS5sYW5ndWFnZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYW5ndWFnZXMgPSBwcm9maWxlLmxhbmd1YWdlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9maWxlLnNyY0Rpcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NyY0RpciA9IHByb2ZpbGUuc3JjRGlyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb2ZpbGUuYW5ndWxhckNvbXBpbGVyT3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9maWxlLmFuZ3VsYXJDb21waWxlck9wdGlvbnMuZ2VuRGlyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2dlbkRpciA9IHByb2ZpbGUuYW5ndWxhckNvbXBpbGVyT3B0aW9ucy5nZW5EaXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb2ZpbGUuZ2VuRGlyKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBtdXN0IGJlIGFmdGVyIGFuZ3VsYXJDb21waWxlck9wdGlvbnMgdG8gYmUgcHJlZmVycmVkXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2VuRGlyID0gcHJvZmlsZS5nZW5EaXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvZmlsZS5pMThuQmFzZUZpbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pMThuQmFzZUZpbGUgPSBwcm9maWxlLmkxOG5CYXNlRmlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9maWxlLmkxOG5GaWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faTE4bkZpbGUgPSBwcm9maWxlLmkxOG5GaWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHByb2ZpbGUuaTE4bkZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2kxOG5Gb3JtYXQgPSBwcm9maWxlLmkxOG5Gb3JtYXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvZmlsZS5lbmNvZGluZykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuY29kaW5nID0gcHJvZmlsZS5lbmNvZGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS5yZW1vdmVVbnVzZWRJZHMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVW51c2VkSWRzID0gcHJvZmlsZS5yZW1vdmVVbnVzZWRJZHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUuc3VwcG9ydE5neFRyYW5zbGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdXBwb3J0Tmd4VHJhbnNsYXRlID0gcHJvZmlsZS5zdXBwb3J0Tmd4VHJhbnNsYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLm5neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX25neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuID0gcHJvZmlsZS5uZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS51c2VTb3VyY2VBc1RhcmdldCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91c2VTb3VyY2VBc1RhcmdldCA9IHByb2ZpbGUudXNlU291cmNlQXNUYXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUudGFyZ2V0UHJhZWZpeCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90YXJnZXRQcmFlZml4ID0gcHJvZmlsZS50YXJnZXRQcmFlZml4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLnRhcmdldFN1ZmZpeCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90YXJnZXRTdWZmaXggPSBwcm9maWxlLnRhcmdldFN1ZmZpeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS5hdXRvdHJhbnNsYXRlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2F1dG90cmFuc2xhdGUgPSBwcm9maWxlLmF1dG90cmFuc2xhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUuYmVhdXRpZnlPdXRwdXQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmVhdXRpZnlPdXRwdXQgPSBwcm9maWxlLmJlYXV0aWZ5T3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChwcm9maWxlLnByZXNlcnZlT3JkZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc2VydmVPcmRlciA9IHByb2ZpbGUucHJlc2VydmVPcmRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQocHJvZmlsZS5hcGlrZXkpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBpa2V5ID0gcHJvZmlsZS5hcGlrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHByb2ZpbGUuYXBpa2V5ZmlsZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcGlrZXlmaWxlID0gcHJvZmlsZS5hcGlrZXlmaWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy53YXJuaW5nc0ZvdW5kLnB1c2goJ2RpZCBub3QgZmluZCBcInhsaWZmbWVyZ2VPcHRpb25zXCIgaW4gcHJvZmlsZSwgdXNpbmcgZGVmYXVsdHMnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGFsbCBQYXJhbWV0ZXJzLCB3ZXRoZXIgdGhleSBhcmUgY29tcGxldGUgYW5kIGNvbnNpc3RlbnQuXG4gICAgICogaWYgc29tZXRoaW5nIGlzIHdyb25nIHdpdGggdGhlIHBhcmFtZXRlcnMsIGl0IGlzIGNvbGxlY3RlZCBpbiBlcnJvcnNGb3VuZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGNoZWNrUGFyYW1ldGVycygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGVja0xhbmd1YWdlU3ludGF4KHRoaXMuZGVmYXVsdExhbmd1YWdlKCkpO1xuICAgICAgICBpZiAodGhpcy5sYW5ndWFnZXMoKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzRm91bmQucHVzaChuZXcgWGxpZmZNZXJnZUVycm9yKCdubyBsYW5ndWFnZXMgc3BlY2lmaWVkJykpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFuZ3VhZ2VzKCkuZm9yRWFjaCgobGFuZykgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja0xhbmd1YWdlU3ludGF4KGxhbmcpO1xuICAgICAgICB9KTtcbiAgICAgICAgbGV0IHN0YXRzOiBTdGF0cztcbiAgICAgICAgbGV0IGVycjogYW55O1xuICAgICAgICAvLyBzcmNEaXIgc2hvdWxkIGV4aXN0c1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc3RhdHMgPSBmcy5zdGF0U3luYyh0aGlzLnNyY0RpcigpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZXJyID0gZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISFlcnIgfHwgIXN0YXRzLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzRm91bmQucHVzaChuZXcgWGxpZmZNZXJnZUVycm9yKCdzcmNEaXIgXCInICsgdGhpcy5zcmNEaXIoKSArICdcIiBpcyBub3QgYSBkaXJlY3RvcnknKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2VuRGlyIHNob3VsZCBleGlzdHNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN0YXRzID0gZnMuc3RhdFN5bmModGhpcy5nZW5EaXIoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGVyciA9IGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEhZXJyIHx8ICFzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yc0ZvdW5kLnB1c2gobmV3IFhsaWZmTWVyZ2VFcnJvcignZ2VuRGlyIFwiJyArIHRoaXMuZ2VuRGlyKCkgKyAnXCIgaXMgbm90IGEgZGlyZWN0b3J5JykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1hc3RlciBmaWxlIE1VU1QgZXhpc3RcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZzLmFjY2Vzc1N5bmModGhpcy5pMThuRmlsZSgpLCBmcy5jb25zdGFudHMuUl9PSyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5lcnJvcnNGb3VuZC5wdXNoKG5ldyBYbGlmZk1lcmdlRXJyb3IoJ2kxOG5GaWxlIFwiJyArIHRoaXMuaTE4bkZpbGUoKSArICdcIiBpcyBub3QgcmVhZGFibGUnKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaTE4bkZvcm1hdCBtdXN0IGJlIHhsZiB4bGYyIG9yIHhtYlxuICAgICAgICBpZiAoISh0aGlzLmkxOG5Gb3JtYXQoKSA9PT0gJ3hsZicgfHwgdGhpcy5pMThuRm9ybWF0KCkgPT09ICd4bGYyJyB8fCB0aGlzLmkxOG5Gb3JtYXQoKSA9PT0gJ3htYicpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yc0ZvdW5kLnB1c2gobmV3IFhsaWZmTWVyZ2VFcnJvcignaTE4bkZvcm1hdCBcIicgKyB0aGlzLmkxOG5Gb3JtYXQoKSArICdcIiBpbnZhbGlkLCBtdXN0IGJlIFwieGxmXCIgb3IgXCJ4bGYyXCIgb3IgXCJ4bWJcIicpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhdXRvdHJhbnNsYXRlIHJlcXVpcmVzIGFwaSBrZXlcbiAgICAgICAgaWYgKHRoaXMuYXV0b3RyYW5zbGF0ZSgpICYmICF0aGlzLmFwaWtleSgpKSB7XG4gICAgICAgICAgICB0aGlzLmVycm9yc0ZvdW5kLnB1c2gobmV3IFhsaWZmTWVyZ2VFcnJvcignYXV0b3RyYW5zbGF0ZSByZXF1aXJlcyBhbiBBUEkga2V5LCBwbGVhc2Ugc2V0IG9uZScpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhdXRvdHJhbnNsYXRlZCBsYW5ndWFnZXMgbXVzdCBiZSBpbiBsaXN0IG9mIGFsbCBsYW5ndWFnZXNcbiAgICAgICAgdGhpcy5hdXRvdHJhbnNsYXRlZExhbmd1YWdlcygpLmZvckVhY2goKGxhbmcpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxhbmd1YWdlcygpLmluZGV4T2YobGFuZykgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnNGb3VuZC5wdXNoKG5ldyBYbGlmZk1lcmdlRXJyb3IoJ2F1dG90cmFuc2xhdGUgbGFuZ3VhZ2UgXCInICsgbGFuZyArICdcIiBpcyBub3QgaW4gbGlzdCBvZiBsYW5ndWFnZXMnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGFuZyA9PT0gdGhpcy5kZWZhdWx0TGFuZ3VhZ2UoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzRm91bmQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgbmV3IFhsaWZmTWVyZ2VFcnJvcignYXV0b3RyYW5zbGF0ZSBsYW5ndWFnZSBcIicgKyBsYW5nICsgJ1wiIGNhbm5vdCBiZSB0cmFuc2xhdGVkLCBiZWNhdXNlIGl0IGlzIHRoZSBzb3VyY2UgbGFuZ3VhZ2UnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBuZ3ggdHJhbnNsYXRlIHBhdHRlcm4gY2hlY2tcbiAgICAgICAgaWYgKHRoaXMuc3VwcG9ydE5neFRyYW5zbGF0ZSgpKSB7XG4gICAgICAgICAgICBjb25zdCBjaGVja1Jlc3VsdCA9IE5neFRyYW5zbGF0ZUV4dHJhY3Rvci5jaGVja1BhdHRlcm4odGhpcy5uZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybigpKTtcbiAgICAgICAgICAgIGlmICghaXNOdWxsT3JVbmRlZmluZWQoY2hlY2tSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnNGb3VuZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBuZXcgWGxpZmZNZXJnZUVycm9yKCduZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybiBcIicgKyB0aGlzLm5neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuKCkgKyAnXCI6ICcgKyBjaGVja1Jlc3VsdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHRhcmdldFByYWVmaXggYW5kIHRhcmdldFN1ZmZpeCBjaGVja1xuICAgICAgICBpZiAoIXRoaXMudXNlU291cmNlQXNUYXJnZXQoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0UHJhZWZpeCgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmdzRm91bmQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyZWQgdGFyZ2V0UHJhZWZpeCBcIicgKyB0aGlzLnRhcmdldFByYWVmaXgoKSArICdcIiB3aWxsIG5vdCBiZSB1c2VkIGJlY2F1c2UgXCJ1c2VTb3VyY2VBc1RhcmdldFwiIGlzIGRpc2FibGVkXCInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldFN1ZmZpeCgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmdzRm91bmQucHVzaChcbiAgICAgICAgICAgICAgICAgICAgJ2NvbmZpZ3VyZWQgdGFyZ2V0U3VmZml4IFwiJyArIHRoaXMudGFyZ2V0U3VmZml4KCkgKyAnXCIgd2lsbCBub3QgYmUgdXNlZCBiZWNhdXNlIFwidXNlU291cmNlQXNUYXJnZXRcIiBpcyBkaXNhYmxlZFwiJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgc3ludGF4IG9mIGxhbmd1YWdlLlxuICAgICAqIE11c3QgYmUgY29tcGF0aWJsZSB3aXRoIFhNTCBTY2hlbWEgdHlwZSB4c2Q6bGFuZ3VhZ2UuXG4gICAgICogUGF0dGVybjogW2EtekEtWl17MSw4fSgoLXxfKVthLXpBLVowLTldezEsOH0pKlxuICAgICAqIEBwYXJhbSBsYW5nIGxhbmd1YWdlIHRvIGNoZWNrXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGVja0xhbmd1YWdlU3ludGF4KGxhbmc6IHN0cmluZykge1xuICAgICAgICBjb25zdCBwYXR0ZXJuID0gL15bYS16QS1aXXsxLDh9KFstX11bYS16QS1aMC05XXsxLDh9KSokLztcbiAgICAgICAgaWYgKCFwYXR0ZXJuLnRlc3QobGFuZykpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzRm91bmQucHVzaChuZXcgWGxpZmZNZXJnZUVycm9yKCdsYW5ndWFnZSBcIicgKyBsYW5nICsgJ1wiIGlzIG5vdCB2YWxpZCcpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhbGxvd0lkQ2hhbmdlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2FsbG93SWRDaGFuZ2UpKSA/IGZhbHNlIDogdGhpcy5fYWxsb3dJZENoYW5nZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmVyYm9zZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl92ZXJib3NlKSkgPyBmYWxzZSA6IHRoaXMuX3ZlcmJvc2U7XG4gICAgfVxuXG4gICAgcHVibGljIHF1aWV0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX3F1aWV0KSkgPyBmYWxzZSA6IHRoaXMuX3F1aWV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlYnVnIG91dHB1dCBhbGwgcGFyYW1ldGVycyB0byBjb21tYW5kT3V0cHV0LlxuICAgICAqL1xuICAgIHB1YmxpYyBzaG93QWxsUGFyYW1ldGVycyhjb21tYW5kT3V0cHV0OiBDb21tYW5kT3V0cHV0KTogdm9pZCB7XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ3hsaWZmbWVyZ2UgVXNlZCBQYXJhbWV0ZXJzOicpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCd1c2VkUHJvZmlsZVBhdGg6XFx0XCIlc1wiJywgdGhpcy51c2VkUHJvZmlsZVBhdGgpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdkZWZhdWx0TGFuZ3VhZ2U6XFx0XCIlc1wiJywgdGhpcy5kZWZhdWx0TGFuZ3VhZ2UoKSk7XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ3NyY0RpcjpcXHRcIiVzXCInLCB0aGlzLnNyY0RpcigpKTtcbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygnZ2VuRGlyOlxcdFwiJXNcIicsIHRoaXMuZ2VuRGlyKCkpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdpMThuQmFzZUZpbGU6XFx0XCIlc1wiJywgdGhpcy5pMThuQmFzZUZpbGUoKSk7XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ2kxOG5GaWxlOlxcdFwiJXNcIicsIHRoaXMuaTE4bkZpbGUoKSk7XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ2xhbmd1YWdlczpcXHQlcycsIHRoaXMubGFuZ3VhZ2VzKCkpO1xuICAgICAgICBmb3IgKGNvbnN0IGxhbmd1YWdlIG9mIHRoaXMubGFuZ3VhZ2VzKCkpIHtcbiAgICAgICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ291dHB1dEZpbGVbJXNdOlxcdCVzJywgbGFuZ3VhZ2UsIHRoaXMuZ2VuZXJhdGVkSTE4bkZpbGUobGFuZ3VhZ2UpKTtcbiAgICAgICAgfVxuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdyZW1vdmVVbnVzZWRJZHM6XFx0JXMnLCB0aGlzLnJlbW92ZVVudXNlZElkcygpKTtcbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1Zygnc3VwcG9ydE5neFRyYW5zbGF0ZTpcXHQlcycsIHRoaXMuc3VwcG9ydE5neFRyYW5zbGF0ZSgpKTtcbiAgICAgICAgaWYgKHRoaXMuc3VwcG9ydE5neFRyYW5zbGF0ZSgpKSB7XG4gICAgICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCduZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybjpcXHQlcycsIHRoaXMubmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm4oKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygndXNlU291cmNlQXNUYXJnZXQ6XFx0JXMnLCB0aGlzLnVzZVNvdXJjZUFzVGFyZ2V0KCkpO1xuICAgICAgICBpZiAodGhpcy51c2VTb3VyY2VBc1RhcmdldCgpKSB7XG4gICAgICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCd0YXJnZXRQcmFlZml4OlxcdFwiJXNcIicsIHRoaXMudGFyZ2V0UHJhZWZpeCgpKTtcbiAgICAgICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ3RhcmdldFN1ZmZpeDpcXHRcIiVzXCInLCB0aGlzLnRhcmdldFN1ZmZpeCgpKTtcbiAgICAgICAgfVxuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdhbGxvd0lkQ2hhbmdlOlxcdCVzJywgdGhpcy5hbGxvd0lkQ2hhbmdlKCkpO1xuICAgICAgICBjb21tYW5kT3V0cHV0LmRlYnVnKCdiZWF1dGlmeU91dHB1dDpcXHQlcycsIHRoaXMuYmVhdXRpZnlPdXRwdXQoKSk7XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ3ByZXNlcnZlT3JkZXI6XFx0JXMnLCB0aGlzLnByZXNlcnZlT3JkZXIoKSk7XG4gICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ2F1dG90cmFuc2xhdGU6XFx0JXMnLCB0aGlzLmF1dG90cmFuc2xhdGUoKSk7XG4gICAgICAgIGlmICh0aGlzLmF1dG90cmFuc2xhdGUoKSkge1xuICAgICAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygnYXV0b3RyYW5zbGF0ZWQgbGFuZ3VhZ2VzOlxcdCVzJywgdGhpcy5hdXRvdHJhbnNsYXRlZExhbmd1YWdlcygpKTtcbiAgICAgICAgICAgIGNvbW1hbmRPdXRwdXQuZGVidWcoJ2FwaWtleTpcXHQlcycsIHRoaXMuYXBpa2V5KCkgPyAnKioqKicgOiAnTk9UIFNFVCcpO1xuICAgICAgICAgICAgY29tbWFuZE91dHB1dC5kZWJ1ZygnYXBpa2V5ZmlsZTpcXHQlcycsIHRoaXMuYXBpa2V5ZmlsZSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQtTGFuZ3VhZ2UsIGRlZmF1bHQgZW4uXG4gICAgICogQHJldHVybiBkZWZhdWx0IGxhbmd1YWdlXG4gICAgICovXG4gICAgcHVibGljIGRlZmF1bHRMYW5ndWFnZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmYXVsdExhbmd1YWdlID8gdGhpcy5fZGVmYXVsdExhbmd1YWdlIDogJ2VuJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZSBkZXIgenUgYmVhcmJlaXRlbmRlbiBTcHJhY2hlbi5cbiAgICAgKiBAcmV0dXJuIGxhbmd1YWdlc1xuICAgICAqL1xuICAgIHB1YmxpYyBsYW5ndWFnZXMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFuZ3VhZ2VzID8gdGhpcy5fbGFuZ3VhZ2VzIDogW107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogc3JjIGRpcmVjdG9yeSwgd2hlcmUgdGhlIG1hc3RlciB4bGlmIGlzIGxvY2F0ZWQuXG4gICAgICogQHJldHVybiBzcmNEaXJcbiAgICAgKi9cbiAgICBwdWJsaWMgc3JjRGlyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcmNEaXIgPyB0aGlzLl9zcmNEaXIgOiAnLic7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGJhc2UgZmlsZSBuYW1lIG9mIHRoZSB4bGlmIGZpbGUgZm9yIGlucHV0IGFuZCBvdXRwdXQuXG4gICAgICogRGVmYXVsdCBpcyBtZXNzYWdlc1xuICAgICAqIEByZXR1cm4gYmFzZSBmaWxlXG4gICAgICovXG4gICAgcHVibGljIGkxOG5CYXNlRmlsZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5faTE4bkJhc2VGaWxlID8gdGhpcy5faTE4bkJhc2VGaWxlIDogJ21lc3NhZ2VzJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWFzdGVyIHhsaWYgZmlsZSAodGhlIG9uZSBnZW5lcmF0ZWQgYnkgbmcteGkxOG4pLlxuICAgICAqIERlZmF1bHQgaXMgPHNyY0Rpcj4vPGkxOG5CYXNlRmlsZT4ueGxmLlxuICAgICAqIEByZXR1cm4gbWFzdGVyIGZpbGVcbiAgICAgKi9cbiAgICBwdWJsaWMgaTE4bkZpbGUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGpvaW4odGhpcy5zcmNEaXIoKSxcbiAgICAgICAgICAgICh0aGlzLl9pMThuRmlsZSA/IHRoaXMuX2kxOG5GaWxlIDogdGhpcy5pMThuQmFzZUZpbGUoKSArICcuJyArIHRoaXMuc3VmZml4Rm9yR2VuZXJhdGVkSTE4bkZpbGUoKSlcbiAgICAgICAgKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRm9ybWF0IG9mIHRoZSBtYXN0ZXIgeGxpZiBmaWxlLlxuICAgICAqIERlZmF1bHQgaXMgXCJ4bGZcIiwgcG9zc2libGUgYXJlIFwieGxmXCIgb3IgXCJ4bGYyXCIgb3IgXCJ4bWJcIi5cbiAgICAgKiBAcmV0dXJuIGZvcm1hdFxuICAgICAqL1xuICAgIHB1YmxpYyBpMThuRm9ybWF0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAodGhpcy5faTE4bkZvcm1hdCA/IHRoaXMuX2kxOG5Gb3JtYXQgOiAneGxmJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcG90ZW50aWFsbHkgdG8gYmUgZ2VuZXJhdGVkIEkxOG4tRmlsZSB3aXRoIHRoZSB0cmFuc2xhdGlvbnMgZm9yIG9uZSBsYW5ndWFnZS5cbiAgICAgKiBAcGFyYW0gbGFuZyBsYW5ndWFnZSBzaG9ydGN1dFxuICAgICAqIEByZXR1cm4gUGF0aCBvZiBmaWxlXG4gICAgICovXG4gICAgcHVibGljIGdlbmVyYXRlZEkxOG5GaWxlKGxhbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBqb2luKHRoaXMuZ2VuRGlyKCksIHRoaXMuaTE4bkJhc2VGaWxlKCkgKyAnLicgKyBsYW5nICsgJy4nICsgdGhpcy5zdWZmaXhGb3JHZW5lcmF0ZWRJMThuRmlsZSgpKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdWZmaXhGb3JHZW5lcmF0ZWRJMThuRmlsZSgpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuaTE4bkZvcm1hdCgpKSB7XG4gICAgICAgICAgICBjYXNlICd4bGYnOlxuICAgICAgICAgICAgICAgIHJldHVybiAneGxmJztcbiAgICAgICAgICAgIGNhc2UgJ3hsZjInOlxuICAgICAgICAgICAgICAgIHJldHVybiAneGxmJztcbiAgICAgICAgICAgIGNhc2UgJ3htYic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICd4dGInO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcG90ZW50aWFsbHkgdG8gYmUgZ2VuZXJhdGVkIHRyYW5zbGF0ZS1GaWxlIGZvciBuZ3gtdHJhbnNsYXRlIHdpdGggdGhlIHRyYW5zbGF0aW9ucyBmb3Igb25lIGxhbmd1YWdlLlxuICAgICAqIEBwYXJhbSBsYW5nIGxhbmd1YWdlIHNob3J0Y3V0XG4gICAgICogQHJldHVybiBQYXRoIG9mIGZpbGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuZXJhdGVkTmd4VHJhbnNsYXRlRmlsZShsYW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gam9pbih0aGlzLmdlbkRpcigpLCB0aGlzLmkxOG5CYXNlRmlsZSgpICsgJy4nICsgbGFuZyArICcuJyArICdqc29uJykucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBlbmNvZGluZyB1c2VkIHRvIHdyaXRlIG5ldyBYTElGRi1maWxlcy5cbiAgICAgKiBAcmV0dXJuIGVuY29kaW5nXG4gICAgICovXG4gICAgcHVibGljIGVuY29kaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbmNvZGluZyA/IHRoaXMuX2VuY29kaW5nIDogJ1VURi04JztcbiAgICB9XG5cbiAgICAgLyoqXG4gICAgICAqIE91dHB1dC1EaXJlY3RvcnksIHdoZXJlIHRoZSBvdXRwdXQgaXMgd3JpdHRlbiB0by5cbiAgICAgICogRGVmYXVsdCBpcyA8c3JjRGlyPi5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2VuRGlyKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZW5EaXIgPyB0aGlzLl9nZW5EaXIgOiB0aGlzLnNyY0RpcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVVbnVzZWRJZHMoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fcmVtb3ZlVW51c2VkSWRzKSkgPyB0cnVlIDogdGhpcy5fcmVtb3ZlVW51c2VkSWRzO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdXBwb3J0Tmd4VHJhbnNsYXRlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX3N1cHBvcnROZ3hUcmFuc2xhdGUpKSA/IGZhbHNlIDogdGhpcy5fc3VwcG9ydE5neFRyYW5zbGF0ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm4oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl9uZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybikpID9cbiAgICAgICAgICAgIE5neFRyYW5zbGF0ZUV4dHJhY3Rvci5EZWZhdWx0RXh0cmFjdGlvblBhdHRlcm4gOiB0aGlzLl9uZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHNvdXJjZSBtdXN0IGJlIHVzZWQgYXMgdGFyZ2V0IGZvciBuZXcgdHJhbnMtdW5pdHNcbiAgICAgKiBEZWZhdWx0IGlzIHRydWVcbiAgICAgKi9cbiAgICBwdWJsaWMgdXNlU291cmNlQXNUYXJnZXQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fdXNlU291cmNlQXNUYXJnZXQpKSA/IHRydWUgOiB0aGlzLl91c2VTb3VyY2VBc1RhcmdldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcmFlZml4IHVzZWQgZm9yIHRhcmdldCB3aGVuIGNvcHlpbmcgbmV3IHRyYW5zLXVuaXRzXG4gICAgICogRGVmYXVsdCBpcyBcIlwiXG4gICAgICovXG4gICAgcHVibGljIHRhcmdldFByYWVmaXgoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl90YXJnZXRQcmFlZml4KSkgPyAnJyA6IHRoaXMuX3RhcmdldFByYWVmaXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VmZml4IHVzZWQgZm9yIHRhcmdldCB3aGVuIGNvcHlpbmcgbmV3IHRyYW5zLXVuaXRzXG4gICAgICogRGVmYXVsdCBpcyBcIlwiXG4gICAgICovXG4gICAgcHVibGljIHRhcmdldFN1ZmZpeCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gKGlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX3RhcmdldFN1ZmZpeCkpID8gJycgOiB0aGlzLl90YXJnZXRTdWZmaXg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgc2V0LCBydW4geG1sIHJlc3VsdCB0aHJvdWdoIGJlYXV0aWZpZXIgKHByZXR0eS1kYXRhKS5cbiAgICAgKi9cbiAgICBwdWJsaWMgYmVhdXRpZnlPdXRwdXQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fYmVhdXRpZnlPdXRwdXQpKSA/IGZhbHNlIDogdGhpcy5fYmVhdXRpZnlPdXRwdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgc2V0LCBvcmRlciBvZiBuZXcgdHJhbnMgdW5pdHMgd2lsbCBiZSBhcyBpbiBtYXN0ZXIuXG4gICAgICogT3RoZXJ3aXNlIHRoZXkgYXJlIGFkZGVkIGF0IHRoZSBlbmQuXG4gICAgICovXG4gICAgcHVibGljIHByZXNlcnZlT3JkZXIoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fcHJlc2VydmVPcmRlcikpID8gdHJ1ZSA6IHRoaXMuX3ByZXNlcnZlT3JkZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byB1c2UgYXV0b3RyYW5zbGF0ZSBmb3IgbmV3IHRyYW5zLXVuaXRzXG4gICAgICogRGVmYXVsdCBpcyBmYWxzZVxuICAgICAqL1xuICAgIHB1YmxpYyBhdXRvdHJhbnNsYXRlKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQodGhpcy5fYXV0b3RyYW5zbGF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheSh0aGlzLl9hdXRvdHJhbnNsYXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuICg8c3RyaW5nW10+dGhpcy5fYXV0b3RyYW5zbGF0ZSkubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gPGJvb2xlYW4+IHRoaXMuX2F1dG90cmFuc2xhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0byB1c2UgYXV0b3RyYW5zbGF0ZSBmb3IgYSBnaXZlbiBsYW5ndWFnZS5cbiAgICAgKiBAcGFyYW0gbGFuZyBsYW5ndWFnZSBjb2RlLlxuICAgICAqL1xuICAgIHB1YmxpYyBhdXRvdHJhbnNsYXRlTGFuZ3VhZ2UobGFuZzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dG90cmFuc2xhdGVkTGFuZ3VhZ2VzKCkuaW5kZXhPZihsYW5nKSA+PSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBhIGxpc3Qgb2YgbGFuZ3VhZ2VzIHRvIGJlIGF1dG90cmFuc2xhdGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBhdXRvdHJhbnNsYXRlZExhbmd1YWdlcygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZCh0aGlzLl9hdXRvdHJhbnNsYXRlKSB8fCB0aGlzLl9hdXRvdHJhbnNsYXRlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FycmF5KHRoaXMuX2F1dG90cmFuc2xhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKDxzdHJpbmdbXT50aGlzLl9hdXRvdHJhbnNsYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZXMoKS5zbGljZSgxKTsgLy8gZmlyc3QgaXMgc291cmNlIGxhbmd1YWdlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQVBJIGtleSB0byBiZSB1c2VkIGZvciBHb29nbGUgVHJhbnNsYXRlXG4gICAgICogQHJldHVybiBhcGkga2V5XG4gICAgICovXG4gICAgcHVibGljIGFwaWtleSgpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuX2FwaWtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcGlrZXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBhcGlrZXlQYXRoID0gdGhpcy5hcGlrZXlmaWxlKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5hcGlrZXlmaWxlKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhhcGlrZXlQYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRmlsZVV0aWwucmVhZChhcGlrZXlQYXRoLCAndXRmLTgnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZm9ybWF0KCdhcGkga2V5IGZpbGUgbm90IGZvdW5kOiBBUElfS0VZX0ZJTEU9JXMnLCBhcGlrZXlQYXRoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGZpbGUgbmFtZSBmb3IgQVBJIGtleSB0byBiZSB1c2VkIGZvciBHb29nbGUgVHJhbnNsYXRlLlxuICAgICAqIEV4cGxpY2l0bHkgc2V0IG9yIHJlYWQgZnJvbSBlbnYgdmFyIEFQSV9LRVlfRklMRS5cbiAgICAgKiBAcmV0dXJuIGZpbGUgb2YgYXBpIGtleVxuICAgICAqL1xuICAgIHB1YmxpYyBhcGlrZXlmaWxlKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLl9hcGlrZXlmaWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXBpa2V5ZmlsZTtcbiAgICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLmVudi5BUElfS0VZX0ZJTEUpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9jZXNzLmVudi5BUElfS0VZX0ZJTEU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==