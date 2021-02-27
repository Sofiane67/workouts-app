export default class Workout{
    constructor(distance, duration, date, coords){
        this.distance = distance;
        this.duration = duration;
        this.date = this.dateFormat(date);
        this.coords = coords;
        this.id = this.generateId();
        this.setTitle()
    }

    generateId(){
        const date = new Date;
        return date.getTime().toString().slice(-5)
    }

    //Formatage de la date
    dateFormat(dateString) {
        const [year, month, day] = dateString.split("-");
        return new Date(year, month, day);
    }

    setTitle(){
        const monthList = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

        const date = new Date(this.date);
        console.log(this.date)
        console.log(date.getMonth())
        this.title = `${date.getDate()} ${monthList[date.getMonth() - 1]} ${date.getFullYear()}`;
    }
}

