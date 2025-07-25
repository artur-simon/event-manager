package me.arturs.eventapi.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import me.arturs.eventapi.entity.Event.Status;

public class EventUpdateDTO {

    public String title;
    public LocalDateTime startDate;
    public LocalDateTime endDate;
    public BigDecimal price;
    public Status status;
}
