import {downloadLinkClassName} from './style.css';
import {$} from './jquery';

export default function addDownloadLinks() {
	$('.archived_show').toArray().forEach(function(show) {
		var $show = $(show);
		var $downloadLink = $(`<div class="${downloadLinkClassName}"></div>`);
		$show.prepend($downloadLink);
	});

	$('body').on('click.tweaKZr', `.${downloadLinkClassName}`, function(event) {
		var $downloadLink = $(event.currentTarget);
		var link = document.createElement("a");
		link.download = $downloadLink.parent().text();
		link.href = $downloadLink.parent().attr('alt');
		link.target = '_blank';
		link.click();
	});
}