/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * Created by martin on 17.02.2017.
 * Very simple class to control the output of a command.
 * Output can be errors, warnings, infos and debug-Outputs.
 * The output can be controlled via 2 flags, quiet and verbose.
 * If quit is enabled only error messages are shown.
 * If verbose is enabled, everything is shown.
 * If both are not enabled (the default) errors, warnings and infos are shown.
 * If not are enabled (strange), we assumed the default.
 */
import chalk from 'chalk';
import { format } from 'util';
/** @enum {number} */
var LogLevel = {
    'ERROR': 0,
    'WARN': 1,
    'INFO': 2,
    'DEBUG': 3,
};
LogLevel[LogLevel['ERROR']] = 'ERROR';
LogLevel[LogLevel['WARN']] = 'WARN';
LogLevel[LogLevel['INFO']] = 'INFO';
LogLevel[LogLevel['DEBUG']] = 'DEBUG';
var CommandOutput = /** @class */ (function () {
    function CommandOutput(stdout) {
        this._quiet = false;
        this._verbose = false;
        if (stdout) {
            this.outputStream = stdout;
        }
        else {
            this.outputStream = process.stdout;
        }
    }
    /**
     * @return {?}
     */
    CommandOutput.prototype.setVerbose = /**
     * @return {?}
     */
    function () {
        this._verbose = true;
    };
    /**
     * @return {?}
     */
    CommandOutput.prototype.setQuiet = /**
     * @return {?}
     */
    function () {
        this._quiet = true;
    };
    /**
     * Test, wether verbose is enabled.
     * @return wether verbose is enabled.
     */
    /**
     * Test, wether verbose is enabled.
     * @return {?} wether verbose is enabled.
     */
    CommandOutput.prototype.verbose = /**
     * Test, wether verbose is enabled.
     * @return {?} wether verbose is enabled.
     */
    function () {
        return this._verbose;
    };
    /**
     * Test, wether quiet is enabled.
     * @return wether quiet is enabled.
     */
    /**
     * Test, wether quiet is enabled.
     * @return {?} wether quiet is enabled.
     */
    CommandOutput.prototype.quiet = /**
     * Test, wether quiet is enabled.
     * @return {?} wether quiet is enabled.
     */
    function () {
        return this._quiet;
    };
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    CommandOutput.prototype.error = /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    function (msg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.log(LogLevel.ERROR, msg, params);
    };
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    CommandOutput.prototype.warn = /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    function (msg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.log(LogLevel.WARN, msg, params);
    };
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    CommandOutput.prototype.info = /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    function (msg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.log(LogLevel.INFO, msg, params);
    };
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    CommandOutput.prototype.debug = /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    function (msg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.log(LogLevel.DEBUG, msg, params);
    };
    /**
     * @private
     * @param {?} level
     * @param {?} msg
     * @param {?} params
     * @return {?}
     */
    CommandOutput.prototype.log = /**
     * @private
     * @param {?} level
     * @param {?} msg
     * @param {?} params
     * @return {?}
     */
    function (level, msg, params) {
        if (!this.isOutputEnabled(level)) {
            return;
        }
        /** @type {?} */
        var coloredMessage;
        switch (level) {
            case LogLevel.ERROR:
                coloredMessage = chalk.red('ERROR: ' + msg);
                break;
            case LogLevel.WARN:
                coloredMessage = chalk.magenta('WARNING: ' + msg);
                break;
            default:
                coloredMessage = chalk.gray('* ' + msg);
                break;
        }
        /** @type {?} */
        var outMsg = format.apply(void 0, tslib_1.__spread([coloredMessage], params));
        this.outputStream.write(outMsg + '\n');
    };
    /**
     * @private
     * @param {?} level
     * @return {?}
     */
    CommandOutput.prototype.isOutputEnabled = /**
     * @private
     * @param {?} level
     * @return {?}
     */
    function (level) {
        /** @type {?} */
        var quietEnabled;
        /** @type {?} */
        var verboseEnabled;
        if (this._quiet && this._verbose) {
            quietEnabled = false;
            verboseEnabled = false;
        }
        else {
            quietEnabled = this._quiet;
            verboseEnabled = this._verbose;
        }
        switch (level) {
            case LogLevel.ERROR:
                return true; // always output errors
            case LogLevel.WARN:
                return (!quietEnabled);
            case LogLevel.INFO:
                return (verboseEnabled && !quietEnabled);
            case LogLevel.DEBUG:
                return verboseEnabled;
            default:
                return true;
        }
    };
    return CommandOutput;
}());
export { CommandOutput };
if (false) {
    /**
     * verbose enables output of everything.
     * @type {?}
     */
    CommandOutput.prototype._verbose;
    /**
     * quiet disables output of everything but errors.
     * @type {?}
     */
    CommandOutput.prototype._quiet;
    /**
     * @type {?}
     * @private
     */
    CommandOutput.prototype.outputStream;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC1vdXRwdXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbImNvbW1vbi9jb21tYW5kLW91dHB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFXQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFFMUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQzs7O0lBR3hCLFVBQU87SUFDUCxTQUFNO0lBQ04sU0FBTTtJQUNOLFVBQU87O2tCQUhQLE9BQU8sS0FBUCxPQUFPO2tCQUNQLE1BQU0sS0FBTixNQUFNO2tCQUNOLE1BQU0sS0FBTixNQUFNO2tCQUNOLE9BQU8sS0FBUCxPQUFPO0FBR1g7SUFjSSx1QkFBWSxNQUF1QjtRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixJQUFJLE1BQU0sRUFBRTtZQUNSLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO1NBQzlCO2FBQU07WUFDSCxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDdEM7SUFDTCxDQUFDOzs7O0lBRU0sa0NBQVU7OztJQUFqQjtRQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7Ozs7SUFFTSxnQ0FBUTs7O0lBQWY7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHOzs7OztJQUNJLCtCQUFPOzs7O0lBQWQ7UUFDSSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRzs7Ozs7SUFDSSw2QkFBSzs7OztJQUFaO1FBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7Ozs7OztJQUVNLDZCQUFLOzs7OztJ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QUNMLENBQUM7SUFDTCxvQkFBQztBQUFELENBQUMsQUExR0QsSUEwR0M7Ozs7Ozs7SUFyR0csaUNBQXlCOzs7OztJQUt6QiwrQkFBdUI7Ozs7O0lBRXZCLHFDQUFxQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBtYXJ0aW4gb24gMTcuMDIuMjAxNy5cbiAqIFZlcnkgc2ltcGxlIGNsYXNzIHRvIGNvbnRyb2wgdGhlIG91dHB1dCBvZiBhIGNvbW1hbmQuXG4gKiBPdXRwdXQgY2FuIGJlIGVycm9ycywgd2FybmluZ3MsIGluZm9zIGFuZCBkZWJ1Zy1PdXRwdXRzLlxuICogVGhlIG91dHB1dCBjYW4gYmUgY29udHJvbGxlZCB2aWEgMiBmbGFncywgcXVpZXQgYW5kIHZlcmJvc2UuXG4gKiBJZiBxdWl0IGlzIGVuYWJsZWQgb25seSBlcnJvciBtZXNzYWdlcyBhcmUgc2hvd24uXG4gKiBJZiB2ZXJib3NlIGlzIGVuYWJsZWQsIGV2ZXJ5dGhpbmcgaXMgc2hvd24uXG4gKiBJZiBib3RoIGFyZSBub3QgZW5hYmxlZCAodGhlIGRlZmF1bHQpIGVycm9ycywgd2FybmluZ3MgYW5kIGluZm9zIGFyZSBzaG93bi5cbiAqIElmIG5vdCBhcmUgZW5hYmxlZCAoc3RyYW5nZSksIHdlIGFzc3VtZWQgdGhlIGRlZmF1bHQuXG4gKi9cblxuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBXcml0YWJsZVN0cmVhbSA9IE5vZGVKUy5Xcml0YWJsZVN0cmVhbTtcbmltcG9ydCB7Zm9ybWF0fSBmcm9tICd1dGlsJztcblxuZW51bSBMb2dMZXZlbCB7XG4gICAgJ0VSUk9SJyxcbiAgICAnV0FSTicsXG4gICAgJ0lORk8nLFxuICAgICdERUJVRydcbn1cblxuZXhwb3J0IGNsYXNzIENvbW1hbmRPdXRwdXQge1xuXG4gICAgLyoqXG4gICAgICogdmVyYm9zZSBlbmFibGVzIG91dHB1dCBvZiBldmVyeXRoaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBfdmVyYm9zZTogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIHF1aWV0IGRpc2FibGVzIG91dHB1dCBvZiBldmVyeXRoaW5nIGJ1dCBlcnJvcnMuXG4gICAgICovXG4gICAgcHVibGljIF9xdWlldDogYm9vbGVhbjtcblxuICAgIHByaXZhdGUgb3V0cHV0U3RyZWFtOiBXcml0YWJsZVN0cmVhbTtcblxuICAgIGNvbnN0cnVjdG9yKHN0ZG91dD86IFdyaXRhYmxlU3RyZWFtKSB7XG4gICAgICAgIHRoaXMuX3F1aWV0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3ZlcmJvc2UgPSBmYWxzZTtcbiAgICAgICAgaWYgKHN0ZG91dCkge1xuICAgICAgICAgICAgdGhpcy5vdXRwdXRTdHJlYW0gPSBzdGRvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm91dHB1dFN0cmVhbSA9IHByb2Nlc3Muc3Rkb3V0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHNldFZlcmJvc2UoKSB7XG4gICAgICAgIHRoaXMuX3ZlcmJvc2UgPSB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRRdWlldCgpIHtcbiAgICAgICAgdGhpcy5fcXVpZXQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3QsIHdldGhlciB2ZXJib3NlIGlzIGVuYWJsZWQuXG4gICAgICogQHJldHVybiB3ZXRoZXIgdmVyYm9zZSBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyB2ZXJib3NlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmVyYm9zZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXN0LCB3ZXRoZXIgcXVpZXQgaXMgZW5hYmxlZC5cbiAgICAgKiBAcmV0dXJuIHdldGhlciBxdWlldCBpcyBlbmFibGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBxdWlldCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3F1aWV0O1xuICAgIH1cblxuICAgIHB1YmxpYyBlcnJvcihtc2csIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwuRVJST1IsIG1zZywgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgd2Fybihtc2csIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwuV0FSTiwgbXNnLCBwYXJhbXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBpbmZvKG1zZywgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmxvZyhMb2dMZXZlbC5JTkZPLCBtc2csIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlYnVnKG1zZywgLi4ucGFyYW1zOiBhbnlbXSkge1xuICAgICAgICB0aGlzLmxvZyhMb2dMZXZlbC5ERUJVRywgbXNnLCBwYXJhbXMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgbG9nKGxldmVsOiBMb2dMZXZlbCwgbXNnLCBwYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIGlmICghdGhpcy5pc091dHB1dEVuYWJsZWQobGV2ZWwpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbG9yZWRNZXNzYWdlO1xuICAgICAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLkVSUk9SOlxuICAgICAgICAgICAgICAgIGNvbG9yZWRNZXNzYWdlID0gY2hhbGsucmVkKCdFUlJPUjogJyArIG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLldBUk46XG4gICAgICAgICAgICAgICAgY29sb3JlZE1lc3NhZ2UgPSBjaGFsay5tYWdlbnRhKCdXQVJOSU5HOiAnICsgbXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29sb3JlZE1lc3NhZ2UgPSBjaGFsay5ncmF5KCcqICcgKyBtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG91dE1zZyA9IGZvcm1hdChjb2xvcmVkTWVzc2FnZSwgLi4ucGFyYW1zKTtcbiAgICAgICAgdGhpcy5vdXRwdXRTdHJlYW0ud3JpdGUob3V0TXNnICsgJ1xcbicpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNPdXRwdXRFbmFibGVkKGxldmVsOiBMb2dMZXZlbCk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgcXVpZXRFbmFibGVkLCB2ZXJib3NlRW5hYmxlZDogYm9vbGVhbjtcbiAgICAgICAgaWYgKHRoaXMuX3F1aWV0ICYmIHRoaXMuX3ZlcmJvc2UpIHtcbiAgICAgICAgICAgIHF1aWV0RW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdmVyYm9zZUVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHF1aWV0RW5hYmxlZCA9IHRoaXMuX3F1aWV0O1xuICAgICAgICAgICAgdmVyYm9zZUVuYWJsZWQgPSB0aGlzLl92ZXJib3NlO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAobGV2ZWwpIHtcbiAgICAgICAgICAgIGNhc2UgTG9nTGV2ZWwuRVJST1I6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7ICAgIC8vIGFsd2F5cyBvdXRwdXQgZXJyb3JzXG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLldBUk46XG4gICAgICAgICAgICAgICAgcmV0dXJuICghcXVpZXRFbmFibGVkKTtcbiAgICAgICAgICAgIGNhc2UgTG9nTGV2ZWwuSU5GTzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKHZlcmJvc2VFbmFibGVkICYmICFxdWlldEVuYWJsZWQpO1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5ERUJVRzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdmVyYm9zZUVuYWJsZWQ7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19