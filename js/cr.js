<!-- Begin to hide script contents from old browsers.
var copy_content = {
    div: null,
    div_cont: null,
	html: [],
    id:"",
	ch_copy: 0,
	
	copy_init:function(event,arg,url,nick,version){
		var entry_content = arg.getElementsByTagName('span').item(0).title;

		var tempObjects = entry_content.split("@@**@@");
		var title = tempObjects[0];
		var copylink = tempObjects[1];

		if(title == undefined || copylink == undefined) return false;

		var only_copyright = '';
		if (version == 2) {
			copyright_cont = '<DIV style="PADDING: 2px; MARGIN: 2px;BACKGROUND-COLOR: rgb(255,255,204)"><SPAN style="FONT-SIZE: 10pt">죄송합니다. ' + url + '의 ' + nick + '님은 <BR>글 내용이 다른 곳에 복사되는 것을 원하지 않습니다.<BR>출처링크를 사용해주세요.</SPAN></DIV><BR>';
		} else {
			copyright_cont = '출처:';
		}
		
		copy_content.html = copyright_cont+"<a href='"+copylink+"' target='_blank'><u>"+title+"</u></a>";
        copy_content.div = document.createElement("div");
        copy_content.div_cont = document.createElement("div");
        copy_content.div.className = "copy_egloos";
		copy_content.ff_id_check = 0;
		copy_content.copy(version);
    },
   
	copy_init_ff:function(event,arg,url,nick,version){
		var ancestornode;
        var ancestor_name;
        var cnt = 0;
		if(window.getSelection){
            sel = window.getSelection();
            if (sel.getRangeAt) {
                rng = sel.getRangeAt(0);
                ancestornode = rng.commonAncestorContainer;

				while(ancestornode.className != 'hentry'){
//                    ancestornode = ancestornode.className;
					ancestornode = ancestornode.parentNode;
                    
					if (cnt==15) return;
                	cnt++;                          
                }
				arg = ancestornode;	
            }
        }else{
				return false;
		}
		
		copy_content.copy_init(event,arg,url,nick,version);
    },	
	remove_dup_copy:function(){
        var copy_div = document.getElementsByClassName('copy_egloos');
        if(copy_div != null){
            for(var div_cnt=0; div_cnt < copy_div.length; div_cnt++ ){
                copy_div[div_cnt].remove();
            }
        }
    },
	copy_mdf: function(version,browMode,rng,sel){

		var org = '';
		var newstr = '';
		var node;
		var sOff = 0;
		if(version == 1) var limit = 200; 
		else if (version == 2) var limit = 0;
		
		if(browMode == 'FF' ){
			
			org = rng.toString();
			if ( limit > org.length ) { 
				newstr = rng.toString();
			}
			else {
			    node = sel.anchorNode; //left selection
			    if(rng.startOffset != sel.anchorOffset){
			      node = sel.focusNode; //right selection
			    }
				  
				sOff = rng.startOffset;
			    nodes = node.parentNode;
			    var child = '';
			    var nodeCnt = nodes.childNodes.length;
				var isFind = false;
				var tmp ='';
				var eOff = 0;
				
				for ( i = 0; i < nodeCnt; i++ ) {
					child = nodes.childNodes[i];
					if ( child.nodeType != 3 ) { //Node.TEXT_TYPE
						continue;
					}
					
					if ( child.nodeValue == node.nodeValue ) {
						tmp = child.nodeValue.substring(sOff,child.nodeValue.length);
						isFind = true;
					} else {
						tmp = child.nodeValue;
					}
					if ( !isFind ) {
						continue;
					}
			        if ( limit > tmp.length ) {
						limit -= tmp.length;
						continue;
					}
					if(node.isSameNode(child)){
						eOff = sOff + limit;
					} else {
						eOff = limit;
					}
					break;
				}
				
				rng.setStart(node, sOff);

				try{
					rng.setEnd(child, eOff);
					if(eOff==0)	{
						rng.setEnd(node, sOff);
					} else {
						rng.setEnd(child, eOff);
					}
				} catch (e){}
			}
		} else {

			var calc = 0;
			if(version == 1 && rng.text.length > 200 && copy_content.ch_copy == 0){
				calc = -(rng.text.length - 200);
				alert('해당 블로그는 200자까지만 복사 되도록 설정 되어 있습니다.\n복사되는 부분까지만 영역이 변경됩니다.');
				rng.moveEnd("character",calc);
			} else if (version == 2){
				//calc = -(rng.text.length);
				var match = rng.findText (' ');
				if (match) rng.select();
				
			}
			copy_content.ch_copy = 1;
		}
	},
	copy: function(version){
		var sel;
        var rng;
        var id ="copy_cont";
		var calc = 0;
		copy_content.ch_copy = 0;		
		copy_content.div.innerHTML = copy_content.html;
		
		if (window.getSelection) {
			sel = window.getSelection();
            copy_content.remove_dup_copy();
            if (sel.getRangeAt) {
				rng = sel.getRangeAt(0);
				var orgtext = rng.toString();
				if (orgtext.length <= 60) {
					return false;
				}
				if(version == 2){
					copy_content.copy_mdf(version,'FF',rng,sel);
				}
				dup = rng.cloneRange();
            }

			dup.collapse(false);
            dup.insertNode(copy_content.div);
            rng.setEndAfter(copy_content.div);
            sel.removeAllRanges();
            sel.addRange(rng);
            
	    } else if (document.selection) {
	    	sel = document.selection;
			rng = sel.createRange();
			if(rng.text.length <= 60){
				return false;
			}
			if(version == 2){
				copy_content.copy_mdf(version,'IE',rng,sel);
			}
			dup = rng.duplicate();
	
            if(rng.parentElement().tagName.toUpperCase() == 'BODY') return; // img only
	        var div = document.createElement("div");
	        var span = document.createElement("span");
	        copy_content.remove_dup_copy();
	        
			span.id = id;
	        dup.collapse(false); 	        
	        dup.pasteHTML(span.outerHTML);
	        span = document.getElementById(id);
			span.insertAdjacentElement("afterEnd", copy_content.div);

			do {
				  rng.moveEnd("character",1);
	              dup = rng.duplicate();
	              dup.collapse(false);

			} while ( dup.offsetLeft == 0 );

	        try {
	           rng.select();
	        } catch(e) {}
	        if (span && span.parentNode) {
	            var par = span.parentNode;
	            span.parentNode.removeChild(span);
	        }
        	sel.empty();
        	rng.select();
			
			
/*			
			///////////////// 정체 불명의 +2, -2 /////////////// 
			if(version == 1){
				var content_len = copy_content.div.innerText.length +2;
			} else if(version == 2){
				var content_len = copy_content.div.innerText.length - 2;
			}
			/////////////// 정체 불명의 +2, -2 ///////////////
//			alert(":"+copy_content.div.innerText+":");
			do {
				try{
					rng.moveEnd("character",1);
				} catch(e){break;}
				dup = rng.duplicate();
				dup.collapse(false);
				content_len--;
//				alert(':'+rng.text+':');
//			}while( dup.offsetLeft == 0 );
			}while(content_len>0)
//			alert(rng.text);
			try {
				//sel.empty();
				rng.select();
	        } catch(e) {}
	        
	        if (span && span.parentNode) {
	            var par = span.parentNode;
	            span.parentNode.removeChild(span);
	        }
		*/
	    
	    }
    },
    keydown:function(e,postclass,url,nick,version){
    	
		if(e.ctrlKey && e.keyCode == 67){
		    copy_content.copy_init_ff(e,postclass,url,nick,version);
        }
    }
}

function copy_contents(url,nick,version){
	if (navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.indexOf('MSIE 8') > 0 ) return;
	if(version == 0) return;
	
	var post_copy_class = document.getElementsByClassName('hentry');
 
    for(i=0; i<post_copy_class.length; i++){

		if (typeof document.body.oncopy != "undefined") {
			Event.observe(post_copy_class[i], 'copy', copy_content.copy_init.bindAsEventListener(this,post_copy_class[i],url,nick,version));
		} else {
            Event.observe(post_copy_class[i], 'contextmenu', copy_content.copy_init.bindAsEventListener(this,post_copy_class[i],url,nick,version));
        }
    }
    if (typeof document.body.oncopy == "undefined") {
		Event.observe(document, 'keydown', copy_content.keydown.bindAsEventListener(this,post_copy_class,url,nick,version));
    }
}
// This stops the javascript from hiding -->
