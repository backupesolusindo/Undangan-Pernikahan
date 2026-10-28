<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Admin::index');

$routes->group('admin', function ($routes) {
    $routes->get('/', 'Admin::index');
    $routes->get('create', 'Admin::create');
    $routes->post('store', 'Admin::store');
    $routes->get('edit/(:num)', 'Admin::edit/$1');
    $routes->post('update/(:num)', 'Admin::update/$1');
    $routes->get('delete/(:num)', 'Admin::delete/$1');
    $routes->get('export', 'Admin::export');
    $routes->get('spreadsheet', 'Admin::spreadsheet');
    $routes->post('sync-google-sheets', 'Admin::syncGoogleSheets');

    // === MENU TUNGGAL: Asset Tampilan (Galeri + Kisah Cinta + We Are Wedding) ===
    $routes->get('aset', 'Admin::aset');
    $routes->get('aset/create/(:segment)', 'Admin::asetCreate/$1');
    $routes->post('aset/store/(:segment)', 'Admin::asetStore/$1');
    $routes->get('aset/edit/(:segment)/(:num)', 'Admin::asetEdit/$1/$2');
    $routes->post('aset/update/(:segment)/(:num)', 'Admin::asetUpdate/$1/$2');
    $routes->get('aset/delete/(:segment)/(:num)', 'Admin::asetDelete/$1/$2');

    // Rute lama dipertahankan sebagai redirect ke menu tunggal (kompatibilitas)
    // Galeri Foto CRUD
    $routes->get('gallery', 'Admin::gallery');
    $routes->get('gallery/create', 'Admin::galleryCreate');
    $routes->post('gallery/store', 'Admin::galleryStore');
    $routes->get('gallery/edit/(:num)', 'Admin::galleryEdit/$1');
    $routes->post('gallery/update/(:num)', 'Admin::galleryUpdate/$1');
    $routes->get('gallery/delete/(:num)', 'Admin::galleryDelete/$1');

    // Kisah Cinta Kami (Stories) CRUD
    $routes->get('stories', 'Admin::stories');
    $routes->get('stories/create', 'Admin::storyCreate');
    $routes->post('stories/store', 'Admin::storyStore');
    $routes->get('stories/edit/(:num)', 'Admin::storyEdit/$1');
    $routes->post('stories/update/(:num)', 'Admin::storyUpdate/$1');
    $routes->get('stories/delete/(:num)', 'Admin::storyDelete/$1');

    // We Are Wedding (Couple) CRUD
    $routes->get('couple', 'Admin::couple');
    $routes->get('couple/create', 'Admin::coupleCreate');
    $routes->post('couple/store', 'Admin::coupleStore');
    $routes->get('couple/edit/(:num)', 'Admin::coupleEdit/$1');
    $routes->post('couple/update/(:num)', 'Admin::coupleUpdate/$1');
    $routes->get('couple/delete/(:num)', 'Admin::coupleDelete/$1');
    // Acara Pernikahan (Events) CRUD
    $routes->get('events', 'Admin::events');
    $routes->get('events/create', 'Admin::eventCreate');
    $routes->post('events/store', 'Admin::eventStore');
    $routes->get('events/edit/(:num)', 'Admin::eventEdit/$1');
    $routes->post('events/update/(:num)', 'Admin::eventUpdate/$1');
    $routes->get('events/delete/(:num)', 'Admin::eventDelete/$1');
});

// FIX: gunakan huruf besar (GET, POST, OPTIONS) agar tidak deprecated di CI 4.7+
$routes->match(['GET', 'POST', 'OPTIONS'], 'api/rsvp', 'Api::rsvp');
$routes->match(['GET', 'POST', 'OPTIONS'], 'api_rsvp.php', 'Api::rsvp');
$routes->match(['GET', 'OPTIONS'], 'api/gallery', 'Api::gallery');
$routes->match(['GET', 'OPTIONS'], 'api/stories', 'Api::stories');
$routes->match(['GET', 'OPTIONS'], 'api/couple', 'Api::couple');
$routes->match(['GET', 'OPTIONS'], 'api/events', 'Api::events');

// --- AUTH API ---
$routes->match(['POST', 'OPTIONS'], 'api/auth/login', 'AuthApi::login');
$routes->match(['POST', 'OPTIONS'], 'api/auth/logout', 'AuthApi::logout');
$routes->match(['GET', 'OPTIONS'], 'api/auth/me', 'AuthApi::me');

// --- PUBLIC INVITATION API ---
$routes->match(['GET', 'OPTIONS'], 'api/settings', 'AdminApi::publicSettings');
$routes->match(['GET', 'OPTIONS'], 'api/invitees/check', 'AdminApi::checkInvitee');

// --- PROTECTED ADMIN API ---
$routes->group('api/admin', ['filter' => 'auth_api'], function ($routes) {
    // Dashboard stats
    $routes->match(['GET', 'OPTIONS'], 'dashboard', 'AdminApi::dashboard');

    // Wedding Settings
    $routes->match(['GET', 'OPTIONS'], 'settings', 'AdminApi::getSettings');
    $routes->match(['POST', 'OPTIONS'], 'settings', 'AdminApi::updateSettings');

    // Invitees (Daftar Tamu Undangan & Custom Link)
    $routes->match(['GET', 'OPTIONS'], 'invitees', 'AdminApi::listInvitees');
    $routes->match(['POST', 'OPTIONS'], 'invitees', 'AdminApi::createInvitee');
    $routes->match(['POST', 'PUT', 'OPTIONS'], 'invitees/(:num)', 'AdminApi::updateInvitee/$1');
    $routes->match(['DELETE', 'OPTIONS'], 'invitees/(:num)', 'AdminApi::deleteInvitee/$1');

    // RSVP Guests (Daftar Ucapan / Konfirmasi Kehadiran)
    $routes->match(['GET', 'OPTIONS'], 'guests', 'AdminApi::listGuests');
    $routes->match(['DELETE', 'OPTIONS'], 'guests/(:num)', 'AdminApi::deleteGuest/$1');

    // Gallery
    $routes->match(['GET', 'OPTIONS'], 'gallery', 'AdminApi::listGallery');
    $routes->match(['POST', 'OPTIONS'], 'gallery', 'AdminApi::createGallery');
    $routes->match(['POST', 'OPTIONS'], 'gallery/(:num)', 'AdminApi::updateGallery/$1');
    $routes->match(['DELETE', 'OPTIONS'], 'gallery/(:num)', 'AdminApi::deleteGallery/$1');

    // Stories (Love Journey)
    $routes->match(['GET', 'OPTIONS'], 'stories', 'AdminApi::listStories');
    $routes->match(['POST', 'OPTIONS'], 'stories', 'AdminApi::createStory');
    $routes->match(['POST', 'OPTIONS'], 'stories/(:num)', 'AdminApi::updateStory/$1');
    $routes->match(['DELETE', 'OPTIONS'], 'stories/(:num)', 'AdminApi::deleteStory/$1');

    // Couple (Mempelai)
    $routes->match(['GET', 'OPTIONS'], 'couple', 'AdminApi::listCouple');
    $routes->match(['GET', 'OPTIONS'], 'couple/(:segment)', 'AdminApi::getCoupleByRole/$1');
    $routes->match(['POST', 'OPTIONS'], 'couple/(:segment)', 'AdminApi::updateCouple/$1');

    // Events (Akad & Resepsi)
    $routes->match(['GET', 'OPTIONS'], 'events', 'AdminApi::listEvents');
    $routes->match(['POST', 'OPTIONS'], 'events', 'AdminApi::createEvent');
    $routes->match(['POST', 'PUT', 'OPTIONS'], 'events/(:num)', 'AdminApi::updateEvent/$1');
    $routes->match(['DELETE', 'OPTIONS'], 'events/(:num)', 'AdminApi::deleteEvent/$1');

    // Generic Upload
    $routes->match(['POST', 'OPTIONS'], 'upload', 'AdminApi::uploadImage');
});

