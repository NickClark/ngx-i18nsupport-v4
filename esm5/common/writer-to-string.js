/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Writable } from 'stream';
import { isString } from './util';
/**
 * Created by martin on 20.02.2017.
 * A helper class for testing.
 * Can be used as a WritableStream and writes everything (synchronously) into a string,
 * that can easily be read by the tests.
 */
var /**
 * Created by martin on 20.02.2017.
 * A helper class for testing.
 * Can be used as a WritableStream and writes everything (synchronously) into a string,
 * that can easily be read by the tests.
 */
WriterToString = /** @class */ (function (_super) {
    tslib_1.__extends(WriterToString, _super);
    function WriterToString() {
        var _this = _super.call(this) || this;
        _this.resultString = '';
        return _this;
    }
    /**
     * @param {?} chunk
     * @param {?} encoding
     * @param {?} callback
     * @return {?}
     */
    WriterToString.prototype._write = /**
     * @param {?} chunk
     * @param {?} encoding
     * @param {?} callback
     * @return {?}
     */
    function (chunk, encoding, callback) {
        /** @type {?} */
        var chunkString;
        if (isString(chunk)) {
            chunkString = chunk;
        }
        else if (chunk instanceof Buffer) {
            chunkString = chunk.toString();
        }
        else {
            chunkString = Buffer.alloc(chunk).toString(encoding);
        }
        this.resultString = this.resultString + chunkString;
        callback();
    };
    /**
     * Returns a string of everything, that was written to the stream so far.
     * @return written data
     */
    /**
     * Returns a string of everything, that was written to the stream so far.
     * @return {?} written data
     */
    WriterToString.prototype.writtenData = /**
     * Returns a string of everything, that was written to the stream so far.
     * @return {?} written data
     */
    function () {
        return this.resultString;
    };
    return WriterToString;
}(Writable));
/**
 * Created by martin on 20.02.2017.
 * A helper class for testing.
 * Can be used as a WritableStream and writes everything (synchronously) into a string,
 * that can easily be read by the tests.
 */
export { WriterToString };
if (false) {
    /**
     * @type {?}
     * @private
     */
    WriterToString.prototype.resultString;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JpdGVyLXRvLXN0cmluZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsiY29tbW9uL3dyaXRlci10by1zdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7QUFRaEM7Ozs7Ozs7SUFBb0MsMENBQVE7SUFJeEM7UUFBQSxZQUNJLGlCQUFPLFNBRVY7UUFERyxLQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQzs7SUFDM0IsQ0FBQzs7Ozs7OztJQUVNLCtCQUFNOzs7Ozs7SUFBYixVQUFjLEtBQVUsRUFBRSxRQUFnQixFQUFFLFFBQWtCOztZQUN0RCxXQUFXO1FBQ2YsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDakIsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUN2QjthQUFNLElBQUksS0FBSyxZQUFZLE1BQU0sRUFBRTtZQUNoQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2xDO2FBQU07WUFDSCxXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsV0FBVyxDQUFDO1FBQ3BELFFBQVEsRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7SUFDSSxvQ0FBVzs7OztJQUFsQjtRQUNJLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUM3QixDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQUFDLEFBN0JELENBQW9DLFFBQVEsR0E2QjNDOzs7Ozs7Ozs7Ozs7O0lBM0JHLHNDQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7V3JpdGFibGV9IGZyb20gJ3N0cmVhbSc7XG5pbXBvcnQge2lzU3RyaW5nfSBmcm9tICcuL3V0aWwnO1xuLyoqXG4gKiBDcmVhdGVkIGJ5IG1hcnRpbiBvbiAyMC4wMi4yMDE3LlxuICogQSBoZWxwZXIgY2xhc3MgZm9yIHRlc3RpbmcuXG4gKiBDYW4gYmUgdXNlZCBhcyBhIFdyaXRhYmxlU3RyZWFtIGFuZCB3cml0ZXMgZXZlcnl0aGluZyAoc3luY2hyb25vdXNseSkgaW50byBhIHN0cmluZyxcbiAqIHRoYXQgY2FuIGVhc2lseSBiZSByZWFkIGJ5IHRoZSB0ZXN0cy5cbiAqL1xuXG5leHBvcnQgY2xhc3MgV3JpdGVyVG9TdHJpbmcgZXh0ZW5kcyBXcml0YWJsZSB7XG5cbiAgICBwcml2YXRlIHJlc3VsdFN0cmluZzogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVzdWx0U3RyaW5nID0gJyc7XG4gICAgfVxuXG4gICAgcHVibGljIF93cml0ZShjaHVuazogYW55LCBlbmNvZGluZzogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgbGV0IGNodW5rU3RyaW5nO1xuICAgICAgICBpZiAoaXNTdHJpbmcoY2h1bmspKSB7XG4gICAgICAgICAgICBjaHVua1N0cmluZyA9IGNodW5rO1xuICAgICAgICB9IGVsc2UgaWYgKGNodW5rIGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgICAgICAgICBjaHVua1N0cmluZyA9IGNodW5rLnRvU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaHVua1N0cmluZyA9IEJ1ZmZlci5hbGxvYyhjaHVuaykudG9TdHJpbmcoZW5jb2RpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdWx0U3RyaW5nID0gdGhpcy5yZXN1bHRTdHJpbmcgKyBjaHVua1N0cmluZztcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIG9mIGV2ZXJ5dGhpbmcsIHRoYXQgd2FzIHdyaXR0ZW4gdG8gdGhlIHN0cmVhbSBzbyBmYXIuXG4gICAgICogQHJldHVybiB3cml0dGVuIGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgd3JpdHRlbkRhdGEoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0U3RyaW5nO1xuICAgIH1cbn1cbiJdfQ==