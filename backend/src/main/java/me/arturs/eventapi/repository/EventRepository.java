package me.arturs.eventapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import me.arturs.eventapi.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}