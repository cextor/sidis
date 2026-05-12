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
        $routes->post('users/profile', 'Auth::updateProfile');
        $routes->get('users', 'Auth::index');
        
        $routes->get('mails/incoming', 'MailsIncoming::index');
        $routes->post('mails/incoming', 'MailsIncoming::create');
        $routes->post('mails/incoming/update/(:segment)', 'MailsIncoming::update/$1');
        $routes->delete('mails/incoming/(:segment)', 'MailsIncoming::delete/$1');

        $routes->get('dispositions', 'Dispositions::index');
        $routes->post('dispositions', 'Dispositions::create');
        $routes->put('dispositions/(:segment)/read', 'Dispositions::markAsRead/$1');
        $routes->put('dispositions/(:segment)/complete', 'Dispositions::markAsComplete/$1');

        $routes->get('notifications', 'NotificationsController::index');
        $routes->put('notifications/read', 'NotificationsController::markAsRead');

        
        $routes->get('mails/outgoing', 'MailsOutgoing::index');
        $routes->post('mails/outgoing', 'MailsOutgoing::create');
        $routes->put('mails/outgoing/(:segment)', 'MailsOutgoing::update/$1');
        $routes->delete('mails/outgoing/(:segment)', 'MailsOutgoing::delete/$1');
    });
});

// Handle CORS preflight OPTIONS requests for all routes
$routes->options('(:any)', static function() {});
