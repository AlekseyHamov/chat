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
var LastUpdate	= 0;
var NewMessages	= false;
var UpdateCount	= 0;
var lastuseractiv = 0;

function RefreshChat()
{
	//if(InProgress) return;
	//InProgress = true;
	ShowIcon("loading");
	var VisiblemesFlag = '';
	if ($('#main').scrollTop()) 
	{
		scrolold = $('#main').scrollTop() ;
		localStorage.setItem('scrolold', scrolold);
	}else scrolold = 9999999;
	if (localStorage.getItem('scrolold') !== null)
		{
			scrolold= Math.round(localStorage.getItem('scrolold'));
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
		$('#main').scrollTop(scrolold);
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
		data: 		{"action":"smilie", "lastid":LastUpdate},
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
		$('#minichat_window_mesage').scrollTop(99999);
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
		$('#main').scrollTop(99999);
	})
	.fail(function()
	{
		ShowIcon("error");
	});
}
function SetLastId(lastid)
{
	if(lastid) if(LastUpdate != lastid)
	{
		LastUpdate = lastid;
		if (NewMessages)
		{
			Sound.Play('notify');
		}
		NewMessages = false;
	}
}
//------------------------------------------------------------------------------
// Output messages log
//------------------------------------------------------------------------------
function addslashes(str)
{
	return str.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'').replace(/\"/g,'\\"').replace(/\0/g,'\\0');
}

function stripslashes(str)
{
	return str.replace(/\\'/g,'\'').replace(/\\"/g,'"').replace(/\\0/g,'\0').replace(/\\\\/g,'\\');
}

function LogEvent(text,id,priv)
{

	NewMessages = true;
	if (priv==2)
	{
		LogEventPrivate(text,id,priv)
	}
	$("#main").append("<div>"+text+"</div>");
	$('#contentr').append($('#chatbro_send'));
}
function LogMessage(id,time,nick,msg,color,priv)
{
	var html = "";
	if(time) html += "<span class='date'><img onclick=\"javascript:DeleteMessage.To('"+id+"')\" class='overlay' src='./ext/aleksey/chat/media/delete_ico.jpg'/>"+time+"</span>&nbsp;";
	if(nick) html += "[<a href='#' onclick=\"javascript:MessageEdit.To('"+addslashes(nick)+"'); return false;\">"+nick+"</a>]&nbsp;";
	if(color) html += "<span style='color:#"+color+"'>"+msg+"</span>"; else html += msg;
	LogEvent(html, id,priv);
	$('#main').scrollTop(999999);
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
	LogMessage(id,time,nick,msg,color);
	SetLastId(id);
}
function LogUserJoin(id,time,nick)
{	//alert("вход LogUserJoin");
	LogEvent("<span class='date'>"+time+"</span> {L_USER_JOINED} [<a href='#' onclick=\"javascript:MessageEdit.To('"+addslashes(nick)+"'); return false;\">"+nick+"</a>]");
}

function LogUserLeft(id,time,nick)
{
	//alert("вход LogUserLeft");
	LogEvent("<span class='date'>"+time+"</span> {L_USER_LEFT} [<a href='#' onclick=\"javascript:MessageEdit.To('"+addslashes(nick)+"'); return false;\">"+nick+"</a>]");
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
		html +="<span >Активировался "+addslashes(users[i].name)+"</span>\n";
		$("#usersmini").append("<div>"+html+"</div>");
		localStorage.setItem('lastuseractiv', users[i].lastuser);

	}
	Sound.Play('notify');
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
			ChatTimer = setInterval('RefreshChat()', ChatDelay*1000); 
			clearInterval(ChatTimerMini);
	}else if($('#minichat').is(':visible'))  
	{clearInterval(ChatTimer);
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
	Smilie: function(s)
	{
		var Message = $("#message_chat").val();
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

function insert_text_img(text, spaces, popup) {
	var textarea;

	if (!popup) {
		textarea = document.forms[form_name].elements[text_name];
	} else {
		textarea = opener.document.forms[form_name].elements[text_name];
	}

	if (spaces) {
		text = ' ' + text + ' ';
	}

	// Since IE9, IE also has textarea.selectionStart, but it still needs to be treated the old way.
	// Therefore we simply add a !is_ie here until IE fixes the text-selection completely.
	if (!isNaN(textarea.selectionStart) && !is_ie) {
		var sel_start = textarea.selectionStart;
		var sel_end = textarea.selectionEnd;

		mozWrap(textarea, text, '');
		textarea.selectionStart = sel_start + text.length;
		textarea.selectionEnd = sel_end + text.length;
	} else if (textarea.createTextRange && textarea.caretPos) {
		if (baseHeight !== textarea.caretPos.boundingHeight) {
			textarea.focus();
			storeCaret(textarea);
		}

		var caret_pos = textarea.caretPos;
		caret_pos.text = caret_pos.text.charAt(caret_pos.text.length - 1) === ' ' ? caret_pos.text + text + ' ' : caret_pos.text + text;
	} else {
		textarea.value = textarea.value + text;
	}

	if (!popup) {
		textarea.focus();
	}
}
function LogEventPrivate(text,id,priv)
{
		var $draggable = $("#draggable");
		var $contentr = $("#contentr");
		var $headercaht = $("#headercaht");
		var $main = $("#main");
		var $chatbro_send = $("#chatbro_send");
//		$toClone.prop('id', 'draggable_private');
		$draggable.clone().insertAfter("#draggable").prop('id', 'draggable_private');
//		$('#contentr_private').append($('#chatbro_send'));
//		testDiv();
		$('#draggable_private').show();
		$(".chat_chat").draggable();
		$(".chat_chat").resizable({
			minHeight: 250,
			minWidth: 250,
		});
		$('#main:last').prop('id', 'main_private');
		$('#main_private:last').empty();
		$("#main_private:last").append("<div>"+text+"</div>");
	//	$contentr.clone().append("<div>"+text+"</div>");//('#draggable_private:last').prop('id', 'contentr_private');
}
