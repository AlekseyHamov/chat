<?php
/**
*
* @package paywindow
* @copyright (c) 2014 aleksey
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2
*
*/

namespace aleksey\chat\event;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
* Event listener
*/
class listener implements EventSubscriberInterface
{
/**
* Assign functions defined in this class to event listeners in the core
*
* @return array
* @static
* @access public
*/
	/** @var \phpbb\db\driver\driver_interface */
    protected $db;	
	/** @var \phpbb\user */
	protected $user;
	/** @var \phpbb\config\config */
	protected $config;
	/** @var \phpbb\config\db_text */
	protected $config_text;
	/** @var \phpbb\template\template */
	protected $template;
	protected $phpbb_root_path;
    protected $php_ext;
	
	static public function getSubscribedEvents()
	{
		return array(
			'core.user_setup'						=> 'load_language_on_setup',
		);
	}
	/**
	* Constructor
	*/
	public function __construct(\phpbb\request\request_interface $request, \phpbb\db\driver\driver_interface $db, \phpbb\auth\auth $auth, \phpbb\user $user, \phpbb\config\config $config, \phpbb\config\db_text $config_text, \phpbb\template\template $template, $phpbb_root_path, $table_prefix, $php_ext )
	{
        $this->request = $request;
		$this->db = $db;
		$this->auth = $auth;
        $this->user = $user;
		$this->config = $config;
		$this->config_text = $config_text;
		$this->template = $template;
 		$this->phpbb_root_path = $phpbb_root_path;
		$this->table_prefix = $table_prefix;
        $this->php_ext = $php_ext; 
	}
	public function load_language_on_setup($event)
	{
		$lang_set_ext = $event['lang_set_ext'];
		$lang_set_ext[] = array(
			'ext_name' => 'aleksey/chat',
			'lang_set' => 'chat',
		);
		$event['lang_set_ext'] = $lang_set_ext;
	}

}