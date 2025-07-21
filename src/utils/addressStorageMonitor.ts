/**
 * Address Storage Monitor
 * 
 * A utility to monitor and debug the permanent address storage system.
 * This can be used to track storage operations and ensure data integrity.
 */

import { permanentStorageService } from '@/services/permanentStorageService';
import { Address } from '@/services/addressService';

const STORAGE_KEY = 'charm_n_treats_addresses';
const MONITOR_KEY = 'address_storage_monitor';

interface MonitorLog {
  timestamp: string;
  operation: 'read' | 'write' | 'delete' | 'clear' | 'check';
  status: 'success' | 'failure';
  details?: string;
  count?: number;
}

class AddressStorageMonitor {
  private logs: MonitorLog[] = [];
  private isEnabled = false;

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const savedLogs = localStorage.getItem(MONITOR_KEY);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.error('Failed to load monitor logs:', error);
    }
  }

  private saveLogs() {
    try {
      // Keep only the last 100 logs to prevent storage bloat
      const trimmedLogs = this.logs.slice(-100);
      localStorage.setItem(MONITOR_KEY, JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('Failed to save monitor logs:', error);
    }
  }

  enable() {
    this.isEnabled = true;
    this.addLog('check', 'success', 'Monitoring enabled');
    console.log('📊 Address storage monitoring enabled');
  }

  disable() {
    this.isEnabled = false;
    console.log('📊 Address storage monitoring disabled');
  }

  isMonitoringEnabled() {
    return this.isEnabled;
  }

  addLog(operation: 'read' | 'write' | 'delete' | 'clear' | 'check', status: 'success' | 'failure', details?: string, count?: number) {
    if (!this.isEnabled) return;
    
    const log: MonitorLog = {
      timestamp: new Date().toISOString(),
      operation,
      status,
      details,
      count
    };
    
    this.logs.push(log);
    this.saveLogs();
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
    this.saveLogs();
    console.log('📊 Address storage monitor logs cleared');
  }

  checkStorageHealth() {
    try {
      // Check if localStorage is available
      if (typeof localStorage === 'undefined') {
        this.addLog('check', 'failure', 'localStorage is not available');
        return {
          status: 'unavailable',
          message: 'localStorage is not available in this environment'
        };
      }
      
      // Check if we can read/write to localStorage
      try {
        localStorage.setItem('storage_test', 'test');
        localStorage.removeItem('storage_test');
      } catch (e) {
        this.addLog('check', 'failure', 'Cannot write to localStorage');
        return {
          status: 'unavailable',
          message: 'Cannot write to localStorage. Storage might be full or disabled.'
        };
      }
      
      // Check if address data exists
      const addressData = localStorage.getItem(STORAGE_KEY);
      const hasAddresses = addressData && addressData !== '[]';
      
      if (hasAddresses) {
        try {
          const addresses = JSON.parse(addressData!) as Address[];
          this.addLog('check', 'success', 'Address data found and valid', addresses.length);
          
          return {
            status: 'healthy',
            message: `Found ${addresses.length} addresses in storage`,
            count: addresses.length
          };
        } catch (e) {
          this.addLog('check', 'failure', 'Address data is corrupted');
          return {
            status: 'corrupted',
            message: 'Address data exists but is corrupted'
          };
        }
      } else {
        this.addLog('check', 'success', 'No address data found');
        return {
          status: 'empty',
          message: 'No address data found in storage'
        };
      }
    } catch (error) {
      this.addLog('check', 'failure', `Unknown error: ${error}`);
      return {
        status: 'error',
        message: `Unknown error: ${error}`
      };
    }
  }

  repairStorage() {
    try {
      const health = this.checkStorageHealth();
      
      if (health.status === 'corrupted') {
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_KEY, '[]');
        this.addLog('write', 'success', 'Repaired corrupted storage');
        return true;
      }
      
      return false;
    } catch (error) {
      this.addLog('check', 'failure', `Repair failed: ${error}`);
      return false;
    }
  }
}

export const addressStorageMonitor = new AddressStorageMonitor();

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).addressStorageMonitor = addressStorageMonitor;
}