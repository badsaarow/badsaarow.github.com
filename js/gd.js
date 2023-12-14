<!-- Begin to hide script contents from old browsers.
var req   = null;

function XMLHttpConnectGet(url,fnc) {
	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
		eval("req.onreadystatechange = " + fnc);
		req.open("GET", url);
		req.send(null);
	}
	else if (window.ActiveXObject) {
		req = new ActiveXObject("Microsoft.XMLHTTP");
		if (req) {
			eval("req.onreadystatechange = " + fnc);
			req.open("GET", url);
			req.send();
		}
	}
}

function XMLHttpConnectPost(url,data,fnc) {
	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
		eval("req.onreadystatechange = " + fnc);
		req.open("POST", url);
		req.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		req.setRequestHeader ("Referer", location.href);
		req.setRequestHeader ("Accept-Language","ko");
		req.send(data);
	}
	else if (window.ActiveXObject) {
		req = new ActiveXObject("Microsoft.XMLHTTP");
		if (req) {
			eval("req.onreadystatechange = " + fnc);
			req.open("POST", url);
			req.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			req.setRequestHeader ("Accept-Language","ko");
			req.send(data);
		}
	}
}

function rtnXMLHttpConnectGet(url) {
	var rtnXML = "";
	if (url != "") {
		if (window.XMLHttpRequest) {
			req = new XMLHttpRequest();
			req.open("GET", url ,false);
			req.send(null);
			if ( req.readyState == 4 && req.status == 200 )	{rtnXML = req.responseXML;}
		}
		else if (window.ActiveXObject) {
			req = new ActiveXObject("Microsoft.XMLHTTP");
			if (req) {
				req.open("GET", url ,false);
				req.send();
						
				if ( req.readyState == 4 && req.status == 200 ) {rtnXML = req.responseXML;}
			}
		}
	}

	return rtnXML;
}

function rtnXMLHttpConnectPost(url,data,fnc) {
	var rtnXML = "";
	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
		req.open("POST", url,false);
		req.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		req.setRequestHeader ("Accept-Language","ko");
		req.send(data);
		if ( req.readyState == 4 && req.status == 200 )	{rtnXML = req.responseXML;}
	}
	else if (window.ActiveXObject) {
		req = new ActiveXObject("Microsoft.XMLHTTP");
		if (req) {
			req.open("POST", url,false);
			req.setRequestHeader ("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
			req.setRequestHeader ("Accept-Language","ko");
			req.send(data);
			if ( req.readyState == 4 && req.status == 200 )	{rtnXML = req.responseXML;}
		}
	}
	return rtnXML;
}

function setValue() {
	var result = "";
	var cont = "";
	var href = "";
	if (req.readyState == 4 && req.status == 200) {
		var resultnode = req.responseXML.getElementsByTagName("result");
		result = resultnode[0].childNodes[0].nodeValue;
		var contnode = req.responseXML.getElementsByTagName("cont");
		cont = contnode[0].childNodes[0].nodeValue;
		var hrefnode = req.responseXML.getElementsByTagName("href");
		href = hrefnode[0].childNodes[0].nodeValue;
		if (result == "1" )	{
			eval(href);
		}
		else if (result == "2" )	{
			alert(cont);
			eval(href);
		}
		else {
			alert(cont);
		}

	}
}

function resXml() {
	if (req.readyState == 4 && req.status == 200) {
		var contnode = req.responseXML.getElementsByTagName("cont");
		if ( contnode.item(0).firstChild.nodeType == 4 ) // CDATA_SECTION_NODE
			var cont = contnode.item(0).childNodes.item(0).data;
		else if ( contnode.item(0).firstChild.nodeType == 3 && contnode.item(0).childNodes.length == 1 ) // TEXT_NODE  && IE OPERA
			var cont = contnode.item(0).childNodes.item(0).data;
		else { //firefox
			var cont = contnode.item(0).childNodes.item(1).data;
		}
		eval(cont);
	}
}

function resText() {
	if (req.readyState == 4 && req.status == 200) {
		var resfnc = req.responseText;
		eval(resfnc);
	}
}

function empty(){return;}

// This stops the javascript from hiding -->
