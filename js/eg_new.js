<!-- Begin to hide script contents from old browsers.

var current_feedback = '';
var refrashHash ='';
var current_pserial = '';

function feedbackview(type,eid,pserial,page,ismain,xhtml)
{
	var fbid = getfeedbackid(type,pserial,ismain);
	if ( (pserial == current_pserial && type != current_feedback)
	       || (pserial != current_pserial && $(fbid).innerHTML == '') ) {
	    feedback_request(type,eid,pserial,page,ismain,xhtml);
    } else {
        refrashHash='';
        current_feedback = '';
        $(fbid).innerHTML = "";
        $(fbid).hide();
        current_pserial = '';
    }
    return false;
}

function feedback_paging(type,eid,pserial,page) {
	feedback_request(type,eid,pserial,page);
	return false;
}

function feedback_request(type,eid,pserial,page,ismain,xhtml) {
    page = page || 1;
    ismain = ismain || '';
    xhtml = xhtml || 1;
    refrashHash = (type == "post_trackback_hash") ? 1:0;
    type = (type == "post_trackback_hash") ? "post_trackback":type;
    current_feedback = type;
    current_pserial = pserial;

    exec_cmtview = true;
    var parameter = {
        eid : eid,
        type : type,
        srl : pserial,
        page: page,
        xhtml: xhtml,
        ismain : ismain
    };

    var url = "/egloo_feedback.php";
    url = (type == 'viewer_trackback') ? '/api/tb/viewer/s'+pserial : url;
    url = (type == 'reader_trackback') ? '/api/tb/reader/s'+pserial : url;
    new Ajax.Request(url, {
        parameters: parameter,
        onComplete: feedbackcomplete,
        onFailure: feedbackfailure
        }
    );



}

function feedbackcomplete(transport) {
	var contnode = transport.responseXML.getElementsByTagName("cont");
	if ( contnode.item(0).firstChild.nodeType == 4 ) // CDATA_SECTION_NODE
	    var cont = contnode.item(0).childNodes.item(0).data;
	else if ( contnode.item(0).firstChild.nodeType == 3 && contnode.item(0).childNodes.length == 1 ) // TEXT_NODE  && IE OPERA
	    var cont = contnode.item(0).childNodes.item(0).data;
	else { //firefox
	    var cont = contnode.item(0).childNodes.item(1).data;
	}
//	alert(cont);
	eval(cont);
}

function feedbackfailure() {
	alert('처리에 실패했습니다.');
}

function getfeedbackid(type,serial,ismain) {
    var id = '';
    switch(type) {
        case 'post_comment':
          id = 'comment_' + serial;
          break;
        case 'post_trackback':
        case 'post_trackback_hash':
        case 'viewer_trackback':
        case 'reader_trackback':
          id = 'trackback_' + serial;
          break;
        case 'post_pingback':
          id = 'pingback_' + serial;
          break;
        default:
          break;
    }

    if(!$(id) || ismain) {
        id = 'post_link_' + serial;
    }
    return id;
}

function setfeedback(type,serial,html) {
	var id = getfeedbackid(type,serial,false);
	$(id).show();
         document.getElementById(id).innerHTML = html;

        if(refrashHash) {
                var backup = window.location.hash;
                window.location.hash ='';
                window.location.hash = backup;
                refrashHash = 0;
        }
}

function setwidget(id,html) {
	if($(id)) {
        document.getElementById(id).innerHTML = html;
	} else {
		alert('영역 ID가 없습니다.');
	}
}

function moreview(eid, type, ismore)
{
	ismore = (ismore) ? '1' : '';
    var remoteURL = "/egloo_widget.php?eid=" + eid + "&type=" + type + "&ismore=" + ismore ;
    new Ajax.Request(remoteURL, {
        onComplete: feedbackcomplete,
        onFailure: feedbackfailure
        }
    );
    return false;
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
    	if(cmtserial && wtype == 'post_comment_reply'){
    		if( isNothing($('name_reply')) ) return( false );
    	}else{
    		if( isNothing(form.name) ) return( false );
    	}
        if( !isValidBlob(form.name, 30) ) return( false );

        if(cmtserial && wtype == 'post_comment_reply'){
    		if( isNothing($('passwd_reply')) ) return( false );
    	}else{
    		if( isNothing(form.passwd) ) return( false );
    	}

        if( !isValidBlob(form.homepage, 100) ) return( false );
        if( form.homepage.value != 0 && form.homepage.value.search(/http\:\/\//gi) < 0 ) {
            alert("올바른 홈페이지 주소가 아닙니다. \r\n다시 입력해주세요.");
            form.homepage.focus();
            return( false );
        }
        if( form.homepage.value.search(/ /) > 0  ) {
            alert("공백이 들어있습니다. 공백을 제거해 주세요.");
            form.homepage.focus();
            return( false );
        }
        if( form.homepage.value == "http://" )
            form.homepage.value = "";
    }

    if(form.security.checked == true) scrtstr = "0";
    else  scrtstr = "1";

    if(cmtserial && wtype == 'post_comment_reply'){
		if( isNothing($('comment_reply')) ) return( false );
	}else{
		if( isNothing(form.comment) ) return( false );
	}

    if( !isValidBlob(form.comment, 20480) ) return( false );

    if(wtype != 'post_comment_edit'){ // 덧/답글 작성시에만 카운트
    	var postserial = form.srl.value;
        applyCommentCount(postserial, +1);
    }

    var spoonpopup = 0;
    if(form.spoonpopup) {
        spoonpopup = form.spoonpopup.value;
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

        if (bglevel > 4) {
            postdata = "eid=" + form.eid.value +
             "&tid=" + encodeURIComponent(form.tid.value) +
             "&srl=" + form.srl.value +
             "&cmtsrl=" + form.cmtsrl.value +
             "&xhtml=" + form.xhtml.value +
             "&name=" + encodeURIComponent(form.name.value) +
             "&homepage=" + form.homepage.value +
             "&passwd=" + encodeURIComponent(form.passwd.value) +
             "&comment=" + encodeURIComponent(form.comment.value) +
             "&security=" + scrtstr +
             "&adview=" + form.adview.value +
             "&subject=" + encodeURIComponent(form.subject.value) +
             "&wtype=" + current_feedback +
             "&ismenu=" + form.ismenu.value + page +
             "&ismain=" + form.ismain.value +
             "&spoon=" + spoonpopup;
        } else {
            postdata = "eid=" + form.eid.value +
            "&tid=" + encodeURIComponent(form.tid.value) +
            "&srl=" + form.srl.value +
            "&cmtsrl=" + form.cmtsrl.value + writer +
            "&xhtml=" + form.xhtml.value +
            "&name=&comment=" + encodeURIComponent(form.comment.value) +
            "&security=" + scrtstr +
            "&adview=" + form.adview.value +
            "&subject=" + encodeURIComponent(form.subject.value) +
            "&wtype=" + current_feedback +
            "&ismenu=" + form.ismenu.value + page +
            "&ismain=" + form.ismain.value +
            "&spoon=" + spoonpopup;
        }
        exec_runcomment = true;

        new Ajax.Request(remoteURL, {
            parameters: postdata,
            onComplete: feedbackcomplete,
            onFailure: feedbackfailure
            }
        );
        return( false );
    }
}

var beforeReplyID = null;
function replyComment(formName,postserial,cmtserial,bglevel,name,homepage,eid,rtnurl,cmpipflag,security_opt){
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
    var html = '<div class="comment_write" id="'+ ReplyID +'">' +
'        <fieldset>'+
'            <legend>덧글 입력 영역</legend>'+
'            <div class="comment_info">';

    if( bglevel>4 ) {
        html +=
'               <span class="comment_name">' +
'                   <label for="cmt_name">닉네임</label>' +
'                   <input type="text" id="name_reply" name="name_reply" class="name" size="10" maxlength="10" value="'+ name +'" /> ' +
'               </span>' +
'               <span class="comment_passwd">' +
'                   <label for="cmt_passwd">비밀번호</label>';
		if (isChromeBrowser) {
				html +=
'                   <input type="password" id="passwd_reply" name="passwd_reply" class="passwd passwd_reply" size="10" maxlength="10" value="" style="display:none" onblur="if (this.value.length > 0) {return;} else { togglePwdBox(this, \'passwd_reply_alt\', false);}" />' +
'                   <input type="text" id="passwd_reply" name="passwd_reply_alt" class="passwd passwd_reply_alt" size="10" maxlength="10" value="" onfocus="togglePwdBox(this, \'passwd_reply\', true)" onclick="togglePwdBox(this, \'passwd_reply\', true)" readonly="readonly"/>';
		} else {
				html +=
'                   <input type="password" id="passwd_reply" name="passwd_reply" class="passwd" size="10" maxlength="10" value="" />';
		}
				html +=
'               </span>' +
'               <span class="comment_blog">' +
'                   <label for="cmt_blog">블로그</label>' +
'                   <input type="text" id="homepage_reply" name="homepage_reply" class="blog" value="'+ homepage +'" size="20" />' +
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
        html +=
'               <span class="comment_now">' +
'                   <img src="'+ profimg +'" alt="" />' +
'                   <a href="'+ homepage +'" title="'+ homepage +'" target="_blank">'+ name +'</a>' + myinfo +
'               </span>';
    }

    html +=
'           </div>' +
'           <textarea id="comment_reply" name="comment_reply" class="comment_field" title="댓글입력영역" rows="5" cols="50"></textarea>' +
'           <div class="comment_btn f_clear">' ;

    			if(security_opt == '1'){
    html +=
'				<input type="checkbox" id="security_reply" name="security_reply" onclick="checkConfirm();"> <label for="security_reply">비공개</label>' ;
    			}else if(security_opt == '2'){
    html +=
'				<input type="checkbox" id="security_reply" name="security_reply" checked onclick="checkConfirm();"> <label for="security_reply">비공개</label>' ;
    			}

				if(bglevel>4 && cmpipflag == '1'){
	html +=
'				* 비로그인 덧글의 IP 전체보기를 설정한 이글루입니다.';
				}
	html +=
'               <input class="comment_submit" type="image" src="http://md.egloos.com/img/eg/btn_reply.gif" value="댓글등록" onclick="runComment($(' + formName + '),' + bglevel + ',' + cmtserial + ',\'post_comment_reply\');" />' +
'           </div>' +
'       </fieldset>' +
'   </div>';
    $(beforeReplyID).innerHTML = html;
    $(beforeReplyID).show();
}

function setReplyComment(form,bglevel,cmtserial) {
    form.cmtsrl.value = cmtserial;
    if( bglevel > 4 ) {
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
    if(document.getElementById("cmtcnt" + postserial)) {
       document.getElementById("cmtcnt" + postserial).innerHTML = parseInt(document.getElementById("cmtcnt" + postserial).innerHTML) + applyCount;
    }
}

function delComment(eid,postserial,cmtserial,writer,adview,xhtml,isreply,ismenu){
    var msg = "정말 삭제하시겠습니까?";
    if(isreply == false) {
        msg += '\r\n(덧글 삭제시 답글까지 삭제됩니다)';
    }
    var response = confirm( msg );
    if (response == true)
    {
        var remoteURL = "/exec/egloo_delcomment_exec.php";
        var ParamURI = "eid=" + eid + "&srl=" + postserial + "&xhtml=" + xhtml + "&cmtserial=" + cmtserial + "&writer=" + encodeURIComponent(writer) + "&adview=" + adview + "&wtype=" + current_feedback +  "&ismenu=" + ismenu;
        new Ajax.Request(remoteURL, {
            parameters: ParamURI,
            onComplete: feedbackcomplete,
            onFailure: feedbackfailure
            }
        );
		applyCommentCount(postserial, -1);
    }
    else
        return;
}

function delComment_view(eid,postserial,cmtserial,adview,xhtml,ismenu)
{
    ap_openwin("/exec/egloo_delcomment_anony_view.php?eid=" + eid + "&srl=" + postserial + "&xhtml=" + xhtml + "&cmtserial=" + cmtserial + "&wtype=" + current_feedback +  "&ismenu=" + ismenu, "delcomment", 400, 230, 3, false, false, false);
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

    var html = '<div class="comment_write comment_modify" id="'+ EditID +'">' +
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
        var ParamURI = "eid=" + eid + "&srl=" + postserial + "&trbserial=" + trbserial + "&xhtml=" + xhtml + "&wtype=" + current_feedback +  "&adview=" + adview;
        new Ajax.Request(remoteURL, {
            parameters: ParamURI,
            onComplete: feedbackcomplete,
            onFailure: feedbackfailure
            }
        );
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
        var ParamURI = "eid=" + eid + "&srl=" + postserial + "&pingserial=" + pingserial + "&xhtml=" + xhtml + "&wtype=" + current_feedback +  "&adview=" + adview;
        new Ajax.Request(remoteURL, {
            parameters: ParamURI,
            onComplete: feedbackcomplete,
            onFailure: feedbackfailure
            }
        );
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
    var url    = "http://" + unescape(hosturl) + "/" + postserial;

    ap_openwin("about:blank", "instrackback", 710, 550, 3, false, true, false);
    form.url.value = url;
    form.title.value = subject;
    form.trburl.value = trburl;
    form.target = "instrackback";
    form.action = "http://www.egloos.com/egloo/egloo_tool.php?eid=" + eid;
    form.submit();
}

function TitleListView(view) {
	document.cookie = "tl_v="+view+";";
	location.reload();
}

function TitleListOpen(open) {
	if (open == '1') {
		document.cookie = "tl_o=1;";
		$('titlelist_open_btn').style.display = 'none';
		$('titlelist_close_btn').style.display = 'block';
		$('titlelist_list').style.display = 'block';
		$('titlelist_paging').style.display = 'block';
	} else if (open == '0') {
		document.cookie = "tl_o=0;";
		$('titlelist_open_btn').style.display = 'block';
		$('titlelist_close_btn').style.display = 'none';
		$('titlelist_list').style.display = 'none';
		$('titlelist_paging').style.display = 'none';
	}
}

//레거시 코드
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
        alert("덧글을 열수 없습니다." );
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

var PostMeta = {

    show_tab : function(menu,post,param1,param2){
        if (menu == "1") {
            if ($("tab1_"+post)) { $("tab1_"+post).className = "post_meta_title1_on";}
            if ($("tab2_"+post)) { $("tab2_"+post).className = "post_meta_title2";}
            if ($("tab3_"+post)) { $("tab3_"+post).className = "post_meta_title3";}
            if ($("tab_c1_"+post)) { $("tab_c1_"+post).style.display = "";}
            if ($("tab_c2_"+post)) { $("tab_c2_"+post).style.display = "none";}
            if ($("tab_c3_"+post)) { $("tab_c3_"+post).style.display = "none";}
            if ($("tab_c1_"+post).innerHTML == ''){
            //    $("tab_c1_"+post).innerHTML = '데이터를 가져오는중입니다.';
                this.get_metadata(1,post,param1,param2);
            }

        } else if (menu == "2") {
            if ($("tab1_"+post)) { $("tab1_"+post).className = "post_meta_title1";}
            if ($("tab2_"+post)) { $("tab2_"+post).className = "post_meta_title2_on";}
            if ($("tab3_"+post)) { $("tab3_"+post).className = "post_meta_title3";}
            if ($("tab_c1_"+post)) { $("tab_c1_"+post).style.display = "none";}
            if ($("tab_c2_"+post)) { $("tab_c2_"+post).style.display = "";}
            if ($("tab_c3_"+post)) { $("tab_c3_"+post).style.display = "none";}

            if ($("tab_c2_"+post).innerHTML == '' || $("tab_c2_"+post).innerHTML.toLowerCase() == '<li></li>'){
            //    $("tab_c2_"+post).innerHTML = '데이터를 가져오는중입니다.';
                this.get_metadata(2,post,param1,param2);

            }

        }else if (menu == "3") {
            if ($("tab1_"+post)) { $("tab1_"+post).className = "post_meta_title1";}
            if ($("tab2_"+post)) { $("tab2_"+post).className = "post_meta_title2";}
            if ($("tab3_"+post)) { $("tab3_"+post).className = "post_meta_title3_on";}
            if ($("tab_c1_"+post)) { $("tab_c1_"+post).style.display = "none";}
            if ($("tab_c2_"+post)) { $("tab_c2_"+post).style.display = "none";}
            if ($("tab_c3_"+post)) { $("tab_c3_"+post).style.display = "";}
            if ($("tab_c3_"+post).innerHTML == ''){
            //    $("tab_c3_"+post).innerHTML = '데이터를 가져오는중입니다.';
                this.get_metadata(3,post,param1,param2);
            }

        }
    },

    get_metadata : function(menu,post,param1,param2) {

        if(param2 == undefined) {
            this._getMetaPublishAjax(menu,post,param1);
        } else {
            this._getMetaCateAjax(menu,post,param1,param2);

        }
    },


    _getMetaPublishAjax :function(menu,post,eid) {
        var url = '/exec/egloo_post_metadata.php?eid='+eid;
        var parameter = {
            menu  : menu,
            post  : post
        }

        new Ajax.Request(url, {
            parameters: parameter,
            onComplete: this._getMetaPublishAjax_complete.bind(this),
            onFailure: this._getMetaPublishAjax_failed.bind(this)
        });
    },

    _getMetaPublishAjax_complete : function(res) {
        var resText = res.responseText;
        if (resText.isJSON() && resText != null) {
            var resData = resText.evalJSON();
            $("tab_c"+resData.menu+"_"+resData.post).innerHTML = resData.html;
        } else {
            $("tab_c"+resData.menu+"_"+resData.post).innerHTML = '퍼블리싱 및 추천 정보가 없습니다.';
            alert('데이터 가져오기를 실패했습니다.');
        }

    },

    _getMetaPublishAjax_failed : function(res) {
        $("tab_c"+resData.menu+"_"+resData.post).innerHTML = '퍼블리싱 및 추천 정보가 없습니다.';
        alert('데이터 가져오기를 실패했습니다.');
    },

    _getMetaCateAjax :function(menu,post,eid,cate) {
        var url = '/exec/egloo_post_metadata.php?eid='+eid;
        var parameter = {
            menu  : menu,
            post  : post,
            cate  : cate
        }

        new Ajax.Request(url, {
            parameters: parameter,
            onComplete: this._getMetaCateAjax_complete.bind(this),
            onFailure: this._getMetaCateAjax_failed.bind(this)
        });
    },

    _getMetaCateAjax_complete : function(res) {
        var resText = res.responseText;
        if (resText.isJSON() && resText != null) {
            var resData = resText.evalJSON();
            $("tab_c"+resData.menu+"_"+resData.post).innerHTML = resData.html;
        } else {
            $("tab_c"+resData.menu+"_"+resData.post).innerHTML = '같은 카테고리의 글이 없습니다.';
            alert('데이터 가져오기를 실패했습니다.');
        }

    },

    _getMetaCateAjax_failed : function(res) {
        $("tab_c"+resData.menu+"_"+resData.post).innerHTML = '같은 카테고리의 글이 없습니다.';
        alert('데이터 가져오기를 실패했습니다.');
    }

}

function togglePwdBox(el, className, isFocus) {
  el.style.display='none';
  var that = document.getElementsByClassName(className)[0];
  that.style.display='';
  if (isFocus) that.focus();
}
