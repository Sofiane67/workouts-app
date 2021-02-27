import Workout from "./workout.js";

export default class Cycling extends Workout {
    type = "cycling";
    constructor(distance, duration, date, coords) {
        super(distance, duration, date, coords);
        this.calcSpeed();
        this.setTitle();
    }

    calcSpeed() {
        this.speed = this.distance / this.duration;
        return this.speed;
    }
}