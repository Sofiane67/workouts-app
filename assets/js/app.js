import Cycling from './class/cycling.js';
import Running from './class/running.js';
import dom from './dom.js';

export default class App {
    map;
    mapEvent;
    workouts = [];
    constructor() {
        this.displayMap();
        dom.form.addEventListener("submit", this.newWorkout.bind(this));
        dom.inputBtn.addEventListener("click", this.newWorkout.bind(this));

        //Affiche la liste des workouts stockés du localStorage
        if(localStorage.getItem("workouts")){
            this.getLocalStorage().forEach(work => this.workoutList(work));
        }
    }

    //Affiche la carte centré sur la géolocalisation de l'utilisateur se la géolocalisation est activé, sinon il saisie le nom d'une ville pour centrer la carte
    displayMap() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                this.loadMap([latitude, longitude]);
            }, () => {
                const city = prompt("ville");
                this.getPosition(city)
            })
        }
    }

    // Affiche la carte centré sur la ville passé en paramètre
    getPosition(city) {
        fetch(`https://datanova.laposte.fr/api/records/1.0/search/?dataset=laposte_hexasmal&q=${city}`)
            .then(response => response.json())
            .then(data => {
                const [datas] = data.records;
                const [long, lat] = datas.geometry.coordinates
                this.loadMap([lat, long]);
            });
    }

    //Charge la carte
    loadMap(position) {
        this.map = L.map('map').setView(position, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        //Afficher formulaire lorsqu'on click sur la carte
        this.map.on("click", this.showForm.bind(this));

        //Affiche les markeur pour les workouts stockés dans le localStorage
        if (localStorage.getItem("workouts")) {
            this.getLocalStorage().forEach(work => this.displayMarker(work));
        }
    }

    //Afficher le formulaire
    showForm(event) {
        dom.form.classList.remove("form--hidden");
        this.mapEvent = event; //Recupère l'objet event de l'eventListener de leaflet
        console.log(this.mapEvent)
        console.log(this.mapEvent.latlng)
    }

    hideForm(){
        dom.form.classList.add("form--hidden");
    }


    //Créé un nouvel entrainement
    newWorkout(event){
        let workout;
        event.preventDefault();
 
        //Distance
        const distance = dom.inputDistance.value;
        //Duration
        const duration = dom.inputDuration.value;
        //Date
        const date = dom.inputDate.value;
        //Coords
        const {lat, lng} = this.mapEvent.latlng;
        //Type workout
        const type = dom.inputType.value;
        console.log(type);

        //Création d'un entrainement
        if(type === "running"){
            workout = new Running(distance, duration, date, [lat, lng]);
        }

        if (type === "cycling") {
            workout = new Cycling(distance, duration, date, [lat, lng]);
        }

        //Ajout d'un entrainement dans le tableau workouts
        this.workouts.push(workout)
        console.log(this.workouts)
        this.setLocalStorage(this.workouts);

        //Affficher workout dans la liste 
        this.workoutList(workout);

        //Marquer le lieu de l'entrainement sur la carte
        this.displayMarker(workout);

        //Réinitialiser le formulaire et le cacher après la création d'un entrainement
        this.hideForm();
        dom.inputDistance.value = "";
        dom.inputDuration.value= "";
        dom.inputDate.value= "";
    }

    //Ajoute un markeur sur la carte
    displayMarker(workout){
        const popup = L.popup({
            className: `popup-box--${workout.type}`,
            minWidth: 200,
            autoClose: false,
            closeOnClick: false
        }).setContent(`<span class="popup-box__icon">${workout.type === "running" ? "🏃" : "🚴"}</span> ${workout.title}`);

        L.marker(workout.coords).addTo(this.map)
            .bindPopup(popup)
            .openPopup()
    }

    //Affiche les workouts dans la liste
    workoutList(workout){
        const txt = 
        `<div class="workout workout--${workout.type}">
            <p class="workout__title">${workout.title}</p>
            <div class="workout__details">
                <p>
                    <span class="workout__icon">${workout.type === "running" ?"🏃":"🚴‍♂️"}</span>
                    10 Km
                </p>
                <p>
                    <span class="workout__icon">⏱</span>
                    ${workout.duration} Min
                </p>

                <p>
                    <span class="workout__icon">⚡️</span>
                    ${workout.type === "running" ? workout.pace + " Min/Km" : workout.speed + " Km/h"}
                </p>
            </div>
        </div>
        `
        dom.form.insertAdjacentHTML("afterend", txt);
    }

    setLocalStorage(array){
        const data = JSON.stringify(array);
        localStorage.setItem("workouts", data);
    }

    getLocalStorage(){
        const data = localStorage.getItem("workouts");
        return JSON.parse(data);
        console.log(JSON.parse(data));
    }
}

