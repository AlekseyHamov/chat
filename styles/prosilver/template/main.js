//------------------------------------------------------------------------------
// Refresh
//------------------------------------------------------------------------------
function ShowIcon(name)
{
	$("#icon-error").hide();
	$("#icon-sending").hide();
	$("#icon-loading").hide();
	$("#icon-"+name).show();
}

var InProgress	= false;
var LastUpdate ;
var NewMessages	= false;
var UpdateCount	= 0;
var lastuseractiv = 0;

function RefreshChat()
{
	if (sessionStorage.getItem('LastUpdate') !== null)
	{
		LastUpdate=sessionStorage.getItem('LastUpdate');
	}else 
	{
		LastUpdate	= 0;
	}
	
	//if(InProgress) return;
	//InProgress = true;
	ShowIcon("loading");
	var VisiblemesFlag = '';
//	if ($("#main" ).scrollTop()) 
//	{
//		scrolold = $("#main" ).scrollTop() ;
//		sessionStorage.setItem('scrolold', scrolold);
//	}else 
	scrolold = 99999999;
	if (sessionStorage.getItem('scrolold') !== null && sessionStorage.getItem('scrolold')>0)
	{
		scrolold= Math.round(sessionStorage.getItem('scrolold'));
	}
//	alert("вход в рефреш"+scrolold);
	$.ajax({
		type: 		"POST",
		//async: false ,
		url: 		"chat",
		data: 		{"action":"sync", "lastid":LastUpdate,"visiblemes":VisiblemesFlag},
//		dataType:	'html',
//		dataType:	'script',
		cache:		false,
		timeout:	15000,
  	})
	.done(function(js)
	{
		ShowIcon("none");
		UpdateCount++;
		$('div#result_div').html(js);
		$("#upd_counter").text(UpdateCount);
		$("#main" ).scrollTop(scrolold);
	})
	.fail(function()
	{
		ShowIcon("error");
	})
	.always(function()
	{
		InProgress = false;
	}
	);

}
function RefreshChatSmilies()
{
	$.ajax({
		type: 		"POST",
		url: 		"chat",
		data: 		{"action":"smilie"},
		cache:		false,
		timeout:	15000,
  	})
	.done(function(tagsmilies)
	{
		$('div#tagCloud').html(tagsmilies);
		localStorage.setItem('ChatSmilies', tagsmilies);
	});
}
function RefreshChatMini()
{
//	alert("вход в рефрешMini");
	lastuseractiv = localStorage.getItem('lastuseractiv');
	$.ajax({
		type: 		"POST",
		//async: false ,
		url: 		"chat",
		data: 		{"action":"syncmini", "lastid":LastUpdate, "lastuseractiv":lastuseractiv},
//		dataType:	'html',
//		dataType:	'script',
		cache:		false,
		timeout:	15000,
  	})
	.done(function(js)
	{	
		$('#minichat_window_mesage').hide('slow');
		$('div#result_div').html(js);
		$('#minichat_window_mesage').scrollTop(9999999);
	})
	.fail(function()
	{
		$('#minichat_window_mesage').hide('slow');
	})
	.always(function()
	{
		InProgress = false;
	});

}

function SendMessage(text, color)
{
	ShowIcon("sending");
	if(!color) color = "000000";
	$.ajax(
	{
		type: 		"POST",
		url: 		"chat",
		data: 		{"action": "say", "text": text, "color": color},
//		dataType:	'script',
		dataType:	'html',
		cache:		false,
		timeout:	10000,

	})
	.done(function(js)
	{
		$('div#result_div').html(js);
		//alert("Выполнен js SendMessage");
		ShowIcon("none");
		RefreshChat();
		$("#main" ).scrollTop(9999999);
	})
	.fail(function()
	{
		ShowIcon("error");
	});
}
function SetLastId(lastid,Messages)
{
	$("#main").append(Messages);
//	$('#contentr').append($('#chatbro_send'));	
	if(lastid) if(LastUpdate != lastid)
	{
		LastUpdate = lastid;
		if ($("#main").html()=="")
		{
			sessionStorage.setItem('LastUpdate',0);
		}else{sessionStorage.setItem('LastUpdate',LastUpdate);} 
//		if (NewMessages)
//		{
			Sound.Play('notify');
//		}
		NewMessages = false;
	}else
	{
		if (sessionStorage.getItem('Messages') !== null && $("#main").html()=="")
		{
			$("#main").append(sessionStorage.getItem('Messages'));
		}
	}
	sessionStorage.setItem('Messages', $("#main").html());		
}
//------------------------------------------------------------------------------
// Output messages log
//------------------------------------------------------------------------------
function addslashes(str)
{
	return str.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'').replace(/\"/g,'\\"').replace(/\0/g,'\\0');
}

function LogMessageMini(id,time,nick,msg,color)
{
	if (id>=1)
	{
		$('#minichat_window_mesage').show('slow');
//		$('#minichat').hide('slow');
	}else 
	{
		$('#minichat_window_mesage').hide('slow');
//		$('#minichat').show('slow');
	}	
	var html = "";
	if(time) html += "<span class='date'>"+time+"</span>&nbsp;";
	if(nick) html += "["+nick+"]&nbsp;";
	if(color) html += "<span >"+msg+"</span>"; else html += msg;
	$("#usersmini").append("<div>"+html+"</div>")

	Sound.Play('notify');
	SetLastId(id);
}
function SetUsers(users)
{
	//alert("SetUsers   ");
	document.getElementById("users").innerHTML="<div>("+users.length+")</div>\n";
	for(var i = 0; i < users.length; i++)
	{
		var obj = document.createElement('div');
		obj.style="vertical-align: top;float:left;";
		obj.innerHTML="";
		obj.innerHTML+="&nbsp;<a href='#' onclick=\"javascript:MessageEdit.To('"+addslashes(users[i].name)+"', true); return false;\"><img src='./ext/aleksey/chat/media/private.png' height='10px' width='10px' border='0' title='{L_PRIVATE}' /></a>&nbsp;";
		obj.innerHTML+="<a href='#' onclick=\"javascript:MessageEdit.To('"+addslashes(users[i].name)+"'); return false;\">"+users[i].name+"</a>\n";
		document.getElementById("users").appendChild(obj);
	}

}
function SetUserMini(users)
{
	//alert("SetUsers   ");
	document.getElementById("usersmini").innerHTML="";
	$('#minichat_window_mesage').show('slow');
	if (users.length>=1)
	{
		$('#minichat_window_mesage').show('slow');
	}else 
	{
		$('#minichat_window_mesage').hide('slow');
	}
	for(var i = 0; i < users.length; i++)
	{
		var html ="";
		html +="<span >Активирован в чате "+addslashes(users[i].name)+"</span>\n";
		$("#usersmini").append("<div>"+html+"</div>");
		localStorage.setItem('lastuseractiv', users[i].lastuser);

	}
//	Sound.Play('notify');
}

var ChatDelay = 15;			// Refresh speed
var ChatTimer = -1;			// Refresh timer
var ChatTimerMini = -1;

function SetDelay(delay)
{
	if ($('#draggable').is(':visible'))
	{
		if (delay == null)
		{
			if (localStorage.getItem('ChatDelay') !== null)
			{
				ChatDelay = localStorage.getItem('ChatDelay');
			}
		}
		else
		{
			ChatDelay = delay;
		}
		localStorage.setItem('ChatDelay', ChatDelay);
		if (ChatTimer>=0) clearInterval(ChatTimer);
		ChatTimer = setInterval(function()
			{
				RefreshChat();
				if(!$('#draggable').is(':hover'))
				{
					ShowHideUsersMain();	
				}
			},ChatDelay*1000); 
		clearInterval(ChatTimerMini);
	}else if($('#minichat').is(':visible'))  
	{	clearInterval(ChatTimer);
		if (ChatTimerMini>=0 ) clearInterval(ChatTimerMini);
		ChatTimerMini = setInterval(function(){
			RefreshChatMini();
		}, 5000); 
	}
}
function tagcanvas_div()
{
	if( !$('#3d_tagCloud').tagcanvas({
		textColour: '#ff0000',
		//outlineColour: '#ff00ff',
		reverse: true,
		depth: 0.8,
		maxSpeed: 0.03},'tagCloud')) {
			// TagCanvas failed to load
			$('#tagCloudContainer').hide();
			$('#tagCloud').css('display', 'block')
		}
}

//------------------------------------------------------------------------------
// Message editor
//------------------------------------------------------------------------------
MessageEdit =
{
	Color: "000000",
	AddressTo: "",
	Sended: false,
	SetColor: function(color)
	{
		if (color == null)
		{
			if (localStorage.getItem('ChatColor') !== null)
			{
				this.Color = localStorage.getItem('ChatColor');
			}
		}
		else
		{
			this.Color = color;
		}
		localStorage.setItem('ChatColor', this.Color);
		$("#message_chat").css("color", '#'+this.Color);
	},
	To: function(login, priv)
	{
		var type = (priv==true)?"private":"to";
		var Message = $("#message_chat").val();
		if(Message.indexOf(this.AddressTo)!=0) this.AddressTo = "";
		Message = Message.substring(this.AddressTo.length);
		if(this.Sended)
		{
			this.AddressTo = "";
			this.Sended = false;
		}
		if(this.AddressTo.indexOf(type)!=0) this.AddressTo = "";
		var NewAddr = type+" ["+login+"] ";
		if(this.AddressTo.indexOf(NewAddr)==-1)
		{
			// Add new appeal
			this.AddressTo += NewAddr;
		}
		else
		{
			// Remove existent appeal
			var i = this.AddressTo.indexOf(NewAddr)
			this.AddressTo = this.AddressTo.substring(0, i) + this.AddressTo.substring(i+NewAddr.length);
		}
		$("#message_chat").val(this.AddressTo + Message).focus();
	},
	Smilie: function(s, sid)
	{
		var $smilieclone = $("#smilie"+sid);
		var toppoz= Math.round($('#smilie'+sid).offset().top);
		var Message = $("#message_chat").val();
		$smilieclone.show();
		$smilieclone.offset({top:(toppoz-150)});
		$smilieclone.height("70px");
		$smilieclone.width("70px");
		$smilieclone.clone().insertAfter("#tagCloudContainer").prop('id', 'smilie_clone');
		$('#smilie_clone').show();
		$("#smilie_clone").animate({
			left: "-"+$("#message_chat").width(),
			top: (toppoz),
			height:"5px",
			width: "5px", 	
		}, 1700, function(){$(this).remove()}
		);
		$("#message_chat").val(Message+" "+s).focus();
		$("#message_chat").focus();
		
	},
	SendClick: function()
	{
		var Message = $("#message_chat").val();
        //document.write(Message);
		if(Message.indexOf(this.AddressTo)!=0) this.AddressTo = "";
		if(Message == "")
		{
			RefreshChat();
		}
		else if(Message == this.AddressTo)
		{
			$("#message_chat").val("");
			this.AddressTo = "";
            SendMessage(Message, this.Color);
            //document.write(this.AddressTo);
		}
		else
		{
			this.Sended = true;
			SendMessage(Message, this.Color);
			$("#message_chat").val(this.AddressTo);
		}
		$("#message_chat").focus();
	}
};
DeleteMessage =
{
	To: function(IDMESD)
	{
//		alert('проверка удаления');
	var VisiblemesFlag = '';

//	alert("вход в рефреш");
			$.ajax({
				type: 		"POST",
				//async: false ,
				url: 		"chat",
				data: 		{"action":"del", "ID":IDMESD},
				dataType:	'html',
		//		dataType:	'script',
				cache:		false,
				timeout:	15000,
			})
			.done(function(js)
			{
				ShowIcon("none");
				$('div#result_div').html(js);
			})
			.fail(function()
			{
				ShowIcon("error");
			})
			.always(function()
			{
				InProgress = false;
			});
	}
};
jQuery(function($)
{
	//MessageEdit.SetColor(null); // Load from the settings storage
	$("#message_chat").keypress(function(e)
	{
		if (e.which == 13) 
		{
			MessageEdit.SendClick();
			return false;
		}
	});
	$("#btn-send-chat").click(function(e)
	{
		MessageEdit.SendClick();
		return false;
	});
});
//------------------------------------------------------------------------------
// Output the colors table (C) 23.03.2006 VEG
//------------------------------------------------------------------------------
function GradColors(colmax)
{
	var colhex = ["00", "33", "66", "99", "cc", "ff"];
	var coldat = [colmax, 0, 0];
	var colcur = 2;
	var result = [];
	do
	{
		if((coldat[colcur]!=colmax)&&(coldat[(colcur+1)%3]==colmax)) coldat[colcur]++; else
		if ((coldat[colcur]==colmax)&&(coldat[(colcur+1)%3]!=0)) coldat[(colcur+1)%3]--; else
		{
			colcur--;
			if(colcur>=0) coldat[colcur]++;
		};
		if(colcur>=0) result[result.length]=colhex[coldat[0]]+colhex[coldat[1]]+colhex[coldat[2]];
	} while (colcur!=-1);
	return result;
}

function WriteColorTable(rows, width, height)
{
	var html = "";
	html += "<table border='0' cellspacing='0' cellpadding='0' width='"+width+"px' style='cursor: pointer; border-spacing: 0;'>";
			for(var i=rows; i>=1; i--)
			{
				html +="<tr><td><table border='0' cellspacing='0' cellpadding='0' width='100%' height='"+height+"px'><tr>";
				var grad = GradColors(i);
				var wcur = 0;
				for(var j=0; j<grad.length; j++)
					{
						html +="<td style='font-size: 1px; background-color: #"+grad[j]+"' onclick='javascript:MessageEdit.SetColor(\""+grad[j]+"\");'><div style='height: 7px; width: 1px;'></div></td>";
					}
				html +="</tr></table></td></tr>";
			}		
	html += "</table>";
	document.getElementById("color_div").innerHTML="";
	document.getElementById("color_div").innerHTML=html;
	$('#chat_menu').toggle();
	$('#color_div').toggle();	
}

//------------------------------------------------------------------------------
// Sounds
//------------------------------------------------------------------------------
Sound =
{
	Enabled: 1,
	Enable: function(onoff)
	{
		var a = document.createElement('audio');
		if (!(a.canPlayType && (a.canPlayType('audio/mpeg;').replace(/no/, '') || a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''))))
		{
			this.Enabled = 0;
		}
		else
		{
			if (onoff == null)
			{
				if (localStorage.getItem('ChatSound') !== null)
				{
					this.Enabled = localStorage.getItem('ChatSound');
				}
			}
			else
			{
				this.Enabled = onoff ? 1 : 0;
			}
			this.Enabled = parseInt(this.Enabled);
			localStorage.setItem('ChatSound', this.Enabled);
		}
		$("#btn-sound").css("background-position", this.Enabled ? 'right bottom' : 'left top');
	},
	Play: function(src)
	{
		if(this.Enabled && $('#audio-'+src).length && $('#audio-'+src)[0].play) $('#audio-'+src)[0].play();
	}
};

jQuery(function($)
{
	Sound.Enable(null); // Load from the settings storage
	$("#btn-sound").click(function(e)
	{
		Sound.Enable(!Sound.Enabled);
		return false;
	});
});
