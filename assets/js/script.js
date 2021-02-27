const form = document.querySelector(".form");

class App{
    map;
    constructor(){
        this.displayMap();
    }

    //Affiche la carte centré sur la géolocalisation de l'utilisateur se la géolocalisation est activé, sinon il saisie le nom d'une ville pour centrer la carte
    displayMap(){
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(position => {
                const {latitude, longitude} = position.coords;
                this.loadMap([latitude, longitude]);
            }, () => {
                const city = prompt("ville");
                this.getPosition(city)
            })
        }
    }

    // Affiche la carte centré sur la ville passé en paramètre
    getPosition(city){
        fetch(`https://datanova.laposte.fr/api/records/1.0/search/?dataset=laposte_hexasmal&q=${city}`)
        .then(response => response.json())
        .then(data => {
            const [datas] = data.records;
            const [long, lat] = datas.geometry.coordinates
            this.loadMap([lat, long]);
        });
    }

    //Charge la carte
    loadMap(position){
        this.map = L.map('map').setView(position, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        //Afficher formulaire lorsqu'on click sur la carte
        this.map.on("click", this.showForm)
    }

    //Afficher le formulaire

    showForm(){
        form.classList.remove("form--hidden")
    }

}

const app = new App();