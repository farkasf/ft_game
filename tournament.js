let selectedTourRadio, aliases = [], playerGroup = [], tournamentResults = [];

function getTourTable() {
	aliases = [];
	let duplicate = false;
	aliases.push(userName);
	for (let i = 2; i <= selectedTourRadio; i++) {
		let alias = document.getElementById('alias' + i).value.trim();
		if (alias !== "") {
			if (aliases.includes(alias)) {
				duplicate = true;
				break ;
			}
			aliases.push(alias);
		}
	}
	if (duplicate) {
		document.querySelector("#tourBottom").innerHTML = translate('duplicates');
	} else if (aliases.length !== selectedTourRadio) {
		document.querySelector("#tourBottom").innerHTML = translate('blank');
	} else {
		createMatches();
		// console.log(aliases);
		playTournament();
	}
}

function createMatches() {
	for (let i = aliases.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[aliases[i], aliases[j]] = [aliases[j], aliases[i]];
	}
}

function playTournament() {
	getPlayers();
	tournamentResults = [];
	loadPage("game");
}

function getPlayers() {
	playerGroup = [aliases[0], aliases[1]];
	aliases.splice(0, 2);
}

function addWinner(winningPlayer) {
	aliases.push(winningPlayer);
}

function getTournamentTableData(name1, name2, score1, score2) {
	const match = {
		player1: name1,
		player2: name2,
		result1: score1,
		result2: score2
	};
	console.log(match);
	tournamentResults.push(match);
}

function displayTournamentResults() {
	// console.log("showing results")
	
	let resultsElement = document.getElementById("tournamentResults")
	let html = ""
	tournamentResults.forEach((el, id, array) => {
		//higlight winner
		const playerNames = el.result1 > el.result2 ? `<u><b>${el.player1}</b></u> vs ${el.player2}` : `${el.player1} vs <u><b>${el.player2}</b></u>`
		//check if the element is last to highlight final Match
		const isLast = id + 1 == array.length
		html += `<div class="${isLast ? "mt-4" : "mt-3"} me-5 pe-5">
					<h3 class="${isLast ? "fw-bold" : ""}">${isLast ? translate('f_match') : translate('match')} ${isLast ? "" : id + 1}</h3>
					<div>${playerNames} (${el.result1}:${el.result2})</div>
				</div>`	
	})
	resultsElement.innerHTML = html
}
