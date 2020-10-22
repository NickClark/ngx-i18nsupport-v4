/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { format } from 'util';
/**
 * A report about a run of Google Translate over all untranslated unit.
 * * Created by martin on 29.06.2017.
 */
export class AutoTranslateSummaryReport {
    /**
     * @param {?} from
     * @param {?} to
     */
    constructor(from, to) {
        this._from = from;
        this._to = to;
        this._total = 0;
        this._ignored = 0;
        this._success = 0;
        this._failed = 0;
    }
    /**
     * Set error if total call failed (e.g. "invalid api key" or "no connection" ...)
     * @param {?} error error
     * @param {?} total total
     * @return {?}
     */
    setError(error, total) {
        this._error = error;
        this._total = total;
        this._failed = total;
    }
    /**
     * @return {?}
     */
    error() {
        return this._error;
    }
    /**
     * @param {?} ignored
     * @return {?}
     */
    setIgnored(ignored) {
        this._total += ignored;
        this._ignored = ignored;
    }
    /**
     * Add a single result to the summary.
     * @param {?} tu tu
     * @param {?} result result
     * @return {?}
     */
    addSingleResult(tu, result) {
        this._total++;
        if (result.success()) {
            this._success++;
        }
        else {
            this._failed++;
        }
    }
    /**
     * Merge another summary into this one.
     * @param {?} anotherSummary anotherSummary
     * @return {?}
     */
    merge(anotherSummary) {
        if (!this._error) {
            this._error = anotherSummary._error;
        }
        this._total += anotherSummary.total();
        this._ignored += anotherSummary.ignored();
        this._success += anotherSummary.success();
        this._failed += anotherSummary.failed();
    }
    /**
     * @return {?}
     */
    total() {
        return this._total;
    }
    /**
     * @return {?}
     */
    ignored() {
        return this._ignored;
    }
    /**
     * @return {?}
     */
    success() {
        return this._success;
    }
    /**
     * @return {?}
     */
    failed() {
        return this._failed;
    }
    /**
     * Human readable version of report
     * @return {?}
     */
    content() {
        /** @type {?} */
        let result;
        if (this._error) {
            result = format('Auto translation from "%s" to "%s" failed: "%s", failed units: %s', this._from, this._to, this._error, this._failed);
        }
        else {
            result = format('Auto translation from "%s" to "%s", total auto translated units: %s, ignored: %s, succesful: %s, failed: %s', this._from, this._to, this._total, this._ignored, this._success, this._failed);
        }
        return result;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by10cmFuc2xhdGUtc3VtbWFyeS1yZXBvcnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbImF1dG90cmFuc2xhdGUvYXV0by10cmFuc2xhdGUtc3VtbWFyeS1yZXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7O0FBUTVCLE1BQU0sT0FBTywwQkFBMEI7Ozs7O0lBVXJDLFlBQVksSUFBWSxFQUFFLEVBQVU7UUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNuQixDQUFDOzs7Ozs7O0lBT00sUUFBUSxDQUFDLEtBQWEsRUFBRSxLQUFhO1FBQzFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7Ozs7SUFFTSxLQUFLO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7Ozs7O0lBRU0sVUFBVSxDQUFDLE9BQWU7UUFDL0IsSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDMUIsQ0FBQzs7Ozs7OztJQU9NLGVBQWUsQ0FBQyxFQUFjLEVBQUUsTUFBMkI7UUFDaEUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDaEI7SUFDSCxDQUFDOzs7Ozs7SUFNTSxLQUFLLENBQUMsY0FBMEM7UUFDckQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sSUFBSSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsSUFBSSxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUMsQ0FBQzs7OztJQUVNLEtBQUs7UUFDVixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQzs7OztJQUVNLE9BQU87UUFDWixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7OztJQUVNLE9BQU87UUFDWixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQzs7OztJQUVNLE1BQU07UUFDWCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQzs7Ozs7SUFLTSxPQUFPOztZQUNSLE1BQU07UUFDVixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixNQUFNLEdBQUcsTUFBTSxDQUFDLG1FQUFtRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN2STthQUFNO1lBQ0wsTUFBTSxHQUFHLE1BQU0sQ0FBQyw2R0FBNkcsRUFDekgsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNwRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Q0FDRjs7Ozs7O0lBOUZDLDRDQUF1Qjs7Ozs7SUFDdkIsMkNBQXNCOzs7OztJQUN0Qix5Q0FBb0I7Ozs7O0lBQ3BCLDRDQUF1Qjs7Ozs7SUFDdkIsOENBQXlCOzs7OztJQUN6Qiw4Q0FBeUI7Ozs7O0lBQ3pCLDZDQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXV0b1RyYW5zbGF0ZVJlc3VsdH0gZnJvbSAnLi9hdXRvLXRyYW5zbGF0ZS1yZXN1bHQnO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHtJVHJhbnNVbml0fSBmcm9tICdAbmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC1saWInO1xuXG4vKipcbiAqIEEgcmVwb3J0IGFib3V0IGEgcnVuIG9mIEdvb2dsZSBUcmFuc2xhdGUgb3ZlciBhbGwgdW50cmFuc2xhdGVkIHVuaXQuXG4gKiAqIENyZWF0ZWQgYnkgbWFydGluIG9uIDI5LjA2LjIwMTcuXG4gKi9cblxuZXhwb3J0IGNsYXNzIEF1dG9UcmFuc2xhdGVTdW1tYXJ5UmVwb3J0IHtcblxuICBwcml2YXRlIF9lcnJvcjogc3RyaW5nO1xuICBwcml2YXRlIF9mcm9tOiBzdHJpbmc7XG4gIHByaXZhdGUgX3RvOiBzdHJpbmc7XG4gIHByaXZhdGUgX3RvdGFsOiBudW1iZXI7XG4gIHByaXZhdGUgX2lnbm9yZWQ6IG51bWJlcjtcbiAgcHJpdmF0ZSBfc3VjY2VzczogbnVtYmVyO1xuICBwcml2YXRlIF9mYWlsZWQ6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9mcm9tID0gZnJvbTtcbiAgICB0aGlzLl90byA9IHRvO1xuICAgIHRoaXMuX3RvdGFsID0gMDtcbiAgICB0aGlzLl9pZ25vcmVkID0gMDtcbiAgICB0aGlzLl9zdWNjZXNzID0gMDtcbiAgICB0aGlzLl9mYWlsZWQgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBlcnJvciBpZiB0b3RhbCBjYWxsIGZhaWxlZCAoZS5nLiBcImludmFsaWQgYXBpIGtleVwiIG9yIFwibm8gY29ubmVjdGlvblwiIC4uLilcbiAgICogQHBhcmFtIGVycm9yIGVycm9yXG4gICAqIEBwYXJhbSB0b3RhbCB0b3RhbFxuICAgKi9cbiAgcHVibGljIHNldEVycm9yKGVycm9yOiBzdHJpbmcsIHRvdGFsOiBudW1iZXIpIHtcbiAgICB0aGlzLl9lcnJvciA9IGVycm9yO1xuICAgIHRoaXMuX3RvdGFsID0gdG90YWw7XG4gICAgdGhpcy5fZmFpbGVkID0gdG90YWw7XG4gIH1cblxuICBwdWJsaWMgZXJyb3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZXJyb3I7XG4gIH1cblxuICBwdWJsaWMgc2V0SWdub3JlZChpZ25vcmVkOiBudW1iZXIpIHtcbiAgICB0aGlzLl90b3RhbCArPSBpZ25vcmVkO1xuICAgIHRoaXMuX2lnbm9yZWQgPSBpZ25vcmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHNpbmdsZSByZXN1bHQgdG8gdGhlIHN1bW1hcnkuXG4gICAqIEBwYXJhbSB0dSB0dVxuICAgKiBAcGFyYW0gcmVzdWx0IHJlc3VsdFxuICAgKi9cbiAgcHVibGljIGFkZFNpbmdsZVJlc3VsdCh0dTogSVRyYW5zVW5pdCwgcmVzdWx0OiBBdXRvVHJhbnNsYXRlUmVzdWx0KSB7XG4gICAgdGhpcy5fdG90YWwrKztcbiAgICBpZiAocmVzdWx0LnN1Y2Nlc3MoKSkge1xuICAgICAgdGhpcy5fc3VjY2VzcysrO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9mYWlsZWQrKztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2UgYW5vdGhlciBzdW1tYXJ5IGludG8gdGhpcyBvbmUuXG4gICAqIEBwYXJhbSBhbm90aGVyU3VtbWFyeSBhbm90aGVyU3VtbWFyeVxuICAgKi9cbiAgcHVibGljIG1lcmdlKGFub3RoZXJTdW1tYXJ5OiBBdXRvVHJhbnNsYXRlU3VtbWFyeVJlcG9ydCkge1xuICAgIGlmICghdGhpcy5fZXJyb3IpIHtcbiAgICAgIHRoaXMuX2Vycm9yID0gYW5vdGhlclN1bW1hcnkuX2Vycm9yO1xuICAgIH1cbiAgICB0aGlzLl90b3RhbCArPSBhbm90aGVyU3VtbWFyeS50b3RhbCgpO1xuICAgIHRoaXMuX2lnbm9yZWQgKz0gYW5vdGhlclN1bW1hcnkuaWdub3JlZCgpO1xuICAgIHRoaXMuX3N1Y2Nlc3MgKz0gYW5vdGhlclN1bW1hcnkuc3VjY2VzcygpO1xuICAgIHRoaXMuX2ZhaWxlZCArPSBhbm90aGVyU3VtbWFyeS5mYWlsZWQoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b3RhbCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl90b3RhbDtcbiAgfVxuXG4gIHB1YmxpYyBpZ25vcmVkKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2lnbm9yZWQ7XG4gIH1cblxuICBwdWJsaWMgc3VjY2VzcygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zdWNjZXNzO1xuICB9XG5cbiAgcHVibGljIGZhaWxlZCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9mYWlsZWQ7XG4gIH1cblxuICAvKipcbiAgICogSHVtYW4gcmVhZGFibGUgdmVyc2lvbiBvZiByZXBvcnRcbiAgICovXG4gIHB1YmxpYyBjb250ZW50KCk6IHN0cmluZyB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodGhpcy5fZXJyb3IpIHtcbiAgICAgIHJlc3VsdCA9IGZvcm1hdCgnQXV0byB0cmFuc2xhdGlvbiBmcm9tIFwiJXNcIiB0byBcIiVzXCIgZmFpbGVkOiBcIiVzXCIsIGZhaWxlZCB1bml0czogJXMnLCB0aGlzLl9mcm9tLCB0aGlzLl90bywgdGhpcy5fZXJyb3IsIHRoaXMuX2ZhaWxlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IGZvcm1hdCgnQXV0byB0cmFuc2xhdGlvbiBmcm9tIFwiJXNcIiB0byBcIiVzXCIsIHRvdGFsIGF1dG8gdHJhbnNsYXRlZCB1bml0czogJXMsIGlnbm9yZWQ6ICVzLCBzdWNjZXNmdWw6ICVzLCBmYWlsZWQ6ICVzJyxcbiAgICAgICAgICB0aGlzLl9mcm9tLCB0aGlzLl90bywgdGhpcy5fdG90YWwsIHRoaXMuX2lnbm9yZWQsIHRoaXMuX3N1Y2Nlc3MsIHRoaXMuX2ZhaWxlZCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==