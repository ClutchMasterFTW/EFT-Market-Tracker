let items;
if(localStorage.getItem("maxItemsToLoad") == (undefined || null)) localStorage.setItem("maxItemsToLoad", 50);
let maxItemsToLoad = parseInt(localStorage.getItem("maxItemsToLoad"));
let showing = 0;

fetch('https://api.tarkov.dev/graphql', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	body: JSON.stringify({
		query: `{
			items {
	  			name
				shortName
				types
				avg24hPrice
				basePrice
				width
				height
				changeLast48hPercent
				iconLink
				link
				sellFor {
					price
					source
				}
				updated
			}
		}`})
})
	.then(r => r.json())
	// .then(data => console.log('data returned:', data))
	.then(data => {
		items = data.data.items;
		constructDataIntoHTML();
		// console.log(items[0])
	});

function constructDataIntoHTML() {
	let content = $("#content");
	for(i = 0; i < maxItemsToLoad; i++) {
		let container = $("<div class='item-container'></div>");
		let image = $("<div style='position: relative; width: 80px; height: 80px;'><img src='" + items[i].iconLink + "' class='item-icon' title='" + items[i].name + "'></div>");
		let shortName = $("<p class='item-short-name'>" + items[i].shortName + "</p>");
		let name = $("<p class='item-name'>" + items[i].name + "</p>");
		let fleaPrice;

		content.append(container.append(image.append(shortName)));
		showing++;
		//There will be an issue when the search feature is implemented with "items" being plural when there is only 1 item found in a query
		$("#showing").html("<u>Showing <b>" + numberWithCommas(showing) + "</b> items</u>");
		console.log(items[i]);
	};
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}