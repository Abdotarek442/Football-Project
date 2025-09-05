var topAPIKey = "6429de039f6a878ff06fa74ed66ddb4efbb4c91a2714510df81d786b24f85b0e";
var leagueId = "152";
var topScoreUrl = `https://apiv2.allsportsapi.com/football/?&met=Topscorers&APIkey=${topAPIKey}&leagueId=${leagueId}`;
var playersData = [];
$.ajax({
    type: 'get',
    dataType: 'json',
    url: topScoreUrl,
    success: function(top) {
        let requestsDone = 0;
        for (let i = 0; i < top.result.length; i++) {
            let playerId = top.result[i].player_key;
            let playerInfo = `https://apiv2.allsportsapi.com/football/?&met=Players&playerId=${playerId}&APIkey=${topAPIKey}`;
            let teamId = top.result[i].team_key; 
            let teamLogo = `https://apiv2.allsportsapi.com/football/?&met=Teams&teamId=${teamId}&APIkey=${topAPIKey}`;
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: teamLogo,
                success: function(teamInfo) {
                    $.ajax({
                        type: 'get',
                        dataType: 'json',
                        url: playerInfo,
                        success: function(info) {
                            let details = info.result[0];
                            playersData.push({
                                place: top.result[i].player_place,
                                name: details.player_name,
                                image: details.player_image || 'img/default-image.jpg',
                                teamLogo: teamInfo.result[0].team_logo,
                                teamName: top.result[i].team_name,
                                goals: top.result[i].goals || '-',
                                assists: top.result[i].assists || '-',
                                penalties: top.result[i].penalty_goals || '-',
                                yellow: details.player_yellow_cards || '-',
                                red: details.player_red_cards || '-'
                            });
                            requestsDone++;
                            if (requestsDone === top.result.length) {
                                playersData.sort((a, b) => a.place - b.place);
                                $('.table tbody').empty();
                                playersData.forEach(player => {
                                    let row = `
                                        <tr>
                                            <td>${player.place}</td>
                                            <td>
                                                <img src="${player.image}" onerror="this.onerror=null;this.src='img/default-image.jpg';" width="60" height="60" class="rounded-circle me-2">
                                                <span>${player.name}</span>
                                            </td>
                                            <td>
                                                <img src="${player.teamLogo}" width="60" height="60" class="rounded-circle me-2">
                                                <span>${player.teamName}</span>
                                            </td>
                                            <td>${player.goals}</td>
                                            <td>${player.assists}</td>
                                            <td>${player.penalties}</td>
                                            <td>${player.yellow}</td>
                                            <td>${player.red}</td>
                                        </tr>`;
                                    $('.table tbody').append(row);
                                });
                            }
                        },
                        error: function(info) {
                            console.log(info);
                        }
                    });
                },
                error: function(teamInfo) {
                    console.log(teamInfo);
                }
            });
        }
    },
    error: function(top) {
        console.log(top);
    }
});
