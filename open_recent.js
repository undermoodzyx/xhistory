const fs = require('fs');
const path = require('path');

const editors = {
	vscode: {
		getOpenedRecentFiles() {
			const data = fs.readFileSync(`${process.env.HOME}/Library/Application Support/Code/storage.json`, 'utf8');
			let storedJson;
			try {
				storedJson = JSON.parse(data);
			}
			catch (e) {
				storedJson = {};
			}
			const items = storedJson?.lastKnownMenubarData?.menus?.File?.items ?? [];
			const openRecentInfo = items.find(item => {
				return item?.id === 'submenuitem.33';
			});

			if ('object' !== typeof openRecentInfo) {
				return [];
			}

			const openRecentItems = openRecentInfo?.submenu?.items ?? [];
			if (!Array.isArray(openRecentItems)) {
				return [];
			}

			const recentFiles = openRecentItems.filter((item) => {
				return ['openRecentFolder', 'openRecentFile'].includes(item?.id);
			});

			return recentFiles.map((fileInfo) => {
				const filePath = fileInfo?.uri?.path;
				return {
					title: path.basename(filePath),
					description: filePath,
					url: filePath,
					// icon: '', todo: icon
				};
			});
		},
	},
};

module.exports = editors;