<?php
/**
*
* @package phpBB Extension - My test
* @copyright (c) 2013 phpBB Group
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2
*
*/

namespace aleksey\chat\migrations;

class version_0_1_0 extends \phpbb\db\migration\migration
{
	public function effectively_installed()
	{
		return;
	}

	static public function depends_on()
	{
		return array('\phpbb\db\migration\data\v310\dev');
	}

	public function	 update_schema()
	{
			return array(
				'add_tables'	=> array(
					$this->table_prefix . 'chat_messages' => array(
						'COLUMNS' => array(
							'msg_id'						=> ['UINT:11',null, 'auto_increment'],
							'user_id'						=> ['UINT', 0],
							'username'						=> ['VCHAR:255', ''],
							'time'							=> ['TIMESTAMP', 0],
							'text'							=> ['VCHAR:255', ''],
							'color'							=> ['VCHAR:6', ''],
						),
						'PRIMARY_KEY'	=> 'msg_id',
					),
					$this->table_prefix . 'chat_sessions'	=> array(
						'COLUMNS'	=> array(
							'user_id'						=> ['UINT:11', null],
							'username'						=> ['VCHAR:255', ''],
							'last_active'					=> ['TIMESTAMP', 0],
							'user_status'					=> ['TINT:3', 0],
							'user_activity'					=> ['UINT:6', 0],
							'user_blocked'					=> ['BOOL', 0],
						),
						'PRIMARY_KEY'	=>  'user_id',
					),
				),
			);
	}		

	public function revert_schema()
	{
		return array(
			'drop_tables'	=> array(
				$this->table_prefix . 'chat_messages',
				$this->table_prefix . 'chat_sessions',
			),
		);
	}

	public function update_data()
	{
		return array(
			// Current version
			array('config.add', array('chat_version', '0.1.0')),
		);

	}

}