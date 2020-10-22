/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { FileUtil } from '../common/file-util';
/**
 * Created by martin on 10.03.2017.
 * Helper class to read XMl with a correct encoding.
 */
var XmlReader = /** @class */ (function () {
    function XmlReader() {
    }
    /**
     * Read an xml-File.
     * @param path Path to file
     * @param encoding optional encoding of the xml.
     * This is read from the file, but if you know it before, you can avoid reading the file twice.
     * @return file content and encoding found in the file.
     */
    /**
     * Read an xml-File.
     * @param {?} path Path to file
     * @param {?=} encoding optional encoding of the xml.
     * This is read from the file, but if you know it before, you can avoid reading the file twice.
     * @return {?} file content and encoding found in the file.
     */
    XmlReader.readXmlFileContent = /**
     * Read an xml-File.
     * @param {?} path Path to file
     * @param {?=} encoding optional encoding of the xml.
     * This is read from the file, but if you know it before, you can avoid reading the file twice.
     * @return {?} file content and encoding found in the file.
     */
    function (path, encoding) {
        if (!encoding) {
            encoding = XmlReader.DEFAULT_ENCODING;
        }
        /** @type {?} */
        var content = FileUtil.read(path, encoding);
        /** @type {?} */
        var foundEncoding = XmlReader.encodingFromXml(content);
        if (foundEncoding !== encoding) {
            // read again with the correct encoding
            content = FileUtil.read(path, foundEncoding);
        }
        return {
            content: content,
            encoding: foundEncoding
        };
    };
    /**
     * Read the encoding from the xml.
     * xml File starts with .. encoding=".."
     * @param xmlString xmlString
     * @return encoding
     */
    /**
     * Read the encoding from the xml.
     * xml File starts with .. encoding=".."
     * @private
     * @param {?} xmlString xmlString
     * @return {?} encoding
     */
    XmlReader.encodingFromXml = /**
     * Read the encoding from the xml.
     * xml File starts with .. encoding=".."
     * @private
     * @param {?} xmlString xmlString
     * @return {?} encoding
     */
    function (xmlString) {
        /** @type {?} */
        var index = xmlString.indexOf('encoding="');
        if (index < 0) {
            return this.DEFAULT_ENCODING; // default in xml if not explicitly set
        }
        /** @type {?} */
        var endIndex = xmlString.indexOf('"', index + 10);
        return xmlString.substring(index + 10, endIndex);
    };
    XmlReader.DEFAULT_ENCODING = 'UTF-8';
    return XmlReader;
}());
export { XmlReader };
if (false) {
    /** @type {?} */
    XmlReader.DEFAULT_ENCODING;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsieGxpZmZtZXJnZS94bWwtcmVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0scUJBQXFCLENBQUM7Ozs7O0FBTTdDO0lBQUE7SUF5Q0EsQ0FBQztJQXRDRzs7Ozs7O09BTUc7Ozs7Ozs7O0lBQ1csNEJBQWtCOzs7Ozs7O0lBQWhDLFVBQWlDLElBQVksRUFBRSxRQUFpQjtRQUM1RCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsUUFBUSxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQztTQUN6Qzs7WUFDRyxPQUFPLEdBQVcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDOztZQUM3QyxhQUFhLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFDeEQsSUFBSSxhQUFhLEtBQUssUUFBUSxFQUFFO1lBQzVCLHVDQUF1QztZQUN2QyxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDaEQ7UUFDRCxPQUFPO1lBQ0gsT0FBTyxFQUFFLE9BQU87WUFDaEIsUUFBUSxFQUFFLGFBQWE7U0FDMUIsQ0FBQztJQUNOLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDWSx5QkFBZTs7Ozs7OztJQUE5QixVQUErQixTQUFpQjs7WUFDdEMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQzdDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNYLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsdUNBQXVDO1NBQ3hFOztZQUNLLFFBQVEsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ25ELE9BQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUF0Q00sMEJBQWdCLEdBQUcsT0FBTyxDQUFDO0lBd0N0QyxnQkFBQztDQUFBLEFBekNELElBeUNDO1NBekNZLFNBQVM7OztJQUNsQiwyQkFBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0ZpbGVVdGlsfSBmcm9tICcuLi9jb21tb24vZmlsZS11dGlsJztcbi8qKlxuICogQ3JlYXRlZCBieSBtYXJ0aW4gb24gMTAuMDMuMjAxNy5cbiAqIEhlbHBlciBjbGFzcyB0byByZWFkIFhNbCB3aXRoIGEgY29ycmVjdCBlbmNvZGluZy5cbiAqL1xuXG5leHBvcnQgY2xhc3MgWG1sUmVhZGVyIHtcbiAgICBzdGF0aWMgREVGQVVMVF9FTkNPRElORyA9ICdVVEYtOCc7XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIGFuIHhtbC1GaWxlLlxuICAgICAqIEBwYXJhbSBwYXRoIFBhdGggdG8gZmlsZVxuICAgICAqIEBwYXJhbSBlbmNvZGluZyBvcHRpb25hbCBlbmNvZGluZyBvZiB0aGUgeG1sLlxuICAgICAqIFRoaXMgaXMgcmVhZCBmcm9tIHRoZSBmaWxlLCBidXQgaWYgeW91IGtub3cgaXQgYmVmb3JlLCB5b3UgY2FuIGF2b2lkIHJlYWRpbmcgdGhlIGZpbGUgdHdpY2UuXG4gICAgICogQHJldHVybiBmaWxlIGNvbnRlbnQgYW5kIGVuY29kaW5nIGZvdW5kIGluIHRoZSBmaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZFhtbEZpbGVDb250ZW50KHBhdGg6IHN0cmluZywgZW5jb2Rpbmc/OiBzdHJpbmcpOiB7Y29udGVudDogc3RyaW5nLCBlbmNvZGluZzogc3RyaW5nfSB7XG4gICAgICAgIGlmICghZW5jb2RpbmcpIHtcbiAgICAgICAgICAgIGVuY29kaW5nID0gWG1sUmVhZGVyLkRFRkFVTFRfRU5DT0RJTkc7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IEZpbGVVdGlsLnJlYWQocGF0aCwgZW5jb2RpbmcpO1xuICAgICAgICBjb25zdCBmb3VuZEVuY29kaW5nID0gWG1sUmVhZGVyLmVuY29kaW5nRnJvbVhtbChjb250ZW50KTtcbiAgICAgICAgaWYgKGZvdW5kRW5jb2RpbmcgIT09IGVuY29kaW5nKSB7XG4gICAgICAgICAgICAvLyByZWFkIGFnYWluIHdpdGggdGhlIGNvcnJlY3QgZW5jb2RpbmdcbiAgICAgICAgICAgIGNvbnRlbnQgPSBGaWxlVXRpbC5yZWFkKHBhdGgsIGZvdW5kRW5jb2RpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50LFxuICAgICAgICAgICAgZW5jb2Rpbmc6IGZvdW5kRW5jb2RpbmdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIHRoZSBlbmNvZGluZyBmcm9tIHRoZSB4bWwuXG4gICAgICogeG1sIEZpbGUgc3RhcnRzIHdpdGggLi4gZW5jb2Rpbmc9XCIuLlwiXG4gICAgICogQHBhcmFtIHhtbFN0cmluZyB4bWxTdHJpbmdcbiAgICAgKiBAcmV0dXJuIGVuY29kaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW5jb2RpbmdGcm9tWG1sKHhtbFN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB4bWxTdHJpbmcuaW5kZXhPZignZW5jb2Rpbmc9XCInKTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuREVGQVVMVF9FTkNPRElORzsgLy8gZGVmYXVsdCBpbiB4bWwgaWYgbm90IGV4cGxpY2l0bHkgc2V0XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB4bWxTdHJpbmcuaW5kZXhPZignXCInLCBpbmRleCArIDEwKTsgLy8gMTAgPSBsZW5ndGggb2YgJ2VuY29kaW5nPVwiJ1xuICAgICAgICByZXR1cm4geG1sU3RyaW5nLnN1YnN0cmluZyhpbmRleCArIDEwLCBlbmRJbmRleCk7XG4gICAgfVxuXG59XG5cbiJdfQ==