<!-- Begin to hide script contents from old browsers.
/* Using checkPost {{{ */
var checkPostMemoDefault = '메모를 짧게 입력해 주세요. (200자 이내)';
function getStrBytes(str)
{
    var byte_count = 0;
    for(i=0; i< str.length; i++)
    {
        byte_count += chrBytes(str.charAt(i));
    }
    return byte_count;
}

function chrBytes(chr)
{
    if(escape(chr).length > 4) return 2;
    else return 1;
}
/* }}} */


function windowResize() {
	document.getElementById("navibar").style.width = document.body.clientWidth;
}

function nav_show(opt,egloourl) {

	// 독립도메인인지 체크
    var tmphref = document.location.href;
    tmphref = tmphref.replace(/http\:\/\//gi,"");
    var domain = tmphref.substring(0,tmphref.indexOf("/"));
    if(/egloos\.com$/.test(domain)){
        domain='';
    }

	var isIE=document.all;
	var up_nel = document.getElementById("navi_dropmenu_updatepost");
	var nel = up_nel.getElementsByTagName('UL')[0];
	var prElm=isIE ? up_nel.parentElement : up_nel.parentNode;
	var titElm = prElm.getElementsByTagName('DIV')[0];
	if(up_nel.style.display == "none"){
		layer_init('navi_dropmenu_updatepost');
		up_nel.style.display = "block";
		titElm.getElementsByTagName('A')[0].className = "on";
	} else {
		up_nel.style.display = "none";
		titElm.getElementsByTagName('A')[0].className = "over";
		return;
	}	

	var obj = null;
	if(opt) {
		obj = set_postobj(opt);
	}
	if(opt && egloourl && obj == null) {

		if( typeof(document.location.href) == "unknown" )
		{
			var host = egloourl;
		}
		else
		{
			var tmpurl = document.location.href;
			tmpurl = tmpurl.replace(/http\:\/\//gi,"");
			var host = tmpurl.substring(0,tmpurl.indexOf("."));
		}
        if(domain){
		    var url = 'http://' + domain + '/nav/post_list.php';
        }else{
		    if(host == 'admin') var url = 'http://admin.egloos.com/exec/nav_post_list.php';
		    else var url = 'http://' + egloourl + '.egloos.com/nav/post_list.php';
        }
		var pars	= 'opt=' + opt;


		nav_ajaxexec(url, pars);
		cur_nel = nel;
		cur_opt = opt;
		nel.innerHTML = '<span class="loading"><img src="http://md.egloos.com/img/eg/nav/loader_gray.gif" alt="로딩중" /> 자료를 읽고 있습니다.</span>';
	} else if(opt && obj != null && cur_nel == nel) {

		cur_nel = nel;
		cur_opt = opt;
	}	
}

function nav_hide(el) {
	el.getElementsByTagName('UL')[0].style.display = 'none';
}

var cur_nel = null;
var pre_nel = null;
var cur_opt = null;

var post_eo = null;
var post_announce = null;
var post_clip = null;
var post_recent = null;

function set_postobj(opt) {
	switch(opt) {
		case 'eo':
			obj = post_eo;
			break;
		case 'announce':
			obj = post_announce;
			break;
		case 'clip':
			obj = post_clip;
			break;
		case 'recent':
			obj = post_recent;
			break;
	}
	return obj;
}

function view_postlist(obj, opt) {
	switch(opt) {
		case 'eo':
			post_eo = obj;
			break;
		case 'announce':
			post_announce = obj;
			break;
		case 'clip':
			post_clip = obj;
			break;
		case 'recent':
			post_recent = obj;
			break;
	}

	if (cur_opt != opt)
	{
		return;
	}
	var obj = set_postobj(opt);
	set_postlist(cur_nel,obj.item);
}

function cut_string(str, length) {
    var specialset = " `~!@#$%^&*()_+|\\=-[]{};':\",./<>?";
    var valuecount = 0;
    var cutcount = length;
	var valuecount = str.length;
    for( var i = 0; i < str.length; i++ ) {
        thischar = str.charAt( i );
        if( ((thischar >= '0') && (thischar <= '9')) ||
            ((thischar >= 'A') && (thischar <= 'Z')) ||
            ((thischar >= 'a') && (thischar <= 'z')) ||
            ((thischar == '-') || (thischar == '_')) )
            cutcount -= 1;
        else if( thischar == '(' || thischar == ')' ) {
        	cutcount -= 1;
        }
        else if( specialset.indexOf(thischar) != -1 )
            cutcount -= 1;
        else
            cutcount -= 1.5;

		if (cutcount < 0) {
			valuecount = i;
			str = str.substr(0, valuecount) + "...";
			return str;
			break;
		}
    }
	str = str.substr(0, valuecount);

    return str;
}

function set_postlist(obj, item) {
    var tmp = '';
    var time_arr = '';
    obj.innerHTML = tmp;

    var icnt = item.length;

    if(icnt == 2 && item[0].posturl == '') {
        obj.innerHTML += '<span class="loading">업데이트된 글이 없습니다.</span>';
    } else {
        for(i=0; i < icnt; i++) {
            var sbj = item[i].subject;

            if (i != icnt - 1) {
                if (item[i].since.indexOf('분전') == -1 || item[i].since.indexOf('시간전') == -1 || item[i].since.indexOf('지금') == -1) {
                    timeval = item[i].since.split(" ");
                }
                else {
                    timeval[0] = item[i].since;
                }
            }
            var time = '';
            if(item[i].nick) {
                nick = ' by ' + item[i].nick;
            } else {
                nick = '';
            }
            
            if(icnt != 1 && i == 0) {
                sbj = cut_string(sbj, 16);
            } else if(icnt != 1 && i == icnt -1 ) {
                timeval[0] = '';
            } else {
                sbj = cut_string(sbj,18);
            }
        
            if(typeof item[i].since == "undefined"){
                timeval[0] = '';
            }

            var t = '';
            if(i == icnt-1){

                t = '<li class="all"><div><a href="' + item[i].posturl + '" title="마이리더에서 전체보기" onfocus="blur();" >마이리더에서 전체보기</a></div></li>';
                     
            } else if(item[i].posturl == ''){

                t = '<li>';
                t += '<a onfocus="blur();" class="sub_over">' + sbj + '</a>';
                t += '<span class="time">' + timeval[0] + '</span></li>';

            } else {

                t += '<li><a href="'+ item[i].posturl +'" title="'+ item[i].subject + nick +'" class="sub_over" onfocus="blur();"><span class="sub_egloolink_title">' + sbj + '</span>'
                t += '<span class="sub_egloolink_time">' + timeval[0] + '</span></a></li>';		

            }
            obj.innerHTML += t;
        }
    }
}

function nav_msgbox(msg) {
	if (msg) {
		msg = msg + ' <a href="#" onclick="nav_msgbox();">닫기</a>';

		document.getElementById("navmsgbox").show();
		document.getElementById("navmsgbox").update(msg);
	} else {
		document.getElementById("navmsgbox").hide();
		document.getElementById("navmsgbox").update('');
	}
}

function nav_newpost(eid, blogurl, trbsrl, title) {

	var form = document.createElement("form");
	form.method = "post";
	form.action = "http://www.egloos.com/egloo/insert.php?eid=" + eid;

	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "eid";
	input.value = eid;
	form.appendChild(input);

	input = document.createElement("input");
	input.type = "hidden";
	input.name = "title";
	input.value = '<a href="' + window.location.href + '" onfocus="blur();">' + title + '</a>';
	form.appendChild(input);

	if(trbsrl != '') {
		input = document.createElement("input");
		input.type = "hidden";
		input.name = "trburl";
		input.value = 'http://' + blogurl + '.egloos.com/tb/' + trbsrl;
		form.appendChild(input);
	}

	var body = document.getElementsByTagName("body")[0];
	body.appendChild(form);

	form.submit();
}

function nav_myblog(blogurl, usernick) {
	return '<li class="navimyegloo" onmouseover="nav_show(this)" onmouseout="nav_hide(this)"><a href="http://' + blogurl + '.egloos.com/" class="navimyegloo" onfocus="blur();">' + usernick + '<span class="arrow">▼</span></a><ul class="navidropmenu"><li><a href="http://' + blogurl + '.egloos.com/photo" onfocus="blur();">내 포토로그</a></li></ul></li>';
}

function nav_insbookmark(uid, eid, egloourl, egloonm, event){
	InsBookmark(uid, eid, egloourl, egloonm, event);
	var elm = document.getElementById("navi_dropmenu_link");
	if(elm && elm != "undefined"  ){
		elm.style.display = "none";
	}
}

function nav_ajaxexec(url, pars) {
	var myAjax = new Ajax.Request(
		url,
		{
			method: 'post',
			parameters: pars,
			onComplete: nav_responsexml
		});
}

function nav_responsexml(originalRequest) {
	eval(originalRequest.responseText);
}

function nav_jsonexec(url, id) {
	var no_cache = '&no_cache=' + (new Date()).getTime();

	if (document.getElementById(id)) {
		document.getElementsByTagName("head").item(0).removeChild(document.getElementById(id));
	}

	var script_obj = document.createElement("script");
	script_obj.type = "text/javascript";
	script_obj.charset = "utf-8";
	script_obj.src = url + no_cache;
	script_obj.id = id;

	document.getElementsByTagName("head").item(0).appendChild(script_obj);
}


function nav_addlink(userid, blogid, eglooid, egloourl, egloonm, egloosec,photo){
	egloonm = egloonm.replace(/\'/g, '\\\'');
	if (blogid != eglooid && egloosec == 1 && photo == 0) {

        var btnColor = '';
        if (info.navcolor == 'b') {
            btnColor = '_bk';
        }

		var html = '<div class="navi_menu"><a href="#;" onclick="javascript:addlink_show(this,\''+userid+'\')" title="링크하기" onfocus="blur();" class="over">링크하기</a></div>'
		html += '<div id="navi_dropmenu_link" class="navi_dropmenu"  style="position:absolute;top:26px;left:-1px;display:none;">'
		html += '<div class="navi_linkWrap">'
		html += '			이 이글루를 구독하시겠습니까?'
		html += '			<dl class="selectBox">'
		html += '				<dt>그룹 선택</dt>'
		html += '				<dd>'
		html += '	   				<select  id="egloo-bookmark-group" name="sel" style="width:145px;"></select>'
		html += '				</dd>'
		html += '			</dl>'
		html += '			<p>'
		html += '				<img id="btnAddLink" src="http://md.egloos.com/img/nav/btn_add'+btnColor+'.gif" onclick="javascript:layer_init();nav_insbookmark(\''+userid+'\',\'' + eglooid + '\', \'' + egloourl + '\', \'' + egloonm + '\', event);" alt="추가" style="cursor:pointer;cursor:hand;"/>'
		html += '				<img id="btnCancelLink" src="http://md.egloos.com/img/nav/btn_cancel'+btnColor+'.gif" onclick="javascript:addlink_show(this,\''+userid+'\')" alt="취소" style="cursor:pointer;cursor:hand;"/>'
		html += '			</p>'
		html += '		</div>'
		html += '	</div>';

		
	} else {
		var html =  '<div class="navi_menu"><span class="nolinkadd">링크하기</span></div>';
	}	
	return html;
}

function getGroup(userid){
	var exec = '/exec/egloo_bookmark_group.php';
	var selectElm = document.getElementById('egloo-bookmark-group');
	
	new Ajax.Request(exec, {
		parameters: {
			'uid'   : userid
		},
		onSuccess: function(transport) {
				var text = transport.responseText;				
				if (text.isJSON()) {
                   var result = text.evalJSON();
				   if (result.code == '1') {
					   selectElm.options[0] = new Option('그룹선택없음', '000');
					   
                        for(var i=0; i<result.group.length; i++) {
							var group = result.group[i];
                            selectElm.options[i+1] = new Option(group.groupName, group.groupID);
					   }
                       selectElm.options[0].selected = true;
                   }
                   else {
                       alert(result.message);
                   }
               }
               else {
                   alert("일시적인 오류입니다. 잠시 후 다시 이용해주세요.");
                   return false;
               }	
			   			
		}.bind(this),
		onFailure: function(transport) {
			alert('일시적인 오류입니다. 잠시 후 다시 이용해주세요.');
		}
	});
}

function addlink_show(ver,userid){
	var isIE=document.all;
	var up_nel = document.getElementById("navi_dropmenu_link");
	var nel = up_nel.getElementsByTagName('UL')[0];
	var prElm=isIE ? up_nel.parentElement : up_nel.parentNode;
	var titElm = prElm.getElementsByTagName('DIV')[0];	
	if (up_nel.style.display == "none") {
		layer_init('navi_dropmenu_link');
		up_nel.style.display = "block";
		titElm.getElementsByTagName('A')[0].className = "on";
	} else {
		up_nel.style.display = "none";
		document.getElementById('egloo-bookmark-group').options[0].selected = true;
		titElm.getElementsByTagName('A')[0].className = "over";
		return;
	}
	
	getGroup(userid);
	return;
}

function nav_checkpost(blogid, eglooid, egloourl, postsrl,pg,serial,photo) {
	if (blogid != eglooid && photo == 0 ) {

        var btnColor = '';
        if (info.navcolor == 'b') {
            btnColor = '_bk';
        }

		var html = '<div class="navi_menu"><a href="#;" onclick="javascript:checkpost_show(this,\''+eglooid+'\',\''+pg+'\',\''+ serial +'\')" title="메모하기" onfocus="blur();" class="over">메모하기</a></div>'
		html += '<div id="navi_dropmenu_checkpost" class="navi_dropmenu" style="position:absolute;top:26px;left:-1px;display:none;">'
		html += '		<div class="navi_linkWrap">'
		html += '			포스트를 메모포스트에 저장하시겠습니까?'
		html += '			<dl class="selectBox">'
		html += '				<dt>포스트 선택</dt>'
		if(serial){
			html += '				<dd class="select"><span class="txt">:</span><span id="s_post_tit" class="s_post_tit" title=""></span></dd>'
		} else {
			html += '				<dd>'
			html += '	   				<select id="egloo-check-post-list" name="sel_cp" style="width:145px;" ></select>'
			html += '				</dd>'
		}
       	html += '			<dd class="memo"><textarea id="egloo-check-post-memo" col="1" row="1" onfocus="if(this.value==checkPostMemoDefault){this.value=\'\';}" onblur="if(this.value==\'\') {this.value=checkPostMemoDefault;}">'+checkPostMemoDefault+'</textarea></dd>'
		html += '			</dl>'	
		html += '			<p>'			
		html += '				<img id="btnAddCheckpost" src="http://md.egloos.com/img/nav/btn_add'+btnColor+'.gif" onclick="javascript:layer_init();nav_insclippost(\'' + eglooid + '\',\'' + egloourl + '\',\'' + postsrl + '\'); return false;" alt="추가" style="cursor:pointer;cursor:hand;"/>'
		html += '				<img id="btnCancelCheckpost" onclick="javascript:checkpost_show(this,\''+eglooid+'\',\''+pg+'\',\''+ serial +'\')" src="http://md.egloos.com/img/nav/btn_cancel'+btnColor+'.gif" alt="취소" style="cursor:pointer;cursor:hand;"/>'
		html += '			</p>'
		html += '		</div>'
		html += '	</div>'

	} else {		
		var html = '<div class="navi_menu" ><span class="nocheckpost">메모하기</span></div>';
	}
	return html;
}

function nav_sharebtn(blogid, eglooid, egloourl, egloonm ,encegloonm, egloonick, postsrl, posttitle, postnick, encposttitle, encpostsummary, photo, adm) {

    var html = '';

    if (photo == 0 && adm == 0) {
        var g_url = 'http://'+egloourl+'.egloos.com/';
        var g_title = '';
        var g_enctitle = '';
        var g_thumbnail = '';
        var g_summary = '';
        var g_writer = '';

        if (postsrl != '') {
            //퍼머링크
            g_url += postsrl;
            g_url = encodeURIComponent(g_url);
            g_title = encodeURIComponent(posttitle.replace(/'/g, ""));
            g_enctitle = encodeURIComponent(encposttitle);
            g_summary = encodeURIComponent(encpostsummary);
            g_writer = encodeURIComponent(postnick.replace(/'/g, "")+' (이글루스)');
        } else {    
            //블로그메인
            g_url = encodeURIComponent(g_url);
            g_title = encodeURIComponent(egloonm.replace(/'/g, ""));
            g_enctitle = encodeURIComponent(encegloonm);
            g_writer = encodeURIComponent(egloonick.replace(/'/g, "")+' (이글루스)');
        }
        html += '<div class="navi_menu">';
        html += '    <a href="#;" onclick="sharebtn_show();" title="공유하기" onfocus="blur();" class="over">공유하기</a>';
        html += '</div>';
        html += '<div id="navi_dropmenu_sharebtn" class="navi_dropmenu" style="position: absolute; top: 26px; left: -1px; display: none;">';
        html += '    <ul class="sub_list sub_share">';
        html += '        <li class="li_shareicon"><a href="#;" class="sub_over" onclick="window.open(\'http://csp.cyworld.com/bi/bi_recommend_pop.php?svccode=250&url='+g_url+'&title='+g_enctitle+'&thumbnail='+g_thumbnail+'&summary='+g_summary+'&writer='+g_writer+'\', \'recom_icon_pop\', \'width=400,height=364,scrollbars=no,resizable=no\');" title="싸이월드 공감"><img src="http://csp.cyworld.com/images/ico_clog.gif" alt="싸이월드 공감"> 싸이월드 공감</a></li>';
        html += '        <li class="li_shareicon"><a href="#;" class="sub_over" onclick="window.open(\'http://twitter.com/share?url='+g_url+'&text='+g_title+'\',\'sharer\',\'toolbar=0,status=0,resizable=1,width=626,height=436\');" title="트위터" class="sub_over"><img src="http://md.egloos.com/img/icon/icon_twitter.gif" alt="트위터" /> 트위터</a></li>';
        html += '        <li class="li_shareicon"><a href="#;" class="sub_over" onclick="window.open(\'http://www.facebook.com/sharer.php?u='+g_url+'&t='+g_title+'\',\'sharer\',\'toolbar=0,status=0,resizable=1,width=626,height=436\');" title="페이스북" class="sub_over"><img src="http://md.egloos.com/img/icon/icon_facebook.gif" alt="페이스북" /> 페이스북</a></li>';
        html += '    </ul>';
        html += '</div>';
    } else {
		html = '<div class="navi_menu" ><span class="nosharebtn">공유하기</span></div>';
    }
	return html;
}

function sharebtn_show( ) {
	var isIE=document.all;
	var up_nel = document.getElementById("navi_dropmenu_sharebtn");
	var prElm=isIE ? up_nel.parentElement : up_nel.parentNode;
	var titElm = prElm.getElementsByTagName('DIV')[0];

	if(up_nel.style.display == "none"){
		layer_init('navi_dropmenu_sharebtn');
		up_nel.style.display = "block";
		titElm.getElementsByTagName('A')[0].className = "on";
	} else {
		up_nel.style.display = "none";
		titElm.getElementsByTagName('A')[0].className = "over";
		return;
	}
}


function nav_insclippost(eid, blogurl,serial){
   	if(serial == '') {
		var selectElm = document.getElementById('egloo-check-post-list');
		selected_serial = selectElm.options[ selectElm.selectedIndex ].value;
		serial = selected_serial;
	}

    var memo = document.getElementById('egloo-check-post-memo').value;
    if (memo == checkPostMemoDefault) {
        memo = '';
    }
    if (getStrBytes(memo) > 200) {
        alert('메모는 영문 기준 200자를 넘을 수 없습니다.');
        return;
    }

	InsClipPost(eid, blogurl, serial, memo);
}
function checkpost_show(ver,eglooid,pg,serial){
	var isIE=document.all;
	var up_nel = document.getElementById("navi_dropmenu_checkpost");
	var nel = up_nel.getElementsByTagName('UL')[0];
	var prElm=isIE ? up_nel.parentElement : up_nel.parentNode;
	var titElm = prElm.getElementsByTagName('DIV')[0];
	var sel = document.getElementById('egloo-check-post-list');
	if(up_nel.style.display == "none"){
		layer_init('navi_dropmenu_checkpost');
		up_nel.style.display = "block";
		getpostlist(eglooid,pg,serial);
		titElm.getElementsByTagName('A')[0].className = "on";
	} else {
		up_nel.style.display = "none";
		titElm.getElementsByTagName('A')[0].className = "over";
		if(sel !== null && sel.options.length > 0){
			sel.options[0].selected = true;
		}	
		return;
	}
}

function getpostlist(eglooid,pg,serial){
	var exec = '/exec/egloo_clippost_list.php';
	var selectElm = document.getElementById('egloo-check-post-list');
	var option_str = '';
	new Ajax.Request(exec, {
		parameters: {
			'eid'   : eglooid,
			'pg'    : pg,
			'serial'    : serial
		},
		onSuccess: function(transport) {
				var text = transport.responseText;
				if (text.isJSON()) {
                   var result = text.evalJSON();
				   if (result.code == '1') {
						for(var i=0; i<result.list.length; i++) {
							var list = result.list[i];
							list.subject = cut_string(list.subject, 18);
						
							if (selectElm !== null) {
								selectElm.options[i] = new Option(list.subject, list.serial);
							}
							if (serial) {
								if (navigator.userAgent.indexOf("Firefox") > -1) {
									document.getElementById("s_post_tit").innerHTML = list.subject;
								}
								else {
									document.getElementById("s_post_tit").innerText = list.subject;
								}
							}
						}
					    if (selectElm !== null) {
					   		selectElm.options[0].selected = true;
					    }
                   }
                   else {
                       alert(result.message);
                   }
               }
               else {
                   alert("일시적인 오류입니다. 잠시 후 다시 이용해주세요.");
                   return false;
               }		
		}.bind(this),
		onFailure: function(transport) {
			alert('이글루링크 새글읽기의 일시적인 오류입니다.');
		}
	});	
}

function selecting(){
	document.getElementById(navibar).style.display = "block";
}

function nav_updatepostlist(egloourl){

	var html = '<div class="navi_menu"><a href="#;" onclick = "nav_show(  \'recent\', \'' + egloourl + '\');" title="이글루링크 새글" onfocus="blur();" class="over">이글루링크 새글</a></div>'
		html += '<div id="navi_dropmenu_updatepost" class="navi_dropmenu" style="position:absolute;top:26px;left:-1px;display:none;">'
		html += '<ul class="sub_list sub_egloolink">';
		html += '</ul>';
		html += '</div>';
		return html;		
}

function nav_checkpostlist(eid, egloourl) {
	if (eid)
		return '<li class="navilist" onmouseover="nav_show(this, \'clip\', \'' + eid + '\', \'' + egloourl + '\')" onmouseout="nav_hide(this)"><a href="#" class="navilist_checkpost" onfocus="blur();">체크포스트<img src="http://md.egloos.com/img/eg/nav/icon_down.gif" alt="" border="0" class="arrow" /></a><ul class="navidroplist"></ul></li>';
	else
		return '<li class="navilist"><a href="#" class="navilist_checkpost" onfocus="blur();">체크포스트<img src="http://md.egloos.com/img/eg/nav/icon_down.gif" alt="" border="0" class="arrow" /></a><ul class="navidroplist"></ul></li>';
}

function nav_cmtpostlist(eid, egloourl) {
	if (eid)
		return '<li class="navilist" onmouseover="nav_show(this, \'announce\', \'' + eid + '\', \'' + egloourl + '\')" onmouseout="nav_hide(this)"><a href="#" class="navilist_myvalley" onfocus="blur();">업데이트알림<img src="http://md.egloos.com/img/eg/nav/icon_down.gif" alt="" border="0" class="arrow" /></a><ul class="navidroplist"></ul></li>';
	else
		return '<li class="navilist"><a href="#" class="navilist_myvalley" onfocus="blur();">업데이트알림<img src="http://md.egloos.com/img/eg/nav/icon_down.gif" alt="" border="0" class="arrow" /></a><ul class="navidroplist"></ul></li>';
}

function nav_randompost() {
	return '<li class="navilist"><a href="http://www.egloos.com/egloo_destiny.php" class="navilist_random" onfocus="blur();">랜덤이글루</a></li>';
}

function admin_layer(elm){
	var isIE=document.all;
	var up_nel = document.getElementById(elm.id);
	var dropmenuid = elm.id+'_sub';
	var nel = document.getElementById(dropmenuid);

	if (nel.style.display == "none") {
		nel.style.display = "block";
		elm.getElementsByTagName('A')[0].className = "on";
	} else {
		nel.style.display = "none";
		elm.getElementsByTagName('A')[0].className = "on";
	}
}

function nav_config(set){
	if (set == 1) {
		var cfg_color = document.getElementById('nav_config_sub');
		cfg_color.style.display = "block";
	} else if (set == 2) {
		var cfg_color = document.getElementById('nav_config_sub');
		cfg_color.style.display = "none";
	}
}

var shortcut_flag = null;

function shortcut_show(elm,eglooid){
	var isIE=document.all;
	layer_init('nav_shortcut_sub');
	var up_nel = document.getElementById(elm.id);
	var dropmenuid = elm.id+'_sub';
	var nel = document.getElementById(dropmenuid);
	var prElm=isIE ? up_nel.parentElement : up_nel.parentNode;
	var titElm = prElm.getElementsByTagName('DIV')[3];	
		
	if (nel.style.display == "none") {
		nel.style.display = "block";
		titElm.getElementsByTagName('A')[0].className = "on";
		if(shortcut_flag === null){
			getshortcutlist(eglooid);
			shortcut_flag ='1';	
		}
	} else {
		nel.style.display = "none";
		titElm.getElementsByTagName('A')[0].className = "over";
	}
}

function getshortcutlist(eglooid){
	var exec = '/exec/egloo_shortcut_list.php';
	var subElm = document.getElementById('nav_shortcut_sub');
	var nel = subElm.getElementsByTagName('UL')[0];
		
	var title	= '';
	var link	= '';
	var cont	= '';
	
	if(shortcut_flag == 1) return;
	new Ajax.Request(exec, {
		parameters: {
			'eid'   : eglooid
		},
		onSuccess: function(transport) {
				var text = transport.responseText;
				if (text.isJSON()) {
                   var result = text.evalJSON();
				   if (result.code == '1') {
						cont = nel.innerHTML;
						if(result.list.length != 0){
							for(var i=0; i<result.list.length; i++) {
								title = result.list[i].title;
								link = result.list[i].link;
								var index = link.indexOf('eid=');
	            				if (index != -1 ) {
									link += eglooid;
								}
								if(title != ''){
                                    var target = '';
                                    if(link.indexOf("valley") >= 0 || link.indexOf("support.php") >= 0 ) {
                                        target = ' target="_blank"';
                                    }
									cont += '<li ><a href="' + link + '" title="'+title+'" class="sub_over"'+ target +'>' + title + '</a></li>';
								}
						   }
						}
					   cont += '<li class="all"><div><a href="http://admin.egloos.com/blog/option/etc/navi" title="바로가기 직접설정" >바로가기 직접설정</a></div></li>';
					            
					   nel.innerHTML = cont;
					   shortcut_flag = 1 ;
                   }
                   else {
                       alert(result.message);
                   }
				   
               } else {
                   alert("일시적인 오류입니다. 잠시 후 다시 이용해주세요.");
                   return false;
               }		
		}.bind(this),
		onFailure: function(transport) {
			alert('바로가기 읽기를 실패 했습니다.');
		}
	});	
	
}

function nav_admin(info){

    var rtn = '';

    rtn += '<li id="nav_nick" class="nick" onmouseover="admin_layer(this);" onmouseout="layer_init(\'\');">'
	    + '		<div class="navi_menu"><a href="#;" title="" class="over" onfocus="blur();"><span class="e_nick"><img src="http://profile.egloos.net/' + info.blogid + '.ico" width="16" height="16" alt="" /></span><span class="navi_nickname">'+info.usernick+'</span></a></div>'
		+ '		<div id="nav_nick_sub" class="navi_dropmenu" style="display:none;position:absolute;top:26px;left:0px;">'
	    + '			<ul class="sub_list sub_nick">';
    if (info.egl > 0) {

	    rtn += '				<li><a href="http://' + info.blogurl + '.egloos.com/" title="" class="sub_over" onfocus="blur();">내이글루</a></li>'
			+ '				<li><a href="http://' + info.blogurl + '.egloos.com/photo" title="" class="sub_over" onfocus="blur();">내포토로그</a></li>';
    }

	rtn += '				<li><a href="http://valley.egloos.com/my/index.php" title="" class="sub_over" onfocus="blur();">마이리더</a></li>'
		+ '			</ul>'
		+ '		</div>'
		+ '</li>';

    if (info.egl > 0) {

        rtn += '<li id="nav_newpost" class="newpost"><div class="navi_menu"><a href="http://www.egloos.com/egloo/insert.php?eid=' + info.blogid + '" title="새글쓰기" onfocus="blur();">새글쓰기</a></div></li>';
    
    	rtn += '<li id="nav_shortcut" class="shortcut" onmouseover="shortcut_show(this,\'' + info.blogid + '\');" onmouseout="layer_init(\'\');" >'
    		+ '	<div class="navi_menu"><a href="#;" title="바로가기" class="over" onfocus="blur();">바로가기</a></div>'
    		+ '	<div id="nav_shortcut_sub" class="navi_dropmenu" style="display:none;position:absolute;top:26px;left:-1px;">'
    		+ '	<ul  class="sub_list sub_shortcut">'
    		+ '        <li><a href="http://admin.egloos.com/" title="이글루관리" class="sub_over" onfocus="blur();">이글루관리</a></li>';
        if (navigator.userAgent.indexOf('iPad') > -1) {
         	rtn	+='        <li><a href="javascript:alert(\'스킨에디터가 지원되지 않는 환경입니다.\');" title="스킨에디터" class="sub_over" onfocus="blur();">스킨에디터</a></li>';
        } else {
        	rtn	+='        <li><a href="http://www.egloos.com/adm/design/skin_editor/?eid=' + info.blogid + '&tab=template,1" title="스킨에디터" class="sub_over" onfocus="blur();">스킨에디터</a></li>';
        }
    	rtn	+='        <li><a href="http://admin.egloos.com/stat/dashboard" title="이글루통계" class="sub_over" onfocus="blur();">이글루통계</a></li>'
    		+ '		<li class="line"><div></div></li>'
    		+ '	</ul>'
    		+ '</div>'
    		+ '</li>';
    }
	var rtnurl = encodeURIComponent(location.href);

	rtn += '<li class="loginout"><div class="navi_menu"><a href="https://sec.egloos.com/logout.php?rtnurl='+rtnurl+'" title="로그아웃" onfocus="blur();">로그아웃</a></div></li>';
			
	rtn += '<li id="nav_admin_on" class="admin" onmouseover="admin_layer(this);" onmouseout="layer_init(\'\');">'
		+ '<div class="navi_menu"><a href="#;" title="네비바설정" class="over" onfocus="blur();">네비바설정</a></div>'
		+ '<div id="nav_admin_on_sub" class="navi_dropmenu" style="display:none;position:absolute;top:26px;left:-81px;">'
		+ '	<ul class="sub_list sub_admin">';
	if (info.navstatic == 0) {
		rtn += '	<li id="nav_fix" onclick="nav_admin_change(\'nav_fix\',\'1\');"><a href="#"  title="브라우저에 고정" class="sub_over" onfocus="blur();"><span class="check">브라우저에 고정</span></a></li>';
	} else {
		rtn += '	<li id="nav_fix" onclick="nav_admin_change(\'nav_fix\',\'0\');"><a href="#"  title="브라우저에 고정" class="sub_over" onfocus="blur();"><span class="check check_on">브라우저에 고정</span></a></li>';
	}
	
	if (navigator.userAgent.indexOf('iPad') == -1) {
        if (info.viewopt == 0) {
            rtn += '	<li id="nav_hidden" onclick="nav_admin_change(\'nav_hidden\',\'1\');" ><a href="#" title="자동숨기기" class="sub_over" onfocus="blur();"><span class="check check_on">자동숨기기</span></a></li>';
        } else {
            rtn += '	<li id="nav_hidden" onclick="nav_admin_change(\'nav_hidden\',\'0\');" ><a href="#" title="자동숨기기" class="sub_over" onfocus="blur();"><span class="check">자동숨기기</span></a></li>';
        }
    }
	rtn += '	<li onmouseover="nav_config(1);" onmouseout="nav_config(2);">'
	    + '			<a href="#" title="네비바 색상변경" class="sub sub_over" onfocus="blur();"><span class="check">네비바 색상변경</span></a>'
		+ '			<div id="nav_config_sub"  class="navi_dropmenu2" style="display:none;position:absolute;top:0px;left:-63px;">'
		+ '				<ul id= "nav_color" class="sub_list sub_admin2">';
			
	if (info.navcolor == 'w') {
		rtn += '		<li id="nav_white" onclick="nav_admin_change(\'color\',\'W\');" ><a href="#;" title="화이트" class="sub_over" onfocus="blur();"><span class="check check_on">화이트</span></a></li>';
	} else {
		rtn += '		<li id="nav_white" onclick="nav_admin_change(\'color\',\'W\');" ><a href="#;" title="화이트" class="sub_over" onfocus="blur();"><span class="check">화이트</span></a></li>';
	}
	if (info.navcolor == 'g') {
		rtn += '		<li id="nav_gray" onclick="nav_admin_change(\'color\',\'G\');" ><a href="#;" title="그레이" class="sub_over" onfocus="blur();"><span class="check check_on">그레이</span></a></li>';
	} else {
		rtn += '		<li id="nav_gray" onclick="nav_admin_change(\'color\',\'G\');" ><a href="#;" title="그레이" class="sub_over" onfocus="blur();"><span class="check">그레이</span></a></li>';
	}
	if (info.navcolor == 'b') {
		rtn += '		<li id="nav_black" onclick="nav_admin_change(\'color\',\'B\');" ><a href="#;" title="블랙" class="sub_over" onfocus="blur();"><span class="check check_on">블랙</span></a></li>';
	} else {
		rtn += '		<li id="nav_black" onclick="nav_admin_change(\'color\',\'B\');" ><a href="#;" title="블랙" class="sub_over" onfocus="blur();"><span class="check">블랙</span></a></li>';	
	}
	rtn += '		</ul>'
		+ '			</div>'
		+ '		</li>'
		+ '	</ul>'
		+ '</div>'
    	+ '</li>';
		
	return rtn;
}


function nav_admin_change(id,set){
	if (info.navstatic == 'undefined') info.navstatic = 1;
	if (info.viewopt   == 'undefined') info.viewopt  = 0;
	if (info.navcolor  == 'undefined') info.navcolor = "w";
	if (id == 'nav_fix') {
		info.navstatic = set;
		if (set == 1) {
			document.getElementById('nav_fix').getElementsByTagName('SPAN')[0].className = "check check_on";
			document.getElementById('nav_fix').onclick = function () { nav_admin_change('nav_fix','0') }
		} else {
			if(document.getElementById('nav_hidden').getElementsByTagName('SPAN')[0].className == "check check_on"){ alert("'자동숨김' 상태에서는 '브라우저에 고정'을 풀 수 없습니다."); return;}
			document.getElementById('nav_fix').getElementsByTagName('SPAN')[0].className = "check";
			document.getElementById('nav_fix').onclick = function () { nav_admin_change('nav_fix','1') }
		}
	}
	
	if (id == 'nav_hidden') {
		info.viewopt = set;
		if (set == 0) {
			document.getElementById('nav_fix').getElementsByTagName('SPAN')[0].className = "check check_on";
			document.getElementById('nav_fix').onclick = function () { nav_admin_change('nav_fix','0') }
			document.getElementById('nav_hidden').getElementsByTagName('SPAN')[0].className = "check check_on";
			document.getElementById('nav_hidden').onclick = function () { nav_admin_change('nav_hidden','1') }
			document.getElementById('navbar_space').style.display = 'none';
		} else {
			document.getElementById('nav_hidden').getElementsByTagName('SPAN')[0].className = "check";
			document.getElementById('nav_hidden').onclick = function () { nav_admin_change('nav_hidden','0') }
			info.navstatic = 1;
			document.getElementById('navbar_space').style.display = 'block';

		}
	} 
	
	if(id == 'color'){
		var color_obj = document.getElementById('nav_color').getElementsByTagName('LI');
		var color_len = document.getElementById('nav_color').getElementsByTagName('LI').length;
		set = set.toLowerCase();
		if(set == 'w') { var ck = 0; document.getElementById('navibar').className=""; }
		if(set == 'g') { var ck = 1; document.getElementById('navibar').className="black gray"; }
		if(set == 'b') { var ck = 2; document.getElementById('navibar').className="black"; }
		for(var i=0; i< color_len; i++){
			if (ck == i) {
				info.navcolor = set;
				color_obj[i].getElementsByTagName('SPAN')[0].className = "check check_on";
			} else {
				color_obj[i].getElementsByTagName('SPAN')[0].className = "check";
			}
		}

        if (set == 'b') {
            if(document.getElementById('btnAddLink')) {
                document.getElementById('btnAddLink').src = 'http://md.egloos.com/img/nav/btn_add_bk.gif';
                document.getElementById('btnCancelLink').src = 'http://md.egloos.com/img/nav/btn_cancel_bk.gif';
            }
            if (document.getElementById('btnAddCheckpost')) {
                document.getElementById('btnAddCheckpost').src = 'http://md.egloos.com/img/nav/btn_add_bk.gif';
                document.getElementById('btnCancelCheckpost').src = 'http://md.egloos.com/img/nav/btn_cancel_bk.gif';
            }
        } else {
            if(document.getElementById('btnAddLink')) {
                document.getElementById('btnAddLink').src = 'http://md.egloos.com/img/nav/btn_add.gif';
                document.getElementById('btnCancelLink').src = 'http://md.egloos.com/img/nav/btn_cancel.gif';
            }
            if (document.getElementById('btnAddCheckpost')) {
                document.getElementById('btnAddCheckpost').src = 'http://md.egloos.com/img/nav/btn_add.gif';
                document.getElementById('btnCancelCheckpost').src = 'http://md.egloos.com/img/nav/btn_cancel.gif';
            }
        }   
	}
	var url   = 'http://ap.egloos.com/exec/egloo_nav_exec.php?eid=' + info.blogid + '&opt=' + info.viewopt + '&stc=' + info.navstatic + '&clr=' + info.navcolor + '&xhtml=' + info.xhtml;
	nav_jsonexec(url,'navbar_viewoptchange');
	layer_init('');
}
function nav_view(ckopt,navstatic,viewopt,navcolor,xhtml,e){

	var isIE=document.all;
	var nav_class = '';
	var nav_hidden_class = '';
	
	// hid & event on select box => not close div 
	if (e != null) {
		var eventSource = (window.event) ? e.srcElement : e.target;
		if (e.type == "mouseout" && eventSource.nodeName != "DIV" && (eventSource.id == "egloo-check-post-list" || eventSource.id == "egloo-bookmark-group")) {
			return; 
		}
	}
	// hid & static 
	if(info.viewopt == 1 && ckopt == 'hid') return;
	
	if (navstatic == '1') {
        if ((isIE && xhtml === '0') || (isIE && versionMinor < 7)) {
            try {
                document.getElementById("navibar").style.setExpression("top", "( + ( nav_top = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ) ) + \'px\'");
            } catch(e) {
                //alert('1:'+e);
            }

			nav_class = "";
			nav_hidden_class = "";
        } else {
			nav_class = "static";
			nav_hidden_class = "static";
        }
	} else {
		nav_class = "";
		nav_hidden_class = "";
        if ((isIE && xhtml === '0') || (isIE && versionMinor < 7)) {
            try {
                document.getElementById("navibar").style.setExpression("top", "0");
            } catch(e) {
                //alert('2:'+e);
            }
        }
	}
	
	if(viewopt == '1'){
		document.getElementById("navibar").style.display="block";
		nav_hidden_class = "";
		document.getElementById("navibar_hiddenlayer").style.display="none";
	} else {
		document.getElementById("navibar").style.display="none";
		document.getElementById("navibar_hiddenlayer").style.display="block";
		nav_class = "static";
		nav_hidden_class = "static";
	}
	
	navcolor = navcolor.toLowerCase();
	if(ckopt == 'hid') navcolor = info.navcolor.toLowerCase();
	if(navcolor == 'g'){
		nav_class += " black gray";
	} else if(navcolor == 'b'){
		nav_class += " black";
	} else {
		nav_class += "";
	}
	
	document.getElementById("navibar").className = nav_class;
	document.getElementById("navibar_hiddenlayer").className = nav_hidden_class;
}

function nav_beta() {
	return '<div class="beta" style="position:absolute;top:0;left:40%;width:91px;height:23px;background:url(http://md.egloos.com/img/eg/nav/beta.gif) top no-repeat;z-index:100000;"></div>';
}

function class_init(obj,classname){
	var isIE=document.all;
	var prElm=isIE ? obj.parentElement : obj.parentNode;
	var titElm = prElm.getElementsByTagName('DIV')[0];
	titElm.getElementsByTagName('A')[0].className = "over";
}

function layer_init(layername){
	var up_nel;
	
	if(document.getElementById("nav_config_sub")){
		document.getElementById("nav_config_sub").style.display = "none";
	}
	if(layername != 'navi_dropmenu_updatepost'){
		up_nel = document.getElementById("navi_dropmenu_updatepost");
		if (up_nel != null) {
			up_nel.style.display = "none";
			class_init(up_nel);
		}
	}
	if(layername != 'navi_dropmenu_link'){
		up_nel = document.getElementById("navi_dropmenu_link");
		if (up_nel != null) {
			up_nel.style.display = "none";
			class_init(up_nel);

		}
	}
	if(layername != 'navi_dropmenu_checkpost'){
		up_nel = document.getElementById("navi_dropmenu_checkpost");
		if (up_nel != null) {
			up_nel.style.display = "none";
			class_init(up_nel);
		}
	}
    if(layername != 'navi_dropmenu_sharebtn'){
        up_nel = document.getElementById("navi_dropmenu_sharebtn");
        if (up_nel != null) {
            up_nel.style.display = "none";
            class_init(up_nel);
        }
    }

	if(layername != 'nav_nick_sub'){
		if (document.getElementById("nav_nick_sub") != null) {
			document.getElementById("nav_nick_sub").style.display = "none";
			class_init(document.getElementById("nav_nick_sub"));
		}
	}		
	if(layername != 'nav_shortcut_sub'){
		if (document.getElementById("nav_shortcut_sub") != null) {
			document.getElementById("nav_shortcut_sub").style.display = "none";
			class_init(document.getElementById("nav_shortcut_sub"));
		}
	}		
	if(layername != 'nav_admin_on_sub'){
		if (document.getElementById("nav_admin_on_sub") != null) {
			document.getElementById("nav_admin_on_sub").style.display = "none";
			class_init(document.getElementById("nav_admin_on_sub"));
		}
	}	
}

function announce_click(){
	InsAnnounceSet();
}
// This stops the javascript from hiding -->
