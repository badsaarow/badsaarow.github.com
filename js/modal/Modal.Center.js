/**
 * Copyright 2007 SK Communications. All rights reserved
 * @since 07.11.05
 * @author okjungsoo
 * 
 * Modal dialog를 center 위치에 띄워주는 메소드입니다. 
 * 
 * ※ This method is separated from Ryan Johnson's Control.Modal 
 *    (http://livepipe.net/projects/control_modal/)
 */
if(typeof(Modal) == 'undefined') {
	//alert("You need Modal.js !!");
} 
 
Object.extend(Modal, {
	center: function(element) {
		if(!element._absolutized){
			element.setStyle({
				position: 'absolute'
			}); 
			element._absolutized = true;
		}
		var dimensions = element.getDimensions();
		
		Position.prepare();
		var offset_left = (Position.deltaX + Math.floor((Modal.getWindowWidth() - dimensions.width) / 2));
		var offset_top = (Position.deltaY + Math.floor((Modal.getWindowHeight() - dimensions.height) / 2));
		
		element.setStyle({
			top: ((dimensions.height <= Modal.getWindowHeight()) ? ((offset_top != null && offset_top > 0) ? offset_top : '0') + 'px' : 0),
			left: ((dimensions.width <= Modal.getWindowWidth()) ? ((offset_left != null && offset_left > 0) ? offset_left : '0') + 'px' : 0)
		});
	},
	
	getWindowWidth: function(){
		return (self.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0) - Modal.getScrollBarWidth();
	},
	getWindowHeight: function(){
		return (self.innerHeight ||  document.documentElement.clientHeight || document.body.clientHeight || 0);
	},	
	
	getScrollBarWidth: function(){
		var scroller_div = document.createElement('div');
		Object.extend(scroller_div.style,{
			position: 'absolute',
			top:'-1000px',
			left: '-1000px',
			width: '100px',
			height: '50px',
			overflow: 'hidden'
		});
		var inner_div = document.createElement('div');
		inner_div.style.width = '100%';
		inner_div.style.height = '200px';
		
		scroller_div.appendChild(inner_div);
		document.body.appendChild(scroller_div);
		
		var withNoScroll = inner_div.offsetWidth;
		scroller_div.style.overflow = 'auto';
		
		var withScroll = inner_div.offsetWidth;
		document.body.removeChild(document.body.lastChild);
		return (withNoScroll - withScroll);
	}	
});
