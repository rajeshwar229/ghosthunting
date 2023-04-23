// JavaScript Document
$(document).ready(function(e){
	
	var i=0,t,t1,r,score=0,sflag=false,wflag=false,fscore=0,volume=true,sound=true;
	var gameMusic=document.getElementById("gameMusic");
	var gunShoot=document.getElementById("gunShoot");
	var entranceMusic=document.getElementById("entranceMusic");
	var ghostCome=document.getElementById("ghostCome");
	var ghostDie=document.getElementById("ghostDie");
	var ghostAttack=document.getElementById("ghostAttack");
	var ghostCry=document.getElementById("ghostCry");
	var ghost={
		g:"div[class^=ghost]",
		create:function(){
		t=setInterval(function(){
			if($(".game").is(':visible')){
						$(".game").append($("<div/>").addClass("ghost"+i));
						$(".ghost"+i).append($("<div/>").addClass("blood"+i));
						$(".ghost"+i).css({"left":Math.random()*1000+100,"top":Math.random()*300,});
						var oldLeft=$(".ghost"+i).position().left,oldTop=$(".ghost"+i).position().top;
						var $this=$(".ghost"+i);	
						ghostCome.play();
						for(r=0;r<3;r++){$(".ghost"+i).animate({left:oldLeft+Math.random()*150,top:oldTop+Math.random()*70,opacity:0.7,height:'+=22',width:'+=2%',backgroundSize:'+=40'},1000).delay(100).animate({left:oldLeft-Math.random()*70,top:oldTop-Math.random()*50,opacity:1,backgroundSize:'+=30',height:'+=23',width:'+=2.5%',},1100);}
						setTimeout(function(){				
							
					if($this.children().width()>0){
								
								$this.animate({
                       					 backgroundSize:'+=400',
										 width:'+=25%',
										 height:'+=250',
									},100);
									
								setTimeout(function(){$(".game").fadeOut(100).fadeIn();$this.fadeOut(100);$(".blud").css("width",'-=200');},200);	      ghostAttack.play();                          
								}
								
					
							},7000);
							i++;wflag=false;
						if(i==10){clearInterval(t);setTimeout(function(){wflag=true;},6500)}
			}
						},3000);				
			},
			over:function(){
				setInterval(function(){if($(".blud").width()<=0){
									$(".game").fadeOut("slow");
									$(".result").show();
									gameMusic.pause();gameMusic.currentTime=0;
									ghostCry.play();
									$(".gameResult span:eq(0)").html("GAME OVER ");
									$(".gameResult span:eq(1)").html("score:"+fscore);
									$(".gameResult span:eq(2)").html("HighScore:"+localStorage.hscore);
									jQuery.fx.off=true;
									$("div[class^=ghost]").remove();				
									}
									$(".retry").click(function(){
										gameMusic.currentTime = 0;
										gameMusic.play();
										ghostCry.pause();ghostCry.currentTime=0;
										clearInterval(t);
										clearTimeout(t1);
										jQuery.fx.off=false;
										$(".blud").css("width",'100%');
										i=0;
										ghost.create();
										$(".result").toggle();
										$(".game").show();
										$(".score").html("Score: "+(score=0));
										$(".blud").css("background","blue");
										sflag=false;
										wflag=false;
										fscore=0;
										
										});
							if($(".blud").width()>500){$(".blud").css("background","blue");}
							if($(".blud").width()<=500){$(".blud").css("background","green");}
							if($(".blud").width()<=300){$(".blud").css("background","red");}
				},100);},
			score:function(){
				if(sflag){
				$(".score").html("Score: "+(score=score+100));sflag=false;
				fscore=score;
				}
				if(localStorage){
					if(localStorage.hscore == null || localStorage.hscore == "undefined"){
						 localStorage.hscore=0;
						 localStorage.hscore=(score>localStorage.hscore?score:localStorage.hscore);
					}
					else{
						localStorage.hscore=(score>localStorage.hscore?score:localStorage.hscore);
					}
				}else{
					$(".gameResult span:eq(2)").hide()
					}
				},
			shoot:function(){
				setInterval(function(){$("div[class^=ghost]").each(function(){
				var $this=$(this);
				var $gleft=$(this).position().left;
				var $gtop=$(this).position().top;
				var $gwidth=$gleft+$(this).width();
				var $gheight=$gtop+$(this).height();
				if(wflag){
				t1=setTimeout(function(){if($(".blud").width()>0){
							$(".game").fadeOut("slow");
									$(".result").show();
									$(".ghost9").hide();
									gameMusic.pause();gameMusic.currentTime=0;
									ghostCry.play();
									$(".gameResult span:eq(0)").html("YOU WON ");
									$(".gameResult span:eq(1)").html("score:"+fscore);
									$(".gameResult span:eq(2)").html("HighScore:"+localStorage.hscore);
									jQuery.fx.off=true;
									sflag=false;wflag=false;
									$(".score").html("Score: "+(score=0));
									$("div[class^=ghost]").remove();
							
						}
				if($(".blud").width()<=0){
					ghost.over();wflag=false;
					}
					},500);
					}	
				$this.on("click",function(){
					$this.children().css("width",'-=3').show();
					if($this.children().width()<=0){
					$this.stop().fadeOut("fast");
					sflag=true;
					ghostDie.play();
					}
					});
					ghost.score();});
			},1000);
		},
	};
	var gun={
		$g:$(".gun"),
		move:function(){$(document).on("mousemove",function(e){
				gun.$g.css({left:e.pageX,});
			});
			},
		shoot:function(){if($(".game").is(':visible')){
				$(document).on("click",function(){
					
					$(".bulletFire").css({
						left:(e.pageX-20)+"px",top:(e.pageY-20)+"px"
						}).fadeIn(10).fadeOut(200);
					x=$("#gunShoot");
				if(x.duration > 0 && !x.paused){x.pause();x.currentTime = 0;x.play();}else{x.play();}	
				});
			}},
		};
		ghost.over();
		ghost.shoot();
		ghost.create();
		gun.move();
		gun.shoot();
	var keypres=function(){$(document).on("keypress",function(k){
		if(k.which==80 || k.which==112){
			var pause=true;
			if(pause){
				alert("Game Is Paused..Press Ok or close to Continue..!");
				pause=false;
			}
		}
		if(k.which==27){
			
		}});}
		
	 $(".play").click(function(){$(".game").fadeIn(1500);$(".entrance").slideUp(500);$(".helpPage").slideUp(200);$(".score").html("Score: "+(score=0));keypres();
				fscore=0;
		 		
				gameMusic.play();
				$(document).on("click",function(){
					 if($(".game").is(':visible')){
						 $(".gunLight").fadeIn(100).fadeOut(400);
				if(gunShoot.duration > 0 && !gunShoot.paused){gunShoot.pause();gunShoot.currentTime = 0;gunShoot.play();}else{gunShoot.play();}
						 }	
				});
			entranceMusic.pause();entranceMusic.CurrentTime=0;
			
	});
	 $(".credits").click(function(){$(".entrance").fadeOut(1);$(".creditsPage").fadeIn(100);
	 if($(".creditsPage").is(':visible')){$(".creditsPage ul li").animate({top:-200},5000);
		$(".creditsPage ul li:eq(1)").children().mouseover(function(){$(".creditsPage ul li").animate({top:-50},500);});
		$(".creditsPage ul li:eq(4)").mouseover(function(){$(".creditsPage ul li").animate({top:-200},500);});
	 }
	
	 });
	  $(".help").click(function(){$(".helpPage").slideDown(300);$(".entrance").slideUp(200);});
	 $(".exit").click(function(){var c=confirm("Do you want to exit??");if(c==true){ window.open('','_self');window.close();}});
	  $(".back").click(function(){$(".helpPage").slideDown(200);$(".entrance").slideToggle(300);$(".creditsPage").fadeOut(1000);$(".creditsPage ul li").css("top",200)});
	  $(".menu").click(function(){$(".entrance").show(300);$(".result").fadeOut(200);
	  									clearTimeout(t);
										jQuery.fx.off=false;
										$(".blud").css("width",'100%');
										i=0;ghost.create(); 
										entranceMusic.play();
										ghostCry.pause();ghostCry.currentTime=0;
										});	
	
		$(".intro span:first-child").animate({top:300},500,function(){for(var i=3;i>0;i--){$(this).animate({top:'-='+(i*10)},100).animate({top:'+='+(i*10)},150);}
		 $(".intro span:nth-child(2)").animate({left:665},300,function(){
		for(var i=2;i>0;i--){$(this).animate({left:'+='+(i*10)},100).animate({left:'-='+(i*10)},100);}
		$(".intro span:last-child").animate({left:720},500,function(){
			
		$(".intro").fadeOut(3000);setTimeout(function(){$(".entrance").fadeIn(1000);
		if($(".entrance").is(':visible')){
				
				entranceMusic.play();
			}
		},3000);});});
		});	
$(window).bind("click",function(evnt){
	if(evnt.which==2){
	alert(evnt.type);
	evnt.preventDefault();}
	});
	$(document).on("click",function(e){
		$(".bulletFire").css({
			left:(e.pageX-0)+"px",top:(e.pageY-0)+"px"
		}).fadeIn(10).fadeOut(200);});
						
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
		volume=!volume;	
		})
		$(".sound").on("click",function(){
		if(!sound){
			ghostCome.volume=1;
			ghostDie.volume=1;
			gunShoot.volume=1;
			$(this).removeClass("soundOff").attr("title","Sound On");
		}
		if(sound){
			ghostCome.volume=0;
			ghostDie.volume=0;
			gunShoot.volume=0;
			$(this).addClass("soundOff").attr("title","Sound Off");
			}
		sound=!sound;	
		})
	function shootSound(x){ if(x.duration > 0 && !x.paused){x.pause();x.currentTime = 0;x.play();}else{x.play();}}
	
});
	
	