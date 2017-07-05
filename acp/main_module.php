<?php
/**
*
* @package phpBB Extension - My test
* @copyright (c) 2013 phpBB Group
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2
*
*/

namespace aleksey\chat\acp;

class main_module
{
    var $u_action;

    function main($id, $mode)
    {
        global $db, $user, $auth, $template, $cache, $request;
        global $config, $phpbb_root_path, $phpbb_admin_path, $phpEx, $phpbb_container;

        $this->tpl_name = 'acp_chat_body';
        $this->page_title = $user->lang('ACP_CHAT');
        add_form_key('aleksey/chat');

        $config_text = $phpbb_container->get('config_text');

        if ($request->is_set_post('submit'))
        {
            if (!check_form_key('aleksey/chat'))
            {
                trigger_error('FORM_INVALID');
            }
			//$sql = 'Update phpbb_configcontact set colprofile="'.$request->variable('per_page', '');
			//$sql = 'INSERT INTO phpbb_configcontact (`user_id`, `colprofile`, `	state`) VALUES ("",'.$request->variable('per_page', '').', 0)';
			//$this->db->sql_query($sql);
           // $config->set('before_day', $request->variable('before_day', ''));
			//$config->set('active_post_begin_day', $request->variable('active_post_begin_day', ''));
//            $config_text->('before_day', $request->variable('before_day', ''));
            //$config_text->set($config_name, $config_value);

            trigger_error($user->lang['CONFIG_UPDATED'] . adm_back_link($this->u_action));
        }
        

        $template->assign_vars(array(
            'U_ACTION'        => $this->u_action,
           // 'BEFORE_DAY'      => (isset($config['before_day'])) ? $config['before_day'] : '',
			//'ACTIVE_POST_DAY' => (isset($config['active_post_begin_day'])) ? $config['active_post_begin_day'] : '',
        ));
        
    }
}
