import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {PersonService} from './services/person.service';
import {Person} from './interfaces/person';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public userForm: FormGroup;
  public persons$: Observable<Person[]>;
  public genders = ['hombre', 'mujer'];
  constructor(
    private _formBuilder: FormBuilder,
    private _personService: PersonService) {
  }
  ngOnInit(): void {
    this._initTimerForm();
    this._loadUsers();
  }

  private _loadUsers(): void{
    this.persons$ = this._personService.getPersons()
      .pipe(
        map(persons => {
          const personLocalInfo = localStorage.getItem('personLocalInfo');
          if (personLocalInfo){
            const personArray = JSON.parse(personLocalInfo) as Person[];
            return persons.concat(personArray);
          }
        })
      );
  }

  private _initTimerForm(): void {
    this.userForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      age: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      document: [null, [Validators.required]]
    });
  }

  public onFilesChanged(files: FileList): void {
    const [selectedFile] = files;
    this.userForm.patchValue({document: selectedFile.name});
  }

  public onSubmit(): void{
    if (this.userForm.invalid){
      return;
    }

    const personLocalInfo = localStorage.getItem('personLocalInfo');
    if (!personLocalInfo){
      localStorage.setItem('personLocalInfo', JSON.stringify([this.userForm.value]));
    } else {
      const personArray = JSON.parse(personLocalInfo) as Person[];
      personArray.push(this.userForm.value);
      localStorage.setItem('personLocalInfo', JSON.stringify(personArray));
    }
    this.userForm.reset();
    this._loadUsers();
  }
}
