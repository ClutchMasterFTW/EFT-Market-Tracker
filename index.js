let items;
if(localStorage.getItem("maxItemsToLoad") == (undefined || null)) localStorage.setItem("maxItemsToLoad", 50);
let maxItemsToLoad = parseInt(localStorage.getItem("maxItemsToLoad"));
let showing = 0;

function fetchData() {
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
	})
	.then($("#last-updated").html("Last updated <b>now</b>."));
}
fetchData();

function constructDataIntoHTML() {
	let content = $("#content");
	//Remove loading text
	$("#legend-section").css("visibility", "visible");
	content.html("");
	for(i = 0; i < maxItemsToLoad; i++) {
		let container = $("<div class='item-container'></div>");
		let image = $("<div style='position: relative; width: 80px; height: 80px;'><img src='" + items[i].iconLink + "' class='item-icon' title='" + items[i].name + "'></div>");
		let shortName = $("<p class='item-short-name'>" + items[i].shortName + "</p>");
		let name = $("<p class='item-name'>" + items[i].name + "</p>");
		let fleaPrice = $("<p class='item-flea-price'>Not Sellable</p>");
		for(j = 0; j < items[i].sellFor.length; j++) {
			if(items[i].sellFor[j].source == "fleaMarket") fleaPrice.html(numberWithCommas(items[i].sellFor[j].price) + "₽");
		}
		//Price, Index of person
		let bestResult = [0, 0];
		for(j = 0; j < items[i].sellFor.length; j++) {
			if(items[i].sellFor[j].price > bestResult[0]) {
				bestResult[0] = items[i].sellFor[j].price;
				bestResult[1] = items[i].sellFor[j].source;
			}
		}
		let pricePerSlot = $("<div class='item-price-per-slot-container'>\
							  	<p class='item-price-per-slot'>" + calculatePricePerSlot(bestResult[0], items[i].width, items[i].height) + "</p>\
							  </div>");

		content.append(container.append(image.append(shortName)).append(name).append(fleaPrice).append(pricePerSlot));
		showing++;
		//There will be an issue when the search feature is implemented with "items" being plural when there is only 1 item found in a query
		$("#showing").html("<u>Showing <b>" + numberWithCommas(showing) + "</b> items</u>");
		console.log(items[i]);
	};

	let seconds = 0;
	let lastUpdatedHTML = $("#last-updated");
	lastUpdated = setInterval(function() {
		seconds++;

		switch(seconds >= 5) {
			case seconds >= 300:
				lastUpdatedHTML.html("Last updated <b>>5 minutes</b> ago.");
				break;
			case seconds >= 240:
				lastUpdatedHTML.html("Last updated <b>4 minutes</b> ago.");
				break;
			case seconds >= 180:
				lastUpdatedHTML.html("Last updated <b>3 minutes</b> ago.");
				break;
			case seconds >= 120:
				lastUpdatedHTML.html("Last updated <b>2 minutes</b> ago.");
				break;
			case seconds >= 60:
				lastUpdatedHTML.html("Last updated <b>a minute</b> ago.");
				break;
			case seconds >= 30:
				lastUpdatedHTML.html("Last updated <b>30 seconds</b> ago.");
				break;
			case seconds >= 20:
				lastUpdatedHTML.html("Last updated <b>20 seconds</b> ago.");
				break;
			case seconds >= 15:
				lastUpdatedHTML.html("Last updated <b>15 seconds</b> ago.");
				break;
			case seconds >= 10:
				lastUpdatedHTML.html("Last updated <b>10 seconds</b> ago.");
				break;
			case seconds >= 5:
				lastUpdatedHTML.html("Last updated <b>5 seconds</b> ago.");
		}
	}, 1000);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculatePricePerSlot(price, width, height) {
	let slotSize = width * height;
	return numberWithCommas(Math.floor(price / slotSize));
}

function update() {
	clearInterval(lastUpdated);
	fetchData();
}