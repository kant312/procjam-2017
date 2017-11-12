/**
 * Imports 
 */
const p5 = require ('./libs/p5.min.js');

/**
 * Constants
 */
const WIDTH 		= 1024;
const HEIGHT 		= 768;
const FRAMERATE 	= 30;
const BG_COLOR		= [50, 20, 30];
const SATURATION	= 60;
const LUMINOSITY	= 80;
const ROTATION_SPEED= 1.7;

let sizeThreshold 	= 1.7;
let hueThreshold	= 20;
let quadsPerRow 	= 24;
let quadsPerCol 	= 24;
let isPlaying		= true;
let isCycleRegenerationEnabled = true;
let isRandomCoordinatesEnabled = false;

const sketch = function(p) {

	let quads = [];
	let quadWidth	= WIDTH/quadsPerRow;
	let quadHeight = HEIGHT/quadsPerCol;
	let maxQuads = quadsPerRow * quadsPerCol;
	let nbQuads = 0;
	let mainHue = 0;
	let loopIdx = 0;
	let startTime = new Date().getTime();

	const init = () => {
		quads = [];
		quadWidth	= WIDTH/quadsPerRow;
		quadHeight = HEIGHT/quadsPerCol;
		maxQuads = quadsPerRow * quadsPerCol;
		nbQuads = 0;
	  	mainHue = p.random(255);
		loopIdx = 0;
	};
	

	const plusOrMinus = function() {
		return (p.random(10) < 5) ? 1 : -1;
	}

	const avoidLimits = function(nb, lower, upper) {
		return (nb < lower) ? lower : (nb > upper) ? upper : nb;
	}

	const getCoordinates = function(idx) {
		return {
			x: Math.floor((quadWidth * idx) % WIDTH),
			y: (idx === 0) ? 0 : Math.floor((quadWidth * idx) / WIDTH) * quadHeight
		};
	}

	const getRandomSizes = function(width, height) {
		return {
			width: (width/2) + p.random(width/2),
			height: (height/2) + p.random(height/2)
		}
	}

	const generateQuad = function(i, hue) {
		let coords = (isRandomCoordinatesEnabled) ? getCoordinates(p.random(maxQuads)) : getCoordinates(i);
		let sizes = getRandomSizes(quadWidth, quadHeight);
		let quad = {
			color: [avoidLimits(mainHue + (plusOrMinus() * p.random(hueThreshold)), 0, 255), SATURATION, LUMINOSITY],
			posX: coords.x + (quadWidth/2),
			posY: coords.y + (quadHeight/2),
			width: sizes.width,
			height: sizes.height,
			rotation: p.random(Math.PI * 2)
		};

		return quad;
	}

	const changeQuadSize = function(quad) {
		const newQuad = Object.assign(quad);
		newQuad.width = avoidLimits(newQuad.width + (sizeThreshold 	* plusOrMinus()), 0, quadWidth);
		newQuad.height = avoidLimits(newQuad.height + (sizeThreshold 	* plusOrMinus()), 0, quadHeight);
		newQuad.rotation = newQuad.rotation + ((ROTATION_SPEED)	/100) % Math.PI*2;

		return newQuad;
	}

	const renderQuad = function(quad) {
		p.push();
		p.fill(...quad.color);
		p.translate(quad.posX, quad.posY);
		p.rotate(quad.rotation);
		p.rect(0, 0, quad.width, quad.height);
		p.pop();
	}
	
	/**
	 * Init sketch
	 */
	p.setup = function() {
		p.randomSeed(p.random(10000));
		p.angleMode(p.RADIANS);
	  	p.frameRate(FRAMERATE);
	  	p.noStroke();
	  	p.colorMode(p.HSB);
	  	p.rectMode(p.CENTER);
		p.createCanvas(WIDTH, HEIGHT);

		init();
	}

 	/**
	 * Render one frame
	 */
	p.draw = function() {
		if(!isPlaying) {
			return;
		}

		p.background(...BG_COLOR);
		quads = quads.map( e => changeQuadSize(e) );
		quads.map( e => renderQuad(e) );

		if( maxQuads > nbQuads ) {
			quads.push(generateQuad(nbQuads, mainHue));
			nbQuads++;
		}
		else if(isCycleRegenerationEnabled) {
			mainHue = (loopIdx == 0) ? p.random(255) : mainHue;
			quads[loopIdx] = generateQuad(loopIdx, mainHue);
			loopIdx = (loopIdx + 1) % maxQuads;
		}
	}

	/**
	 * Export the image
	 */
	const exportImage = () => {
		p.saveCanvas('quadrilaterals', 'png');
	};

	/**
	 * Controls 
	 */
	const controls = function(form) {
		let playPause = form.querySelector('#playPause');
		let nbQuadsPerRow = form.querySelector('#nbQuadsPerRow');
		let nbQuadsPerCol = form.querySelector('#nbQuadsPerCol');
		let hueThresholdInput = form.querySelector('#hueThreshold');
		let sizeThresholdInput = form.querySelector('#sizeThreshold');
		let saveCanvasButton = form.querySelector('#saveCanvasButton');
		let cycleRegenerationCheckbox = form.querySelector('#cycleRegenerationCheckbox');
		let randomCoordinatesCheckbox = form.querySelector('#randomCoordinatesCheckbox');

		const initControls = function() {
			nbQuadsPerRow.value = quadsPerRow;
			nbQuadsPerRow.addEventListener('input', (e) => {
				quadsPerRow = e.target.value;
				init();
			});

			nbQuadsPerCol.value = quadsPerCol;
			nbQuadsPerCol.addEventListener('input', (e) => {
				quadsPerCol = e.target.value;
				init();
			});

			playPause.addEventListener('click', (e) => {
				isPlaying = !isPlaying;
				e.target.value = (isPlaying) ? 'Pause' : 'Play';
			});

			hueThresholdInput.value = hueThreshold;
			hueThresholdInput.addEventListener('input', (e) => {
				hueThreshold = e.target.value;
			});

			sizeThresholdInput.value = sizeThreshold;
			sizeThresholdInput.addEventListener('input', (e) => {
				sizeThreshold = e.target.value;
			});

			saveCanvasButton.addEventListener('click', (e) => {
				exportImage();
			});

			if(isCycleRegenerationEnabled) {
				cycleRegenerationCheckbox.setAttribute('checked', 'checked');
			}
			else {
				cycleRegenerationCheckbox.removeAttribute('checked');
			}
			cycleRegenerationCheckbox.addEventListener('click', (e) => {
				isCycleRegenerationEnabled = !isCycleRegenerationEnabled;
			});

			if(isRandomCoordinatesEnabled) {
				randomCoordinatesCheckbox.setAttribute('checked', 'checked');
			}
			else {
				randomCoordinatesCheckbox.removeAttribute('checked');
			}
			randomCoordinatesCheckbox.addEventListener('click', (e) => {
				isRandomCoordinatesEnabled = !isRandomCoordinatesEnabled;
			});
		};

		initControls();

	}

	new controls(document.getElementById('controls'));
}

new p5(sketch);