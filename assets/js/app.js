import Running from './class/running.js';
import dom from './dom.js';

export default class App {
    map;
    mapEvent;
    constructor() {
        this.displayMap();
        dom.form.addEventListener("submit", this.newWorkout.bind(this));
        dom.inputBtn.addEventListener("click", this.newWorkout.bind(this));
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
        this.map.on("click", this.showForm.bind(this))
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


        if(type === "running"){
            workout = new Running(distance, duration, date, [lat, lng]);
        }
        this.displayMarker(workout);

        this.hideForm();
        dom.inputDistance.value = "";
        dom.inputDuration.value= "";
        dom.inputDate.value= "";
    }

   

    //Ajoute un markeur sur la carte
    displayMarker(workout){
        const popup = L.popup({
            className: "popup-box",
            minWidth: 150,
            autoClose: false,
            closeOnClick: false

        }).setContent(`<div class="popup-box__icon-box"><img src="../assets/images/running.png" class="popup-box__icon"></div> ${workout.title}`);

        L.marker(workout.coords).addTo(this.map)
            .bindPopup(popup)
            .openPopup()
    }
}

