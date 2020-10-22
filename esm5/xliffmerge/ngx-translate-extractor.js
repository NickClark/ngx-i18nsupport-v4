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
                var messagetext = tu.targetContentNormalized().asDisplayString(NORMALIZATION_FORMAT_NGXTRANSLATE);
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
export { NgxTranslateExtractor };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRyYW5zbGF0ZS1leHRyYWN0b3IuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbInhsaWZmbWVyZ2Uvbmd4LXRyYW5zbGF0ZS1leHRyYWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBdUMsaUNBQWlDLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUM3SCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFDLDZCQUE2QixFQUFDLE1BQU0sb0NBQW9DLENBQUM7Ozs7OztBQVdqRiw4QkFFQzs7Ozs7O0FBTUQseUJBR0M7OztJQUZHLHdCQUFXOztJQUNYLDZCQUFnQjs7QUFHcEI7SUF5QkksK0JBQW9CLFlBQXNDLEVBQUUsdUJBQStCO1FBQXZFLGlCQUFZLEdBQVosWUFBWSxDQUEwQjtRQUN0RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSw2QkFBNkIsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUF0QkQ7Ozs7T0FJRzs7Ozs7O0lBQ1csa0NBQVk7Ozs7O0lBQTFCLFVBQTJCLHVCQUErQjtRQUN0RCxJQUFJO1lBQ0YsSUFBSSxJQUFJLDZCQUE2QixDQUFDLHVCQUF1QixDQUFDLEVBQUU7Z0JBQzVELE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDRjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ1osT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDO1NBQ3hCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQzs7Ozs7OztJQUVhLDZCQUFPOzs7Ozs7SUFBckIsVUFBc0IsWUFBc0MsRUFBRSxpQkFBeUIsRUFBRSxVQUFrQjtRQUN2RyxJQUFJLHFCQUFxQixDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBTUQ7OztPQUdHOzs7Ozs7SUFDSSx5Q0FBUzs7Ozs7SUFBaEIsVUFBaUIsVUFBa0I7O1lBQ3pCLFlBQVksR0FBb0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM1RSxJQUFJLFlBQVksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZGO2FBQU07WUFDSCxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzdCLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDbkM7U0FDSjtJQUNMLENBQUM7SUFFRDs7O09BR0c7Ozs7OztJQUNLLHVDQUFPOzs7OztJQUFmO1FBQUEsaUJBVUM7O1lBVFMsTUFBTSxHQUFpQixFQUFFO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCOzs7O1FBQUMsVUFBQyxFQUFjOztnQkFDeEMsS0FBSyxHQUFHLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7WUFDM0MsSUFBSSxLQUFLLEVBQUU7O29CQUNELFdBQVcsR0FBRyxFQUFFLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxlQUFlLENBQUMsaUNBQWlDLENBQUM7Z0JBQ25HLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO2FBQ2xEO1FBQ0wsQ0FBQyxFQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRzs7Ozs7Ozs7OztJQUNLLG9EQUFvQjs7Ozs7Ozs7O0lBQTVCLFVBQTZCLEVBQWM7UUFDdkMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQy9CLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDbkQsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO2FBQ2hCO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjs7WUFDSyxXQUFXLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRTtRQUNwQyxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDekUsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDdkI7SUFDTCxDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0ssaURBQWlCOzs7Ozs7O0lBQXpCLFVBQTBCLEVBQVU7UUFDaEMsSUFBSSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN2QixPQUFPLEtBQUssQ0FBQztTQUNoQjs7O1lBRUssZ0JBQWdCLEdBQUcsaUJBQWlCO1FBQzFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7OztJQUNLLGlEQUFpQjs7Ozs7O0lBQXpCLFVBQTBCLE9BQXFCO1FBQS9DLGlCQU1DOztZQUxTLGlCQUFpQixHQUFvQixFQUFFO1FBQzdDLE9BQU8sQ0FBQyxPQUFPOzs7O1FBQUMsVUFBQyxHQUFlO1lBQzVCLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN4RCxDQUFDLEVBQUMsQ0FBQztRQUNILE9BQU8saUJBQWlCLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRzs7Ozs7Ozs7Ozs7OztJQUNLLHNEQUFzQjs7Ozs7Ozs7Ozs7O0lBQTlCLFVBQStCLGlCQUFrQyxFQUFFLEdBQWU7O1lBQzFFLGFBQXFCOztZQUNyQixRQUFnQjs7WUFDZCxVQUFVLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQ3RDLElBQUksVUFBVSxLQUFLLENBQUMsSUFBSSxVQUFVLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN4RCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDNUQ7UUFDRCxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7WUFDaEIsYUFBYSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdkIsUUFBUSxHQUFHLEVBQUUsQ0FBQztTQUNqQjthQUFNO1lBQ0gsYUFBYSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNoRCxRQUFRLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQy9DOztZQUNHLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxhQUFhLENBQUM7UUFDN0MsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMzQixJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7Z0JBQ2pCLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQy9DLE9BQU87YUFDVjtZQUNELE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDWixpQkFBaUIsQ0FBQyxhQUFhLENBQUMsR0FBRyxNQUFNLENBQUM7U0FDN0M7YUFBTTtZQUNILElBQUksUUFBUSxLQUFLLEVBQUUsRUFBRTtnQkFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2FBQzVEO1NBQ0o7UUFDRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsbUJBQWtCLE1BQU0sRUFBQSxFQUFFLEVBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQWpKYSw4Q0FBd0IsR0FBRyxrQkFBa0IsQ0FBQztJQWtKaEUsNEJBQUM7Q0FBQSxBQXBKRCxJQW9KQztTQXBKWSxxQkFBcUI7OztJQUU5QiwrQ0FBNEQ7Ozs7O0lBQzVELGtEQUF5RDs7Ozs7SUFzQjdDLDZDQUE4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlLCBJVHJhbnNVbml0LCBOT1JNQUxJWkFUSU9OX0ZPUk1BVF9OR1hUUkFOU0xBVEV9IGZyb20gJ0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LWxpYic7XG5pbXBvcnQge0ZpbGVVdGlsfSBmcm9tICcuLi9jb21tb24vZmlsZS11dGlsJztcbmltcG9ydCB7aXNOdWxsT3JVbmRlZmluZWR9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7Tmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm59IGZyb20gJy4vbmd4LXRyYW5zbGF0ZS1leHRyYWN0aW9uLXBhdHRlcm4nO1xuLyoqXG4gKiBDcmVhdGVkIGJ5IHJvb2JtIG9uIDE1LjAzLjIwMTcuXG4gKiBBIHRvb2wgZm9yIGV4dHJhY3RpbmcgbWVzc2FnZXMgaW4gbmd4LXRyYW5zbGF0ZSBmb3JtYXQuXG4gKiBHZW5lcmF0ZXMgYSBqc29uLWZpbGUgdG8gYmUgdXNlZCB3aXRoIG5neC10cmFuc2xhdGUuXG4gKi9cblxuLyoqXG4gKiBUaGUgaW50ZXJmYWNlIHVzZWQgZm9yIHRyYW5zbGF0aW9ucyBpbiBuZ3gtdHJhbnNsYXRlLlxuICogQSBoYXNoIHRoYXQgY29udGFpbnMgZWl0aGVyIHRoZSB0cmFuc2xhdGlvbiBvciBhbm90aGVyIGhhc2guXG4gKi9cbmludGVyZmFjZSBOZ3hUcmFuc2xhdGlvbnMge1xuICAgIFtpZDogc3RyaW5nXTogTmd4VHJhbnNsYXRpb25zIHwgc3RyaW5nO1xufVxuXG4vKipcbiAqIGludGVybmFsLFxuICogYSBtZXNzYWdlIHdpdGggaWQgKGEgZG90LXNlcGFyYXRlZCBzdHJpbmcpLlxuICovXG5pbnRlcmZhY2UgTmd4TWVzc2FnZSB7XG4gICAgaWQ6IHN0cmluZzsgLy8gZG90IHNlcGFyYXRlZCBuYW1lLCBlLmcuIFwibXlhcHAuc2VydmljZTEubWVzc2FnZTFcIlxuICAgIG1lc3NhZ2U6IHN0cmluZzsgLy8gdGhlIG1lc3NhZ2UsIHBsYWNlaG9sZGVyIGFyZSBpbiB7e259fSBzeW50YXgsIGUuZy4gXCJhIHRlc3Qgd2l0aCB2YWx1ZToge3swfX1cbn1cblxuZXhwb3J0IGNsYXNzIE5neFRyYW5zbGF0ZUV4dHJhY3RvciB7XG5cbiAgICBwdWJsaWMgc3RhdGljIERlZmF1bHRFeHRyYWN0aW9uUGF0dGVybiA9ICdAQHxuZ3gtdHJhbnNsYXRlJztcbiAgICBwcml2YXRlIGV4dHJhY3Rpb25QYXR0ZXJuOiBOZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybjtcblxuICAgIC8qKlxuICAgICAqIENoZWNrLCB3ZXRoZXIgZXh0cmFjdGlvblBhdHRlcm4gaGFzIHZhbGlkIHN5bnRheC5cbiAgICAgKiBAcGFyYW0gZXh0cmFjdGlvblBhdHRlcm5TdHJpbmcgZXh0cmFjdGlvblBhdHRlcm5TdHJpbmdcbiAgICAgKiBAcmV0dXJuIG51bGwsIGlmIHBhdHRlcm4gaXMgb2ssIHN0cmluZyBkZXNjcmliaW5nIHRoZSBlcnJvciwgaWYgaXQgaXMgbm90IG9rLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgY2hlY2tQYXR0ZXJuKGV4dHJhY3Rpb25QYXR0ZXJuU3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChuZXcgTmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm4oZXh0cmFjdGlvblBhdHRlcm5TdHJpbmcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnJvci5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZXh0cmFjdChtZXNzYWdlc0ZpbGU6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSwgZXh0cmFjdGlvblBhdHRlcm46IHN0cmluZywgb3V0cHV0RmlsZTogc3RyaW5nKSB7XG4gICAgICAgIG5ldyBOZ3hUcmFuc2xhdGVFeHRyYWN0b3IobWVzc2FnZXNGaWxlLCBleHRyYWN0aW9uUGF0dGVybikuZXh0cmFjdFRvKG91dHB1dEZpbGUpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbWVzc2FnZXNGaWxlOiBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGUsIGV4dHJhY3Rpb25QYXR0ZXJuU3RyaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5leHRyYWN0aW9uUGF0dGVybiA9IG5ldyBOZ3hUcmFuc2xhdGVFeHRyYWN0aW9uUGF0dGVybihleHRyYWN0aW9uUGF0dGVyblN0cmluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0YWN0IG1lc3NhZ2VzIGFuZCB3cml0ZSB0aGVtIHRvIGEgZmlsZS5cbiAgICAgKiBAcGFyYW0gb3V0cHV0RmlsZSBvdXRwdXRGaWxlXG4gICAgICovXG4gICAgcHVibGljIGV4dHJhY3RUbyhvdXRwdXRGaWxlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdHJhbnNsYXRpb25zOiBOZ3hUcmFuc2xhdGlvbnMgPSB0aGlzLnRvTmd4VHJhbnNsYXRpb25zKHRoaXMuZXh0cmFjdCgpKTtcbiAgICAgICAgaWYgKHRyYW5zbGF0aW9ucyAmJiBPYmplY3Qua2V5cyh0cmFuc2xhdGlvbnMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIEZpbGVVdGlsLnJlcGxhY2VDb250ZW50KG91dHB1dEZpbGUsIEpTT04uc3RyaW5naWZ5KHRyYW5zbGF0aW9ucywgbnVsbCwgNCksICdVVEYtOCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKEZpbGVVdGlsLmV4aXN0cyhvdXRwdXRGaWxlKSkge1xuICAgICAgICAgICAgICAgIEZpbGVVdGlsLmRlbGV0ZUZpbGUob3V0cHV0RmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAgRXh0cmFjdCBtZXNzYWdlcyBhbmQgY29udmVydCB0aGVtIHRvIG5neCB0cmFuc2xhdGlvbnMuXG4gICAgICogIEByZXR1cm4gdGhlIHRyYW5zbGF0aW9uIG9iamVjdHMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBleHRyYWN0KCk6IE5neE1lc3NhZ2VbXSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogTmd4TWVzc2FnZVtdID0gW107XG4gICAgICAgIHRoaXMubWVzc2FnZXNGaWxlLmZvckVhY2hUcmFuc1VuaXQoKHR1OiBJVHJhbnNVbml0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuZ3hJZCA9IHRoaXMubmd4VHJhbnNsYXRlSWRGcm9tVFUodHUpO1xuICAgICAgICAgICAgaWYgKG5neElkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZXRleHQgPSB0dS50YXJnZXRDb250ZW50Tm9ybWFsaXplZCgpLmFzRGlzcGxheVN0cmluZyhOT1JNQUxJWkFUSU9OX0ZPUk1BVF9OR1hUUkFOU0xBVEUpO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtpZDogbmd4SWQsIG1lc3NhZ2U6IG1lc3NhZ2V0ZXh0fSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrLCB3ZXRoZXIgdGhpcyB0dSBzaG91bGQgYmUgZXh0cmFjdGVkIGZvciBuZ3gtdHJhbnNsYXRlIHVzYWdlLCBhbmQgcmV0dXJuIGl0cyBpZCBmb3Igbmd4LXRyYW5zbGF0ZS5cbiAgICAgKiBUaGVyZSBhcmUgMiBwb3NzaWJpbGl0aWVzOlxuICAgICAqIDEuIGRlc2NyaXB0aW9uIGlzIHNldCB0byBcIm5neC10cmFuc2xhdGVcIiBhbmQgbWVhbmluZyBjb250YWlucyB0aGUgaWQuXG4gICAgICogMi4gaWQgaXMgZXhwbGljaXRseSBzZXQgdG8gYSBzdHJpbmcuXG4gICAgICogQHBhcmFtIHR1IHR1XG4gICAgICogQHJldHVybiBhbiBuZ3ggaWQgb3IgbnVsbCwgaWYgdGhpcyB0dSBzaG91bGQgbm90IGJlIGV4dHJhY3RlZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIG5neFRyYW5zbGF0ZUlkRnJvbVRVKHR1OiBJVHJhbnNVbml0KTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuaXNFeHBsaWNpdGx5U2V0SWQodHUuaWQpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5leHRyYWN0aW9uUGF0dGVybi5pc0V4cGxpY2l0SWRNYXRjaGVkKHR1LmlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0dS5pZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSB0dS5kZXNjcmlwdGlvbigpO1xuICAgICAgICBpZiAoZGVzY3JpcHRpb24gJiYgdGhpcy5leHRyYWN0aW9uUGF0dGVybi5pc0Rlc2NyaXB0aW9uTWF0Y2hlZChkZXNjcmlwdGlvbikpIHtcbiAgICAgICAgICAgIHJldHVybiB0dS5tZWFuaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXN0LCB3ZXRoZXIgSUQgd2FzIGV4cGxpY2l0bHkgc2V0ICh2aWEgaTE4bj1cIkBteWlkKS5cbiAgICAgKiBKdXN0IGhldXJpc3RpYywgYW4gSUQgaXMgZXhwbGljaXRseSwgaWYgaXQgZG9lcyBub3QgbG9vayBsaWtlIGEgZ2VuZXJhdGVkIG9uZS5cbiAgICAgKiBAcGFyYW0gaWQgaWRcbiAgICAgKiBAcmV0dXJuIHdldGhlciBJRCB3YXMgZXhwbGljaXRseSBzZXQgKHZpYSBpMThuPVwiQG15aWQpLlxuICAgICAqL1xuICAgIHByaXZhdGUgaXNFeHBsaWNpdGx5U2V0SWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoaXNOdWxsT3JVbmRlZmluZWQoaWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZ2VuZXJhdGVkIElEcyBhcmUgZWl0aGVyIGRlY2ltYWwgb3Igc2hhMSBoZXhcbiAgICAgICAgY29uc3QgcmVGb3JHZW5lcmF0ZWRJZCA9IC9eWzAtOWEtZl17MTEsfSQvO1xuICAgICAgICByZXR1cm4gIXJlRm9yR2VuZXJhdGVkSWQudGVzdChpZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29udmVydCBsaXN0IG9mIHJlbGV2YW50IFRVcyB0byBuZ3ggdHJhbnNsYXRpb25zIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gbXNnTGlzdCBtc2dMaXN0XG4gICAgICovXG4gICAgcHJpdmF0ZSB0b05neFRyYW5zbGF0aW9ucyhtc2dMaXN0OiBOZ3hNZXNzYWdlW10pOiBOZ3hUcmFuc2xhdGlvbnMge1xuICAgICAgICBjb25zdCB0cmFuc2xhdGlvbk9iamVjdDogTmd4VHJhbnNsYXRpb25zID0ge307XG4gICAgICAgIG1zZ0xpc3QuZm9yRWFjaCgobXNnOiBOZ3hNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnB1dEluVHJhbnNsYXRpb25PYmplY3QodHJhbnNsYXRpb25PYmplY3QsIG1zZyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdHJhbnNsYXRpb25PYmplY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHV0IGEgbmV3IG1lc3NhZ2VzIGludG8gdGhlIHRyYW5zbGF0aW9uIGRhdGEgb2JqZWN0LlxuICAgICAqIElmIHlvdSBhZGQsIGUuZy4gXCJ7aWQ6ICdteWFwcC5leGFtcGxlJywgbWVzc2FnZTogJ3Rlc3QnfVwiLFxuICAgICAqIHRoZSB0cmFuc2xhdGlvbiBvYmplY3Qgd2lsbCB0aGVuIGNvbnRhaW4gYW4gb2JqZWN0IG15YXBwIHRoYXQgaGFzIHByb3BlcnR5IGV4YW1wbGU6XG4gICAgICoge215YXBwOiB7XG4gICAgICogICBleGFtcGxlOiAndGVzdCdcbiAgICAgKiAgIH19XG4gICAgICogQHBhcmFtIHRyYW5zbGF0aW9uT2JqZWN0IHRyYW5zbGF0aW9uT2JqZWN0XG4gICAgICogQHBhcmFtIG1zZyBtc2dcbiAgICAgKi9cbiAgICBwcml2YXRlIHB1dEluVHJhbnNsYXRpb25PYmplY3QodHJhbnNsYXRpb25PYmplY3Q6IE5neFRyYW5zbGF0aW9ucywgbXNnOiBOZ3hNZXNzYWdlKSB7XG4gICAgICAgIGxldCBmaXJzdFBhcnRPZklkOiBzdHJpbmc7XG4gICAgICAgIGxldCByZXN0T2ZJZDogc3RyaW5nO1xuICAgICAgICBjb25zdCBpbmRleE9mRG90ID0gbXNnLmlkLmluZGV4T2YoJy4nKTtcbiAgICAgICAgaWYgKGluZGV4T2ZEb3QgPT09IDAgfHwgaW5kZXhPZkRvdCA9PT0gKG1zZy5pZC5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdiYWQgbnhnLXRyYW5zbGF0ZSBpZCBcIicgKyBtc2cuaWQgKyAnXCInKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5kZXhPZkRvdCA8IDApIHtcbiAgICAgICAgICAgIGZpcnN0UGFydE9mSWQgPSBtc2cuaWQ7XG4gICAgICAgICAgICByZXN0T2ZJZCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlyc3RQYXJ0T2ZJZCA9IG1zZy5pZC5zdWJzdHJpbmcoMCwgaW5kZXhPZkRvdCk7XG4gICAgICAgICAgICByZXN0T2ZJZCA9IG1zZy5pZC5zdWJzdHJpbmcoaW5kZXhPZkRvdCArIDEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvYmplY3QgPSB0cmFuc2xhdGlvbk9iamVjdFtmaXJzdFBhcnRPZklkXTtcbiAgICAgICAgaWYgKGlzTnVsbE9yVW5kZWZpbmVkKG9iamVjdCkpIHtcbiAgICAgICAgICAgIGlmIChyZXN0T2ZJZCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGlvbk9iamVjdFtmaXJzdFBhcnRPZklkXSA9IG1zZy5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9iamVjdCA9IHt9O1xuICAgICAgICAgICAgdHJhbnNsYXRpb25PYmplY3RbZmlyc3RQYXJ0T2ZJZF0gPSBvYmplY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAocmVzdE9mSWQgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdkdXBsaWNhdGUgaWQgcHJhZWZpeCBcIicgKyBtc2cuaWQgKyAnXCInKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1dEluVHJhbnNsYXRpb25PYmplY3QoPE5neFRyYW5zbGF0aW9ucz4gb2JqZWN0LCB7aWQ6IHJlc3RPZklkLCBtZXNzYWdlOiBtc2cubWVzc2FnZX0pO1xuICAgIH1cbn1cbiJdfQ==