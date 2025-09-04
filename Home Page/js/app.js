// News API integration for fetching and displaying news articles
var newsKey = '958d1c2672ba2ed01116f3901623188c';
var newsLangauge = 'en';
var categories = ["politics", "business", "entertainment", "sports"];

categories.forEach(function(cat) {
    var newsApiUrl = `https://gnews.io/api/v4/top-headlines?category=${cat}&apikey=${newsKey}&lang=${newsLangauge}&max=3`;

    $.ajax({
        type: 'get',
        dataType: 'json',
        url: newsApiUrl,
        success: function(result){
            result.articles.slice(0,3).forEach(function(article) {
                var articleHtml = `
                    <div class="col-md-4 mb-3">
                        <a target="_blank" href="${article.url}">
                            <img class="img-fluid mb-2" src="${article.image}" alt="News image">
                        </a>
                        <h6>
                            <a target="_blank" href="${article.url}">${article.title}</a>
                        </h6>
                        <small class="text-muted">${article.publishedAt}</small>
                        <div>
                            <a target="_blank" href="${article.source.url}">
                                <small>${article.source.name}</small>
                            </a>
                        </div>
                    </div>
                `;
                $(`#${cat}`).append(articleHtml);
            });
        },
        error: function(result) {
            console.log("Error fetching " + cat + " news");
        }
    });
});

// Sports API integration for fetching and displaying live football matches
var sportsKey = '216b990b932621ee14414034bb9490182986a74c5157975b456413882f9d96f5';
var sportsApiUrl = `https://apiv2.allsportsapi.com/football/?met=Livescore&APIkey=${sportsKey}`;

$.ajax({
    type: 'get',
    dataType: 'json',
    url: sportsApiUrl,
    success: function (data){
        if(data.result && data.result.length > 0){

            data.result.forEach(function(match){
                var matchHtml = `
                    <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                        <span><strong>${match.event_home_team}</strong></span>
                        <span class="badge bg-primary">${match.event_final_result}</span>
                        <span><strong>${match.event_away_team}</strong></span>
                    </div>
                `;
                $("#matches").append(matchHtml);
            });
        } else {
            $("#matches").html("<p>There is no matchs now</p>");
        }
    },
    error: function(){
        $("#matches").html("<p>Error loading matches</p>");
    }
});

// Weather API integration for fetching and displaying current weather

var weatherKey ='09bbd1c8fdef1445c7ef20839f4256dc';
var weatherCityName ='Cairo';
var weatherCountryCode='EG';
var weatherApiUrl =`https://api.openweathermap.org/data/2.5/weather?q=${weatherCityName},${weatherCountryCode}&appid=${weatherKey}&units=metric`;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`;
        loadWeather(); 
    }, function(error) {
        loadWeather(); 
    });
} else {
    loadWeather(); 
}

function loadWeather() {
    $.ajax({
        type:'get',
        dataType: 'json',
        url: weatherApiUrl,
        success: function(data) {
            $('#weather').text(data.main.temp);
            var iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            $('#weatherIcon').attr('src', iconUrl);
            $('#weatherIcon').attr('title', data.weather[0].description);
        },
        error: function (data) {
            var errormsg = JSON.parse(data.responseText);
            $('#weatherSection').html(`<p>${errormsg.message}</p>`);
        },
    });
}
