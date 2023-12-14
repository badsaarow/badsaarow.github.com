/**
 *  PhotoAlbum class
 */

function PhotoAlbum(albumInfo){
	this.photos = (albumInfo == "undefined") ?  new AlbumInfo() : albumInfo;
    this.widthOfThumb = "70";
    this.heightOfThumb = "70";
}

PhotoAlbum.prototype.getWidth = function(photoIndex) {
	var dimension = this.photos.photofileinfo[photoIndex].split("|");
	return dimension[0];
}; 
 
PhotoAlbum.prototype.getHeight = function(photoIndex) {
	var dimension = this.photos.photofileinfo[photoIndex].split("|");
	return dimension[1];
};

PhotoAlbum.prototype.getThumbWidth = function() {
	return this.widthOfThumb;
};

PhotoAlbum.prototype.getThumbHeight = function() {
	return this.heightOfThumb;
};

PhotoAlbum.prototype.getSource = function(photoIndex) {
	if(photoIndex >= 0 && photoIndex < this.getLength()){
		var source = "http://" + this.photos.photopdssvr[photoIndex] + ".egloos.com/" +
			this.photos.photopath[photoIndex] + this.photos.photoname[photoIndex];
		return source;
	}
	return null;
};

PhotoAlbum.prototype.getThumbSource = function(photoIndex) {
	if(photoIndex >= 0 && photoIndex < this.getLength()){
		var source = "http://thumbnail.egloos.net/70x70/http://" + this.photos.photopdssvr[photoIndex] + ".egloos.com/" +
			this.photos.photopath[photoIndex] + this.photos.photoname[photoIndex];
		return source;
	}
	return null;
};

PhotoAlbum.prototype.getExif = function(photoIndex){
	return this.photos.photoexif[photoIndex];
};

PhotoAlbum.prototype.getPhotoTags = function(photoIndex){
	return this.photos.phototags[photoIndex];
};

PhotoAlbum.prototype.getOriginalPhoto = function(photoIndex){
	return this.photos.photoorgnl[photoIndex];
};

PhotoAlbum.prototype.getComment = function(photoSerial){
	var comments = this.photos.photocomment[photoSerial];
	return comments;
};
PhotoAlbum.prototype.getLength = function(){
	if(this.photos.photoserial){
		return this.photos.photoserial.length;
	}else{
		return 0;
	}
};

PhotoAlbum.prototype.getIndexFromSerial = function(serial){
	for(var i=0; i < this.photos.photoserial.length; i++){
		if(this.photos.photoserial[i] == serial){
			return i;
		}
	}
	return -1;
};

PhotoAlbum.prototype.getPhotoFromIndex = function(i){
	var photo = '';
	if(this.photos.photoserial[i])
	{
		return 	{
			"serial" : this.photos.photoserial[i],
			"path" : this.photos.photopath[i],
			"name" : this.photos.photoname[i],
			"thumb" : this.photos.photothumb[i],
			"orgnl" : this.photos.photoorgnl[i],
			"fileinfo" : this.photos.photofileinfo[i],
			"pdssvr" : this.photos.photopdssvr[i],
			"tags" : this.photos.phototags[i],
			"exif" : this.photos.photoexif[i]
		}
	}
	else
		return false;
};

PhotoAlbum.prototype.getSerialFromIndex = function(index){
	if(index >=0 && index < this.photos.photoserial.length){
		return this.photos.photoserial[index];
	}
	return "";
};

PhotoAlbum.prototype.getNextAlbumSerial = function(){
	return this.photos.nextalbumserial;
};

PhotoAlbum.prototype.appendPhoto = function (serial, path, name, thumb, orgnl, fileinfo, pdssvr, tags, exif) {
	this.photos.photoserial = this.photos.photoserial.concat(serial);
	this.photos.photopath = this.photos.photopath.concat(path);
	this.photos.photoname = this.photos.photoname.concat(name);
	this.photos.photothumb = this.photos.photothumb.concat(thumb);
	this.photos.photoorgnl = this.photos.photoorgnl.concat(orgnl);
	this.photos.photofileinfo = this.photos.photofileinfo.concat(fileinfo);
	this.photos.photopdssvr = this.photos.photopdssvr.concat(pdssvr);
	this.photos.phototags = this.photos.phototags.concat(tags);
	this.photos.photoexif = this.photos.photoexif.concat(exif);
};
	
PhotoAlbum.prototype.loadThumbnail = function (imageObject, photoSerial) {
	if(imageObject.src == 'http://md.egloos.com/img/x.gif') {
		if($('thumb_' + photoSerial)) {
			imageObject.src = $('thumb_' + photoSerial).src;
		} else {
			var index = this.getIndexFromSerial(photoSerial);
			imageObject.src = this.getThumbSource(index);
		}
	}
}

PhotoAlbum.prototype.resetPhotoComment = function (json){
	this.photos.photocomment = json;
}

var PHOTOLOG_STR_MOVENEXTALBUM = "앨범의 마지막 사진입니다. 다음 앨범을 보시겠습니까?";
var PHOTOLOG_STR_TOOLTIP_GUIDE = "클릭하시면 다음사진이 보입니다."

/**
 *  PhotoLog class
 */
var PhotoLog = Class.create();

PhotoLog.prototype = {
	initialize: function(idOfPhoto, photoAlbum, options){

		this.photoDiv = $(idOfPhoto);
		
		if(this.photoDiv == null) {
			document.location.href = options.movePage;
			return;
		}

	    this.options = Object.extend({
			photoIndex: 0,
			isOwner: false,
			isImgProtect: false,
			isSeeingExif: false,

			idOfTagBar: "info",
			idOfExifInfo: "exifview",
			idOfComment: "comment_wrap",
			idOfCommentView: "photocmt",
			idOfNavigation: "navigation",
			idOfThumbContainer: "slidelist_container",
			idOflblBackward: "lblActionBackward",
			idOflblForward: "lblActionForward",
			idOfbtnSlidePrev: "slidelist_prev",
			idOfbtnSlideNext: "slidelist_next"
			}, options || {});

		this.idOfTagBar = this.options.idOfTagBar;
		this.idOfNavigation = this.options.idOfNavigation;
		this.idOfExifInfo = this.options.idOfExifInfo;
		this.photoAlbum = this._checkArgument(photoAlbum, new PhotoAlbum());
		this.isOwner = this.options.isOwner;
		this.isSeeingExif = this.options.isSeeingExif;
		this.idOfThumbContainer = this.options.idOfThumbContainer;

		var photoIndex = this.options.photoIndex;
		photoIndex= (photoIndex < 0) ? 0: photoIndex;
		this.photoIndex = this._checkArgument(photoIndex, 0);
		this.photoSerial = this.photoAlbum.getSerialFromIndex(this.photoIndex);

		this.overlapper = new Photo.Overlapper(this.photoDiv, this.photoAlbum,
				{
					startIndex: this.photoIndex,
					effect: 1,
					duration:0.3,
					handleFrontBoundary:this.handleBoundary,
					handleRearBoundary:this.handleBoundary,
					image_style:"main_image",
					isImgProtect: this.options.isImgProtect
				});

		this.navigation = new PhotoNavigation(this.photoDiv, this.idOfNavigation,
				{
					zindex: 3,
					slideDuration: 5,

					fncMoveForward: this.moveForward.bind(this),
					fncMoveBackward: this.moveBackward.bind(this),
					fncSlideExcute: this.slideExcute.bind(this),

					idOfForward: 'btnForward',
					idOfBackward: 'btnBackward',
					idOfSlide: 'btnSlide',
					idOfSlideInfo: 'lblSlideInfo'
				}
				);
		this.comments = new PhotoCommentDisplay($(this.options.idOfComment), this.options.idOfCommentView);
		
		if(this.photoAlbum.getLength() >= 2){

			this.slideList = new PhotoSlideList($(this.idOfThumbContainer),
					{
						fncPrevScroll: this.movePhoto.bind(this),
						fncNextScroll: this.movePhoto.bind(this),
						fncAppendThumb: this.appendThumb.bind(this),

						idOfBtnPrev: this.options.idOfbtnSlidePrev,
						idOfBtnNext: this.options.idOfbtnSlideNext
					});
			if(this.photoIndex != 0) this._applySlideList(this.photoIndex);
			this._changeSlideButton();
			this._applyLegacyCode(this.photoIndex);
		}


		this._applyNavigation(this.photoIndex);
		this._hideExifInfo();
		this._changeCommentView();

		Event.observe(this.photoDiv, "mouseover", this._mouseoverHandler.bindAsEventListener(this));
		Event.observe(this.photoDiv, "mousemove", this._mousemoveHandler.bindAsEventListener(this));
		Event.observe(this.photoDiv, "mouseout", this._mouseoutHandler.bindAsEventListener(this));
		Event.observe(this.photoDiv, "click", this._clickHandler.bindAsEventListener(this));
	},

	_mouseoverHandler: function(event){
		this._showExifInfo(event);
		this._showCommentView(event);
		this._setPhotoview(event);
	},
	
	_mousemoveHandler: function(event){
		this._setPhotoview(event);
	},

	_mouseoutHandler: function(event){
		this._hideExifInfo(event);
		this._hideCommentView(event);
	},

	_clickHandler: function(event) {
		var val = this._checkPosition(event);

		if(val == 'for') this.moveForward();
		else if (val == 'back') this.moveBackward();
	},

	_setPhotoview: function(event) {
		var val = this._checkPosition(event);

		if(val == 'back') this._highlightNavigationButtons(true,false);
		else if (val == 'for') this._highlightNavigationButtons(false,true);
	},

	_highlightNavigationButtons: function(isback, isfor) {
		if(isback)
			$(this.navigation.options.idOfBackward).className="backward_o";
		else
			$(this.navigation.options.idOfBackward).className="backward";

		if(isfor)
			$(this.navigation.options.idOfForward).className="forward_o";
		else
			$(this.navigation.options.idOfForward).className="forward";
	},

	_checkPosition: function(event) {
		var mouse_x = Event.pointerX(event);
		var mouse_y = Event.pointerY(event);

		var positon = Position.cumulativeOffset($(this.idOfNavigation));
		var nav_x = positon[0];
		var nav_y = positon[1];

		var size = $(this.idOfNavigation).getDimensions();
		var nav_w = size.width;
		var nav_h = size.height;

		if( (nav_x + nav_w) >= mouse_x && nav_x < mouse_x && mouse_y <= (nav_y + nav_h)  && mouse_y > nav_y) {
			this._highlightNavigationButtons(false,false);
			return false;
		}

		var image_x = Position.cumulativeOffset(this.photoDiv)[0];
		var basis_x = image_x + this.photoDiv.getWidth()/2;

		if(mouse_x <= basis_x)
		{
			return "back";
		}
		else
		{
			return "for";
		};
	},

	_checkArgument: function(value, defaultValue){
		if(typeof value == "undefined"){
			return defaultValue;
		}else{
			return value;
		}
	},

	moveForward: function(){
		this.movePhoto(this.photoIndex +1);
		this._applySlideList(this.photoIndex);
	},

	moveBackward: function(){
		this.movePhoto(this.photoIndex -1);
		this._applySlideList(this.photoIndex);
	},

	slideExcute: function(onplay){
		if(onplay) {
			var top = Position.cumulativeOffset(this.photoDiv)[1]-30;
			var oeTags = "<div style='border: 5px solid gray;display: inline-block;width: 812px;height: 612px;background-repeat: no-repeat;background-size: contain;background-origin: content-box;background-position: center; transition:background-image 1s;background-color:black;display: inline-flex;align-items: center;justify-content:center;padding: 10px;'>"
				+ "<img class='slide-image' id='photolog-slide-image' style='height: auto;max-height: 100%;max-width: 100%;transition:opacity 0.5s;display: flex;justify-content:center;align-items:center;' src='"+this.photoAlbum.getSource(0)+"'>"
				+ "</div>"
				+ "<div style='width: 100%;height:100px;text-align: center;'>"
				+ "<span style='border: 1px solid white;display: inline-block;padding: 5px;margin: 10px 0px;border-radius: 5px;background: rgba(0,0,0,0.5);'>"
				+ "<span id='slider-counter' style='padding: 0px 20px;font-size: 1.2rem;font-weight: bold;vertical-align: middle;'>1/11</span>"
				+ "<button id='slider-prev-btn' style='background: none;border: 0px;'><img src='http://md.egloos.com/img/pht/photoslideM_before_o.png'></button><button id='slider-control-btn' style='background: none;border: 0px;' data-status='play' ><img class='slider-stop-img' src='http://md.egloos.com/img/pht/photoslideM_stop_o.png'><img class='slider-play-img' style='display: none' src='http://md.egloos.com/img/pht/photoslideM_play_o.png'></button><button id='slider-next-btn' style='background: none;border: 0px;'><img src='http://md.egloos.com/img/pht/photoslideM_next_o.png'></button>"
				+ "</span>"
				+ "</div>";
			$("slidelayer").setStyle({"padding-top": top + "px"});
			$("slidelayer").show();
			$("slideflash").innerHTML = oeTags;

			currentSlide = 0;
			maxSlideNum = this.photoAlbum.getLength();
			this.slideInterval = setInterval(this.slideHandler,4000);

			document.getElementById('photolog-slide-image').addEventListener("transitionend", function(event){
				if(event.target.style.opacity == "0"){
					event.target.style.opacity = 1
					event.target.src = photoAlbum.getSource(currentSlide);
					document.getElementById('slider-counter').innerText = (currentSlide+1)+"/"+maxSlideNum;
				}
			}, true);
			document.getElementById('slider-prev-btn').addEventListener('click',this.slidePrev);
			document.getElementById('slider-next-btn').addEventListener('click',this.slideNext);
			document.getElementById('slider-control-btn').addEventListener('click',function(){
				if(this.dataset.status == "play"){
					this.dataset.status = "stop";
					this.getElementsByClassName('slider-stop-img')[0].style.display = "none";
					this.getElementsByClassName('slider-play-img')[0].style.display = "inline";
					parent.photolog.sliderPause();
				}else if(this.dataset.status =="stop"){
					this.dataset.status = "play";
					this.getElementsByClassName('slider-stop-img')[0].style.display = "inline";
					this.getElementsByClassName('slider-play-img')[0].style.display = "none";
					parent.photolog.sliderResume();
				}
			});
		}
		else {
			clearInterval(this.slideInterval);
			$("slidelayer").hide();
			$("slideflash").innerHTML = '';
		}
	},
	slideNext: function(){
		parent.photolog.slideHandler();
		document.getElementById('slider-counter').innerText = (currentSlide+1)+"/"+maxSlideNum;
	},
	slidePrev: function(){
		if(--currentSlide != -1) currentSlide--;
		parent.photolog.slideHandler();
		document.getElementById('slider-counter').innerText = (currentSlide+1)+"/"+maxSlideNum;
	},
	sliderPause: function(){
		clearInterval(this.slideInterval);
	},
	sliderResume:function(){
		parent.photolog.slideHandler();
		this.slideInterval = setInterval(this.slideHandler,4000);
	},
	slideHandler: function(){
		currentSlide++;
		if(maxSlideNum == currentSlide) currentSlide = 0;
		document.getElementById('photolog-slide-image').style.opacity = 0;
	},
	movePhotoBySerial: function(serial){
		this.movePhoto(this.photoAlbum.getIndexFromSerial(serial));
		this._applySlideList(this.photoIndex);
	},

	movePhoto: function(index){
		if(index >= 0 && index < this.photoAlbum.getLength()){
			this.photoIndex = index;
			this.photoSerial = this.photoAlbum.getSerialFromIndex(this.photoIndex);
			
			this.overlapper.moveNext(this.photoIndex);
			this._applyNavigation(this.photoIndex);
			this._changeSlideButton();
			this._changeExifInfo();
			this._changeTagInfo();
			this._changeCommentView();

			// TODO Legacy code must remove
			if(this.photoAlbum.getLength() >= 2){
				this._applyLegacyCode(this.photoIndex);
			}
			

		}else if(index >= this.photoAlbum.getLength()){
			//handle next album
			this.handleBoundary();
		}else if(index < 0){
			//handle before album
//			this.handleBoundary();
		}
	},

	_applyNavigation: function(index) {
		this.navigation.setSlideInfo("<strong>" + (index+1) + "</strong> / " + this.photoAlbum.getLength());
	},

	_applySlideList: function(index) {
		if(this.slideList)
		{
			this.slideList.scrollTo(index);
			this._changeSlideButton();
		}
	},

	_changeSlideButton: function() {
		var chk = this.slideList.checkMore();

		if(chk.prev) $(this.slideList.options.idOfBtnPrev).className = 'prev';
		else $(this.slideList.options.idOfBtnPrev).className = 'prev_x';

		if(chk.next) $(this.slideList.options.idOfBtnNext).className = 'next';
		else $(this.slideList.options.idOfBtnNext).className = 'next_x';
	},

	_modifyTimeStr: function(str){
		if(str.indexOf(":") != -1){
			var timeStr = str.split(":");
			return timeStr[0] + "." + timeStr[1] + "." + timeStr[2] + ":" + timeStr[3] + ":" + timeStr[4]
		}
		return str;
	},

	handleBoundary: function(){
		var response = confirm(PHOTOLOG_STR_MOVENEXTALBUM);
		if (response) {
			location.href = "/photo/" + this.photoAlbum.getNextAlbumSerial();
		} else {
			if(this.navigation.checkSlideShow())
				this.navigation.stopSlide();
		}
	},

	_showExifInfo: function(event) {
		if(this.isSeeingExif)	{
			if ($(this.options.idOfExifInfo).innerHTML != '')
				$(this.options.idOfExifInfo).show();
		}
	},

	_hideExifInfo: function(event) {
		if(this.isSeeingExif)	$(this.options.idOfExifInfo).hide();
	},

	_changeExifInfo: function() {
		var exif = this.photoAlbum.getExif(this.photoIndex);
		$(this.options.idOfExifInfo).innerHTML = exif;
		if (exif == '') {
			this._hideExifInfo();
		}
		
	},
	
	resetCommentView: function(json) {
		this.photoAlbum.resetPhotoComment(json);
		this.comments.reset();
		this._changeCommentView();
	}, 

	_showCommentView: function(event) {
		this.comments.show();
	},

	_hideCommentView: function(event) {
		this.comments.hide();
	},
	
	_changeCommentView: function() {
		var commentJSON = this.photoAlbum.getComment(this.photoSerial);
		this.comments.change(commentJSON, this.photoSerial);
	},
	
	_changeTagInfo: function() {
		var tag = this.photoAlbum.getPhotoTags(this.photoIndex);
		var exif = this.photoAlbum.getExif(this.photoIndex);
		var originalPhoto = this.photoAlbum.getOriginalPhoto(this.photoIndex);
		
		var html = new Array();
		html.push('<p id="tag" class="tag">');		
		if( tag != '' ) {
			var tags = tag.split(',');				    
		    for( i = 0; i < tags.length; i++ ) {
		        if( tags[i] != '' ) {   
		            html.push('<a href="/photo/tag/' + encodeURI(tags[i]) + '" title="">' + tags[i]  + '</a> ');
		        }
		    }
		}
		html.push('</p>');
		html.push('<div class="action">');
		if( this.isOwner ) {
			html.push('<span id="tagedit"><a href="javascript:void(0);" onclick="AlbumInfo.tagEditbox();" title="태그 추가하기"><img src="http://md.egloos.com/skn/pht/a/01/00/bt_tag.gif" alt="태그 추가하기" /></a></span>');
		}
		html.push('<span id="permalink"> <a href="#" onclick="AlbumInfo.Permalink(); return false;" title="이 사진의 퍼머링크"><img src="http://md.egloos.com/skn/pht/a/01/00/bt_permanent.gif" alt="이 사진의 퍼머링크" /></a></span>');
		html.push('<span id="bigsize">');
		if( originalPhoto != '' ) {
		    html.push(' <a href="#" onclick="AlbumInfo.orgPhotoView(); return false;" title="원본사이즈 사진 보기"><img src="http://md.egloos.com/skn/pht/a/01/00/bt_bigsize_type1.gif" alt="원본사이즈 사진보기" /></a>');
		}
		html.push('</span>');
		html.push('<span id="exif">');
		if( exif != '' && this.isSeeingExif ) {
		    html.push(' <a href="#" onclick="showmenu(\'exifview\'); return false;" onmouseover="areaover=true;" onmouseout="areaover=false;" title="EXIF 정보 보기" ><img src="http://md.egloos.com/skn/pht/a/01/00/bt_exif_type1.gif" alt="EXIF 정보 보기" /></a>');
		}
		html.push('</span></span>');
		html.push('</div>');
		$(this.idOfTagBar).innerHTML = html.join('');
	},

// TODO Legacy code must remove
	_applyLegacyCode: function(photoIndex){
		var oldSerial = AlbumInfo.imageserial;
		AlbumInfo.index = this.photoIndex;
		AlbumInfo.imageserial = this.photoSerial;
		AlbumInfo.imageserial = this.photoAlbum.getSerialFromIndex(this.photoIndex);
		AlbumInfo.nextimageserial = this.photoAlbum.getSerialFromIndex(this.photoIndex + 1);
		AlbumInfo.beforeimageserial = this.photoAlbum.getSerialFromIndex(this.photoIndex - 1);
		
		this.photoAlbum.getExif(this.photoIndex);
		this.photoAlbum.getPhotoTags(this.photoIndex);

		this._changeThumb(oldSerial);

	},

	_changeThumb: function(oldImageSerial) {
		var oldIndex = this.photoAlbum.getIndexFromSerial(oldImageSerial);
		var newSerial = this.photoAlbum.getSerialFromIndex(this.photoIndex);

		$("photo" + oldImageSerial).getElementsByTagName("a")[0].className = '';
		$("photo" + newSerial).getElementsByTagName("a")[0].className = 'current';
	},

	appendThumb: function(start,listcnt) {
		var html = '';
		var i = 0;

		for(var index=start; index < start+listcnt; index++) {
			var photo = this.photoAlbum.getPhotoFromIndex(index);

			if(!photo)	break;
			 html += "<li><span id=\"photo" + photo.serial + "\"><a href=\"#\" onclick=\"photolog.movePhotoBySerial('" + photo.serial + "\'); return false;\" onfocus=\"blur();\"><img src=\"http://thumbnail.egloos.net/70x70/http://" + photo.pdssvr + ".egloos.com/" + photo.path + photo.thumb + "\" alt=\"\" onerror=\"this.src='http://md.egloos.com/thumbnail.gif'\" id=\"thumb_" + photo.serial + "\" /></a></span></li>";
			 i += 1;
		}
		this.slideList.appendHTML(html,i);

		if(this.photoAlbum.photos.photoserial.length < index || i < listcnt) return false;
		else return true;
	}
}
