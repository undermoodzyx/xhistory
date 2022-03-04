const cp = require('child_process');
const { getAllOpenedRecentFiles } = require('./open_recent');

let cache;

window.exports = {
	"xhistory": {
		 mode: "list",
		 args: {
				enter: async (action, callbackSetList) => {
					if (!cache) {
						cache = await getAllOpenedRecentFiles();
						callbackSetList(cache);
						return;
					}

					callbackSetList(cache);
				},
				search: (action, searchWord, callbackSetList) => {	
					if (!Array.isArray(cache)) {
						return;
					}
					
					 const searchList = cache.filter((item) => {
						 return item.title.toLowerCase().includes(searchWord);
					 });
					 callbackSetList(searchList);
				},
				select: (action, itemData, callbackSetList) => {
					const url = itemData.url;
					window.utools.hideMainWindow();	
					cp.exec(`/usr/local/bin/code ${url}`, (err) => {
						if (err) {
							callbackSetList({
								title: 'error',
								description: '打开文件出错，联系开发者',
								url: '',
							});
						}
						window.utools.outPlugin();
					});	
				},
				placeholder: "搜索项目名称"
		 } 
	}
}