const Workout = require("./workout");

export default class Running extends Workout{
    constructor(distance, duration, date){
        super(distance, duration, date);
        this.calcPace();
    }

    calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}