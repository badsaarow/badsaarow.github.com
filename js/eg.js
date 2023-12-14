<!-- Begin to hide script contents from old browsers.
var NL = "\r\n";

function UpdateCategory(eid){
	ap_openwin("http://www.egloos.com/adm/chgcategory_view.php?eid=" + eid, "chgcategory", 420, 195, 3, false, true, false);
}

function delPost(writer,eid,serial,rtnurl,subject){
	if (subject.length > 20)
		subject = subject.substring(0,18) + "..";
	var response = confirm( '\''+unescape(subject)+'\'' + "\n\n포스트를 삭제하시겠습니까?" );
	if (response == true)
		self.location.href = "http://upload.egloos.com/egloo/delete_exec.php?eid=" + eid + "&srl=" + serial + "&writer=" + writer + "&rtnurl=" + rtnurl;
	else
		return;
}

function delGDCookie(eid){
	self.frames.cmtviewfrm.location.href = "http://www.egloos.com/egloo/delgdcookie_exec.php";
}

function delInvite(eid, ieid, nick){
	if (confirm(nick + "님의 초대를 응하지 않으시겠습니까?"))
	{
		self.frames.cmtviewfrm.location.href = "http://www.egloos.com/egloo/delinvite_exec.php?eid=" + eid + "&ieid=" + ieid;
	}
	return false;
}

function imgview(imgsrc,imgwidth,imgheight,slt)
{
	ppscr = false;
	if( slt == "0" )
	{
		ap_openwin("http://www.egloos.com/egloo_logo.php?slt=" + slt + "&imgsrc=" + imgsrc, "imgpopup", imgwidth, imgheight, 1, true, false, false);
	}
	else
	{
		if ( imgwidth > 770 ){
			ppscr = true;
			imgwidth = 770;
		}
		if ( imgheight > 570 ){
			ppscr = true;
			imgheight = 570;
		}
		if ( ppscr == true )
			imgwidth = imgwidth + 18;
		ap_openwin("http://www.egloos.com/egloo_logo.php?slt=" + slt + "&imgsrc=" + imgsrc, "imgpopup", imgwidth, imgheight, 1, true, ppscr, false);
	}
}

function getfeedbackid(type,serial,ismain) {
    var id = '';
    switch(type) {
        case 'post_comment':
            id = 'comment_' + serial;
            break;
        case 'post_trackback':
            id = 'trackback_' + serial;
            break;
        case 'post_pingback':
            id = 'pingback_' + serial;
            break;
        case 'post_comment_skin1':
            id = 'cmt' + serial;
        default:
            break;
    }

    if(!$(id) || ismain) {
        id = 'post_link_' + serial;
    }
    return id;
}

function setfeedback(type,serial,html) {
    if( type == 'post_comment') {
        applyCommentCount(serial, -1);
        id = 'cmt'+ serial;
	    $(id).show();
    }

    /*
	var id = getfeedbackid(type,serial,false);
	$(id).show();
    document.getElementById(id).innerHTML = html;
    */
}

var exec_runcomment = false;
function runComment(form,bglevel,cmtserial,wtype){
	if(exec_runcomment) return false;

	var remoteURL = "";
    var cmtstr  = "";
    var scrtstr = "";

    if(wtype == 'post_comment_edit'){
    	if(cmtserial) {
    		setEditComment(form,bglevel,cmtserial);
        }
    	remoteURL = "/exec/egloo_editcomment_exec.php";
    }else{
    	if(cmtserial) {
            setReplyComment(form,bglevel,cmtserial);
        }
    	remoteURL = "/exec/egloo_comment_exec.php";
    }

	if( bglevel > 4 )
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
	if(form.security.checked == true) scrtstr = "0";
	else  scrtstr = "1";

	if( isNothing(form.comment) ) return( false );
	if( !isValidBlob(form.comment, 20480) ) return( false );

	if(wtype != 'post_comment_edit'){ // 덧/답글 작성시에만 카운트
    	var postserial = form.srl.value;
        applyCommentCount(postserial, +1);
    }

    var spooncmt = 0;
    if(form.spooncmt) {
       spooncmt = form.spooncmt.value;
    }

    // post_comment 로 통일
    if(wtype) wtype = 'post_comment';

	var IE50 = (IE && versionMinor <= 5.9); //나중에 빼야 됨
	if (IE50)
	{
		exec_runcomment = true;
		return( true );
	}
	else {
		var postdata = "";
		try{
		    var page = "&page="+form.page.value;
		}catch(e) {
		    var page = "";
		}

		try{
            var writer = "&writer="+form.writer.value;
        }catch(e) {
            var writer = "";
        }

		if (bglevel > 4){
			postdata = "eid=" + form.eid.value + "&tid=" + encodeURIComponent(form.tid.value) + "&srl=" + form.srl.value + "&cmtsrl=" + form.cmtsrl.value + "&xhtml=" + form.xhtml.value + "&name=" + encodeURIComponent(form.name.value) + "&homepage=" + form.homepage.value + "&passwd=" + encodeURIComponent(form.passwd.value) + "&comment=" + encodeURIComponent(form.comment.value) + "&security=" + scrtstr + "&adview=" + form.adview.value + "&subject=" + encodeURIComponent(form.subject.value) + "&ismenu=" + form.ismenu.value + page + "&spooncmt=" + spooncmt;
		}
		else {
			postdata = "eid=" + form.eid.value + "&tid=" + encodeURIComponent(form.tid.value) + "&srl=" + form.srl.value + "&cmtsrl=" + form.cmtsrl.value + writer + "&xhtml=" + form.xhtml.value + "&name=&comment=" + encodeURIComponent(form.comment.value) + "&security=" + scrtstr + "&adview=" + form.adview.value + "&subject=" + encodeURIComponent(form.subject.value) + "&ismenu=" + form.ismenu.value + page + "&spooncmt=" + spooncmt;
		}
		//var url = "/exec/egloo_comment_exec.php";

		exec_runcomment = true;
		XMLHttpConnectPost(remoteURL,postdata,"resXml");
		return( false );
	}
}


function delnotice(eid,ntcserial){
	var response = confirm( "공지사항을 삭제하시겠습니까?");
	if (response == true)
	{
		window.location.href = "http://www.egloos.com/adm/notice_exec.php?eid=" + eid + "&srl=" + ntcserial;
	}
	else
		return;
}

var beforeReplyID = null;
function replyComment(formName,postserial,cmtserial,bglevel,name,homepage,eid,rtnurl,cmtipflag,security_opt){
    ReplyID = "reply" + postserial + '_' + cmtserial;
	if (beforeReplyID == ReplyID && $(beforeReplyID).visible())
	{
        $(beforeReplyID).hide();
        beforeReplyID = null;
        return;
    } else if (beforeReplyID && $(beforeReplyID)) {
        $(beforeReplyID).innerHTML = '';
        $(beforeReplyID).hide();
    }
    beforeReplyID = ReplyID;

    if (beforeEditID && $(beforeEditID)) {
        $(beforeEditID).innerHTML = '';
        $(beforeEditID).hide();
        $(beforeCommentID).show();
    }
		var isChromeBrowser = navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") < 0;
    var html = '<div class="comment_write" id="'+ ReplyID +'" style="width:100%;">' +
        '<fieldset>'+
            '<legend>댓글입력영역</legend>'+
            '<div class="comment_info">';

    if( bglevel>4 ) {
        html +=
                '<span class="comment_name">' +
                    '<label for="cmt_name">닉네임</label>' +
                    '<input type="text" id="name_reply" name="name_reply" class="name" size="10" maxlength="10" value="'+ name +'" /> ' +
                '</span>\r\n' +
                '<span class="comment_passwd">' +
								'                   <label for="cmt_passwd">비밀번호</label>';
										if (isChromeBrowser) {
												html +=
								'                   <input type="password" id="passwd_reply" name="passwd_reply" class="passwd passwd_reply" size="10" maxlength="10" value="" style="display:none" onblur="if (this.value.length > 0) {return;} else { togglePwdBox(this, \'passwd_reply_alt\', false);}" />' +
								'                   <input type="text" id="passwd_reply" name="passwd_reply_alt" class="passwd passwd_reply_alt" size="10" maxlength="10" value="" onfocus="togglePwdBox(this,\'passwd_reply\', true)" onclick="togglePwdBox(this,\'passwd_reply\', true)" readonly="readonly"/>';
										} else {
												html +=
								'                   <input type="password" id="passwd_reply" name="passwd_reply" class="passwd" size="10" maxlength="10" value="" />';
										}
												html +=

                '</span>\r\n' +
                '<span class="comment_blog">' +
                    '<label for="cmt_blog">블로그</label>' +
                    '<input type="text" id="homepage_reply" name="homepage_reply" class="blog" value="'+ homepage +'" size="20" />' +
                '</span>\r\n' +
                '<span class="comment_login">' +
                    '<a href="https://sec.egloos.com/login.php?returnurl='+ rtnurl +'" title="로그인">로그인</a>' +
                '</span>';
    } else {
        if(eid) {
            var profimg = 'http://profile.egloos.net/'+ eid +'_50.jpg';
            var myinfo = '';
        } else {
            var profimg = 'http://md.egloos.com/img/eg/profile_anonymous.jpg';
            var myinfo = '<span class="nateinfo">(<a href="http://valley.egloos.com/my/?mnopt=myinfo" title="회원정보수정" class="nateinfo_edit">회원정보수정</a>)</span>';
        }
        html +=
                '<span class="comment_now">' +
                    '<img src="'+ profimg +'" alt="" />' +
                    '<a href="'+ homepage +'" title="'+ homepage +'" target="_blank">'+ name +'</a>' + myinfo +
                '</span>';
    }

    html +=
            '</div>' +
            '<textarea id="comment_reply" name="comment_reply" class="comment_field" title="댓글입력영역" rows="5" cols="50"></textarea>' +
            '<div class="comment_btn f_clear">';

    			if(security_opt == '1'){
    html +=
    '				<input type="checkbox" id="security_reply" name="security_reply" onclick="checkConfirm();"> <label for="security_reply">비공개</label>' ;
        		}else if(security_opt == '2'){
    html +=
    '				<input type="checkbox" id="security_reply" name="security_reply" checked onclick="checkConfirm();"> <label for="security_reply">비공개</label>' ;
        		}

            	if(bglevel>4 && cmtipflag == '1'){
    html +=
'				* 비로그인 덧글의 IP 전체보기를 설정한 이글루입니다.';
            	}
    html +=
                '<input class="comment_submit" type="image" src="http://md.egloos.com/img/eg/btn_reply.gif" value="댓글등록" onclick="runComment($(' + formName + '),' + bglevel + ',' + cmtserial + ');" />' +
            '</div>' +
        '</fieldset>' +
    '</div>';
	$(beforeReplyID).innerHTML = html;
    $(beforeReplyID).show();
}

function setReplyComment(form,bglevel,cmtserial) {
	form.cmtsrl.value = cmtserial;
	if( bglevel > 4 )
	{
		form.name.value = $('name_reply').value;
		form.passwd.value = $('passwd_reply').value;
		form.homepage.value = $('homepage_reply').value;
	}

	if($('security_reply')){
    	form.security.checked = $('security_reply').checked;
    }

	form.comment.value = $('comment_reply').value;
}

function setEditComment(form,bglevel,cmtserial) {
    form.cmtsrl.value = cmtserial;
    if( bglevel > 4 ) {
        form.name.value = $('name_edit').value;
        form.passwd.value = $('passwd_edit').value;
        form.homepage.value = $('homepage_edit').value;
    }

    form.writer.value = $('comment_writer').value;
    form.comment.value = $('comment_edit').value;
}

function checkConfirm(){
	if($('security_reply') && !$('security_reply').checked){

		var msg = "비공개 해제를 하시는 경우";
	    msg += '\r\n작성한 내용이 전체 공개됩니다.';
	    msg += '\r\n정말로 공개하시겠습니까?';

	    var response = confirm( msg );
	    if (response == false){
	    	$('security_reply').checked = true;
	    	return;
	    }
	}
}

function applyCommentCount(postserial, applyCount) {
	document.getElementById("cmtcnt" + postserial).innerHTML = parseInt(document.getElementById("cmtcnt" + postserial).innerHTML) + applyCount;
}

function delComment(eid,postserial,cmtserial,writer,adview,xhtml,isreply, ismenu){
	var msg = "정말 삭제하시겠습니까?";
	if(isreply == '0') {
		msg += '\r\n(덧글 삭제시 답글까지 삭제됩니다)';
	}
	var response = confirm( msg );
	if (response == true)
	{
        var remoteURL = "/exec/egloo_delcomment_exec.php";
        var ParamURI = "eid=" + eid + "&srl=" + postserial + "&xhtml=" + xhtml + "&cmtserial=" + cmtserial + "&writer=" + encodeURIComponent(writer) + "&adview=" + adview + "&ismenu=" + ismenu + "&skinver=1";
        var IE50 = (IE && versionMinor <= 5.9); //나중에 빼야 됨
        if (IE50)
        {
            self.frames.cmtviewfrm.location.href = remoteURL+"?"+ParamURI;
        }
        else {
            XMLHttpConnectPost(remoteURL,ParamURI,"resXml");
        }
	}
	else
		return;
}

function delComment_view(eid,postserial,cmtserial,adview,xhtml,ismenu)
{
	ap_openwin("/exec/egloo_delcomment_anony_view.php?eid=" + eid + "&srl=" + postserial + "&xhtml=" + xhtml + "&cmtserial=" + cmtserial + "&ismenu=" + ismenu, "delcomment", 400, 230, 3, false, false, false);
}


var beforeEditID = null;
var beforeCommentID = null;
function editComment(formName,postserial,cmtserial,bglevel,name,homepage,eid,rtnurl,cmpipflag,writer,isreply){
    EditID = "edit" + postserial + '_' + cmtserial;
    if (beforeEditID == EditID && $(beforeEditID).visible())
    {
        $(beforeEditID).hide();
        beforeEditID = null;

        if (beforeCommentID == CommentID && !$(beforeCommentID).visible())
        {
            $(beforeCommentID).show();
            beforeCommentID = null;
        }

        return;
    } else if (beforeEditID && $(beforeEditID)) {
        $(beforeEditID).innerHTML = '';
        $(beforeEditID).hide();
        $(beforeCommentID).show();
    }
    beforeEditID = EditID;

    CommentID = "comment_" + cmtserial;
    CommentID_Content = "";
    if($(CommentID)){
    	if(typeof $(CommentID).innerText == 'undefined'){ // FF 때문에 미쵸~
    		CommentID_Content = $(CommentID).innerHTML;

    		CommentID_Content = CommentID_Content.replace(/&nbsp;/ig," ");
    		CommentID_Content = CommentID_Content.replace(/<br>/ig,"\n");
    		CommentID_Content = CommentID_Content.replace(/<br[^>]+>/ig,"\n");
    		CommentID_Content = CommentID_Content.replace(/<[^>]+>/g,"");
    	}else{
    		CommentID_Content = $(CommentID).innerText;
    	}
    }
    beforeCommentID = CommentID;

    if (beforeReplyID && $(beforeReplyID)) {
        $(beforeReplyID).innerHTML = '';
        $(beforeReplyID).hide();
    }

    var html = '<div class="comment_write comment_modify" id="'+ EditID +'" style="width:100%;">' +
'        <fieldset>'+
'            <legend>덧글 수정 영역</legend>'+
'            <div class="comment_info">';

    if( bglevel>4 ) {
        html +=
'               <span class="comment_name">' +
'                   <label for="cmt_name">닉네임</label>' +
'                   <input type="text" id="name_edit" name="name_reply" class="name" size="10" maxlength="10" value="'+ name +'" /> ' +
'               </span>' +
'               <span class="comment_passwd">' +
'                   <label for="cmt_passwd">비밀번호</label>' +
'                   <input type="password" id="passwd_edit" name="passwd_reply" class="passwd" size="10" maxlength="10" value="" />' +
'               </span>' +
'               <span class="comment_blog">' +
'                   <label for="cmt_blog">블로그</label>' +
'                   <input type="text" id="homepage_edit" name="homepage_reply" class="blog" value="'+ homepage +'" size="20" />' +
'               </span>' +
'               <span class="comment_login">' +
'                   <a href="https://sec.egloos.com/login.php?returnurl='+ rtnurl +'" title="로그인">로그인</a>' +
'               </span>';
    } else {
        if(eid) {
            var profimg = 'http://profile.egloos.net/'+ eid +'_50.jpg';
            var myinfo = '';
        } else {
            var profimg = 'http://md.egloos.com/img/eg/profile_anonymous.jpg';
            var myinfo = '<span class="nateinfo">(<a href="http://valley.egloos.com/my/?mnopt=myinfo" title="회원정보수정" class="nateinfo_edit">회원정보수정</a>)</span>';
        }
        /*
        html +=
'               <span class="comment_now">' +
'                   <img src="'+ profimg +'" alt="" />' +
'                   <a href="'+ homepage +'" title="'+ homepage +'" target="_blank">'+ name +'</a>' + myinfo +
'               </span>';
		*/
    }

    if(isreply == '1'){
		var imgButton = 'http://md.egloos.com/img/eg/btn_reply.gif';
	}else{
		var imgButton = 'http://md.egloos.net/img/eg/btn_comment.gif';
	}

    html +=
'           </div>' +
'           <textarea id="comment_edit" name="comment_edit" class="comment_field" title="덧글수정영역" rows="5" cols="50">'+ CommentID_Content +'</textarea>' +
'           <div class="comment_btn f_clear">' +
'               <input type="hidden" name="comment_writer" id="comment_writer" value="'+ writer +'" />' +
'               <input type="image" class="comment_submit" src="'+ imgButton +'" value="댓글등록" onclick="runComment($(' + formName + '),' + bglevel + ',' + cmtserial + ', \'post_comment_edit\');" />' +
'           </div>' +
'       </fieldset>' +
'   </div>';
    $(beforeEditID).innerHTML = html;
    $(beforeEditID).show();
    $(beforeCommentID).hide();
}

function deltrackback(eid,postserial,trbserial,adview,xhtml)
{
	var response = confirm( "정말 삭제하시겠습니까?" );
	if (response == true)
	{
		var remoteURL = "/exec/egloo_deltrackback_exec.php";
		var ParamURI = "eid=" + eid + "&srl=" + postserial + "&trbserial=" + trbserial + "&xhtml=" + xhtml + "&adview=" + adview;
        var IE50 = (IE && versionMinor <= 5.9); //나중에 빼야 됨
        if (IE50)
        {
            self.frames.cmtviewfrm.location.href = remoteURL+"?"+ParamURI;
        }
        else {
            XMLHttpConnectPost(remoteURL,ParamURI,"resXml");
        }
		document.getElementById("trbcnt" + postserial).innerHTML = parseInt(document.getElementById("trbcnt" + postserial).innerHTML) - 1;
	}
	else
		return;
}

function delpingback(eid,postserial,pingserial,adview,xhtml)
{
	var response = confirm( "정말 삭제하시겠습니까?" );
	if (response == true)
	{
		var remoteURL = "/exec/egloo_delpingback_exec.php";
		var ParamURI = "eid=" + eid + "&srl=" + postserial + "&pingserial=" + pingserial + "&xhtml=" + xhtml + "&adview=" + adview;
        var IE50 = (IE && versionMinor <= 5.9); //나중에 빼야 됨
        if (IE50)
        {
            self.frames.cmtviewfrm.location.href = remoteURL+"?"+ParamURI;
        }
        else {
            XMLHttpConnectPost(remoteURL,ParamURI,"resXml");
        }
		document.getElementById("pingcnt" + postserial).innerHTML = parseInt(document.getElementById("pingcnt" + postserial).innerHTML) - 1;
	}
	else
		return;
}

function instrackback(eid,subject,hosturl,postserial)
{
	var form = document.trackfrom;
	//escape(subject)된 값이 넘어옴
	var trburl = "http://" + unescape(hosturl) + "/tb/" + postserial;
	var url	   = "http://" + unescape(hosturl) + "/" + postserial;

	ap_openwin("about:blank", "instrackback", 710, 550, 3, false, true, false);
	form.url.value = url;
	form.title.value = subject;
	form.trburl.value = trburl;
	form.target = "instrackback";
	form.action = "http://www.egloos.com/egloo/egloo_tool.php?eid=" + eid;
	form.submit();
}

function cmtview(serial,eid,xhtml)
{
	var remoteURL = "";
	var formURL = "";
	var cmtcont = "";
	var rtnurl = "";
	remoteURL = "/egloo_comment.php?eid=" + eid + "&srl=" + serial + "&xhtml=" + xhtml;
	cmtcont = document.getElementById("cmt" + serial).innerHTML;
	if ( cmtcont == "" || cmtcont.search(/(TRACK_TOP|pingback_)/gi) > 0 )
	{
		self.frames.cmtviewfrm.location.href = remoteURL;
	}
	else
		document.getElementById("cmt" + serial).innerHTML = "";
}

var exec_cmtview = false;
function cmtview_more(serial,eid,xhtml,page,ismenu)
{
	if(exec_cmtview) return;

	var remoteURL = "";
	var formURL = "";
	var cmtcont = "";
	var rtnurl = "";

	try{
	   document.getElementById("replyform_page").value = page;
	} catch(e) {
	}
	remoteURL = "/egloo_comment.php?eid=" + eid + "&srl=" + serial + "&xhtml=" + xhtml + "&adview=0&page=" + page + "&ismenu=" + ismenu;
	self.frames.cmtviewfrm.location.href = remoteURL;
	exec_cmtview = true;
}

function cmtview_morelist(serial, html, action, ismenu)
{
    try
    {
	    if( ismenu == 1 ) {
            var cmtlist =  document.getElementById("cmt_list" + serial);
            cmtlist.innerHTML = html;
            cmtlist.scrollIntoView(true);
		} else {
            if (document.getElementById("cmtmore"+serial) != null) {
                var newElm = document.createElement("temp");
                newElm.innerHTML = html;
                var cmtmore = document.getElementById("cmtmore" + serial);
                cmtmore.parentNode.insertBefore(newElm,cmtmore.nextSibling);
            }
	    }

		document.getElementById("cmtmore" + serial).innerHTML = action;
		if(action == '') {
			document.getElementById("cmtmore" + serial).style.display = 'none';
		} else {
			document.getElementById("cmtmore" + serial).style.display = 'block';
		}
    }
    catch (e)
    {
        alert("덧글을 열 수 없습니다.  " );
    }
	exec_cmtview = false;
}

function trbview(serial,eid,xhtml)
{
	var remoteURL = "";
	var cmtcont = "";
	remoteURL = "/egloo_trackback.php?eid=" + eid + "&srl=" + serial + "&xhtml=" + xhtml;
	cmtcont = document.getElementById("cmt" + serial).innerHTML;
	if ( cmtcont == "" || cmtcont.search(/(COMMENT_INPUT|pingback_)/gi) > 0 )
		self.frames.cmtviewfrm.location.href = remoteURL;
	else
		document.getElementById("cmt" + serial).innerHTML = "";
}

function pingview(serial,eid,xhtml)
{
	var remoteURL = "";
	var cmtcont = "";
	remoteURL = "/egloo_pingback.php?eid=" + eid + "&srl=" + serial + "&xhtml=" + xhtml;
	cmtcont = document.getElementById("cmt" + serial).innerHTML;
	if ( cmtcont == "" || cmtcont.search(/(TRACK_TOP|COMMENT_INPUT)/gi) > 0 )
		self.frames.cmtviewfrm.location.href = remoteURL;
	else
		document.getElementById("cmt" + serial).innerHTML = "";
}

function leapYear(year)
{
	if (year % 4 == 0) return true;
	else return false;
}

function getDays(month, year)
{
	var ar = new Array(12);
	ar[0] = 31;
	ar[1] = (leapYear(year)) ? 29 : 28;
	ar[2] = 31;
	ar[3] = 30;
	ar[4] = 31;
	ar[5] = 30;
	ar[6] = 31;
	ar[7] = 31;
	ar[8] = 30;
	ar[9] = 31;
	ar[10] = 30;
	ar[11] = 31;

	return ar[month];
}

function getMonthName(month) {
	var ar = new Array(12);
	ar[0] = "January";
	ar[1] = "February";
	ar[2] = "March";
	ar[3] = "April";
	ar[4] = "May";
	ar[5] = "June";
	ar[6] = "July";
	ar[7] = "August";
	ar[8] = "September";
	ar[9] = "October";
	ar[10] = "November";
	ar[11] = "December";

	return ar[month];
}

function getMonthStr(month) {
	var ar = new Array(12);
	ar[0] = "01";
	ar[1] = "02";
	ar[2] = "03";
	ar[3] = "04";
	ar[4] = "05";
	ar[5] = "06";
	ar[6] = "07";
	ar[7] = "08";
	ar[8] = "09";
	ar[9] = "10";
	ar[10] = "11";
	ar[11] = "12";

	return ar[month];
}

function calendar(acvstr,calstr,hosturl)
{
	var out = "" ;
	if ( acvstr == "" )
		var now = new Date();
	else
	{
		var calary = acvstr.split("-");
		if ( calary[1] == "10" )
			var tmpint = parseInt(calary[1]) - 1;
		else
			var tmpint = parseInt(calary[1].replace(/0/,"")) - 1;
		if ( tmpint == 0 ) tmpint = "00";
		if( tmpint < 10 ) calary[1] = "0" + tmpint.toString();
		else calary[1] = tmpint.toString();
		eval("var now = new Date(" + calary[0] + "," + calary[1] + "," + calary[2] + ")");
	}

	var year = now.getFullYear();
	var month = now.getMonth();
	var monthName = getMonthName(month);
	var date = now.getDate();
	now = null;
	var firstDayInstance = new Date(year, month, 1);
	var firstDay = firstDayInstance.getDay() + 1;
	firstDayInstance = null;
	var lastDate = getDays(month, year);
	var todaydate = new Date();
	var todaymonth = todaydate.getMonth();
	var todayday   = todaydate.getDate();
	todaydate = null;

	var today_page = year + "/" + getMonthStr(month);
	var pre_mpage = "";
	if ( month == 0 )
		pre_mpage += (year-1) + "/12";
	else
		pre_mpage += year + "/" + getMonthStr(month-1);

	var next_mpage = "";
	if ( month == 11 )
		next_mpage += (year+1) + "/01";
	else
		next_mpage += year + "/" + getMonthStr(month+1);

	out += "<DIV CLASS=CAL_TOP>" + calstr + "</DIV>";
	out += "<DIV CLASS=CAL>";
	out += "<DIV CLASS=CAL_HEAD>";
	out += "<A HREF=\"/archives/" + pre_mpage + "\"><SPAN CLASS=CAL>◀</SPAN></A>"
	out += " <A HREF=\"/archives/" + today_page + "\">" + monthName + " " + year + "</A> ";
	out += "<A HREF=\"/archives/" + next_mpage + "\"><SPAN CLASS=CAL>▶</SPAN></A></DIV>";
	out += "<DIV CLASS=CAL_BODY>";
	out += "<TABLE BORDER=0 CELLPADDING=0 CELLSPACING=1 WIDTH=100%>";

	var weekDay = new Array(7)
	weekDay[0] = "S";
	weekDay[1] = "M";
	weekDay[2] = "T";
	weekDay[3] = "W";
	weekDay[4] = "T";
	weekDay[5] = "F";
	weekDay[6] = "S";

	out += "<TR CLASS=CAL_TR>";
	for (var dayNum = 0; dayNum < 7; ++dayNum)
	{
		if( dayNum == 0 )
			out += "<TD WIDTH=15% CLASS=CAL_SUN>" + weekDay[dayNum] + "</TD>";
		else if( dayNum == 6 )
			out += "<TD WIDTH=15% CLASS=CAL_SAT>" + weekDay[dayNum] + "</TD>";
		else
			out += "<TD WIDTH=14% CLASS=CAL_DAY>" + weekDay[dayNum] + "</TD>";
	}
	out += "</TR>";

	var digit = 1;
	var curCell = 1;
	var eql = 0;
	var dayhref = "";
	var opentd = "";
	var closetd = "</TD>";
	for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7); ++row)
	{
		out += "<TR CLASS=CAL_TR>";
		for (var col = 1; col <= 7; ++col)
		{
			if( col == 1 || col == 7 )
				weektd = "<TD WIDTH=15% CLASS=CAL>";
			else
				weektd = "<TD WIDTH=14% CLASS=CAL>";

			if (digit > lastDate)	break;
			if (curCell < firstDay)
			{
				out += weektd + closetd;
				curCell++;
			}
			else
			{
				if ( digit < 10 ) digitstr = "0" + digit.toString();
				else digitstr = digit.toString();

				if ( s_calendar[eql] == digit )
				{
					dayhref = "<A HREF=\"/archives/" + year + "/" + getMonthStr(month) + "/" + digitstr + "\"><B>" + digit + "</B></A>";
					eql = eql + 1;
				}
				else
					dayhref = digit.toString();

				if ( digit == todayday && month == todaymonth )
				{
					out += weektd.replace(/CAL/gi,"CAL_TODAY") + dayhref + closetd;
				}
				else
					out += weektd + dayhref + closetd;

				digit++;
			}
		}
		out += "</TR>";
	}
	out += "</TABLE>";
	out += "</DIV>";
	out += "</DIV>";
	out += "<DIV CLASS=CAL_BOTTOM></DIV>";
	document.writeln(out);
}

function calendar_xhtml(acvstr,calstr)
{
	var out = "" ;
	if ( acvstr == "" )
		var now = new Date();
	else
	{
		var calary = acvstr.split("-");
		if ( calary[1] == "10" )
			var tmpint = parseInt(calary[1]) - 1;
		else
			var tmpint = parseInt(calary[1].replace(/0/,"")) - 1;
		if ( tmpint == 0 ) tmpint = "00";
		if( tmpint < 10 ) calary[1] = "0" + tmpint.toString();
		else calary[1] = tmpint.toString();
		eval("var now = new Date(" + calary[0] + "," + calary[1] + "," + calary[2] + ")");
	}

	var year = now.getFullYear();
	var month = now.getMonth();
	var monthName = getMonthName(month);
	var date = now.getDate();
	now = null;
	var firstDayInstance = new Date(year, month, 1);
	var firstDay = firstDayInstance.getDay() + 1;
	firstDayInstance = null;
	var lastDate = getDays(month, year);
	var todaydate = new Date();
	var todaymonth = todaydate.getMonth();
	var todayday   = todaydate.getDate();
	todaydate = null;

	var today_page = year + "/" + getMonthStr(month);
	var pre_mpage = "";
	if ( month == 0 )
		pre_mpage += (year-1) + "/12";
	else
		pre_mpage += year + "/" + getMonthStr(month-1);

	var next_mpage = "";
	if ( month == 11 )
		next_mpage += (year+1) + "/01";
	else
		next_mpage += year + "/" + getMonthStr(month+1);

	out += "<div class=cal_top>" + calstr + "</div>";
	out += "<div class=cal>";
	out += "<div class=cal_head>";
	out += "<a href=\"/archives/" + pre_mpage + "\"><span class=cal>◀</span></a>"
	out += " <a href=\"/archives/" + today_page + "\">" + monthName + " " + year + "</a> ";
	out += "<a href=\"/archives/" + next_mpage + "\"><span class=cal>▶</span></a></div>";
	out += "<div class=cal_body>";
	out += "<table border=0 cellpadding=0 cellspacing=1 width=100%>";

	var weekDay = new Array(7)
	weekDay[0] = "S";
	weekDay[1] = "M";
	weekDay[2] = "T";
	weekDay[3] = "W";
	weekDay[4] = "T";
	weekDay[5] = "F";
	weekDay[6] = "S";

	out += "<tr class=cal_tr>";
	for (var dayNum = 0; dayNum < 7; ++dayNum)
	{
		if( dayNum == 0 )
			out += "<td width=15% class=cal_sun>" + weekDay[dayNum] + "</td>";
		else if( dayNum == 6 )
			out += "<td width=15% class=cal_sat>" + weekDay[dayNum] + "</td>";
		else
			out += "<td width=14% class=cal_day>" + weekDay[dayNum] + "</td>";
	}
	out += "</tr>";

	var digit = 1;
	var curCell = 1;
	var eql = 0;
	var dayhref = "";
	var opentd = "";
	var closetd = "</td>";
	for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7); ++row)
	{
		out += "<tr class=cal_tr>";
		for (var col = 1; col <= 7; ++col)
		{
			if( col == 1 || col == 7 )
				weektd = "<td width=15% class=cal>";
			else
				weektd = "<td width=14% class=cal>";

			if (digit > lastDate)	break;
			if (curCell < firstDay)
			{
				out += weektd + closetd;
				curCell++;
			}
			else
			{
				if ( digit < 10 ) digitstr = "0" + digit.toString();
				else digitstr = digit.toString();

				if ( s_calendar[eql] == digit )
				{
					dayhref = "<a href=\"/archives/" + year + "/" + getMonthStr(month) + "/" + digitstr + "\"><strong>" + digit + "</strong></a>";
					eql = eql + 1;
				}
				else
					dayhref = digit.toString();

				if ( digit == todayday && month == todaymonth )
				{
					out += weektd.replace(/CAL/gi,"cal_today") + dayhref + closetd;
				}
				else
					out += weektd + dayhref + closetd;

				digit++;
			}
		}
		out += "</tr>";
	}
	out += "</table>";
	out += "</div>";
	out += "</div>";
	out += "<div class=cal_bottom></div>";
	document.writeln(out);
}

function fnd_calenda(hosturl,acvstr,kwd)
{
	var out = "" ;
	if ( acvstr == "" )
		var now = new Date();
	else
	{
		var calary = acvstr.split("-");
		if ( calary[1] == "10" )
			var tmpint = parseInt(calary[1]) - 1;
		else
			var tmpint = parseInt(calary[1].replace(/0/,"")) - 1;
		if ( tmpint == 0 ) tmpint = "00";
		if( tmpint < 10 ) calary[1] = "0" + tmpint.toString();
		else calary[1] = tmpint.toString();
		eval("var now = new Date(" + calary[0] + "," + calary[1] + "," + calary[2] + ")");
	}

	var year = now.getFullYear();
	var month = now.getMonth();
	var monthName = getMonthName(month);
	var date = now.getDate();
	now = null;
	var firstDayInstance = new Date(year, month, 1);
	var firstDay = firstDayInstance.getDay() + 1;
	firstDayInstance = null;
	var lastDate = getDays(month, year);
	var todaydate = new Date();
	var todayyear  = todaydate.getFullYear();
	var todaymonth = todaydate.getMonth();
	var todayday   = todaydate.getDate();
	todaydate = null;

	var today_page = year + "-" + getMonthStr(month) + "-01";
	var pre_mpage = "";
	if ( month == 0 )
		pre_mpage += (year-1) + "-12-01";
	else
		pre_mpage += year + "-" + getMonthStr(month-1) + "-01";

	var next_mpage = "";
	if ( month == 11 )
		next_mpage += (year+1) + "-01-01";
	else
		next_mpage += year + "-" + getMonthStr(month+1) + "-01";

	out += "<DIV CLASS=CAL>";
	out += "<DIV CLASS=CAL_HEAD>";
	out += "<A HREF=http://" + hosturl + "?kwd=" + kwd + "&acv=" + pre_mpage + "&dtm=" + pre_mpage + "><SPAN CLASS=CAL>◀</SPAN></A> "
	out += "<A HREF=http://" + hosturl + "?kwd=" + kwd + "&acv=" + today_page + "&dtm=" + today_page + ">" + monthName + " " + year + "</A> ";
	if ( year >= todayyear && month >= todaymonth )
		out += "<SPAN CLASS=CAL>▶</SPAN>";
	else
		out += "<A HREF=http://" + hosturl + "?kwd=" + kwd + "&acv=" + next_mpage + "&dtm=" + next_mpage + "><SPAN CLASS=CAL>▶</SPAN></A>";
	out += "</DIV>";
	out += "<DIV CLASS=CAL_BODY>";
	out += "<TABLE BORDER=0 CELLPADDING=0 CELLSPACING=1 WIDTH=100%>";

	var weekDay = new Array(7)
	weekDay[0] = "S";
	weekDay[1] = "M";
	weekDay[2] = "T";
	weekDay[3] = "W";
	weekDay[4] = "T";
	weekDay[5] = "F";
	weekDay[6] = "S";

	out += "<TR CLASS=CAL_TR>";
	for (var dayNum = 0; dayNum < 7; ++dayNum)
	{
		if( dayNum == 0 )
			out += "<TD WIDTH=15% CLASS=CAL_SUN>" + weekDay[dayNum] + "</TD>";
		else if( dayNum == 6 )
			out += "<TD WIDTH=15% CLASS=CAL_SAT>" + weekDay[dayNum] + "</TD>";
		else
			out += "<TD WIDTH=14% CLASS=CAL_DAY>" + weekDay[dayNum] + "</TD>";
	}
	out += "</TR>";

	var digit = 1;
	var curCell = 1;
	var opentd = "";
	var closetd = "</TD>";
	for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7); ++row)
	{
		out += "<TR CLASS=CAL_TR>";
		for (var col = 1; col <= 7; ++col)
		{
			if( col == 1 || col == 7 )
				weektd = "<TD WIDTH=15% CLASS=CAL>";
			else
				weektd = "<TD WIDTH=14% CLASS=CAL>";

			if (digit > lastDate)	break;
			if (curCell < firstDay)
			{
				out += weektd + closetd;
				curCell++;
			}
			else
			{
				if ( digit < 10 ) digitstr = year + "-" + getMonthStr(month) + "-0" + digit.toString();
				else digitstr = year + "-" + getMonthStr(month) + "-" + digit.toString();

				if ( digit == todayday && month == todaymonth )
				{
					out += weektd.replace(/CAL/gi,"CAL_TODAY");
					out += "<A HREF=http://" + hosturl + "?kwd=" + kwd + "&acv=" + today_page + "&dtm=" + digitstr + ">" + digit.toString() + "</A>";
				}
				else if ( digit < todayday && month == todaymonth )
				{
					out += weektd.replace(/CAL/gi,"CAL_DAY");
					out += "<A HREF=http://" + hosturl + "?kwd=" + kwd + "&acv=" + today_page + "&dtm=" + digitstr + ">" + digit.toString() + "</A>";
				}
				else if ( month != todaymonth )
				{
					out += weektd.replace(/CAL/gi,"CAL_DAY");
					out += "<A HREF=http://" + hosturl + "?kwd=" + kwd + "&acv=" + today_page + "&dtm=" + digitstr + ">" + digit.toString() + "</A>";
				}
				else
					out += weektd + digit.toString();

				out += closetd;
				digit++;
			}
		}
		out += "</TR>";
	}
	out += "</TABLE>";
	out += "</DIV>";
	out += "</DIV>";
	out += "<DIV CLASS=CAL_BOTTOM></DIV>";
	document.writeln(out);
}


function tag_validate(obj) {

	if (obj.value == null || obj.value == "")	return "";

	var re	= /<(\/?(A|DIV|SPAN|CENTER|FONT))+[^<>]*>/gi;
	var ary = obj.value.match(re);

	if ( ary == null )	return "";
	ary.sort();

	var tmpv;
	var tagObj = new tag_obj();
	var str = "";
	var word = null;
	word = re.exec(obj.value);

	while ( (word = re.exec(obj.value)) != null ){

		tmpv	= word[1].toLowerCase();

		if ( tmpv.indexOf("/") != -1) {
			tmpv = tmpv.replace("/","");
			tagObj.add(tmpv,0,1);
		}
		else {
			tmpv = tmpv.replace("/","");
			tagObj.add(tmpv,1,0);
		}
	}


//	for (i=0 ; i < ary.length ;i++)
//	{
//		tmpv	= ary[i].toLowerCase();

//		if ( tmpv.indexOf("/") != -1) {
//			tmpv = tmpv.replace("/","");
//			tagObj.add(tmpv,0,1);
//		}
//		else {
//			tmpv = tmpv.replace("/","");
//			tagObj.add(tmpv,1,0);
//		}
//	}


	for (i = 0 ; i < tagObj.ary.length ;i++)
	{
		if (tagObj.ary[i].compare() == false) {
			str += tagObj.ary[i].tag ;
		}
	}

	if ( str != "" )
	{
		str +=	" 태그가 유효하지 않습니다. \r\n이대로 글을 올릴 경우 HTML이 제대로 표현되지 않을 수 있습니다. \r\n글을 올리시겠습니까?"
	}

  	return str;
}


function tag_obj() {

	this.add	= _add;
	this.ary	= new Array();
	this.size	= 0;

	function _ary(tagName,scount,ecount) {
		this.tag	= tagName;
		this.scount	= scount;
		this.ecount = ecount;
		this.compare= _compare;

		function _compare() {
			if (this.scount  == this.ecount) {
				return true;
			}
			else {
				return false;
			}
		}
	}

     function _add(tagName,scount,ecount) {

          if (tagName == null) return;
		  if (checkObj(this.ary,tagName, scount,ecount) == true) return;

          this.ary[(this.size)] = new _ary(tagName,scount,ecount);
		  this.size++;
     }

	function checkObj(ary,tagName,scount,ecount) {

		if (ary == null) {
			return false;
		}
		var tmpAry;
		for (var i = 0 ; i < ary.length ; i ++) {
			tmpAry = ary[i];

			if (tmpAry.tag == tagName) {
				tmpAry.scount += scount;
				tmpAry.ecount += ecount;
				return true;
			}
		}
		return false;
	}
}

function go_finder(form)
{
	var fndstr = form.kwd.value;

    fndstr = fndstr.replace(/(^\s*)|(\s*$)/gi,"");
	if (fndstr == "")
	{
		alert("검색어를 넣어주세요");
		return false;
	}

	if (fndstr.length < 2)
	{
		alert("두자 이상만 검색됩니다.");
		return false;
	}

    form.kwd.value = fndstr;
	return true;
}

function view_comment(srl,html) {
	document.getElementById("cmt"+srl).innerHTML = html;
}

function RecomPost(eid, serial) {
	self.frames.cmtviewfrm.location.href = "http://www.egloos.com/egloo/recompost_exec.php?eid=" + eid + "&srl=" + serial;
}

function copy_trackback(obj) {
	if(IE) {
		if(confirm("트랙백 주소를 클립보드에 복사하시겠습니까?"))
			window.clipboardData.setData("Text", obj.innerHTML);
	}
}

function sketch_view(eid, srl){
	var sTag = ''
		+ '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"'
		+ '	codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,124,0"'
		+ '	width="130"'
		+ '	height="130"'
		+ '	id="oekaki1"'
		+ '	align="middle">'
		+ '<param name="movie" value="http://md.egloos.com/swf/sketch_view.swf?eid='+eid+'&srl='+srl+'" />'
		+ '<param name="quality" value="high" />'
		+ '<param name="bgcolor" value="#ffffff">'
		+ '<param name="allowScriptAccess" value="always">'
		+ '<param name="FlashVars" value="bestNum=1">'
		+ ''
		+ '<embed src="http://md.egloos.com/swf/sketch_view.swf?eid='+eid+'&srl='+srl+'"'
		+ '	quality="high"'
		+ '	bgcolor="#ffffff"'
		+ '	width="130"'
		+ '	height="130"'
		+ '	name="oekaki1"'
		+ '	align="middle"'
		+ '	swLiveConnect=true'
		+ '	allowScriptAccess="always"'
		+ '	FlashVars="bestNum=1"'
		+ '	type="application/x-shockwave-flash"'
		+ '	pluginspage="http://www.macromedia.com/go/getflashplayer">'
		+ '</object>'
		+ '';
	document.write (sTag);
}

function go_search(form) {
    var kwd = form.srch_kwd;
    if(typeof option == 'undefined' || option == null || option == "") {
    	option = "accu"
    }
    if(typeof page == 'undefined' || page == null || option == "") {
    	page = 1;
    }

    if(kwd) {
        var fndstr = kwd.value;

        fndstr = fndstr.replace(/(^\s*)|(\s*$)/gi,"");
    	if (fndstr == "")
	    {
		    alert("검색어를 넣어주세요");
            kwd.focus();
    		return false;
	    }
        var addurl = "search?query=";
        var str_option = "&option=" + option;
        var str_page = "&page=" + page;
        var url = form.action + addurl + encodeURIComponent(fndstr) + str_option + str_page;

        kwd.focus();
        form.action = url;
    } else {
        return false;
    }

    return true;
}

function togglePwdBox(el, className, isFocus) {
  el.style.display='none';
  var that = document.getElementsByClassName(className)[0];
  that.style.display='';
  if (isFocus) that.focus();
}

// This stops the javascript from hiding -->
