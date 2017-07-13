// Function hide 
function hideShowDivChat(){
		var dleft = 0;
		var dtop = 0;
		$(".chat_chat").animate({
			left: "10px", 	
			top: "90%",
			height:"40px",
			width:"40px",
		}, 600);
		$('.chat_chat').hide(600);
		$('#minichat').show();
		localStorage.setItem('statusdivchat', 'hide');
		SetDelay(null);
		$('#chat_menu').hide();
		$('#color_div').hide();
		$('#tagCloudContainer').hide();
}
function ShowChatMenu(){
		$('#chat_menu').toggle();
}
function ShowChatMenu_color(){
		$('#color_div').toggle();
}
function ShowSmilies(){
		$('#tagCloudContainer').toggle();
}
function testDiv(){
	$('#draggable').show();
	$('#minichat').hide();
	$('#minichat_window_mesage').hide();

	if(isMobile.any()){
		$('.chat_chat').height('95%');
		$('.chat_chat').width('100%');
		var elm = document.getElementsByClassName('chat_chat');
		for (i = 0; i < elm.length; i++) {
			elm[i].style.position='fixed';
			elm[i].style.top= '10px';
			elm[i].style.left= '5px';
		}
		$('#inner_head_chat_close').width('30px'); 
	}else 
	{
//		$('#draggable').height('350px');
//		$('#draggable').width('550px');
		var HeightPos = Math.max(window.innerHeight,0) - 390 ;
		var elm = document.getElementsByClassName('chat_chat');
		for (i = 0; i < elm.length; i++) {
			elm[i].style.position='fixed';
			if (localStorage.getItem('dtop') !== null && localStorage.getItem('dtop')>0 && localStorage.getItem('dtop')< Math.max(window.innerHeight,0)-50)
			{
				elm[i].style.top= Math.max(localStorage.getItem('dtop')) + 'px';
			}else{elm[i].style.top= HeightPos + 'px';}
			if (localStorage.getItem('dleft') !== null && localStorage.getItem('dleft')>0 && localStorage.getItem('dleft')< Math.max(window.innerWidth,0)-30)
			{
				elm[i].style.left= Math.max(localStorage.getItem('dleft')) + 'px';
			}else{elm[i].style.left= '5px';}
			if (localStorage.getItem('rheight') !== null)
			{
				elm[i].style.height= Math.max(localStorage.getItem('rheight')) + 'px';
			}
			if (localStorage.getItem('rwidth') !== null)
			{
				elm[i].style.width= Math.max(localStorage.getItem('rwidth')) + 'px';
			}
		}
		$("#main").removeClass('main');
		$("#main").addClass('main');
		$("#contentr").css({
			'height':''  			
		})	
		$("#contentr").removeClass('contentr');
		$("#contentr").addClass('contentr');		
		$(".users").show(600);
		$(".headercaht").show(600);
		$(".chatbro_send").show(600);
		$(".chat_chat").css({
			'opacity':'1'
		})

	}
	$(".chat_chat").draggable({	
			stop: function(event, ui) {
			localStorage.setItem('dleft', ui.offset.left);
			localStorage.setItem('dtop', ui.offset.top);
			}
		});
	$(".chat_chat").resizable({
		minHeight: 150,
		minWidth: 250,
		stop: function(event, ui) {
		localStorage.setItem('rheight', ui.size.height);
		localStorage.setItem('rwidth', ui.size.width);
		},
    });
	$(".chat_chat").ghost= true;
	localStorage.setItem('statusdivchat', 'show');
	SetDelay(15);
	
	if (localStorage.getItem('ChatSmilies') !== null)
	{
		$('div#tagCloud').html(localStorage.getItem('ChatSmilies'));
	}else{RefreshChatSmilies();}
	
}
function ShowHideUsersMain(){
	if(!isMobile.any()){
		$("#main").removeClass('main');
		$("#main").addClass('mainhide');
		$("#contentr").css({
			'height':'inherit'  			
		})
		$(".users").hide(600);
		$(".headercaht").hide(600);
		$(".chatbro_send").hide(600);
		$(".chat_chat").animate({
			left: "10px", 	
			top: "85%",
			height:"80px",
			width:"450px",
			opacity:"0.75",
		},1);
		$("#main" ).scrollTop(999999)
		localStorage.setItem('statusdivchat', 'showmini');
}
}
		$( "#main" ).hover(
		  function() {
			if(!isMobile.any()){
				testDiv();
			}
		  }
		);
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
}	