<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
    $routes->post('auth/login', 'Auth::login');
    $routes->post('auth/register', 'Auth::register');
    
    // Protected routes
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('users/me', 'Auth::me');
        
        $routes->get('mails/incoming', 'MailsIncoming::index');
        $routes->post('mails/incoming', 'MailsIncoming::create');
        
        $routes->get('mails/outgoing', 'MailsOutgoing::index');
        $routes->post('mails/outgoing', 'MailsOutgoing::create');
    });
});
