class App{
    map;

    constructor(){
        this.getPosition();
    }

    getPosition(){
        console.log(navigator)
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(position => {
                const {latitude, longitude} = position.coords;
                this.loadMap([latitude, longitude])
            }, () => alert("Veuillez activer la géolocalisati"))
        }
    }

    loadMap(position){
        this.map = L.map('map').setView(position, 15);

        console.log(L)

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

}

const app = new App();