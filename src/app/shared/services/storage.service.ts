import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private fireStorage: AngularFireStorage) { }

  public get fsRef(): AngularFireStorage {
    return this.fireStorage;
  }

  public delete(path: string): Observable<any> {
    return this.fireStorage.ref(path).delete();
  }

  public getDownloadUrl(path: string): Promise<any> {
    return this.fireStorage.storage.ref(path).getDownloadURL();
  }
}
