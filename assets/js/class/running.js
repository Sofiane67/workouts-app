import Workout from "./workout.js";
export default class Running extends Workout{
    constructor(distance, duration, date, coords){
        super(distance, duration, date, coords);
        this.calcPace();
        this.setTitle();
    }

    calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}