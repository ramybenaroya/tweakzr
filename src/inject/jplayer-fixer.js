import {PLAYER_SELECTOR} from './consts';
import {$} from './jquery';

function wrapSetMedia($player, superSetMedia) {
	return function(media){
		superSetMedia(media);
		$player.trigger($.jPlayer.event.setmedia);
	}
}

export default function jPlayerFixer() {
	var jPlayerData = $(PLAYER_SELECTOR).data('jPlayer');
	var origSetMedia = jPlayerData.setMedia.bind(jPlayerData);
	if (!$.jPlayer.event.setmedia) {
		$.jPlayer.event.setmedia = 'jPlayer_setmedia';
		jPlayerData.setMedia = wrapSetMedia($(PLAYER_SELECTOR), origSetMedia)
	}
}
