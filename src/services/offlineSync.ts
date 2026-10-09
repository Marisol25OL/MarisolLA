/**
 * Offline Cache & Resilient Sync Manager for LC Nova
 * Handles low-connectivity areas in coastal / industrial fringes
 */

export interface QueuedSyncItem {
  id: string;
  type: 'citizen_report' | 'overload_alert' | 'mechanical_failure';
  payload: any;
  createdAt: string;
}

const STORAGE_KEY_QUEUE = 'lazaro_smart_port_offline_queue';
const STORAGE_KEY_OFFLINE_FORCED = 'lazaro_smart_port_offline_forced';

class OfflineSyncManager {
  private listeners: Array<(isOnline: boolean) => void> = [];
  private forcedOffline: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.forcedOffline = localStorage.getItem(STORAGE_KEY_OFFLINE_FORCED) === 'true';

      window.addEventListener('online', () => this.notifyStatusChange());
      window.addEventListener('offline', () => this.notifyStatusChange());
    }
  }

  public isOnline(): boolean {
    if (this.forcedOffline) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public toggleSimulatedOffline(): boolean {
    this.forcedOffline = !this.forcedOffline;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_OFFLINE_FORCED, String(this.forcedOffline));
    }
    this.notifyStatusChange();
    return this.isOnline();
  }

  public onStatusChange(callback: (isOnline: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyStatusChange() {
    const status = this.isOnline();
    this.listeners.forEach(cb => cb(status));
  }

  public getQueue(): QueuedSyncItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public enqueueItem(type: QueuedSyncItem['type'], payload: any): QueuedSyncItem {
    const queue = this.getQueue();
    const item: QueuedSyncItem = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type,
      payload,
      createdAt: new Date().toISOString()
    };
    queue.push(item);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
    }
    return item;
  }

  public clearQueue(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_QUEUE);
    }
  }

  public removeQueueItem(id: string): void {
    const queue = this.getQueue().filter(i => i.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(queue));
    }
  }
}

export const offlineManager = new OfflineSyncManager();
