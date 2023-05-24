// JavaScript Document
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
	let ghost={
		create:function(){
			ghostCreateInterval = setInterval(function(){
				if($(".game").is(':visible')){
					$(".game").append(`<div data-name='ghost${ghostIndex}'></div>`);
					$(`div[data-name=ghost${ghostIndex}]`).append($("<div/>").addClass("blood"+ghostIndex));
					$(`div[data-name=ghost${ghostIndex}]`).css({
						"left":Math.random()*(window.innerWidth-366)+100,
						"top":Math.random()*(window.innerHeight-325),
					});
					let oldLeft= $(`div[data-name=ghost${ghostIndex}]`).position().left;
					let oldTop=$(`div[data-name=ghost${ghostIndex}]`).position().top;
					let $this=$(`div[data-name=ghost${ghostIndex}]`);	
					ghostCome.play();
					for(let ghostMovement = 0; ghostMovement < 3; ghostMovement++) {
						screen.orientation.type.indexOf('landscape') !== -1 ? ghostMove(15,15,180,400,10, oldLeft, oldTop) : ghostMove(10,10,750,100,15, oldLeft, oldTop);
					}

					setTimeout(function(){				
						if($this.children().width()>0){
							$this.animate({
									backgroundSize:'100%',
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
						winFlag=false;

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
			if($(".blud").width()<=0){
				$(".game").fadeOut(100);
				$(".result").fadeIn(2000);
				gameMusic.pause();
				gameMusic.currentTime=0;
				ghostCry.play();
				$(".gameResult p[data-name='game-result']").html("GAME OVER ");
				$(".gameResult p[data-name=score]").html("score:"+finalScore);
				$(".gameResult p[data-name='high-score']").html("HighScore:"+localStorage.hscore);
				jQuery.fx.off=true;
				$("div[data-name^=ghost]").remove();				
			}
			$(".retry").click(function(){
				gameMusic.currentTime = 0;
				gameMusic.play();
				ghostCry.pause();
				ghostCry.currentTime=0;
				clearInterval(ghostCreateInterval);
				clearTimeout(shootInterval);
				jQuery.fx.off=false;
				$(".blud").css("width",'100%');
				ghostIndex = 0;
				ghost.create();
				$(".result").toggle();
				$(".game").show();
				$(".score").html(`Score: ${score=0}`);
				$(".blud").css("background","blue");
				scoreFlag = false;
				winFlag = false;
				finalScore=0;
			});
			
			if($(".blud").width()>500){$(".blud").css("background","blue");}
			if($(".blud").width()<=500){$(".blud").css("background","green");}
			if($(".blud").width()<=300){$(".blud").css("background","red");}
		},

		score:function(){
			if(scoreFlag){
			$(".score").html(`Score: ${score=score+100}`);
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
			}else{
				$(".gameResult p[data-name='high-score']").hide()
			}
		},

		shoot:function(){
			setInterval(function(){
				$("div[data-name^=ghost]").each(function(){
					let $this=$(this);
					if(winFlag){
						shootInterval = setTimeout(function(){
							if($(".blud").width() > 0){
								$(".game").fadeOut("slow");
								$(".result").show();
								$(`div[data-name^=ghost]:last-child`).remove();
								gameMusic.pause();
								gameMusic.currentTime=0;
								ghostCry.play();
								$(".gameResult p[data-name='game-result']").html("YOU WON ");
								$(".gameResult p[data-name=score]").html("score:"+finalScore);
								$(".gameResult p[data-name='high-score']").html("HighScore:"+localStorage.hscore);
								jQuery.fx.off = true;
								scoreFlag = false;
								winFlag = false;
								$(".score").html(`Score: ${score=0}`);
								$("div[data-name^=ghost]").remove();
							}
						},500);
					}	
					$this.on("click",function(){
						$this.children().css("width",'-=3').show();
						if($this.children().width()<=0){
							$this.stop().fadeOut(1);
							scoreFlag = true;
							ghostDie.play();
						}
					});
					ghost.score();
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
		$(".game").fadeIn(1500);
		$(".entrance").slideUp(500);
		$(".helpPage").slideUp(200);
		$(".score").html("Score: "+(score=0));
		finalScore=0;
		
		gameMusic.play();
		$(document).on("click",function(){
			if($(".game").is(':visible')){
				$(".gunLight").fadeIn(100).fadeOut(400);
				shootSound(gunShoot);
			}	
		});
		entranceMusic.pause();
		entranceMusic.CurrentTime=0;
			
	});
	$(".credits").click(function(){
		$(".entrance").fadeOut(1);
		$(".creditsPage").fadeIn(100);
	 });

	$(".help").click(function(){
		$(".helpPage").slideDown(300);
		$(".entrance").slideUp(200);
	});
	
	$(".back").click(function(){
		$(".helpPage").slideDown(200);
		$(".entrance").slideToggle(300);
		$(".creditsPage").fadeOut(1000);
	});

	$(".menu").click(function(){
		$(".entrance").show(300);
		$(".result").fadeOut(200);
		clearTimeout(ghostCreateInterval);
		jQuery.fx.off=false;
		$(".blud").css("width",'100%');
		ghostIndex = 0;
		ghost.create(); 
		entranceMusic.play();
		ghostCry.pause();
		ghostCry.currentTime=0;
	});	
	
	// Intro Animation
	$(".intro span[data-name=Rajeshwar]").animate({top:'40%'},500,function(){
		for(let i=3;i>0;i--){
			$(this).animate({top:'-='+(i*10)},100).animate({top:'+='+(i*10)},150);
		}
		$(".intro span[data-name=Chinna]").animate({left:'50%'},300,function(){
			for(let i=2;i>0;i--){
				$(this).animate({left:'+='+(i*10)},100).animate({left:'-='+(i*10)},100);
			}
			$(".intro span[data-name=Presents]").animate({left:'61%'},500,function(){
				$(".intro").fadeOut(1000);
				setTimeout(function(){
					$(".entrance").fadeIn(1000);
					if($(".entrance").is(':visible')){
					entranceMusic.play();
					}
				},1000);
			});
		});
	});	
	
	$(document).on("click",function(e){
		if($(".game").is(':visible')){
			$(".bulletFire").css({
				left:(e.pageX-0)+"px",top:(e.pageY-0)+"px"
			}).fadeIn(10).fadeOut(200);
			shootSound(gunShoot);
		}
	});
						
	$(".mute").on("click",function(){
		if(!volume){
			entranceMusic.volume=1;
			gameMusic.volume=1;
			ghostCry.volume=1;
			$(this).removeClass("volume").attr("title","Music On");
		}
		if(volume){
			entranceMusic.volume=0;
			gameMusic.volume=0;
			ghostCry.volume=0;
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
		sound=!sound;	
	});
});
	
	