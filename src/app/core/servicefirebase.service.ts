import { ICrud } from './icrud.interface';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Model } from './model';

export abstract class ServiceFirebase<T extends Model> implements ICrud<T> {


  ref: AngularFirestoreCollection<T>

  constructor(protected type: { new(): T; }, protected firestore: AngularFirestore, public caminho: string) {
    this.ref = this.firestore.collection<T>(this.caminho);
  }

  get(id: string): Observable<T> {
    let doc = this.ref.doc<T>(id);
    return doc.get().pipe(map(snapshot => this.docToClass(snapshot)));
  }

  list(): Observable<T[]> {
    return this.ref.valueChanges()
  }

  createOrUpdate(item: T): Promise<any> {
    let id = item.id;
    if (!item)
      //@ts-ignore
      return
    //@ts-ignore
    let obj = null;

    if (item instanceof this.type)
      obj = item.toObject();
    else
      obj = item;
    if (id) {
      //@ts-ignore
      return this.ref.doc(id).set(obj);
    }
    else
      //@ts-ignore
      return this.ref.add(obj).then(res => {
        //@ts-ignore
        obj.id = res.id; // Para salvar com o atributo id
        //@ts-ignore
        this.ref.doc(res.id).set(obj);
      })
  }

  delete(id: string):Promise<void> {
    return this.ref.doc(id).delete();
  }

  //@ts-ignore
  docToClass(snapshotDoc): T {
    let obj = {
      //@ts-ignore
      id: snapshotDoc.id,
      ...(snapshotDoc.data() as T)
    }
    let typed = plainToClass(this.type, obj)
    return typed;
  }


}