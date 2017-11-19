function onLoad()
{
	var currentWebDoc = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService().QueryInterface(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").getBrowser().mCurrentBrowser.contentDocument;
	document.getElementById("tb_url").value = currentWebDoc.location;
	document.getElementById("tb_title").value = currentWebDoc.title;
}

function htmlEncode(str) {
    var div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    div.textContent = str;
    return div.innerHTML;
}

function addwz()
{
	var isprivate = "on";
    if (document.getElementById("isPrivate").checked) {
        isprivate = "";
    }
	var wz = {};
    wz.url = document.getElementById("tb_url").value;
    wz.title = document.getElementById("tb_title").value;
    wz.tags = document.getElementById("tb_tags").value;
    wz.summary = document.getElementById("ta_summary").value;
    wz.isPrivate = isprivate;
    if (wz.tags.length > 0) {
        wz.tags = wz.tags.replace(/£¬/g, ',');
    }
    if (wz.summary.length > 200) {
        wz.summary = wz.summary.substring(0, 200);
    }
    document.getElementById("btnaddwz").label = "please wait...";
    document.getElementById("btnaddwz").style.width = "100px";
    document.getElementById("btnaddwz").disabled = true;
    wz.url = encodeURIComponent(wz.url);
    wz.title = encodeURIComponent(htmlEncode(wz.title));
    wz.tags = encodeURIComponent(wz.tags);
    wz.summary = encodeURIComponent(htmlEncode(wz.summary));
	var xmlHttp = new XMLHttpRequest;
	xmlHttp.open("post", 'http://wz.cnblogs.com/ajax/wz/AddWZ' , true);
	xmlHttp.onreadystatechange = function () {
	    if (xmlHttp.readyState == 4) {
	        if (xmlHttp.status == 200) {
	            result = JSON.parse(xmlHttp.responseText);
	            if (result.message === document.getElementById("loginText").value) {
	                document.getElementById("as").value = result.message;
	                document.getElementById("panel_add").style.display = "none";
	                document.getElementById("loginl").style.display = "block";
	            }
	            else {
	                document.getElementById("as").value = result.message;
	                document.getElementById("panel_add").style.display = "none";
	                document.getElementById("closet").style.display = "block";
	                var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.cwz.");
	                var a = prefs.getBoolPref("quickClose");
	                if (a) {
	                    window.opener = null;
	                    window.close();
	                }
	                else {
	                    setTimeout("window.opener=null;window.close()", 3000);
	                }
	            }
	        }
	    }
	}
	xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xmlHttp.send(JSON.stringify(wz));
}

function $(ID) {
    var element = document.getElementById(ID);
    if (element) {
        element.css = css;
    }
    return element;
}

function css(prop, value) {
    if (value == null) {
        return this.style[prop];
    }
    if (prop) {
        this.style[prop] = value;
    }
    return true;
}

function addTag(tagName) {
    var TagStr = document.getElementById("tb_tags").value;
    if (TagStr.indexOf(tagName) == -1) {
        if (TagStr == '')
            TagStr = TagStr + tagName;
        else
            TagStr = TagStr + "," + tagName;
        document.getElementById("tb_tags").value = TagStr;
    }
}



function showTag() {
    if ($("tags_box").textContent.length > 1) {
        $("tagselect").css("display", "block");
    }
    else {
        var xmlHttp = new XMLHttpRequest;
        xmlHttp.open("get", 'http://wz.cnblogs.com/ajax/wz/GetUserTags', true);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    showTag_CallBack(xmlHttp.responseText);
                }
            }
        }
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.send(true);
    }
}

function showTag_CallBack(data) {
    $("tagselect").css("display", "block");
    $("select_block").css("cursor", "default");
    data = data.slice(5, -6);

    var frm = document.createElement("iframe");
    frm.style.display = "none";
    document.body.appendChild(frm);

    var win = frm.contentWindow;
    var frmrange = win.document.createRange();
    frmrange.selectNode(win.document.firstChild);
    var frg = frmrange.createContextualFragment(data);
    document.getElementById("tags_box").appendChild(frg);
}

function closeTag() {
    $("tagselect").css("display", "none");
    $("select_block").css("cursor", "pointer");
}