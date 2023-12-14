function click_div_type(id)
{
    if (document.getElementById(id).style.display == "none")
        show_div_type(id);
    else
        hide_div_type(id);
    return;
}
 
function show_div_type(id)
{
    document.getElementById(id).style.display = "";
    return;
}
 
function hide_div_type(id)
{
    document.getElementById(id).style.display = "none";
    return;
}

function cutStr(str,limit){
    var tmpStr = str;
    var byte_count = 0;
    var len = str.length;
    var dot = "";

    for(i=0; i<len; i++){
        byte_count += chr_byte(str.charAt(i));
        if(byte_count == limit-1){
            if(chr_byte(str.charAt(i+1)) == 2){
                tmpStr = str.substring(0,i+1);
                dot = "...";
            }else {
                if(i+2 != len) dot = "...";
                tmpStr = str.substring(0,i+2);
            }
            break;
        }else if(byte_count == limit){
            if(i+1 != len) dot = "...";
            tmpStr = str.substring(0,i+1);
            break;
        }

    }
    return tmpStr+dot;
}

function chr_byte(chr){
    if(escape(chr).length > 4)
        return 2;
    else
        return 1;
}

function change_type(cgiid, cgname) {
    $('srch_catename').value = cgname;
    if( $('select_type') ) { 
        $('select_type').title = cgname;
    }

    if(cgiid == 0){
        $('srch_cateid').value = "";
    } else {
        if(getByleLength(cgname) > 24){
            cgname = cutStr(cgname,16);
        } 
        $('srch_cateid').value = cgiid;
    }
    $('cate_option').innerHTML = cgname;
    hide_div_type('cate_select');

    return;
}


function getByleLength(str) {
    var len = 0;
    var str = str.substring(0);

    if(str == null) return 0;

    for(var i=0;i<str.length;i++) {
        var ch = escape(str.charAt(i));

        if(ch.length == 1) {
            len++;
        } else if (ch.indexOf("%u") != -1) {
            len +=2;
        } else if(ch.indexOf("%") != -1) {
            len += ch.length/3;
        }
    }
    return len;
}


function tag_filter(no, type) 
{
    if(type == 0) {
        document.getElementById("tag_filter_" + no).style.display = "none";
        document.getElementById("search_tag_filter_" + no).className = "search_tag on";
        document.getElementById("filter_txt_" + no).innerHTML = "사용";
        document.getElementById("search_tag_filter_" + no).title = "사용";
        document.getElementById("search_tag_filter_" + no).href = "javascript:tag_filter("+ no +",1);";

    }
    else {
        document.getElementById("tag_filter_" + no).style.display = "block";
        document.getElementById("search_tag_filter_" + no).className = "search_tag";
        document.getElementById("filter_txt_" + no).innerHTML = "취소";
        document.getElementById("search_tag_filter_" + no).title = "취소";
        document.getElementById("search_tag_filter_" + no).href = "javascript:tag_filter("+ no +",0);";
    }
}

function v_search(no,theme) 
{
    var wi =  window;                                                            
    var h = wi.innerHeight || (wi.document.documentElement.clientHeight || wi.document.body.clientHeight);
    if(theme){
        if(no == 1) {
            $('left_ul').style.height = Math.max(0,(h - 123))+"px";              
            document.getElementById("searchArea").style.display = "none";
            document.getElementById("v_search").className = "v_search";
            document.getElementById("v_search").href = "javascript:v_search(0,'"+theme+"');";
        }
        else {
            $('left_ul').style.height = Math.max(0,(h - 162))+"px";              
            document.getElementById("searchArea").style.display = "block";
            document.getElementById("v_search").className = "v_search on";
            document.getElementById("v_search").href = "javascript:v_search(1,'"+theme+"');";
        }
    } else {
        alert("전체 테마 검색은 지원하지 않습니다.\n테마 선택 후 검색해 주세요.");
    }

}


function tab_change(no) {
    if(no == 1) {
        document.getElementById("LinkArea_1").style.display = "block";
        document.getElementById("LinkArea_2").style.display = "none";
        document.getElementById("newsLink_1").className = "selected";
        document.getElementById("myegloo_2").className = "";
        document.getElementById("tab1").className= "egloolink_on";
        document.getElementById("tab2").className= "myegloo";

    }

    if(no == 2) {
        document.getElementById("LinkArea_1").style.display = "none";
        document.getElementById("LinkArea_2").style.display = "block";
        document.getElementById("myegloo_2").className = "selected";
        document.getElementById("newsLink_1").className = "";
        document.getElementById("tab1").className= "egloolink";
        document.getElementById("tab2").className= "myegloo_on";


    }

}


//섹션 검색 사용 script 

var new_margin = 0;
var current_margin = 0;


function simpleview(no) {
    var loc = document.getElementById('simpleview_url'+no);
    var right_div_height = document.getElementById('rightMain').offsetHeight;

    current_margin = document.getElementById('footer').style.marginTop;

    if(loc.style.display == 'block') {
        loc.style.display = 'none'; 
        document.getElementById('simpleview_iframe'+no).style.display='none';
        document.getElementById('p'+no).style.display='none';

        new_margin = parseInt(current_margin)-520;

    } else {
        loc.style.display = 'block';
        document.getElementById('simpleview_iframe'+no).style.display='block';
        document.getElementById('p'+no).style.display='block';

        new_margin = parseInt(current_margin)+520;

    }
    document.getElementById('footer').style.marginTop = new_margin+"px";
    document.getElementById('footer').style.marginTop = "-6px";
}


function choice_li(o) {
    // 익스플로러이면 버전 6 ,7 
    if(( navigator.appVersion.indexOf("MSIE 6") > -1) || (navigator.appVersion.indexOf("MSIE 7") > -1)){         
        o.setAttribute('className', 'on f-clear');
    }else { 
        o.setAttribute('class', 'on f-clear');
    }
}

function cancel_li(o) {
    // 익스플로러이면 버전 6 ,7 
    if(( navigator.appVersion.indexOf("MSIE 6") > -1) || (navigator.appVersion.indexOf("MSIE 7") > -1)){         
        o.setAttribute('className', 'f-clear');
    }else { 
        o.setAttribute('class', 'f-clear');
    }
}


