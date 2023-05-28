/********* START OF SCRIPT *********/

$(document).ready(function(e){
	
	var ghostIndex = 0, ghostCreateInterval, shootInterval, score = 0, scoreFlag = false, winFlag = false, finalScore = 0, volume=true, sound=true;
	let gameMusic=document.getElementById("gameMusic");
	let gunShoot=document.getElementById("gunShoot");
	let entranceMusic=document.getElementById("entranceMusic");
	let ghostCome=document.getElementById("ghostCome");
	let ghostDie=document.getElementById("ghostDie");
	let ghostAttack=document.getElementById("ghostAttack");
	let ghostCry=document.getElementById("ghostCry");

	const shootSound= function (x){
		if(x.duration > 0 && !x.paused){
			x.pause();
			x.currentTime = 0;
			x.play();
		}
		else{
			x.play();
		}
	}

	const hideShowPage = function(hidePage, showPage, hidePageTime, showPageTime){
		$(`.${hidePage}`).fadeOut(hidePageTime);
		$(`.${showPage}`).fadeIn(showPageTime);
	}

	const gameResult = function(resultText, finalScore, hscore){
		$(".gameResult p[data-name='game-result']").html(resultText);
		$(".gameResult p[data-name=score]").html(`Score:${finalScore}`);
		$(".gameResult p[data-name='high-score']").html(`HighScore:${hscore}`);
		jQuery.fx.off = true;	
	}

	const resetGame = function() {
		gameMusic.currentTime = 0;
		ghostCry.currentTime = 0;
		entranceMusic.currentTime = 0;
		ghostCry.pause();
		score = 0;
		finalScore = 0;
		ghostIndex = 0;
		scoreFlag = false;
		winFlag = false;
		ghost.create();
		$(".score").html(`Score: ${score=0}`);
		$(".blud").css("width",'100%');
		clearInterval(ghostCreateInterval);
		clearTimeout(shootInterval);
		jQuery.fx.off=false;
		$(document).off("click");
	}

	const ghostMove = function(left, top, height, width, backSize, oldLeft, oldTop) {
		$(`div[data-name=ghost${ghostIndex}]`).animate({
			left:oldLeft+Math.random()*(window.innerWidth/left),
			top:oldTop+Math.random()*(window.innerHeight/top),
			opacity:0.7,
			height:`+=${window.innerHeight/height}%`,
			width:`+=${window.innerWidth/width}%`,
			backgroundSize:`+=${backSize}%`
		},1000).delay(100).animate({ 
			left:oldLeft-Math.random()*(window.innerWidth/left),
			top:oldTop-Math.random()*(window.innerHeight/top),
			opacity:1,
			height:`+=${window.innerHeight/height}%`,
			width:`+=${window.innerWidth/width}%`,
			backgroundSize:`+=${backSize}%`
		},1100);
	}

	const bulletFire = function(){
		if($(".game").is(':visible')){
			$(".bulletFire").css({
				left:(event.pageX-0)+"px",top:(event.pageY-0)+"px"
			}).fadeIn(10).fadeOut(200);
			shootSound(gunShoot);
		}
	}

	let ghost={
		create:function(){
			ghostCreateInterval = setInterval(function(){
				if($(".game").is(':visible')){
					$(".game").append(`<div data-name='ghost${ghostIndex}'></div>`);
					$(`div[data-name=ghost${ghostIndex}]`).append($("<div/>").addClass("blood"+ghostIndex));
					let topAdjust = 325;
					if(window.innerHeight < 480){
						topAdjust = 150;
					}
					$(`div[data-name=ghost${ghostIndex}]`).css({
						"left":Math.random()*(window.innerWidth-366)+100,
						"top":Math.random()*(window.innerHeight-topAdjust),
					});
					let oldLeft= $(`div[data-name=ghost${ghostIndex}]`).position().left;
					let oldTop=$(`div[data-name=ghost${ghostIndex}]`).position().top;
					let $this=$(`div[data-name=ghost${ghostIndex}]`);	
					ghostCome.play();
					for(let ghostMovement = 0; ghostMovement < 3; ghostMovement++) {
						screen.orientation.type.indexOf('landscape') !== -1 ? ghostMove(15,15,180,400,10, oldLeft, oldTop) : ghostMove(10,10,750,100,15, oldLeft, oldTop);
					}

					setTimeout(function(){				
						if($this.children().width() > 0){
							$this.animate({
									backgroundSize:'90%',
									width:'+=25%',
									height:'+=25%',
								},100);
								
							setTimeout(function(){
								$(".game").fadeOut(100).fadeIn();
								$this.fadeOut(100);
								screen.orientation.type.indexOf('landscape') !== -1 ? $(".blud").css({'width' : '-=250'}) : $(".blud").css({'width' : '-=50'});
								if($(".blud").width() <= 0) {
									ghost.over();
								}
							},200);
							ghostAttack.play();                          
							}
						},7000);
						ghostIndex++;

					if(ghostIndex === 10){
						clearInterval(ghostCreateInterval);
						setTimeout(function(){
							winFlag = true;
						},6500)
					}
				}
			},3000);				
		},
		over:function(){
			if($(".blud").width() <= 0){
				$(".game").fadeOut(100);
				$(".result").fadeIn(2000);
				gameMusic.pause();
				gameMusic.currentTime = 0;
				ghostCry.play();
				gameResult("GAME OVER", finalScore, localStorage.hscore);
				$("div[data-name^=ghost]").remove();				
			}
			$(".retry").click(function(){
				hideShowPage('result', 'game', 500, 500);
				resetGame();
				gameMusic.play();
				$(document).on("click", bulletFire);
			});
		},

		shoot:function(){
			setInterval(function(){
				$("div[data-name^=ghost]").each(function(){
					let $this = $(this);
					if(winFlag && $(".blud").width() > 0){
						shootInterval = setTimeout(function(){
								hideShowPage('game', 'result', 500, 500);
								$(`div[data-name^=ghost]:last-child`).remove();
								gameMusic.pause();
								gameMusic.currentTime=0;
								ghostCry.play();
								gameResult("You Won", finalScore, localStorage.hscore);
								scoreFlag = false;
								winFlag = false;
								$(".score").html(`Score: ${score=0}`);
								$("div[data-name^=ghost]").remove();
						},500);
					}	

					$this.on("click",function(){
						$this.children().css("width",'-=3').show();
						if($this.children().width() <= 0){
							$this.stop().fadeOut(1);
							scoreFlag = true;
							ghostDie.play();
						}
					});
					
					if(scoreFlag){
						$(".score").html(`Score: ${score = score+100}`);
						scoreFlag = false;
						finalScore = score;
					}
					if(localStorage){
						if(localStorage.hscore === null || localStorage.hscore === undefined){
								localStorage.hscore = 0;
								localStorage.hscore=(score>localStorage.hscore?score:localStorage.hscore);
						}
						else{
							localStorage.hscore= (score > localStorage.hscore ? score : localStorage.hscore);
						}
					}
					else{
						$(".gameResult p[data-name='high-score']").hide()
					}
				});
			},1000);
		},
	}; 
	let gun={
		move:function(){
			$(document).on("mousemove",function(e){
				$(".gun").css({left:e.pageX});
			});
			}
		};
		ghost.create();
		ghost.shoot();
		gun.move();
		
	$(".play").click(function(){
		hideShowPage('entrance', 'game', 200, 500);
		gameMusic.play();
		entranceMusic.pause();
		$(document).on("click", bulletFire);
	});

	$(".credits").click(function(){
		hideShowPage('entrance', 'creditsPage', 200, 300);
	 });

	$(".help").click(function(){
		hideShowPage('entrance', 'helpPage', 200, 300);
	});
	
	$(".creditsPage .back").click(function(){
		hideShowPage('creditsPage', 'entrance', 200, 300);
	});

	$(".helpPage .back").click(function(){
		hideShowPage('helpPage', 'entrance', 200, 300);
	});

	$('.full-screen-btn').on('click',function(){
		let de = document.documentElement;
		if(this.dataset.fullscreen === 'off'){
				if(de.requestFullscreen){
						de.requestFullscreen();
				}
				else if(de.mozRequestFullscreen){de.mozRequestFullscreen();}
				else if(de.webkitRequestFullscreen){de.webkitRequestFullscreen();}
				else if(de.msRequestFullscreen){de.msRequestFullscreen();}
				screen.orientation.lock('landscape');
				$(this).attr("data-fullscreen","on")
				$(this).text("Exit Full Screen");
		}
		else {
				screen.orientation.unlock();
				if(document.fullscreen){
				document.exitFullscreen();
				}
				$(this).attr("data-fullscreen","off")
				$(this).text("Full Screen");
		}
		});

	$(".menu").click(function(){
		resetGame();
		entranceMusic.play();
		hideShowPage('result', 'entrance', 200, 300);
	});	
	
	// Intro Animation
	$(".intro span[data-name=Rajeshwar]").animate({top:'40%'}, 500, function(){
		for(let i = 3; i > 0; i--){
			$(this).animate({top: '-='+(i*10)},100).animate({top: '+='+(i*10)},150);
		}
		$(".intro span[data-name=Chinna]").animate({left: '50%'}, 300, function(){
			for(let j = 2; j > 0; j--){
				$(this).animate({left:'+='+(j*10)}, 100).animate({left: '-='+(j*10)}, 100);
			}
			$(".intro span[data-name=Presents]").animate({left:'61%'},500,function(){
				hideShowPage('intro', 'entrance', 1000, 500);
				setTimeout(function(){
					if($(".entrance").is(':visible')){
						entranceMusic.play();
					}
				},1000);
			});
		});
	});	
			
	$(".mute").on("click",function(){
		if(!volume){
			entranceMusic.volume = 1;
			gameMusic.volume = 1;
			ghostCry.volume = 1;
			$(this).removeClass("volume").attr("title","Music On");
		}
		if(volume){
			entranceMusic.volume = 0;
			gameMusic.volume = 0;
			ghostCry.volume = 0;
			$(this).addClass("volume").attr("title","Music Off");
		}
		volume = !volume;	
	});

	$(".sound").on("click",function(){
		if(!sound){
			ghostCome.volume = 1;
			ghostDie.volume = 1;
			gunShoot.volume = 1;
			$(this).removeClass("soundOff").attr("title","Sound On");
		}
		if(sound){
			ghostCome.volume = 0;
			ghostDie.volume = 0;
			gunShoot.volume = 0;
			$(this).addClass("soundOff").attr("title","Sound Off");
			}
		sound = !sound;	
	});
});

/********* END OF SCRIPT *********/