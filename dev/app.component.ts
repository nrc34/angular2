import {Component} from 'angular2/core';
import {FirebaseService} from "./firebase.service";
import {IAnimal} from './IAnimal';

@Component({
    selector: 'my-app',
    template: `
        <div class="container">
            <ul>
            <li *ngFor="#animal of Animals"> 
                Name:{{animal.name}}<br>
                <h6 style="margin: 0; display: inline-block">type:{{animal.type}}</h6>
                <h6 style="margin: 0; display: inline-block">age:{{animal.age}}</h6>
                <button style="width: 70px; padding: 2px" 
                    (click)="onRemove(animal)">remove</button>
            </li>
            </ul>
            <hr>
            <form #f="ngForm" (ngSubmit)="onSubmit(f.value)"> 
                <label> Name:
                    <input type="text" ngControl="name">
                </label>
                <label> type:
                    <select (change)="onAnimalTypeSelected($event.target.value)">
                    <option *ngFor="#item of AnimalTypes" [value]="item" >{{item}}</option>
                    </select>
                </label>
                <label> age:
                    <input type="text" ngControl="age">
                </label>
                <button class="button-primary" type="submit">add</button>
            </form>
            <h3>{{data}}</h3>
        </div>
    `,
    providers:[FirebaseService]
})
export class AppComponent {
    Animals:IAnimal[] = [{type: "dog", name: "myDog", age: 4}];
    AnimalTypes:string[];
    selectedType:string="cat";
    data:string;

    constructor(private firebaseService: FirebaseService){
        this.AnimalTypes = ["cat", "dog", "rabbit", "mouse"];
        this.Animals = firebaseService.getAnimals();
    }

    onSubmit(animal){
        animal.type=this.selectedType;
        //this.Animals.push({type:this.selectedType, name:animal.name, age:animal.age});
        this.firebaseService.setAnimal(animal);
        this.data = JSON.stringify(this.Animals, null, 2);
    }

    onRemove(animal){
        var index = this.Animals.indexOf(animal, 0);
        if (index > -1) {
            this.Animals.splice(index, 1);
        }
        this.firebaseService.removeAnimal(animal);
    }

    onAnimalTypeSelected(type){
        this.selectedType = type;
    }

}