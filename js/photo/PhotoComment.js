/**
 * Copyright 2008 SK Communications. All rights reserved
 * @author skymind
 *
 * PhotoAlbumComment class
 * 포토로그의 메인 이미지위에 떠 있는 덧글을 조작합니다.
 */
var PhotoCommentDisplay = Class.create();
PhotoCommentDisplay.prototype = {

	/*
	 * element: 덧글 영역 Element
	 * options: -
	 */
	initialize: function(element, idOfCommentView, options){
		this.options = Object.extend({
			classOfWrap: "cmt_wrap",
			classOfTail: "cmt_tail",
			classOfBody: "cmt_body",
			prefixOfReply: "re_"
		}, options || {});

    	this.element = element;
    	this.photoSerial = null;
    	this.view = $(idOfCommentView);

		Event.observe(this.view, "mouseover", this.show.bindAsEventListener(this));
		Event.observe(this.view, "mousemove", this.show.bindAsEventListener(this));


    	this.template = {
    		comment: '<div class="photocmt_wrap">' +
						'<p class="photocmt_tail"><$tail></p>' +
						'<p class="photocmt_body"><$body></p>' +
					'</div>',
    		reply: '<div class="re_photocmt_wrap">' +
						'<p class="re_photocmt_tail"><$tail></p>' +
						'<p class="re_photocmt_body"><$body></p>' +
					'</div>'
    	};
	},

	_isReply: function(commentSerial) {
		if(commentSerial.indexOf('.') >= 0) return true;
		return false;
	},

	_getBody: function(elementID, prefix) {
        if($(elementID)) {
    		var commentBody = $(elementID).getElementsByClassName(prefix+this.options.classOfBody)[0];
	    	return commentBody.innerHTML;
        } else {
            return '';
        }
	},

	/* 덧글 HTML이 수정되면, 변경되야 함! */
	_getTail: function(elementID, prefix) {
        html = '';
        if( $(elementID) ) {
		    var commentTail = $(elementID).getElementsByClassName(prefix+this.options.classOfTail)[0];
    		var html = commentTail.innerHTML;
	    	html = html.replace(/([0-9]{2}:[0-9]{2}).*/gi,'$1');
        }
		return html;
	},

	reset: function() {
		this.photoSerial = null;
		this.view.innerHTML = '';
	},

	show: function() {
		if (!this.view.visible() && this.view.innerHTML != '') { this.view.show(); }
	},

	hide: function() {
		this.view.hide();
	},

	_getCommentBox: function(commentSerial, isReply) {
		if(isReply) {
			tHtml = this.template.reply;
  			tHtml = tHtml.replace('<$tail>', this._getTail(commentSerial, this.options.prefixOfReply));
  			tHtml = tHtml.replace('<$body>', this._getBody(commentSerial, this.options.prefixOfReply));
		} else {
			tHtml = this.template.comment;
  			tHtml = tHtml.replace('<$tail>', this._getTail(commentSerial, ''));
  			tHtml = tHtml.replace('<$body>', this._getBody(commentSerial, ''));
		}
		return tHtml;
	},

	change: function(commentJSON, photoSerial) {
		if (this.photoSerial == photoSerial) {
			return false;
		}

		var html = [];
		for (var commentSerial in commentJSON) {
			tempReply = commentJSON[commentSerial];
			html.push(this._getCommentBox(commentSerial, false));

			for(i=0; i < tempReply.length; i++) {
				html.push(this._getCommentBox(tempReply[i], true));
			}
		}
		this.photoSerial = photoSerial;

		html = html.join('');
		if(html == '') {
			this.view.innerHTML = html;
			this.hide();
		} else {
			this.view.innerHTML = html;
		}
		return true;
	}

}

var PhotoCommentExec = Class.create();
PhotoCommentExec.prototype = {
	FORMID: 'commentForm',
	REPLY_FORMID: 'replyForm',

	initialize: function(isLoginUser){
		this.form = $(this.FORMID);
		this.replyForm = $(this.REPLY_FORMID);
		this.isRunComment = false;
		this.beforeReplyID = null;

		this.isLoginUser = isLoginUser;
		if(!this.isLoginUser && this.replyForm) {
			this.userName = this.replyForm.name.value;
			this.homePage = this.replyForm.homepage.value;
		} else {
			this.userName = '';
			this.homePage = 'http://';
		}
	},

	_setReplyForm: function (commentSerial){
		this.replyForm.cmtsrl.value = commentSerial;
		if(!this.isLoginUser)
		{
			this.replyForm.name.value = $('re_name').value;
			this.replyForm.passwd.value = $('re_passwd').value;
			this.replyForm.homepage.value = $('re_homepage').value;
		}
		this.replyForm.security.checked = false;
		this.replyForm.comment.value = $('re_comment').value;
	},

	replyComment: function (photoSerial,commentSerial){
	    var ReplyID = "reply" + photoSerial + '_' + commentSerial;
		if (this.beforeReplyID == ReplyID && $(this.beforeReplyID).visible())
		{
	        $(this.beforeReplyID).hide();
	        this.beforeReplyID = null;
	        return;
	    } else if (this.beforeReplyID) {
	        if($(this.beforeReplyID)) {
                $(this.beforeReplyID).innerHTML = '';
	            $(this.beforeReplyID).hide();
            }
	    }
	    this.beforeReplyID = ReplyID;
	  var isChromeBrowser = navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf("Edge") < 0;
		var html = '';
		if( this.isLoginUser == false)
		{
			html += '<p class="re_cmt_name"><label for="re_name">이름</label> : <input type="text" id="re_name"  name="re_name" size="10" maxlength="10" value="' + this.userName + '" /></p><p class="re_cmt_passwd"><label for="re_passwd">비밀번호</label> : ';
			if (isChromeBrowser) {
				html += '<input type="password" id="re_passwd" name="re_passwd" class="re_passwd" size="10" maxlength="10" value="" style="display:none" onblur="if (this.value.length > 0) {return;} else { togglePwdBox(this, \'re_passwd_alt\', false);}"/>';
				html += '<input type="text" id="re_passwd_alt" name="re_passwd_alt" class="re_passwd_alt" size="10" style="width:80px;height:12px" maxlength="10" value="" onfocus="togglePwdBox(this, \'re_passwd\', true)" onclick="togglePwdBox(this, \'re_passwd\', true)" readonly="readonly"/>';
			} else {
				html += '<input type="password" id="re_passwd" name="re_passwd" size="10" maxlength="10" value="" />';
			}
			html += '</p><p class="re_cmt_homepage"><label for="re_homepage">블로그</label> : <input type="text" id="re_homepage" name="re_homepage" value="' + this.homePage + '" size="20" /></p>';
		}
		html += 	'<p class="re_cmt_textarea"><textarea id="re_comment" name="re_comment" cols="60" rows="6"></textarea></p><p class="re_cmt_submit"><a href="#" onclick="AlbumInfo.runComment(' + photoSerial + ',' + commentSerial + ');return false;"><img src="http://md.egloos.com/img/pht/add_comment_re.gif" width="62" height="32" border="0" /></a>&nbsp;</p>';

		$(this.beforeReplyID).innerHTML = html;
	    $(this.beforeReplyID).show();
	},

	runComment: function (photoSerial, commentSerial){
		if(this.isRunComment) return false;

		if(commentSerial) {
			this.replyForm = $(this.REPLY_FORMID);
			var form = this.replyForm;
			this._setReplyForm(commentSerial);
		} else {
			this.form = $(this.FORMID);
			var form = this.form;
		}

		if(this.isLoginUser == false)
		{
			if( isNothing(form.name) ) return( false );
			if( !isValidBlob(form.name, 30) ) return( false );
			if( isNothing(form.passwd) ) return( false );
			if( !isValidBlob(form.homepage, 100) ) return( false );
			if( form.homepage.value != 0 && form.homepage.value.search(/http\:\/\//gi) < 0 ){
				alert("올바른 홈페이지 주소가 아닙니다. \r\n다시 입력해주세요.");
				form.homepage.focus();
				return( false );
			}
			if( form.homepage.value.search(/ /) > 0  ){
				alert("공백이 들어있습니다. 공백을 제거해 주세요.");
				form.homepage.focus();
				return( false );
			}
			if( form.homepage.value == "http://" )
				form.homepage.value = "";
		}

		var scrtstr = "";
		if(form.security.checked == true) scrtstr = "0";
		else  scrtstr = "1";

		if( isNothing(form.comment) ) return( false );
		if( !isValidBlob(form.comment, 20480) ) return( false );

		if (this.isLoginUser){
			var parameter = $H({
				eid		: form.eid.value,
				tid		: form.tid.value,
				srl		: form.srl.value,
				cmtsrl	: form.cmtsrl.value,
				phtsrl	: photoSerial,
				comment	: form.comment.value,
				security: scrtstr
			});
		}
		else {
			var parameter = $H({
				eid		: form.eid.value,
				tid		: form.tid.value,
				srl		: form.srl.value,
				cmtsrl	: form.cmtsrl.value,
				phtsrl	: photoSerial,
				name	: form.name.value,
				homepage : form.homepage.value,
				passwd	: form.passwd.value,
				comment	: form.comment.value,
				security: scrtstr
			});
		}

		var url = "/exec/photo/photo_comment_exec.php";

		new Ajax.Request(url, {
			method		: 'post',
			parameters	: parameter,
        	onSuccess: this._handelSuccess.bind(this),
        	onFailure: this._handelFailure.bind(this)
		});

		return( false );
	},

	_handelSuccess: function(transport) {
		try {
			var response = transport.responseXML;
			var contnode = response.getElementsByTagName("cont");
			if ( contnode.item(0).firstChild.nodeType == 4 )
				var cont = contnode.item(0).childNodes.item(0).data;
			else if ( contnode.item(0).firstChild.nodeType == 3 && contnode.item(0).childNodes.length == 1 )
				var cont = contnode.item(0).childNodes.item(0).data;
			else {
				var cont = contnode.item(0).childNodes.item(1).data;
			}
			eval(cont);
		} catch(e) {
			alert('덧글을 읽어오는데 실패했습니다.');
		}
	},

	_handelFailure: function() {
		alert('작업을 처리할 수 없습니다.')
	},

	deleteComment: function(eid, albumSerial, commentSerial, isAnonymous) {
		if(isAnonymous == false) {
			var msg = "정말 삭제하시겠습니까?";
			if(commentSerial.indexOf('.') == -1) {
				msg += '\r\n(덧글 삭제시 답글까지 삭제됩니다)';
			}
			var response = confirm( msg );
			if (response == true)
			{
				var parameter = $H({
					eid		: eid,
					srl		: albumSerial,
					cmtsrl	: commentSerial
				});

				var url = "/exec/photo/photo_comment_delete_exec.php";
				new Ajax.Request(url, {
					method		: 'post',
					parameters	: parameter,
		        	onSuccess: this._handelSuccess.bind(this),
		        	onFailure: this._handelFailure.bind(this)
				});
			}
		} else {
			ap_openwin("/exec/photo/photo_comment_anony.php?eid=" + eid + "&srl=" + albumSerial + "&cmtsrl=" + commentSerial, "delcomment", 400, 300, 3, false, false, false);
		}
	}
}
