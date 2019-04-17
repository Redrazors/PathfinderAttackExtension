

// adds the button when page loaded in d20pfsrd only if the option is selected in the popup
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete') {
		chrome.storage.sync.get({
			d20pfsrd: true
		}, function(items) {
		  if (items.d20pfsrd){
			chrome.tabs.sendMessage(tab.id, {message: 'no message', command: 'addButtons'});
		  }   
		});
					
	}
});