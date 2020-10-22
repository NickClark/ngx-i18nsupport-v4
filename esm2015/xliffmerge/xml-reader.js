/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { FileUtil } from '../common/file-util';
/**
 * Created by martin on 10.03.2017.
 * Helper class to read XMl with a correct encoding.
 */
export class XmlReader {
    /**
     * Read an xml-File.
     * @param {?} path Path to file
     * @param {?=} encoding optional encoding of the xml.
     * This is read from the file, but if you know it before, you can avoid reading the file twice.
     * @return {?} file content and encoding found in the file.
     */
    static readXmlFileContent(path, encoding) {
        if (!encoding) {
            encoding = XmlReader.DEFAULT_ENCODING;
        }
        /** @type {?} */
        let content = FileUtil.read(path, encoding);
        /** @type {?} */
        const foundEncoding = XmlReader.encodingFromXml(content);
        if (foundEncoding !== encoding) {
            // read again with the correct encoding
            content = FileUtil.read(path, foundEncoding);
        }
        return {
            content: content,
            encoding: foundEncoding
        };
    }
    /**
     * Read the encoding from the xml.
     * xml File starts with .. encoding=".."
     * @private
     * @param {?} xmlString xmlString
     * @return {?} encoding
     */
    static encodingFromXml(xmlString) {
        /** @type {?} */
        const index = xmlString.indexOf('encoding="');
        if (index < 0) {
            return this.DEFAULT_ENCODING; // default in xml if not explicitly set
        }
        /** @type {?} */
        const endIndex = xmlString.indexOf('"', index + 10);
        return xmlString.substring(index + 10, endIndex);
    }
}
XmlReader.DEFAULT_ENCODING = 'UTF-8';
if (false) {
    /** @type {?} */
    XmlReader.DEFAULT_ENCODING;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sLXJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtaTE4bnN1cHBvcnQvbmd4LWkxOG5zdXBwb3J0LyIsInNvdXJjZXMiOlsieGxpZmZtZXJnZS94bWwtcmVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0scUJBQXFCLENBQUM7Ozs7O0FBTTdDLE1BQU0sT0FBTyxTQUFTOzs7Ozs7OztJQVVYLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFZLEVBQUUsUUFBaUI7UUFDNUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNYLFFBQVEsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUM7U0FDekM7O1lBQ0csT0FBTyxHQUFXLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQzs7Y0FDN0MsYUFBYSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBQ3hELElBQUksYUFBYSxLQUFLLFFBQVEsRUFBRTtZQUM1Qix1Q0FBdUM7WUFDdkMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ2hEO1FBQ0QsT0FBTztZQUNILE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFFBQVEsRUFBRSxhQUFhO1NBQzFCLENBQUM7SUFDTixDQUFDOzs7Ozs7OztJQVFPLE1BQU0sQ0FBQyxlQUFlLENBQUMsU0FBaUI7O2NBQ3RDLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUM3QyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDWCxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLHVDQUF1QztTQUN4RTs7Y0FDSyxRQUFRLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNuRCxPQUFPLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNyRCxDQUFDOztBQXRDTSwwQkFBZ0IsR0FBRyxPQUFPLENBQUM7OztJQUFsQywyQkFBa0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0ZpbGVVdGlsfSBmcm9tICcuLi9jb21tb24vZmlsZS11dGlsJztcbi8qKlxuICogQ3JlYXRlZCBieSBtYXJ0aW4gb24gMTAuMDMuMjAxNy5cbiAqIEhlbHBlciBjbGFzcyB0byByZWFkIFhNbCB3aXRoIGEgY29ycmVjdCBlbmNvZGluZy5cbiAqL1xuXG5leHBvcnQgY2xhc3MgWG1sUmVhZGVyIHtcbiAgICBzdGF0aWMgREVGQVVMVF9FTkNPRElORyA9ICdVVEYtOCc7XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIGFuIHhtbC1GaWxlLlxuICAgICAqIEBwYXJhbSBwYXRoIFBhdGggdG8gZmlsZVxuICAgICAqIEBwYXJhbSBlbmNvZGluZyBvcHRpb25hbCBlbmNvZGluZyBvZiB0aGUgeG1sLlxuICAgICAqIFRoaXMgaXMgcmVhZCBmcm9tIHRoZSBmaWxlLCBidXQgaWYgeW91IGtub3cgaXQgYmVmb3JlLCB5b3UgY2FuIGF2b2lkIHJlYWRpbmcgdGhlIGZpbGUgdHdpY2UuXG4gICAgICogQHJldHVybiBmaWxlIGNvbnRlbnQgYW5kIGVuY29kaW5nIGZvdW5kIGluIHRoZSBmaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZFhtbEZpbGVDb250ZW50KHBhdGg6IHN0cmluZywgZW5jb2Rpbmc/OiBzdHJpbmcpOiB7Y29udGVudDogc3RyaW5nLCBlbmNvZGluZzogc3RyaW5nfSB7XG4gICAgICAgIGlmICghZW5jb2RpbmcpIHtcbiAgICAgICAgICAgIGVuY29kaW5nID0gWG1sUmVhZGVyLkRFRkFVTFRfRU5DT0RJTkc7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNvbnRlbnQ6IHN0cmluZyA9IEZpbGVVdGlsLnJlYWQocGF0aCwgZW5jb2RpbmcpO1xuICAgICAgICBjb25zdCBmb3VuZEVuY29kaW5nID0gWG1sUmVhZGVyLmVuY29kaW5nRnJvbVhtbChjb250ZW50KTtcbiAgICAgICAgaWYgKGZvdW5kRW5jb2RpbmcgIT09IGVuY29kaW5nKSB7XG4gICAgICAgICAgICAvLyByZWFkIGFnYWluIHdpdGggdGhlIGNvcnJlY3QgZW5jb2RpbmdcbiAgICAgICAgICAgIGNvbnRlbnQgPSBGaWxlVXRpbC5yZWFkKHBhdGgsIGZvdW5kRW5jb2RpbmcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50OiBjb250ZW50LFxuICAgICAgICAgICAgZW5jb2Rpbmc6IGZvdW5kRW5jb2RpbmdcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIHRoZSBlbmNvZGluZyBmcm9tIHRoZSB4bWwuXG4gICAgICogeG1sIEZpbGUgc3RhcnRzIHdpdGggLi4gZW5jb2Rpbmc9XCIuLlwiXG4gICAgICogQHBhcmFtIHhtbFN0cmluZyB4bWxTdHJpbmdcbiAgICAgKiBAcmV0dXJuIGVuY29kaW5nXG4gICAgICovXG4gICAgcHJpdmF0ZSBzdGF0aWMgZW5jb2RpbmdGcm9tWG1sKHhtbFN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB4bWxTdHJpbmcuaW5kZXhPZignZW5jb2Rpbmc9XCInKTtcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuREVGQVVMVF9FTkNPRElORzsgLy8gZGVmYXVsdCBpbiB4bWwgaWYgbm90IGV4cGxpY2l0bHkgc2V0XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZW5kSW5kZXggPSB4bWxTdHJpbmcuaW5kZXhPZignXCInLCBpbmRleCArIDEwKTsgLy8gMTAgPSBsZW5ndGggb2YgJ2VuY29kaW5nPVwiJ1xuICAgICAgICByZXR1cm4geG1sU3RyaW5nLnN1YnN0cmluZyhpbmRleCArIDEwLCBlbmRJbmRleCk7XG4gICAgfVxuXG59XG5cbiJdfQ==