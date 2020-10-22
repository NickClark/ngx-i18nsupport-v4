/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Created by roobm on 21.03.2017.
 */
import { TranslationMessagesFileFactory } from '@ngx-i18nsupport/ngx-i18nsupport-lib';
import { FileUtil } from '../common/file-util';
import { XmlReader } from './xml-reader';
/**
 * Helper class to read translation files depending on format.
 */
export class TranslationMessagesFileReader {
    /**
     * Read file function, result depends on format, either XliffFile or XmbFile.
     * @param {?} i18nFormat format
     * @param {?} path path
     * @param {?} encoding encoding
     * @param {?=} optionalMasterFilePath optionalMasterFilePath
     * @return {?} XliffFile
     */
    static fromFile(i18nFormat, path, encoding, optionalMasterFilePath) {
        /** @type {?} */
        const xmlContent = XmlReader.readXmlFileContent(path, encoding);
        /** @type {?} */
        const optionalMaster = TranslationMessagesFileReader.masterFileContent(optionalMasterFilePath, encoding);
        return TranslationMessagesFileFactory.fromFileContent(i18nFormat, xmlContent.content, path, xmlContent.encoding, optionalMaster);
    }
    /**
     * Read file function, result depends on format, either XliffFile or XmbFile.
     * @param {?} path path
     * @param {?} encoding encoding
     * @param {?=} optionalMasterFilePath optionalMasterFilePath
     * @return {?} XliffFile
     */
    static fromUnknownFormatFile(path, encoding, optionalMasterFilePath) {
        /** @type {?} */
        const xmlContent = XmlReader.readXmlFileContent(path, encoding);
        /** @type {?} */
        const optionalMaster = TranslationMessagesFileReader.masterFileContent(optionalMasterFilePath, encoding);
        return TranslationMessagesFileFactory.fromUnknownFormatFileContent(xmlContent.content, path, xmlContent.encoding, optionalMaster);
    }
    /**
     * Read master xmb file
     * @private
     * @param {?} optionalMasterFilePath optionalMasterFilePath
     * @param {?} encoding encoding
     * @return {?} content and encoding of file
     */
    static masterFileContent(optionalMasterFilePath, encoding) {
        if (optionalMasterFilePath) {
            /** @type {?} */
            const masterXmlContent = XmlReader.readXmlFileContent(optionalMasterFilePath, encoding);
            return {
                xmlContent: masterXmlContent.content,
                path: optionalMasterFilePath,
                encoding: masterXmlContent.encoding
            };
        }
        else {
            return null;
        }
    }
    /**
     * Save edited file.
     * @param {?} messagesFile messagesFile
     * @param {?=} beautifyOutput Flag whether to use pretty-data to format the output.
     * XMLSerializer produces some correct but strangely formatted output, which pretty-data can correct.
     * See issue #64 for details.
     * Default is false.
     * @return {?}
     */
    static save(messagesFile, beautifyOutput) {
        FileUtil.replaceContent(messagesFile.filename(), messagesFile.editedContent(beautifyOutput), messagesFile.encoding());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb24tbWVzc2FnZXMtZmlsZS1yZWFkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LWkxOG5zdXBwb3J0L25neC1pMThuc3VwcG9ydC8iLCJzb3VyY2VzIjpbInhsaWZmbWVyZ2UvdHJhbnNsYXRpb24tbWVzc2FnZXMtZmlsZS1yZWFkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBLE9BQU8sRUFBQyw4QkFBOEIsRUFBMkIsTUFBTSxzQ0FBc0MsQ0FBQztBQUM5RyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7OztBQUt2QyxNQUFNLE9BQU8sNkJBQTZCOzs7Ozs7Ozs7SUFVL0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFrQixFQUNsQixJQUFZLEVBQ1osUUFBZ0IsRUFDaEIsc0JBQStCOztjQUM1QyxVQUFVLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUM7O2NBQ3pELGNBQWMsR0FBRyw2QkFBNkIsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUM7UUFDeEcsT0FBTyw4QkFBOEIsQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDckksQ0FBQzs7Ozs7Ozs7SUFTTSxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBWSxFQUNaLFFBQWdCLEVBQ2hCLHNCQUErQjs7Y0FDekQsVUFBVSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDOztjQUN6RCxjQUFjLEdBQUcsNkJBQTZCLENBQUMsaUJBQWlCLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxDQUFDO1FBQ3hHLE9BQU8sOEJBQThCLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUN0SSxDQUFDOzs7Ozs7OztJQVFPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBOEIsRUFBRSxRQUFnQjtRQUU3RSxJQUFJLHNCQUFzQixFQUFFOztrQkFDbEIsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixFQUFFLFFBQVEsQ0FBQztZQUN2RixPQUFPO2dCQUNILFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPO2dCQUNwQyxJQUFJLEVBQUUsc0JBQXNCO2dCQUM1QixRQUFRLEVBQUUsZ0JBQWdCLENBQUMsUUFBUTthQUN0QyxDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFDTCxDQUFDOzs7Ozs7Ozs7O0lBVU0sTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFzQyxFQUFFLGNBQXdCO1FBQy9FLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLFlBQVksQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDMUgsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHJvb2JtIG9uIDIxLjAzLjIwMTcuXG4gKi9cbmltcG9ydCB7VHJhbnNsYXRpb25NZXNzYWdlc0ZpbGVGYWN0b3J5LCBJVHJhbnNsYXRpb25NZXNzYWdlc0ZpbGV9IGZyb20gJ0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LWxpYic7XG5pbXBvcnQge0ZpbGVVdGlsfSBmcm9tICcuLi9jb21tb24vZmlsZS11dGlsJztcbmltcG9ydCB7WG1sUmVhZGVyfSBmcm9tICcuL3htbC1yZWFkZXInO1xuXG4vKipcbiAqIEhlbHBlciBjbGFzcyB0byByZWFkIHRyYW5zbGF0aW9uIGZpbGVzIGRlcGVuZGluZyBvbiBmb3JtYXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZVJlYWRlciB7XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIGZpbGUgZnVuY3Rpb24sIHJlc3VsdCBkZXBlbmRzIG9uIGZvcm1hdCwgZWl0aGVyIFhsaWZmRmlsZSBvciBYbWJGaWxlLlxuICAgICAqIEBwYXJhbSBpMThuRm9ybWF0IGZvcm1hdFxuICAgICAqIEBwYXJhbSBwYXRoIHBhdGhcbiAgICAgKiBAcGFyYW0gZW5jb2RpbmcgZW5jb2RpbmdcbiAgICAgKiBAcGFyYW0gb3B0aW9uYWxNYXN0ZXJGaWxlUGF0aCBvcHRpb25hbE1hc3RlckZpbGVQYXRoXG4gICAgICogQHJldHVybiBYbGlmZkZpbGVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGZyb21GaWxlKGkxOG5Gb3JtYXQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY29kaW5nOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25hbE1hc3RlckZpbGVQYXRoPzogc3RyaW5nKTogSVRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlIHtcbiAgICAgICAgY29uc3QgeG1sQ29udGVudCA9IFhtbFJlYWRlci5yZWFkWG1sRmlsZUNvbnRlbnQocGF0aCwgZW5jb2RpbmcpO1xuICAgICAgICBjb25zdCBvcHRpb25hbE1hc3RlciA9IFRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlUmVhZGVyLm1hc3RlckZpbGVDb250ZW50KG9wdGlvbmFsTWFzdGVyRmlsZVBhdGgsIGVuY29kaW5nKTtcbiAgICAgICAgcmV0dXJuIFRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlRmFjdG9yeS5mcm9tRmlsZUNvbnRlbnQoaTE4bkZvcm1hdCwgeG1sQ29udGVudC5jb250ZW50LCBwYXRoLCB4bWxDb250ZW50LmVuY29kaW5nLCBvcHRpb25hbE1hc3Rlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZCBmaWxlIGZ1bmN0aW9uLCByZXN1bHQgZGVwZW5kcyBvbiBmb3JtYXQsIGVpdGhlciBYbGlmZkZpbGUgb3IgWG1iRmlsZS5cbiAgICAgKiBAcGFyYW0gcGF0aCBwYXRoXG4gICAgICogQHBhcmFtIGVuY29kaW5nIGVuY29kaW5nXG4gICAgICogQHBhcmFtIG9wdGlvbmFsTWFzdGVyRmlsZVBhdGggb3B0aW9uYWxNYXN0ZXJGaWxlUGF0aFxuICAgICAqIEByZXR1cm4gWGxpZmZGaWxlXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmcm9tVW5rbm93bkZvcm1hdEZpbGUocGF0aDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY29kaW5nOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uYWxNYXN0ZXJGaWxlUGF0aD86IHN0cmluZyk6IElUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZSB7XG4gICAgICAgIGNvbnN0IHhtbENvbnRlbnQgPSBYbWxSZWFkZXIucmVhZFhtbEZpbGVDb250ZW50KHBhdGgsIGVuY29kaW5nKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uYWxNYXN0ZXIgPSBUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZVJlYWRlci5tYXN0ZXJGaWxlQ29udGVudChvcHRpb25hbE1hc3RlckZpbGVQYXRoLCBlbmNvZGluZyk7XG4gICAgICAgIHJldHVybiBUcmFuc2xhdGlvbk1lc3NhZ2VzRmlsZUZhY3RvcnkuZnJvbVVua25vd25Gb3JtYXRGaWxlQ29udGVudCh4bWxDb250ZW50LmNvbnRlbnQsIHBhdGgsIHhtbENvbnRlbnQuZW5jb2RpbmcsIG9wdGlvbmFsTWFzdGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIG1hc3RlciB4bWIgZmlsZVxuICAgICAqIEBwYXJhbSBvcHRpb25hbE1hc3RlckZpbGVQYXRoIG9wdGlvbmFsTWFzdGVyRmlsZVBhdGhcbiAgICAgKiBAcGFyYW0gZW5jb2RpbmcgZW5jb2RpbmdcbiAgICAgKiBAcmV0dXJuIGNvbnRlbnQgYW5kIGVuY29kaW5nIG9mIGZpbGVcbiAgICAgKi9cbiAgICBwcml2YXRlIHN0YXRpYyBtYXN0ZXJGaWxlQ29udGVudChvcHRpb25hbE1hc3RlckZpbGVQYXRoOiBzdHJpbmcsIGVuY29kaW5nOiBzdHJpbmcpXG4gICAgICAgIDoge3htbENvbnRlbnQ6IHN0cmluZywgcGF0aDogc3RyaW5nLCBlbmNvZGluZzogc3RyaW5nfSB7XG4gICAgICAgIGlmIChvcHRpb25hbE1hc3RlckZpbGVQYXRoKSB7XG4gICAgICAgICAgICBjb25zdCBtYXN0ZXJYbWxDb250ZW50ID0gWG1sUmVhZGVyLnJlYWRYbWxGaWxlQ29udGVudChvcHRpb25hbE1hc3RlckZpbGVQYXRoLCBlbmNvZGluZyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHhtbENvbnRlbnQ6IG1hc3RlclhtbENvbnRlbnQuY29udGVudCxcbiAgICAgICAgICAgICAgICBwYXRoOiBvcHRpb25hbE1hc3RlckZpbGVQYXRoLFxuICAgICAgICAgICAgICAgIGVuY29kaW5nOiBtYXN0ZXJYbWxDb250ZW50LmVuY29kaW5nXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYXZlIGVkaXRlZCBmaWxlLlxuICAgICAqIEBwYXJhbSBtZXNzYWdlc0ZpbGUgbWVzc2FnZXNGaWxlXG4gICAgICogQHBhcmFtIGJlYXV0aWZ5T3V0cHV0IEZsYWcgd2hldGhlciB0byB1c2UgcHJldHR5LWRhdGEgdG8gZm9ybWF0IHRoZSBvdXRwdXQuXG4gICAgICogWE1MU2VyaWFsaXplciBwcm9kdWNlcyBzb21lIGNvcnJlY3QgYnV0IHN0cmFuZ2VseSBmb3JtYXR0ZWQgb3V0cHV0LCB3aGljaCBwcmV0dHktZGF0YSBjYW4gY29ycmVjdC5cbiAgICAgKiBTZWUgaXNzdWUgIzY0IGZvciBkZXRhaWxzLlxuICAgICAqIERlZmF1bHQgaXMgZmFsc2UuXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBzYXZlKG1lc3NhZ2VzRmlsZTogSVRyYW5zbGF0aW9uTWVzc2FnZXNGaWxlLCBiZWF1dGlmeU91dHB1dD86IGJvb2xlYW4pIHtcbiAgICAgICAgRmlsZVV0aWwucmVwbGFjZUNvbnRlbnQobWVzc2FnZXNGaWxlLmZpbGVuYW1lKCksIG1lc3NhZ2VzRmlsZS5lZGl0ZWRDb250ZW50KGJlYXV0aWZ5T3V0cHV0KSwgbWVzc2FnZXNGaWxlLmVuY29kaW5nKCkpO1xuICAgIH1cbn1cblxuIl19