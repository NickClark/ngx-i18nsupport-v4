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
        var allRequests = this.splitMessagesToGoogleLimit(messages).map((/**
         * @param {?} partialMessages
         * @return {?}
         */
        function (partialMessages) {
            return _this.limitedTranslateMultipleStrings(partialMessages, from, to);
        }));
        return forkJoin(allRequests).pipe(map((/**
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
        return this.post(realUrl, options).pipe(map((/**
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
                        throw new Error(format('Translation from "%s" to "%s" not supported', from, to));
                    }
                    throw new Error(format('Invalid request: %s', body.error.message));
                }
                else {
                    throw new Error(format('Error %s: %s', body.error.code, body.error.message));
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
        return (/** @type {?} */ (Observable.create((/**
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
export { AutoTranslateService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by10cmFuc2xhdGUtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsiYXV0b3RyYW5zbGF0ZS9hdXRvLXRyYW5zbGF0ZS1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sS0FBSyxPQUFPLE1BQU0sU0FBUyxDQUFDO0FBQ25DLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEMsT0FBTyxFQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzlDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFXbkMsMkNBRUM7OztJQURHLDhDQUFlOzs7OztBQUduQixnQ0FHQzs7O0lBRkcscUNBQWlCOztJQUNqQixpQ0FBYTs7Ozs7QUFHakIsb0NBRUM7OztJQURHLDBDQUErQjs7Ozs7QUFHbkMsbUNBTUM7OztJQUxHLGlDQUFZOztJQUNaLHNDQUFlOztJQUNmLHNDQUFlOztJQUNmLHNDQUFnQjs7SUFDaEIscUNBQWU7Ozs7O0FBR25CLG1DQUlDOzs7SUFIRyxzREFBZ0M7O0lBQ2hDLHFDQUFlOztJQUNmLDhDQUF1Qjs7Ozs7QUFHM0IsdUNBRUM7OztJQURHLGdEQUFxQzs7Ozs7QUFHekMsc0NBR0M7OztJQUZHLDJDQUFrQzs7SUFDbEMsdUNBQVU7OztJQUdSLFlBQVksR0FBRyxHQUFHO0FBRXhCO0lBc0JJLDhCQUFZLE1BQWM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxxQ0FBcUMsQ0FBQztJQUMxRCxDQUFDO0lBcEJEOzs7O09BSUc7Ozs7OztJ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QUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUMsRUFBQTs7Ozs7OztZQUN6RixVQUFrQixLQUFVLEVBQUUsUUFBaUMsRUFBRSxJQUFTO2dCQUN0RSxJQUFJLEtBQUssRUFBRTtvQkFDUCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hDO2dCQUVELFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQTBCLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO29CQUN0RCxRQUFRLEVBQUUsbUJBQTBCLFFBQVEsRUFBQTtvQkFDNUMsSUFBSSxFQUFFLG1CQUFNLElBQUksRUFBQTtpQkFDbkIsQ0FBQyxFQUFBLENBQUMsQ0FBQztnQkFDSixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFDO1lBRU4sdUJBQXVCO1lBQ3ZCLElBQUk7Z0JBQ0EsS0FBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBUyxNQUFNLEVBQUEsQ0FBQyxDQUFDLEtBQUssQ0FDaEMsbUJBRXlCLEtBQUksQ0FBQyxRQUFRLEVBQUEsRUFDdEMsTUFBTSxDQUFDLENBQUM7YUFDZjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNaLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekI7UUFDTCxDQUFDLEVBQUMsRUFBQSxDQUFDO0lBQ1AsQ0FBQztJQUNMLDJCQUFDO0FBQUQsQ0FBQyxBQTFMRCxJQTBMQzs7Ozs7OztJQXhMRyx3Q0FBbUc7O0lBQ25HLHdDQUFpQjs7SUFDakIsdUNBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0ICogYXMgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge29mLCBmb3JrSm9pbiwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgcm9vYm0gb24gMDMuMDcuMjAxNy5cbiAqIExvdyBMZXZlbCBTZXJ2aWNlIHRvIGNhbGwgR29vZ2xlIFRyYW5zbGF0ZS5cbiAqL1xuXG4vKipcbiAqIFR5cGVzIGZvcm0gZ29vZ2xlIHRyYW5zbGF0ZSBhcGkuXG4gKi9cblxuaW50ZXJmYWNlIEdldFN1cHBvcnRlZExhbmd1YWdlc1JlcXVlc3Qge1xuICAgIHRhcmdldDogc3RyaW5nOyAvLyBUaGUgbGFuZ3VhZ2UgdG8gdXNlIHRvIHJldHVybiBsb2NhbGl6ZWQsIGh1bWFuIHJlYWRhYmxlIG5hbWVzIG9mIHN1cHBvcnRlZFxcbmxhbmd1YWdlcy5cbn1cblxuaW50ZXJmYWNlIExhbmd1YWdlc1Jlc291cmNlIHtcbiAgICBsYW5ndWFnZTogc3RyaW5nOyAvLyBjb2RlIG9mIHRoZSBsYW5ndWFnZVxuICAgIG5hbWU6IHN0cmluZzsgLy8gaHVtYW4gcmVhZGFibGUgbmFtZSAoaW4gdGFyZ2V0IGxhbmd1YWdlKVxufVxuXG5pbnRlcmZhY2UgTGFuZ3VhZ2VzTGlzdFJlc3BvbnNlIHtcbiAgICBsYW5ndWFnZXM6IExhbmd1YWdlc1Jlc291cmNlW107XG59XG5cbmludGVyZmFjZSBUcmFuc2xhdGVUZXh0UmVxdWVzdCB7XG4gICAgcTogc3RyaW5nW107ICAvLyBUaGUgaW5wdXQgdGV4dHMgdG8gdHJhbnNsYXRlXG4gICAgdGFyZ2V0OiBzdHJpbmc7IC8vIFRoZSBsYW5ndWFnZSB0byB1c2UgZm9yIHRyYW5zbGF0aW9uIG9mIHRoZSBpbnB1dCB0ZXh0XG4gICAgc291cmNlOiBzdHJpbmc7IC8vIFRoZSBsYW5ndWFnZSBvZiB0aGUgc291cmNlIHRleHRcbiAgICBmb3JtYXQ/OiBzdHJpbmc7IC8vIFwiaHRtbFwiIChkZWZhdWx0KSBvciBcInRleHRcIlxuICAgIG1vZGVsPzogc3RyaW5nOyAvLyBzZWUgcHVibGljIGRvY3VtZW50YXRpb25cbn1cblxuaW50ZXJmYWNlIFRyYW5zbGF0aW9uc1Jlc291cmNlIHtcbiAgICBkZXRlY3RlZFNvdXJjZUxhbmd1YWdlPzogc3RyaW5nO1xuICAgIG1vZGVsPzogc3RyaW5nO1xuICAgIHRyYW5zbGF0ZWRUZXh0OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBUcmFuc2xhdGlvbnNMaXN0UmVzcG9uc2Uge1xuICAgIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25zUmVzb3VyY2VbXTtcbn1cblxuaW50ZXJmYWNlIEludGVybmFsUmVxdWVzdFJlc3BvbnNlIHtcbiAgICByZXNwb25zZTogcmVxdWVzdC5SZXF1ZXN0UmVzcG9uc2U7XG4gICAgYm9keTogYW55O1xufVxuXG5jb25zdCBNQVhfU0VHTUVOVFMgPSAxMjg7XG5cbmV4cG9ydCBjbGFzcyBBdXRvVHJhbnNsYXRlU2VydmljZSB7XG5cbiAgICBwcml2YXRlIF9yZXF1ZXN0OiByZXF1ZXN0LlJlcXVlc3RBUEk8cmVxdWVzdC5SZXF1ZXN0LCByZXF1ZXN0LkNvcmVPcHRpb25zLCByZXF1ZXN0LlJlcXVpcmVkVXJpVXJsPjtcbiAgICBfcm9vdFVybDogc3RyaW5nO1xuICAgIF9hcGlLZXk6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFN0cmlwIHJlZ2lvbiBjb2RlIGFuZCBjb252ZXJ0IHRvIGxvd2VyXG4gICAgICogQHBhcmFtIGxhbmcgbGFuZ1xuICAgICAqIEByZXR1cm4gbGFuZyB3aXRob3V0IHJlZ2lvbiBjb2RlIGFuZCBpbiBsb3dlciBjYXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc3RyaXBSZWdpb25jb2RlKGxhbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGxhbmdMb3dlciA9IGxhbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYW5nTG93ZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGMgPSBsYW5nTG93ZXIuY2hhckF0KGkpO1xuICAgICAgICAgICAgaWYgKGMgPCAnYScgfHwgYyA+ICd6Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBsYW5nTG93ZXIuc3Vic3RyaW5nKDAsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsYW5nTG93ZXI7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoYXBpS2V5OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fcmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAgIHRoaXMuX2FwaUtleSA9IGFwaUtleTtcbiAgICAgICAgdGhpcy5fcm9vdFVybCA9ICdodHRwczovL3RyYW5zbGF0aW9uLmdvb2dsZWFwaXMuY29tLyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIEFQSSBrZXkgKGp1c3QgZm9yIHRlc3RzKS5cbiAgICAgKiBAcGFyYW0gYXBpa2V5IGFwaWtleVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRBcGlLZXkoYXBpa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fYXBpS2V5ID0gYXBpa2V5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zbGF0ZSBhbiBhcnJheSBvZiBtZXNzYWdlcyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSBtZXNzYWdlcyB0aGUgbWVzc2FnZXMgdG8gYmUgdHJhbnNsYXRlZFxuICAgICAqIEBwYXJhbSBmcm9tIHNvdXJjZSBsYW5ndWFnZSBjb2RlXG4gICAgICogQHBhcmFtIHRvIHRhcmdldCBsYW5ndWFnZSBjb2RlXG4gICAgICogQHJldHVybiBPYnNlcnZhYmxlIHdpdGggdHJhbnNsYXRlZCBtZXNzYWdlcyBvciBlcnJvclxuICAgICAqL1xuICAgIHB1YmxpYyB0cmFuc2xhdGVNdWx0aXBsZVN0cmluZ3MobWVzc2FnZXM6IHN0cmluZ1tdLCBmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBPYnNlcnZhYmxlPHN0cmluZ1tdPiB7XG4gICAgICAgIC8vIGVtcHR5IGFycmF5IG5lZWRzIG5vIHRyYW5zbGF0aW9uIGFuZCBhbHdheXMgd29ya3MgLi4uICgjNzgpXG4gICAgICAgIGlmIChtZXNzYWdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvZihbXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9hcGlLZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdjYW5ub3QgYXV0b3RyYW5zbGF0ZTogbm8gYXBpIGtleScpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZnJvbSB8fCAhdG8pIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKCdjYW5ub3QgYXV0b3RyYW5zbGF0ZTogc291cmNlIGFuZCB0YXJnZXQgbGFuZ3VhZ2UgbXVzdCBiZSBzZXQnKTtcbiAgICAgICAgfVxuICAgICAgICBmcm9tID0gQXV0b1RyYW5zbGF0ZVNlcnZpY2Uuc3RyaXBSZWdpb25jb2RlKGZyb20pO1xuICAgICAgICB0byA9IEF1dG9UcmFuc2xhdGVTZXJ2aWNlLnN0cmlwUmVnaW9uY29kZSh0byk7XG4gICAgICAgIGNvbnN0IGFsbFJlcXVlc3RzOiBPYnNlcnZhYmxlPHN0cmluZ1tdPltdID0gdGhpcy5zcGxpdE1lc3NhZ2VzVG9Hb29nbGVMaW1pdChtZXNzYWdlcykubWFwKChwYXJ0aWFsTWVzc2FnZXM6IHN0cmluZ1tdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saW1pdGVkVHJhbnNsYXRlTXVsdGlwbGVTdHJpbmdzKHBhcnRpYWxNZXNzYWdlcywgZnJvbSwgdG8pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZvcmtKb2luKGFsbFJlcXVlc3RzKS5waXBlKFxuICAgICAgICAgICAgbWFwKChhbGxUcmFuc2xhdGlvbnM6IHN0cmluZ1tdW10pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYWxsID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxUcmFuc2xhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYWxsID0gYWxsLmNvbmNhdChhbGxUcmFuc2xhdGlvbnNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYWxsO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzcGxpdE1lc3NhZ2VzVG9Hb29nbGVMaW1pdChtZXNzYWdlczogc3RyaW5nW10pOiBzdHJpbmdbXVtdIHtcbiAgICAgICAgaWYgKG1lc3NhZ2VzLmxlbmd0aCA8PSBNQVhfU0VHTUVOVFMpIHtcbiAgICAgICAgICAgIHJldHVybiBbbWVzc2FnZXNdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsZXQgY3VycmVudFBhY2thZ2UgPSBbXTtcbiAgICAgICAgbGV0IHBhY2thZ2VTaXplID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFBhY2thZ2UucHVzaChtZXNzYWdlc1tpXSk7XG4gICAgICAgICAgICBwYWNrYWdlU2l6ZSsrO1xuICAgICAgICAgICAgaWYgKHBhY2thZ2VTaXplID49IE1BWF9TRUdNRU5UUykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGN1cnJlbnRQYWNrYWdlKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFja2FnZSA9IFtdO1xuICAgICAgICAgICAgICAgIHBhY2thZ2VTaXplID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudFBhY2thZ2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goY3VycmVudFBhY2thZ2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRyYW5zbGF0aW9uIHJlcXVlc3QsIGJ1dCBtZXNzYWdlcyBtdXN0IGJlIGxpbWl0ZWQgdG8gZ29vZ2xlIGxpbWl0cy5cbiAgICAgKiBOb3QgbW9yZSB0aGF0IDEyOCBzaW5nbGUgbWVzc2FnZXMuXG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIG1lc3NhZ2VzXG4gICAgICogQHBhcmFtIGZyb20gZnJvbVxuICAgICAqIEBwYXJhbSB0byB0b1xuICAgICAqIEByZXR1cm4gdGhlIHRyYW5zbGF0ZWQgc3RyaW5nc1xuICAgICAqL1xuICAgIHByaXZhdGUgbGltaXRlZFRyYW5zbGF0ZU11bHRpcGxlU3RyaW5ncyhtZXNzYWdlczogc3RyaW5nW10sIGZyb206IHN0cmluZywgdG86IHN0cmluZyk6IE9ic2VydmFibGU8c3RyaW5nW10+IHtcbiAgICAgICAgY29uc3QgcmVhbFVybCA9IHRoaXMuX3Jvb3RVcmwgKyAnbGFuZ3VhZ2UvdHJhbnNsYXRlL3YyJyArICc/a2V5PScgKyB0aGlzLl9hcGlLZXk7XG4gICAgICAgIGNvbnN0IHRyYW5zbGF0ZVJlcXVlc3Q6IFRyYW5zbGF0ZVRleHRSZXF1ZXN0ID0ge1xuICAgICAgICAgICAgcTogbWVzc2FnZXMsXG4gICAgICAgICAgICB0YXJnZXQ6IHRvLFxuICAgICAgICAgICAgc291cmNlOiBmcm9tLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgdXJsOiByZWFsVXJsLFxuICAgICAgICAgICAgYm9keTogdHJhbnNsYXRlUmVxdWVzdCxcbiAgICAgICAgICAgIGpzb246IHRydWUsXG4vLyAgICAgICAgICAgIHByb3h5OiAnaHR0cDovLzEyNy4wLjAuMTo4ODg4JyBUbyBzZXQgYSBwcm94eSB1c2UgZW52IHZhciBIVFRQU19QUk9YWVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcy5wb3N0KHJlYWxVcmwsIG9wdGlvbnMpLnBpcGUoXG4gICAgICAgICAgICBtYXAoKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJvZHk6IGFueSA9IGRhdGEuYm9keTtcbiAgICAgICAgICAgIGlmICghYm9keSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gcmVzdWx0IHJlY2VpdmVkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYm9keS5lcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChib2R5LmVycm9yLmNvZGUgPT09IDQwMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYm9keS5lcnJvci5tZXNzYWdlID09PSAnSW52YWxpZCBWYWx1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihmb3JtYXQoJ1RyYW5zbGF0aW9uIGZyb20gXCIlc1wiIHRvIFwiJXNcIiBub3Qgc3VwcG9ydGVkJywgZnJvbSwgdG8pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZm9ybWF0KCdJbnZhbGlkIHJlcXVlc3Q6ICVzJywgYm9keS5lcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdCgnRXJyb3IgJXM6ICVzJywgYm9keS5lcnJvci5jb2RlLCBib2R5LmVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBib2R5LmRhdGE7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnRyYW5zbGF0aW9ucy5tYXAoKHRyYW5zbGF0aW9uOiBUcmFuc2xhdGlvbnNSZXNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2xhdGlvbi50cmFuc2xhdGVkVGV4dDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gZG8gYSBQT1NUIEhUVFAgcmVxdWVzdFxuICAgICAqXG4gICAgICogQHBhcmFtIHVyaSB1cmlcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHJlc3BvbnNlXG4gICAgICovXG4gICAgcG9zdCh1cmk6IHN0cmluZywgb3B0aW9ucz86IHJlcXVlc3QuQ29yZU9wdGlvbnMpOiBPYnNlcnZhYmxlPEludGVybmFsUmVxdWVzdFJlc3BvbnNlPiB7XG4gICAgICAgIHJldHVybiA8T2JzZXJ2YWJsZTxJbnRlcm5hbFJlcXVlc3RSZXNwb25zZT4+IHRoaXMuX2NhbGwuYXBwbHkodGhpcywgW10uY29uY2F0KCdwb3N0JywgPHN0cmluZz4gdXJpLFxuICAgICAgICAgICAgPHJlcXVlc3QuQ29yZU9wdGlvbnM+IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMgfHwge30pKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdG8gZG8gYSBIVFRQIHJlcXVlc3QgZm9yIGdpdmVuIG1ldGhvZFxuICAgICAqXG4gICAgICogQHBhcmFtIG1ldGhvZCBtZXRob2RcbiAgICAgKiBAcGFyYW0gdXJpIHVyaVxuICAgICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEByZXR1cm4gcmVzcG9uc2VcbiAgICAgKlxuICAgICAqL1xuICAgIHByaXZhdGUgX2NhbGwobWV0aG9kOiBzdHJpbmcsIHVyaTogc3RyaW5nLCBvcHRpb25zPzogcmVxdWVzdC5Db3JlT3B0aW9ucyk6IE9ic2VydmFibGU8SW50ZXJuYWxSZXF1ZXN0UmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIDxPYnNlcnZhYmxlPEludGVybmFsUmVxdWVzdFJlc3BvbnNlPj4gT2JzZXJ2YWJsZS5jcmVhdGUoKG9ic2VydmVyKSA9PiB7XG4gICAgICAgICAgICAvLyBidWlsZCBwYXJhbXMgYXJyYXlcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IFtdLmNvbmNhdCg8c3RyaW5nPiB1cmksIDxyZXF1ZXN0LkNvcmVPcHRpb25zPiBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zIHx8IHt9KSxcbiAgICAgICAgICAgICAgICA8UmVxdWVzdENhbGxiYWNrPihlcnJvcjogYW55LCByZXNwb25zZTogcmVxdWVzdC5SZXF1ZXN0UmVzcG9uc2UsIGJvZHk6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYnNlcnZlci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KDxJbnRlcm5hbFJlcXVlc3RSZXNwb25zZT4gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U6IDxyZXF1ZXN0LlJlcXVlc3RSZXNwb25zZT4gcmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiA8YW55PiBib2R5XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gX2NhbGwgcmVxdWVzdCBtZXRob2RcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVxdWVzdFs8c3RyaW5nPiBtZXRob2RdLmFwcGx5KFxuICAgICAgICAgICAgICAgICAgICA8cmVxdWVzdC5SZXF1ZXN0QVBJPHJlcXVlc3QuUmVxdWVzdCxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5Db3JlT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5SZXF1aXJlZFVyaVVybD4+IHRoaXMuX3JlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19