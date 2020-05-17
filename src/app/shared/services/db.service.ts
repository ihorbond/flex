import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DocumentChangeType } from '@firebase/firestore-types';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private fireStore: AngularFirestore
  ) { }

  get fs(): AngularFirestore {
    return this.fireStore;
  }


  //get collection
  collection$<T>(path: string, query?: QueryFn): Observable<T[]> {
    return this.fireStore
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(this.mapActions)
      );
  }

  collectionStateChanges$<T>(path: string, query?: QueryFn, docChangeType?: DocumentChangeType[]): Observable<T[]> {
    return this.fireStore
      .collection(path, query)
      .stateChanges(docChangeType)
      .pipe(
        map(this.mapActions)
      );
  }

  // get document
  doc$(path: string): Observable<any> {
    return this.fireStore
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          let data: Object = doc.payload.data();
          return { id: doc.payload.id, ...data }
        })
      );
  }

  // update or create document
  updateAt(path: string, data: Object): Promise<any> {
    const segments = path.split('/').filter(v => v);
    if (segments.length % 2) {
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

  private mapActions<T>(actions) {
    return actions.map(a => {
      //console.log("has pending writes: ", a.payload.doc.metadata, a.payload.doc.data())
      let data = <T>a.payload.doc.data();
      return { id: a.payload.doc.id, ...data };
    })
  }


}
