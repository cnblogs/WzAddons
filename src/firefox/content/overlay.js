var cwz = {
	init: function () {
	},
	showWindow: function (event) {
		if (event.button == 0) {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.cwz.");
			var a = prefs.getBoolPref("silentPost");
			if (a) {
				var currentWebDoc = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService().QueryInterface(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser").getBrowser().mCurrentBrowser.contentDocument;
				var xmlHttp = new XMLHttpRequest;
				var wz = {};
				wz.url = currentWebDoc.location;
				wz.title = escape(currentWebDoc.title);
				xmlHttp.open("post", 'http://wz.cnblogs.com/ajax/wz/AddWZ', true);
				xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				xmlHttp.send(JSON.stringify(wz));
				return;
			}
			window.open("chrome://cwz/content/cwz.xul", "cwz", "chrome,resizable=no,centerscreen", this);
			var win = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("cwz");
			if (win) {
				win.focus();
			}
		} else if (event.button == 2) {
			window.openDialog("chrome://cwz/content/option.xul", "cwzoption", "chrome,resizable=no,centerscreen", this);
			var win = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("cwzoption");
			if (win) {
				win.focus();
			}
		}
	}
}
window.addEventListener("load", cwz.init, false);