const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainers=document.querySelector(".weather-container")
const grantLocationContainers=document.querySelector(".grant-location-container")
const grantAccessButton=document.querySelector("[data-grantAccess]")
const dataSearchForm=document.querySelector("[data-searchForm]")
const dataSearchInput=document.querySelector("[data-searchInput]")
const loadingContainer=document.querySelector(".loading-container")
const showWeatherInformation=document.querySelector(".show-weather-information")
const errorMessage=document.querySelector(".error-container");



// let initially variable needs

let currentTab=userTab;

const API_KEY="c591d06bcf6bf23a7962eb171f5a77cc";
currentTab.classList.add("current-tab");
getFromSessionStorage();
// something pending

function switchTab(clickTab){
    if(clickTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickTab
        currentTab.classList.add("current-tab");
        if(!dataSearchForm.classList.contains("active"))
        {
            showWeatherInformation.classList.remove("active");
            grantLocationContainers.classList.remove("active");
            dataSearchForm.classList.add("active");
            errorMessage.classList.remove("active");
        }
        else{
            dataSearchForm.classList.remove("active");
            showWeatherInformation.classList.remove("active");
            errorMessage.classList.remove("active");
            // coordinate save in local storage
            getFromSessionStorage();
        }
    }
    

}


userTab.addEventListener('click',()=>{
switchTab(userTab)
})

searchTab.addEventListener('click',()=>{
    switchTab(searchTab)
    })
    

    function  getFromSessionStorage(){
        const localCoordinates =sessionStorage.getItem("user-coordinates")
        if(!localCoordinates)
        {
            grantLocationContainers.classList.add("active");
        }
        else{
            const coordinates=JSON.parse(localCoordinates);
            fetchWeatherinfo(coordinates);
        }
    }

    async function fetchWeatherinfo(coordinates)
    {
        const{lat,lon}=coordinates;
        // mark grant container invisble
        grantLocationContainers.classList.remove("active");
        // make loader visible
        loadingContainer.classList.add("active");
        // errorMessage.classList.add("active");


        // api call
        try{
            const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)  
            const data=await response.json();
            // loading screen remove
            loadingContainer.classList.remove('active');
            // weather information ko active karo
            showWeatherInformation.classList.add('active');
            renderWeatherInformation(data);
         }
         catch(error) {
            loadingContainer.classList.remove('active');
            // errorMessage.classList.remove("active");


            // hw
         }


    }


    function renderWeatherInformation(weatherInfo){
        const dataCityName=document.querySelector("[data-cityName]")
const dataCityImage=document.querySelector("[data-cityImage]")
const dataWeatherDesc=document.querySelector("[data-weatherDesc]")
const dataWeatherIcon=document.querySelector("[data-weatherIcon]")
const dataTemperature=document.querySelector("[data-temp]")
const dataWindSpeed=document.querySelector("[data-windSpeed]")
const dataHumidity=document.querySelector("[data-humidity]")
const dataCloud=document.querySelector("[data-clouds]")
        // fetch value from weatgerinfo and put these value into show weatherinformation
        dataCityName.innerText=weatherInfo?.name
        dataCityImage.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        dataWeatherDesc.innerText=weatherInfo?.weather?.[0]?.description;
        dataWeatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        dataTemperature.innerText = `${weatherInfo?.main?.temp}°C`;
        dataWindSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        dataHumidity.innerText = `${weatherInfo?.main?.humidity}%`;
        dataCloud.innerText = weatherInfo?.clouds?.all;

    }


    function getLocation(){
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(showPosition)
        }
        else{
            // homeworks
            alert("You device/Browser does not support geolocation 😥")
        }
    }
    function showPosition(position){
        const  userCoordinates={
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
        sessionStorage.setItem("user-Coordinates",JSON.stringify(userCoordinates));
        fetchWeatherinfo(userCoordinates);
    }
    grantAccessButton.addEventListener("click", getLocation);

dataSearchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(dataSearchInput.value==="")
    {
        return;
    }
    fetchSearchWeatherInfo(dataSearchInput.value)
    
    
})  
async function fetchSearchWeatherInfo(city){
    grantLocationContainers.classList.remove("active");
    // make loader visible
    loadingContainer.classList.add("active");
    showWeatherInformation.classList.remove("active");
    if( errorMessage.classList.contains("active") ){
        errorMessage.classList.remove("active");
    }
    try{
        const result=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if(!result.ok){
            throw(new error)    
        }
        const response=await result.json();
        loadingContainer.classList.remove("active")
        showWeatherInformation.classList.add("active")
        renderWeatherInformation(response);
    }
    catch (error)
    {
        loadingContainer.classList.remove("active");
        // userInfoContainer.classList.remove("active");
        errorMessage.classList.add("active");

    }
}


