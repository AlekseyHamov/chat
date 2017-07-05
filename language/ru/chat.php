<?php
/**
*
* @package phpBB Extension - My Test
* @copyright (c) 2013 phpBB Group
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2
*
*/

if (!defined('IN_PHPBB'))
{
	exit;
}

if (empty($lang) || !is_array($lang))
{
	$lang = array();
}

$lang = array_merge($lang, array(
	'CHAT'					=> 'Чат',
	'COLOR'					=> 'Цвет',
	'UPDATING'				=> 'Обновление',
	'SENDING'				=> 'Отправка',
	'SERVER_ERROR'			=> 'Ошибка соединения',
	'SOUND'					=> 'Звук',
	'SAY'					=> 'Сказать',
	'SMILIES'				=> 'Смайлы',
	'MENU'					=> 'Меню',
	'PRIVATE'				=> 'Приватное сообщение',
	'LOGIN_EXPLAIN_CHAT'	=> 'Вам необходимо авторизоваться или обновить стараницу, чтобы войти в чат.',
	'CHAT_BANNED'			=> 'Доступ к чату для вас закрыт.',
	'CHAT_BLOCKED'			=> 'Вы заблокированы и не можете писать из-за флуда. Блокировка продлится %1$s сек.',
	'USER_JOINED'			=> 'Нас приветствует',
	'USER_LEFT'				=> 'Нас покидает',
	'SECONDS'				=> 'сек.',
	'NOW_IN_CHAT'			=> 'Сейчас в чате',
	'N_MESSAGES'			=> 'сообщений',
	'N_UPDATES'				=> 'обновлений',
	'MESVISIBLE'			=> 'показать удаленные',
	'HIDECHAT'				=> 'Свернуть',
	'COLORCHAT'				=> 'Выбрать цвет текста',
	'VISIBLEPRIVATEWINDOW'	=> 'Приват в отдельном окне',
	'ALLPRIVATE'			=> 'Все отдельном окне',
	'ONEPRIVATE'			=> 'Каждый отдельном окне',
));