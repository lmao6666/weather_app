if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

function getTemp(city, id) {
    const apiKey = "6655ee54cb308f830a12f9f17ca78ec3";
    if(city != "") {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric&lang=cs")
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                //odpoved ok, teplota prisla
                const temp = data.main.temp;
                document.getElementById(id).innerText = (city + ": " + temp + "°C");
            } else {
                //sice prisla odpoved, ale je v ni chyba
                document.getElementById(id).innerText = "Chyba: " + data.message;
            }
        })
        .catch(error => {
            //sem by se to nemelo dostat...
            document.getElementById(id).innerText = "Zařízení není online";
        });
    } else {
        //nemame zadane mesto
        document.getElementById(id).innerText = "Zadej město";
    }
}

window.onload = function() {
    getTemp("Dobronín", "dobronin");
    getTemp("Jihlava", "jihlava");
};

function getUserCityTemp() {
    const city = document.getElementById("input_city").value;
    getTemp(city, "city");
}