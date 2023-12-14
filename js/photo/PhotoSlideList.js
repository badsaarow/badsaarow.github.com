/*
 * 포토로그의 썸네일 리스트를 조작하고 보여줍니다.
 */
var PhotoSlideList = Class.create();

PhotoSlideList.prototype = {

	initialize: function(idOfContainer, options) {

	  	this.container = $(idOfContainer);
	  	this.slideList = this.container.getElementsByTagName("ul")[0];

		this.currentPage = 0;
	    this.currentIndex = -1;

	    this.noMorePhoto = false;
	    this.inRequest = false;
	    this.inScroll = false;

		this.elementWidth = this._getElementWidth();

	    this.options = Object.extend({
			listCount: this._getListCount(),
	    	visibleCount:      this._getScrollCount(),
	    	scrollCount:       this._getScrollCount(),
	    	ajaxParameters: null,
	    	url: null,

	    	fncPrevScroll: null,
	    	fncNextScroll: null,
	    	fncAjax: null,
	    	fncAppendThumb: null,

	    	idOfBtnPrev:       "slidelist_prev",
	    	idOfBtnNext:       "slidelist_next"
			}, options || {});

		this.prevScroll = this._prevScroll.bindAsEventListener(this);
		this.nextScroll = this._nextScroll.bindAsEventListener(this);

	},

	appendHTML: function(html, cnt) {
		//span을 html element를 만들 수 없을까...
		var span = document.createElement('span');
		span.innerHTML += html;
		this.slideList.appendChild(span);
		if(cnt > 0) this.options.listCount += cnt;
	},

	checkMore: function() {
		var half = parseInt((this.options.scrollCount/2)+0.49);
		var prev = true;
		var next = true;
		if(this.currentIndex == -1 || this.currentIndex <= half) {
			prev = false;
		};
		if(this.currentIndex > this.options.listCount - half && this.noMorePhoto) {
			next = false;

		};
		if(this.options.listCount <= this.options.scrollCount) {
			this.noMorePhoto = true;
			next = false;
		};

		Event.stopObserving(this.options.idOfBtnPrev,"click",this.prevScroll);
		Event.stopObserving(this.options.idOfBtnNext,"click",this.nextScroll);

		if (prev) Event.observe(this.options.idOfBtnPrev,"click",this.prevScroll);
		if (next) Event.observe(this.options.idOfBtnNext,"click",this.nextScroll);

		return {"prev": prev,"next": next};
	},

	_appendThumb: function(start, listcnt) {
		if(this.options.fncAppendThumb) {
			var isnext = this.options.fncAppendThumb(start, listcnt);
			if(!isnext) this.noMorePhoto = true;
		} else {
			this.noMorePhoto = true;
		}
	},

	scrollTo: function(index){
		if(this.inScroll) {
			return 0;
		}

		var half = parseInt((this.options.scrollCount/2)+0.49);

		if(index >= this.options.listCount-half && this.noMorePhoto == false) {
			if(this.url) {
				this._request(index); return;
			}
			else {
				this._appendThumb(this.options.listCount, index + this.options.scrollCount);
			}
		}

		if(this.noMorePhoto) index = this._getValidIndex(index);

		if(this.currentIndex == -1 && index >= half) {
			depth = index - half;
//		} else if(this.currentIndex == -1 && index >= half) {
//			depth = 0;
		} else if(this.currentIndex < half && index <= half) {
			depth = 0;
		} else if(this.currentIndex < half && index > half) {
			depth = (index - (this.currentIndex + (half - this.currentIndex)));
		} else if (index < half) {
			depth = (index - this.currentIndex) + (half - index);
		} else {
			depth = (index - this.currentIndex);
		}

		this.currentIndex = this._getValidIndex(index);

		this._scroll(depth);

		return depth;
	},

	_scroll: function(depth) {
		new Effect.MoveBy(this.slideList,  0, -(depth * this.elementWidth),
			{
				duration: 0.5,
//				transition: Effect.Transitions.slowstop,
				afterFinish: this._scrollEnd.bind(this),
				beforeStart: this._scrollStart.bind(this)
			});
	},

	_scrollEnd: function() {
		this.inScroll = false;

	},

	_scrollStart: function() {
		this.inScroll = true;
	},

	_nextScroll: function() {
		if(this.currentIndex == -1) this.currentIndex = 0;
		var index = this.currentIndex + this.options.scrollCount;

		var depth = this.scrollTo(index);
		if(depth != 0)	this.options.fncNextScroll(this.currentIndex);
	},

	_prevScroll: function() {
		if(this.currentIndex == -1) this.currentIndex = 0;
		var index = this.currentIndex - this.options.scrollCount;
		index = this._getValidIndex(index);

		var depth = this.scrollTo(index);
		if(depth != 0)	this.options.fncPrevScroll(this.currentIndex);
	},

	_request: function(index) {
		if(this.inRequest) return;
		if (!this.options.url) return;

		this.inRequest = true;

		var params = "start=" + this.options.listCount + "&index=" + index + "&listcnt=" + this.options.scrollCount;
		if (this.options.ajaxParameters != null)
			params += "&" + this.options.ajaxParameters

  		new Ajax.Request(this.options.url, {
  						parameters: params,
  						onComplete: this._onComplete.bindAsEventListener(this),
			  			onFailure: this._onFailure.bindAsEventListener(this)});
	},

	_onComplete: function(originalRequest) {
		this.inRequest = false;
    	eval('var obj = ' + originalRequest.responseText +';');
		if(obj.info.count <= this.options.scrollCount) this.noMorePhoto = true;

		this.options.fncAjax(obj.param);
		this.scrollTo(obj.info.index);
	},

	_onFailure: function() {
		this.inRequest = false;
	},

	_getValidIndex: function(index) {

		if(index == null) index = this.currentIndex;
		if(index >= this.options.listCount) {
			index = this.options.listCount-1;
		}
		else if(index < 0) {
			index = 0;
		}

		return index;
	},

	_getScrollCount: function() {

		var count = parseFloat(this.container.getWidth()) / parseFloat(this.elementWidth);

		return parseInt(count);

	},

	_getElementWidth: function() {

		var li = $(this.slideList.getElementsByTagName("li")[0]);
		var size = li.getWidth();
		if(li.getStyle("margin-left")) size += parseFloat(li.getStyle("margin-left").replace("px",""));
		if(li.getStyle("margin-right")) size += parseFloat(li.getStyle("margin-right").replace("px",""));

		return size;

	},

	_getListCount: function() {
		return this.slideList.getElementsByTagName("li").length;
	}
}