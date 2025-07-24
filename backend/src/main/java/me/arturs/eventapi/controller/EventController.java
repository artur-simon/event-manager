package me.arturs.eventapi.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import me.arturs.eventapi.entity.Event;
import me.arturs.eventapi.service.EventService;

@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(event -> new ResponseEntity<>(event, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/createDummy")
    public ResponseEntity<Event> createDummyEvent() {
        Event event = eventService.createDummyEvent();
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@Valid @RequestBody Event event) {
        Event created = eventService.createEvent(event);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @Valid @RequestBody Event updatedEvent) {
        return eventService.updateEvent(id, updatedEvent)
                .map(event -> new ResponseEntity<>(event, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        boolean deleted = eventService.deleteEvent(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                       : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
