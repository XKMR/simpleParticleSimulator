const canvasDimentions = [500, 500];
const particleCount = 200;
var particlePositions = []
var particleSpeeds = []
var particleAccelerations = []
var particleForces = []

for(i=0; i < particleCount; i+=1){
	particlePositions.push([Math.random()*canvasDimentions[0],Math.random()*canvasDimentions[1]])
	//particlePositions.push([i*2,150])
	particleSpeeds.push([((randomInt(-200,200))),((randomInt(-200,200)))])
	//particleSpeeds.push([i,i])
	particleAccelerations.push([0.0,0.0])
	particleForces.push([0.0,0.0])
}


const particleInfluence = 1;
const particleMass = 1.0;
const energyLoss = 0
const timeStep = 0.01;
const limitForce = true
const forceLimit = 10000
const bounce = true
const animationSpeed = 1

const htmlCanvas = document.getElementById("myCanvas");
const ctx = htmlCanvas.getContext("2d");
htmlCanvas.width = canvasDimentions[0];
htmlCanvas.height = canvasDimentions[1];

function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  

class Particle {
  
	constructor(n) {
      
		this.n = n;
		this.mass = particleMass;
		this.influence = particleInfluence;
		this.position = particlePositions[n];
		this.speed = particleSpeeds[n];
		this.acceleration = particleAccelerations[n];
		this.force = particleForces[n];

	}

	run() {
      
		for(this.c = 0; this.c <= 1; this.c += 1) {
			//console.log(`Particle ${this.n}: Dimension ${this.c === 0 ? 'X' : 'Y'}: Position: ${this.position[this.c]}`);
			if(this.position[this.c] < 0) {
				if(bounce){
					this.speed[this.c] = -this.speed[this.c];
					this.position[this.c] = 0;
				}else{
					this.position[this.c] = canvasDimentions[this.c]
				}
			}

			if(this.position[this.c] > canvasDimentions[this.c]) {
				if(bounce){
					this.speed[this.c] = -this.speed[this.c];
					this.position[this.c] = canvasDimentions[this.c];
				}else{
					this.position[this.c] = 0
				}
			}

			this.force[this.c] = 0;
			for(this.i=0; this.i < particleCount; this.i += 1){
				if(particlePositions[this.n][this.c] != particlePositions[this.i][this.c] && this.i != this.n){
					this.force[this.c] += (1/Math.pow((particlePositions[this.n][this.c] - particlePositions[this.i][this.c]),2)*Math.sign((particlePositions[this.n][this.c] - particlePositions[this.i][this.c])))*particleInfluence;
					if(Math.abs(this.force[this.c]) > forceLimit && limitForce){
						this.force[this.c] = Math.sign(this.force[this.c])*forceLimit
					}
				}
			}
			this.acceleration[this.c] = (this.force[this.c] / this.mass)
			this.speed[this.c] += this.acceleration[this.c] * timeStep;
			this.speed[this.c] = this.speed[this.c] * (1-(energyLoss*timeStep));
			this.position[this.c] += this.speed[this.c] * timeStep;
		}

		return this.position;
	}
}

function renderFrame() {

	var canvas = "";
	const pchar = "[#]";
	const echar = "[ ]";
	var nchar = echar;

	for(j = canvasDimentions[1]; j >= 0; j -= 1) {
		for(i = 0; i <= canvasDimentions[0]; i += 1) {
			for(p = 0; p < particlePositions.length; p += 1) {
				if(Math.round(particlePositions[p][0]) == i && Math.round(particlePositions[p][1]) == j) {
					nchar = pchar;
					break;
				} else {
					nchar = echar;
				}
			}
			canvas += nchar;
		}
		canvas += "\n";
	}
	return canvas;
}


var particles = [];
for(i=0; i < particleCount; i+=1){
	particles.push(new Particle(i))
}

var newPositions = particlePositions;
//var color = true;
function loop() {

	for(i=0; i < particleCount; i+=1){
		newPositions[i] = particles[i].run();
	}
	particlePositions = newPositions;
	//console.log(renderFrame());
	htmlDraw();
	//document.getElementById("myCanvas").style.borderColor=color?"grey":"black";
	//color = !color
}

const colorMap = ["red", "blue", "green", "yellow", "purple", "black"].sort((a, b) => 0.5 - Math.random());

function htmlDraw(){
	ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
	for(i=0; i<particleCount; i+=1){
		ctx.beginPath();
		ctx.arc(particlePositions[i][0], particlePositions[i][1], 7, 0, 2 * Math.PI);
		ctx.fillStyle = colorMap[((i % 6) + 6) % 6];
		ctx.fill();
		ctx.closePath();
	}
}

function loopCall(i) {

	setTimeout(() => {
		loop()
		loopCall(++i);
	}, (timeStep * 1000 * (1/animationSpeed)))

}
loopCall();
