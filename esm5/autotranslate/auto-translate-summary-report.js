/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { format } from 'util';
/**
 * A report about a run of Google Translate over all untranslated unit.
 * * Created by martin on 29.06.2017.
 */
var /**
 * A report about a run of Google Translate over all untranslated unit.
 * * Created by martin on 29.06.2017.
 */
AutoTranslateSummaryReport = /** @class */ (function () {
    function AutoTranslateSummaryReport(from, to) {
        this._from = from;
        this._to = to;
        this._total = 0;
        this._ignored = 0;
        this._success = 0;
        this._failed = 0;
    }
    /**
     * Set error if total call failed (e.g. "invalid api key" or "no connection" ...)
     * @param error error
     * @param total total
     */
    /**
     * Set error if total call failed (e.g. "invalid api key" or "no connection" ...)
     * @param {?} error error
     * @param {?} total total
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.setError = /**
     * Set error if total call failed (e.g. "invalid api key" or "no connection" ...)
     * @param {?} error error
     * @param {?} total total
     * @return {?}
     */
    function (error, total) {
        this._error = error;
        this._total = total;
        this._failed = total;
    };
    /**
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.error = /**
     * @return {?}
     */
    function () {
        return this._error;
    };
    /**
     * @param {?} ignored
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.setIgnored = /**
     * @param {?} ignored
     * @return {?}
     */
    function (ignored) {
        this._total += ignored;
        this._ignored = ignored;
    };
    /**
     * Add a single result to the summary.
     * @param tu tu
     * @param result result
     */
    /**
     * Add a single result to the summary.
     * @param {?} tu tu
     * @param {?} result result
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.addSingleResult = /**
     * Add a single result to the summary.
     * @param {?} tu tu
     * @param {?} result result
     * @return {?}
     */
    function (tu, result) {
        this._total++;
        if (result.success()) {
            this._success++;
        }
        else {
            this._failed++;
        }
    };
    /**
     * Merge another summary into this one.
     * @param anotherSummary anotherSummary
     */
    /**
     * Merge another summary into this one.
     * @param {?} anotherSummary anotherSummary
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.merge = /**
     * Merge another summary into this one.
     * @param {?} anotherSummary anotherSummary
     * @return {?}
     */
    function (anotherSummary) {
        if (!this._error) {
            this._error = anotherSummary._error;
        }
        this._total += anotherSummary.total();
        this._ignored += anotherSummary.ignored();
        this._success += anotherSummary.success();
        this._failed += anotherSummary.failed();
    };
    /**
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.total = /**
     * @return {?}
     */
    function () {
        return this._total;
    };
    /**
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.ignored = /**
     * @return {?}
     */
    function () {
        return this._ignored;
    };
    /**
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.success = /**
     * @return {?}
     */
    function () {
        return this._success;
    };
    /**
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.failed = /**
     * @return {?}
     */
    function () {
        return this._failed;
    };
    /**
     * Human readable version of report
     */
    /**
     * Human readable version of report
     * @return {?}
     */
    AutoTranslateSummaryReport.prototype.content = /**
     * Human readable version of report
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result;
        if (this._error) {
            result = format('Auto translation from "%s" to "%s" failed: "%s", failed units: %s', this._from, this._to, this._error, this._failed);
        }
        else {
            result = format('Auto translation from "%s" to "%s", total auto translated units: %s, ignored: %s, succesful: %s, failed: %s', this._from, this._to, this._total, this._ignored, this._success, this._failed);
        }
        return result;
    };
    return AutoTranslateSummaryReport;
}());
/**
 * A report about a run of Google Translate over all untranslated unit.
 * * Created by martin on 29.06.2017.
 */
export { AutoTranslateSummaryReport };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AutoTranslateSummaryReport.prototype._error;
    /**
     * @type {?}
     * @private
     */
    AutoTranslateSummaryReport.prototype._from;
    /**
     * @type {?}
     * @private
     */
    AutoTranslateSummaryReport.prototype._to;
    /**
     * @type {?}
     * @private
     */
    AutoTranslateSummaryReport.prototype._total;
    /**
     * @type {?}
     * @private
     */
    AutoTranslateSummaryReport.prototype._ignored;
    /**
     * @type {?}
     * @private
     */
    AutoTranslateSummaryReport.prototype._success;
    /**
     * @type {?}
     * @private
     */
    AutoTranslateSummaryReport.prototype._failed;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by10cmFuc2xhdGUtc3VtbWFyeS1yZXBvcnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbImF1dG90cmFuc2xhdGUvYXV0by10cmFuc2xhdGUtc3VtbWFyeS1yZXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBUTVCOzs7OztJQVVFLG9DQUFZLElBQVksRUFBRSxFQUFVO1FBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7SUFDSSw2Q0FBUTs7Ozs7O0lBQWYsVUFBZ0IsS0FBYSxFQUFFLEtBQWE7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQzs7OztJQUVNLDBDQUFLOzs7SUFBWjtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDOzs7OztJQUVNLCtDQUFVOzs7O0lBQWpCLFVBQWtCLE9BQWU7UUFDL0IsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7SUFDSSxvREFBZTs7Ozs7O0lBQXRCLFVBQXVCLEVBQWMsRUFBRSxNQUEyQjtRQUNoRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNwQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRDs7O09BR0c7Ozs7OztJQUNJLDBDQUFLOzs7OztJQUFaLFVBQWEsY0FBMEM7UUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sSUFBSSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsSUFBSSxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUMsQ0FBQzs7OztJQUVNLDBDQUFLOzs7SUFBWjtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDOzs7O0lBRU0sNENBQU87OztJQUFkO1FBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7Ozs7SUFFTSw0Q0FBTzs7O0lBQWQ7UUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7OztJQUVNLDJDQUFNOzs7SUFBYjtRQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBRUQ7O09BRUc7Ozs7O0lBQ0ksNENBQU87Ozs7SUFBZDs7WUFDTSxNQUFNO1FBQ1YsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsTUFBTSxHQUFHLE1BQU0sQ0FBQyxtRUFBbUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkk7YUFBTTtZQUNMLE1BQU0sR0FBRyxNQUFNLENBQUMsNkdBQTZHLEVBQ3pILElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDcEY7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsaUNBQUM7QUFBRCxDQUFDLEFBaEdELElBZ0dDOzs7Ozs7Ozs7OztJQTlGQyw0Q0FBdUI7Ozs7O0lBQ3ZCLDJDQUFzQjs7Ozs7SUFDdEIseUNBQW9COzs7OztJQUNwQiw0Q0FBdUI7Ozs7O0lBQ3ZCLDhDQUF5Qjs7Ozs7SUFDekIsOENBQXlCOzs7OztJQUN6Qiw2Q0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0F1dG9UcmFuc2xhdGVSZXN1bHR9IGZyb20gJy4vYXV0by10cmFuc2xhdGUtcmVzdWx0JztcbmltcG9ydCB7Zm9ybWF0fSBmcm9tICd1dGlsJztcbmltcG9ydCB7SVRyYW5zVW5pdH0gZnJvbSAnQG5neC1pMThuc3VwcG9ydC9uZ3gtaTE4bnN1cHBvcnQtbGliJztcblxuLyoqXG4gKiBBIHJlcG9ydCBhYm91dCBhIHJ1biBvZiBHb29nbGUgVHJhbnNsYXRlIG92ZXIgYWxsIHVudHJhbnNsYXRlZCB1bml0LlxuICogKiBDcmVhdGVkIGJ5IG1hcnRpbiBvbiAyOS4wNi4yMDE3LlxuICovXG5cbmV4cG9ydCBjbGFzcyBBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydCB7XG5cbiAgcHJpdmF0ZSBfZXJyb3I6IHN0cmluZztcbiAgcHJpdmF0ZSBfZnJvbTogc3RyaW5nO1xuICBwcml2YXRlIF90bzogc3RyaW5nO1xuICBwcml2YXRlIF90b3RhbDogbnVtYmVyO1xuICBwcml2YXRlIF9pZ25vcmVkOiBudW1iZXI7XG4gIHByaXZhdGUgX3N1Y2Nlc3M6IG51bWJlcjtcbiAgcHJpdmF0ZSBfZmFpbGVkOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKSB7XG4gICAgdGhpcy5fZnJvbSA9IGZyb207XG4gICAgdGhpcy5fdG8gPSB0bztcbiAgICB0aGlzLl90b3RhbCA9IDA7XG4gICAgdGhpcy5faWdub3JlZCA9IDA7XG4gICAgdGhpcy5fc3VjY2VzcyA9IDA7XG4gICAgdGhpcy5fZmFpbGVkID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgZXJyb3IgaWYgdG90YWwgY2FsbCBmYWlsZWQgKGUuZy4gXCJpbnZhbGlkIGFwaSBrZXlcIiBvciBcIm5vIGNvbm5lY3Rpb25cIiAuLi4pXG4gICAqIEBwYXJhbSBlcnJvciBlcnJvclxuICAgKiBAcGFyYW0gdG90YWwgdG90YWxcbiAgICovXG4gIHB1YmxpYyBzZXRFcnJvcihlcnJvcjogc3RyaW5nLCB0b3RhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fZXJyb3IgPSBlcnJvcjtcbiAgICB0aGlzLl90b3RhbCA9IHRvdGFsO1xuICAgIHRoaXMuX2ZhaWxlZCA9IHRvdGFsO1xuICB9XG5cbiAgcHVibGljIGVycm9yKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Vycm9yO1xuICB9XG5cbiAgcHVibGljIHNldElnbm9yZWQoaWdub3JlZDogbnVtYmVyKSB7XG4gICAgdGhpcy5fdG90YWwgKz0gaWdub3JlZDtcbiAgICB0aGlzLl9pZ25vcmVkID0gaWdub3JlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBzaW5nbGUgcmVzdWx0IHRvIHRoZSBzdW1tYXJ5LlxuICAgKiBAcGFyYW0gdHUgdHVcbiAgICogQHBhcmFtIHJlc3VsdCByZXN1bHRcbiAgICovXG4gIHB1YmxpYyBhZGRTaW5nbGVSZXN1bHQodHU6IElUcmFuc1VuaXQsIHJlc3VsdDogQXV0b1RyYW5zbGF0ZVJlc3VsdCkge1xuICAgIHRoaXMuX3RvdGFsKys7XG4gICAgaWYgKHJlc3VsdC5zdWNjZXNzKCkpIHtcbiAgICAgIHRoaXMuX3N1Y2Nlc3MrKztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZmFpbGVkKys7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1lcmdlIGFub3RoZXIgc3VtbWFyeSBpbnRvIHRoaXMgb25lLlxuICAgKiBAcGFyYW0gYW5vdGhlclN1bW1hcnkgYW5vdGhlclN1bW1hcnlcbiAgICovXG4gIHB1YmxpYyBtZXJnZShhbm90aGVyU3VtbWFyeTogQXV0b1RyYW5zbGF0ZVN1bW1hcnlSZXBvcnQpIHtcbiAgICBpZiAoIXRoaXMuX2Vycm9yKSB7XG4gICAgICB0aGlzLl9lcnJvciA9IGFub3RoZXJTdW1tYXJ5Ll9lcnJvcjtcbiAgICB9XG4gICAgdGhpcy5fdG90YWwgKz0gYW5vdGhlclN1bW1hcnkudG90YWwoKTtcbiAgICB0aGlzLl9pZ25vcmVkICs9IGFub3RoZXJTdW1tYXJ5Lmlnbm9yZWQoKTtcbiAgICB0aGlzLl9zdWNjZXNzICs9IGFub3RoZXJTdW1tYXJ5LnN1Y2Nlc3MoKTtcbiAgICB0aGlzLl9mYWlsZWQgKz0gYW5vdGhlclN1bW1hcnkuZmFpbGVkKCk7XG4gIH1cblxuICBwdWJsaWMgdG90YWwoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdG90YWw7XG4gIH1cblxuICBwdWJsaWMgaWdub3JlZCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9pZ25vcmVkO1xuICB9XG5cbiAgcHVibGljIHN1Y2Nlc3MoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc3VjY2VzcztcbiAgfVxuXG4gIHB1YmxpYyBmYWlsZWQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZmFpbGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEh1bWFuIHJlYWRhYmxlIHZlcnNpb24gb2YgcmVwb3J0XG4gICAqL1xuICBwdWJsaWMgY29udGVudCgpOiBzdHJpbmcge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHRoaXMuX2Vycm9yKSB7XG4gICAgICByZXN1bHQgPSBmb3JtYXQoJ0F1dG8gdHJhbnNsYXRpb24gZnJvbSBcIiVzXCIgdG8gXCIlc1wiIGZhaWxlZDogXCIlc1wiLCBmYWlsZWQgdW5pdHM6ICVzJywgdGhpcy5fZnJvbSwgdGhpcy5fdG8sIHRoaXMuX2Vycm9yLCB0aGlzLl9mYWlsZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBmb3JtYXQoJ0F1dG8gdHJhbnNsYXRpb24gZnJvbSBcIiVzXCIgdG8gXCIlc1wiLCB0b3RhbCBhdXRvIHRyYW5zbGF0ZWQgdW5pdHM6ICVzLCBpZ25vcmVkOiAlcywgc3VjY2VzZnVsOiAlcywgZmFpbGVkOiAlcycsXG4gICAgICAgICAgdGhpcy5fZnJvbSwgdGhpcy5fdG8sIHRoaXMuX3RvdGFsLCB0aGlzLl9pZ25vcmVkLCB0aGlzLl9zdWNjZXNzLCB0aGlzLl9mYWlsZWQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=