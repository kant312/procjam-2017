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
const EMBLEM_PER_ROW= 24;
const EMBLEM_PER_COL= 24;
const EMBLEM_WIDTH	= WIDTH/EMBLEM_PER_ROW;
const EMBLEM_HEIGHT	= HEIGHT/EMBLEM_PER_COL;
const NB_EMBLEMS	= EMBLEM_PER_ROW * EMBLEM_PER_COL;
const HUE_TRESHOLD	= 20;
const SATURATION	= 60;
const LUMINOSITY	= 80;
const SIZE_TRESHOLD = .7;

const sketch = function(p) {

	let emblems = [];
	let mainHue = 0;

	const plusOrMinus = function() {
		return (p.random(10) < 5) ? 1 : -1;
	}

	const avoidLimits = function(nb, lower, upper) {
		return (nb < lower) ? lower : (nb > upper) ? upper : nb;
	}

	const getCoordinates = function(idx) {
		return {
			x: Math.floor((EMBLEM_WIDTH * idx) % WIDTH),
			y: (idx === 0) ? 0 : Math.floor((EMBLEM_WIDTH * idx) / WIDTH) * EMBLEM_HEIGHT
		};
	}

	const getRandomSizes = function(width, height) {
		return {
			width: (width/2) + p.random(width/2),
			height: (height/2) + p.random(height/2)
		}
	}

	const generateEmblems = function(nbEmblems) {
		const emblems = [];
		for(let i=0; i<nbEmblems; i++) {
			let coords = getCoordinates(i);
			let sizes = getRandomSizes(EMBLEM_WIDTH, EMBLEM_HEIGHT);
			emblems.push({
				color: [avoidLimits(mainHue + (plusOrMinus() * p.random(HUE_TRESHOLD)), 0, 255), SATURATION, LUMINOSITY],
				posX: coords.x + (EMBLEM_WIDTH/2),
				posY: coords.y + (EMBLEM_HEIGHT/2),
				width: sizes.width,
				height: sizes.height
			})
		}
		console.log(emblems);

		return emblems;
	};

	const changeEmblemSize = function(emblem) {
		const newEmblem = Object.assign(emblem);
		newEmblem.width = avoidLimits(newEmblem.width + (SIZE_TRESHOLD * plusOrMinus()), 0, EMBLEM_WIDTH);
		newEmblem.height = avoidLimits(newEmblem.height + (SIZE_TRESHOLD * plusOrMinus()), 0, EMBLEM_HEIGHT);

		return newEmblem;
	}

	const renderEmblem = function(emblem) {
		p.fill(...emblem.color);
		p.rect(emblem.posX, emblem.posY, emblem.width, emblem.height);
	}
	
	/**
	 * Init sketch
	 */
	p.setup = function() {
		p.randomSeed(p.random(10000));
	  	p.frameRate(FRAMERATE);
	  	p.noStroke();
	  	p.colorMode(p.HSB);
	  	p.rectMode(p.CENTER);
	  	mainHue = p.random(255);
		p.createCanvas(WIDTH, HEIGHT);
		emblems = generateEmblems(NB_EMBLEMS, mainHue);
	}

 	/**
	 * Render one frame
	 */
	p.draw = function() {
		p.background(...BG_COLOR);
		emblems = emblems.map( e => changeEmblemSize(e) );
		emblems.map( e => renderEmblem(e) );
	}
}

new p5(sketch);