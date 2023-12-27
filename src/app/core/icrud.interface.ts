//Interface responsável pelos métodos que as classes deverão efetivar para acesso a dados
import { Observable } from "rxjs";
import { Model } from "./model";

export interface ICrud<T extends Model>{
    get(id: string): Observable<T>;         //READ para string
    list(): Observable<T[]>;                //READ para array
    createOrUpdate(item: T): Promise<T>;    
    delete(id: string): Promise<void>;      
}