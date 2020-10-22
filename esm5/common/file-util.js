/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as fs from 'fs';
/**
 * Created by martin on 17.02.2017.
 * Some (a few) simple utils for file operations.
 * Just for convenience.
 */
var /**
 * Created by martin on 17.02.2017.
 * Some (a few) simple utils for file operations.
 * Just for convenience.
 */
FileUtil = /** @class */ (function () {
    function FileUtil() {
    }
    /**
     * Check for existence.
     * @param filename filename
     * @return wether file exists
     */
    /**
     * Check for existence.
     * @param {?} filename filename
     * @return {?} wether file exists
     */
    FileUtil.exists = /**
     * Check for existence.
     * @param {?} filename filename
     * @return {?} wether file exists
     */
    function (filename) {
        return fs.existsSync(filename);
    };
    /**
     * Read a file.
     * @param filename filename
     * @param encoding encoding
     * @return content of file
     */
    /**
     * Read a file.
     * @param {?} filename filename
     * @param {?} encoding encoding
     * @return {?} content of file
     */
    FileUtil.read = /**
     * Read a file.
     * @param {?} filename filename
     * @param {?} encoding encoding
     * @return {?} content of file
     */
    function (filename, encoding) {
        return fs.readFileSync(filename, encoding);
    };
    /**
     * Write a file with given content.
     * @param filename filename
     * @param newContent newContent
     * @param encoding encoding
     */
    /**
     * Write a file with given content.
     * @param {?} filename filename
     * @param {?} newContent newContent
     * @param {?} encoding encoding
     * @return {?}
     */
    FileUtil.replaceContent = /**
     * Write a file with given content.
     * @param {?} filename filename
     * @param {?} newContent newContent
     * @param {?} encoding encoding
     * @return {?}
     */
    function (filename, newContent, encoding) {
        fs.writeFileSync(filename, newContent, { encoding: encoding });
    };
    /**
     * @param {?} srcFile
     * @param {?} destFile
     * @return {?}
     */
    FileUtil.copy = /**
     * @param {?} srcFile
     * @param {?} destFile
     * @return {?}
     */
    function (srcFile, destFile) {
        /** @type {?} */
        var BUF_LENGTH = 64 * 1024;
        /** @type {?} */
        var buff = Buffer.alloc(BUF_LENGTH);
        /** @type {?} */
        var fdr = fs.openSync(srcFile, 'r');
        /** @type {?} */
        var fdw = fs.openSync(destFile, 'w');
        /** @type {?} */
        var bytesRead = 1;
        /** @type {?} */
        var pos = 0;
        while (bytesRead > 0) {
            bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
            fs.writeSync(fdw, buff, 0, bytesRead);
            pos += bytesRead;
        }
        fs.closeSync(fdr);
        fs.closeSync(fdw);
    };
    /**
     * Delete the folder and all of its content (rm -rf).
     * @param path path
     */
    /**
     * Delete the folder and all of its content (rm -rf).
     * @param {?} path path
     * @return {?}
     */
    FileUtil.deleteFolderRecursive = /**
     * Delete the folder and all of its content (rm -rf).
     * @param {?} path path
     * @return {?}
     */
    function (path) {
        /** @type {?} */
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((/**
             * @param {?} file
             * @return {?}
             */
            function (file) {
                /** @type {?} */
                var curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    FileUtil.deleteFolderRecursive(curPath);
                }
                else { // delete file
                    fs.unlinkSync(curPath);
                }
            }));
            fs.rmdirSync(path);
        }
    };
    /**
     * Delete folders content recursively, but do not delete folder.
     * Folder is left empty at the end.
     * @param path path
     */
    /**
     * Delete folders content recursively, but do not delete folder.
     * Folder is left empty at the end.
     * @param {?} path path
     * @return {?}
     */
    FileUtil.deleteFolderContentRecursive = /**
     * Delete folders content recursively, but do not delete folder.
     * Folder is left empty at the end.
     * @param {?} path path
     * @return {?}
     */
    function (path) {
        /** @type {?} */
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((/**
             * @param {?} file
             * @return {?}
             */
            function (file) {
                /** @type {?} */
                var curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    FileUtil.deleteFolderRecursive(curPath);
                }
                else { // delete file
                    fs.unlinkSync(curPath);
                }
            }));
        }
    };
    /**
     * Delete a file.
     * @param path path
     */
    /**
     * Delete a file.
     * @param {?} path path
     * @return {?}
     */
    FileUtil.deleteFile = /**
     * Delete a file.
     * @param {?} path path
     * @return {?}
     */
    function (path) {
        fs.unlinkSync(path);
    };
    return FileUtil;
}());
/**
 * Created by martin on 17.02.2017.
 * Some (a few) simple utils for file operations.
 * Just for convenience.
 */
export { FileUtil };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS11dGlsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1pMThuc3VwcG9ydC9uZ3gtaTE4bnN1cHBvcnQvIiwic291cmNlcyI6WyJjb21tb24vZmlsZS11dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQzs7Ozs7O0FBUXpCOzs7Ozs7SUFBQTtJQThGQSxDQUFDO0lBNUZHOzs7O09BSUc7Ozs7OztJQUNXLGVBQU07Ozs7O0lBQXBCLFVBQXFCLFFBQWdCO1FBQ2pDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7SUFDVyxhQUFJOzs7Ozs7SUFBbEIsVUFBbUIsUUFBZ0IsRUFBRSxRQUFnQjtRQUNqRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDVyx1QkFBYzs7Ozs7OztJQUE1QixVQUE2QixRQUFnQixFQUFFLFVBQWtCLEVBQUUsUUFBZ0I7UUFDL0UsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7SUFDakUsQ0FBQzs7Ozs7O0lBRWEsYUFBSTs7Ozs7SUFBbEIsVUFBbUIsT0FBZSxFQUFFLFFBQWdCOztZQUMxQyxVQUFVLEdBQUcsRUFBRSxHQUFHLElBQUk7O1lBQ3RCLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQzs7WUFDL0IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQzs7WUFDL0IsR0FBRyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQzs7WUFDbEMsU0FBUyxHQUFHLENBQUM7O1lBQ2IsR0FBRyxHQUFHLENBQUM7UUFDWCxPQUFPLFNBQVMsR0FBRyxDQUFDLEVBQUU7WUFDbEIsU0FBUyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdEMsR0FBRyxJQUFJLFNBQVMsQ0FBQztTQUNwQjtRQUNELEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7SUFDVyw4QkFBcUI7Ozs7O0lBQW5DLFVBQW9DLElBQVk7O1lBQ3hDLEtBQUssR0FBRyxFQUFFO1FBQ2QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFHO1lBQ3RCLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLEtBQUssQ0FBQyxPQUFPOzs7O1lBQUMsVUFBUyxJQUFJOztvQkFDakIsT0FBTyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSTtnQkFDakMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsVUFBVTtvQkFDakQsUUFBUSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMzQztxQkFBTSxFQUFFLGNBQWM7b0JBQ25CLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzFCO1lBQ0wsQ0FBQyxFQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7Ozs7Ozs7SUFDVyxxQ0FBNEI7Ozs7OztJQUExQyxVQUEyQyxJQUFZOztZQUMvQyxLQUFLLEdBQUcsRUFBRTtRQUNkLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRztZQUN0QixLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixLQUFLLENBQUMsT0FBTzs7OztZQUFDLFVBQVMsSUFBSTs7b0JBQ2pCLE9BQU8sR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUk7Z0JBQ2pDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxFQUFFLFVBQVU7b0JBQ2pELFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDM0M7cUJBQU0sRUFBRSxjQUFjO29CQUNuQixFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMxQjtZQUNMLENBQUMsRUFBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQ7OztPQUdHOzs7Ozs7SUFDVyxtQkFBVTs7Ozs7SUFBeEIsVUFBeUIsSUFBWTtRQUNqQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFDTCxlQUFDO0FBQUQsQ0FBQyxBQTlGRCxJQThGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcblxuLyoqXG4gKiBDcmVhdGVkIGJ5IG1hcnRpbiBvbiAxNy4wMi4yMDE3LlxuICogU29tZSAoYSBmZXcpIHNpbXBsZSB1dGlscyBmb3IgZmlsZSBvcGVyYXRpb25zLlxuICogSnVzdCBmb3IgY29udmVuaWVuY2UuXG4gKi9cblxuZXhwb3J0IGNsYXNzIEZpbGVVdGlsIHtcblxuICAgIC8qKlxuICAgICAqIENoZWNrIGZvciBleGlzdGVuY2UuXG4gICAgICogQHBhcmFtIGZpbGVuYW1lIGZpbGVuYW1lXG4gICAgICogQHJldHVybiB3ZXRoZXIgZmlsZSBleGlzdHNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGV4aXN0cyhmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBmcy5leGlzdHNTeW5jKGZpbGVuYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFkIGEgZmlsZS5cbiAgICAgKiBAcGFyYW0gZmlsZW5hbWUgZmlsZW5hbWVcbiAgICAgKiBAcGFyYW0gZW5jb2RpbmcgZW5jb2RpbmdcbiAgICAgKiBAcmV0dXJuIGNvbnRlbnQgb2YgZmlsZVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZChmaWxlbmFtZTogc3RyaW5nLCBlbmNvZGluZzogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsIGVuY29kaW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXcml0ZSBhIGZpbGUgd2l0aCBnaXZlbiBjb250ZW50LlxuICAgICAqIEBwYXJhbSBmaWxlbmFtZSBmaWxlbmFtZVxuICAgICAqIEBwYXJhbSBuZXdDb250ZW50IG5ld0NvbnRlbnRcbiAgICAgKiBAcGFyYW0gZW5jb2RpbmcgZW5jb2RpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlcGxhY2VDb250ZW50KGZpbGVuYW1lOiBzdHJpbmcsIG5ld0NvbnRlbnQ6IHN0cmluZywgZW5jb2Rpbmc6IHN0cmluZykge1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lLCBuZXdDb250ZW50LCB7ZW5jb2Rpbmc6IGVuY29kaW5nfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjb3B5KHNyY0ZpbGU6IHN0cmluZywgZGVzdEZpbGU6IHN0cmluZykge1xuICAgICAgICBjb25zdCBCVUZfTEVOR1RIID0gNjQgKiAxMDI0O1xuICAgICAgICBjb25zdCBidWZmID0gQnVmZmVyLmFsbG9jKEJVRl9MRU5HVEgpO1xuICAgICAgICBjb25zdCBmZHIgPSBmcy5vcGVuU3luYyhzcmNGaWxlLCAncicpO1xuICAgICAgICBjb25zdCBmZHcgPSBmcy5vcGVuU3luYyhkZXN0RmlsZSwgJ3cnKTtcbiAgICAgICAgbGV0IGJ5dGVzUmVhZCA9IDE7XG4gICAgICAgIGxldCBwb3MgPSAwO1xuICAgICAgICB3aGlsZSAoYnl0ZXNSZWFkID4gMCkge1xuICAgICAgICAgICAgYnl0ZXNSZWFkID0gZnMucmVhZFN5bmMoZmRyLCBidWZmLCAwLCBCVUZfTEVOR1RILCBwb3MpO1xuICAgICAgICAgICAgZnMud3JpdGVTeW5jKGZkdywgYnVmZiwgMCwgYnl0ZXNSZWFkKTtcbiAgICAgICAgICAgIHBvcyArPSBieXRlc1JlYWQ7XG4gICAgICAgIH1cbiAgICAgICAgZnMuY2xvc2VTeW5jKGZkcik7XG4gICAgICAgIGZzLmNsb3NlU3luYyhmZHcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSB0aGUgZm9sZGVyIGFuZCBhbGwgb2YgaXRzIGNvbnRlbnQgKHJtIC1yZikuXG4gICAgICogQHBhcmFtIHBhdGggcGF0aFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZGVsZXRlRm9sZGVyUmVjdXJzaXZlKHBhdGg6IHN0cmluZykge1xuICAgICAgICBsZXQgZmlsZXMgPSBbXTtcbiAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aCkgKSB7XG4gICAgICAgICAgICBmaWxlcyA9IGZzLnJlYWRkaXJTeW5jKHBhdGgpO1xuICAgICAgICAgICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VyUGF0aCA9IHBhdGggKyAnLycgKyBmaWxlO1xuICAgICAgICAgICAgICAgIGlmIChmcy5sc3RhdFN5bmMoY3VyUGF0aCkuaXNEaXJlY3RvcnkoKSkgeyAvLyByZWN1cnNlXG4gICAgICAgICAgICAgICAgICAgIEZpbGVVdGlsLmRlbGV0ZUZvbGRlclJlY3Vyc2l2ZShjdXJQYXRoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBkZWxldGUgZmlsZVxuICAgICAgICAgICAgICAgICAgICBmcy51bmxpbmtTeW5jKGN1clBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZnMucm1kaXJTeW5jKHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVsZXRlIGZvbGRlcnMgY29udGVudCByZWN1cnNpdmVseSwgYnV0IGRvIG5vdCBkZWxldGUgZm9sZGVyLlxuICAgICAqIEZvbGRlciBpcyBsZWZ0IGVtcHR5IGF0IHRoZSBlbmQuXG4gICAgICogQHBhcmFtIHBhdGggcGF0aFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZGVsZXRlRm9sZGVyQ29udGVudFJlY3Vyc2l2ZShwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGZpbGVzID0gW107XG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGgpICkge1xuICAgICAgICAgICAgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhwYXRoKTtcbiAgICAgICAgICAgIGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBwYXRoICsgJy8nICsgZmlsZTtcbiAgICAgICAgICAgICAgICBpZiAoZnMubHN0YXRTeW5jKGN1clBhdGgpLmlzRGlyZWN0b3J5KCkpIHsgLy8gcmVjdXJzZVxuICAgICAgICAgICAgICAgICAgICBGaWxlVXRpbC5kZWxldGVGb2xkZXJSZWN1cnNpdmUoY3VyUGF0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gZGVsZXRlIGZpbGVcbiAgICAgICAgICAgICAgICAgICAgZnMudW5saW5rU3luYyhjdXJQYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBhIGZpbGUuXG4gICAgICogQHBhcmFtIHBhdGggcGF0aFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZGVsZXRlRmlsZShwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgZnMudW5saW5rU3luYyhwYXRoKTtcbiAgICB9XG59XG4iXX0=