const path = require('path');


const sqlite3 = require('sqlite3').verbose();

const editors = {
	vscode: {
		async getOpenedRecentFiles() {
			const db = new sqlite3.Database(`${process.env.HOME}/Library/Application Support/Code/User/globalStorage/state.vscdb`);
			const data = await new Promise((res, rej) => {
				db.get('select value from ItemTable where key="history.recentlyOpenedPathsList";', (err, result) => {
					if (err) {
						rej(err);
						return;
					}
					
					res(result?.value);
				})
			}).catch((er) => {
				console.log(er);
				return {};
			});
	
			let storedJson;
			try {
				storedJson = JSON.parse(data);
			}
			catch (e) {
				storedJson = {};
			}

			const filesInfo = [];
			storedJson?.entries.forEach((item) => {
				const filePath = item?.folderUri || item?.fileUri || '';
				if (!filePath) {
					return;	
				}
				
				const info = {
					title: decodeURIComponent(path.basename(filePath)),
					description: filePath,
					url: filePath.replace(/^file:\/\//, ''),
				};
				if (item?.folderUri) {
					info.isDir = true;
				}
				else if (item.fileUri) {
					info.isFile = true;
				}

				filesInfo.push(info);
			})
			return filesInfo;	
		},
	},
};

async function getAllOpenedRecentFiles() {
	const editorKeys = Object.keys(editors);
	const editorIterator = {
		[Symbol.asyncIterator]() {
			return {
				i: 0,
				async next() {
					if (this.i < editorKeys.length) {
						this.i++;
						return Promise.resolve({
							done: false,
							value: await editors[editorKeys].getOpenedRecentFiles(),
						});
					}

					return Promise.resolve({ done: true });
				}
			};
		},
	};

	let allFiles = [];
	for await (const files of editorIterator) {
		allFiles = allFiles.concat(files);
	}
	return allFiles;
}

exports.getAllOpenedRecentFiles = getAllOpenedRecentFiles;
exports.editors = editors;
