function InsBookmark_orig(uid, eid, blogurl, blogname, event) {
        var remoteURL = "/exec/egloo_insbookmark_exec.php";
        var paramURI = "uid="+uid+"&eid="+eid;
	    var IE50 = (IE && versionMinor <= 5.9);
		if (typeof(Modal) == "undefined" || IE50) {
	        self.frames.cmtviewfrm.location.href = remoteURL+"?"+paramURI;
	    }
	    else {
            Modal.open('egloo_bookmark', event, {
                'eid'           : eid,
            	'blogid'        : eid,
                'userid'        : userid,
            	'egloourl'      : blogurl, 
            	'eglooname'     : blogname
            });
	    }
}

function getGroupID() {
	var selectElm = document.getElementById('egloo-bookmark-group');
    if(selectElm) {
        for(var i=0;i<selectElm.length;i++) {
            if (selectElm[i].selected == true) {
                return selectElm[i].value;
            }
        }
        return "000";
    }
	return "000";
}

function InsBookmark(uid, eid, blogurl, blogname, event){

        var remoteURL = "/exec/egloo_insbookmark_exec.php";
        var paramURI = "uid="+uid+"&eid="+eid;
		
		
		if (typeof(Modal) == "undefined" || IE50) {
			self.frames.cmtviewfrm.location.href = remoteURL + "?" + paramURI;
		}
		else {
			var groupID = getGroupID();
			
			new Ajax.Request(remoteURL, {
				parameters: {
					act: 'insert',
	                blogid: eid,
	                eid: eid,
                    userid: uid,
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
			                return;
			            }
						if(confirm('성공적으로 추가되었습니다. 지금 \'마이\' 에서 바로 확인하시겠습니까?')) {
                            
                            location.href = 'http://valley.egloos.com/my/';
                        }
                        
			        }
			        else {
			            alert('일시적인 장애입니다. 잠시 후 다시 이용해주세요.');
			            
			            return;
			        }
			        
	                var isMy = (window.name == "my_main");
	                if (needCheck == true) {
	                    this.goResultPage(isMy);
	                }
	                return;
	                
				}.bind(this)
			});
		}

}

function InsBookmark_Mobile(uid, eid){

    var remoteURL = "/exec/egloo_insbookmark_exec.php";
    
    var groupid;
    var selectElm = parent.document.getElementById('egloo-bookmark-group');
    if(selectElm) {
        for(var i=0;i<selectElm.length;i++) {
            if (selectElm[i].selected == true) {
                groupid = selectElm[i].value;
                break;
            }else{
            	groupid = "000";
            }
        }        
    }else{
    	groupid = "000";
    }    
    
    new Ajax.Request(remoteURL, {
        parameters: {
            act: 'insert',
            blogid: eid,
            eid: eid,
            userid: uid,
            groupid: groupid
        },
        onSuccess: function(transport) {
            var text = transport.responseText;
            
            if (text.isJSON()) {
                var result = text.evalJSON();
                if (result.code != '1') {
                    if (result.message != '') {
                        alert(result.message);
                    }
                    return;
                }
                alert('성공적으로 추가되었습니다. \'마이리더\' 에서 확인 하실 수 있습니다.');
            } else {
                alert('일시적인 장애입니다. 잠시 후 다시 이용해주세요.');
                return;
            }
            return;
            
        }.bind(this)
    });
}

function InsClipPost(eid, url, serial, memo) {
    var remoteURL = "exec/egloo_insclippost_exec.php";
    var paramURI = "eid="+eid+"&url="+url+"&srl="+serial;
    var IE50 = (IE && versionMinor <= 5.9);
    if (IE50) {
        self.frames.cmtviewfrm.location.href = remoteURL+"?"+paramURI;
    }
    else {
        new Ajax.Request('/exec/egloo_insclippost_exec.php', {
            parameters: {
                eid: eid,
                url: url,
                srl: serial,
                memo: memo
            },
            onSuccess: function(transport) {
                var text = transport.responseText;
                if (text.isJSON()) {
                    var result = text.evalJSON();
                    if (result.code == '0') {
                        if (result.message != '') {
                            alert(result.message);
                        }
                        return;
                    }
                    else {
                    	if(confirm(result.message)) {
                    		window.location.href = "http://valley.egloos.com/my/index.php?mnopt=4";
                    		return;
                    	}
                    }
                }
                else {
                    alert('일시적인 장애입니다. 잠시 후 다시 이용해주세요.');
                    return;
                }
            }.bind(this)
        });
    }
}


function InsClipPost_Mobile(eid, url, serial, memoname) {
    var oMemo = $(memoname);
    
    if(!oMemo){
    	oMemo = parent.$(memoname);
    }
    
    if(oMemo) {
        var memo = oMemo.value.replace(/(^\s*)|(\s*$)/gi,"");
        if( memo.length > 200 ) {
            alert('메모를 200자 이내로 줄여 주세요.');
            return false;
        }
        if(memo == '' || memo == '메모를 짧게 입력해 주세요. (200자 이내)') {
        	if(memoname == 'egloo-check-post-memo'){
        		memo = '';
        	}else{
        		memo = '모바일 이글루스에서 메모 한 포스트';
        	}
        }

        var remoteURL = "exec/egloo_insclippost_exec.php";
        new Ajax.Request('/exec/egloo_insclippost_exec.php', {
            parameters: {
                eid: eid,
                url: url,
                srl: serial,
                memo: memo
            },
            onSuccess: function(transport) {
                var text = transport.responseText;
                if (text.isJSON()) {
                    var result = text.evalJSON();
                    if (result.code == '0') {
                        if (result.message != '') {
                            alert(result.message);
                        }
                        return;
                    }
                    else {
                        alert('성공적으로 추가되었습니다. \'마이리더\' 에서 확인 하실 수 있습니다.');
                        return;
                    }
                }
                else {
                    alert('일시적인 장애입니다. 잠시 후 다시 이용해주세요.');
                    return;
                }
            }.bind(this)
        });
    } else {
        alert('잠시후 다시 시도해주세요.');
        return;
    }
}

function InsAnnounceSet(){
	var exec = '/exec/egloo_announce_set.php';
	new Ajax.Request(exec, {
		onSuccess: function(transport){
			var text = transport.responseText;
            if (text.isJSON()) {
				var result = text.evalJSON();
				if (result.code == '0') {
                    if (result.message != '') {
                        alert(result.message);
                    }
                    return;
                }
                else {
            		window.location.href = "http://valley.egloos.com/my/?mnopt=announce";
            		return;
                }
            }
            else {
                alert('일시적인 장애입니다. 잠시 후 다시 이용해주세요.');
                return;
            }
		
		}
	});
}
