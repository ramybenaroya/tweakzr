import waitUntil from './wait-until';
import {PLAYER_SELECTOR} from './consts';
import interactivatePlaylist from './interactivate-playlist';
import addDownloadLinks from './add-download-links';
import {$} from './jquery';

export default function init(){
	waitUntil({
		condition(){
			return !!$(PLAYER_SELECTOR).data("jPlayer");
		},
		callback(){
			interactivatePlaylist();
			$(PLAYER_SELECTOR).on($.jPlayer.event.setmedia, function(){
				setTimeout(interactivatePlaylist, 1000)
			});
		}
	});

	addDownloadLinks();
}
