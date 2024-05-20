let currentPage = "home";
let userName = "ffarkas";

//TODO: Handle error – missing page
function loadPage(pageName, navArrows = false) {
	//return promise to be able to wait for the page to load
	return fetch(pageName + ".html")
		.then((response) => response.text())
		.then((html) => {
			
			document.querySelector("main").innerHTML = html;
			if (pageName !== currentPage && !navArrows) {
				history.pushState({ page: pageName }, '', pageName);
			}

			currentPage = pageName;

			if (pageName !== "home") {
				document.querySelector('#bg').style.background = "black";
				document.querySelector('#logout_button').style.display = "block";
			} else {
				document.querySelector('#bg').style.background = 'url("assets/img/background.gif") center / 100% 101% no-repeat';
				document.querySelector('#logout_button').style.display = "none";
			}

			switch (pageName) {
				case "game_picker":
					addChoiceListeners();
					document.getElementById('welcomeMessage').innerHTML = `greetings,<br>${userName}`;
					break
				case "tournament":
					changeTableListener();
					document.getElementById('alias1').placeholder = `${userName}`
					break
				case "tournament_results":
					displayTournamentResults();
					break
				case "game":
					if (gameMode === 1) {
						document.querySelector("#player1name").innerHTML = userName;
						document.querySelector("#player2name").innerHTML = "AI";
						document.querySelector("#controls").innerHTML = `${userName}: arrows`;
					} else if (gameMode === 2) {
						document.querySelector("#player1name").innerHTML = userName;
						document.querySelector("#player2name").innerHTML = "Player 2";
						document.querySelector("#controls").innerHTML = `${userName}: WASD<br>Player 2: arrows`;
					} else if (gameMode === 3) {
						document.querySelector("#player1name").innerHTML = playerGroup[0];
						document.querySelector("#player2name").innerHTML = playerGroup[1];
						// console.log("set usernames for the tournament")
					}
					break
			}
		})
		.catch((err) => console.error("Failed to fetch page:", err))
}

function manageMode() {
	// console.log("entered gamemode option")
	if (gameMode === 3)
		loadPage('tournament');
	else
		loadPage('game');
}

function updateImage(imageSrc, text) {
	document.getElementById('image-container').innerHTML = `<img style="max-width: 100%;max-height: 100%;width: 50%;" src="assets/img/${imageSrc}"><p class="fs-4" style="margin-top: 5%;">${text}</p>`;
}

function addChoiceListeners() {
	let vsAIChoice = document.getElementById("vsAIChoice");
	let vsPlayerChoice = document.getElementById("vsPlayerChoice");
	let tournamentChoice = document.getElementById("tournamentChoice");

	vsAIChoice.addEventListener("change", function () {
		// console.log('vsAI checked')
		if (vsAIChoice.checked) {
			gameMode = 1;
		}
	})

	vsPlayerChoice.addEventListener("change", function () {
		// console.log('vsPlayer checked')
		if (vsPlayerChoice.checked) {
			gameMode = 2;
		}
	})

	tournamentChoice.addEventListener("change", function () {
		// console.log('tournament checked')
		if (tournamentChoice.checked) {
			gameMode = 3;
		}
	})

	if (vsAIChoice.checked) {
		gameMode = 1;
	} else if (vsPlayerChoice.checked) {
		gameMode = 2;
	} else if (tournamentChoice.checked) {
		gamemode = 3;
	}
}

function changeTableListener() {
	// console.log("listening to table choices")
	let fourP = document.getElementById("fourP");
	let eightP = document.getElementById("eightP");

	fourP.addEventListener("change", function () {
		// console.log("four players chosen")
		selectedTourRadio = 4;
		document.querySelector("#P8Table").innerHTML = "";
	})

	eightP.addEventListener("change", function () {
		// console.log("eight players chosen")
		selectedTourRadio = 8;
		document.querySelector("#P8Table").innerHTML = '<div id="P8Table" class="d-flex d-lg-flex flex-column justify-content-between align-items-center justify-content-lg-center align-items-lg-center" style="height: 50%;width: 50%;"><input id="alias5" class="form-control-lg" type="text" style="color: var(--bs-info);background: rgb(0,0,0);border-style: none;border-top-style: solid;border-top-color: var(--bs-info);border-right-style: solid;border-right-color: var(--bs-info);border-bottom-style: ridge;border-bottom-color: var(--bs-info);border-left-style: solid;border-left-color: var(--bs-info);margin: 1%;" placeholder="alias 5"><input id="alias6" class="form-control-lg" type="text" style="color: var(--bs-info);background: rgb(0,0,0);border-style: none;border-top-style: solid;border-top-color: var(--bs-info);border-right-style: solid;border-right-color: var(--bs-info);border-bottom-style: ridge;border-bottom-color: var(--bs-info);border-left-style: solid;border-left-color: var(--bs-info);margin: 1%;" placeholder="alias 6"><input id="alias7" class="form-control-lg" type="text" style="color: var(--bs-info);background: rgb(0,0,0);border-style: none;border-top-style: solid;border-top-color: var(--bs-info);border-right-style: solid;border-right-color: var(--bs-info);border-bottom-style: ridge;border-bottom-color: var(--bs-info);border-left-style: solid;border-left-color: var(--bs-info);margin: 1%;" placeholder="alias 7"><input id="alias8" class="form-control-lg" type="text" style="color: var(--bs-info);background: rgb(0,0,0);border-style: none;border-top-style: solid;border-top-color: var(--bs-info);border-right-style: solid;border-right-color: var(--bs-info);border-bottom-style: ridge;border-bottom-color: var(--bs-info);border-left-style: solid;border-left-color: var(--bs-info);margin: 1%;" placeholder="alias 8"></div>';
	})

	if (fourP.checked) {
		// console.log("four players chosen")
		selectedTourRadio = 4;
		document.querySelector("#P8Table").innerHTML = "";
	} else if (eightP.checked) {
		// console.log("four players chosen")
		selectedTourRadio = 8;
		document.querySelector("#P8Table").innerHTML = '<div id="P8Table" class="d-flex d-lg-flex flex-column justify-content-between align-items-center justify-content-lg-center align-items-lg-center" style="height: 50%;width: 50%;"><input id="alias5" class="form-control-lg" type="text" style="color: var(--bs-info);background: rgb(0,0,0);border-style: none;border-top-style: solid;border-top-color: var(--bs-info);border-right-style: solid;border-right-color: var(--bs-info);border-bottom-style: ridge;border-bottom-color: var(--bs-info);border-left-style: solid;border-left-color: var(--bs-info);margin: 1%;" placeholder="alias 5"><input id="alias6" class="form-control-lg" type="text" style="color: var(--bs-info);background: rgb(0,0,0);border-style: none;border-top-style: solid;border-top-color: var(--bs-info);border-right-style: solid;border-right-color: var(--bs-info);border-bottom-style: ridge;border-bottom-color: var(--bs-info);border-left-style: solid;border-left-color: var(--bs-info);margin: 1%;" placeholder="alias 6"><input id="alias7" class="form-control-lg" type="text" style="color: var(--bs-info);background: rgb(0,0,0);border-style: none;border-top-style: solid;border-top-color: var(--bs-info);border-right-style: solid;border-right-color: var(--bs-info);border-bottom-style: ridge;border-bottom-color: var(--bs-info);border-left-style: solid;border-left-color: var(--bs-info);margin: 1%;" placeholder="alias 7"><input id="alias8" class="form-control-lg" type="text" style="color: var(--bs-info);background: rgb(0,0,0);border-style: none;border-top-style: solid;border-top-color: var(--bs-info);border-right-style: solid;border-right-color: var(--bs-info);border-bottom-style: ridge;border-bottom-color: var(--bs-info);border-left-style: solid;border-left-color: var(--bs-info);margin: 1%;" placeholder="alias 8"></div>';
	}
}
