<?php
/**
*
* @package phpBB Extension - My test
* @copyright (c) 2013 phpBB Groupn
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2
*
*/

namespace aleksey\chat\acp;

class main_info
{
    function module()
    {
        return array(
            'filename'    => '\aleksey\chat\acp\main_module',
            'title'        => 'ACP_CHAT',
            'version'    => '1.0.0',
            'modes'        => array(
            'settings'    => array('title' => 'ACP_CHAT', 'auth' => 'ext_aleksey/chat && acl_a_board', 'cat' => array('ACP_CHAT')),
            ),
        );
    }
}