/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { format } from 'util';
import * as request from 'request';
import { Observable } from 'rxjs';
import { of, forkJoin, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * Types form google translate api.
 * @record
 */
function GetSupportedLanguagesRequest() { }
if (false) {
    /** @type {?} */
    GetSupportedLanguagesRequest.prototype.target;
}
/**
 * @record
 */
function LanguagesResource() { }
if (false) {
    /** @type {?} */
    LanguagesResource.prototype.language;
    /** @type {?} */
    LanguagesResource.prototype.name;
}
/**
 * @record
 */
function LanguagesListResponse() { }
if (false) {
    /** @type {?} */
    LanguagesListResponse.prototype.languages;
}
/**
 * @record
 */
function TranslateTextRequest() { }
if (false) {
    /** @type {?} */
    TranslateTextRequest.prototype.q;
    /** @type {?} */
    TranslateTextRequest.prototype.target;
    /** @type {?} */
    TranslateTextRequest.prototype.source;
    /** @type {?|undefined} */
    TranslateTextRequest.prototype.format;
    /** @type {?|undefined} */
    TranslateTextRequest.prototype.model;
}
/**
 * @record
 */
function TranslationsResource() { }
if (false) {
    /** @type {?|undefined} */
    TranslationsResource.prototype.detectedSourceLanguage;
    /** @type {?|undefined} */
    TranslationsResource.prototype.model;
    /** @type {?} */
    TranslationsResource.prototype.translatedText;
}
/**
 * @record
 */
function TranslationsListResponse() { }
if (false) {
    /** @type {?} */
    TranslationsListResponse.prototype.translations;
}
/**
 * @record
 */
function InternalRequestResponse() { }
if (false) {
    /** @type {?} */
    InternalRequestResponse.prototype.response;
    /** @type {?} */
    InternalRequestResponse.prototype.body;
}
/** @type {?} */
const MAX_SEGMENTS = 128;
export class AutoTranslateService {
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
if (false) {
    /**
     * @type {?}
     * @private
     */
    AutoTranslateService.prototype._request;
    /** @type {?} */
    AutoTranslateService.prototype._rootUrl;
    /** @type {?} */
    AutoTranslateService.prototype._apiKey;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by10cmFuc2xhdGUtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsiYXV0b3RyYW5zbGF0ZS9hdXRvLXRyYW5zbGF0ZS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sS0FBSyxPQUFPLE1BQU0sU0FBUyxDQUFDO0FBQ25DLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFXbkMsMkNBRUM7OztJQURHLDhDQUFlOzs7OztBQUduQixnQ0FHQzs7O0lBRkcscUNBQWlCOztJQUNqQixpQ0FBYTs7Ozs7QUFHakIsb0NBRUM7OztJQURHLDBDQUErQjs7Ozs7QUFHbkMsbUNBTUM7OztJQUxHLGlDQUFZOztJQUNaLHNDQUFlOztJQUNmLHNDQUFlOztJQUNmLHNDQUFnQjs7SUFDaEIscUNBQWU7Ozs7O0FBR25CLG1DQUlDOzs7SUFIRyxzREFBZ0M7O0lBQ2hDLHFDQUFlOztJQUNmLDhDQUF1Qjs7Ozs7QUFHM0IsdUNBRUM7OztJQURHLGdEQUFxQzs7Ozs7QUFHekMsc0NBR0M7OztJQUZHLDJDQUFrQzs7SUFDbEMsdUNBQVU7OztNQUdSLFlBQVksR0FBRyxHQUFHO0FBRXhCLE1BQU0sT0FBTyxvQkFBb0I7Ozs7OztJQVd0QixNQUFNLENBQUMsZUFBZSxDQUFDLElBQVk7O2NBQ2hDLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ3BDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENB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LFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hDO2dCQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQTBCLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO29CQUN0RCxRQUFRLEVBQUUsbUJBQTBCLFFBQVEsRUFBQTtvQkFDNUMsSUFBSSxFQUFFLG1CQUFNLElBQUksRUFBQTtpQkFDbkIsQ0FBQyxFQUFBLENBQUMsQ0FBQztnQkFDSixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFDO1lBRU4sdUJBQXVCO1lBQ3ZCLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBUyxNQUFNLEVBQUEsQ0FBQyxDQUFDLEtBQUssQ0FDaEMsbUJBRXlCLElBQUksQ0FBQyxRQUFRLEVBQUEsRUFDdEMsTUFBTSxDQUFDLENBQUM7YUFDZjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNaLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekI7UUFDTCxDQUFDLEVBQUMsRUFBQSxDQUFDO0lBQ1AsQ0FBQztDQUNKOzs7Ozs7SUF4TEcsd0NBQW1HOztJQUNuRyx3Q0FBaUI7O0lBQ2pCLHVDQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Zm9ybWF0fSBmcm9tICd1dGlsJztcbmltcG9ydCAqIGFzIHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtvZiwgZm9ya0pvaW4sIHRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IHJvb2JtIG9uIDAzLjA3LjIwMTcuXG4gKiBMb3cgTGV2ZWwgU2VydmljZSB0byBjYWxsIEdvb2dsZSBUcmFuc2xhdGUuXG4gKi9cblxuLyoqXG4gKiBUeXBlcyBmb3JtIGdvb2dsZSB0cmFuc2xhdGUgYXBpLlxuICovXG5cbmludGVyZmFjZSBHZXRTdXBwb3J0ZWRMYW5ndWFnZXNSZXF1ZXN0IHtcbiAgICB0YXJnZXQ6IHN0cmluZzsgLy8gVGhlIGxhbmd1YWdlIHRvIHVzZSB0byByZXR1cm4gbG9jYWxpemVkLCBodW1hbiByZWFkYWJsZSBuYW1lcyBvZiBzdXBwb3J0ZWRcXG5sYW5ndWFnZXMuXG59XG5cbmludGVyZmFjZSBMYW5ndWFnZXNSZXNvdXJjZSB7XG4gICAgbGFuZ3VhZ2U6IHN0cmluZzsgLy8gY29kZSBvZiB0aGUgbGFuZ3VhZ2VcbiAgICBuYW1lOiBzdHJpbmc7IC8vIGh1bWFuIHJlYWRhYmxlIG5hbWUgKGluIHRhcmdldCBsYW5ndWFnZSlcbn1cblxuaW50ZXJmYWNlIExhbmd1YWdlc0xpc3RSZXNwb25zZSB7XG4gICAgbGFuZ3VhZ2VzOiBMYW5ndWFnZXNSZXNvdXJjZVtdO1xufVxuXG5pbnRlcmZhY2UgVHJhbnNsYXRlVGV4dFJlcXVlc3Qge1xuICAgIHE6IHN0cmluZ1tdOyAgLy8gVGhlIGlucHV0IHRleHRzIHRvIHRyYW5zbGF0ZVxuICAgIHRhcmdldDogc3RyaW5nOyAvLyBUaGUgbGFuZ3VhZ2UgdG8gdXNlIGZvciB0cmFuc2xhdGlvbiBvZiB0aGUgaW5wdXQgdGV4dFxuICAgIHNvdXJjZTogc3RyaW5nOyAvLyBUaGUgbGFuZ3VhZ2Ugb2YgdGhlIHNvdXJjZSB0ZXh0XG4gICAgZm9ybWF0Pzogc3RyaW5nOyAvLyBcImh0bWxcIiAoZGVmYXVsdCkgb3IgXCJ0ZXh0XCJcbiAgICBtb2RlbD86IHN0cmluZzsgLy8gc2VlIHB1YmxpYyBkb2N1bWVudGF0aW9uXG59XG5cbmludGVyZmFjZSBUcmFuc2xhdGlvbnNSZXNvdXJjZSB7XG4gICAgZGV0ZWN0ZWRTb3VyY2VMYW5ndWFnZT86IHN0cmluZztcbiAgICBtb2RlbD86IHN0cmluZztcbiAgICB0cmFuc2xhdGVkVGV4dDogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgVHJhbnNsYXRpb25zTGlzdFJlc3BvbnNlIHtcbiAgICB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uc1Jlc291cmNlW107XG59XG5cbmludGVyZmFjZSBJbnRlcm5hbFJlcXVlc3RSZXNwb25zZSB7XG4gICAgcmVzcG9uc2U6IHJlcXVlc3QuUmVxdWVzdFJlc3BvbnNlO1xuICAgIGJvZHk6IGFueTtcbn1cblxuY29uc3QgTUFYX1NFR01FTlRTID0gMTI4O1xuXG5leHBvcnQgY2xhc3MgQXV0b1RyYW5zbGF0ZVNlcnZpY2Uge1xuXG4gICAgcHJpdmF0ZSBfcmVxdWVzdDogcmVxdWVzdC5SZXF1ZXN0QVBJPHJlcXVlc3QuUmVxdWVzdCwgcmVxdWVzdC5Db3JlT3B0aW9ucywgcmVxdWVzdC5SZXF1aXJlZFVyaVVybD47XG4gICAgX3Jvb3RVcmw6IHN0cmluZztcbiAgICBfYXBpS2V5OiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBTdHJpcCByZWdpb24gY29kZSBhbmQgY29udmVydCB0byBsb3dlclxuICAgICAqIEBwYXJhbSBsYW5nIGxhbmdcbiAgICAgKiBAcmV0dXJuIGxhbmcgd2l0aG91dCByZWdpb24gY29kZSBhbmQgaW4gbG93ZXIgY2FzZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHN0cmlwUmVnaW9uY29kZShsYW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBjb25zdCBsYW5nTG93ZXIgPSBsYW5nLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGFuZ0xvd2VyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjID0gbGFuZ0xvd2VyLmNoYXJBdChpKTtcbiAgICAgICAgICAgIGlmIChjIDwgJ2EnIHx8IGMgPiAneicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFuZ0xvd2VyLnN1YnN0cmluZygwLCBpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFuZ0xvd2VyO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGFwaUtleTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3JlcXVlc3QgPSByZXF1ZXN0O1xuICAgICAgICB0aGlzLl9hcGlLZXkgPSBhcGlLZXk7XG4gICAgICAgIHRoaXMuX3Jvb3RVcmwgPSAnaHR0cHM6Ly90cmFuc2xhdGlvbi5nb29nbGVhcGlzLmNvbS8nO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZSBBUEkga2V5IChqdXN0IGZvciB0ZXN0cykuXG4gICAgICogQHBhcmFtIGFwaWtleSBhcGlrZXlcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0QXBpS2V5KGFwaWtleTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2FwaUtleSA9IGFwaWtleTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmFuc2xhdGUgYW4gYXJyYXkgb2YgbWVzc2FnZXMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0gbWVzc2FnZXMgdGhlIG1lc3NhZ2VzIHRvIGJlIHRyYW5zbGF0ZWRcbiAgICAgKiBAcGFyYW0gZnJvbSBzb3VyY2UgbGFuZ3VhZ2UgY29kZVxuICAgICAqIEBwYXJhbSB0byB0YXJnZXQgbGFuZ3VhZ2UgY29kZVxuICAgICAqIEByZXR1cm4gT2JzZXJ2YWJsZSB3aXRoIHRyYW5zbGF0ZWQgbWVzc2FnZXMgb3IgZXJyb3JcbiAgICAgKi9cbiAgICBwdWJsaWMgdHJhbnNsYXRlTXVsdGlwbGVTdHJpbmdzKG1lc3NhZ2VzOiBzdHJpbmdbXSwgZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogT2JzZXJ2YWJsZTxzdHJpbmdbXT4ge1xuICAgICAgICAvLyBlbXB0eSBhcnJheSBuZWVkcyBubyB0cmFuc2xhdGlvbiBhbmQgYWx3YXlzIHdvcmtzIC4uLiAoIzc4KVxuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gb2YoW10pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fYXBpS2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcignY2Fubm90IGF1dG90cmFuc2xhdGU6IG5vIGFwaSBrZXknKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWZyb20gfHwgIXRvKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcignY2Fubm90IGF1dG90cmFuc2xhdGU6IHNvdXJjZSBhbmQgdGFyZ2V0IGxhbmd1YWdlIG11c3QgYmUgc2V0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgZnJvbSA9IEF1dG9UcmFuc2xhdGVTZXJ2aWNlLnN0cmlwUmVnaW9uY29kZShmcm9tKTtcbiAgICAgICAgdG8gPSBBdXRvVHJhbnNsYXRlU2VydmljZS5zdHJpcFJlZ2lvbmNvZGUodG8pO1xuICAgICAgICBjb25zdCBhbGxSZXF1ZXN0czogT2JzZXJ2YWJsZTxzdHJpbmdbXT5bXSA9IHRoaXMuc3BsaXRNZXNzYWdlc1RvR29vZ2xlTGltaXQobWVzc2FnZXMpLm1hcCgocGFydGlhbE1lc3NhZ2VzOiBzdHJpbmdbXSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGltaXRlZFRyYW5zbGF0ZU11bHRpcGxlU3RyaW5ncyhwYXJ0aWFsTWVzc2FnZXMsIGZyb20sIHRvKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmb3JrSm9pbihhbGxSZXF1ZXN0cykucGlwZShcbiAgICAgICAgICAgIG1hcCgoYWxsVHJhbnNsYXRpb25zOiBzdHJpbmdbXVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGFsbCA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsVHJhbnNsYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbCA9IGFsbC5jb25jYXQoYWxsVHJhbnNsYXRpb25zW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFsbDtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3BsaXRNZXNzYWdlc1RvR29vZ2xlTGltaXQobWVzc2FnZXM6IHN0cmluZ1tdKTogc3RyaW5nW11bXSB7XG4gICAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPD0gTUFYX1NFR01FTlRTKSB7XG4gICAgICAgICAgICByZXR1cm4gW21lc3NhZ2VzXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGV0IGN1cnJlbnRQYWNrYWdlID0gW107XG4gICAgICAgIGxldCBwYWNrYWdlU2l6ZSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRQYWNrYWdlLnB1c2gobWVzc2FnZXNbaV0pO1xuICAgICAgICAgICAgcGFja2FnZVNpemUrKztcbiAgICAgICAgICAgIGlmIChwYWNrYWdlU2l6ZSA+PSBNQVhfU0VHTUVOVFMpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjdXJyZW50UGFja2FnZSk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhY2thZ2UgPSBbXTtcbiAgICAgICAgICAgICAgICBwYWNrYWdlU2l6ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnJlbnRQYWNrYWdlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnRQYWNrYWdlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiB0cmFuc2xhdGlvbiByZXF1ZXN0LCBidXQgbWVzc2FnZXMgbXVzdCBiZSBsaW1pdGVkIHRvIGdvb2dsZSBsaW1pdHMuXG4gICAgICogTm90IG1vcmUgdGhhdCAxMjggc2luZ2xlIG1lc3NhZ2VzLlxuICAgICAqIEBwYXJhbSBtZXNzYWdlcyBtZXNzYWdlc1xuICAgICAqIEBwYXJhbSBmcm9tIGZyb21cbiAgICAgKiBAcGFyYW0gdG8gdG9cbiAgICAgKiBAcmV0dXJuIHRoZSB0cmFuc2xhdGVkIHN0cmluZ3NcbiAgICAgKi9cbiAgICBwcml2YXRlIGxpbWl0ZWRUcmFuc2xhdGVNdWx0aXBsZVN0cmluZ3MobWVzc2FnZXM6IHN0cmluZ1tdLCBmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZ1tdPiB7XG4gICAgICAgIGNvbnN0IHJlYWxVcmwgPSB0aGlzLl9yb290VXJsICsgJ2xhbmd1YWdlL3RyYW5zbGF0ZS92MicgKyAnP2tleT0nICsgdGhpcy5fYXBpS2V5O1xuICAgICAgICBjb25zdCB0cmFuc2xhdGVSZXF1ZXN0OiBUcmFuc2xhdGVUZXh0UmVxdWVzdCA9IHtcbiAgICAgICAgICAgIHE6IG1lc3NhZ2VzLFxuICAgICAgICAgICAgdGFyZ2V0OiB0byxcbiAgICAgICAgICAgIHNvdXJjZTogZnJvbSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHVybDogcmVhbFVybCxcbiAgICAgICAgICAgIGJvZHk6IHRyYW5zbGF0ZVJlcXVlc3QsXG4gICAgICAgICAgICBqc29uOiB0cnVlLFxuLy8gICAgICAgICAgICBwcm94eTogJ2h0dHA6Ly8xMjcuMC4wLjE6ODg4OCcgVG8gc2V0IGEgcHJveHkgdXNlIGVudiB2YXIgSFRUUFNfUFJPWFlcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zdChyZWFsVXJsLCBvcHRpb25zKS5waXBlKFxuICAgICAgICAgICAgbWFwKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBib2R5OiBhbnkgPSBkYXRhLmJvZHk7XG4gICAgICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHJlc3VsdCByZWNlaXZlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJvZHkuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoYm9keS5lcnJvci5jb2RlID09PSA0MDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvZHkuZXJyb3IubWVzc2FnZSA9PT0gJ0ludmFsaWQgVmFsdWUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZm9ybWF0KCdUcmFuc2xhdGlvbiBmcm9tIFwiJXNcIiB0byBcIiVzXCIgbm90IHN1cHBvcnRlZCcsIGZyb20sIHRvKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdCgnSW52YWxpZCByZXF1ZXN0OiAlcycsIGJvZHkuZXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoJ0Vycm9yICVzOiAlcycsIGJvZHkuZXJyb3IuY29kZSwgYm9keS5lcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYm9keS5kYXRhO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50cmFuc2xhdGlvbnMubWFwKCh0cmFuc2xhdGlvbjogVHJhbnNsYXRpb25zUmVzb3VyY2UpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNsYXRpb24udHJhbnNsYXRlZFRleHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIGRvIGEgUE9TVCBIVFRQIHJlcXVlc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSB1cmkgdXJpXG4gICAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHJldHVybiByZXNwb25zZVxuICAgICAqL1xuICAgIHBvc3QodXJpOiBzdHJpbmcsIG9wdGlvbnM/OiByZXF1ZXN0LkNvcmVPcHRpb25zKTogT2JzZXJ2YWJsZTxJbnRlcm5hbFJlcXVlc3RSZXNwb25zZT4ge1xuICAgICAgICByZXR1cm4gPE9ic2VydmFibGU8SW50ZXJuYWxSZXF1ZXN0UmVzcG9uc2U+PiB0aGlzLl9jYWxsLmFwcGx5KHRoaXMsIFtdLmNvbmNhdCgncG9zdCcsIDxzdHJpbmc+IHVyaSxcbiAgICAgICAgICAgIDxyZXF1ZXN0LkNvcmVPcHRpb25zPiBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zIHx8IHt9KSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRvIGRvIGEgSFRUUCByZXF1ZXN0IGZvciBnaXZlbiBtZXRob2RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBtZXRob2QgbWV0aG9kXG4gICAgICogQHBhcmFtIHVyaSB1cmlcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHJlc3BvbnNlXG4gICAgICpcbiAgICAgKi9cbiAgICBwcml2YXRlIF9jYWxsKG1ldGhvZDogc3RyaW5nLCB1cmk6IHN0cmluZywgb3B0aW9ucz86IHJlcXVlc3QuQ29yZU9wdGlvbnMpOiBPYnNlcnZhYmxlPEludGVybmFsUmVxdWVzdFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiA8T2JzZXJ2YWJsZTxJbnRlcm5hbFJlcXVlc3RSZXNwb25zZT4+IE9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcikgPT4ge1xuICAgICAgICAgICAgLy8gYnVpbGQgcGFyYW1zIGFycmF5XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBbXS5jb25jYXQoPHN0cmluZz4gdXJpLCA8cmVxdWVzdC5Db3JlT3B0aW9ucz4gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyB8fCB7fSksXG4gICAgICAgICAgICAgICAgPFJlcXVlc3RDYWxsYmFjaz4oZXJyb3I6IGFueSwgcmVzcG9uc2U6IHJlcXVlc3QuUmVxdWVzdFJlc3BvbnNlLCBib2R5OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCg8SW50ZXJuYWxSZXF1ZXN0UmVzcG9uc2U+IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiA8cmVxdWVzdC5SZXF1ZXN0UmVzcG9uc2U+IHJlc3BvbnNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogPGFueT4gYm9keVxuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIF9jYWxsIHJlcXVlc3QgbWV0aG9kXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlcXVlc3RbPHN0cmluZz4gbWV0aG9kXS5hcHBseShcbiAgICAgICAgICAgICAgICAgICAgPHJlcXVlc3QuUmVxdWVzdEFQSTxyZXF1ZXN0LlJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuQ29yZU9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3QuUmVxdWlyZWRVcmlVcmw+PiB0aGlzLl9yZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==