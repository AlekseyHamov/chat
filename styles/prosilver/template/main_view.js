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
		$('.chat_chat').hide(700);
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
//	$('#draggable').show();
	$('#draggable').show();
	$('#minichat').hide();

	if(isMobile.any()){
		$('.chat_chat').height('95%');
		var elm = document.getElementsByClassName('chat_chat');
		for (i = 0; i < elm.length; i++) {
			elm[i].style.position='fixed';
			elm[i].style.top= '10px';
			elm[i].style.left= '5px';
		}
		$('#inner_head_chat_close').width('30px'); 
	}else 
	{
		$('#draggable').height('350px');
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
	}

    $("#main" ).scrollTop = 9999;
	$(".chat_chat").draggable({	
			stop: function(event, ui) {
			localStorage.setItem('dleft', ui.offset.left);
			localStorage.setItem('dtop', ui.offset.top);
			}
		});
	$(".chat_chat").resizable({
		minHeight: 250,
		minWidth: 250,
		stop: function(event, ui) {
		localStorage.setItem('rheight', ui.size.height);
		localStorage.setItem('rwidth', ui.size.width);
		},
    });
	$(".chat_chat").ghost= true;
	localStorage.setItem('statusdivchat', 'show');
	RefreshChat();
	SetDelay(15);
	if (localStorage.getItem('ChatSmilies') !== null)
	{
		$('div#tagCloud').html(localStorage.getItem('ChatSmilies'));
	}else{RefreshChatSmilies();}
}
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