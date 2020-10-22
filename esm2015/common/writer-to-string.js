/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Writable } from 'stream';
import { isString } from './util';
/**
 * Created by martin on 20.02.2017.
 * A helper class for testing.
 * Can be used as a WritableStream and writes everything (synchronously) into a string,
 * that can easily be read by the tests.
 */
export class WriterToString extends Writable {
    constructor() {
        super();
        this.resultString = '';
    }
    /**
     * @param {?} chunk
     * @param {?} encoding
     * @param {?} callback
     * @return {?}
     */
    _write(chunk, encoding, callback) {
        /** @type {?} */
        let chunkString;
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
    }
    /**
     * Returns a string of everything, that was written to the stream so far.
     * @return {?} written data
     */
    writtenData() {
        return this.resultString;
    }
}
if (false) {
    /**
     * @type {?}
     * @private
     */
    WriterToString.prototype.resultString;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JpdGVyLXRvLXN0cmluZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsiY29tbW9uL3dyaXRlci10by1zdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDaEMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFFBQVEsQ0FBQzs7Ozs7OztBQVFoQyxNQUFNLE9BQU8sY0FBZSxTQUFRLFFBQVE7SUFJeEM7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQzNCLENBQUM7Ozs7Ozs7SUFFTSxNQUFNLENBQUMsS0FBVSxFQUFFLFFBQWdCLEVBQUUsUUFBa0I7O1lBQ3RELFdBQVc7UUFDZixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqQixXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCO2FBQU0sSUFBSSxLQUFLLFlBQVksTUFBTSxFQUFFO1lBQ2hDLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDbEM7YUFBTTtZQUNILFdBQVcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7UUFDcEQsUUFBUSxFQUFFLENBQUM7SUFDZixDQUFDOzs7OztJQU1NLFdBQVc7UUFDZCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztDQUNKOzs7Ozs7SUEzQkcsc0NBQTZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtXcml0YWJsZX0gZnJvbSAnc3RyZWFtJztcbmltcG9ydCB7aXNTdHJpbmd9IGZyb20gJy4vdXRpbCc7XG4vKipcbiAqIENyZWF0ZWQgYnkgbWFydGluIG9uIDIwLjAyLjIwMTcuXG4gKiBBIGhlbHBlciBjbGFzcyBmb3IgdGVzdGluZy5cbiAqIENhbiBiZSB1c2VkIGFzIGEgV3JpdGFibGVTdHJlYW0gYW5kIHdyaXRlcyBldmVyeXRoaW5nIChzeW5jaHJvbm91c2x5KSBpbnRvIGEgc3RyaW5nLFxuICogdGhhdCBjYW4gZWFzaWx5IGJlIHJlYWQgYnkgdGhlIHRlc3RzLlxuICovXG5cbmV4cG9ydCBjbGFzcyBXcml0ZXJUb1N0cmluZyBleHRlbmRzIFdyaXRhYmxlIHtcblxuICAgIHByaXZhdGUgcmVzdWx0U3RyaW5nOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5yZXN1bHRTdHJpbmcgPSAnJztcbiAgICB9XG5cbiAgICBwdWJsaWMgX3dyaXRlKGNodW5rOiBhbnksIGVuY29kaW5nOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICBsZXQgY2h1bmtTdHJpbmc7XG4gICAgICAgIGlmIChpc1N0cmluZyhjaHVuaykpIHtcbiAgICAgICAgICAgIGNodW5rU3RyaW5nID0gY2h1bms7XG4gICAgICAgIH0gZWxzZSBpZiAoY2h1bmsgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAgICAgICAgIGNodW5rU3RyaW5nID0gY2h1bmsudG9TdHJpbmcoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNodW5rU3RyaW5nID0gQnVmZmVyLmFsbG9jKGNodW5rKS50b1N0cmluZyhlbmNvZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXN1bHRTdHJpbmcgPSB0aGlzLnJlc3VsdFN0cmluZyArIGNodW5rU3RyaW5nO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgb2YgZXZlcnl0aGluZywgdGhhdCB3YXMgd3JpdHRlbiB0byB0aGUgc3RyZWFtIHNvIGZhci5cbiAgICAgKiBAcmV0dXJuIHdyaXR0ZW4gZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyB3cml0dGVuRGF0YSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRTdHJpbmc7XG4gICAgfVxufVxuIl19