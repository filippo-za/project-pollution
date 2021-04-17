import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import axios from "axios";
import jquery from "jquery";

let btn = document.querySelector(".btn-search");
let btnLocation = document.querySelector(".btn-geolocation");
let cityInput = document.querySelector(".city-input");
let resultElement = document.querySelector(".result");
let cityElement = document.querySelector(".city");

function getAqiByCity() {
  let city = cityInput.value;
  resultElement.textContent = "Attendi";
  cityInput.value = "";
  if (city === "") {
    cityElement.textContent = "Non hai cercato nessuna città";
    resultElement.textContent = "";
  }

  axios
    .get("https://api.waqi.info/feed/" + city + "/?token=" + process.env.TOKEN)
    .then(function (response) {
      console.log(response);
      if (response.data.data === "Unknown station") {
        cityElement.textContent = "Stazione non trovata";
        resultElement.textContent = "";
      }
      resultElement.textContent = response.data.data.aqi;
      cityElement.textContent = response.data.data.city.name;
    })
    .catch(function (err) {
      console.log(err);
      console.log("Fetch problem:" + err.message);
    });
}

function getAqiByGeo() {
  navigator.geolocation.getCurrentPosition(function (pos) {
    console.log(pos);
    resultElement.textContent = "Attendi";
    cityInput.value = "";

    axios
      .get(
        "https://api.waqi.info/feed/geo:" +
          pos.coords.latitude +
          ";" +
          pos.coords.longitude +
          "/?token=" +
          process.env.TOKEN
      )
      .then(function (response) {
        console.log(response);
        resultElement.textContent = response.data.data.aqi;
        cityElement.textContent = response.data.data.city.name;
      })
      .catch(function (err) {
        console.log("Fetch problem:" + err.message);
      });
  });
}

btn.addEventListener("click", getAqiByCity);
btnLocation.addEventListener("click", getAqiByGeo);
