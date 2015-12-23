import {$} from './jquery';
import {PLAYER_SELECTOR} from './consts';
import {getSrc, getDuration} from './jplayer';
import parsePlaylist from './parse-playlist';
import waitUntil from './wait-until';
import {playlistItemLinkClassName} from './style.css';

var clickBoundedItems = [];

export default function interactivatePlaylist() {
	clickBoundedItems.forEach(function($item) {
		$item.off('click.tweaKZr');
	});

	clickBoundedItems = [];

	var playlistMap = parsePlaylist().map;
	var $playlist = $(".playlist_popover_songs");
	$playlist
		.find("p")
		.toArray()
		.forEach(function(listItem) {
			var $item = $(listItem),
				text = $item.text().trim(),
				itemData = playlistMap[text];
			if (itemData) {
				waitUntil({
					condition() {
						var src = getSrc();

						if (src !== itemData.src) {
							return "stop";
						}

						var duration = getDuration();
						return duration > itemData.seconds;
					},
					callback() {
						$item
							.addClass(playlistItemLinkClassName)
							.on("click.tweaKZr", onItemClick.bind(null, itemData.seconds));
						clickBoundedItems.push($item);
					}
				});
			}
		});
}

function onItemClick(seconds) {
	var duration = getDuration();
	if (duration > seconds) {
		var seekPercent = seconds / duration * 100;
		$(PLAYER_SELECTOR).jPlayer("playHead", seekPercent);
	}
}
