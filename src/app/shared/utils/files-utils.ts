import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { saveAs } from 'file-saver';

export abstract class FilesUtils {

    public static readFileBynaryString(file: File | Blob): Observable<any> {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        let loadend = fromEvent(reader, 'loadend').pipe(
            map((read: any) => {
                const result = read.target.result;
                return {
                    result: read.target.result,
                    base64: btoa(result)
                }
            })
        );
        return loadend;
    }

    static openFile(file) {
        const binaryImg = atob(file.base64);
        const length = binaryImg.length;
        const arrayBuffer = new ArrayBuffer(length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < length; i++) {
            uintArray[i] = binaryImg.charCodeAt(i);
        }
        const blob = new Blob([uintArray], { type: file.mimeType });
        const fileUrl = URL.createObjectURL(blob);

        window.open(fileUrl);
    }

    static downloaFile(file: any): void {
        const binaryImg = atob(file.base64);
        const length = binaryImg.length;
        const arrayBuffer = new ArrayBuffer(length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < length; i++) {
            uintArray[i] = binaryImg.charCodeAt(i);
        }
        const blob = new Blob([uintArray], { type: file.mimeType });

        saveAs(blob, file.info.name)
    }

    static getFileUrl(file) {
        const binaryImg = atob(file.base64);
        const length = binaryImg.length;
        const arrayBuffer = new ArrayBuffer(length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < length; i++) {
            uintArray[i] = binaryImg.charCodeAt(i);
        }
        const blob = new Blob([uintArray], { type: file.mimeType });
        const fileUrl = URL.createObjectURL(blob);

        return fileUrl;
    }

    static getBlob(file) {
        const binaryImg = atob(file.base64);
        const length = binaryImg.length;
        const arrayBuffer = new ArrayBuffer(length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < length; i++) {
            uintArray[i] = binaryImg.charCodeAt(i);
        }
        const blob = new Blob([uintArray], { type: file.mimeType });

        return blob;
    }

}