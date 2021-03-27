import { Injectable } from '@angular/core';
import {map, pluck} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Person} from '../interfaces/person';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) { }

  getPersons(): Observable<Person[]>{
    return this.http.get<Person[]>(environment.uri_person)
      .pipe(
        pluck('results'),
        map((personsArray: any[]) => {
          const [persons] = personsArray;
          return persons;
        })
      );
  }
}
