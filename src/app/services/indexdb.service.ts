import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';
import { EmployeeData } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class IndexdbService {

  private db: IDBPDatabase<any>;

  constructor() {
    this.initDB();
  }

  private async initDB() {
    this.db = await openDB('employees', 1, {
      upgrade(db) {
        db.createObjectStore('employee-store', { keyPath: 'id', autoIncrement: true });
      }
    });
  }

  async ensureDBInitialized() {
    if (!this.db) {
      await this.initDB();
    }
  }

  async addItem(item: EmployeeData) {
    await this.db.add('employee-store', item);
  }

  async getItem(id: number) {
    return await this.db.get('employee-store', id);
  }

  async getAllItems() {
    return await this.db.getAll('employee-store');
  }

  async updateItem(item: EmployeeData) {
    await this.db.put('employee-store', item);
  }

  async deleteItem(id: number) {
    await this.db.delete('employee-store', id);
  }
}
