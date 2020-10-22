/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { isNullOrUndefined } from '../common/util';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as entityDecoderLib from 'he';
import { STATE_NEW } from '@ngx-i18nsupport/ngx-i18nsupport-lib';
import { AutoTranslateService } from './auto-translate-service';
import { AutoTranslateResult } from './auto-translate-result';
import { AutoTranslateSummaryReport } from './auto-translate-summary-report';
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
        return forkJoin(tslib_1.__spread([
            this.doAutoTranslateNonICUMessages(from, to, languageSpecificMessagesFile)
        ], this.doAutoTranslateICUMessages(from, to, languageSpecificMessagesFile)))
            .pipe(map((/**
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
            if (tu.targetState() === STATE_NEW) {
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
        map((/**
         * @param {?} translations
         * @return {?}
         */
        function (translations) { return translations.map((/**
         * @param {?} encodedTranslation
         * @return {?}
         */
        function (encodedTranslation) { return entityDecoderLib.decode(encodedTranslation); })); })), map((/**
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
        })), catchError((/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            /** @type {?} */
            var failSummary = new AutoTranslateSummaryReport(from, to);
            failSummary.setError(err.message, allMessages.length);
            return of(failSummary);
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
            return of(summary);
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
        map((/**
         * @param {?} translations
         * @return {?}
         */
        function (translations) { return translations.map((/**
         * @param {?} encodedTranslation
         * @return {?}
         */
        function (encodedTranslation) { return entityDecoderLib.decode(encodedTranslation); })); })), map((/**
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
        })), catchError((/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            /** @type {?} */
            var failSummary = new AutoTranslateSummaryReport(from, to);
            failSummary.setError(err.message, allMessages.length);
            return of(failSummary);
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
 * Created by martin on 07.07.2017.
 * Service to autotranslate Transunits via Google Translate.
 */
export { XliffMergeAutoTranslateService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    XliffMergeAutoTranslateService.prototype.autoTranslateService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYtbWVyZ2UtYXV0by10cmFuc2xhdGUtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsiYXV0b3RyYW5zbGF0ZS94bGlmZi1tZXJnZS1hdXRvLXRyYW5zbGF0ZS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFhLFFBQVEsRUFBRSxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvQyxPQUFPLEtBQUssZ0JBQWdCLE1BQU0sSUFBSSxDQUFDO0FBQ3ZDLE9BQU8sRUFFSCxTQUFTLEVBQ1osTUFBTSxzQ0FBc0MsQ0FBQztBQUM5QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQzs7Ozs7QUFNM0U7Ozs7O0lBSUksd0NBQVksTUFBYztRQUN0QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRzs7Ozs7Ozs7O0lBQ0ksc0RBQWE7Ozs7Ozs7O0lBQXBCLFVBQXFCLElBQVksRUFBRSxFQUFVLEVBQUUsNEJBQXNEO1FBRWpHLE9BQU8sUUFBUTtZQUNYLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLDRCQUE0QixDQUFDO1dBQ3ZFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLDRCQUE0QixDQUFDLEVBQUU7YUFDM0Us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LElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVU7U0FDekQ7SUFDTCxDQUFDO0lBQ0wscUNBQUM7QUFBRCxDQUFDLEFBOUlELElBOElDOzs7Ozs7Ozs7OztJQTVJRyw4REFBbUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzTnVsbE9yVW5kZWZpbmVkfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQge09ic2VydmFibGUsIGZvcmtKb2luLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgY2F0Y2hFcnJvcn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0ICogYXMgZW50aXR5RGVjb2RlckxpYiBmcm9tICdoZSc7XG5pbXBvcnQge1xuICAgIElJQ1VNZXNzYWdlLCBJSUNVTWVzc2FnZVRyYW5zbGF0aW9uLCBJTm9ybWFsaXplZE1lc3NhZ2UsIElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSwgSVRyYW5zVW5pdCxcbiAgICBTVEFURV9ORVdcbn0gZnJvbSAnQG5neC1pMThuc3VwcG9ydC9uZ3gtaTE4bnN1cHBvcnQtbGliJztcbmltcG9ydCB7QXV0b1RyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJy4vYXV0by10cmFuc2xhdGUtc2VydmljZSc7XG5pbXBvcnQge0F1dG9UcmFuc2xhdGVSZXN1bHR9IGZyb20gJy4vYXV0by10cmFuc2xhdGUtcmVzdWx0JztcbmltcG9ydCB7QXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnR9IGZyb20gJy4vYXV0by10cmFuc2xhdGUtc3VtbWFyeS1yZXBvcnQnO1xuLyoqXG4gKiBDcmVhdGVkIGJ5IG1hcnRpbiBvbiAwNy4wNy4yMDE3LlxuICogU2VydmljZSB0byBhdXRvdHJhbnNsYXRlIFRyYW5zdW5pdHMgdmlhIEdvb2dsZSBUcmFuc2xhdGUuXG4gKi9cblxuZXhwb3J0IGNsYXNzIFhsaWZmTWVyZ2VBdXRvVHJhbnNsYXRlU2VydmljZSB7XG5cbiAgICBwcml2YXRlIGF1dG9UcmFuc2xhdGVTZXJ2aWNlOiBBdXRvVHJhbnNsYXRlU2VydmljZTtcblxuICAgIGNvbnN0cnVjdG9yKGFwaWtleTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYXV0b1RyYW5zbGF0ZVNlcnZpY2UgPSBuZXcgQXV0b1RyYW5zbGF0ZVNlcnZpY2UoYXBpa2V5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdXRvIHRyYW5zbGF0ZSBmaWxlIHZpYSBHb29nbGUgVHJhbnNsYXRlLlxuICAgICAqIFdpbGwgdHJhbnNsYXRlIGFsbCBuZXcgdW5pdHMgaW4gZmlsZS5cbiAgICAgKiBAcGFyYW0gZnJvbSBmcm9tXG4gICAgICogQHBhcmFtIHRvIHRvXG4gICAgICogQHBhcmFtIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGUgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZVxuICAgICAqIEByZXR1cm4gYSBwcm9taXNlIHdpdGggdGhlIGV4ZWN1dGlvbiByZXN1bHQgYXMgYSBzdW1tYXJ5IHJlcG9ydC5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXV0b1RyYW5zbGF0ZShmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcsIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGU6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSlcbiAgICAgICAgOiBPYnNlcnZhYmxlPEF1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0PiB7XG4gICAgICAgIHJldHVybiBmb3JrSm9pbihbXG4gICAgICAgICAgICB0aGlzLmRvQXV0b1RyYW5zbGF0ZU5vbklDVU1lc3NhZ2VzKGZyb20sIHRvLCBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlKSxcbiAgICAgICAgICAgIC4uLnRoaXMuZG9BdXRvVHJhbnNsYXRlSUNVTWVzc2FnZXMoZnJvbSwgdG8sIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGUpXSlcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoc3VtbWFyaWVzOiBBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydFtdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1bW1hcnkgPSBzdW1tYXJpZXNbMF07XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3VtbWFyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5Lm1lcmdlKHN1bW1hcmllc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1bW1hcnk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb2xsZWN0IGFsbCB1bml0cyB0aGF0IGFyZSB1bnRyYW5zbGF0ZWQuXG4gICAgICogQHBhcmFtIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGUgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZVxuICAgICAqIEByZXR1cm4gYWxsIHVudHJhbnNsYXRlZCB1bml0c1xuICAgICAqL1xuICAgIHByaXZhdGUgYWxsVW50cmFuc2xhdGVkVFVzKGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGU6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSk6IElUcmFuc1VuaXRbXSB7XG4gICAgICAgIC8vIGNvbGxlY3QgYWxsIHVuaXRzLCB0aGF0IHNob3VsZCBiZSBhdXRvIHRyYW5zbGF0ZWRcbiAgICAgICAgY29uc3QgYWxsVW50cmFuc2xhdGVkOiBJVHJhbnNVbml0W10gPSBbXTtcbiAgICAgICAgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZS5mb3JFYWNoVHJhbnNVbml0KCh0dSkgPT4ge1xuICAgICAgICAgICAgaWYgKHR1LnRhcmdldFN0YXRlKCkgPT09IFNUQVRFX05FVykge1xuICAgICAgICAgICAgICAgIGFsbFVudHJhbnNsYXRlZC5wdXNoKHR1KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhbGxVbnRyYW5zbGF0ZWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb0F1dG9UcmFuc2xhdGVOb25JQ1VNZXNzYWdlcyhmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcsIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGU6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSlcbiAgICAgICAgOiBPYnNlcnZhYmxlPEF1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0PiB7XG4gICAgICAgIGNvbnN0IGFsbFVudHJhbnNsYXRlZDogSVRyYW5zVW5pdFtdID0gdGhpcy5hbGxVbnRyYW5zbGF0ZWRUVXMobGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZSk7XG4gICAgICAgIGNvbnN0IGFsbFRyYW5zbGF0YWJsZSA9IGFsbFVudHJhbnNsYXRlZC5maWx0ZXIoKHR1KSA9PiBpc051bGxPclVuZGVmaW5lZCh0dS5zb3VyY2VDb250ZW50Tm9ybWFsaXplZCgpLmdldElDVU1lc3NhZ2UoKSkpO1xuICAgICAgICBjb25zdCBhbGxNZXNzYWdlczogc3RyaW5nW10gPSBhbGxUcmFuc2xhdGFibGUubWFwKCh0dSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHR1LnNvdXJjZUNvbnRlbnROb3JtYWxpemVkKCkuYXNEaXNwbGF5U3RyaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRvVHJhbnNsYXRlU2VydmljZS50cmFuc2xhdGVNdWx0aXBsZVN0cmluZ3MoYWxsTWVzc2FnZXMsIGZyb20sIHRvKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgLy8gIzk0IGdvb2dsZSB0cmFuc2xhdGUgbWlnaHQgcmV0dXJuICYjLi4gZW50aXR5IHJlZnMsIHRoYXQgbXVzdCBiZSBkZWNvZGVkXG4gICAgICAgICAgICAgICAgbWFwKCh0cmFuc2xhdGlvbnM6IHN0cmluZ1tdKSA9PiB0cmFuc2xhdGlvbnMubWFwKGVuY29kZWRUcmFuc2xhdGlvbiA9PiBlbnRpdHlEZWNvZGVyTGliLmRlY29kZShlbmNvZGVkVHJhbnNsYXRpb24pKSksXG4gICAgICAgICAgICAgICAgbWFwKCh0cmFuc2xhdGlvbnM6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtbWFyeSA9IG5ldyBBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydChmcm9tLCB0byk7XG4gICAgICAgICAgICAgICAgc3VtbWFyeS5zZXRJZ25vcmVkKGFsbFVudHJhbnNsYXRlZC5sZW5ndGggLSBhbGxUcmFuc2xhdGFibGUubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zbGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0dSA9IGFsbFRyYW5zbGF0YWJsZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNsYXRpb25UZXh0ID0gdHJhbnNsYXRpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmF1dG9UcmFuc2xhdGVOb25JQ1VVbml0KHR1LCB0cmFuc2xhdGlvblRleHQpO1xuICAgICAgICAgICAgICAgICAgICBzdW1tYXJ5LmFkZFNpbmdsZVJlc3VsdCh0dSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1bW1hcnk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhaWxTdW1tYXJ5ID0gbmV3IEF1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0KGZyb20sIHRvKTtcbiAgICAgICAgICAgICAgICAgICAgZmFpbFN1bW1hcnkuc2V0RXJyb3IoZXJyLm1lc3NhZ2UsIGFsbE1lc3NhZ2VzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZihmYWlsU3VtbWFyeSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkb0F1dG9UcmFuc2xhdGVJQ1VNZXNzYWdlcyhmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcsIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGU6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSlcbiAgICAgICAgOiBPYnNlcnZhYmxlPEF1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0PltdIHtcbiAgICAgICAgY29uc3QgYWxsVW50cmFuc2xhdGVkOiBJVHJhbnNVbml0W10gPSB0aGlzLmFsbFVudHJhbnNsYXRlZFRVcyhsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlKTtcbiAgICAgICAgY29uc3QgYWxsVHJhbnNsYXRhYmxlSUNVID0gYWxsVW50cmFuc2xhdGVkLmZpbHRlcigodHUpID0+ICFpc051bGxPclVuZGVmaW5lZCh0dS5zb3VyY2VDb250ZW50Tm9ybWFsaXplZCgpLmdldElDVU1lc3NhZ2UoKSkpO1xuICAgICAgICByZXR1cm4gYWxsVHJhbnNsYXRhYmxlSUNVLm1hcCgodHUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRvQXV0b1RyYW5zbGF0ZUlDVU1lc3NhZ2UoZnJvbSwgdG8sIHR1KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhbnNsYXRlIHNpbmdsZSBJQ1UgTWVzc2FnZXMuXG4gICAgICogQHBhcmFtIGZyb20gZnJvbVxuICAgICAqIEBwYXJhbSB0byB0b1xuICAgICAqIEBwYXJhbSB0dSB0cmFuc3VuaXQgdG8gdHJhbnNsYXRlIChtdXN0IGNvbnRhaW4gSUNVIE1lc3NhZ2UpXG4gICAgICogQHJldHVybiBzdW1tYXJ5IHJlcG9ydFxuICAgICAqL1xuICAgIHByaXZhdGUgZG9BdXRvVHJhbnNsYXRlSUNVTWVzc2FnZShmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcsIHR1OiBJVHJhbnNVbml0KTogT2JzZXJ2YWJsZTxBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydD4ge1xuICAgICAgICBjb25zdCBpY3VNZXNzYWdlOiBJSUNVTWVzc2FnZSA9IHR1LnNvdXJjZUNvbnRlbnROb3JtYWxpemVkKCkuZ2V0SUNVTWVzc2FnZSgpO1xuICAgICAgICBjb25zdCBjYXRlZ29yaWVzID0gaWN1TWVzc2FnZS5nZXRDYXRlZ29yaWVzKCk7XG4gICAgICAgIC8vIGNoZWNrIGZvciBuZXN0ZWQgSUNVcywgd2UgZG8gbm90IHN1cHBvcnQgdGhhdFxuICAgICAgICBpZiAoY2F0ZWdvcmllcy5maW5kKChjYXRlZ29yeSkgPT4gIWlzTnVsbE9yVW5kZWZpbmVkKGNhdGVnb3J5LmdldE1lc3NhZ2VOb3JtYWxpemVkKCkuZ2V0SUNVTWVzc2FnZSgpKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1bW1hcnkgPSBuZXcgQXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnQoZnJvbSwgdG8pO1xuICAgICAgICAgICAgc3VtbWFyeS5zZXRJZ25vcmVkKDEpO1xuICAgICAgICAgICAgcmV0dXJuIG9mKHN1bW1hcnkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFsbE1lc3NhZ2VzOiBzdHJpbmdbXSA9IGNhdGVnb3JpZXMubWFwKChjYXRlZ29yeSkgPT4gY2F0ZWdvcnkuZ2V0TWVzc2FnZU5vcm1hbGl6ZWQoKS5hc0Rpc3BsYXlTdHJpbmcoKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dG9UcmFuc2xhdGVTZXJ2aWNlLnRyYW5zbGF0ZU11bHRpcGxlU3RyaW5ncyhhbGxNZXNzYWdlcywgZnJvbSwgdG8pXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAvLyAjOTQgZ29vZ2xlIHRyYW5zbGF0ZSBtaWdodCByZXR1cm4gJiMuLiBlbnRpdHkgcmVmcywgdGhhdCBtdXN0IGJlIGRlY29kZWRcbiAgICAgICAgICAgICAgICBtYXAoKHRyYW5zbGF0aW9uczogc3RyaW5nW10pID0+IHRyYW5zbGF0aW9ucy5tYXAoZW5jb2RlZFRyYW5zbGF0aW9uID0+IGVudGl0eURlY29kZXJMaWIuZGVjb2RlKGVuY29kZWRUcmFuc2xhdGlvbikpKSxcbiAgICAgICAgICAgICAgICBtYXAoKHRyYW5zbGF0aW9uczogc3RyaW5nW10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VtbWFyeSA9IG5ldyBBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydChmcm9tLCB0byk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGljdVRyYW5zbGF0aW9uOiBJSUNVTWVzc2FnZVRyYW5zbGF0aW9uID0ge307XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNsYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpY3VUcmFuc2xhdGlvbltjYXRlZ29yaWVzW2ldLmdldENhdGVnb3J5KCldID0gdHJhbnNsYXRpb25zW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuYXV0b1RyYW5zbGF0ZUlDVVVuaXQodHUsIGljdVRyYW5zbGF0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgc3VtbWFyeS5hZGRTaW5nbGVSZXN1bHQodHUsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdW1tYXJ5O1xuICAgICAgICAgICAgICAgIH0pLCBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFpbFN1bW1hcnkgPSBuZXcgQXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnQoZnJvbSwgdG8pO1xuICAgICAgICAgICAgICAgICAgICBmYWlsU3VtbWFyeS5zZXRFcnJvcihlcnIubWVzc2FnZSwgYWxsTWVzc2FnZXMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mKGZhaWxTdW1tYXJ5KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1dG9UcmFuc2xhdGVOb25JQ1VVbml0KHR1OiBJVHJhbnNVbml0LCB0cmFuc2xhdGVkTWVzc2FnZTogc3RyaW5nKTogQXV0b1RyYW5zbGF0ZVJlc3VsdCB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dG9UcmFuc2xhdGVVbml0KHR1LCB0dS5zb3VyY2VDb250ZW50Tm9ybWFsaXplZCgpLnRyYW5zbGF0ZSh0cmFuc2xhdGVkTWVzc2FnZSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXV0b1RyYW5zbGF0ZUlDVVVuaXQodHU6IElUcmFuc1VuaXQsIHRyYW5zbGF0aW9uOiBJSUNVTWVzc2FnZVRyYW5zbGF0aW9uKTogQXV0b1RyYW5zbGF0ZVJlc3VsdCB7XG4gICAgICAgIHJldHVybiB0aGlzLmF1dG9UcmFuc2xhdGVVbml0KHR1LCB0dS5zb3VyY2VDb250ZW50Tm9ybWFsaXplZCgpLnRyYW5zbGF0ZUlDVU1lc3NhZ2UodHJhbnNsYXRpb24pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1dG9UcmFuc2xhdGVVbml0KHR1OiBJVHJhbnNVbml0LCB0cmFuc2xhdGVkTWVzc2FnZTogSU5vcm1hbGl6ZWRNZXNzYWdlKTogQXV0b1RyYW5zbGF0ZVJlc3VsdCB7XG4gICAgICAgIGNvbnN0IGVycm9ycyA9IHRyYW5zbGF0ZWRNZXNzYWdlLnZhbGlkYXRlKCk7XG4gICAgICAgIGNvbnN0IHdhcm5pbmdzID0gdHJhbnNsYXRlZE1lc3NhZ2UudmFsaWRhdGVXYXJuaW5ncygpO1xuICAgICAgICBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKGVycm9ycykpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQXV0b1RyYW5zbGF0ZVJlc3VsdChmYWxzZSwgJ2Vycm9ycyBkZXRlY3RlZCwgbm90IHRyYW5zbGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIGlmICghaXNOdWxsT3JVbmRlZmluZWQod2FybmluZ3MpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEF1dG9UcmFuc2xhdGVSZXN1bHQoZmFsc2UsICd3YXJuaW5ncyBkZXRlY3RlZCwgbm90IHRyYW5zbGF0ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHR1LnRyYW5zbGF0ZSh0cmFuc2xhdGVkTWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEF1dG9UcmFuc2xhdGVSZXN1bHQodHJ1ZSwgbnVsbCk7IC8vIHN1Y2Nlc3NcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==