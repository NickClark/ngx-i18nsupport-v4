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
export class FileUtil {
    /**
     * Check for existence.
     * @param {?} filename filename
     * @return {?} wether file exists
     */
    static exists(filename) {
        return fs.existsSync(filename);
    }
    /**
     * Read a file.
     * @param {?} filename filename
     * @param {?} encoding encoding
     * @return {?} content of file
     */
    static read(filename, encoding) {
        return fs.readFileSync(filename, encoding);
    }
    /**
     * Write a file with given content.
     * @param {?} filename filename
     * @param {?} newContent newContent
     * @param {?} encoding encoding
     * @return {?}
     */
    static replaceContent(filename, newContent, encoding) {
        fs.writeFileSync(filename, newContent, { encoding: encoding });
    }
    /**
     * @param {?} srcFile
     * @param {?} destFile
     * @return {?}
     */
    static copy(srcFile, destFile) {
        /** @type {?} */
        const BUF_LENGTH = 64 * 1024;
        /** @type {?} */
        const buff = Buffer.alloc(BUF_LENGTH);
        /** @type {?} */
        const fdr = fs.openSync(srcFile, 'r');
        /** @type {?} */
        const fdw = fs.openSync(destFile, 'w');
        /** @type {?} */
        let bytesRead = 1;
        /** @type {?} */
        let pos = 0;
        while (bytesRead > 0) {
            bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
            fs.writeSync(fdw, buff, 0, bytesRead);
            pos += bytesRead;
        }
        fs.closeSync(fdr);
        fs.closeSync(fdw);
    }
    /**
     * Delete the folder and all of its content (rm -rf).
     * @param {?} path path
     * @return {?}
     */
    static deleteFolderRecursive(path) {
        /** @type {?} */
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((/**
             * @param {?} file
             * @return {?}
             */
            function (file) {
                /** @type {?} */
                const curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    FileUtil.deleteFolderRecursive(curPath);
                }
                else { // delete file
                    fs.unlinkSync(curPath);
                }
            }));
            fs.rmdirSync(path);
        }
    }
    /**
     * Delete folders content recursively, but do not delete folder.
     * Folder is left empty at the end.
     * @param {?} path path
     * @return {?}
     */
    static deleteFolderContentRecursive(path) {
        /** @type {?} */
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach((/**
             * @param {?} file
             * @return {?}
             */
            function (file) {
                /** @type {?} */
                const curPath = path + '/' + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    FileUtil.deleteFolderRecursive(curPath);
                }
                else { // delete file
                    fs.unlinkSync(curPath);
                }
            }));
        }
    }
    /**
     * Delete a file.
     * @param {?} path path
     * @return {?}
     */
    static deleteFile(path) {
        fs.unlinkSync(path);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS11dGlsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC1pMThuc3VwcG9ydC9uZ3gtaTE4bnN1cHBvcnQvIiwic291cmNlcyI6WyJjb21tb24vZmlsZS11dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEtBQUssRUFBRSxNQUFNLElBQUksQ0FBQzs7Ozs7O0FBUXpCLE1BQU0sT0FBTyxRQUFROzs7Ozs7SUFPVixNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWdCO1FBQ2pDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDOzs7Ozs7O0lBUU0sTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQ2pELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7Ozs7Ozs7SUFRTSxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQWdCLEVBQUUsVUFBa0IsRUFBRSxRQUFnQjtRQUMvRSxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDOzs7Ozs7SUFFTSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQWUsRUFBRSxRQUFnQjs7Y0FDMUMsVUFBVSxHQUFHLEVBQUUsR0FBRyxJQUFJOztjQUN0QixJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7O2NBQy9CLEdBQUcsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7O2NBQy9CLEdBQUcsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7O1lBQ2xDLFNBQVMsR0FBRyxDQUFDOztZQUNiLEdBQUcsR0FBRyxDQUFDO1FBQ1gsT0FBTyxTQUFTLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLFNBQVMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN2RCxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3RDLEdBQUcsSUFBSSxTQUFTLENBQUM7U0FDcEI7UUFDRCxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEIsQ0FBQzs7Ozs7O0lBTU0sTUFBTSxDQUFDLHFCQUFxQixDQUFDLElBQVk7O1lBQ3hDLEtBQUssR0FBRyxFQUFFO1FBQ2QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFHO1lBQ3RCLEtBQUssR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLEtBQUssQ0FBQyxPQUFPOzs7O1lBQUMsVUFBUyxJQUFJOztzQkFDakIsT0FBTyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSTtnQkFDakMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsVUFBVTtvQkFDakQsUUFBUSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMzQztxQkFBTSxFQUFFLGNBQWM7b0JBQ25CLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQzFCO1lBQ0wsQ0FBQyxFQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQzs7Ozs7OztJQU9NLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQyxJQUFZOztZQUMvQyxLQUFLLEdBQUcsRUFBRTtRQUNkLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRztZQUN0QixLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixLQUFLLENBQUMsT0FBTzs7OztZQUFDLFVBQVMsSUFBSTs7c0JBQ2pCLE9BQU8sR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUk7Z0JBQ2pDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxFQUFFLFVBQVU7b0JBQ2pELFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDM0M7cUJBQU0sRUFBRSxjQUFjO29CQUNuQixFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMxQjtZQUNMLENBQUMsRUFBQyxDQUFDO1NBQ047SUFDTCxDQUFDOzs7Ozs7SUFNTSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQVk7UUFDakMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbi8qKlxuICogQ3JlYXRlZCBieSBtYXJ0aW4gb24gMTcuMDIuMjAxNy5cbiAqIFNvbWUgKGEgZmV3KSBzaW1wbGUgdXRpbHMgZm9yIGZpbGUgb3BlcmF0aW9ucy5cbiAqIEp1c3QgZm9yIGNvbnZlbmllbmNlLlxuICovXG5cbmV4cG9ydCBjbGFzcyBGaWxlVXRpbCB7XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBmb3IgZXhpc3RlbmNlLlxuICAgICAqIEBwYXJhbSBmaWxlbmFtZSBmaWxlbmFtZVxuICAgICAqIEByZXR1cm4gd2V0aGVyIGZpbGUgZXhpc3RzXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBleGlzdHMoZmlsZW5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gZnMuZXhpc3RzU3luYyhmaWxlbmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZCBhIGZpbGUuXG4gICAgICogQHBhcmFtIGZpbGVuYW1lIGZpbGVuYW1lXG4gICAgICogQHBhcmFtIGVuY29kaW5nIGVuY29kaW5nXG4gICAgICogQHJldHVybiBjb250ZW50IG9mIGZpbGVcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHJlYWQoZmlsZW5hbWU6IHN0cmluZywgZW5jb2Rpbmc6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lLCBlbmNvZGluZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV3JpdGUgYSBmaWxlIHdpdGggZ2l2ZW4gY29udGVudC5cbiAgICAgKiBAcGFyYW0gZmlsZW5hbWUgZmlsZW5hbWVcbiAgICAgKiBAcGFyYW0gbmV3Q29udGVudCBuZXdDb250ZW50XG4gICAgICogQHBhcmFtIGVuY29kaW5nIGVuY29kaW5nXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyByZXBsYWNlQ29udGVudChmaWxlbmFtZTogc3RyaW5nLCBuZXdDb250ZW50OiBzdHJpbmcsIGVuY29kaW5nOiBzdHJpbmcpIHtcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlbmFtZSwgbmV3Q29udGVudCwge2VuY29kaW5nOiBlbmNvZGluZ30pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgY29weShzcmNGaWxlOiBzdHJpbmcsIGRlc3RGaWxlOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgQlVGX0xFTkdUSCA9IDY0ICogMTAyNDtcbiAgICAgICAgY29uc3QgYnVmZiA9IEJ1ZmZlci5hbGxvYyhCVUZfTEVOR1RIKTtcbiAgICAgICAgY29uc3QgZmRyID0gZnMub3BlblN5bmMoc3JjRmlsZSwgJ3InKTtcbiAgICAgICAgY29uc3QgZmR3ID0gZnMub3BlblN5bmMoZGVzdEZpbGUsICd3Jyk7XG4gICAgICAgIGxldCBieXRlc1JlYWQgPSAxO1xuICAgICAgICBsZXQgcG9zID0gMDtcbiAgICAgICAgd2hpbGUgKGJ5dGVzUmVhZCA+IDApIHtcbiAgICAgICAgICAgIGJ5dGVzUmVhZCA9IGZzLnJlYWRTeW5jKGZkciwgYnVmZiwgMCwgQlVGX0xFTkdUSCwgcG9zKTtcbiAgICAgICAgICAgIGZzLndyaXRlU3luYyhmZHcsIGJ1ZmYsIDAsIGJ5dGVzUmVhZCk7XG4gICAgICAgICAgICBwb3MgKz0gYnl0ZXNSZWFkO1xuICAgICAgICB9XG4gICAgICAgIGZzLmNsb3NlU3luYyhmZHIpO1xuICAgICAgICBmcy5jbG9zZVN5bmMoZmR3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGUgdGhlIGZvbGRlciBhbmQgYWxsIG9mIGl0cyBjb250ZW50IChybSAtcmYpLlxuICAgICAqIEBwYXJhbSBwYXRoIHBhdGhcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRlbGV0ZUZvbGRlclJlY3Vyc2l2ZShwYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IGZpbGVzID0gW107XG4gICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGgpICkge1xuICAgICAgICAgICAgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhwYXRoKTtcbiAgICAgICAgICAgIGZpbGVzLmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1clBhdGggPSBwYXRoICsgJy8nICsgZmlsZTtcbiAgICAgICAgICAgICAgICBpZiAoZnMubHN0YXRTeW5jKGN1clBhdGgpLmlzRGlyZWN0b3J5KCkpIHsgLy8gcmVjdXJzZVxuICAgICAgICAgICAgICAgICAgICBGaWxlVXRpbC5kZWxldGVGb2xkZXJSZWN1cnNpdmUoY3VyUGF0aCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gZGVsZXRlIGZpbGVcbiAgICAgICAgICAgICAgICAgICAgZnMudW5saW5rU3luYyhjdXJQYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZzLnJtZGlyU3luYyhwYXRoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlbGV0ZSBmb2xkZXJzIGNvbnRlbnQgcmVjdXJzaXZlbHksIGJ1dCBkbyBub3QgZGVsZXRlIGZvbGRlci5cbiAgICAgKiBGb2xkZXIgaXMgbGVmdCBlbXB0eSBhdCB0aGUgZW5kLlxuICAgICAqIEBwYXJhbSBwYXRoIHBhdGhcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRlbGV0ZUZvbGRlckNvbnRlbnRSZWN1cnNpdmUocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGxldCBmaWxlcyA9IFtdO1xuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoKSApIHtcbiAgICAgICAgICAgIGZpbGVzID0gZnMucmVhZGRpclN5bmMocGF0aCk7XG4gICAgICAgICAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJQYXRoID0gcGF0aCArICcvJyArIGZpbGU7XG4gICAgICAgICAgICAgICAgaWYgKGZzLmxzdGF0U3luYyhjdXJQYXRoKS5pc0RpcmVjdG9yeSgpKSB7IC8vIHJlY3Vyc2VcbiAgICAgICAgICAgICAgICAgICAgRmlsZVV0aWwuZGVsZXRlRm9sZGVyUmVjdXJzaXZlKGN1clBhdGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGRlbGV0ZSBmaWxlXG4gICAgICAgICAgICAgICAgICAgIGZzLnVubGlua1N5bmMoY3VyUGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGUgYSBmaWxlLlxuICAgICAqIEBwYXJhbSBwYXRoIHBhdGhcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRlbGV0ZUZpbGUocGF0aDogc3RyaW5nKSB7XG4gICAgICAgIGZzLnVubGlua1N5bmMocGF0aCk7XG4gICAgfVxufVxuIl19