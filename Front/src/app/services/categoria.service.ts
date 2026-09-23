import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private readonly API_URL = 'http://localhost:8080/categorias';

  constructor(private http: HttpClient) { }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API_URL);
  }

  salvarCategoria(categoria: Categoria): Observable<Categoria> {

    if (categoria.id && categoria.id > 0) {
      return this.http.put<Categoria>(`${this.API_URL}/${categoria.id}`, categoria);
    }
   
    return this.http.post<Categoria>(this.API_URL, categoria);
  }

  excluirCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}