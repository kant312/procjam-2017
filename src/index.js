/**
 * Imports 
 */
const p5 = require ('./libs/p5.min.js');

/**
 * Constants
 */
const WIDTH 		= 1024;
const HEIGHT 		= 768;
const FRAMERATE 	= 60;
const BG_COLOR		= [50, 20, 30];
const EMBLEM_PER_ROW= 24;
const EMBLEM_PER_COL= 24;
const EMBLEM_WIDTH	= WIDTH/EMBLEM_PER_ROW;
const EMBLEM_HEIGHT	= HEIGHT/EMBLEM_PER_COL;
const NB_EMBLEMS	= EMBLEM_PER_ROW * EMBLEM_PER_COL;
const HUE_TRESHOLD	= 20;
const SATURATION	= 60;
const LUMINOSITY	= 80;
const SIZE_TRESHOLD = 1.7;

const sketch = function(p) {

	let emblems = [];
	let nbEmblems = 0;
	let mainHue = 0;
	let loopIdx = 0;
	let startTime = new Date().getTime();

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

	const generateEmblem = function(i, hue) {
		let coords = getCoordinates(i);
		let sizes = getRandomSizes(EMBLEM_WIDTH, EMBLEM_HEIGHT);
		let emblem = {
			color: [avoidLimits(mainHue + (plusOrMinus() * p.random(HUE_TRESHOLD)), 0, 255), SATURATION, LUMINOSITY],
			posX: coords.x + (EMBLEM_WIDTH/2),
			posY: coords.y + (EMBLEM_HEIGHT/2),
			width: sizes.width,
			height: sizes.height,
			rotation: p.random(Math.PI * 2)
		};

		/* if(p.random(1) < 0.5) {
			emblem.width = emblem.height = 0;
		} */

		return emblem;
	}

	const changeEmblemSize = function(emblem) {
		const newEmblem = Object.assign(emblem);
		newEmblem.width = avoidLimits(newEmblem.width + (SIZE_TRESHOLD * plusOrMinus()), 0, EMBLEM_WIDTH);
		newEmblem.height = avoidLimits(newEmblem.height + (SIZE_TRESHOLD * plusOrMinus()), 0, EMBLEM_HEIGHT);
		newEmblem.rotation = newEmblem.rotation + ((SIZE_TRESHOLD)/100) % Math.PI*2;

		return newEmblem;
	}

	const renderEmblem = function(emblem) {
		p.push();
		p.fill(...emblem.color);
		p.translate(emblem.posX, emblem.posY);
		p.rotate(emblem.rotation);
		p.rect(0, 0, emblem.width, emblem.height);
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
	  	mainHue = p.random(255);
		p.createCanvas(WIDTH, HEIGHT);
	}

 	/**
	 * Render one frame
	 */
	p.draw = function() {
		p.background(...BG_COLOR);
		emblems = emblems.map( e => changeEmblemSize(e) );
		emblems.map( e => renderEmblem(e) );

		if( NB_EMBLEMS > nbEmblems ) {
			emblems.push(generateEmblem(nbEmblems, mainHue));
			nbEmblems++;
		}
		else {
			mainHue = (loopIdx == 0) ? p.random(255) : mainHue;
			emblems[loopIdx] = generateEmblem(loopIdx, mainHue);
			loopIdx = (loopIdx + 1) % NB_EMBLEMS;
		}
	}
}

new p5(sketch);