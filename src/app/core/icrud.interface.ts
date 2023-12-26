//Interface responsável pelos métodos que as classes deverão efetivar para acesso a dados
import { Observable } from "rxjs";

export interface ICrud<T>{
    get(id: string): Observable<T>;         //READ para string
    list(): Observable<T[]>;                //READ para array
    createOrUpdate(item: T): Promise<T>;    
    delete(id: string): Promise<void>;      
}