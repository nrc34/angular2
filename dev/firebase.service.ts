import  {Injectable} from 'angular2/core';
import {IAnimal} from './IAnimal';


@Injectable()
export class FirebaseService {
    fbUrl: string = 'https://crackling-heat-1694.firebaseio.com/animals/';
    fbRef: any;
    animals:IAnimal[];
    snapshot:any;
    isFirstTimeLoad:boolean;

    constructor(){
        this.animals = [];
        this.isFirstTimeLoad = true;
        this.fbRef = new Firebase(this.fbUrl);
        this.fbRef.on('value', (snapshot)=>{
            //console.log(snapshot.val());
            this.snapshot = snapshot.val();
            if(this.isFirstTimeLoad)
            for(var item in this.snapshot){
                //console.log(this.snapshot[item]);
                this.animals.push(JSON.parse(this.snapshot[item]));
                //console.log(JSON.parse(this.snapshot[item]));
            }

        });
        this.fbRef.on('child_added', (snapshot)=>{
            console.log(JSON.parse(snapshot.val()));
            if(!this.isFirstTimeLoad)
            this.animals.push(JSON.parse(snapshot.val()));
            // for(var item in snapshot.val()){
            //     console.log(this.snapshot[item]);
            //     this.animals.push(JSON.parse(this.snapshot[item]));
            //     console.log(JSON.parse(this.snapshot[item]));
            // }
        });
        this.isFirstTimeLoad = false;
    }

    setAnimal(animal:IAnimal){

        //const body:IAnimal = {type:animal.type, name:animal.name, age:animal.age};
        var newRef = this.fbRef.push();
        const body = JSON.stringify({key: newRef.toString(),
                                    type:animal.type,
                                    name:animal.name,
                                    age:animal.age});
        newRef.set(body);
    }

    getAnimals():IAnimal[]{
        return this.animals;
    }

    removeAnimal(animal:IAnimal):void{
        var path2remove = animal.key;
        var ref2remove = new Firebase(path2remove);
        ref2remove.remove();
    }

}