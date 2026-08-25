
export class ImageDB {
    private dbName = "AdsToolsDB";
    private storeName = "images";
    private projectsStore = "projects";
    private libraryStore = "library";
    private db: IDBDatabase | null = null;

    async init() {
        if (this.db) return this.db;
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 3); // Version upped to 3
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(request.result);
            };
            request.onupgradeneeded = (e: any) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
                if (!db.objectStoreNames.contains(this.projectsStore)) {
                    db.createObjectStore(this.projectsStore);
                }
                if (!db.objectStoreNames.contains(this.libraryStore)) {
                    db.createObjectStore(this.libraryStore);
                }
            };
        });
    }

    async saveLibrary(userId: string, items: any[]) {
        await this.init();
        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction([this.libraryStore], "readwrite");
            const store = transaction.objectStore(this.libraryStore);
            const request = store.put(items, userId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getLibrary(userId: string): Promise<any[] | null> {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.libraryStore], "readonly");
            const store = transaction.objectStore(this.libraryStore);
            const request = store.get(userId);
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async saveImage(id: string, base64: string) {
        await this.init();
        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.put(base64, id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getImage(id: string): Promise<string | null> {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    async saveProjects(userId: string, projects: any[]) {
        await this.init();
        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction([this.projectsStore], "readwrite");
            const store = transaction.objectStore(this.projectsStore);
            const request = store.put(projects, userId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getProjects(userId: string): Promise<any[] | null> {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.projectsStore], "readonly");
            const store = transaction.objectStore(this.projectsStore);
            const request = store.get(userId);
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllProjects(): Promise<Record<string, any[]>> {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.projectsStore], "readonly");
            const store = transaction.objectStore(this.projectsStore);
            const request = store.getAll();
            const keysRequest = store.getAllKeys();

            request.onsuccess = () => {
                keysRequest.onsuccess = () => {
                    const results: Record<string, any[]> = {};
                    request.result.forEach((val, i) => {
                        results[keysRequest.result[i] as string] = val;
                    });
                    resolve(results);
                };
            };
            request.onerror = () => reject(request.error);
        });
    }

    async getAllLibrary(): Promise<Record<string, any[]>> {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([this.libraryStore], "readonly");
            const store = transaction.objectStore(this.libraryStore);
            const request = store.getAll();
            const keysRequest = store.getAllKeys();

            request.onsuccess = () => {
                keysRequest.onsuccess = () => {
                    const results: Record<string, any[]> = {};
                    request.result.forEach((val, i) => {
                        results[keysRequest.result[i] as string] = val;
                    });
                    resolve(results);
                };
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteImage(id: string) {
        await this.init();
        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export const imageDB = new ImageDB();
