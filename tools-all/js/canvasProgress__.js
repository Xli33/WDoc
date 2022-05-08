/*========================================================*/  
/* Light Loader
/*========================================================*///$target,canvasWidth,canvasHeight,barWidth,barHeight,canvasId
(function(window,document){
	$.canvasProgress__ = function(options){
		var LightLoader = function(c, cw, ch){
			
			var _this = this;
			this.c = c;
			this.ctx = c.getContext('2d');
			this.cw = cw;
			this.ch = ch;

			this.o = options;
			// this.text = options.text || '正在处理中，请稍等！';
			// this.fontSize = options.fontSize || 24;

			this.loaded = 0;
			this.loaderSpeed = options.speed || .6;
			this.loaderHeight = options.barHeight || 10;
			this.loaderWidth = options.barWidth || 310;				
			this.loader = {
				x: (this.cw/2) - (this.loaderWidth/2),
				y: (this.ch/2) - (this.loaderHeight/2)
			};
			this.particles = [];
			this.particleLift = 180;
			this.hueStart = 0
			this.hueEnd = 120;
			this.hue = 0;
			this.gravity = .15;
			this.particleRate = 5;
			
			
			/*========================================================*/	
			/* Particles
			/*========================================================*/
			this.Particle = function(){
				this.x = _this.loader.x + ((_this.loaded/100)*_this.loaderWidth) - _this.rand(0, 1);
				this.y = _this.ch/2 + _this.rand(0,_this.loaderHeight)-_this.loaderHeight/2;
				this.vx = (_this.rand(0,4)-2)/100;
				this.vy = (_this.rand(0,_this.particleLift)-_this.particleLift*2)/100;
				this.width = _this.rand(1,4)/2;
				this.height = _this.rand(1,4)/2;
				this.hue = _this.hue;
			};
			
			this.Particle.prototype.update = function(i){
				this.vx += (_this.rand(0,6)-3)/100; 
				this.vy += _this.gravity;
				this.x += this.vx;
				this.y += this.vy;
				
				if(this.y > _this.ch){
					_this.particles.splice(i, 1);
				}					
			};
			
			this.Particle.prototype.render = function(){
				_this.ctx.fillStyle = options.particlesColor || 'hsla('+this.hue+', 100%, '+_this.rand(50,70)+'%, '+_this.rand(20,100)/100+')';
				_this.ctx.fillRect(this.x, this.y, this.width, this.height);
			};
			
			
		};

		LightLoader.prototype = {
			constructor: LightLoader,

			/*========================================================*/	
			/* Initialize
			/*========================================================*/
			init: function(){
				this.loop();
			},

			/*========================================================*/	
			/* Update Loader
			/*========================================================*/
			updateLoader: function(){
				this.loaded < 100 ? this.loaded += this.loaderSpeed :	this.loaded = 0;
			},
			
			/*========================================================*/	
			/* Render Loader
			/*========================================================*/
			renderLoader: function(){
				this.ctx.fillStyle = '#000';
				this.ctx.fillRect(this.loader.x, this.loader.y, this.loaderWidth, this.loaderHeight);

				this.ctx.fillStyle = this.o.color || '#fff';
				this.ctx.font = (this.o.fontSize || 24) +'px serif'; 
				this.ctx.shadowColor = this.o.shadowColor || 'rgba(220,220,220,.6)';
				this.ctx.shadowOffsetX = this.o.shadowOffsetX || 2;
				this.ctx.shadowOffsetY = this.o.shadowOffsetY || 2;
				this.ctx.shadowBlur = this.o.shadowBlur || 8;
				this.ctx.textAlign = 'center';
	  		this.ctx.fillText(this.o.text || '正在处理中，请稍等！', this.loader.x+ this.loaderWidth/2 /* - this.ctx.measureText(this.o.text).width /2*/ , this.loader.y - (this.o.textOffset || 5));
	  		this.ctx.shadowColor = null;
				this.ctx.shadowOffsetX = null;
				this.ctx.shadowOffsetY = null;
				this.ctx.shadowBlur = null;

				this.hue = this.hueStart + (this.loaded/100)*(this.hueEnd - this.hueStart);
				
				var newWidth = (this.loaded/100)*this.loaderWidth;
				this.ctx.fillStyle = this.o.barColor || 'hsla('+this.hue+', 100%, 40%, 1)';
				this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight);
				
				this.ctx.fillStyle = '#222';
				this.ctx.fillRect(this.loader.x, this.loader.y - 1, newWidth, this.loaderHeight/2);
			},

			/*========================================================*/	
			/* Utility Functions
			/*========================================================*/				
			rand: function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);},
			hitTest: function(x1, y1, w1, h1, x2, y2, w2, h2){return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);},

			createParticles: function(){
				var i = this.particleRate;
				while(i--){
					this.particles.push(new this.Particle());
				};
			},
						
			updateParticles: function(){
				var i = this.particles.length;						
				while(i--){
					var p = this.particles[i];
					p.update(i);											
				};						
			},
			
			renderParticles: function(){
				var i = this.particles.length;						
				while(i--){
					var p = this.particles[i];
					p.render();											
				};					
			},
			

			/*========================================================*/	
			/* Clear Canvas
			/*========================================================*/
			clearCanvas: function(){
				this.ctx.globalCompositeOperation = 'source-over';
				this.ctx.clearRect(0,0,this.cw,this.ch);					
				this.ctx.globalCompositeOperation = 'lighter';
			},
			
			/*========================================================*/	
			/* Animation Loop
			/*========================================================*/
			loop: function(){
				var _id = this.c.id,
						_this = this;
				var loopIt = function(){
					document.getElementById(_id) && requestAnimationFrame(loopIt, _this.c);
					_this.clearCanvas();
					
					_this.createParticles();
					
					_this.updateLoader();
					_this.updateParticles();
					
					_this.renderLoader();
					_this.renderParticles();
				};
				loopIt();					
			}


		};

		/*========================================================*/	
		/* Check Canvas Support
		/*========================================================*/
		var isCanvasSupported = function(){
			var elem = document.createElement('canvas');
			return !!(elem.getContext && elem.getContext('2d'));
		};

		/*========================================================*/	
		/* Setup requestAnimationFrame
		/*========================================================*/
		var setupRAF = function(){
			if(typeof window.requestAnimationFrame == 'function')return;
			var lastTime = 0;
			var vendors = ['ms', 'moz', 'webkit', 'o'];
			for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
				window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
				window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
			};
			
			if(!window.requestAnimationFrame){
				window.requestAnimationFrame = function(callback, element){
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, 16 - (currTime - lastTime));
					var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				};
			};
			
			if (!window.cancelAnimationFrame){
				window.cancelAnimationFrame = function(id){
					clearTimeout(id);
				};
			};
		};			

		/*========================================================*/	
		/* Define Canvas and Initialize
		/*========================================================*/
		if(isCanvasSupported){
		  var c = document.createElement('canvas');
		  c.className = 'canvas';
		  c.addEventListener('click',function(e){
		  	e.stopPropagation();
		  	(window.event || e).cancelBubble = true;
		  });
		  c.id = options.canvasId || 'canvas-progress-' + parseInt(Math.random()*100);
		  c.width = options.canvasWidth || 400;
		  c.height = options.canvasHeight || 100;			
		  var cw = c.width;
		  var ch = c.height;
		  options.target ? options.target.append(c).data('progress',c) : document.body.appendChild(c);
		  var cl = new LightLoader(c, cw, ch);
		  setupRAF();
		  
		  cl.init();
		  return c;
		}
	};
}(window,document))


