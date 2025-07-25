package me.arturs.eventapi.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import me.arturs.eventapi.dto.EventUpdateDTO;
import me.arturs.eventapi.entity.Event;
import me.arturs.eventapi.entity.Event.Status;
import me.arturs.eventapi.repository.EventRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public Event createDummyEvent() {
        Event event = new Event();
        event.setTitle("Dummy Event " + LocalDateTime.now());
        event.setStartDate(LocalDateTime.now());
        event.setEndDate(LocalDateTime.now().plusHours(2));
        event.setPrice(new BigDecimal("10.00"));
        event.setStatus(Status.STARTED);
        return eventRepository.save(event);
    }

    public Event createEvent(Event event) {
        if (event.getEndDate().isBefore(event.getStartDate())) {
            throw new IllegalArgumentException("endDate cannot be before startDate");
        }
        return eventRepository.save(event);
    }

    public Optional<Event> updateEvent(Long id, EventUpdateDTO dto) {
        return eventRepository.findById(id).map(existingEvent -> {
            if (dto.title != null) existingEvent.setTitle(dto.title);
            if (dto.startDate != null) existingEvent.setStartDate(dto.startDate);
            if (dto.endDate != null) existingEvent.setEndDate(dto.endDate);
            if (dto.price != null) existingEvent.setPrice(dto.price);
            if (dto.status != null) existingEvent.setStatus(dto.status);

            if (existingEvent.getEndDate().isBefore(existingEvent.getStartDate()))
                throw new IllegalArgumentException("endDate cannot be before startDate");

            return eventRepository.save(existingEvent);
        });
    }

    public boolean deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            return false;
        }
        eventRepository.deleteById(id);
        return true;
    }
}
