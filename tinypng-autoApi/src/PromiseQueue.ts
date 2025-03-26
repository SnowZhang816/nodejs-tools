/**
 * 任务接口，包含任务函数和各种回调。
 */
interface IPromiseQueueTask<T> {
    /**
     * 任务函数，返回一个 Promise。
     */
    taskFn: () => Promise<T>;
    /**
     * 任务成功完成时的回调函数。
     */
    onSuccess?: (result: T) => void;
    /**
     * 任务失败时的回调函数。
     */
    onFail?: (error: Error) => void;
    /**
     * 任务重试时的回调函数。
     */
    onRetry?: (attempt: number) => void;
}

/**
 * Promise 任务队列类，支持并发数、超时和重试机制。
 */
export default class PromiseQueue<T> {
    /**
     * 任务队列，存储所有待处理的任务。
     */
    private queue: IPromiseQueueTask<T>[] = [];

    /**
     * 并发数，表示同时可以处理的任务数量。
     */
    private concurrency: number;

    /**
     * 超时时间（毫秒），每个任务的最大执行时间。
     */
    private timeout: number;

    /**
     * 重试次数，任务失败后可以重试的最大次数。
     */
    private retries: number;

    /**
     * 当前正在处理的任务数量。
     */
    private currentlyProcessing: number = 0;

    /**
     * 已完成的任务数量。
     */
    private completedTasks: number = 0;

    /**
     * 总任务数量。
     */
    private totalTasks: number = 0;

    /**
     * 所有任务完成时的回调函数。
     */
    private onAllCompletedCallback: (() => void) | null = null;

    /**
     * 队列是否处于暂停状态。
     */
    private isPaused: boolean = false;

    /**
     * 构造函数，初始化 PromiseQueue 实例。
     * @param concurrency 并发数。
     * @param timeout 超时时间（毫秒）。
     * @param retries 重试次数。
     */
    constructor(concurrency: number, timeout: number = 60 * 1000, retries: number = 0) {
        this.concurrency = concurrency;
        this.timeout = timeout;
        this.retries = retries;
    }

    /**
     * 添加任务到队列。
     * @param task 任务对象。
     */
    addTask(task: IPromiseQueueTask<T>) {
        this.queue.push(task);
        this.totalTasks++;
        this.processQueue();
    }

    /**
     * 执行任务并处理超时和重试。
     * @param task 任务对象。
     * @param attempt 当前尝试次数。
     */
    private async runTask(task: IPromiseQueueTask<T>, attempt: number = 0): Promise<void> {
        if (attempt > 0 && task.onRetry) {
            task.onRetry(attempt);
        }

        let timeoutId: NodeJS.Timeout | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(`Error: 超时`);
            }, this.timeout);
        });

        try {
            const result = await Promise.race([task.taskFn(), timeoutPromise]);
            clearTimeout(timeoutId); // 清除超时计时器
            if (task.onSuccess) task.onSuccess(result);
        } catch (error) {
            clearTimeout(timeoutId); // 清除超时计时器
            if (attempt < this.retries) {
                await this.runTask(task, attempt + 1);
            } else {
                if (task.onFail) task.onFail(error as Error);
            }
        }
    }

    /**
     * 处理队列中的任务。
     */
    private processQueue() {
        if (this.isPaused) return;

        while (this.currentlyProcessing < this.concurrency && this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                this.currentlyProcessing++;
                this.runTask(task)
                    .catch((error) => {
                        console.error('处理队列时出错:', error);
                    })
                    .finally(() => {
                        this.currentlyProcessing--;
                        this.completedTasks++;
                        this.processQueue();
                        if (this.completedTasks === this.totalTasks && this.onAllCompletedCallback) {
                            this.onAllCompletedCallback();
                        }
                    });
            }
        }
    }

    /**
     * 设置全部任务完成的回调函数。
     * @param callback 回调函数。
     */
    onAllCompleted(callback: () => void) {
        this.onAllCompletedCallback = callback;
    }

    /**
     * 暂停任务队列。
     */
    pause() {
        this.isPaused = true;
        console.log('任务队列已暂停');
    }

    /**
     * 恢复任务队列。
     */
    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            console.log('任务队列已恢复');
            this.processQueue();
        }
    }
}

// // 使用示例
// const promiseQueue = new PromiseQueue<any>(20, 1000, 3); // 并发数为2，超时3秒，重试3次

// // 定义一个模拟的异步任务函数
// const asyncTask = (id: number): Promise<any> => {
//   return new Promise((resolve: (value?: any) => void, reject) => {
//     setTimeout(() => {
//       if (Math.random() > 0.5) {
//         resolve();
//       } else {
//         reject(`error`);
//       }
//     }, Math.random() * 2000);
//   });
// };

// const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// const failedTasks: any[] = [];
// // 添加任务到队列
// for (let i = 0; i < data.length; i++) {
//   promiseQueue.addTask({
//     taskFn: () => asyncTask(i),
//     onSuccess: () => console.log(`任务 ${i} 完成`),
//     onFail: (error) => {
//       console.error(`任务 ${i} 失败:`, error);
//       failedTasks.push(i);
//     },
//     onRetry: (attempt) => console.log(`任务 ${i} 重试中，重试次数: ${attempt}`),
//   });
// }

// // 设置全部任务完成的回调
// promiseQueue.onAllCompleted(() => {
//   console.log("全部任务完成");
//   console.log("失败的任务:", failedTasks);
// });

// // 暂停队列
// promiseQueue.pause();

// // 3秒后恢复队列
// setTimeout(() => {
//   promiseQueue.resume();
// }, 3000);
