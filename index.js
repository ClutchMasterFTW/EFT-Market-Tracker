let items;
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
	for(i = 0; i < items.length; i++) {
		let container = $("<div class='item-container'></div>");
		let image = $("<img src='" + items[i].iconLink + "' class='item-icon' title='" + items[i].name + "'>");

		content.append(container.append(image));
		showing++;
		//There will be an issue when the search feature is implemented with "items" being plural when there is only 1 item found in a query
		$("#showing").html("<u>Showing <b>" + numberWithCommas(showing) + "</b> items</u>");
		// console.log(items[i]);
	};
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}