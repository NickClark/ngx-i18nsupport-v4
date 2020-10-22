/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
const LogLevel = {
    'ERROR': 0,
    'WARN': 1,
    'INFO': 2,
    'DEBUG': 3,
};
LogLevel[LogLevel['ERROR']] = 'ERROR';
LogLevel[LogLevel['WARN']] = 'WARN';
LogLevel[LogLevel['INFO']] = 'INFO';
LogLevel[LogLevel['DEBUG']] = 'DEBUG';
export class CommandOutput {
    /**
     * @param {?=} stdout
     */
    constructor(stdout) {
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
    setVerbose() {
        this._verbose = true;
    }
    /**
     * @return {?}
     */
    setQuiet() {
        this._quiet = true;
    }
    /**
     * Test, wether verbose is enabled.
     * @return {?} wether verbose is enabled.
     */
    verbose() {
        return this._verbose;
    }
    /**
     * Test, wether quiet is enabled.
     * @return {?} wether quiet is enabled.
     */
    quiet() {
        return this._quiet;
    }
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    error(msg, ...params) {
        this.log(LogLevel.ERROR, msg, params);
    }
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    warn(msg, ...params) {
        this.log(LogLevel.WARN, msg, params);
    }
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    info(msg, ...params) {
        this.log(LogLevel.INFO, msg, params);
    }
    /**
     * @param {?} msg
     * @param {...?} params
     * @return {?}
     */
    debug(msg, ...params) {
        this.log(LogLevel.DEBUG, msg, params);
    }
    /**
     * @private
     * @param {?} level
     * @param {?} msg
     * @param {?} params
     * @return {?}
     */
    log(level, msg, params) {
        if (!this.isOutputEnabled(level)) {
            return;
        }
        /** @type {?} */
        let coloredMessage;
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
        const outMsg = format(coloredMessage, ...params);
        this.outputStream.write(outMsg + '\n');
    }
    /**
     * @private
     * @param {?} level
     * @return {?}
     */
    isOutputEnabled(level) {
        /** @type {?} */
        let quietEnabled;
        /** @type {?} */
        let verboseEnabled;
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
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC1vdXRwdXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbImNvbW1vbi9jb21tYW5kLW91dHB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQVdBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUxQixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7SUFHeEIsVUFBTztJQUNQLFNBQU07SUFDTixTQUFNO0lBQ04sVUFBTzs7a0JBSFAsT0FBTyxLQUFQLE9BQU87a0JBQ1AsTUFBTSxLQUFOLE1BQU07a0JBQ04sTUFBTSxLQUFOLE1BQU07a0JBQ04sT0FBTyxLQUFQLE9BQU87QUFHWCxNQUFNLE9BQU8sYUFBYTs7OztJQWN0QixZQUFZLE1BQXVCO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7U0FDOUI7YUFBTTtZQUNILElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUN0QztJQUNMLENBQUM7Ozs7SUFFTSxVQUFVO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQzs7OztJQUVNLFFBQVE7UUFDWCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDOzs7OztJQU1NLE9BQU87UUFDVixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQzs7Ozs7SUFNTSxLQUFLO1FBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7Ozs7OztJQUVNLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFhO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7Ozs7O0lBRU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLE1BQWE7UUFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDOzs7Ozs7SUFFTSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBYTtRQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Ozs7OztJQUVNLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFhO1FBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7Ozs7Ozs7SUFFTyxHQUFHLENBQUMsS0FBZSxFQUFFLEdBQUcsRUFBRSxNQUFhO1FBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLE9BQU87U0FDVjs7WUFDRyxjQUFjO1FBQ2xCLFFBQVEsS0FBSyxFQUFFO1lBQ1gsS0FBSyxRQUFRLENBQUMsS0FBSztnQkFDZixjQUFjLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzVDLE1BQU07WUFDVixLQUFLLFFBQVEsQ0FBQyxJQUFJO2dCQUNkLGNBQWMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDbEQsTUFBTTtZQUNWO2dCQUNJLGNBQWMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztnQkFDeEMsTUFBTTtTQUNiOztjQUNLLE1BQU0sR0FBRyxNQUFNLENBQUMsY0FBYyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2hELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDOzs7Ozs7SUFFTyxlQUFlLENBQUMsS0FBZTs7WUFDL0IsWUFBWTs7WUFBRSxjQUF1QjtRQUN6QyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM5QixZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLGNBQWMsR0FBRyxLQUFLLENBQUM7U0FDMUI7YUFBTTtZQUNILFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzNCLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ2xDO1FBQ0QsUUFBUSxLQUFLLEVBQUU7WUFDWCxLQUFLLFFBQVEsQ0FBQyxLQUFLO2dCQUNmLE9BQU8sSUFBSSxDQUFDLENBQUksdUJBQXVCO1lBQzNDLEtBQUssUUFBUSxDQUFDLElBQUk7Z0JBQ2QsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0IsS0FBSyxRQUFRLENBQUMsSUFBSTtnQkFDZCxPQUFPLENBQUMsY0FBYyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDN0MsS0FBSyxRQUFRLENBQUMsS0FBSztnQkFDZixPQUFPLGNBQWMsQ0FBQztZQUMxQjtnQkFDSSxPQUFPLElBQUksQ0FBQztTQUNuQjtJQUNMLENBQUM7Q0FDSjs7Ozs7O0lBckdHLGlDQUF5Qjs7Ozs7SUFLekIsK0JBQXVCOzs7OztJQUV2QixxQ0FBcUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgbWFydGluIG9uIDE3LjAyLjIwMTcuXG4gKiBWZXJ5IHNpbXBsZSBjbGFzcyB0byBjb250cm9sIHRoZSBvdXRwdXQgb2YgYSBjb21tYW5kLlxuICogT3V0cHV0IGNhbiBiZSBlcnJvcnMsIHdhcm5pbmdzLCBpbmZvcyBhbmQgZGVidWctT3V0cHV0cy5cbiAqIFRoZSBvdXRwdXQgY2FuIGJlIGNvbnRyb2xsZWQgdmlhIDIgZmxhZ3MsIHF1aWV0IGFuZCB2ZXJib3NlLlxuICogSWYgcXVpdCBpcyBlbmFibGVkIG9ubHkgZXJyb3IgbWVzc2FnZXMgYXJlIHNob3duLlxuICogSWYgdmVyYm9zZSBpcyBlbmFibGVkLCBldmVyeXRoaW5nIGlzIHNob3duLlxuICogSWYgYm90aCBhcmUgbm90IGVuYWJsZWQgKHRoZSBkZWZhdWx0KSBlcnJvcnMsIHdhcm5pbmdzIGFuZCBpbmZvcyBhcmUgc2hvd24uXG4gKiBJZiBub3QgYXJlIGVuYWJsZWQgKHN0cmFuZ2UpLCB3ZSBhc3N1bWVkIHRoZSBkZWZhdWx0LlxuICovXG5cbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgV3JpdGFibGVTdHJlYW0gPSBOb2RlSlMuV3JpdGFibGVTdHJlYW07XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAndXRpbCc7XG5cbmVudW0gTG9nTGV2ZWwge1xuICAgICdFUlJPUicsXG4gICAgJ1dBUk4nLFxuICAgICdJTkZPJyxcbiAgICAnREVCVUcnXG59XG5cbmV4cG9ydCBjbGFzcyBDb21tYW5kT3V0cHV0IHtcblxuICAgIC8qKlxuICAgICAqIHZlcmJvc2UgZW5hYmxlcyBvdXRwdXQgb2YgZXZlcnl0aGluZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgX3ZlcmJvc2U6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBxdWlldCBkaXNhYmxlcyBvdXRwdXQgb2YgZXZlcnl0aGluZyBidXQgZXJyb3JzLlxuICAgICAqL1xuICAgIHB1YmxpYyBfcXVpZXQ6IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIG91dHB1dFN0cmVhbTogV3JpdGFibGVTdHJlYW07XG5cbiAgICBjb25zdHJ1Y3RvcihzdGRvdXQ/OiBXcml0YWJsZVN0cmVhbSkge1xuICAgICAgICB0aGlzLl9xdWlldCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl92ZXJib3NlID0gZmFsc2U7XG4gICAgICAgIGlmIChzdGRvdXQpIHtcbiAgICAgICAgICAgIHRoaXMub3V0cHV0U3RyZWFtID0gc3Rkb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vdXRwdXRTdHJlYW0gPSBwcm9jZXNzLnN0ZG91dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZXRWZXJib3NlKCkge1xuICAgICAgICB0aGlzLl92ZXJib3NlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0UXVpZXQoKSB7XG4gICAgICAgIHRoaXMuX3F1aWV0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXN0LCB3ZXRoZXIgdmVyYm9zZSBpcyBlbmFibGVkLlxuICAgICAqIEByZXR1cm4gd2V0aGVyIHZlcmJvc2UgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgdmVyYm9zZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlcmJvc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVzdCwgd2V0aGVyIHF1aWV0IGlzIGVuYWJsZWQuXG4gICAgICogQHJldHVybiB3ZXRoZXIgcXVpZXQgaXMgZW5hYmxlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcXVpZXQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9xdWlldDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXJyb3IobXNnLCAuLi5wYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIHRoaXMubG9nKExvZ0xldmVsLkVSUk9SLCBtc2csIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHdhcm4obXNnLCAuLi5wYXJhbXM6IGFueVtdKSB7XG4gICAgICAgIHRoaXMubG9nKExvZ0xldmVsLldBUk4sIG1zZywgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaW5mbyhtc2csIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwuSU5GTywgbXNnLCBwYXJhbXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWJ1Zyhtc2csIC4uLnBhcmFtczogYW55W10pIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwuREVCVUcsIG1zZywgcGFyYW1zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvZyhsZXZlbDogTG9nTGV2ZWwsIG1zZywgcGFyYW1zOiBhbnlbXSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNPdXRwdXRFbmFibGVkKGxldmVsKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb2xvcmVkTWVzc2FnZTtcbiAgICAgICAgc3dpdGNoIChsZXZlbCkge1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5FUlJPUjpcbiAgICAgICAgICAgICAgICBjb2xvcmVkTWVzc2FnZSA9IGNoYWxrLnJlZCgnRVJST1I6ICcgKyBtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxuICAgICAgICAgICAgICAgIGNvbG9yZWRNZXNzYWdlID0gY2hhbGsubWFnZW50YSgnV0FSTklORzogJyArIG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbG9yZWRNZXNzYWdlID0gY2hhbGsuZ3JheSgnKiAnICsgbXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvdXRNc2cgPSBmb3JtYXQoY29sb3JlZE1lc3NhZ2UsIC4uLnBhcmFtcyk7XG4gICAgICAgIHRoaXMub3V0cHV0U3RyZWFtLndyaXRlKG91dE1zZyArICdcXG4nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzT3V0cHV0RW5hYmxlZChsZXZlbDogTG9nTGV2ZWwpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHF1aWV0RW5hYmxlZCwgdmVyYm9zZUVuYWJsZWQ6IGJvb2xlYW47XG4gICAgICAgIGlmICh0aGlzLl9xdWlldCAmJiB0aGlzLl92ZXJib3NlKSB7XG4gICAgICAgICAgICBxdWlldEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZlcmJvc2VFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxdWlldEVuYWJsZWQgPSB0aGlzLl9xdWlldDtcbiAgICAgICAgICAgIHZlcmJvc2VFbmFibGVkID0gdGhpcy5fdmVyYm9zZTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLkVSUk9SOlxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOyAgICAvLyBhbHdheXMgb3V0cHV0IGVycm9yc1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5XQVJOOlxuICAgICAgICAgICAgICAgIHJldHVybiAoIXF1aWV0RW5hYmxlZCk7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLklORk86XG4gICAgICAgICAgICAgICAgcmV0dXJuICh2ZXJib3NlRW5hYmxlZCAmJiAhcXVpZXRFbmFibGVkKTtcbiAgICAgICAgICAgIGNhc2UgTG9nTGV2ZWwuREVCVUc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZlcmJvc2VFbmFibGVkO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==