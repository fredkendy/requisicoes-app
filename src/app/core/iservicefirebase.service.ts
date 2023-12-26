import { Model } from "../core/model";
import { ICrud } from "./icrud.interface";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { AngularFirestoreCollection, AngularFirestore } from "@angular/fire/compat/firestore";
import firebase from "firebase/compat";

export abstract class ServiceFirebase<T extends Model> implements ICrud<T> {

    //referencia para a coleção de documentos -> classe da lib @angular/fire
    ref!: AngularFirestoreCollection<T>

    constructor(protected type: { new(): T; }, protected firestore: AngularFirestore, public path: string) {
        this.ref = this.firestore.collection<T>(this.path);
    }

    get(id: string): Observable<T> {
        let doc = this.ref.doc<T>(id);
        return doc.get().pipe(map(snapshot => this.docToClass(snapshot)));
    }

    docToClass(snapshotDoc: firebase.firestore.DocumentSnapshot<T>): T {
        let obj = {
          ...(snapshotDoc.data() as T)
        }
        let typed = plainToClass(this.type, obj)
        typed.id = snapshotDoc.id;
        return typed;
    }

    list(): Observable<T[]> {
        return this.ref.valueChanges()
    }

    createOrUpdate(item: T): Promise<any> {
        let id: string = item.id;
        let obj: T = {} as T;

        if (item instanceof this.type)
            obj = item as T;
        else
            obj = item;

        if (id) {
            return this.ref.doc(id).set(obj);
        } else {
            return this.ref.add(obj).then(res => {
                obj.id = res.id; // Para salvar com o atributo id
                this.ref.doc(res.id).set(obj);
            });
        }
    }

    delete(id: string):Promise<void> {
        return this.ref.doc(id).delete();
    }
    
}