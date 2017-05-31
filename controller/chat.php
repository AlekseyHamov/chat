<?php
/**
*
* @package phpBB Extension - My test
* @copyright (c) 2013 phpBB Group
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2
*
*/

namespace aleksey\chat\controller;

use Symfony\Component\HttpFoundation\Response;


class chat
{
	protected $config;
	protected $db;
	protected $auth;
	protected $template;
	protected $user;
	protected $helper;
	protected $phpbb_root_path;
	protected $php_ext;

	public function __construct(\phpbb\request\request_interface $request, \phpbb\pagination $pagination, \phpbb\db\driver\driver_interface $db, \phpbb\auth\auth $auth, \phpbb\template\template $template, \phpbb\user $user, \phpbb\controller\helper $helper, $phpbb_root_path, $php_ext, $table_prefix)
	{
		$this->request = $request;
		$this->pagination = $pagination;
		$this->db = $db;
		$this->auth = $auth;
		$this->template = $template;
		$this->user = $user;
		$this->helper = $helper;
		$this->phpbb_root_path = $phpbb_root_path;
		$this->php_ext = $php_ext;
		$this->table_prefix = $table_prefix;
        define(__NAMESPACE__ . '\CHAT_MESSAGES_TABLE',	$this->table_prefix . 'chat_messages');
        define(__NAMESPACE__ . '\CHAT_SESSIONS_TABLE',	$this->table_prefix . 'chat_sessions');
		define(__NAMESPACE__ . '\SMILIES_TABLE',	$this->table_prefix . 'smilies');
		
        // Settings
        define('SESSION_LIFE',			600);			// Session lifetime
        define('MESSAGES_LIMIT',		100);			// Store messages limit
//        define('MESSAGES_LIMIT',		(int)$this->config['message_limit']);			// Store messages limit
        //define('JOIN_MESSAGES',			false);			// Display join messages
        //define('LEFT_MESSAGES',			false);			// Display left messages
        define('ANTIFLOOD_SENSITIVITY',	9);				// Antiflood sensitivity (less is more sensitive)
        define('ANTIFLOOD_EXTINCTION',	3);				// Antiflood extinction (less is faster)
        define('ANTIFLOOD_DURATION',	30);			// Antiflood ban duration in seconds
        define('BUILD_TIME', filemtime(__FILE__));		// Internal version


		        // Actions
        define('ACT_LOAD', 	'load');
        define('ACT_SYNC', 	'sync');
		define('ACT_SYNCMINI', 	'syncmini');
        define('ACT_SAY',	'say');
		define('ACT_DEL',	'del');
		define('ACT_SMILIE','smilie');
		

        // Statuses (currently unused)
        define('STATUS_ONLINE',	0); // Online
        define('STATUS_CHAT',	1); // Chat with me!
        define('STATUS_AWAY',	2); // Away
        define('STATUS_DND',	3); // Do not disturb		
		
	}
	public function main()
	{
		if ($this->user->data['user_id'] == ANONYMOUS)
		{
					$time = addslashes($this->user->format_date(time(), "H:i", true));
					$textanonim = "1, '$time', 'Boot', 'Вам необходимо авторизоваться или обновить стараницу, чтобы войти в чат.', '000000'";			
					$textscript.= "<script>LogMessageMini($textanonim);</script>";			
					$textscript.= "<script>LogMessage($textanonim);</script>";		
					$textscript.= "<script>$('#draggable').hide();</script>";
					$textscript.= "<script>$('#minichat').hide();</script>";
					$textscript.= "<script>clearInterval(ChatTimer);</script>";
					$textscript.= "<script>clearInterval(ChatTimerMini);</script>";
				echo(trim($textscript));
			exit;
		}
		$action = $this->request->variable('action', ACT_LOAD);

//		// Detect left users
		$die_time = time() - SESSION_LIFE;
		// Remove left users
		$sql = 'delete FROM '.CHAT_SESSIONS_TABLE.' where last_active < ' . $die_time ; 
		$this->db->sql_query($sql);

		// Create new or prolong old session
		$sql = ' select * FROM ' . CHAT_SESSIONS_TABLE . ' WHERE user_id = ' . $this->user->data['user_id'];
		$result = $this->db->sql_query($sql);
		$chat_session = $this->db->sql_fetchrow($result);
		$this->db->sql_freeresult($result);
		if(!$chat_session)
		{
			// Add new user if needed

			$chat_session = array(
				'user_id'		=> $this->user->data['user_id'],
				'username'		=> $this->user->data['username'],
				'last_active'	=> time(), // if user is banned - time to unban, time of the last message if else
				'user_status'	=> STATUS_ONLINE,
				'user_activity'	=> 0,
				'user_blocked'	=> 0
			);
			$sql = 'INSERT INTO ' . CHAT_SESSIONS_TABLE . ' ' .	$this->db->sql_build_array('INSERT', $chat_session);
			$this->db->sql_query($sql);
		}
else
		{
			// Update user activity time and antiflood ban necessity detection
			$chat_session['user_activity'] -= time() - $chat_session['last_active'];
//			$textscript.=$chat_session['user_activity']." ";
//			$textscript.=time()." ";
//			$textscript.=$chat_session['last_active']." ";
//			$textscript.=time() - $chat_session['last_active'];
			if((int)$chat_session['user_activity'] < 0) 
			{
				$chat_session['user_activity'] = 0;
			}
			if(!$chat_session['user_blocked'] && $action == ACT_SAY)
			{
				//$chat_session['user_activity'] += ANTIFLOOD_EXTINCTION;
				$chat_session['user_activity'] += $antiflood_extinction;
				//if($chat_session['user_activity'] > ANTIFLOOD_SENSITIVITY)
				if($chat_session['user_activity'] > $antiflood_sensitivity)
				{
					//$chat_session['user_activity'] = ANTIFLOOD_DURATION;
					$chat_session['user_activity'] = $antiflood_duration;
					$chat_session['user_blocked'] = 1;
				}
			}
			if((int)$chat_session['user_activity'] == 0)
			{
				$chat_session['user_blocked'] = 0;
			}
			//$chat_session['last_active'] = time();
			$sql = 'update ' . CHAT_SESSIONS_TABLE . ' SET ' . $this->db->sql_build_array('UPDATE', $chat_session) . ' WHERE user_id = ' . $this->user->data['user_id'];
			//echo($sql. '  '.$chat_session['user_activity']);
			$this->db->sql_query($sql);
		}
	//	echo($action);
	//$action = ACT_SMILIE;
		// Handle commands
		switch ($action)
		{
//			// Add new message
			case ACT_SAY:
			
				$text = trim(utf8_normalize_nfc($this->request->variable('text', '', true)));

//				// Messages longer than 255 symbols are not allowed
				if(utf8_strlen($text) > 255) $text = utf8_substr($text, 0, 255);
				$color	= $this->request->variable('color', '000000');
				if (!preg_match('#^[0-9a-f]{6}$#', $color)) $color = '000000';
				if($text!='')
				{
					$message = array(
						'user_id'	=> $this->user->data['user_id'],
						'username'	=> $this->user->data['username'],
						'time'		=> time(),
						'text'		=> $text,
						'color'		=> $color
					);
					$sql = "INSERT INTO " . CHAT_MESSAGES_TABLE . " " . $this->db->sql_build_array('INSERT', $message);
					$this->db->sql_query($sql);
				}
			exit;
			case ACT_SMILIE:
				$last_id = $this->request->variable('lastid', 0);
				if ($last_id==0)
				{
					$sql = 'SELECT * FROM ' . SMILIES_TABLE . '	ORDER BY LENGTH(code) DESC';
					$result = $this->db->sql_query($sql, 600);
					$textscript_smilies="";
					while ($row = $this->db->sql_fetchrow($result))
					{
						$code=$row['code'];
						$textscript_smilies.='<a href="#" onclick=\'javascript:MessageEdit.Smilie("'.$code.'"); return false;\' ><img height="20" width="20" src="./images/smilies/' . $row['smiley_url'] . '" alt="'.$row['code'].'" title="' . $row['emotion'] . '" /></a>';
					}
					$textscript.=$textscript_smilies;
					$textscript.="<script>tagcanvas_div()</script>";
					echo(trim($textscript));
				}				
			exit;
			case ACT_SYNC:
				// Users list
				include($this->phpbb_root_path . 'includes/message_parser.' . $this->php_ext);
				$sql = "select user_id as id, username as name, user_status as status FROM " . CHAT_SESSIONS_TABLE; // . " WHERE status != " . STATUS_HIDDEN;
				$json = json_encode($this->db->sql_fetchrowset($this->db->sql_query($sql)));
				$textscript.="<script>SetUsers($json);</script> ";
				
				$last_id = $this->request->variable('lastid', 0);

				$sql = "select * FROM " . CHAT_MESSAGES_TABLE ;
				$sql .= " WHERE 1=1 ";
				$sql .= " and msg_id > " . $last_id ;
				$sql.=" ORDER BY msg_id";	
				$result = $this->db->sql_query($sql);
				
				while ($row = $this->db->sql_fetchrow($result))
				{
					if($row['msg_id'] > $last_id) $last_id = $row['msg_id'];
					$msg_id = $row['msg_id'];
					$username = addslashes($row['username']);
					$user_id = $row['user_id'];
					
					$color = addslashes($row['color']);
					$time = addslashes($this->user->format_date($row['time'], "H:i", true));
					$text = trim($row['text']);
					if($text == MSG_JOIN)
					{
						$textscript.= "<script>LogUserJoin($msg_id, '$time', '$username');\n</script>";
						continue;
					}
					if($text == MSG_LEFT)
					{
						$textscript.= "<script>LogUserLeft($msg_id, '$time', '$username');\n</script>";
						continue;
					}
					
					// Handle private messages
					$show = true;
					$priv= 0;
					if( utf8_substr($text, 0, utf8_strlen("private ["))=="private [" )
					{
						$show = false;
						$tmp = $text;
						while(utf8_strpos($tmp, "private [")===0)
						{
							$endp = utf8_strpos($tmp, "]");
							$to = str_replace("private [", "", utf8_substr($tmp, 0, $endp));
							if($to == $this->user->data['username']) $show = true;
							$tmp = trim(utf8_substr($tmp, $endp+1));
						}
						$msgpriv = trim(utf8_substr($text, 0, utf8_strlen($text)-utf8_strlen($tmp)));
						$text = "<span class=\"private\">" . $msgpriv . "</span> " . $tmp;
						$priv= 1;
					}
					
					if((!$show) && ($this->user->data['username'] != $row['username']) ) continue;

					// Parse smilies and links in the message
					if(utf8_strlen($text)>1)
					{
						$message_parser = new \parse_message($text);
						$message_parser->magic_url(false);
						$message_parser->smilies(0);
						$text = (string) $message_parser->message;
						unset($message_parser);
						$text = str_replace("<a ", "<a target='_blank' ", $text);
						
						$text = str_replace("{SMILIES_PATH}", "./images/smilies/", $text);			
					}
					$text = str_replace("to [".$this->user->data['username']."]", "<span class=\"to\">to [".$this->user->data['username']."]</span>", $text);
					$text = addslashes(str_replace(array("\r", "\n"), ' ', $text));
					$textscript.= "<script>LogMessage($msg_id, '$time', '$username', '$text', '$color', '$priv');</script>";
				}
				$textscript.="<script>SetLastId($last_id);</script>";
				echo(trim($textscript));

				// Delete obsolete messages
				$sql = "DELETE FROM " . CHAT_MESSAGES_TABLE . " WHERE msg_id < " . ($last_id - MESSAGES_LIMIT);
				$this->db->sql_query($sql);
			exit;
			case ACT_SYNCMINI: // Min  mesage and new users session 
				include($this->phpbb_root_path . 'includes/message_parser.' . $this->php_ext);
				$die_time_end=time()+10;
				$die_time_begin=time()-10;
				$lastuser = $this->request->variable('lastuseractiv', 0);
				// Users list
				$sql = "select user_id as id, username as name, user_status as status,last_active as lastuser FROM " . CHAT_SESSIONS_TABLE ;
				$sql .= " where 1=1";
				$sql .= " and user_id <> " .$this->user->data['user_id']; 
				$sql .= " and last_active > " .$lastuser  ; 
				$sql .= " order by last_active ";
//				$textscript.=$sql;
				$result = $this->db->sql_query($sql);
				$row = $this->db->sql_fetchrow($result);
				if ($row) {
 					$json='';
					$json = json_encode($this->db->sql_fetchrowset($this->db->sql_query($sql)));
					$textscript.="<script>SetUserMini($json);</script> ";
				}				
				
//				$textscript.=$sql;
//				$textscript.=$json;

				// Output new messages
				$last_id = $this->request->variable('lastid', 0);
				$sql = "select * FROM " . CHAT_MESSAGES_TABLE ;
				$sql .= " WHERE 1=1 ";
				$sql .= " and msg_id > " . $last_id ;
				$sql .= " and TIME BETWEEN  " . $die_time_begin . "  and " . $die_time_end;
				$sql.=" ORDER BY msg_id";	
				$result = $this->db->sql_query($sql);
//				$textscript.= $last_id;
//				$textscript.=$sql;
				
				while ($row = $this->db->sql_fetchrow($result))
				{
					if($row['msg_id'] > $last_id) $last_id = $row['msg_id'];
					$msg_id = $row['msg_id'];
					$username = addslashes($row['username']);
					$user_id = $row['user_id'];
					
					$color = addslashes($row['color']);
					$time = addslashes($this->user->format_date($row['time'], "H:i", true));
					$text = trim($row['text']);
					
					// Handle private messages
					$show = true;
					if( utf8_substr($text, 0, utf8_strlen("private ["))=="private [" )
					{
						$show = false;
						$tmp = $text;
						while(utf8_strpos($tmp, "private [")===0)
						{
							$endp = utf8_strpos($tmp, "]");
							$to = str_replace("private [", "", utf8_substr($tmp, 0, $endp));
							if($to == $this->user->data['username']) $show = true;
							$tmp = trim(utf8_substr($tmp, $endp+1));
						}
						$msgpriv = trim(utf8_substr($text, 0, utf8_strlen($text)-utf8_strlen($tmp)));
						$text = "<span class=\"private\">" . $msgpriv . "</span> " . $tmp;
					}
					//$textscript.='в строках';
					// Parse smilies and links in the message
					if(utf8_strlen($text)>1)
					{
						$message_parser = new \parse_message($text);
						$message_parser->magic_url(false);
						$message_parser->smilies(0);
						$text = (string) $message_parser->message;
						unset($message_parser);
						$text = str_replace("<a ", "<a target='_blank' ", $text);
						
						$text = str_replace("{SMILIES_PATH}", "./images/smilies/", $text);			
					}
					$text = str_replace("to [".$this->user->data['username']."]", "<span class=\"to\">to [".$this->user->data['username']."]</span>", $text);
					$text = addslashes(str_replace(array("\r", "\n"), ' ', $text));
					$textscript.= "<script>LogMessageMini($msg_id, '$time', '$username', '$text', '$color');</script>";			
					//$textscript.=$text;
				}
				echo(trim($textscript));
			exit;
			case ACT_DEL:
				$ID = $this->request->variable('ID', '');
				$sql = " DELETE FROM " . CHAT_MESSAGES_TABLE . "    WHERE msg_id =" . $ID ;
				$this->db->sql_query($sql);
				$textscript.= "<script>";
 				$textscript.= "SetLastId(1);\n";
				$textscript.= "	document.getElementById('main').innerHTML='';\n";
				$textscript.= "RefreshChat();\n";

				$textscript.="</script>";			
				//$textscript.=$sql;
				echo(trim($textscript));
			exit;
		}
	}
}