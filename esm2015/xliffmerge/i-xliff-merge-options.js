/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by roobm on 15.03.2017.
 * Interfaces for command line call and config file content.
 */
/**
 * Options that can be passed as program arguments.
 * @record
 */
export function ProgramOptions() { }
if (false) {
    /** @type {?|undefined} */
    ProgramOptions.prototype.quiet;
    /** @type {?|undefined} */
    ProgramOptions.prototype.verbose;
    /** @type {?|undefined} */
    ProgramOptions.prototype.profilePath;
    /** @type {?|undefined} */
    ProgramOptions.prototype.languages;
}
/**
 * Definition of the possible values used in the config file
 * @record
 */
export function IConfigFile() { }
if (false) {
    /** @type {?|undefined} */
    IConfigFile.prototype.xliffmergeOptions;
}
/**
 * @record
 */
export function IXliffMergeOptions() { }
if (false) {
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.quiet;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.verbose;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.allowIdChange;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.defaultLanguage;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.languages;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.srcDir;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.i18nBaseFile;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.i18nFile;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.i18nFormat;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.encoding;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.genDir;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.angularCompilerOptions;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.removeUnusedIds;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.supportNgxTranslate;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.ngxTranslateExtractionPattern;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.useSourceAsTarget;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.targetPraefix;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.targetSuffix;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.beautifyOutput;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.preserveOrder;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.autotranslate;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.apikey;
    /** @type {?|undefined} */
    IXliffMergeOptions.prototype.apikeyfile;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaS14bGlmZi1tZXJnZS1vcHRpb25zLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1pMThuc3VwcG9ydC9uZ3gtaTE4bnN1cHBvcnQvIiwic291cmNlcyI6WyJ4bGlmZm1lcmdlL2kteGxpZmYtbWVyZ2Utb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxvQ0FLQzs7O0lBSkcsK0JBQWdCOztJQUNoQixpQ0FBa0I7O0lBQ2xCLHFDQUFxQjs7SUFDckIsbUNBQXFCOzs7Ozs7QUFNekIsaUNBR0M7OztJQURHLHdDQUF1Qzs7Ozs7QUFHM0Msd0NBOEJDOzs7SUE3QkcsbUNBQWdCOztJQUNoQixxQ0FBa0I7O0lBQ2xCLDJDQUF3Qjs7SUFDeEIsNkNBQXlCOztJQUN6Qix1Q0FBcUI7O0lBQ3JCLG9DQUFnQjs7SUFDaEIsMENBQXNCOztJQUN0QixzQ0FBa0I7O0lBQ2xCLHdDQUFvQjs7SUFDcEIsc0NBQWtCOztJQUNsQixvQ0FBZ0I7O0lBQ2hCLG9EQUVFOztJQUNGLDZDQUEwQjs7SUFDMUIsaURBQThCOztJQUM5QiwyREFBdUM7O0lBRXZDLCtDQUE0Qjs7SUFDNUIsMkNBQXVCOztJQUN2QiwwQ0FBc0I7O0lBQ3RCLDRDQUF5Qjs7SUFDekIsMkNBQXdCOztJQUN4QiwyQ0FBaUM7O0lBSWpDLG9DQUFnQjs7SUFDaEIsd0NBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHJvb2JtIG9uIDE1LjAzLjIwMTcuXG4gKiBJbnRlcmZhY2VzIGZvciBjb21tYW5kIGxpbmUgY2FsbCBhbmQgY29uZmlnIGZpbGUgY29udGVudC5cbiAqL1xuXG4vKipcbiAqIE9wdGlvbnMgdGhhdCBjYW4gYmUgcGFzc2VkIGFzIHByb2dyYW0gYXJndW1lbnRzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFByb2dyYW1PcHRpb25zIHtcbiAgICBxdWlldD86IGJvb2xlYW47XG4gICAgdmVyYm9zZT86IGJvb2xlYW47XG4gICAgcHJvZmlsZVBhdGg/OiBzdHJpbmc7XG4gICAgbGFuZ3VhZ2VzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogRGVmaW5pdGlvbiBvZiB0aGUgcG9zc2libGUgdmFsdWVzIHVzZWQgaW4gdGhlIGNvbmZpZyBmaWxlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbmZpZ0ZpbGUge1xuICAgIC8vIGNvbnRlbnQgaXMgd3JhcHBlZCBpbiBcInhsaWZmbWVyZ2VPcHRpb25zXCIgdG8gYWxsb3cgdG8gdXNlIGl0IGVtYmVkZGVkIGluIGFub3RoZXIgY29uZmlnIGZpbGUgKGUuZy4gdHNjb25maWcuanNvbilcbiAgICB4bGlmZm1lcmdlT3B0aW9ucz86IElYbGlmZk1lcmdlT3B0aW9ucztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJWGxpZmZNZXJnZU9wdGlvbnMge1xuICAgIHF1aWV0PzogYm9vbGVhbjsgICAvLyBGbGFnIHRvIG9ubHkgb3V0cHV0IGVycm9yIG1lc3NhZ2VzXG4gICAgdmVyYm9zZT86IGJvb2xlYW47ICAgLy8gRmxhZyB0byBnZW5lcmF0ZSBkZWJ1ZyBvdXRwdXQgbWVzc2FnZXNcbiAgICBhbGxvd0lkQ2hhbmdlPzogYm9vbGVhbjsgLy8gVHJ5IHRvIGZpbmQgdHJhbnNsYXRpb24gZXZlbiB3aGVuIGlkIGlzIG1pc3NpbmdcbiAgICBkZWZhdWx0TGFuZ3VhZ2U/OiBzdHJpbmc7ICAgIC8vIHRoZSBkZWZhdWx0IGxhbmd1YWdlICh0aGUgbGFuZ3VhZ2UsIHdoaWNoIGlzIHVzZWQgaW4gdGhlIG9yaWdpbmFsIHRlbXBsYXRlcylcbiAgICBsYW5ndWFnZXM/OiBzdHJpbmdbXTsgICAvLyBhbGwgbGFuZ3VhZ2VzLCBpZiBub3Qgc3BlY2lmaWVkIHZpYSBjb21tYW5kbGluZVxuICAgIHNyY0Rpcj86IHN0cmluZzsgICAgLy8gRGlyZWN0b3J5LCB3aGVyZSB0aGUgbWFzdGVyIGZpbGUgaXNcbiAgICBpMThuQmFzZUZpbGU/OiBzdHJpbmc7IC8vIEJhc2VuYW1lIGZvciBpMThuIGlucHV0IGFuZCBvdXRwdXQsIGRlZmF1bHQgaXMgJ21lc3NhZ2VzJ1xuICAgIGkxOG5GaWxlPzogc3RyaW5nOyAgLy8gbWFzdGVyIGZpbGUsIGlmIG5vdCBhYnNvbHV0ZSwgaXQgaXMgcmVsYXRpdmUgdG8gc3JjRGlyXG4gICAgaTE4bkZvcm1hdD86IHN0cmluZzsgLy8geGxmIG9yIHhtYlxuICAgIGVuY29kaW5nPzogc3RyaW5nOyAgLy8gZW5jb2RpbmcgdG8gd3JpdGUgeG1sXG4gICAgZ2VuRGlyPzogc3RyaW5nOyAgICAvLyBkaXJlY3RvcnksIHdoZXJlIHRoZSBmaWxlcyBhcmUgd3JpdHRlbiB0b1xuICAgIGFuZ3VsYXJDb21waWxlck9wdGlvbnM/OiB7XG4gICAgICAgIGdlbkRpcj86IHN0cmluZzsgICAgLy8gc2FtZSBhcyBnZW5EaXIsIGp1c3QgdG8gYmUgY29tcGF0aWJsZSB3aXRoIG5nLXhpMThuXG4gICAgfTtcbiAgICByZW1vdmVVbnVzZWRJZHM/OiBib29sZWFuO1xuICAgIHN1cHBvcnROZ3hUcmFuc2xhdGU/OiBib29sZWFuOyAgLy8gRmxhZywgd2V0aGVyIG91dHB1dCBmb3Igbmd4LXRyYW5zbGF0ZSBzaG91bGQgYmUgZ2VuZXJhdGVkXG4gICAgbmd4VHJhbnNsYXRlRXh0cmFjdGlvblBhdHRlcm4/OiBzdHJpbmc7IC8vIENyaXRlcmlhLCB3aGF0IG1lc3NhZ2VzIHNob3VsZCBiZSB1c2VkIGZvciBuZ3gtdHJhbnNsYXRlIG91dHB1dFxuICAgICAgLy8gc2VlIGRldGFpbHMgb24gdGhlIGRvY3VtZW50YXRpb24gcGFnZSBodHRwczovL2dpdGh1Yi5jb20vbWFydGlucm9vYi9uZ3gtaTE4bnN1cHBvcnQvd2lraS9uZ3gtdHJhbnNsYXRlLXVzYWdlXG4gICAgdXNlU291cmNlQXNUYXJnZXQ/OiBib29sZWFuOyAvLyBGbGFnLCB3aGV0aGVyIHNvdXJjZSBtdXN0IGJlIHVzZWQgYXMgdGFyZ2V0IGZvciBuZXcgdHJhbnMtdW5pdHNcbiAgICB0YXJnZXRQcmFlZml4Pzogc3RyaW5nOyAvLyBQcmFlZml4IGZvciB0YXJnZXQgY29waWVkIGZyb20gc291cmNlZFxuICAgIHRhcmdldFN1ZmZpeD86IHN0cmluZzsgLy8gU3VmZml4IGZvciB0YXJnZXQgY29waWVkIGZyb20gc291cmNlZFxuICAgIGJlYXV0aWZ5T3V0cHV0PzogYm9vbGVhbjsgLy8gYmVhdXRpZnkgb3V0cHV0XG4gICAgcHJlc2VydmVPcmRlcj86IGJvb2xlYW47IC8vIHByZXNlcnZlIG9yZGVyIG9mIG5ldyB0cmFucyB1bml0c1xuICAgIGF1dG90cmFuc2xhdGU/OiBib29sZWFufHN0cmluZ1tdOyAvLyBlbmFibGUgYXV0byB0cmFuc2xhdGUgdmlhIEdvb2dsZSBUcmFuc2xhdGVcbiAgICAgICAgLy8gaWYgaXQgaXMgYW4gYXJyYXksIGxpc3Qgb2YgbGFuZ3VhZ2VzIHRvIGF1dG90cmFuc2xhdGVcbiAgICAgICAgLy8gaWYgaXQgaXMgdHJ1ZSwgYXV0b3RyYW5zbGF0ZSBhbGwgbGFuZ3VhZ2VzIChleGNlcHQgc291cmNlIGxhbmd1YWdlIG9mIGNvdXJzZSlcbiAgICAgICAgLy8gaWYgaXQgaXMgZmFsc2UgKGRlZmF1bHQpIG5vIGF1dG90cmFuc2xhdGVcbiAgICBhcGlrZXk/OiBzdHJpbmc7ICAgIC8vIEFQSSBLZXkgZm9yIEdvb2dsZSBUcmFuc2xhdGUsIHJlcXVpcmVkIGlmIGF1dG90cmFuc2xhdGUgaXMgZW5hYmxlZFxuICAgIGFwaWtleWZpbGU/OiBzdHJpbmc7ICAgIC8vIGZpbGUgbmFtZSB3aGVyZSBBUEkgS2V5IGZvciBHb29nbGUgVHJhbnNsYXRlIGNhbiBiZSByZWFkIGZyb21cbn1cblxuIl19