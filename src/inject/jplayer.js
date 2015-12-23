import {$} from './jquery';
import {PLAYER_SELECTOR, DURATION_SELECTOR} from './consts';

export function getSrc(){
	var jPlayerData = $(PLAYER_SELECTOR).data('jPlayer');
	var src = jPlayerData && jPlayerData.status && jPlayerData.status.src;
	return src;
}

export function getDuration(){
	var durationText = $(DURATION_SELECTOR).text().trim();
	var splitted = durationText.split(":"); // split it at the colons

	// minutes are worth 60 seconds. Hours are worth 60 minutes.
	var duration = (((+splitted[0])) * 60 * 60) + (((+splitted[1])) * 60) + (+splitted[2]);
	return duration;
}