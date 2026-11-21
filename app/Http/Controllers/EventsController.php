<?php

namespace App\Http\Controllers;

use App\Services\Cab\Events\EventsService;
use Inertia\Inertia;
use Inertia\Response;

class EventsController extends Controller
{
    public function __construct(
        private EventsService $eventsService,
    ) {}

    public function show(string $slug): Response
    {
        $event = $this->eventsService->find($slug);

        if ($event === null) {
            abort(404);
        }

        $galleryImages = array_values($event['galleryImages'] ?? []);
        unset($event['galleryImages']);
        $event['galleryImageCount'] = count($galleryImages);

        return Inertia::render('events/show/page', [
            'event' => $event,
            'galleryImages' => Inertia::defer(
                fn (): array => $galleryImages,
                'event-gallery',
            ),
            'relatedEvents' => array_slice($this->eventsService->listRelated($slug, 3), 0, 3),
        ]);
    }
}
