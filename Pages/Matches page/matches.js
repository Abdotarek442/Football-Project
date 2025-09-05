const API_KEY = "91ebeec38655442d8cf1f247816599ed";
const API_URL = "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/matches";

let allMatches = [];
let currentFilter = "ALL";

function getStatusClass(status) {
  if (status === "LIVE" || status === "IN_PLAY" || status === "PAUSED") return "live";
  if (status === "FINISHED") return "finished";
  if (status === "SCHEDULED" || status === "TIMED") return "scheduled";
  return "";
}

function renderMatches() {
  const matchesContainer = document.getElementById("matches");
  matchesContainer.innerHTML = "";

  let filteredMatches = allMatches;

  if (currentFilter === "LIVE") {
    filteredMatches = allMatches.filter(m => ["LIVE", "IN_PLAY", "PAUSED"].includes(m.status));
  } else if (currentFilter === "FINISHED") {
    filteredMatches = allMatches.filter(m => m.status === "FINISHED");
  } else if (currentFilter === "SCHEDULED") {
    filteredMatches = allMatches.filter(m => ["SCHEDULED", "TIMED"].includes(m.status));
  }

  filteredMatches.forEach(match => {
    const statusClass = getStatusClass(match.status);
    const scoreHome = match.score.fullTime.home ?? "-";
    const scoreAway = match.score.fullTime.away ?? "-";

    const card = `
      <div class="match-card">
        <div class="teams">
          <div class="team">
            <img src="${match.homeTeam.crest}" alt="logo">
            <span>${match.homeTeam.name}</span>
          </div>
          <div class="score">${scoreHome} : ${scoreAway}</div>
          <div class="team">
            <img src="${match.awayTeam.crest}" alt="logo">
            <span>${match.awayTeam.name}</span>
          </div>
        </div>
        <div class="date">${new Date(match.utcDate).toLocaleString()}</div>
        <div class="status ${statusClass}">${match.status}</div>
      </div>
    `;
    matchesContainer.innerHTML += card;
  });
}

async function getMatches() {
  try {
    const res = await fetch(API_URL, {
      headers: { "X-Auth-Token": API_KEY }
    });

    if (!res.ok) throw new Error("Error fetching matches");

    const data = await res.json();
    allMatches = data.matches;
    renderMatches();
  } catch (err) {
    console.error(err);
  }
}

function filterMatches(filter) {
  currentFilter = filter;
  renderMatches();
}

getMatches();
setInterval(getMatches, 30000);
