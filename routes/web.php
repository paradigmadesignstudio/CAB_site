<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MediaProxyController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AboutUsController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\AcademyController;
use App\Http\Controllers\PartnersController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\MemberWorkshopController;
use App\Http\Controllers\PlansController;  
use App\Http\Controllers\SeoController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\CabRavenController;


Route::get('/health', [HealthController::class, 'show'])->name('health');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('seo.robots');
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('seo.sitemap');
Route::get('/media/{token}', [MediaProxyController::class, 'show'])
    ->middleware('throttle:180,1')
    ->where('token', '[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+')
    ->name('media.proxy');

Route::get('/', [HomeController::class, 'index'])->name('home'); //Feito
Route::post('/home/cta', [HomeController::class, 'storeCta'])
    ->middleware('throttle:10,1')
    ->name('home.cta');
Route::get('/sobre-nos', [AboutUsController::class, 'index'])->name('about-us');

Route::get('/blog', [BlogController::class, 'index'])->name('blog');
Route::post('/blog/newsletter', [BlogController::class, 'storeNewsletter'])
    ->middleware('throttle:5,1')
    ->name('blog.newsletter');
Route::get('/blog/posts/load-more', [BlogController::class, 'loadMorePosts'])
    ->middleware('throttle:60,1')
    ->name('blog.load-more');
Route::get('/blog/search-index', [BlogController::class, 'searchIndex'])
    ->middleware('throttle:60,1')
    ->name('blog.search-index');
Route::get('/blog/eventos', [BlogController::class, 'events'])->name('blog.events');
Route::get('/blog/eventos/{slug}', [EventsController::class, 'show'])->name('events.show');
Route::get('/blog/artigos-tecnicos', [BlogController::class, 'technicalArticles'])->name('blog.technical-articles');
Route::get('/blog/hibridos-e-eletricos', [BlogController::class, 'eletricHybrid'])->name('blog.eletric-hybrid');
Route::get('/blog/dicas', [BlogController::class, 'tips'])->name('blog.tips');
Route::get('/blog/mercado-do-automatico', [BlogController::class, 'automaticMarket'])->name('blog.automatic-market');
// Colunistas temporariamente inativo — redireciona para o índice do blog.
Route::redirect('/blog/colunistas-cab', '/blog', 302)->name('blog.columnists');
Route::get('/blog/marketing-para-oficinas', [BlogController::class, 'marketingWorkshops'])->name('blog.marketing-workshops');
Route::get('/blog/{slug}', [BlogController::class, 'post'])->name('blog.post');

Route::get('/academia-cab', [AcademyController::class, 'index'])->name('academy');
Route::post('/academia-cab/materiais/lead', [AcademyController::class, 'storeMaterialLead'])
    ->middleware('throttle:10,1')
    ->name('academy.material-lead');

Route::get('/parceiros', [PartnersController::class, 'index'])->name('partners');
Route::get('/parceiros/{slug}', [PartnersController::class, 'show'])->name('partner.show');

Route::get('/oficinas', [MemberWorkshopController::class, 'index'])->name('member-workshops');
Route::get('/oficinas/{slug}', [MemberWorkshopController::class, 'show'])->name('member-workshop.show');
Route::redirect('/sou-cab', '/oficinas', 301);
Route::get('/sou-cab/{slug}', fn (string $slug) => redirect()->route('member-workshop.show', $slug, 301))
    ->where('slug', '.*');

Route::get('/planos', [PlansController::class, 'index'])->name('plans');
Route::get('/planos/treinamentos', [PlansController::class, 'trainingsTable'])
    ->middleware('throttle:60,1')
    ->name('plans.trainings-table');
Route::get('/planos/ecossistema-integrado', [PlansController::class, 'ecosystem'])->name('plans-ecosystem');

Route::get('/suporte', [SupportController::class, 'index'])->name('support');
Route::post('/suporte/contato', [SupportController::class, 'storeContact'])
    ->middleware('throttle:5,1')
    ->name('support.contact');

// Landing da parceria CAB + Raven — acesso só por link direto (fora do menu).
Route::get('/cabraven', [CabRavenController::class, 'index'])->name('cabraven');
Route::post('/cabraven', [CabRavenController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('cabraven.store');
Route::get('/cabraven/cnpj/{cnpj}', [CabRavenController::class, 'cnpj'])
    ->where('cnpj', '[0-9]{14}')
    ->middleware('throttle:20,1')
    ->name('cabraven.cnpj');

Route::get('/politica-de-privacidade', [LegalController::class, 'privacy'])->name('legal.privacy');
Route::get('/termos-de-servico', [LegalController::class, 'terms'])->name('legal.terms');
Route::get('/politica-de-cookies', [LegalController::class, 'cookies'])->name('legal.cookies');