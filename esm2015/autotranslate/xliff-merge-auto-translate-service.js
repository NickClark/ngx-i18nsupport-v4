/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class XliffMergeAutoTranslateService {
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
        encodedTranslation => entityDecoderLib.decode(encodedTranslation))))), map((/**
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
        encodedTranslation => entityDecoderLib.decode(encodedTranslation))))), map((/**
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    XliffMergeAutoTranslateService.prototype.autoTranslateService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYtbWVyZ2UtYXV0by10cmFuc2xhdGUtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsiYXV0b3RyYW5zbGF0ZS94bGlmZi1tZXJnZS1hdXRvLXRyYW5zbGF0ZS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQWEsUUFBUSxFQUFFLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUMsR0FBRyxFQUFFLFVBQVUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQy9DLE9BQU8sS0FBSyxnQkFBZ0IsTUFBTSxJQUFJLENBQUM7QUFDdkMsT0FBTyxFQUVILFNBQVMsRUFDWixNQUFNLHNDQUFzQyxDQUFDO0FBQzlDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzlELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDOzs7OztBQU0zRSxNQUFNLE9BQU8sOEJBQThCOzs7O0lBSXZDLFlBQVksTUFBYztRQUN0QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRSxDQUFDOzs7Ozs7Ozs7SUFVTSxhQUFhLENBQUMsSUFBWSxFQUFFLEVBQVUsRUFBRSw0QkFBc0Q7UUFFakcsT0FBTyxRQUFRLENBQUM7WUFDWixJQUFJLENBQUMsNkJBQTZCLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSw0QkFBNEIsQ0FBQztZQUMxRSxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLDRCQUE0QixDQUFDO1NBQUMsQ0FBQzthQUMzRSxJ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QUMsV0FBVyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUNaLENBQUM7Ozs7Ozs7SUFFTyx1QkFBdUIsQ0FBQyxFQUFjLEVBQUUsaUJBQXlCO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0lBQ2pHLENBQUM7Ozs7Ozs7SUFFTyxvQkFBb0IsQ0FBQyxFQUFjLEVBQUUsV0FBbUM7UUFDNUUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDckcsQ0FBQzs7Ozs7OztJQUVPLGlCQUFpQixDQUFDLEVBQWMsRUFBRSxpQkFBcUM7O2NBQ3JFLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUU7O2NBQ3JDLFFBQVEsR0FBRyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNyRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDNUIsT0FBTyxJQUFJLG1CQUFtQixDQUFDLEtBQUssRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO1NBQzVFO2FBQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztTQUM5RTthQUFNO1lBQ0gsRUFBRSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVO1NBQ3pEO0lBQ0wsQ0FBQztDQUNKOzs7Ozs7SUE1SUcsOERBQW1EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBmb3JrSm9pbiwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIGNhdGNoRXJyb3J9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCAqIGFzIGVudGl0eURlY29kZXJMaWIgZnJvbSAnaGUnO1xuaW1wb3J0IHtcbiAgICBJSUNVTWVzc2FnZSwgSUlDVU1lc3NhZ2VUcmFuc2xhdGlvbiwgSU5vcm1hbGl6ZWRNZXNzYWdlLCBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUsIElUcmFuc1VuaXQsXG4gICAgU1RBVEVfTkVXXG59IGZyb20gJ0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LWxpYic7XG5pbXBvcnQge0F1dG9UcmFuc2xhdGVTZXJ2aWNlfSBmcm9tICcuL2F1dG8tdHJhbnNsYXRlLXNlcnZpY2UnO1xuaW1wb3J0IHtBdXRvVHJhbnNsYXRlUmVzdWx0fSBmcm9tICcuL2F1dG8tdHJhbnNsYXRlLXJlc3VsdCc7XG5pbXBvcnQge0F1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0fSBmcm9tICcuL2F1dG8tdHJhbnNsYXRlLXN1bW1hcnktcmVwb3J0Jztcbi8qKlxuICogQ3JlYXRlZCBieSBtYXJ0aW4gb24gMDcuMDcuMjAxNy5cbiAqIFNlcnZpY2UgdG8gYXV0b3RyYW5zbGF0ZSBUcmFuc3VuaXRzIHZpYSBHb29nbGUgVHJhbnNsYXRlLlxuICovXG5cbmV4cG9ydCBjbGFzcyBYbGlmZk1lcmdlQXV0b1RyYW5zbGF0ZVNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBhdXRvVHJhbnNsYXRlU2VydmljZTogQXV0b1RyYW5zbGF0ZVNlcnZpY2U7XG5cbiAgICBjb25zdHJ1Y3RvcihhcGlrZXk6IHN0cmluZykge1xuICAgICAgICB0aGlzLmF1dG9UcmFuc2xhdGVTZXJ2aWNlID0gbmV3IEF1dG9UcmFuc2xhdGVTZXJ2aWNlKGFwaWtleSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXV0byB0cmFuc2xhdGUgZmlsZSB2aWEgR29vZ2xlIFRyYW5zbGF0ZS5cbiAgICAgKiBXaWxsIHRyYW5zbGF0ZSBhbGwgbmV3IHVuaXRzIGluIGZpbGUuXG4gICAgICogQHBhcmFtIGZyb20gZnJvbVxuICAgICAqIEBwYXJhbSB0byB0b1xuICAgICAqIEBwYXJhbSBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGVcbiAgICAgKiBAcmV0dXJuIGEgcHJvbWlzZSB3aXRoIHRoZSBleGVjdXRpb24gcmVzdWx0IGFzIGEgc3VtbWFyeSByZXBvcnQuXG4gICAgICovXG4gICAgcHVibGljIGF1dG9UcmFuc2xhdGUoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nLCBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlOiBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUpXG4gICAgICAgIDogT2JzZXJ2YWJsZTxBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydD4ge1xuICAgICAgICByZXR1cm4gZm9ya0pvaW4oW1xuICAgICAgICAgICAgdGhpcy5kb0F1dG9UcmFuc2xhdGVOb25JQ1VNZXNzYWdlcyhmcm9tLCB0bywgbGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZSksXG4gICAgICAgICAgICAuLi50aGlzLmRvQXV0b1RyYW5zbGF0ZUlDVU1lc3NhZ2VzKGZyb20sIHRvLCBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlKV0pXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICBtYXAoKHN1bW1hcmllczogQXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnRbXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdW1tYXJ5ID0gc3VtbWFyaWVzWzBdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHN1bW1hcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VtbWFyeS5tZXJnZShzdW1tYXJpZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdW1tYXJ5O1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29sbGVjdCBhbGwgdW5pdHMgdGhhdCBhcmUgdW50cmFuc2xhdGVkLlxuICAgICAqIEBwYXJhbSBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGVcbiAgICAgKiBAcmV0dXJuIGFsbCB1bnRyYW5zbGF0ZWQgdW5pdHNcbiAgICAgKi9cbiAgICBwcml2YXRlIGFsbFVudHJhbnNsYXRlZFRVcyhsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlOiBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUpOiBJVHJhbnNVbml0W10ge1xuICAgICAgICAvLyBjb2xsZWN0IGFsbCB1bml0cywgdGhhdCBzaG91bGQgYmUgYXV0byB0cmFuc2xhdGVkXG4gICAgICAgIGNvbnN0IGFsbFVudHJhbnNsYXRlZDogSVRyYW5zVW5pdFtdID0gW107XG4gICAgICAgIGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGUuZm9yRWFjaFRyYW5zVW5pdCgodHUpID0+IHtcbiAgICAgICAgICAgIGlmICh0dS50YXJnZXRTdGF0ZSgpID09PSBTVEFURV9ORVcpIHtcbiAgICAgICAgICAgICAgICBhbGxVbnRyYW5zbGF0ZWQucHVzaCh0dSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYWxsVW50cmFuc2xhdGVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgZG9BdXRvVHJhbnNsYXRlTm9uSUNVTWVzc2FnZXMoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nLCBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlOiBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUpXG4gICAgICAgIDogT2JzZXJ2YWJsZTxBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydD4ge1xuICAgICAgICBjb25zdCBhbGxVbnRyYW5zbGF0ZWQ6IElUcmFuc1VuaXRbXSA9IHRoaXMuYWxsVW50cmFuc2xhdGVkVFVzKGxhbmd1YWdlU3BlY2lmaWNNZXNzYWdlc0ZpbGUpO1xuICAgICAgICBjb25zdCBhbGxUcmFuc2xhdGFibGUgPSBhbGxVbnRyYW5zbGF0ZWQuZmlsdGVyKCh0dSkgPT4gaXNOdWxsT3JVbmRlZmluZWQodHUuc291cmNlQ29udGVudE5vcm1hbGl6ZWQoKS5nZXRJQ1VNZXNzYWdlKCkpKTtcbiAgICAgICAgY29uc3QgYWxsTWVzc2FnZXM6IHN0cmluZ1tdID0gYWxsVHJhbnNsYXRhYmxlLm1hcCgodHUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiB0dS5zb3VyY2VDb250ZW50Tm9ybWFsaXplZCgpLmFzRGlzcGxheVN0cmluZygpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0b1RyYW5zbGF0ZVNlcnZpY2UudHJhbnNsYXRlTXVsdGlwbGVTdHJpbmdzKGFsbE1lc3NhZ2VzLCBmcm9tLCB0bylcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIC8vICM5NCBnb29nbGUgdHJhbnNsYXRlIG1pZ2h0IHJldHVybiAmIy4uIGVudGl0eSByZWZzLCB0aGF0IG11c3QgYmUgZGVjb2RlZFxuICAgICAgICAgICAgICAgIG1hcCgodHJhbnNsYXRpb25zOiBzdHJpbmdbXSkgPT4gdHJhbnNsYXRpb25zLm1hcChlbmNvZGVkVHJhbnNsYXRpb24gPT4gZW50aXR5RGVjb2RlckxpYi5kZWNvZGUoZW5jb2RlZFRyYW5zbGF0aW9uKSkpLFxuICAgICAgICAgICAgICAgIG1hcCgodHJhbnNsYXRpb25zOiBzdHJpbmdbXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1bW1hcnkgPSBuZXcgQXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnQoZnJvbSwgdG8pO1xuICAgICAgICAgICAgICAgIHN1bW1hcnkuc2V0SWdub3JlZChhbGxVbnRyYW5zbGF0ZWQubGVuZ3RoIC0gYWxsVHJhbnNsYXRhYmxlLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2xhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHUgPSBhbGxUcmFuc2xhdGFibGVbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uVGV4dCA9IHRyYW5zbGF0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5hdXRvVHJhbnNsYXRlTm9uSUNVVW5pdCh0dSwgdHJhbnNsYXRpb25UZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgc3VtbWFyeS5hZGRTaW5nbGVSZXN1bHQodHUsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzdW1tYXJ5O1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWlsU3VtbWFyeSA9IG5ldyBBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydChmcm9tLCB0byk7XG4gICAgICAgICAgICAgICAgICAgIGZhaWxTdW1tYXJ5LnNldEVycm9yKGVyci5tZXNzYWdlLCBhbGxNZXNzYWdlcy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2YoZmFpbFN1bW1hcnkpO1xuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZG9BdXRvVHJhbnNsYXRlSUNVTWVzc2FnZXMoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nLCBsYW5ndWFnZVNwZWNpZmljTWVzc2FnZXNGaWxlOiBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUpXG4gICAgICAgIDogT2JzZXJ2YWJsZTxBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydD5bXSB7XG4gICAgICAgIGNvbnN0IGFsbFVudHJhbnNsYXRlZDogSVRyYW5zVW5pdFtdID0gdGhpcy5hbGxVbnRyYW5zbGF0ZWRUVXMobGFuZ3VhZ2VTcGVjaWZpY01lc3NhZ2VzRmlsZSk7XG4gICAgICAgIGNvbnN0IGFsbFRyYW5zbGF0YWJsZUlDVSA9IGFsbFVudHJhbnNsYXRlZC5maWx0ZXIoKHR1KSA9PiAhaXNOdWxsT3JVbmRlZmluZWQodHUuc291cmNlQ29udGVudE5vcm1hbGl6ZWQoKS5nZXRJQ1VNZXNzYWdlKCkpKTtcbiAgICAgICAgcmV0dXJuIGFsbFRyYW5zbGF0YWJsZUlDVS5tYXAoKHR1KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kb0F1dG9UcmFuc2xhdGVJQ1VNZXNzYWdlKGZyb20sIHRvLCB0dSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZSBzaW5nbGUgSUNVIE1lc3NhZ2VzLlxuICAgICAqIEBwYXJhbSBmcm9tIGZyb21cbiAgICAgKiBAcGFyYW0gdG8gdG9cbiAgICAgKiBAcGFyYW0gdHUgdHJhbnN1bml0IHRvIHRyYW5zbGF0ZSAobXVzdCBjb250YWluIElDVSBNZXNzYWdlKVxuICAgICAqIEByZXR1cm4gc3VtbWFyeSByZXBvcnRcbiAgICAgKi9cbiAgICBwcml2YXRlIGRvQXV0b1RyYW5zbGF0ZUlDVU1lc3NhZ2UoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nLCB0dTogSVRyYW5zVW5pdCk6IE9ic2VydmFibGU8QXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnQ+IHtcbiAgICAgICAgY29uc3QgaWN1TWVzc2FnZTogSUlDVU1lc3NhZ2UgPSB0dS5zb3VyY2VDb250ZW50Tm9ybWFsaXplZCgpLmdldElDVU1lc3NhZ2UoKTtcbiAgICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IGljdU1lc3NhZ2UuZ2V0Q2F0ZWdvcmllcygpO1xuICAgICAgICAvLyBjaGVjayBmb3IgbmVzdGVkIElDVXMsIHdlIGRvIG5vdCBzdXBwb3J0IHRoYXRcbiAgICAgICAgaWYgKGNhdGVnb3JpZXMuZmluZCgoY2F0ZWdvcnkpID0+ICFpc051bGxPclVuZGVmaW5lZChjYXRlZ29yeS5nZXRNZXNzYWdlTm9ybWFsaXplZCgpLmdldElDVU1lc3NhZ2UoKSkpKSB7XG4gICAgICAgICAgICBjb25zdCBzdW1tYXJ5ID0gbmV3IEF1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0KGZyb20sIHRvKTtcbiAgICAgICAgICAgIHN1bW1hcnkuc2V0SWdub3JlZCgxKTtcbiAgICAgICAgICAgIHJldHVybiBvZihzdW1tYXJ5KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbGxNZXNzYWdlczogc3RyaW5nW10gPSBjYXRlZ29yaWVzLm1hcCgoY2F0ZWdvcnkpID0+IGNhdGVnb3J5LmdldE1lc3NhZ2VOb3JtYWxpemVkKCkuYXNEaXNwbGF5U3RyaW5nKCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRvVHJhbnNsYXRlU2VydmljZS50cmFuc2xhdGVNdWx0aXBsZVN0cmluZ3MoYWxsTWVzc2FnZXMsIGZyb20sIHRvKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgLy8gIzk0IGdvb2dsZSB0cmFuc2xhdGUgbWlnaHQgcmV0dXJuICYjLi4gZW50aXR5IHJlZnMsIHRoYXQgbXVzdCBiZSBkZWNvZGVkXG4gICAgICAgICAgICAgICAgbWFwKCh0cmFuc2xhdGlvbnM6IHN0cmluZ1tdKSA9PiB0cmFuc2xhdGlvbnMubWFwKGVuY29kZWRUcmFuc2xhdGlvbiA9PiBlbnRpdHlEZWNvZGVyTGliLmRlY29kZShlbmNvZGVkVHJhbnNsYXRpb24pKSksXG4gICAgICAgICAgICAgICAgbWFwKCh0cmFuc2xhdGlvbnM6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1bW1hcnkgPSBuZXcgQXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnQoZnJvbSwgdG8pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpY3VUcmFuc2xhdGlvbjogSUlDVU1lc3NhZ2VUcmFuc2xhdGlvbiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zbGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWN1VHJhbnNsYXRpb25bY2F0ZWdvcmllc1tpXS5nZXRDYXRlZ29yeSgpXSA9IHRyYW5zbGF0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmF1dG9UcmFuc2xhdGVJQ1VVbml0KHR1LCBpY3VUcmFuc2xhdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIHN1bW1hcnkuYWRkU2luZ2xlUmVzdWx0KHR1LCByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3VtbWFyeTtcbiAgICAgICAgICAgICAgICB9KSwgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhaWxTdW1tYXJ5ID0gbmV3IEF1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0KGZyb20sIHRvKTtcbiAgICAgICAgICAgICAgICAgICAgZmFpbFN1bW1hcnkuc2V0RXJyb3IoZXJyLm1lc3NhZ2UsIGFsbE1lc3NhZ2VzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZihmYWlsU3VtbWFyeSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXRvVHJhbnNsYXRlTm9uSUNVVW5pdCh0dTogSVRyYW5zVW5pdCwgdHJhbnNsYXRlZE1lc3NhZ2U6IHN0cmluZyk6IEF1dG9UcmFuc2xhdGVSZXN1bHQge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRvVHJhbnNsYXRlVW5pdCh0dSwgdHUuc291cmNlQ29udGVudE5vcm1hbGl6ZWQoKS50cmFuc2xhdGUodHJhbnNsYXRlZE1lc3NhZ2UpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGF1dG9UcmFuc2xhdGVJQ1VVbml0KHR1OiBJVHJhbnNVbml0LCB0cmFuc2xhdGlvbjogSUlDVU1lc3NhZ2VUcmFuc2xhdGlvbik6IEF1dG9UcmFuc2xhdGVSZXN1bHQge1xuICAgICAgICByZXR1cm4gdGhpcy5hdXRvVHJhbnNsYXRlVW5pdCh0dSwgdHUuc291cmNlQ29udGVudE5vcm1hbGl6ZWQoKS50cmFuc2xhdGVJQ1VNZXNzYWdlKHRyYW5zbGF0aW9uKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhdXRvVHJhbnNsYXRlVW5pdCh0dTogSVRyYW5zVW5pdCwgdHJhbnNsYXRlZE1lc3NhZ2U6IElOb3JtYWxpemVkTWVzc2FnZSk6IEF1dG9UcmFuc2xhdGVSZXN1bHQge1xuICAgICAgICBjb25zdCBlcnJvcnMgPSB0cmFuc2xhdGVkTWVzc2FnZS52YWxpZGF0ZSgpO1xuICAgICAgICBjb25zdCB3YXJuaW5ncyA9IHRyYW5zbGF0ZWRNZXNzYWdlLnZhbGlkYXRlV2FybmluZ3MoKTtcbiAgICAgICAgaWYgKCFpc051bGxPclVuZGVmaW5lZChlcnJvcnMpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEF1dG9UcmFuc2xhdGVSZXN1bHQoZmFsc2UsICdlcnJvcnMgZGV0ZWN0ZWQsIG5vdCB0cmFuc2xhdGVkJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWlzTnVsbE9yVW5kZWZpbmVkKHdhcm5pbmdzKSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBdXRvVHJhbnNsYXRlUmVzdWx0KGZhbHNlLCAnd2FybmluZ3MgZGV0ZWN0ZWQsIG5vdCB0cmFuc2xhdGVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0dS50cmFuc2xhdGUodHJhbnNsYXRlZE1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBdXRvVHJhbnNsYXRlUmVzdWx0KHRydWUsIG51bGwpOyAvLyBzdWNjZXNzXG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=