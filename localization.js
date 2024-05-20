const lang_pack = {
	cs: {
		winner: "vítěz",
		langWarning: "✖️ jazyk nelze měnit během hry",
		langUsed: "✖️ jazyk už byl vybrán",
		greetings: "vítej",
		p1v1: "hraj proti jinému hráči",
		p1vAI: "hraj proti AI soupeři",
		pTour: "hraj proti vícero hráčům",
		p2: "hráč 2",
		arrows: "šipky",
		quit: "zmáčkni ESC ⎋ pro návrat",
		quit_g: "zmáčkni ESC ⎋ pro ukončení hry",
		duplicates: "duplicitní jména hráčů nejsou povolena",
		blank: "některá jména hráčů nejsou vyplněna",
		match: "zápas",
		f_match: "FINÁLNÍ ZÁPAS",
		ret: "vracím se na výběr hry",
		has_won: "vyhrál",
		endTour: "turnaj skončil",
		nextMatchTour: "další zápas začne brzy"
	},
	en: {
		winner: "winner",
		langWarning: "✖️ language cannot be changed during game",
		langUsed: "✖️ language already selected",
		greetings: "greetings",
		p1v1: "play against another player",
		p1vAI: "play against an AI opponent",
		pTour: "play against multiple oponents",
		p2: "player 2",
		arrows: "arrows",
		quit: "Press ESC ⎋ to quit",
		quit_g: "Press ESC ⎋ to quit the game",
		duplicates: "duplicate player names are not allowed",
		blank: "some player names are left blank",
		match: "match",
		f_match: "FINAL MATCH",
		ret: "redirecting to game picker",
		has_won: "has won",
		endTour: "tournament has ended",
		nextMatchTour: "next match will begin soon"
	},
	de: {
		winner: "Sieger",
		langWarning: "✖️ die Sprache kann während des Spiels nicht geändert werden",
		langUsed: "✖️ die Sprache bereits ausgewählt",
		greetings: "Willkommen",
		p1v1: "gegen einen anderen Spieler spielen",
		p1vAI: "gegen einen KI-Gegner spielen",
		pTour: "gegen mehrere Spieler spielen",
		p2: "Spieler 2",
		arrows: "Pfeile",
		quit: "drücke ESC ⎋ zum Beenden",
		quit_g: "drücke ESC ⎋ zum Beenden des Spiels",
		duplicates: "duplizierte Spielername sind nicht erlaubt",
		blank: "einige Spielernamen sind leer",
		match: "Spiel",
		f_match: "FINALSPIEL",
		ret: "Weiterleitung zur Spiel-Auswahl",
		has_won: "hat gewonnen",
		endTour: "das Turnier ist beendet",
		nextMatchTour: "das nächste Spiel beginnt bald"
	}
}

let currentLang = "en"
const savedLanguage = localStorage.getItem('language')
if (savedLanguage){
	currentLang = savedLanguage
}

function translate(item) {
	return lang_pack[currentLang][item]
}

function changeLang(lang) {
	if (currentPage === "game" || currentPage === "tournament_results") {
		alert(translate('langWarning'))
		return
	} else if (currentLang === lang) {
		alert(translate('langUsed'))
		return
	}
	currentLang = lang
	localStorage.setItem('language', currentLang);
	loadPage(currentPage)
}

function highlightCurrentLang() {
	const langswitchers = document.getElementsByClassName('langswitch')
	for (button of langswitchers) {
		button.style.textDecoration = button.id == currentLang ? "underline" : "none"
	}
}

//Gets all translatable elements (class: "translate") and populates their innerHTML with string from dataset (data-[lang])
function translatePage(){
	let translatable = document.getElementsByClassName('translate')
	// get translations from each element's dataset and set them as innerHTML
	for (let element of translatable) {
		//console.log(element.tagName, element.innerHTML)
		element.innerHTML = element.dataset[currentLang]
	}
	highlightCurrentLang()
}
