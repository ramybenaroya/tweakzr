import {$} from './jquery';
import {getSrc} from './jplayer';

export default function parsePlaylist(){
	var map = {};
	var array = [];
	$(".track .item-track").toArray().forEach(function(item, i){
		var src = getSrc();
		var $item = $(item);
		var id = $item.attr("id");
		var title = $item.find(".item-title").text().trim();
		var time = $item.find(".track-time").text();
		var splitted = time.split(":"); // split it at the colons

		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		var seconds = ((+splitted[0])) * 60 + (+splitted[1]);
		map[title] = {
			id,
			index: i,
			seconds,
			src
		};
		array.push({
			title,
			id,
			seconds,
			src
		});
		
	});

	return {
		array,
		map
	};
}
