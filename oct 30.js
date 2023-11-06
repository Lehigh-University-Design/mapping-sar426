<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>Mapbox Scrollytelling</title>
	<meta name="description" content="Egyptian Pyramids" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@600&family=Roboto:ital,wght@0,300;0,700;1,300;1,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="css/style.css" />
	<script src='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js'></script>
	<link href='https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css' rel='stylesheet' />
</head>

<body class="scrolly-body">

	<main>

		<section id="intro">
			<div class="inner">
				<h1>Egyptian Pyramids</h1>
				<p>An exploration of the many pyramids of Egypt</p>
			</div>
		</section>

		<section id="scrolly">
			<figure>
				<!--<p class="ind">0</p>-->

				<div id="map"></div>
			</figure>

			<article id="article_container">
				
			</article>
		</section>

		<section id="outro"></section>
	</main>

	<script src="https://unpkg.com/d3@5.9.1/dist/d3.min.js"></script>
	<script src="https://unpkg.com/scrollama"></script>
	<script>

		async function loadData() {
  			const response = await fetch('data/data.geojson', {
				method: 'GET'
			});

  			const data = await response.json();

  			mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2aW5sYWhvZGEiLCJhIjoiY2xuOWJucnEzMDVwcjJ2c2VtNWhuMTY4MCJ9.oDDjkq9KZ6BlMT2IlE6yig';
			const map = new mapboxgl.Map({
				container: 'map', // container ID
				style: 'mapbox://styles/kevinlahoda/clnnkkqnh007g01pfafhlf0ze', // style URL
				center: [31.134799, 29.975990], // starting position [lng, lat]
				zoom: 16, // starting zoom
				bearing: 27,
				pitch: 45
			});

			map.on('load', () => {
				map.addSource('data', {
				type: 'geojson',
				data: data
				});
				 
				map.addLayer({
				'id': 'pyramids-layer',
				'type': 'circle',
				'source': 'data',
				//this is for the map marker
				'paint': {
				'circle-radius': 3,
				'circle-stroke-width': 1,
				'circle-color': 'black',
				'circle-stroke-color': 'black'
				}
				});
			});

			map.scrollZoom.disable();

  			for (const item in data.features) {

			 	//console.log(`${data}: ${data.features[item].id}`);
  				const p = data.features[item];

			 	let div = document.createElement('div');
			 	div.setAttribute("class", "step");
			 	div.setAttribute("id", p.id);
			 	div.setAttribute("data-step", p.id);
			 	div.setAttribute("data-long", p.geometry.coordinates[0]);
			 	div.setAttribute("data-lat", p.geometry.coordinates[1]);
			 	//var pid = item

			 	// header
			 	if(p.properties.Title) {
				 	var header = document.createElement("h2");
				 	//var node = document.createTextNode("Step "+pid);
				 	var node = document.createTextNode(p.properties.Title);
				 	header.appendChild(node);
				 	div.appendChild(header);
			 	}

			 	// image
			 	if(p.properties.Image) {
			 		var img = document.createElement("img");
			 		img.src = p.properties.Image;
			 		div.appendChild(img);
			 	}

			 	// description
			 	if(p.properties.Description) {
			 		var description = document.createElement("div");
			 		description.id = 'description_'+p.id;
			 		description.className = "description";
			 		description.innerHTML = p.properties.Description;
			 		div.appendChild(description);
			 	}

			 	document.getElementById("article_container").appendChild(div);

			}

  			//console.log(data.features);

  			// using d3 for convenience
			var main = d3.select("main");
			var scrolly = main.select("#scrolly");
			var figure = scrolly.select("figure");
			var article = scrolly.select("article");
			var step = article.selectAll(".step");

			// initialize the scrollama
			var scroller = scrollama();

			// generic window resize listener event
			function handleResize() {
				// 1. update height of step elements
				var stepH = Math.floor(window.innerHeight * 0.75);
				step.style("height", stepH + "px");

				var figureHeight = window.innerHeight;
				var figureMarginTop = (window.innerHeight - figureHeight) / 2;

				figure
					.style("height", figureHeight + "px")
					.style("top", figureMarginTop + "px");

				// 3. tell scrollama to update new element dimensions
				scroller.resize();
			}

			// scrollama event handlers
			function handleStepEnter(response) {
				console.log(response);
				//response = { element, direction, index }

				//console.log(response.element.dataset.long)

				map.flyTo({
					center: [response.element.dataset.long, response.element.dataset.lat],
					essential: true // this animation is considered essential with respect to prefers-reduced-motion
				});

				// add color to current step only
				step.classed("is-active", function (d, i) {
					return i === response.index;
				});

				// update graphic based on step
				figure.select("p.ind").text(response.index);
			}


			function init() {


				// 1. force a resize on load to ensure proper dimensions are sent to scrollama
				handleResize();

				// 2. setup the scroller passing options
				// 		this will also initialize trigger observations
				// 3. bind scrollama event handlers (this can be chained like below)
				scroller
					.setup({
						step: "#scrolly article .step",
						offset: 0.33,
						debug: false
					})
					.onStepEnter(handleStepEnter);
			}

			// kick things off
			init();

			}

			loadData();

	</script>
</body>

</html>
