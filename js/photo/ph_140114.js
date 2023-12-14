//<!-- Begin to hide script contents from old browsers.
function setAlbum() {
	this.eid		 = "";
	this.blogurl	 = "";
	this.albumserial = "";
	this.albumtitle	 = "";

	this.imageserial = "";
	this.imageinfo = new Image();
	this.nextimageserial = "";
	this.nextimageinfo = new Image();

	this.photoserial = new Array();
	this.photopath	 = new Array();
	this.photoname	 = new Array();
	this.photothumb	 = new Array();
	this.photoorgnl	 = new Array();
	this.photofileinfo = new Array();
	this.photopdssvr  = new Array();
	this.phototags	 = new Array();
	this.photoexif	 = new Array();
	this.photocomment = new Array();
	this.index		 = "";
	this.init		 = Albuminit;

	this.tagxml		 = null;
	this.chkxml		 = false;
	this.tagcnt		 = 0;
	this.taglst		 = null;
	this.tagbox		 = null;
	this.prebox		 = null;
	this.pretag		 = null;
	this.tmptag		 = null;
	this.nowtag		 = null;
	this.txtover	 = false;
	this.lstover	 = false;

	this.linkon		 = false;
	this.linkobj	 = null;
	this.linknow	 = -1;
	this.linkmax	 = 0;

	this.spanid	 = null;
	this.tmpspanid	 = null;
	this.taglistid	 = null;
	this.loading = "http://md.egloos.com/img/x.gif";
}

setAlbum.prototype.schIndex = function (imageserial) {
	var idx = -1;
	for (var i = 0 ; i < this.photoserial.length ; i++) {
		if ( this.photoserial[i] == imageserial ) {var idx = i; break;}
	}
	return idx;
}

setAlbum.prototype.setPhoto = function (imageserial) {
	if ( this.imageserial == imageserial ) return;

	this.imageinfo = document.getElementById("photoimg");
	this.imageinfo.src = this.loading; 	//now loading... image

	var oldimageserial = this.imageserial;
	this.imageserial = imageserial;
	this.index = this.schIndex(imageserial);
	if ( imageserial == this.nextimageserial )
	{
		this.imageinfo.width = this.nextimageinfo.width;
		this.imageinfo.height = this.nextimageinfo.height;
		this.imageinfo.src = this.nextimageinfo.src;
	}
	else {
		var imageinfoary = this.photofileinfo[this.index].split("|");
		this.imageinfo.width = imageinfoary[0];
		this.imageinfo.height = imageinfoary[1];
		this.imageinfo.src = "http://" + this.photopdssvr[this.index] + ".egloos.com/" + this.photopath[this.index] + this.photoname[this.index];
	}
	this.setthumbnail(oldimageserial);
	this.nextimageload();

//	var tagsary = this.phototags[this.index].split(",");
//	var tagstr = [];
//	for (var i = 0 ; i < tagsary.length ; i++ ) {
//		tagstr.push('<a href="/photo/tag/' + encodeURI(tagsary[i]) + '" title="' + tagsary[i] + '">' + tagsary[i] + '</a>');
//	}

//	var bigsizestr = "";
//	if ( this.photoorgnl[this.index] != "" )
//		bigsizestr = '<a href="#" onclick="AlbumInfo.orgPhotoView(); return false;" title="원본사이즈 사진 보기"><img src="http://md.egloos.com/skn/pht/a/01/00/bt_bigsize_type1.gif" alt="원본사이즈 사진보기" /></a>';
}

// nextimage preload
setAlbum.prototype.nextimageload = function () {
	if( this.index+1 >= this.photoserial.length ) {
		this.nextimageinfo = new Image();
		this.nextimageserial = "";
	}
	else {
		var nextindex = this.index+1;
		var nextimageary = this.photofileinfo[nextindex].split("|");
		this.nextimageserial = this.photoserial[nextindex];
		this.nextimageinfo.width = nextimageary[0];
		this.nextimageinfo.height = nextimageary[1];
		this.nextimageinfo.src = "http://" + this.photopdssvr[nextindex] + ".egloos.com/" + this.photopath[nextindex] + this.photoname[nextindex];
	}

}

setAlbum.prototype.setthumbnail = function (oldimgsrl) {
	var oldindex = this.schIndex(oldimgsrl);
	var oldthumbstr = "<a href=\"#\" onclick=\"AlbumInfo.setPhoto('" + oldimgsrl + "\'); return false;\" onfocus=\"blur();\"><img src=\"http://thumbnail.egloos.net/70x70/http://" + this.photopdssvr[oldindex] + ".egloos.com/" + this.photopath[oldindex] + this.photoname[oldindex] + "\" alt=\"\" onerror=\"this.src='http://md.egloos.com/thumbnail.gif'\" /></a>";
	var newthumbstr = "<a href=\"#\" onclick=\"AlbumInfo.setPhoto('" + this.imageserial + "'); return false;\" onfocus=\"blur();\" class=\"current\"><img src=\"http://thumbnail.egloos.net/70x70/http://" + this.photopdssvr[this.index] + ".egloos.com/" + this.photopath[this.index] + this.photoname[this.index] + "\" alt=\"\" onerror=\"this.src='http://md.egloos.com/thumbnail.gif'\" /></a>";

	document.getElementById("photo"+oldimgsrl).innerHTML = oldthumbstr;
	document.getElementById("photo"+this.imageserial).innerHTML = newthumbstr;
}

setAlbum.prototype.nextPhoto = function () {
	var html = "";
}

setAlbum.prototype.nextPhoto = function () {
	if ( this.nextimageserial != "" ) 	{
		this.setPhoto(this.nextimageserial);
	}
	else {
		var response = confirm("앨범의 마지막 사진입니다. 다음 앨범을 보시겠습니까?");
		if (response) {
			location.href = "/photo/" + this.nextalbumserial;
			//postdata = "eid=" + this.eid + "&srl=" + this.albumserial + "&fsrl=" + this.imageserial;
			//var url = "/photolog/photo_next_view.php";
			//XMLHttpConnectPost(url,postdata,"resXml");
		}
	}
}

setAlbum.prototype.orgPhotoView = function () {
	ap_openwin("/photolog/photo_org.php?eid=" + this.eid + "&srl=" + this.albumserial + "&fsrl=" + this.imageserial , "photologview", 520, 600, 3, true, true, true);
}

setAlbum.prototype.Permalink = function () {
	location.href = "/photo/album/" + this.albumserial + "/" + this.imageserial;
}

setAlbum.prototype.sendAlbum = function () {
    ap_openwin("/photolog/send_album_pp.php?eid=" + this.eid + "&srl=" + this.albumserial, "tagapply", 520, 760, 3, false, true, false);
}

setAlbum.prototype.sendPhoto = function () {
	ap_openwin("/photolog/send_photo_pp.php?eid=" + this.eid + "&srl=" + this.albumserial + "&filesrl=" + this.imageserial + "&subject=" + encodeURI(this.albumtitle), "tagapply", 520, 600, 3, false, true, false);
}

setAlbum.prototype.tagEditbox = function (){
	postdata = "eid=" + this.eid + "&tags=" + encodeURIComponent(this.phototags[this.index]);
	var url = "/photolog/photo_tagedit.php";
	XMLHttpConnectPost(url,postdata,"resXml");
}
setAlbum.prototype.tagEditboxView = function (html,cnt) {
	document.getElementById("info").innerHTML = html;
	this.taglst	= document.getElementById('taglst');
	this.tagbox	= document.getElementById('tagbox');
	this.tagcnt = cnt;
	setTimeout("document.getElementById('" + this.tagbox.id + "').focus()",500);
}

setAlbum.prototype.tagLinkNxt = function() {
	if (this.linknow < this.linkmax-1) {
		this.tagLinkSelect(this.linknow + 1);
	}
	else {
		this.tagLinkSelect(0);
	}
}
setAlbum.prototype.tagLinkPre = function() {
	if (this.linknow > 0) {
		this.tagLinkSelect(this.linknow-1);
	}
	else {
		this.tagLinkSelect(this.linkmax-1);
	}
}
setAlbum.prototype.tagLinkSelect = function(num) {
	this.linkon  = true;
	this.linknow = num;
	this.linkobj = $("taglnk"+num);
	this.linkobj.className = "lnk_hover";
	this.tmptag = this.linkobj.title;
	this.tagbox.value = this.linkobj.title;

	for (var i=0;i<this.linkmax;i++) {
		if (i != num) {
			$("taglnk"+i).className = "lnk_none";
		}
	}
}
setAlbum.prototype.tagLinkOnclick = function() {
	this.linkobj.onclick();
	this.taglst.style.display = "none";
}

setAlbum.prototype.tagTextbox = function (value) {
	this.tagbox.value = value;
	this.taglst.style.display = "none";
	this.linkon = false;
}
setAlbum.prototype.tagLinkover = function(num) {
	this.txtover = true;
	this.tagLinkSelect(num);
}

setAlbum.prototype.tagSet = function (kwd,opt){
	if ( opt == "1" ) {
		this.phototags[this.index] = this.phototags[this.index] + kwd + ",";
	}
	else
		eval("this.phototags[this.index] = this.phototags[this.index].replace(/" + kwd + ",/i,\"\");");
	this.tagEditbox();
}

setAlbum.prototype.tagChange = function (tag,kwd){
	eval("this.phototags[this.index] = this.phototags[this.index].replace(/" + tag + ",/i,\"" + kwd + ",\");");
	this.tagEditbox();
}

setAlbum.prototype.tagChangeHtml = function () {
	document.getElementById(this.spanid).innerHTML = "<a href=\"#\" onclick=\"AlbumInfo.taginput('" + this.spanid + "','" + this.prebox.value + "'); return false;\" title=\"\">" + this.prebox.value + "</a><a href=\"#\" onclick=\"AlbumInfo.tagdelete('" + this.prebox.value + "'); return false;\" class=\"del\"><img src=\"http://md.egloos.com/skn/pht/a/01/00/bt_tag_delete.gif\" alt=\"x\" /></a>";
}


setAlbum.prototype.tagView = function (){
	clearInterval(this.taglistid);
	this.chkxml = false;
	this.prebox = null;

	postdata = "eid=" + this.eid + "&fsrl=" + this.imageserial;
	var url = "/photolog/photo_tagview.php";
	XMLHttpConnectPost(url,postdata,"resXml");
}

setAlbum.prototype.taginput = function (spanid,tag){
	document.getElementById(spanid).innerHTML = "<span id=\"taginput\"><input type=\"text\" id=\"tagbox\" autocomplete=\"off\" maxlength=\"20\" value=\"" + tag + "\" onkeypress=\"AlbumInfo.tagupdate(this,event,'" + tag + "');\" /></span>";
}

setAlbum.prototype.taginput_new = function (spanid,tag){
	if(this.prebox!=null) {
		AlbumInfo.tagupdate(this.prebox,event,this.pretag,true);
	}

	document.getElementById(spanid).innerHTML = "<span id=\"taginput\"><input type=\"text\" id=\"tagbox\" name=\"kwd\" autocomplete=\"off\" value=\"" + tag + "\" onkeypress=\"AlbumInfo.tagupdate(this,event,'" + tag + "',false);\" /><span id=\"taglst\" class=\"taglist\"></span></span>";

	this.spanid = spanid;
	this.tagbox	= document.getElementById('tagbox');
	this.prebox = this.tagbox;
	this.pretag = tag;

	document.getElementById("taglistbox").innerHTML = "<span id=\"taginput\"><input type=\"text\" id=\"tagbox\" name=\"kwd\" autocomplete=\"off\" value=\"\"  onkeypress=\"AlbumInfo.taginsert(this,event);\" /><span id=\"taglst\" class=\"taglist\"></span></span>";
//			document.getElementById("taglistbox").innerHTML = "<input type=\"text\" name=\"kwd\" >"
}

setAlbum.prototype.taginsert = function (obj,evt){

	if (evt.keyCode==13) {
		var kwd = obj.value.trim();
		if (!chkSpecialset(kwd)) {
			alert("내용에 특수문자를 사용할 수 없습니다.");
			obj.focus();
		}
		else if ( kwd!="" && this.phototags[this.index].indexOf(kwd+",") >= 0 ) {
			alert("동일한 태그가 존재합니다.");
			obj.focus();
		}
		else if ( kwd != ""  ) {
			var imgurl = "http://" + this.photopdssvr[this.index] + ".egloos.com/" + this.photopath[this.index] + this.photoname[this.index]
			var postdata = "eid=" + this.eid + "&srl=" + this.albumserial + "&fsrl=" + this.imageserial + "&kwd=" + encodeURIComponent(kwd) + "&url=" + encodeURIComponent(imgurl);
			var url = "/photolog/photo_taginsert_exec.php";
			XMLHttpConnectPost(url,postdata,"resXml");
		}
	}
}

setAlbum.prototype.tagupdate = function (obj,evt,tag){
	if (evt.keyCode==13) {
		var kwd = obj.value.trim();
		if ( kwd == "" ) { this.tagdelete(tag); }
		else if (!chkSpecialset(kwd)) {
			alert("내용에 특수문자를 사용할 수 없습니다.");
			obj.focus();
		}
		else if ( this.phototags[this.index].indexOf(kwd+",") >= 0 ) {
			alert("동일한 태그가 존재합니다.");
		}
		else {
			var postdata = "eid=" + this.eid + "&fsrl=" + this.imageserial + "&kwd=" + encodeURIComponent(kwd) + "&tag=" + encodeURIComponent(tag);
			var url = "/photolog/photo_tagupdate_exec.php";
			XMLHttpConnectPost(url,postdata,"resXml");
		}
	}
}

setAlbum.prototype.tagdelete = function (tag){
	this.prebox = null;
	if ( tag != "" ) {
		var postdata = "eid=" + this.eid + "&fsrl=" + this.imageserial + "&tag=" + encodeURIComponent(tag);
		var url = "/photolog/photo_tagdelete_exec.php";
		XMLHttpConnectPost(url,postdata,"resXml");
	}
}
	
setAlbum.prototype.runComment = function (photoSerial, commentSerial) {
	if(photoSerial) {
		this.commentExec.runComment(photoSerial, commentSerial);		
	} else {
		this.commentExec.runComment(this.imageserial, '');
	}
}
	
setAlbum.prototype.replyComment = function (photoSerial, commentSerial) {
	this.commentExec.replyComment(photoSerial, commentSerial);
}
	
setAlbum.prototype.deleteComment = function (albumSerial, commentSerial, isAnonymous) {
	this.commentExec.deleteComment(this.eid, albumSerial, commentSerial, isAnonymous);
}

String.prototype.trim = function()
{
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

function fadeIn(opacity, objId) {
	if (opacity <= 100) {
		setOpacity(opacity, objId);
		opacity += 20;
		window.setTimeout("fadeIn(" + opacity + ",'" + objId + "')", 50);
	}
}

function setOpacity(opacity, objId) {
	var obj = document.getElementById(objId).style;
	obj.filter = "alpha(opacity=" + opacity + ")";
	obj.MozOpacity = (opacity / 100);
	obj.opacity = (opacity / 100);
	obj.KhtmlOpacity = (opacity / 100);
}

var areaover = false;
var timeout = null;
function showmenu(menudiv)
{
	var menudivObj				= document.getElementById(menudiv);
	menudivObj.style.display	= "block";
	hidemenu(menudiv);
}

function hidemenu(menudiv)
{
	new PeriodicalExecuter(function(pe) { 
			if ( areaover == false )
			{
				var menudivbtn = document.getElementById(menudiv);
				if ( menudivbtn.style.display == "" || menudivbtn.style.display == "block")
					menudivbtn.style.display = "none";
				pe.stop();
			}
		}, 2); 
}

function chkSpecialset(str) {
    var specialset = "`~!@#$%^&*()+|\\=[]{};':\",./<>?";
    for( var i = 0; i < str.length; i++ ) {
        thischar = str.charAt( i );
        if( specialset.indexOf(thischar) != -1 ) { return false; }
    }
	return true;
}


// This stops the javascript from hiding -->
