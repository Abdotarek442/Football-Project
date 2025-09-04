var sportApiKey = '49118f41b191e6d9f67c1a1125d15ee57374fc9e3279fa3c8a419cbd2cd58a3f';
var countryId =44;
var leaugeKey =152;
var sportApiUrl =`https://apiv2.allsportsapi.com/football/?&met=Standings&leagueId=207&APIkey=${sportApiKey}&leagueId=${leaugeKey}`;

$.ajax({
    type: 'get',
    dataType: 'json',
    url: sportApiUrl,
    success: function (data){
        // console.log(data.result.total);
        for(e = 0; e < data.result.total.length; e++){
        var info=data.result.total[e];
        var tr = `<tr>
         <td><span>${info.standing_place}</span>
         <img src='${info.team_logo}'>${info.standing_team}</td>
         <td>${info.standing_P}</td>
         <td>${info.standing_W}</td>
         <td>${info.standing_D}</td>
         <td>${info.standing_L}</td>
         <td>${info.standing_F}</td>
         <td>${info.standing_A}</td>
         <td>${info.standing_GD}</td>
         <td id='pts'>${info.standing_PTS}</td>
         </tr>`
        $('#content').append(tr);
        }
    },
    error: function(data){
        console.log(data);
    }
});