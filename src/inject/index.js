import waitUntil from './wait-until';
import {set$} from './jquery';
import jPlayerFixer from './jplayer-fixer';
import init from './init';

var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {	
		clearInterval(readyStateCheckInterval);

		waitUntil({
			condition(){
				return !!window.jQuery;
			},
			callback(){
				set$(window.jQuery);
				jPlayerFixer();
				init();
			}
		});
	}
}, 10);

export default {};
