/**
 * PhotoNavigation class
 * 포토로그의 메인 이미지위에 떠 있는 네이게이션을 조작합니다.
 */
var PhotoNavigation = Class.create();
PhotoNavigation.prototype = {

	/*
	 * element: 네비게이션 Object의 부모 Element
	 * option: 위치, 스타일, 슬라이드 간격
	 * 연결된 함수
	 * 이전, 다음, 슬라이드 버튼
	 */
	initialize: function(element, idOfNavigation, options){
		this.options = Object.extend({
			zindex: 100,
			x: null,
			y: 10,

			fncMoveForward: null,
			fncMoveBackward: null,
			fncSlideExcute: null,

			idOfForward: 'btnForward',
			idOfBackward: 'btnBackward',
			idOfSlide: 'btnSlide',
			idOfSlideInfo: 'lblSlideInfo'

		}, options || {});

    	this.element = element;

    	this.navigation = $(idOfNavigation);

		Event.observe($(this.options.idOfForward),"click",this._moveForward.bindAsEventListener(this));
		Event.observe($(this.options.idOfBackward),"click",this._moveBackward.bindAsEventListener(this));
		Event.observe($(this.options.idOfSlide),"click",this._executeSlide.bindAsEventListener(this));

		Event.observe(this.element, "mouseover", this._showNavigation.bindAsEventListener(this));
		Event.observe(this.element, "mouseout", this._hideNavigation.bindAsEventListener(this));
		Event.observe(this.element, "mousemove", this._showNavigation.bindAsEventListener(this));

		this._hideNavigation();
	},

	/* 사용 안함 */
	_resetLocation: function() {
		if(!this.options.x) this.options.x = parseInt((this.element.getWidth()/2)-(this.navigation.getWidth()/2));
		if(!this.options.y) this.options.y = 0;

	    // set the right styles to position the tool tip
		this.navigation.setStyle({  zindex: this.options.zindex,
										top:this.options.y + "px",
		 								left:this.options.x + "px"
		 								});
	},

	_showNavigation: function(event) {
		this.navigation.show();
		if (this.navigation.visible()) { return false };
	},

	_hideNavigation: function(event) {
		this.navigation.hide();
	},

	//Slide가 추가되면 외부로 빠질메뉴
	_moveForward: function(event) {
		if(this.options.fncMoveForward)
			this.options.fncMoveForward();
		Event.stop(event);
	},

	_moveBackward: function(event) {
		if(this.options.fncMoveBackward)
			this.options.fncMoveBackward();
		Event.stop(event);
	},

	_executeSlide: function() {
		if (this.checkSlideShow()) {
			this.stopSlide();
		}
		else {
			this.playSlide();
		}
	},

	playSlide: function() {

        if(navigator.userAgent.indexOf('iPad') > 0) {
            alert('포토로그 슬라이드쇼가 지원되지 않는 환경입니다.');
        } else if(navigator.userAgent.indexOf('iPhone') > 0) {
            alert('포토로그 슬라이드쇼가 지원되지 않는 환경입니다.');
        } else {
    		this.options.fncSlideExcute(true);
        } 
	},

	stopSlide: function() {
		this.options.fncSlideExcute(false);
	},

	checkSlideShow: function() {
		if (this.slideExecuter == null) {
			return false;
		}
		else {
			return true;
		}
	},

	setSlideInfo: function(html) {
		$(this.options.idOfSlideInfo).innerHTML = html;
	}

}
