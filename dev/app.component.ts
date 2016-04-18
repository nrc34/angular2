import {Component} from 'angular2/core';
import {FirebaseService} from "./firebase.service";
import {IAnimal} from './IAnimal';

@Component({
    selector: 'my-app',
    template: `
        <div class="container">
            <ul>
            <li *ngFor="#animal of Animals" class="select list" 
                [class.selected]="animal.selected === true" 
                (click)="onSelected(animal, name2select, type2select, age2select)"> 
                <span class="info"><strong>Name: </strong>{{animal.name}}</span>
                <span class="info"><strong>type: </strong>{{animal.type}}</span>
                <span class="info"><strong>age: </strong>{{animal.age}}</span>
                <button style="width: 70px; padding: 2px" 
                    (click)="onRemove(animal)">remove</button>
                <hr style="margin: 0; padding: 0">
            </li>
            </ul>
            <form #f="ngForm" (ngSubmit)="onSubmit(f.value)"> 
                <label> Name:
                    <input type="text" ngControl="name" #name2select>
                </label>
                <label> type:
                    <select (change)="onAnimalTypeSelected($event.target.value)" #type2select>
                    <option *ngFor="#item of AnimalTypes" [value]="item" >{{item}}</option>
                    </select>
                </label>
                <label> age:
                    <input type="text" ngControl="age" #age2select>
                </label>
                <button class="button-primary" type="submit">add</button>
            </form>
            <h6>{{data}}</h6>
        </div>
    `,
    providers:[FirebaseService]

})
export class AppComponent {
    Animals:IAnimal[] = [];
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

    onSelected(animal, name2select, type2select, age2select){
        name2select.value = animal.name;
        type2select.value = animal.type;
        age2select.value = animal.age;
        for(var item in this.Animals){
            if(this.Animals[item] !== animal)
            this.Animals[item].selected = false;
        }
        animal.selected = !animal.selected;
    }

}