
export default class Workout{
    constructor(distance, duration, date){
        this.distance = distance;
        this.duration = duration;
        this.date = date;
        this.id = this.generateId();
        
    }

    generateId(){
        const date = new Date;
        return date.getTime().toString().slice(-5)
    }
}

