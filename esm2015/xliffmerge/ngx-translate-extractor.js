/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NORMALIZATION_FORMAT_NGXTRANSLATE } from '@ngx-i18nsupport/ngx-i18nsupport-lib';
import { FileUtil } from '../common/file-util';
import { isNullOrUndefined } from '../common/util';
import { NgxTranslateExtractionPattern } from './ngx-translate-extraction-pattern';
/**
 * The interface used for translations in ngx-translate.
 * A hash that contains either the translation or another hash.
 * @record
 */
function NgxTranslations() { }
/**
 * internal,
 * a message with id (a dot-separated string).
 * @record
 */
function NgxMessage() { }
if (false) {
    /** @type {?} */
    NgxMessage.prototype.id;
    /** @type {?} */
    NgxMessage.prototype.message;
}
export class NgxTranslateExtractor {
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
if (false) {
    /** @type {?} */
    NgxTranslateExtractor.DefaultExtractionPattern;
    /**
     * @type {?}
     * @private
     */
    NgxTranslateExtractor.prototype.extractionPattern;
    /**
     * @type {?}
     * @private
     */
    NgxTranslateExtractor.prototype.messagesFile;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRyYW5zbGF0ZS1leHRyYWN0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbInhsaWZmbWVyZ2Uvbmd4LXRyYW5zbGF0ZS1leHRyYWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBdUMsaUNBQWlDLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUM3SCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sb0NBQW9DLENBQUM7Ozs7OztBQVdqRiw4QkFFQzs7Ozs7O0FBTUQseUJBR0M7OztJQUZHLHdCQUFXOztJQUNYLDZCQUFnQjs7QUFHcEIsTUFBTSxPQUFPLHFCQUFxQjs7Ozs7SUF5QjlCLFlBQW9CLFlBQXNDLEVBQUUsdUJBQStCO1FBQXZFLGlCQUFZLEdBQVosWUFBWSxDQUEwQjtRQUN0RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7Ozs7OztJQWpCTSxNQUFNLENBQUMsWUFBWSxDQUFDLHVCQUErQjtRQUN0RCxJQUFJO1lBQ0YsSUFBSSxJQUFJLDZCQUE2QixDQUFDLHVCQUF1QixDQUFDLEVBQUU7Z0JBQzVELE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDRjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7OztJQUVNLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBc0MsRUFBRSxpQkFBeUIsRUFBRSxVQUFrQjtRQUN2RyxJQUFJLHFCQUFxQixDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxDQUFD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OztJQXNCN0MsNkNBQThDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUsIElUcmFuc1VuaXQsIE5PUk1BTElaQVRJT05fRk9STUFUX05HWFRSQU5TTEFURX0gZnJvbSAnQG5neC1pMThuc3VwcG9ydC9uZ3gtaTE4bnN1cHBvcnQtbGliJztcbmltcG9ydCB7RmlsZVV0aWx9IGZyb20gJy4uL2NvbW1vbi9maWxlLXV0aWwnO1xuaW1wb3J0IHtpc051bGxPclVuZGVmaW5lZH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHtOZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybn0gZnJvbSAnLi9uZ3gtdHJhbnNsYXRlLWV4dHJhY3Rpb24tcGF0dGVybic7XG4vKipcbiAqIENyZWF0ZWQgYnkgcm9vYm0gb24gMTUuMDMuMjAxNy5cbiAqIEEgdG9vbCBmb3IgZXh0cmFjdGluZyBtZXNzYWdlcyBpbiBuZ3gtdHJhbnNsYXRlIGZvcm1hdC5cbiAqIEdlbmVyYXRlcyBhIGpzb24tZmlsZSB0byBiZSB1c2VkIHdpdGggbmd4LXRyYW5zbGF0ZS5cbiAqL1xuXG4vKipcbiAqIFRoZSBpbnRlcmZhY2UgdXNlZCBmb3IgdHJhbnNsYXRpb25zIGluIG5neC10cmFuc2xhdGUuXG4gKiBBIGhhc2ggdGhhdCBjb250YWlucyBlaXRoZXIgdGhlIHRyYW5zbGF0aW9uIG9yIGFub3RoZXIgaGFzaC5cbiAqL1xuaW50ZXJmYWNlIE5neFRyYW5zbGF0aW9ucyB7XG4gICAgW2lkOiBzdHJpbmddOiBOZ3hUcmFuc2xhdGlvbnMgfCBzdHJpbmc7XG59XG5cbi8qKlxuICogaW50ZXJuYWwsXG4gKiBhIG1lc3NhZ2Ugd2l0aCBpZCAoYSBkb3Qtc2VwYXJhdGVkIHN0cmluZykuXG4gKi9cbmludGVyZmFjZSBOZ3hNZXNzYWdlIHtcbiAgICBpZDogc3RyaW5nOyAvLyBkb3Qgc2VwYXJhdGVkIG5hbWUsIGUuZy4gXCJteWFwcC5zZXJ2aWNlMS5tZXNzYWdlMVwiXG4gICAgbWVzc2FnZTogc3RyaW5nOyAvLyB0aGUgbWVzc2FnZSwgcGxhY2Vob2xkZXIgYXJlIGluIHt7bn19IHN5bnRheCwgZS5nLiBcImEgdGVzdCB3aXRoIHZhbHVlOiB7ezB9fVxufVxuXG5leHBvcnQgY2xhc3MgTmd4VHJhbnNsYXRlRXh0cmFjdG9yIHtcblxuICAgIHB1YmxpYyBzdGF0aWMgRGVmYXVsdEV4dHJhY3Rpb25QYXR0ZXJuID0gJ0BAfG5neC10cmFuc2xhdGUnO1xuICAgIHByaXZhdGUgZXh0cmFjdGlvblBhdHRlcm46IE5neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuO1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2ssIHdldGhlciBleHRyYWN0aW9uUGF0dGVybiBoYXMgdmFsaWQgc3ludGF4LlxuICAgICAqIEBwYXJhbSBleHRyYWN0aW9uUGF0dGVyblN0cmluZyBleHRyYWN0aW9uUGF0dGVyblN0cmluZ1xuICAgICAqIEByZXR1cm4gbnVsbCwgaWYgcGF0dGVybiBpcyBvaywgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIGVycm9yLCBpZiBpdCBpcyBub3Qgb2suXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjaGVja1BhdHRlcm4oZXh0cmFjdGlvblBhdHRlcm5TdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKG5ldyBOZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybihleHRyYWN0aW9uUGF0dGVyblN0cmluZykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBleHRyYWN0KG1lc3NhZ2VzRmlsZTogSVRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlLCBleHRyYWN0aW9uUGF0dGVybjogc3RyaW5nLCBvdXRwdXRGaWxlOiBzdHJpbmcpIHtcbiAgICAgICAgbmV3IE5neFRyYW5zbGF0ZUV4dHJhY3RvcihtZXNzYWdlc0ZpbGUsIGV4dHJhY3Rpb25QYXR0ZXJuKS5leHRyYWN0VG8ob3V0cHV0RmlsZSk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXNzYWdlc0ZpbGU6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSwgZXh0cmFjdGlvblBhdHRlcm5TdHJpbmc6IHN0cmluZykge1xuICAgICAgICB0aGlzLmV4dHJhY3Rpb25QYXR0ZXJuID0gbmV3IE5neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuKGV4dHJhY3Rpb25QYXR0ZXJuU3RyaW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRhY3QgbWVzc2FnZXMgYW5kIHdyaXRlIHRoZW0gdG8gYSBmaWxlLlxuICAgICAqIEBwYXJhbSBvdXRwdXRGaWxlIG91dHB1dEZpbGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZXh0cmFjdFRvKG91dHB1dEZpbGU6IHN0cmluZykge1xuICAgICAgICBjb25zdCB0cmFuc2xhdGlvbnM6IE5neFRyYW5zbGF0aW9ucyA9IHRoaXMudG9OZ3hUcmFuc2xhdGlvbnModGhpcy5leHRyYWN0KCkpO1xuICAgICAgICBpZiAodHJhbnNsYXRpb25zICYmIE9iamVjdC5rZXlzKHRyYW5zbGF0aW9ucykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgRmlsZVV0aWwucmVwbGFjZUNvbnRlbnQob3V0cHV0RmlsZSwgSlNPTi5zdHJpbmdpZnkodHJhbnNsYXRpb25zLCBudWxsLCA0KSwgJ1VURi04Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoRmlsZVV0aWwuZXhpc3RzKG91dHB1dEZpbGUpKSB7XG4gICAgICAgICAgICAgICAgRmlsZVV0aWwuZGVsZXRlRmlsZShvdXRwdXRGaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICBFeHRyYWN0IG1lc3NhZ2VzIGFuZCBjb252ZXJ0IHRoZW0gdG8gbmd4IHRyYW5zbGF0aW9ucy5cbiAgICAgKiAgQHJldHVybiB0aGUgdHJhbnNsYXRpb24gb2JqZWN0cy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGV4dHJhY3QoKTogTmd4TWVzc2FnZVtdIHtcbiAgICAgICAgY29uc3QgcmVzdWx0OiBOZ3hNZXNzYWdlW10gPSBbXTtcbiAgICAgICAgdGhpcy5tZXNzYWdlc0ZpbGUuZm9yRWFjaFRyYW5zVW5pdCgodHU6IElUcmFuc1VuaXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5neElkID0gdGhpcy5uZ3hUcmFuc2xhdGVJZEZyb21UVSh0dSk7XG4gICAgICAgICAgICBpZiAobmd4SWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdldGV4dCA9IHR1LnRhcmdldENvbnRlbnROb3JtYWxpemVkKCkuYXNEaXNwbGF5U3RyaW5nKE5PUk1BTElaQVRJT05fRk9STUFUX05HWFRSQU5TTEFURSk7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goe2lkOiBuZ3hJZCwgbWVzc2FnZTogbWVzc2FnZXRleHR9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2ssIHdldGhlciB0aGlzIHR1IHNob3VsZCBiZSBleHRyYWN0ZWQgZm9yIG5neC10cmFuc2xhdGUgdXNhZ2UsIGFuZCByZXR1cm4gaXRzIGlkIGZvciBuZ3gtdHJhbnNsYXRlLlxuICAgICAqIFRoZXJlIGFyZSAyIHBvc3NpYmlsaXRpZXM6XG4gICAgICogMS4gZGVzY3JpcHRpb24gaXMgc2V0IHRvIFwibmd4LXRyYW5zbGF0ZVwiIGFuZCBtZWFuaW5nIGNvbnRhaW5zIHRoZSBpZC5cbiAgICAgKiAyLiBpZCBpcyBleHBsaWNpdGx5IHNldCB0byBhIHN0cmluZy5cbiAgICAgKiBAcGFyYW0gdHUgdHVcbiAgICAgKiBAcmV0dXJuIGFuIG5neCBpZCBvciBudWxsLCBpZiB0aGlzIHR1IHNob3VsZCBub3QgYmUgZXh0cmFjdGVkLlxuICAgICAqL1xuICAgIHByaXZhdGUgbmd4VHJhbnNsYXRlSWRGcm9tVFUodHU6IElUcmFuc1VuaXQpOiBzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5pc0V4cGxpY2l0bHlTZXRJZCh0dS5pZCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmV4dHJhY3Rpb25QYXR0ZXJuLmlzRXhwbGljaXRJZE1hdGNoZWQodHUuaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR1LmlkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHR1LmRlc2NyaXB0aW9uKCk7XG4gICAgICAgIGlmIChkZXNjcmlwdGlvbiAmJiB0aGlzLmV4dHJhY3Rpb25QYXR0ZXJuLmlzRGVzY3JpcHRpb25NYXRjaGVkKGRlc2NyaXB0aW9uKSkge1xuICAgICAgICAgICAgcmV0dXJuIHR1Lm1lYW5pbmcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3QsIHdldGhlciBJRCB3YXMgZXhwbGljaXRseSBzZXQgKHZpYSBpMThuPVwiQG15aWQpLlxuICAgICAqIEp1c3QgaGV1cmlzdGljLCBhbiBJRCBpcyBleHBsaWNpdGx5LCBpZiBpdCBkb2VzIG5vdCBsb29rIGxpa2UgYSBnZW5lcmF0ZWQgb25lLlxuICAgICAqIEBwYXJhbSBpZCBpZFxuICAgICAqIEByZXR1cm4gd2V0aGVyIElEIHdhcyBleHBsaWNpdGx5IHNldCAodmlhIGkxOG49XCJAbXlpZCkuXG4gICAgICovXG4gICAgcHJpdmF0ZSBpc0V4cGxpY2l0bHlTZXRJZChpZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChpc051bGxPclVuZGVmaW5lZChpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBnZW5lcmF0ZWQgSURzIGFyZSBlaXRoZXIgZGVjaW1hbCBvciBzaGExIGhleFxuICAgICAgICBjb25zdCByZUZvckdlbmVyYXRlZElkID0gL15bMC05YS1mXXsxMSx9JC87XG4gICAgICAgIHJldHVybiAhcmVGb3JHZW5lcmF0ZWRJZC50ZXN0KGlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGxpc3Qgb2YgcmVsZXZhbnQgVFVzIHRvIG5neCB0cmFuc2xhdGlvbnMgb2JqZWN0LlxuICAgICAqIEBwYXJhbSBtc2dMaXN0IG1zZ0xpc3RcbiAgICAgKi9cbiAgICBwcml2YXRlIHRvTmd4VHJhbnNsYXRpb25zKG1zZ0xpc3Q6IE5neE1lc3NhZ2VbXSk6IE5neFRyYW5zbGF0aW9ucyB7XG4gICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uT2JqZWN0OiBOZ3hUcmFuc2xhdGlvbnMgPSB7fTtcbiAgICAgICAgbXNnTGlzdC5mb3JFYWNoKChtc2c6IE5neE1lc3NhZ2UpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHV0SW5UcmFuc2xhdGlvbk9iamVjdCh0cmFuc2xhdGlvbk9iamVjdCwgbXNnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGlvbk9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdXQgYSBuZXcgbWVzc2FnZXMgaW50byB0aGUgdHJhbnNsYXRpb24gZGF0YSBvYmplY3QuXG4gICAgICogSWYgeW91IGFkZCwgZS5nLiBcIntpZDogJ215YXBwLmV4YW1wbGUnLCBtZXNzYWdlOiAndGVzdCd9XCIsXG4gICAgICogdGhlIHRyYW5zbGF0aW9uIG9iamVjdCB3aWxsIHRoZW4gY29udGFpbiBhbiBvYmplY3QgbXlhcHAgdGhhdCBoYXMgcHJvcGVydHkgZXhhbXBsZTpcbiAgICAgKiB7bXlhcHA6IHtcbiAgICAgKiAgIGV4YW1wbGU6ICd0ZXN0J1xuICAgICAqICAgfX1cbiAgICAgKiBAcGFyYW0gdHJhbnNsYXRpb25PYmplY3QgdHJhbnNsYXRpb25PYmplY3RcbiAgICAgKiBAcGFyYW0gbXNnIG1zZ1xuICAgICAqL1xuICAgIHByaXZhdGUgcHV0SW5UcmFuc2xhdGlvbk9iamVjdCh0cmFuc2xhdGlvbk9iamVjdDogTmd4VHJhbnNsYXRpb25zLCBtc2c6IE5neE1lc3NhZ2UpIHtcbiAgICAgICAgbGV0IGZpcnN0UGFydE9mSWQ6IHN0cmluZztcbiAgICAgICAgbGV0IHJlc3RPZklkOiBzdHJpbmc7XG4gICAgICAgIGNvbnN0IGluZGV4T2ZEb3QgPSBtc2cuaWQuaW5kZXhPZignLicpO1xuICAgICAgICBpZiAoaW5kZXhPZkRvdCA9PT0gMCB8fCBpbmRleE9mRG90ID09PSAobXNnLmlkLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBueGctdHJhbnNsYXRlIGlkIFwiJyArIG1zZy5pZCArICdcIicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRleE9mRG90IDwgMCkge1xuICAgICAgICAgICAgZmlyc3RQYXJ0T2ZJZCA9IG1zZy5pZDtcbiAgICAgICAgICAgIHJlc3RPZklkID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaXJzdFBhcnRPZklkID0gbXNnLmlkLnN1YnN0cmluZygwLCBpbmRleE9mRG90KTtcbiAgICAgICAgICAgIHJlc3RPZklkID0gbXNnLmlkLnN1YnN0cmluZyhpbmRleE9mRG90ICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9iamVjdCA9IHRyYW5zbGF0aW9uT2JqZWN0W2ZpcnN0UGFydE9mSWRdO1xuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQob2JqZWN0KSkge1xuICAgICAgICAgICAgaWYgKHJlc3RPZklkID09PSAnJykge1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uT2JqZWN0W2ZpcnN0UGFydE9mSWRdID0gbXNnLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JqZWN0ID0ge307XG4gICAgICAgICAgICB0cmFuc2xhdGlvbk9iamVjdFtmaXJzdFBhcnRPZklkXSA9IG9iamVjdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChyZXN0T2ZJZCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2R1cGxpY2F0ZSBpZCBwcmFlZml4IFwiJyArIG1zZy5pZCArICdcIicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHV0SW5UcmFuc2xhdGlvbk9iamVjdCg8Tmd4VHJhbnNsYXRpb25zPiBvYmplY3QsIHtpZDogcmVzdE9mSWQsIG1lc3NhZ2U6IG1zZy5tZXNzYWdlfSk7XG4gICAgfVxufVxuIl19