/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Helper class to parse ngx translate extraction pattern
 * and to decide wether a given message matches the pattern.
 */
var /**
 * Helper class to parse ngx translate extraction pattern
 * and to decide wether a given message matches the pattern.
 */
NgxTranslateExtractionPattern = /** @class */ (function () {
    /**
     * Construct the pattern from given description string
     * @param extractionPatternString extractionPatternString
     * @throws an error, if there is a syntax error
     */
    function NgxTranslateExtractionPattern(extractionPatternString) {
        this.extractionPatternString = extractionPatternString;
        /** @type {?} */
        var parts = extractionPatternString.split('|');
        this._matchExplicitId = false;
        this._descriptionPatterns = [];
        for (var i = 0; i < parts.length; i++) {
            /** @type {?} */
            var part = parts[i];
            if (part === '@@') {
                if (this._matchExplicitId) {
                    throw new Error('extraction pattern must not contain @@ twice');
                }
                this._matchExplicitId = true;
            }
            else {
                /** @type {?} */
                var errorString = this.checkValidDescriptionPattern(part);
                if (errorString) {
                    throw new Error(errorString);
                }
                this._descriptionPatterns.push(part);
            }
        }
    }
    /**
     * Check, wether an explicitly set id matches the pattern.
     * @param id id
     * @return wether an explicitly set id matches the pattern.
     */
    /**
     * Check, wether an explicitly set id matches the pattern.
     * @param {?} id id
     * @return {?} wether an explicitly set id matches the pattern.
     */
    NgxTranslateExtractionPattern.prototype.isExplicitIdMatched = /**
     * Check, wether an explicitly set id matches the pattern.
     * @param {?} id id
     * @return {?} wether an explicitly set id matches the pattern.
     */
    function (id) {
        return id && this._matchExplicitId;
    };
    /**
     * Check, wether a given description matches the pattern.
     * @param description description
     * @return wether a given description matches the pattern.
     */
    /**
     * Check, wether a given description matches the pattern.
     * @param {?} description description
     * @return {?} wether a given description matches the pattern.
     */
    NgxTranslateExtractionPattern.prototype.isDescriptionMatched = /**
     * Check, wether a given description matches the pattern.
     * @param {?} description description
     * @return {?} wether a given description matches the pattern.
     */
    function (description) {
        return this._descriptionPatterns.indexOf(description) >= 0;
    };
    /**
     * @private
     * @param {?} descriptionPattern
     * @return {?}
     */
    NgxTranslateExtractionPattern.prototype.checkValidDescriptionPattern = /**
     * @private
     * @param {?} descriptionPattern
     * @return {?}
     */
    function (descriptionPattern) {
        if (!descriptionPattern) {
            return 'empty value not allowed';
        }
        if (/^[a-zA-Z_][a-zA-Z_-]*$/.test(descriptionPattern)) {
            return null; // it is ok
        }
        else {
            return 'description pattern must be an identifier containing only letters, digits, _ or -';
        }
    };
    return NgxTranslateExtractionPattern;
}());
/**
 * Helper class to parse ngx translate extraction pattern
 * and to decide wether a given message matches the pattern.
 */
export { NgxTranslateExtractionPattern };
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgxTranslateExtractionPattern.prototype._matchExplicitId;
    /**
     * @type {?}
     * @private
     */
    NgxTranslateExtractionPattern.prototype._descriptionPatterns;
    /**
     * @type {?}
     * @private
     */
    NgxTranslateExtractionPattern.prototype.extractionPatternString;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRyYW5zbGF0ZS1leHRyYWN0aW9uLXBhdHRlcm4uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbInhsaWZmbWVyZ2Uvbmd4LXRyYW5zbGF0ZS1leHRyYWN0aW9uLXBhdHRlcm4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFJQTs7Ozs7SUFLSTs7OztPQUlHO0lBQ0gsdUNBQW9CLHVCQUErQjtRQUEvQiw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQVE7O1lBQ3pDLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ2hELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQztRQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7Z0JBQzdCLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDZixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO2lCQUNuRTtnQkFDRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO2FBQ2hDO2lCQUFNOztvQkFDRyxXQUFXLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQztnQkFDM0QsSUFBSSxXQUFXLEVBQUU7b0JBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDaEM7Z0JBQ0QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4QztTQUNKO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7Ozs7OztJQUNJLDJEQUFtQjs7Ozs7SUFBMUIsVUFBMkIsRUFBVTtRQUNqQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7O09BSUc7Ozs7OztJQUNJLDREQUFvQjs7Ozs7SUFBM0IsVUFBNEIsV0FBbUI7UUFDM0MsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvRCxDQUFDOzs7Ozs7SUFFTyxvRUFBNEI7Ozs7O0lBQXBDLFVBQXFDLGtCQUEwQjtRQUMzRCxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDckIsT0FBTyx5QkFBeUIsQ0FBQztTQUNwQztRQUNELElBQUksd0JBQXdCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDbkQsT0FBTyxJQUFJLENBQUMsQ0FBQyxXQUFXO1NBQzNCO2FBQU07WUFDSCxPQUFPLG1GQUFtRixDQUFDO1NBQzlGO0lBQ0wsQ0FBQztJQUNMLG9DQUFDO0FBQUQsQ0FBQyxBQTNERCxJQTJEQzs7Ozs7Ozs7Ozs7SUF6REcseURBQWtDOzs7OztJQUNsQyw2REFBdUM7Ozs7O0lBTzNCLGdFQUF1QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSGVscGVyIGNsYXNzIHRvIHBhcnNlIG5neCB0cmFuc2xhdGUgZXh0cmFjdGlvbiBwYXR0ZXJuXG4gKiBhbmQgdG8gZGVjaWRlIHdldGhlciBhIGdpdmVuIG1lc3NhZ2UgbWF0Y2hlcyB0aGUgcGF0dGVybi5cbiAqL1xuZXhwb3J0IGNsYXNzIE5neFRyYW5zbGF0ZUV4dHJhY3Rpb25QYXR0ZXJuIHtcblxuICAgIHByaXZhdGUgX21hdGNoRXhwbGljaXRJZDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9kZXNjcmlwdGlvblBhdHRlcm5zOiBzdHJpbmdbXTtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdCB0aGUgcGF0dGVybiBmcm9tIGdpdmVuIGRlc2NyaXB0aW9uIHN0cmluZ1xuICAgICAqIEBwYXJhbSBleHRyYWN0aW9uUGF0dGVyblN0cmluZyBleHRyYWN0aW9uUGF0dGVyblN0cmluZ1xuICAgICAqIEB0aHJvd3MgYW4gZXJyb3IsIGlmIHRoZXJlIGlzIGEgc3ludGF4IGVycm9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBleHRyYWN0aW9uUGF0dGVyblN0cmluZzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gZXh0cmFjdGlvblBhdHRlcm5TdHJpbmcuc3BsaXQoJ3wnKTtcbiAgICAgICAgdGhpcy5fbWF0Y2hFeHBsaWNpdElkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0aW9uUGF0dGVybnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGFydCA9IHBhcnRzW2ldO1xuICAgICAgICAgICAgaWYgKHBhcnQgPT09ICdAQCcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF0Y2hFeHBsaWNpdElkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZXh0cmFjdGlvbiBwYXR0ZXJuIG11c3Qgbm90IGNvbnRhaW4gQEAgdHdpY2UnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0Y2hFeHBsaWNpdElkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JTdHJpbmcgPSB0aGlzLmNoZWNrVmFsaWREZXNjcmlwdGlvblBhdHRlcm4ocGFydCk7XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yU3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvclN0cmluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0aW9uUGF0dGVybnMucHVzaChwYXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrLCB3ZXRoZXIgYW4gZXhwbGljaXRseSBzZXQgaWQgbWF0Y2hlcyB0aGUgcGF0dGVybi5cbiAgICAgKiBAcGFyYW0gaWQgaWRcbiAgICAgKiBAcmV0dXJuIHdldGhlciBhbiBleHBsaWNpdGx5IHNldCBpZCBtYXRjaGVzIHRoZSBwYXR0ZXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc0V4cGxpY2l0SWRNYXRjaGVkKGlkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGlkICYmIHRoaXMuX21hdGNoRXhwbGljaXRJZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVjaywgd2V0aGVyIGEgZ2l2ZW4gZGVzY3JpcHRpb24gbWF0Y2hlcyB0aGUgcGF0dGVybi5cbiAgICAgKiBAcGFyYW0gZGVzY3JpcHRpb24gZGVzY3JpcHRpb25cbiAgICAgKiBAcmV0dXJuIHdldGhlciBhIGdpdmVuIGRlc2NyaXB0aW9uIG1hdGNoZXMgdGhlIHBhdHRlcm4uXG4gICAgICovXG4gICAgcHVibGljIGlzRGVzY3JpcHRpb25NYXRjaGVkKGRlc2NyaXB0aW9uOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uUGF0dGVybnMuaW5kZXhPZihkZXNjcmlwdGlvbikgPj0gMDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrVmFsaWREZXNjcmlwdGlvblBhdHRlcm4oZGVzY3JpcHRpb25QYXR0ZXJuOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBpZiAoIWRlc2NyaXB0aW9uUGF0dGVybikge1xuICAgICAgICAgICAgcmV0dXJuICdlbXB0eSB2YWx1ZSBub3QgYWxsb3dlZCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKC9eW2EtekEtWl9dW2EtekEtWl8tXSokLy50ZXN0KGRlc2NyaXB0aW9uUGF0dGVybikpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyBpdCBpcyBva1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICdkZXNjcmlwdGlvbiBwYXR0ZXJuIG11c3QgYmUgYW4gaWRlbnRpZmllciBjb250YWluaW5nIG9ubHkgbGV0dGVycywgZGlnaXRzLCBfIG9yIC0nO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19