/**
 * @author umkki
 * @since 2008.09.16
 * 이글루링크 팝업
 */

if (typeof(Modal) == "undefined") {
	 ;
}

Object.extend(Modal, {
	insertBookmark: function(eid, needCheck) {
        if (Modal.current && Modal.current.insertBookmark) {
            Modal.current.insertBookmark(eid, needCheck);
        }
	}
});

Modal.BookmarkDlg = Class.create();
Object.extend(Modal.BookmarkDlg.prototype, {
	overlay: false,
	initialize: function(_dialogID, _options) {
        this.dialogID = _dialogID;
        this.dialog = $(this.dialogID);
        this.options = _options||{overlay:false};

        this.groupURL = this.options.groupURL;
        this.remoteURL = this.options.remoteURL;
        
        if (this.options.overlay == true) {
	        this.overlay = $(document.createElement('div'));
	        this.overlay.id = "modal_overlay";
	        this.overlay.hide();
	        var body_tag = document.getElementsByTagName('body')[0];
	        body_tag.appendChild(this.overlay);
	        this.overlay.setStyle({
	            position: 'absolute',
	            top: 0,
	            left: 0,
	            zIndex: 9900,
	            opacity: 0.3,
	            "background-color": "#000000",
	            height: this.getDocumentHeight() + 'px',
	            width: (Modal.ie)? document.documentElement.clientWidth +'px': "100%"
	        });
        }
        
        this.selectElm = this.dialog.getElementsByTagName("SELECT")[0];
        this.urlElm = $('egloo-bookmark-url');
        this.nameElm = $('egloo-bookmark-name');
        this.isLoaded = Modal.addDialog(this);
	},
	
    getDocumentHeight: function(){
        var _sHeight = document.body.scrollHeight;
        var _oHeight = document.documentElement.offsetHeight;
        
        if(_sHeight > _oHeight) {
            return document.body.scrollHeight;
        }else {
            return document.documentElement.offsetHeight;
        }
    },

    open: function(_param) {
    	Modal.center(this.dialog);
    	
    	this.blogid = _param.blogid;
    	this.eid = _param.eid;
    	if(_param.egloourl.indexOf(".egloos.com") < 0)
        	this.egloourl = "http://"+_param.egloourl+".egloos.com";
    	else
        	this.egloourl = _param.egloourl;
    	this.eglooname = _param.eglooname;
    	
    	this.urlElm.innerHTML = this.egloourl;
    	this.nameElm.innerHTML = this.eglooname;

    	if (this.options.overlay == true) {
        	this.overlay.show();
    	}
        this.dialog.show();
        
        this.getGroupList();
	},
	
	close: function() {
		if (this.options.overlay == true) {
			this.overlay.hide();
		}
		this.dialog.hide();
	},
	
	getGroupList: function() {
		new Ajax.Request(this.groupURL, {
			parameters: {
				'eid'   : this.blogid
			},
			onSuccess: function(transport) {
                var text = transport.responseText;
                if (text.isJSON()) {
                    var result = text.evalJSON();
                    if (result.code == '1') {
                        this.selectElm.options[0] = new Option('그룹선택없음', '000');
                        for(var i=0; i<result.group.length; i++) {
                            var group = result.group[i];
                            this.selectElm.options[i+1] = new Option(group.groupName, group.groupID);
                        }
                        this.selectElm.options[0].selected = true;
                    }
                    else {
                        alert(result.message);
                    }
                }
                else {
                    alert("일시적인 오류입니다. 잠시 후 다시 이용해주세요.");
                    return false;
                }
				
			}.bind(this)
		});
	},
	
	goResultPage: function(isMy) {
		if (isMy) {
			window.location.href = "http://valley.egloos.com/my/content/adm/egloo.php";
		}
		else {
			window.location.href = "http://valley.egloos.com/my/index.php?mnopt=1&admin=1";
		}
	},
	
	getGroupID: function() {
		for(var i=0;i<this.selectElm.length;i++) {
			if (this.selectElm[i].selected == true) {
				return this.selectElm[i].value;
			}
		}
		return "000";
	},
	
	insertBookmark: function(needCheck) {
		var groupID = this.getGroupID();
		new Ajax.Request(this.remoteURL, {
			parameters: {
				act: 'insert',
                blogid: this.blogid,
                eid: this.eid,
				groupid: groupID
			},
			onSuccess: function(transport) {
		        var text = transport.responseText;
		        if (text.isJSON()) {
		            var result = text.evalJSON();
		            if (result.code != '1') {
		                if (result.message != '') {
		                    alert(result.message);
		                }
		                Modal.close();
		                return;
		            }
		        }
		        else {
		            alert('일시적인 장애입니다. 잠시 후 다시 이용해주세요.');
		            Modal.close();
		            return;
		        }
		        
                var isMy = (window.name == "my_main");
                if (needCheck == true) {
                    this.goResultPage(isMy);
                }
                Modal.close();
                return;
                
			}.bind(this)
		});
	}
});
