import {STOP_WAIT_UNTIL, INTERVAL_DURATION} from './consts';

export default function waitUntil(options) {
	var handler = setInterval(intervalFn, INTERVAL_DURATION);

	function intervalFn(){
		var result = options.condition();
		if (result) {
			clearInterval(handler);
			options.callback();
		} else if (result === STOP_WAIT_UNTIL){
			clearInterval(handler);
		}
	}
}
