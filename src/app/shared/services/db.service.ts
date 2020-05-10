import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private fireStore: AngularFirestore) { }

  // get collection
  collection$(path: string, query?: QueryFn): Observable<any> {
    return this.fireStore
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data }
          })
        })
      );
  }

  // get document
  doc$(path: string): Observable<any> {
    return this.fireStore
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const data: Object = doc.payload.data();
          return { id: doc.payload.id, ...data }
        })
      );
  }

  // update or create document
  updateAt(path: string, data: Object): Promise<any> {
     const segments = path.split('/').filter(v => v);
     if (segments.length % 2){
      // odd -> collection
      return this.fireStore.collection(path).add(data);
     } else {
      //  even -> doc
      return this.fireStore.doc(path).set(data, { merge: true });
     }
  }

  delete(path: string) {
    return this.fireStore.doc(path).delete();
  }
}
