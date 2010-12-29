var AlloflyricsComSearcher = function(){
    var artistName;
    var songName;
    var domainName = "http://alloflyrics.com"
    var songListUrl;
    var currentPage = 1;
    var req = new XMLHttpRequest();

    function showArtist() {
        var data = req.responseText;
        var regexp = RegExp('<a .* href="(/search/.*)" .*>.*' + artistName + '.*</a>', 'mi');
        if(!data.match(regexp)){
           popup.onNotFound();
           return;
	}
        songListUrl = data.match(regexp)[1];
	req = new XMLHttpRequest();        
	req.open(
                "GET",
                domainName + songListUrl,
                true);
        req.onload = showSongList;
        req.send(null);
    }

    function showSongList() {
        var data = req.responseText;
        var regexp = RegExp('<a href="(/lyrics/.*)" title=.*>.*' + songName + '.*</a>', 'mi');

        if(!data.match(regexp)){
	   currentPage++;
	   regexp = RegExp('<a href="/search/.*">' + currentPage + '</a>', 'mi');
	
           if(data.match(regexp)){
	      req = new XMLHttpRequest();	      
	      req.open(
              "GET",
              domainName + songListUrl + "&p=" + currentPage,
              true);
              req.onload = showSongList;
              req.send(null);
           } else {
              popup.onNotFound();
           }
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
        var regexp = RegExp('<pre.*>([\\s\\S]*)</pre>', 'mi');
        document.getElementById("text").innerHTML = '<pre>' + data.match(regexp)[1] + '</pre>';
	regexp = RegExp('Текст песни &#171;(.*)&#187;', 'mi');
	document.getElementById("title").innerHTML = data.match(regexp)[1];
	popup.onFound();
    }

    this.search = function(artist, song){
	artistName = artist;
	songName = song;
	currentPage = 1;
	popup.onStartSearch();
        req = new XMLHttpRequest();
	req.open(
           "GET",
           domainName,
           true);
        req.onload = function(){
           req = new XMLHttpRequest();
	   req.open(
           "GET",
           domainName + "/search/?" +
           "text=" + artistName +
           "&search=artist",
           true);
           req.onload = showArtist;
           req.send(null);	   
        }
	req.send(null);
    }
}
