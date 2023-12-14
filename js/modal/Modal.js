/**
 * Copyright 2007 SK Communications. All rights reserved
 * @since 07.09.16
 * @author okjungsoo
 * 
 * Modal dialog의 기본 동작들을 정의합니다. 
 */
var Modal = {
	_dialogs: $A(),		// Array has dialogs
	current: null,		// Currently opened dialog
	
	_getDialogByID: function(dialogID) {
		var __dialogs = Modal._dialogs;
		for(var i=0; i<__dialogs.length; i++) {
			if(__dialogs[i].dialogID == dialogID) {
				return __dialogs[i];
			}
		}
		return null;
	}, 
	
	addDialog: function(element) {
		Modal._dialogs.push(element);
		return true;
	},
	
	open: function(dialogID, event, _params) {
		Modal.close();
		var dialog = this._getDialogByID(dialogID);
		
		if(dialog) {
			if(_params) { 
				_params['event'] = event; 
			}
			
			dialog.open(_params);
			Modal.current = dialog;
//			Event.observe(document, 'keydown', Modal.onKeyDown);
		}
		return this.stopEvent(event);	
	},
	
	close: function(event) {
		if(Modal.current) {
//			Event.stopObserving(window, 'keyup', Modal.onKeyDown);
			Modal.current.close();
			Modal.current = false;	
		}
		return this.stopEvent(event);
	},
	
	toggle: function(dialogID, event) {
		var dialog = this._getDialogByID(dialogID);
		if(dialog && dialog.visible) {
			if(dialog.visible()) {
				return Modal.close(event);
			} else {
				return Modal.open(dialogID, event);
			}			
		}
		return false;
	},
/*	
	onKeyDown: function(event){
		if(event.keyCode == Event.KEY_ESC) {
			Modal.close();
		}
	},	
*/	
	stopEvent: function(event){
		if(event) {
			Event.stop(event);
		}
		return false;
	}
}
