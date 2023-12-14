<!-- Begin to hide script contents from old browsers.
var appVersionLower = navigator.appVersion.toLowerCase();
var iePos = appVersionLower.indexOf('msie');
if( iePos != -1 ) {
    versionMinor = parseFloat( appVersionLower.substring(iePos+5, appVersionLower.indexOf(';',iePos)) );
    versionMajor = parseInt( versionMinor );
} else {
	versionMajor = parseInt( navigator.appVersion );
	versionMinor = parseFloat( navigator.appVersion );
}

var NS   = (navigator.appName == "Netscape") ? (true) : (false);
var NS4  = (NS && (versionMajor >= 4)) ? (true) : (false);
var IE   = (navigator.appName == "Microsoft Internet Explorer") ? (true) : (false);
var IE4  = (IE && (versionMajor >= 4)) ? (true) : (false);
var IE5  = (document.all && document.getElementById) ? true : false;
var IE50 = (IE && versionMinor <= 5.9);
var IE55 = (IE && versionMinor >= 5.5);
var IE7  = (IE && versionMinor >= 7);
var FF = navigator.userAgent.indexOf('Firefox') >= 0;
var MAC  = navigator.appVersion.indexOf("Macintosh") != -1;
var Safari = navigator.userAgent.indexOf('Safari') >= 0;
var Opera = navigator.userAgent.indexOf('Opera') >= 0;
var Opera8  = (Opera && (versionMajor >= 8)) ? (true) : (false);
var Opera9  = (Opera && (versionMajor >= 9)) ? (true) : (false);

function ap_getwinparam( winw, winh, adjust, resizable, scrollable, status )
{
    var left, top;
    switch( adjust ) {
	case 1: //top left aligned
		left = top = 0;
		break;
	case 2: //top right aligned
		left = window.screen.availWidth - winw;
		top = 0;
		break;
	case 3: //centered
		left = (window.screen.availWidth - winw) / 2;
		top = (window.screen.availHeight - winh) / 2;
		break;
	case 4: //bottom left aligned
		left = 0;
		top = window.screen.availHeight - winh;
		break;
	case 5: //bottom right aligned
		left = window.screen.availWidth - winw - 8;
		top = window.screen.availHeight - winh;
		break;
    }
    var option = "";
    if( adjust > 0 ) option = "left=" + left + ",top=" + top;
    option = option + ",width=" + winw + ",height=" + winh;
    if( (!resizable) || (resizable == false) )
        option += ",resizable=no";
    else
        option += ",resizable=yes";
    if( (!scrollable) || (scrollable == false) )
        option += ",scrollbars=no";
    else
        option += ",scrollbars=yes";
    if( (!status) || (status == false) )
        option += ",status=no";
    else
        option += ",status=yes";
    param = "toolbar=no," + option + ",directories=no,menubar=no";
    return( param );
}

function ap_openwin( winurl, winnm, winw, winh, adjust, resizable, scrollable, status )
{
	var param = ap_getwinparam( winw, winh, adjust, resizable, scrollable, status );
    newwin = window.open( winurl, winnm, param );
    return( newwin );
}

function ap_strlen( thisvalue, specialset )
{
    var byte1count = 0, byte2count = 0;
    for( var i = 0; i < thisvalue.length; i++ ) {
        thischar = thisvalue.charAt( i );
        if( ((thischar >= '0') && (thischar <= '9')) ||
            ((thischar >= 'A') && (thischar <= 'Z')) ||
            ((thischar >= 'a') && (thischar <= 'z')) ||
            ((thischar == '-') || (thischar == '_')) )
            byte1count++;
        else if( thischar == '(' || thischar == ')' ) {
        	byte1count++;
        }
        else if( specialset != null && specialset.indexOf(thischar) != -1 )
            byte1count++;
        else
            byte2count++;
    }
    return( byte1count + byte2count * 2 );
}

function ap_validfile( ctrl, minimum, maximum )
{

	var exactcount = 0;
	var specialswithspace = "`!@#$%^&*+|=[];\'\",<>?/:|";
	if( (minimum > -1) && (static_isnothing(ctrl)) ) {
        alert( "값이 반드시 있어야 하는 항목이 비어 있습니다." );
		return( false );
	}
	if ( !static_isnothing(ctrl)) {
		var pathvalue = ctrl.value;
		var fileidx = pathvalue.lastIndexOf("\\");

		if ( fileidx < 0 )
			var fileidx = pathvalue.lastIndexOf("/");
		if ( fileidx > 0 || (pathvalue != "" && Opera8) || (pathvalue != "" && IE7)) {
			if ( Opera8 || IE7)
				var thisvalue = pathvalue;
			else
				var thisvalue = pathvalue.substring(fileidx + 1);

			var thisvalue = pathvalue.substring(fileidx + 1);
			for( var i = 0; i < thisvalue.length; i++ ) {
				thischar = thisvalue.charAt( i );
				if( specialswithspace.indexOf(thischar) != -1 ) {
					alert( "파일명에 특수문자가 포함되어 있습니다.\n`!@#$%^&*+|=[];\'\",<>?/:| 문자는 사용하실 수 없습니다.\n" );
					ctrl.focus();
					return( false );
				}
				if( thischar == "­" ) {
					alert( "파일명에 특수문자나 보이지 않는 문자는 사용하실 수 없습니다." );
					ctrl.focus();
					return( false );
				}
			}
			exactcount = ap_strlen( ctrl.value, specialswithspace );
			if( (minimum > -1) && (exactcount < minimum) ) {
		        alert( "파일 경로의 길이는 최소 " + minimum + "자 이상이어야 합니다. 현재 (" + exactcount + ")자 입니다." );
				ctrl.focus();
				return( false );
			}
			if( (maximum > -1) && (exactcount > maximum) ) {
		        alert( "파일 경로의 길이는 최대 " + maximum + "자 이하이어야 합니다. 현재 (" + exactcount + ")자 입니다." );
				ctrl.focus();
				return( false );
			}

		    var extidx = pathvalue.lastIndexOf(".");
		    var ext = pathvalue.substring(extidx+1).toLowerCase();

		    if((ext != "jpg") && (ext != "jpe") && (ext != "jpeg") && (ext != "gif") && (ext != "png")) {
		        alert("jpg,gif,png 형식의 이미지만 업로드 가능합니다.");
		        return ( false );
		    }

		}
		else {
			alert("파일명이 올바르지 않습니다.");
			return ( false );
		}
	}
	return( true );
}

function ap_validfileplus( ctrl, minimum, maximum )
{
	var exactcount = 0;
	var specialswithspace = "`!@#$%^&*+|=[];\'\",<>?/:|";
	if( (minimum > -1) && (static_isnothing(ctrl)) ) {
        alert( "값이 반드시 있어야 하는 항목이 비어 있습니다." );
		return( false );
	}
	if ( !static_isnothing(ctrl)) {
		var pathvalue = ctrl.value;
		var fileidx = pathvalue.lastIndexOf("\\");

		if ( fileidx < 0 )
			var fileidx = pathvalue.lastIndexOf("/");
		if ( fileidx > 0 || (pathvalue != "" && Opera8) || (pathvalue != "" && IE7)) {
			if ( Opera8 || IE7)
				var thisvalue = pathvalue;
			else
				var thisvalue = pathvalue.substring(fileidx + 1);
			var thisvalue = pathvalue.substring(fileidx + 1);
			for( var i = 0; i < thisvalue.length; i++ ) {
				thischar = thisvalue.charAt( i );
				if( specialswithspace.indexOf(thischar) != -1 ) {
					alert( "파일명에 특수문자가 포함되어 있습니다.\n`!@#$%^&*+|=[];\'\",<>?/:| 문자는 사용하실 수 없습니다.\n" );
					ctrl.focus();
					return( false );
				}
				if( thischar == "­" ) {
					alert( "파일명에 특수문자나 보이지 않는 문자는 사용하실 수 없습니다." );
					ctrl.focus();
					return( false );
				}
			}
			exactcount = ap_strlen( ctrl.value, specialswithspace );
			if( (minimum > -1) && (exactcount < minimum) ) {
		        alert( "파일 경로의 길이는 최소 " + minimum + "자 이상이어야 합니다. 현재 (" + exactcount + ")자 입니다." );
				ctrl.focus();
				return( false );
			}
			if( (maximum > -1) && (exactcount > maximum) ) {
		        alert( "파일 경로의 길이는 최대 " + maximum + "자 이하이어야 합니다. 현재 (" + exactcount + ")자 입니다." );
				ctrl.focus();
				return( false );
			}
		}
		else {
			alert("파일명이 올바르지 않습니다.");
			return ( false );
		}
	}
	return( true );
}

function static_isnothing( ctrl )
{
	if ( typeof(ctrl) == null || typeof(ctrl) == "undefined")
		return ( true );

    var thisvalue = ctrl.value;
    if( thisvalue.length == 0 ) {
        return( true );
    }
    spacecount = 0;
    for( var i = 0; i < thisvalue.length; i++ ) {
        thischar = thisvalue.charAt( i );
        if( thischar == ' ' ) spacecount++;
    }
    if( spacecount == thisvalue.length ) {
	    return( true );
	}
	return( false );
}

function searchCookie(cookie, what, delimeter) {
	var Found = false;
	var i = 0;

	what = what + "=";
	while(i <= cookie.length && !Found) {
		if(cookie.substr(i, what.length) == what) Found = true;
		i++;
	}

	if(Found == true) {
		var start = i + what.length - 1;
		var end = cookie.indexOf(delimeter, start);
		if(end < start) end = cookie.length;
		return cookie.substring(start, end);
	}
	return "";
}

function getArrCookie(first, second){
	var arrCookie = searchCookie(document.cookie, first, ";");
	return searchCookie(arrCookie, second, "&");
}

// ndr cookie function
function getCookie(name){
    var cname = name + "=";
    var dc = document.cookie;

    if (dc.length > 0) {
     begin = dc.indexOf(cname);

        if (begin != -1) {
         begin += cname.length;
         end = dc.indexOf(";", begin);

         if (end == -1) end = dc.length;
             return unescape(dc.substring(begin, end));
        }
    }
    return "";
}

function setCookie(name, value)
{
   var argv = setCookie.arguments;
   var argc = setCookie.arguments.length;
   var expires = (2 < argc) ? argv[2] : null;
   var path = (3 < argc) ? argv[3] : null;
   var domain = (4 < argc) ? argv[4] : null;
   var secure = (5 < argc) ? argv[5] : false;
   document.cookie = name + "=" + value +
        ((expires == null) ? "" : ("; expires="+expires.toGMTString())) +
     ((path == null) ? "" : ("; path=" + path)) +
     ((domain == null) ? "" : ("; domain=" + domain)) +
        ((secure == true) ? "; secure" : "");
}

function setpcid() {
    // Deprecated
}

function setndr()
{
    return true;

	var Ctmpndr = getCookie("tmpndr");
	var Ukey = getCookie("u");
	if ( ( Ukey != null && Ukey != "" ) && ( Ctmpndr != null && Ctmpndr != "" )   )	{
		// ndr cookie set
		var Undr = "||" + unescape(Ctmpndr)
		setCookie("ndrn", Undr , null, "/", ".egloos.com", false);
		// Ctmpndr delete
		var del_expired_data = new Date(2001,1,1);
		setCookie("tmpndr", "" , del_expired_data, "/", ".egloos.com",false);
	}
}
// ndr cookie function

function setndrparam()
{
    return true;

    var ud3 = getCookie("UD3");
    if(ud3) {
        ud3 = ud3.match(/^[a-zA-Z0-9]+$/);
        if(ud3 == null) {
            ud3 = '';
        }
    }

    var ndrn = getCookie("ndrn");
    if(ndrn) {
        ndrn = ndrn.match(/^[a-zA-Z0-9|=%]+$/);
        if(ndrn == null) {
            ndrn = '';
        }
    } else {
        ndrn = getCookie("ndr");
        if(ndrn) {
            ndrn = ndrn.match(/^[a-zA-Z0-9|=%]+$/);
            if(ndrn == null) {
                ndrn = '';
            }
        }
    }

    var extParam = "ndru3=" + ud3;
    extParam += "&ndrl3=" + ndrn;

    return extParam;
}

function ap_copyright()
{
    if( typeof(document.location.href) == "unknown" )
    {
        url = "http://egloos.egloos.com";
        url = url.replace(/http\:\/\//gi,"");
        var host = url.substring(0,url.indexOf("."));
    }
    else
    {
        var url = document.location.href;
        url = url.replace(/http\:\/\//gi,"");
        var host = url.substring(0,url.indexOf("."));
    }
	var spchost;
	var spcuri = "";

	if ( host == "www" ) {
		spchost = "www";
		if ( url.indexOf("/login") >= 0 ) {
			spcuri = "login/";
		} else if ( url.indexOf("/adm/") >= 0 ) {
            spchost = "adm";
			spcuri = "";
			if ( url.indexOf("/adm/photo/") >= 0 ) {
                spcuri += "photo/";
                if(url.indexOf("photolog_info.php") >= 0) {
                    spcuri += "photolog/";
                } else if(url.indexOf("album_info.php") >= 0) {
                    spcuri += "album/";
                } else if(url.indexOf("photolog_skin.php") >= 0) {
                    spcuri += "photolog_skin/";
                }
            } else if ( url.indexOf("/adm/stat/") >= 0 ) {
                spcuri += "stat/";
                if( url.indexOf("egloo_stat.php") >= 0 ) {
                    spcuri += "egloo_stat";
                } else if( url.indexOf("egloo_stat_day.php") >= 0) {
                    spcuri += "egloo_stat_day";
                } else if( url.indexOf("egloo_stat_ref.php") >= 0 ) {
                    spcuri += "egloo_stat_ref";
                }
            } else if ( url.indexOf("/adm/skin2/") >= 0 ) {
                spcuri += "skin2/";
                if(url.indexOf("myskin_list.php") >= 0) {
                    spcuri += "myskin/";
                } else if(url.indexOf("mywidget_list.php") >= 0 ) {
                    spcuri += "mywidget/";
                }
                /*
                if( url.indexOf("myskin_list.php") >= 0) {
                    spcuri += "myskin/";
                } else if( url.indexOf("mywidget_list.php") >= 0) {
                    spcuri += "mywidget/";
                }
                */
            } else if( url.indexOf("/adm/post/") >= 0 ) {
                spcuri += "post/";
                if(url.indexOf("chgpcmt_info.php") >= 0) {
                    spcuri += "chgpcmt";
                }
            } else if(url.indexOf("/adm/openapi/") >= 0) {
                spcuri += "openapi/";
                if(url.indexOf("admin_apps.php") >= 0 ) {
                    spcuri += "admin_apps";
                }
            } else if(url.indexOf("/adm/sns/") >= 0) {
                spcuri += "sns/";
                if(url.indexOf("sns_config.php") >= 0) {
                    spcuri += "sns_config";
                }
            } else if(url.indexOf("/adm/privacy.php") >= 0) {
                spcuri += "privacy";
            } else if(url.indexOf("/adm/basic/chgegloo_info.php") >= 0) {
                spcuri += "basic/chgegloo/";
            } else {
                var reg = new RegExp("\/adm\/([a-zA-Z]+)\/.*?");
                var matched = url.match(reg);
                if(matched && matched[1]) {
                    spcuri += matched[1] + "/";
                }
            }
		} else if ( url.indexOf("/post") >= 0 )	{
			spcuri = "post/";
		} else if ( url.indexOf("/recent") >= 0 ) {
			spcuri = "recent/";
		} else if ( url.indexOf("/popular") >= 0 ) {
			spcuri = "popular/";
        } else if ( url.indexOf("/egloo/") >= 0 ) {
			spcuri = "egloo/";
			if ( url.indexOf("/egloo/insert.php") >= 0 ) spcuri += "post/";
		} else if ( url.indexOf("/photo/") >= 0 ) {
			spcuri = "egloo/";
			if ( url.indexOf("/photo/album_insert.php") >= 0 )	spcuri += "photo/";
		}
	}
	else if ( host == "valley" ) {
		spchost = "valley";
		if ( url.indexOf("/gd_valley.php") >= 0  || url.indexOf("/garden") >= 0 )	spcuri = "garden/";
		else if ( url.indexOf("/theme") >= 0 )	spcuri = "theme/";
		else if ( url.indexOf("/trackback") >= 0 )	spcuri = "trackback/";
		else if ( url.indexOf("/tag") >= 0 )	spcuri = "tag/";
		else if ( url.indexOf("/review") >= 0 )	spcuri = "review/";
		else if ( url.indexOf("/lifelog") >= 0 )	spcuri = "lifelog/";
		else if ( url.indexOf("/my_valley.php") >= 0 || url.indexOf("/frm/") >= 0 || url.indexOf("/my") >= 0 )	spcuri = "my/";
	}
	else if ( host == "garden" ) { spchost = "garden"; }
	else if ( host == "finder" ) {
		spchost = "finder"
		if ( url.indexOf("/per_finder.php") >= 0 )	spcuri = "per/";
	}
	else {
		spchost = "egloo";
		if ( url.indexOf("/photo") >= 0 )	{ spcuri = "photo/"; }
		else if ( url.indexOf("/garden") >= 0 )	spcuri = "garden/";
		else if ( url.indexOf("/lifelog") >= 0 )	spcuri = "lifelog/";
	}
	// ndr cookie set
	//setndr();

    //var extParam = setndrparam();
    //spcuri = spcuri + "??" + extParam;

	var out = "";
	out += ("	<div id=\"footer\">");
	out += ("	Copyrightⓒ ZUM internet. All rights reserved.  &nbsp; ");
	out += ("	  <a href=\"http://www.egloos.com/rules/provision.php\">이용약관</a>");
	out += ("	 | <a href=\"http://www.egloos.com/rules/privacy.php\"><strong>개인정보처리방침</strong></a>");
	out += ("	 | <a href=\"#\" onclick=\"window.open('http://www.egloos.com/emailreject.php','','width=400, height=270');\">이메일 수집거부</a>");
	out += ("	 | <a href=\"http://help.zum.com/inquiry\">고객센터</a>");
	out += ("	</div>");

//	out += ("<div id=\"copyright\">");
//	out += (" Copyrightⓒ <a href=http://corp.nate.com/ target=_blank>SK Communications.</a> All rights reserved.  &nbsp; ");
//	out += ("  <a href=http://corp.nate.com/ target=_blank>회사소개</a>");
//	out += (" | <a href=http://www.egloos.com/provision.php>이용약관</a>");
//	out += (" | <a href=http://www.egloos.com/privacy.php>개인정보 보호정책</a>");
//	out += (" | <a href=# onclick='window.open(\"http://www.egloos.com/emailreject.php\",\"\",\"width=400, height=270\")'>이메일 수집거부</a>");
//	out += (" | <a href=http://www.egloos.com/support.php>고객센터</a>");
//	out += ("</div>");
//	out += ("<img src=\"http://stategloos.egloos.com/stat/stat.tiff?cp_url=[" + spchost + "_ndr.egloos.com/" + spcuri + "]\" width=\"0\" height=\"0\" border=\"0\">");
    document.writeln( out );
}

function ap_copyright_gd()
{
    if( typeof(document.location.href) == "unknown" )
    {
        url = "http://egloos.egloos.com";
        url = url.replace(/http\:\/\//gi,"");
        var host = url.substring(0,url.indexOf("."));
    }
    else
    {
        var url = document.location.href;
        url = url.replace(/http\:\/\//gi,"");
        var host = url.substring(0,url.indexOf("."));
    }

	var spchost;
	var spcuri = "";

	if ( host == "www" ) {
		spchost = "www";
		if ( url.indexOf("/login") >= 0 ) {
			spcuri = "login/";
		} else if ( url.indexOf("/post") >= 0 )	{
			spcuri = "post/";
		} else if ( url.indexOf("/recent") >= 0 ) {
			spcuri = "recent/";
		} else if ( url.indexOf("/popular") >= 0 ) {
			spcuri = "popular/";
		} else if ( url.indexOf("/adm/") >= 0 ) {
			spcuri = "admin/";
			if ( url.indexOf("/adm/photo/") >= 0 ) spcuri += "photo/";
			else if ( url.indexOf("/adm/stat/") >= 0 )	spcuri += "stat/";
		} else if ( url.indexOf("/egloo/") >= 0 ) {
			spcuri = "egloo/";
			if ( url.indexOf("/egloo/insert.php") >= 0 ) spcuri += "post/";
		} else if ( url.indexOf("/photo/") >= 0 ) {
			spcuri = "egloo/";
			if ( url.indexOf("/photo/album_insert.php") >= 0 )	spcuri += "photo/";
		}
	}
	else if ( host == "valley" ) {
		spchost = "valley";
		if ( url.indexOf("/gd_valley.php") >= 0  || url.indexOf("/garden") >= 0 )	spcuri = "garden/";
		else if ( url.indexOf("/theme") >= 0 )	spcuri = "theme/";
		else if ( url.indexOf("/trackback") >= 0 )	spcuri = "trackback/";
		else if ( url.indexOf("/tag") >= 0 )	spcuri = "tag/";
		else if ( url.indexOf("/review") >= 0 )	spcuri = "review/";
		else if ( url.indexOf("/lifelog") >= 0 )	spcuri = "lifelog/";
		else if ( url.indexOf("/my_valley.php") >= 0 || url.indexOf("/frm/") >= 0 || url.indexOf("/my") >= 0 )	spcuri = "my/";

	}
	else if ( host == "garden" ) { spchost = "garden"; }
	else if ( host == "finder" ) {
		spchost = "finder"
		if ( url.indexOf("/per_finder.php") >= 0 )	spcuri = "per/";
	}
	else {
		spchost = "egloo";
		if ( url.indexOf("/photo") >= 0 )	{ spcuri = "photo/"; }
		else if ( url.indexOf("/garden") >= 0 )	spcuri = "garden/";
		else if ( url.indexOf("/lifelog") >= 0 )	spcuri = "lifelog/";
	}

	// ndr cookie set
	//setndr();

    //var extParam = setndrparam();
    //spcuri = spcuri + "??" + extParam;

	var out = "";
	out += ("<div id=\"footer\">");
	out += (" Copyrightⓒ ZUM internet. All rights reserved.  &nbsp; ");
	out += ("  <A HREF=http://www.egloos.com/provision.php>이용약관</A>");
	out += (" | <A HREF=http://www.egloos.com/privacy.php>개인정보 보호정책</A>");
	out += (" | <A HREF=# OnClick='window.open(\"http://www.egloos.com/emailreject.php\",\"\",\"width=400, height=270\")'>이메일 수집거부</A>");
	out += (" | <A HREF=http://help.zum.com/inquiry>고객센터</A>");
	out += ("</div>");
	//out += ("<img src=\"http://stategloos.egloos.com/stat/stat.tiff?cp_url=[" + spchost + "_ndr.egloos.com/" + spcuri + "]\" width=\"0\" height=\"0\" border=\"0\">");
    document.writeln( out );
}

function ap_adcode()
{
    return true;

    if( typeof(document.location.href) == "unknown" )
    {
        url = "http://egloos.egloos.com";
        url = url.replace(/http\:\/\//gi,"");
        var host = url.substring(0,url.indexOf("."));
    }
    else
    {
        var url = document.location.href;
        url = url.replace(/http\:\/\//gi,"");
        var host = url.substring(0,url.indexOf("."));
    }

	var spchost;
	var spcuri = "";

	if ( host == "www" ) {
		spchost = "www";
		if ( url.indexOf("/login") >= 0 ) {
			spcuri = "login/";
		} else if ( url.indexOf("/post") >= 0 )	{
			spcuri = "post/";
		} else if ( url.indexOf("/recent") >= 0 ) {
			spcuri = "recent/";
		} else if ( url.indexOf("/popular") >= 0 ) {
			spcuri = "popular/";
		} else if ( url.indexOf("/adm/") >= 0 ) {
			spcuri = "admin/";
			if ( url.indexOf("/adm/photo/") >= 0 ) spcuri += "photo/";
			else if ( url.indexOf("/adm/stat/") >= 0 )	spcuri += "stat/";
		} else if ( url.indexOf("/egloo/") >= 0 ) {
			spcuri = "egloo/";
			if ( url.indexOf("/egloo/insert.php") >= 0 ) spcuri += "post/";
		} else if ( url.indexOf("/photo/") >= 0 ) {
			spcuri = "egloo/";
			if ( url.indexOf("/photo/album_insert.php") >= 0 )	spcuri += "photo/";
		}
	}
	else if ( host == "valley" ) {
		spchost = "valley";
		if ( url.indexOf("/gd_valley.php") >= 0  || url.indexOf("/garden") >= 0 )	spcuri = "garden/";
		else if ( url.indexOf("/theme") >= 0 )	spcuri = "theme/";
		else if ( url.indexOf("/trackback") >= 0 )	spcuri = "trackback/";
		else if ( url.indexOf("/tag") >= 0 )	spcuri = "tag/";
		else if ( url.indexOf("/review") >= 0 )	spcuri = "review/";
		else if ( url.indexOf("/lifelog") >= 0 )	spcuri = "lifelog/";
		else if ( url.indexOf("/my_valley.php") >= 0 || url.indexOf("/frm/") >= 0 || url.indexOf("/my") >= 0 )	spcuri = "my/";
	}
	else if ( host == "garden" ) { spchost = "garden"; }
	else if ( host == "finder" ) {
		spchost = "finder"
		if ( url.indexOf("/per_finder.php") >= 0 )	spcuri = "per/";
	}
	else {
		spchost = "egloo";
		if ( url.indexOf("/photo") >= 0 )	{ spcuri = "photo/"; }
		else if ( url.indexOf("/garden") >= 0 )	spcuri = "garden/";
		else if ( url.indexOf("/lifelog") >= 0 )	spcuri = "lifelog/";
	}

	// ndr cookie set
	setndr();

    var extParam = setndrparam();
    spcuri = spcuri + "??" + extParam;

}

function ap_gardenmain(uid,nid,rtnurl)
{
	var out = "";
	out += ("<a href=\"http://www.egloos.com\">이글루스</a>");
	if ( nid != "" )
		out += (" | <a href=\"http://" + nid + ".egloos.com\">내이글루</a>");
	if ( nid != "" )
		out += (" | <a href=\"http://" + nid + ".egloos.com/garden\">마이가든</a>");
	if ( uid == "" )
		out += (" | <a href=\"https://sec.egloos.com/login.php?returnurl=" + rtnurl + "\">로그인</a>");
	else
		out += (" | <a href=\"https://sec.egloos.com/logout.php\">로그아웃</a>");
    document.writeln( out );
}

function go_finder(form) {
	var fndstr = form.kwd.value;
    fndstr = fndstr.replace(/(^\s*)|(\s*$)/gi,"");
	if (fndstr == "")
	{
		alert("검색어를 넣어주세요");
		return false;
	}

    form.kwd.value = fndstr;
	return true;
}

function ap_egloostop(uid, nid, rtnurl, opt)
{
//	var fnd_opt;
//	var fnd_act;
//	if (opt == 1) {
//		fnd_opt = '밸리검색';
//		fnd_act = 'http://valley.egloos.com/eg_valley_finder.php';
//	}
//	else {
//		fnd_opt = '전체검색';
//		fnd_act = 'http://finder.egloos.com/finder.php';
//	}

	var out = "";

	out += ("	<h1><a href=\"http://www.egloos.com\" title=\"이글루스홈\"><img src=\"http://md.egloos.com/img/x.gif\" width=\"250\" height=\"88\" alt=\"이글루스홈\" /></a></h1>");

	out += ("	<form name=\"navfinder\" method=\"get\" action=\"http://finder.egloos.com/finder.php\" onsubmit=\"return go_finder(document.navfinder);\" id=\"navfinder\">");
	out += ("	<div class=\"finder\">");
	out += ("		<img src=\"http://md.egloos.com/img/lib/finder_icon.gif\" alt=\"파인더\" class=\"title\" />");
//	out += ("		<span id=\"area_select\" class=\"area_select\"><a href=\"#\" onclick=\"open_finder_select();\">"+fnd_opt+" <img src=\"http://md.egloos.com/img/eg/nav/icon_down.gif\" alt=\"\" border=\"0\" /></a>");
//	out += ("		</span>");
	out += ("		<input type=\"text\" id=\"kwd\" name=\"kwd\" />");
	out += ("	</div>");
	out += ("	</form>");

	document.writeln( out );
}

/*
function open_finder_select()
{
	var html = "<ul class=\"area_list\">"
		+ "<li><a href=\"#\" onclick=\"change_finder_select('전체검색', 'http://finder.egloos.com/finder.php');\">전체검색</a></li>"
		+ "<li><a href=\"#\" onclick=\"change_finder_select('밸리검색', 'http://valley.egloos.com/eg_valley_finder.php');\">밸리검색</a></li>"
		+ "</ul>";
	document.getElementById('area_select').innerHTML = html;
}

function change_finder_select(str, action)
{
	var html = "<a href=\"#\" onclick=\"open_finder_select();\">"+str+ " <img src=\"http://md.egloos.com/img/eg/nav/icon_down.gif\" alt=\"\" border=\"0\" /></a>";
	document.getElementById('area_select').innerHTML = html;
	document.getElementById('navfinder').action = action;
}
*/
function topnav_menu(obj,opt)
{
	var len = obj.src.length;
	var src = obj.src;
	switch (opt)
	{
	case 0:
		obj.src = src.substring(0,len-5) + "o.gif";
		break;
	case 1:
		obj.src = src.substring(0,len-5) + "x.gif";
		break;
	default:
		break;
	}
}


function ap_topnav(uid, nid, rtnurl, opt)
{
	var out = "";

	out += ("	<div id=\"navi_gnb\">");
	out += ("		<ul>");
	out += ("			<li id=\"home\"><a href=\"http://www.egloos.com\" title=\"이글루스 홈\"> 홈 </a></li>");
	out += ("			<li id=\"valley\"><a href=\"http://valley.egloos.com\" title=\"밸리\"> 밸리 </a></li>");
	out += ("			<li id=\"my\"><a href=\"http://valley.egloos.com/my\" title=\"마이\"> 마이 </a></li>");
	out += ("			<li id=\"garden\"><a href=\"http://valley.egloos.com/garden\" title=\"가든\"> 가든 </a></li>");
	out += ("		</ul>");
	out += (" 		<div class=\"gnb_letsreview\"><a href=\"http://valley.egloos.com/review/\"><img src=\"http://md.egloos.com/img/nav/letsreview.gif\" alt=\"렛츠리뷰\" border=\"0\" /></a></div>");
	out += ("		<div class=\"usermenu\">");
	if ( nid != "" ) {
		out += ("			<a href=\"http://" + nid + ".egloos.com\" >내 이글루</a> |");
		out += ("			<a href=\"http://" + nid + ".egloos.com/garden\" >마이가든</a> |");
	}
	if ( uid == "" )
		out += ("			<a href=\"https://sec.egloos.com/login.php?returnurl=" + rtnurl + "\" class=\"login\"> 로그인 </a>");
	else
		out += ("			<a href=\"https://sec.egloos.com/logout.php\" class=\"logout\"> 로그아웃 </a>");
	out += ("		</div>");

    document.writeln( out );

}

function ap_admintitle(eid, nid, opt)
{
	var out = "";
	var tab_opt = new Array();

	for (var i=0; i<5; i++) {
		if (opt == i) tab_opt[i] = "o";
		else tab_opt[i] = "x";
	}

	out += ("<map name=\"1\"><area shape=\"rect\" coords=\"205,0,60,55\" href=\"http://www.egloos.com/adm/chgadm_main.php?eid=" + eid + "\"></map>");
	out += ("<div id=\"admin_title\">");
	out += ("	<div class=\"toplink\"><a href=\"http://www.egloos.com/egloo/insert.php?eid=" + eid + "\">새글쓰기</a> | <a href=\"http://" + nid + ".egloos.com\">내 이글루 메인</a></div>");
	out += ("	<div class=\"admainlink\"><img src=\"http://md.egloos.com/img/x.gif\" usemap=\"#1\" border=\"0\" width=\"300\" height=\"55\" /></div>");
	out += ("	<div class=\"admlink\">");
	out += ("		<a href=\"http://www.egloos.com/adm/basic/chgegloo_info.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_blog_" + tab_opt[0]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"블로그관리\" /></a>");
	out += ("		<a href=\"http://www.egloos.com/adm/skin2/myskin_list.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_design_" + tab_opt[1]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"디자인\" />");
	out += ("		<img class=\"ico\" src=\"http://md.egloos.com/img/adm/skin2/ico_beta.gif\" border=\"0\" alt=\"BETA\" /></a>");
	out += ("		<a href=\"http://www.egloos.com/adm/photo/photolog_info.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_photo_" + tab_opt[2]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"포토로그\" /></a>");
	out += ("		<a href=\"http://www.egloos.com/adm/nateon/nateon_config.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_add_" + tab_opt[3]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"부가기능\" /></a>");
	out += ("		<a href=\"http://www.egloos.com/adm/stat/egloo_stat.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_stat_" + tab_opt[4]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"통계\" /></a>");
	out += ("	</div>");
	out += ("</div>");
    document.writeln( out );
}

function ap_admintitle_photo(eid, nid, opt)
{

	var out = "";
	var tab_opt = new Array();

	for (var i=0; i<5; i++) {
		if (opt == i) tab_opt[i] = "o";
		else tab_opt[i] = "x";
	}

	out += ("<map name=\"1\"><area shape=\"rect\" coords=\"205,0,60,55\" href=\"http://www.egloos.com/adm/chgadm_main.php?eid=" + eid + "\"></map>");
	out += ("<div id=\"admin_title\">");
	out += ("	<div class=\"toplink\"><a href=\"http://www.egloos.com/photo/album_insert.php?eid=" + eid + "\">새 앨범만들기</a> | <a href=\"http://" + nid + ".egloos.com/photo\">내 포토로그</a></div>");
	out += ("	<div class=\"admainlink\"><img src=\"http://md.egloos.com/img/x.gif\" usemap=\"#1\" border=\"0\" width=\"300\" height=\"55\" /></div>");
	out += ("	<div class=\"admlink\">");
	out += ("		<a href=\"http://www.egloos.com/adm/basic/chgegloo_info.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_blog_" + tab_opt[0]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"블로그관리\" /></a>");
	out += ("		<a href=\"http://www.egloos.com/adm/skin2/myskin_list.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_design_" + tab_opt[1]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"디자인\" /></a>");
	out += ("		<img class=\"ico\" src=\"http://md.egloos.com/img/adm/skin2/ico_beta.gif\" border=\"0\" alt=\"BETA\" /></a>");
	out += ("		<a href=\"http://www.egloos.com/adm/photo/photolog_info.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_photo_" + tab_opt[2]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"포토로그\" /></a>");
	out += ("		<a href=\"http://www.egloos.com/adm/nateon/nateon_config.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_add_" + tab_opt[3]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"부가기능\" /></a>");
	out += ("		<a href=\"http://www.egloos.com/adm/stat/egloo_stat.php?eid=" + eid + "\"><img src=\"http://md.egloos.com/img/adm/tab_stat_" + tab_opt[4]  + ".gif\" width=\"92\" height=\"26\" border=\"0\" alt=\"통계\" /></a>");

	out += ("	</div>");
	out += ("</div>");
    document.writeln( out );
}

function ap_adminblogtitle(eid, nid, opt)
{
	var out = "";
	var blog_class = new Array();

	for (var i=0; i<7; i++) {
		if (opt == i) blog_class[i] = " class=\"selected\"";
		else blog_class[i] = "";
	}

	out += ("		<div id=\"admin_sub_title\">");
	out += ("			<a href=\"http://www.egloos.com/adm/basic/chgegloo_info.php?eid=" + eid + "\"" + blog_class[0] + " style=\"margin-left: 20px;\">기본설정</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/privacy.php?eid=" + eid + "\"" + blog_class[1] + ">프라이버시설정</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/post/chgpost_info.php?eid=" + eid + "\"" + blog_class[2] + ">글관리</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/spam/chgcmt_spam_info.php?eid=" + eid + "\"" + blog_class[3] + ">스팸/덧글차단</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/lifelog/chglifelog_info.php?eid=" + eid + "\"" + blog_class[4] + ">라이프로그</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/nav/chgnav_info.php?eid=" + eid + "\"" + blog_class[5] + ">네비바</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/pdf/chgbkup_info.php?eid=" + eid + "\"" + blog_class[6] + ">출판및백업</a>");
	out += ("		</div>");

    document.writeln( out );
}
function ap_adminphototitle(eid, nid, opt)
{
	var out = "";
	var blog_class = new Array();

	for (var i=0; i<4; i++) {
		if (opt == i) blog_class[i] = " class=\"selected\"";
		else blog_class[i] = "";
	}

	out += ("		<div id=\"admin_sub_title\">");
	out += ("			<a href=\"http://www.egloos.com/adm/photo/photolog_info.php?eid=" + eid + "\"" + blog_class[0] + " style=\"margin-left: 20px;\">기본설정</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/photo/album_info.php?eid=" + eid + "\"" + blog_class[1] + ">앨범관리</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/photo/photolog_skin.php?eid=" + eid + "\"" + blog_class[2] + ">포토로그스킨</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/post/chgpcmt_info.php?eid=" + eid + "\"" + blog_class[3] + ">포토로그덧글</a>");
	out += ("		</div>");

    document.writeln( out );
}
function ap_adminaddtitle(eid, nid, opt, admedia)
{
	var out = "";
	var blog_class = new Array();

	for (var i=0; i<12; i++) {
		if (opt == i) blog_class[i] = " class=\"selected\"";
		else blog_class[i] = "";
	}

    out += ("		<div id=\"admin_sub_title\" style=\"letter-spacing:-1px\">");
    out += ("           <a href=\"http://www.egloos.com/adm/nateon/nateon_config.php?eid=" + eid + "\"" + blog_class[0] + " style=\"margin-left: 20px;\">네이트온연동</a>");
    out += ("			<a href=\"http://www.egloos.com/adm/meta/syncrss.php?eid=" + eid + "\"" + blog_class[2] + ">메타사이트등록</a>");
	out += ("           <a href=\"http://www.egloos.com/adm/voice/chgvoice_info.php?eid=" + eid + "\"" + blog_class[4] + ">보이스블로깅</a>");
    out += ("           <a href=\"http://www.egloos.com/adm/blognews/post.php?eid=" + eid + "\"" + blog_class[5] + " style=\"word-spacing:0;\">Daum view</a>");
	out += ("           <a href=\"http://www.egloos.com/adm/copyright/copyright.php?eid=" + eid + "\"" + blog_class[1] + ">저작권보호</a>");
    out += ("           <a href=\"http://www.egloos.com/adm/allblet/allblet.php?eid=" + eid + "\"" + blog_class[8] + ">올블릿</a>");
    out += ("           <a href=\"http://www.egloos.com/adm/openapi/admin_apps.php?eid=" + eid + "\"" + blog_class[9] + ">앱스관리</a>");
    out += ("           <a href=\"http://www.egloos.com/adm/sns/sns_config.php?eid=" + eid + "\"" + blog_class[10] + ">외부SNS연계</a>");
	out += ("		</div>");
    document.writeln( out );
}

function ap_adminstattitle(eid, nid, opt)
{
	var out = "";
	var blog_class = new Array();

	for (var i=0; i<3; i++) {
		if (opt == i) blog_class[i] = " class=\"selected\"";
		else blog_class[i] = "";
	}

    out += ("		<div id=\"admin_sub_title\">");
	out += ("			<a href=\"http://www.egloos.com/adm/stat/egloo_stat.php?eid=" + eid + "\"" + blog_class[0] + " style=\"margin-left: 20px;\">방문자통계</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/stat/egloo_stat_day.php?eid=" + eid + "\"" + blog_class[1] + ">날짜별통계</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/stat/egloo_stat_ref.php?eid=" + eid + "\"" + blog_class[2] + ">세부통계</a>");
	out += ("		</div>");

    document.writeln( out );
}

function ap_admindesigntitle(eid, nid, opt, skin2)
{
	var out = "";
	var blog_class = new Array();

	for (var i=0; i<3; i++) {
		if (opt == i) blog_class[i] = " class=\"selected\"";
		else blog_class[i] = "";
	}

    out += ("		<div id=\"admin_sub_title\">");
	out += ("			<a href=\"http://www.egloos.com/adm/skin2/myskin_list.php?eid=" + eid + "\"" + blog_class[0] + " style=\"margin-left: 20px;\">내저장스킨</a>");
	out += ("			<a href=\"http://www.egloos.com/adm/skin2/mywidget_list.php?eid=" + eid + "\"" + blog_class[1] + ">내저장위젯</a>");
    if(!skin2){
	    out += ("			<a href=\"http://www.egloos.com/adm/skin/myskin_info.php?eid=" + eid + "\"" + blog_class[2] + ">1.0스킨</a>");
    }
	out += ("		</div>");

    document.writeln( out );
}

function ap_inserttitle(eid, nid, cls)
{
	var out = "";
	var tab_opt = new Array();

	out += ("<map name=\"1\"><area shape=\"rect\" coords=\"205,0,60,55\" href=\"http://www.egloos.com/adm/chgadm_main.php?eid=" + eid + "\"></map>");
	out += ("<div id=\"" + cls + "_title\">");
	out += ("<div class=\"toplink\"><a href=\"http://www.egloos.com/adm/chgadm_main.php?eid=" + eid + "\">이글루관리</a> | <a href=\"http://" + nid + ".egloos.com\">내 이글루 메인</a></div>");
	out += ("	</div>");
    document.writeln( out );
}

function ap_trackbacktitle(nid,opt)
{
	var out = "";
	var topimg = "";
	if ( opt == "1" ) post_img = "http://md.egloos.com/img/eg/postleft.gif";
	else post_img = "http://md.egloos.com/img/eg/updateleft.gif";

	out += ("<table width=780 border=0 cellspacing=0 cellpadding=0>");
	out += ("<tr><td rowspan=2 width=270 height=92 valign=top>");
	out += ("	<a href=\"http://www.egloos.com/\"><img src=http://md.egloos.com/img/nav/mt_logo.gif width=270 height=88 border=0></a></td>");
	out += ("	<td width=210 height=92></td>");
	out += ("	<td width=300 height=92 background=\"http://md.egloos.com/img/nav/mt_faq.gif\" width=300 height=92 border=0 valign=bottom>");
	out += ("</table>");
    document.writeln( out );
}

function ap_maintitle(uid)
{
	var out = "";
	out += ("<A CLASS=BK HREF=http://www.egloos.com>홈</A> &nbsp;|&nbsp;");
	out += ("<A CLASS=BK HREF=http://www.egloos.com/egloos.php>이글루스란?</A> &nbsp;|&nbsp;");
	out += ("<A CLASS=BK HREF=http://valley.egloos.com>이글루밸리</A> &nbsp;|&nbsp;");
	out += ("<A CLASS=BK HREF=http://www.egloos.com/support.php>고객센터</A> &nbsp;&nbsp;");
	if( uid == "" )
		out += ("<A CLASS=BK HREF=https://sec.egloos.com/login.php><B>☞로그인</B></A>&nbsp;&nbsp;");
	else
		out += ("<A CLASS=BK HREF=https://sec.egloos.com/logout.php><B>☞로그아웃</B></A>&nbsp;&nbsp;");
    document.writeln( out );
}

function ap_findertitle(uid,nid,rtnurl)
{
	var out = "";

	out += ("<form name=\"navfinder\" method=\"get\" action=\"http://finder.egloos.com/finder.php\" onsubmit=\"return go_finder(document.navfinder);\">");
	out += ("<table width=\"780\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	out += ("<tr><td rowspan=\"2\" width=\"270\" height=\"92\" valign=\"top\"><img src=\"http://md.egloos.com/img/nav/finder_logo.gif\" width=\"157\" height=\"88\" border=\"0\" alt=\"이글루스 파인더\" /><a href=\"http://www.egloos.com/\"><img src=\"http://md.egloos.com/img/nav/finder_home.gif\" width=\"113\" height=\"88\" border=\"0\" alt=\"이글루스\" /></a></td>");
	out += ("	<td width=\"210\" height=\"92\"></td>");
	out += ("	<td width=\"300\" height=\"92\" background=\"http://md.egloos.com/img/nav/mt_faq.gif\" width=\"300\" height=\"92\" border=\"0\" valign=\"bottom\" /><div class=\"finder\"><input type=\"text\" name=\"kwd\" size=\"12\" class=\"TXTFLD\" /></div></td></tr>");
	out += ("</table>");
	out += ("</form>");
    document.writeln( out );

//	out = ""
//	out += ("<TABLE WIDTH=780 BORDER=0 CELLSPACING=0 CELLPADDING=0>");
//	out += ("<TR><TD HEIGHT=15></TD></TR>");
//	out += ("</TABLE>");

	ap_topnav(uid, nid, rtnurl ,0);
//    document.writeln( out );
}

function ap_valleytop(uid,nid,rtnurl,knd)
{
	var out = "";
	out += ("<TABLE WIDTH=775 BORDER=0 CELLSPACING=0 CELLPADDING=0>");
	out += ("<TR><TD COLSPAN=4 WIDTH=775 HEIGHT=3 BGCOLOR=#003863></TD></TR>");
	out += ("<TR><TD WIDTH=161 HEIGHT=57><A HREF=http://valley.egloos.com/><IMG SRC=http://md.egloos.com/img/vl/top_vl_1.gif WIDTH=161 HEIGHT=57 BORDER=0 ALT=\"밸리 메인\"></A></TD>");
	out += ("	<TD WIDTH=70 HEIGHT=57><A HREF=http://www.egloos.com/><IMG SRC=http://md.egloos.com/img/vl/top_vl_2.gif WIDTH=70 HEIGHT=57 BORDER=0 ALT=\"이글루스 홈\"></A></TD>");
	out += ("	<TD WIDTH=319 HEIGHT=57 BACKGROUND=http://md.egloos.com/img/vl/top_vl_3.gif></TD>");
	out += ("	<TD WIDTH=225 HEIGHT=57 BACKGROUND=http://md.egloos.com/img/vl/top_vl_4.gif></TD></TR>");
	out += ("</TABLE>");
	out += ("<TABLE WIDTH=775 BORDER=0 CELLSPACING=0 CELLPADDING=0>");
	out += ("<TR><TD WIDTH=455 HEIGHT=23>");
	out += ("	<MAP NAME=vltop>");
	out += ("	<AREA SHAPE=rect COORDS=\"1,1,81,23\" HREF=http://valley.egloos.com>");
	out += ("	<AREA SHAPE=rect COORDS=\"82,1,198,23\" HREF=http://valley.egloos.com/tb_valley.php>");
	out += ("	<AREA SHAPE=rect COORDS=\"199,1,322,23\" HREF=http://valley.egloos.com/eg_valley.php>");
	if ( uid != "" )
		out += ("	<AREA SHAPE=rect COORDS=\"323,1,441,23\" HREF=http://valley.egloos.com/my_valley.php>");
	else
		out += ("	<AREA SHAPE=rect COORDS=\"323,1,441,23\" HREF=https://sec.egloos.com/login.php?returnurl=http://valley.egloos.com/my_valley.php>");
	out += ("	</MAP>");
	out += ("	<IMG SRC=http://md.egloos.com/img/vl/tab_vl_" + knd + ".gif USEMAP=\"#vltop\" WIDTH=455 HEIGHT=23 BORDER=0></TD>");
	out += ("	<TD WIDTH=310 HEIGHT=23 BACKGROUND=http://md.egloos.com/img/vl/top_vl_5.gif CLASS=MENU_SUB>");
	out += ("	<A CLASS=SUB HREF=http://www.egloos.com/>이글루스 홈</A> &nbsp;|&nbsp;");
	if ( uid != "" ) {
		out += ("	<A CLASS=SUB HREF=http://" + nid + ".egloos.com>내 이글루</A> &nbsp;|&nbsp;");
		out += ("	<A CLASS=SUB HREF=https://sec.egloos.com/logout.php><IMG SRC=http://md.egloos.com/img/vl/ico_logout_sub.gif BORDER=0> <B>로그아웃</B></A>&nbsp;&nbsp;");
	}
	else {
		out += ("	<A CLASS=SUB HREF=http://www.egloos.com/support.php>고객센터</A> &nbsp;|&nbsp;");
		out += ("	<A CLASS=SUB HREF=https://sec.egloos.com/login.php?returnurl=" + rtnurl + "><IMG SRC=http://md.egloos.com/img/hm/ico_login_sub.gif BORDER=0> <B>로그인</B></A>&nbsp;&nbsp;");
	}
	out += ("	</TD>");
	out += ("	<TD WIDTH=10 HEIGHT=23 BACKGROUND=http://md.egloos.com/img/vl/top_vl_6.gif></TD></TR>");
	out += ("</TABLE>");
	document.writeln( out );
}


function ap_subtitle(uid,nxturl)
{
	var out = "";
	out += ("<TABLE WIDTH=762 BORDER=0 CELLSPACING=0 CELLPADDING=0>");
	out += ("<TR><TD WIDTH=245 ROWSPAN=2><A HREF=http://www.egloos.com><IMG WIDTH=245 HEIGHT=72 SRC=http://md.egloos.com/img/hm/logo.gif BORDER=0 ALT=이글루스홈></A></TD>");
	out += ("	<TD WIDTH=517 BACKGROUND=http://md.egloos.com/img/hm/subtop_1.gif HEIGHT=50></TD></TR>");
	out += ("<TR><TD WIDTH=517 BACKGROUND=http://md.egloos.com/img/hm/subtop_2.gif HEIGHT=22 ALIGN=RIGHT VALIGN=BOTTOM>");
	out += ("	<A CLASS=BK HREF=http://www.egloos.com>홈</A> &nbsp;|&nbsp;");
	out += ("	<A CLASS=BK HREF=http://www.egloos.com/egloos.php>이글루스란?</A> &nbsp;|&nbsp;");
	out += ("	<A CLASS=BK HREF=http://valley.egloos.com>이글루밸리</A> &nbsp;|&nbsp;");
	out += ("	<A CLASS=BK HREF=http://www.egloos.com/support.php>고객센터</A> &nbsp;&nbsp;");
	if( uid == "" )
		out += ("<A CLASS=BK HREF=https://sec.egloos.com/login.php?returnurl=" + nxturl + "><B>☞로그인</B></A>&nbsp;&nbsp;");
	else
		out += ("<A CLASS=BK HREF=https://sec.egloos.com/logout.php><B>☞로그아웃</B></A>&nbsp;&nbsp;");
	out += ("	</TD></TR>");
	out += ("</TABLE>");
    document.writeln( out );
}

function ap_sublocation(nid,loc)
{
	var out = "";
	out += ("<TABLE WIDTH=762 BORDER=0 CELLSPACING=0 CELLPADDING=0>");
	out += ("<TR><TD CLASS=LOCATION><A HREF=http://www.egloos.com/>홈</A> > " + loc + "</TD>");
	out += ("	 <TD CLASS=LOCATION ALIGN=RIGHT>");
	if( nid != "" )
		out += ("<A HREF=http://" + nid + ".egloos.com/>내 이글루 가기 <IMG SRC=http://md.egloos.com/img/hm/icon_arr.gif WIDTH=14 HEIGHT=13 BORDER=0 ALT=\'내 이글루로\' ALIGN=ABSMIDDLE></A>&nbsp;&nbsp;");
	out += ("	</TD></TR>");
	out += ("	</TABLE>");
    document.writeln( out );
}

function isNothing( formName ) {
    var thisvalue = formName.value.replace(/^\s+/, "").replace(/\s+$/, "");
    if( thisvalue.length == 0 ) {
        alert( "본 내용에는 반드시 값을 입력하셔야 합니다.\r\nPlease enter valid value into this field" );
        formName.focus();
        return( true );
    }
    spacecount = 0;
    for( var i = 0; i < thisvalue.length; i++ ) {
        thischar = thisvalue.charAt( i );
        if( thischar == ' ' ) spacecount++;
    }
    if( spacecount == thisvalue.length ) {
	    alert( "본 내용에는 반드시 값을 입력하셔야 합니다.\r\nAll blank characters are assumed Nothing, Please reenter!" );
        formName.focus();
	    return( true );
	}
	return( false );
}

/**
 * @deprecated StringUtil.isNumeric을 사용해주세요.
 */
function isNumeric( formName ) {
    var charDetected = 0, markDetected = 0, dotCount = 0;
    var numeric = formName.value;
    if( numeric == null || numeric == "" || numeric.length == 0 ) {
        return( false );
    }
    for( var i = 0; i < numeric.length; i++ ) {
      thischar = numeric.charAt( i );
      if( !((thischar >= '0') && (thischar <= '9')) ) {
        return( false );
        }
    } //end of for
    return( true );
}

function isValidNumeric( formName, minimum, maximum ) {
    var numeric = formName.value;
    if( isNumeric( formName ) == false ) {
        alert( "본 내용에는 반드시 수치로 된 값을 입력하셔야 합니다.\r\nNothing or Non-Numeric entered, Please enter some numeric value" );
        return( false );
    }
    var quantity = parseInt( numeric, 10 );
    if( minimum == -1 || maximum == -1 ) //range not defined
        return( true );
    if( (quantity < minimum) || (quantity > maximum) ) {
        alert( "본 값은 최소 (" + minimum + ") 부터 최대 (" + maximum + ") 까지 가능합니다. 다시 입력해 주십시오.");
        return( false );
    }
    return( true );
}

function getExactCount( formName ) {
    var thisvalue = formName.value;
    var byte1count = 0, byte2count = 0;
    var specialset = " `~!@#$%^&*()_+|\\=-[]{};':\",./<>?";
    for( var i = 0; i < thisvalue.length; i++ ) {
        thischar = thisvalue.charAt( i );
        if( ((thischar >= '0') && (thischar <= '9')) ||
            ((thischar >= 'A') && (thischar <= 'Z')) ||
            ((thischar >= 'a') && (thischar <= 'z')) ||
            ((thischar == '-') || (thischar == '_')) )
            byte1count++;
        else if( thischar == '(' || thischar == ')' ) {
        	byte1count++;
        }
        else if( specialset.indexOf(thischar) != -1 )
            byte1count++;
        else
            byte2count++;
    }
    return( byte1count + byte2count * 3 );
}

function getExactCountBef( formName ) {
    var thisvalue = formName.value;
    var byte1count = 0, byte2count = 0;
    var specialset = " `~!@#$%^&*()_+|\\=-[]{};':\",./<>?";
    for( var i = 0; i < thisvalue.length; i++ ) {
        thischar = thisvalue.charAt( i );
        if( ((thischar >= '0') && (thischar <= '9')) ||
            ((thischar >= 'A') && (thischar <= 'Z')) ||
            ((thischar >= 'a') && (thischar <= 'z')) ||
            ((thischar == '-') || (thischar == '_')) )
            byte1count++;
        else if( thischar == '(' || thischar == ')' ) {
        	byte1count++;
        	//byte1count++;
        }
        else if( specialset.indexOf(thischar) != -1 )
            byte1count++;
        else
            byte2count++;
    }
    return( byte1count + byte2count * 2 );
}

function chkEscapeChar(str) {
	var escape_char = new Array();
	escape_char = ['`', ' ', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '=', '+', '|', '\\', '}', ']', '{', '[', '\'', ':', ';', '?', '/', '>', '<', '.', ',', '­', '"', '	'];

	var error_code = 0;
	var i;

	for(i=0 ; i < escape_char.length ; i++){
		ret = str.indexOf(escape_char[i]);
		if( ret >= 0 ) error_code +=1;
	}

	return(error_code);
}

function validUserid(home){

    if (home.search(/^\d/) != -1 || home.search(/[_\W]/) != -1 )  return(false);
    else return(true);
}

function ap_jsview(str){
	str = str.replace(/\'/g,"\\'");
	return str;
}

function isValidID( formName, minimum, maximum ) {
    var thisvalue = formName.value;
    if( thisvalue.length == 0 ) {
        alert( "본 내용은 유효한 값이 반드시 있어야 합니다.\r\nPlease enter valid value into this field" );
        formName.focus();
        return( false );
    }
    var exactcount = 0;
    var specialset = " `~!@#$%^&*()_+|\\=-[]{};':\",./<>?";
    for( var i = 0; i < thisvalue.length; i++ ) {
        thischar = thisvalue.charAt( i );
        if( specialset.indexOf(thischar) != -1 ) {
	        alert( "본 내용에는 특수한 문자를 사용할 수 없습니다.\r\nSpecial character is NOT available, Enter another one!" );
	        formName.focus();
	        return( false );
            }
    }
    exactcount = getExactCount( formName );
    if( minimum == -1 || maximum == -1 ) //range not defined
        return( true );
    if( (exactcount < minimum) || (exactcount > maximum) ) {
        alert( "최소(" + minimum + ") 에서 최대(" + maximum + ") 자 이내의 값으로 입력하셔야 합니다. 한글 또는 특수문자는 하나당 2자로 인식됩니다." +
        	   "\r\nValue must be in a range (" + minimum + ") to (" + maximum + ") in length, Please reenter!" );
        return( false );
    }
    return( true );
}

function isValidBlob( formName, maxlength ) {
	var exactcount = getExactCount( formName );
    if( exactcount > maxlength ) {
        alert( "내용이 너무 크므로 " + (exactcount-maxlength) + "자 이상을 줄이신 후 다시 시도하십시오.\r\n" +
         "Please shorten the description by " + (exactcount-maxlength) + " characters." );
        formName.focus();
        return( false );
    } else {
        return( true );
    }
}


function isValidBlobBef( formName, maxlength ) {
	var exactcount = getExactCountBef( formName );
    if( exactcount > maxlength ) {
        alert( "내용이 너무 크므로 " + (exactcount-maxlength) + "자 이상을 줄이신 후 다시 시도하십시오.\r\n" +
         "Please shorten the description by " + (exactcount-maxlength) + " characters." );
        formName.focus();
        return( false );
    } else {
        return( true );
    }
}

function ap_mkahref(url, value)
{
	var rtnstr = "";
	rtnstr = "<A HREF=" + url + ">" + value + "</A>";
	return rtnstr;
}

function ap_mkdivID(name, align, value)
{
	var rtnstr;
	if (align != "")
		align = " ALIGN=" + align;
	rtnstr = "<DIV ID=" + name + align + ">" + value + "</DIV>";
	return ( rtnstr );
}

function ap_mkdiv(name, align, value)
{
	var rtnstr;
	if (align != "")
		align = " ALIGN=" + align;
	rtnstr = "<DIV CLASS=" + name + align + ">" + value + "</DIV>";
	return ( rtnstr );
}

function ap_getwinw( winobj )
{
	var w;
    if( NS ) {
//    	w = winobj.innerWidth;
 		w = winobj.screen.width;
   } else {
    	w = winobj.document.body.clientWidth;
    	if( winobj != self )
    	    w += 12;
    }
    return( w );
}

function ap_getwinh( winobj )
{
	var h;
    if( NS ) {
//    	h = winobj.innerHeight;
 		h = winobj.screen.height;
   } else {
    	h = winobj.document.body.clientHeight;
    	if( winobj != self )
    	    h += (23 + 8);
    }
    return( h );
}

function ap_adjustwinh( basewin, adjusttagnm, preferredh, resizable, scrollable, status, plusy )
{
    basewin.focus();
    if( !IE4 )
        return;
    if( !eval("document.images." + adjusttagnm) )
        return;
    w = ap_getwinw( basewin );
    h = ap_getwinh( basewin );
    y = eval( "document.images." + adjusttagnm + ".offsetTop" );
    if( h == y )
        return;
    neww = w + 10;
    if( resizable == true ) neww += (16+2);
    if( scrollable == true ) neww += (16);
    if( status == true ) neww += 0;
    newh = y + plusy;
    if( resizable == true ) newh += 2;
    if( scrollable == true ) newh += 0;
    if( status == true ) newh += 0;
    if( newh >= window.screen.availHeight )
        newh = Math.min( newh, h );
    if( preferredh > 0 ) newh = Math.min( preferredh, newh );
    self.window.resizeTo( neww, newh );
}

function searchCookie(cookie, what, delimeter) {
	var Found = false;
	var i = 0;

	what = what + "=";
	while(i <= cookie.length && !Found) {
		if(cookie.substr(i, what.length) == what) Found = true;
		i++;
	}

	if(Found == true) {
		var start = i + what.length - 1;
		var end = cookie.indexOf(delimeter, start);
		if(end < start) end = cookie.length;
		return cookie.substring(start, end);
	}
	return "";
}

function getCookieVal(what){
	return searchCookie(document.cookie, what, ";");
}
/* 월드컵 밸리 상단 네비게이션 */
function ap_wcvalleytitle(opt, match)
{
	var out = "";
	var nav1, nav2, nav3, matchout;
	switch (opt)
	{
	case 0 :
		nav1 = "<img src=\"http://md.egloos.com/img/vl/wc/menu1_o.gif\" width=\"135\" height=\"25\" border=\"0\" alt=\"2006 독일! 메인\" \/>";
		nav2 = "<img src=\"http://md.egloos.com/img/vl/wc/menu2_x.gif\" width=\"115\" height=\"25\" border=\"0\" alt=\"포토응원로그\" \/>";
		nav3 = "<img src=\"http://md.egloos.com/img/vl/wc/menu3_x.gif\" width=\"115\" height=\"25\" border=\"0\" alt=\"미션 오!그림판\" \/>";
		break;
	case 1 :
		nav1 = "<img src=\"http://md.egloos.com/img/vl/wc/menu1_x.gif\" width=\"135\" height=\"25\" border=\"0\" alt=\"2006 독일! 메인\" \/>";
		nav2 = "<img src=\"http://md.egloos.com/img/vl/wc/menu2_o.gif\" width=\"115\" height=\"25\" border=\"0\" alt=\"포토응원로그\" \/>";
		nav3 = "<img src=\"http://md.egloos.com/img/vl/wc/menu3_x.gif\" width=\"115\" height=\"25\" border=\"0\" alt=\"미션 오!그림판\" \/>";
		break;
	case 2 :
		nav1 = "<img src=\"http://md.egloos.com/img/vl/wc/menu1_x.gif\" width=\"135\" height=\"25\" border=\"0\" alt=\"2006 독일! 메인\" \/>";
		nav2 = "<img src=\"http://md.egloos.com/img/vl/wc/menu2_x.gif\" width=\"115\" height=\"25\" border=\"0\" alt=\"포토응원로그\" \/>";
		nav3 = "<img src=\"http://md.egloos.com/img/vl/wc/menu3_o.gif\" width=\"115\" height=\"25\" border=\"0\" alt=\"미션 오!그림판\" \/>";
		break;
	default :
		nav1 = "<img src=\"http://md.egloos.com/img/vl/wc/menu1_x.gif\" width=\"135\" height=\"25\" border=\"0\" alt=\"2006 독일! 메인\" \/>";
		nav2 = "<img src=\"http://md.egloos.com/img/vl/wc/menu2_x.gif\" width=\"115\" height=\"25\" border=\"0\" alt=\"포토응원로그\" \/>";
		nav3 = "<img src=\"http://md.egloos.com/img/vl/wc/menu3_x.gif\" width=\"115\" height=\"25\" border=\"0\" alt=\"미션 오!그림판\" \/>";
	}

	switch (match)
	{
	case 0 :
		matchout  = "<a href=\"http://valley.egloos.com/wc/wc_valley.php?sd=tournament\" title=\"토너먼트보기\">토너먼트보기</a>";
		break;
	case 1 :
		matchout = "<a href=\"http://valley.egloos.com/wc/wc_valley.php?sd=league\" title=\"조별경기보기\">조별경기보기</a>";
		break;
	default :
		matchout = "";
		break;
	}
	out += ("				<div class=\"main_title\"></div><div class=\"main_sub_link\">" + matchout + "</div><div class=\"main_tab\"><a href=\"http://valley.egloos.com/wc/wc_valley.php\" title=\"2006 독일! 메인\">" + nav1 + "</a> <a href=\"http://valley.egloos.com/wc/wc_photo.php\" title=\"포토응원로그\">" + nav2 + "</a> <a href=\"http://valley.egloos.com/wc/wc_grimpan.php\" title=\"미션 오!그림판\">"  + nav3 + "</a></div>");

    document.writeln( out );
}

/**
 * @deprecated
 * 밸리, 마이에 이오공감 추천
 */
function eo_recommend(permalink, title, offsetX, offsetY) {
	var q='title='+encodeURIComponent(title)+'&plink='+encodeURIComponent(permalink);
	q+='&offsetX='+offsetX+'&offsetY='+offsetY;
	var scriptElm = new Array();
	scriptElm[0]=document.createElement("script");
	scriptElm[0].type="text/javascript";
	scriptElm[0].charset="utf-8";
	scriptElm[0].src="http://www.egloos.com/eofeeling/bookmarklet.php?"+q;
	document.getElementsByTagName('head').item(0).appendChild(scriptElm[0]);
}

function togglePwdBox(el, className, isFocus) {
  el.style.display='none';
  var that = document.getElementsByClassName(className)[0];
  that.style.display='';
  if (isFocus) that.focus();
}

// This stops the javascript from hiding -->
