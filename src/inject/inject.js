//chrome.extension.sendMessage({}, function(response) {
// inject code into "the other side" to talk back to this side;
var scr = document.createElement("script");
//appending text to a function to convert it's src to string only works in Chrome
scr.textContent = "(" + function () {
	var $, clickBoundedItems =[];
	var PLAYER_SELECTOR = '#jquery_jplayer_1';
	var INTERVAL_DURATION = 200;
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			waitUntil({
				condition(){
					return !!window.jQuery;
				},
				callback: function(){
					$ = window.jQuery;
					monkeypatch()
					onPageLoad();
				}
			});

		}
	}, 10);

	function waitUntil(options) {
		var handler = setInterval(intervalFn, INTERVAL_DURATION);

		function intervalFn(){
			var result = options.condition();
			if (result) {
				clearInterval(handler)
				options.callback();
			} else if (result === "stop"){
				clearInterval(handler)
			}
		}
	}

	function monkeypatch() {
		var jPlayerData = $(PLAYER_SELECTOR).data('jPlayer');
		var origSetMedia = jPlayerData.setMedia.bind(jPlayerData);
		if (!$.jPlayer.event.setmedia) {
			$.jPlayer.event.setmedia = 'jPlayer_setmedia';
			jPlayerData.setMedia = getSetMedia($(PLAYER_SELECTOR), origSetMedia)
		}
		

	}

	function getSetMedia($player, superFn) {
		return function(media){
			superFn(media);
			$player.trigger($.jPlayer.event.setmedia);
		}
	}

	function onPageLoad(){
		
		waitUntil({
			condition: function(){
				return !!$(PLAYER_SELECTOR).data("jPlayer");
			},
			callback: function(){
				bindPlaylistClicks();
				$(PLAYER_SELECTOR).on($.jPlayer.event.setmedia, function(){
					setTimeout(bindPlaylistClicks, 1000)
				});
			}
		});

		appendDownloadLinks();

	}

	function appendDownloadLinks(){
		$('.archived_show').toArray().forEach(function(show){
			var $show = $(show);
			var $downloadLink = $('<img class="archived_show_download" src="/app/wp-content/themes/kz1/images/play.png">');
			var href = $show.attr('alt');
			$downloadLink.css('transform', 'rotate(90deg)');
			$show.prepend($downloadLink);
		});

		$('body').on('click.tweaKZr', '.archived_show_download', function(event){
			$downloadLink = $(event.currentTarget);
			var link = document.createElement("a");
		    link.download = $downloadLink.parent().text();
		    link.href = $downloadLink.parent().attr('alt');
		    link.target = '_blank';
		    link.click();
		})
	}

	function bindPlaylistClicks(){
		clickBoundedItems.forEach(function($item) {
			$item.off('click.tweaKZr');
		});

		clickBoundedItems = [];

		var playlistMap = parsePlaylist().map;
		var $playlist = $(".playlist_popover_songs");
		$playlist
			.find("p")
			.toArray()
			.forEach(function(listItem, i){
				var $item = $(listItem),
					text = $item.text().trim(),
					itemData = playlistMap[text];
				if (itemData) {
					waitUntil({
						condition: function(){
							var src = getSrc();

							if (src !== itemData.src) {
								return "stop";
							}

							var duration = getDuration();
							return duration > itemData.seconds;				
						},
						callback: function(){
							$item
								.css({cursor: 'pointer', 'text-decoration': 'underline'})
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

	function getSrc(){
		var jPlayerData = $(PLAYER_SELECTOR).data('jPlayer');
		var src = jPlayerData && jPlayerData.status && jPlayerData.status.src;
		return src;
	}

	function getDuration(){
		var durationText = $('.jp-duration').text().trim();
		var splitted = durationText.split(":"); // split it at the colons

		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		var duration = (((+splitted[0])) * 60 * 60) + (((+splitted[1])) * 60) + (+splitted[2]);
		return duration;
	}

	function parsePlaylist(){
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
				id: id,
				index: i,
				seconds: seconds,
				src: src
			};
			array.push({
				title: title,
				id: id,
				seconds: seconds,
				src: src
			});
			
		});


		return {
			array: array,
			map: map
		};
	}
} + ")();";
//cram that sucker in 
(document.head || document.documentElement).appendChild(scr);
//and then hide the evidence as much as possible.
scr.parentNode.removeChild(scr);