import tinify from "tinify";

export interface CompressResult {
    result: boolean;
    code: number;
}

export class compressTread {
    timeOut = false;
    start(file: string) {
        this.timeOut = false;
        return new Promise<CompressResult>(async (resolve) => {
            try {
                setTimeout(() => {
                    this.timeOut = false;
                    resolve({ result: false, code: 0 });
                }, 60 * 1000);
                await tinify.fromFile(file).toFile(file);
                if (this.timeOut) return;
                resolve({ result: true, code: 0 });
            } catch (error: any) {
                console.log("fromFile error", error);
                if (error?.status === 429) {
                    resolve({ result: false, code: 429 });
                } else {
                    resolve({ result: false, code: 0 });
                }
            }

        });
    }
}