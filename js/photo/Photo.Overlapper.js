/**
 * 
 */
if(typeof(Photo) == "undefined") {
	Photo = {};
}
/**
 * Album 내부의 이미지들을 특정 Effect 값으로 전환하며 보여주는 역할을 합니다.
 */
Photo.Overlapper = Class.create();
Photo.Overlapper.prototype = {
	EFFECT_FADE_IN_OUT: 1,
	EFFECT_BLIND_UP_DONW: 2,
	EFFECT_SHRINK_GROW: 3,
	EFFECT_PUFF_APPEAR: 4,

	DEFAULT_INDEX: 0,
	DEFAULT_DURATION: 0.5,

	/**
	 * @param photoAlbum PhotoAlbum 클래스를 인자로 받습니다.
	 * @param options
	 * 		effect - 1) fade in/out 2) blind up/down 3) shrink/grow 4)puff/appear effect를 줄 수 있습니다.
	 * 		phtoIndex - album의 특정 photo에서 시작하도록 설정합니다.
	 * 		duration - photo간의 전환 시간을 설정합니다.
	 * 		handleFrontBoundary - Album의 앞쪽 경계에 닿은 경우 이를 처리하기 위한 handler를 설정합니다.
	 * 		handleRearBoundary - Album의 뒤쪽 경계에 닿은 경우 이를 처리하기 위한 handler를 설정합니다.
	 * 		isImgProtect - imageProtect설정을 추가할지 여부를 설정합니다.
	 */
	initialize: function(parentDiv, photoAlbum, options){
		this.parentDiv = parentDiv;
		this.photoAlbum = photoAlbum;

		this.options = Object.extend({
			effectType: this.EFFECT_FADE_IN_OUT,
			duration: this.DEFAULT_DURATION, 
			startIndex: this.DEFAULT_INDEX, 
			handleFrontBoundary: null, 
			handleRearBoundary: null, 
			isImgProtect: false
		}, options||{});
		
		this.nextImage = null;
		this.synchronizedValue = false;

		this.create(this.parentDiv, this.options.startIndex, options["image_style"]);
	},
	
	/**
	 * 생성되는 html은 다음과 같습니다.
	 * <table>
	 * 		<tbody>
	 * 			<tr><td><img /></td></tr>
	 * 		</tbody>
	 * </table>
	 *
	 */
	create: function(parentDiv, currentIndex, image_id, image_style){

		this.imgElm = document.createElement("img");
		this.imgElm.src = this.photoAlbum.getSource(currentIndex);
		this.imgElm.photoIndex = currentIndex;

		if(image_style){
			this.imgElm.className = image_style;
		}
		
		if(this.options.isImgProtect){
			this.addProtection(this.imgElm);
		}
		
		var table = document.createElement("table");
		var tableTBODY = document.createElement("tbody");
		var tableTR = document.createElement("tr");
		var tableTD = document.createElement("td");
		table.className = "photo_area";
		table.cellSpacing = "0";
		tableTD.align = 'center';
		tableTD.valign = 'middle';
		tableTD.appendChild(this.imgElm);
		tableTR.appendChild(tableTD);
		tableTBODY.appendChild(tableTR);
		table.appendChild(tableTBODY);
		
		parentDiv.appendChild(table);

		// image의 width/height를 설정해주지 않으면 size가 이전 image의 size를 따라가는
		// 버그가 있어서 이를 수정하기 위해서 image의 size를 설정하는 코드를 추가
		this.setSize(this.imgElm, this.photoAlbum.getWidth(currentIndex),
			this.photoAlbum.getHeight(currentIndex));
	},

	getElement: function(){
		return this.frameElm;
	},

	moveNext: function(newIndex) {
		if(newIndex >= 0 && newIndex < this.photoAlbum.getLength() &&
				this.synchronizedValue == false){
			this.disapper(newIndex);
			this.synchronizedValue = true;
		}else if(newIndex < 0 && this.options.handleFrontBoundary != null){
			this.options.handleFrontBoundary();
		}else if(newIndex >= this.photoAlbum.getLength() && this.options.handleRearBoundary != null){
			this.options.handleRearBoundary();
		}
	},

	disapper: function(newIndex){
		this.newIndex = newIndex;
		var options = {duration:this.options.duration, afterFinish:this.appear.bindAsEventListener(this)};

		var newImg = this.imgElm.cloneNode(true);
		newImg.src = this.photoAlbum.getSource(newIndex);
		newImg.photoIndex = newIndex;

		if(this.options.isImgProtect){
			this.addProtection(newImg);
		}

		Element.hide(newImg);
		this.nextImage = newImg;

		switch(this.options.effectType){
			case this.EFFECT_FADE_IN_OUT:
				options['from'] = 1;
				options['to'] = 0.1;
				new Effect.Fade(this.imgElm, options);
				break;
			case this.EFFECT_BLIND_UP_DONW:
				new Effect.BlindUp(this.imgElm, options);
				break;
			case this.EFFECT_SHRINK_GROW:
				new Effect.Shrink(this.imgElm, options);
				break;
			case this.EFFECT_PUFF_APPEAR:
				new Effect.Puff(this.imgElm, options);
				break;
			default:
				Element.hide(this.imgElm);
				this.appear();
				break;
		}
        //$('ndrarea').innerHTML = '<img width="0" height="0" border="0" src="http://stategloos.egloos.com/stat/stat.tiff?cp_url=[egloo_ndr.egloos.com/photo/]"/>';
	},

	appear: function(){
		this.imgElm.parentNode.appendChild(this.nextImage);
		this.setSize(this.nextImage, this.photoAlbum.getWidth(this.nextImage.photoIndex),
			this.photoAlbum.getHeight(this.nextImage.photoIndex));
		Element.hide(this.imgElm);
		var options = {duration:this.options.duration, afterFinish:this._afterFinish.bindAsEventListener(this)};

		switch(this.options.effectType){
			case this.EFFECT_FADE_IN_OUT:
				new Effect.Appear(this.nextImage, options);
				break;
			case this.EFFECT_BLIND_UP_DONW:
				new Effect.BlindDown(this.nextImage, options);
				break;
			case this.EFFECT_SHRINK_GROW:
				new Effect.Grow(this.nextImage, options);
				break;
			case this.EFFECT_PUFF_APPEAR:
				new Effect.Appear(this.nextImage, options);
				break;
			default:
				Element.show(this.nextImage);
				this._afterFinish();
				break;
		}
	},

	_afterFinish: function(){
		var parentElm = this.imgElm.parentNode;
		parentElm.removeChild(this.imgElm);

		this.imgElm = this.nextImage;
		this.synchronizedValue = false;
	},

	setSize: function(elm, width, height){
		elm.style.width = width + "px";
		elm.style.height = height + "px";
		
		this.parentDiv.style.width = "800px";
		if(height < 300)
			this.parentDiv.style.height = "300px";
		else
			this.parentDiv.style.height = height +"px";
	},

	/**
	 * 사진 컨텐츠 보호 옵션을 추가해줍니다.
	 */
	addProtection: function(elm){
		elm.oncontextmenu = function(){ return false;};
		elm.onselectstart = function(){ return false;};
		elm.ondragstart = function(){ return false;};
	}
}
