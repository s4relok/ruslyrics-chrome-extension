var LyricsWikiaComSearcher = function(){
    var artistName;
    var songName;
    var domainName = "http://lyrics.wikia.com"
    var req = new XMLHttpRequest();

    function showSongList() {
        var data = req.responseText;
        var regexp = RegExp('<a href="(/.*)" title=.*>.*' + songName + '.*</a>', 'mi');
        if(!data.match(regexp)){
           popup.onNotFound();
           return;
	}
        var songTextUrl = data.match(regexp)[1];
        req = new XMLHttpRequest();
        req.open(
                "GET",
                domainName + songTextUrl,
                true);
        req.onload = showSong;
        req.send(null);
    }

    function showSong() {
        var data = req.responseText;
        var regexp = RegExp('<div class=\'lyricbox\'>.*</div>([\\s\\S]*)<div class=\'rtMatcher\'>', 'mi');
	if(!data.match(regexp)){
	   popup.onNotFound();
           return;	
	}
        document.getElementById("text").innerHTML = '<pre>' + data.match(regexp)[1] + '</pre>';
	regexp = RegExp('<h1>(.*' + artistName + '.*:.*' + songName + '.*)</h1>', 'mi');
	if(!data.match(regexp)){
	   popup.onFound();
           return;	
	}
	document.getElementById("title").innerHTML = data.match(regexp)[1];
	popup.onFound();
    }

    this.search = function(artist, song){
	artistName = artist;
	songName = song;
	popup.onStartSearch();
	req.open(
            "GET",
            domainName + "/index.php?" +
                    "search=" + artistName +
                    "&fulltext=0",
            true);
	    //req.overrideMimeType('text/xml; charset=iso-8859-1');
	    req.onload = showSongList;
	    req.send(null);
    }
}
