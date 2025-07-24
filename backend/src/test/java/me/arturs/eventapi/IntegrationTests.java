package me.arturs.eventapi;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.transaction.Transactional;
import me.arturs.eventapi.entity.Event;
import me.arturs.eventapi.repository.EventRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@Transactional
class IntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EventRepository eventRepository;

    @BeforeEach
    void setup() {
        eventRepository.deleteAll();
    }

    private Event createSampleEvent() {
        Event event = new Event();
        event.setTitle("Sample Event");
        event.setStartDate(LocalDateTime.of(2025, 1, 1, 10, 0));
        event.setEndDate(LocalDateTime.of(2025, 1, 2, 18, 0));
        event.setPrice(new BigDecimal("100.00"));
        event.setStatus(Event.Status.STARTED);

        return eventRepository.save(event);
    }

    @Test
    void testGetAllEventsReturnsEmptyList() throws Exception {
        mockMvc.perform(get("/events"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void testGetAllEventsReturnsList() throws Exception {
        mockMvc.perform(get("/events"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testGetEventByIdSuccess() throws Exception {
        Event event = createSampleEvent();
        mockMvc.perform(get("/events/{id}", event.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Sample Event"));
    }

    @Test
    void testGetEventByIdNotFound() throws Exception {
        mockMvc.perform(get("/events/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateEvent() throws Exception {
        String eventJson = """
            {
                "title": "New Event",
                "startDate": "2025-02-01T10:00:00",
                "endDate": "2025-02-02T18:00:00",
                "price": 150.00,
                "status": "STARTED"
            }
        """;
        mockMvc.perform(post("/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(eventJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Event"))
                .andExpect(jsonPath("$.status").value("STARTED"));
    }

    @Test
    void testUpdateEventSuccess() throws Exception {
        Event event = createSampleEvent();
        String updatedJson = """
            {
                "title": "Updated Event",
                "startDate": "2025-03-01T10:00:00",
                "endDate": "2025-03-02T18:00:00",
                "price": 200.00,
                "status": "COMPLETED"
            }
        """;
        mockMvc.perform(put("/events/{id}", event.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Event"))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void testUpdateEventNotFound() throws Exception {
        String updatedJson = """
            {
                "title": "Nonexistent Event",
                "startDate": "2025-03-01T10:00:00",
                "endDate": "2025-03-02T11:00:00",
                "price": 200.00,
                "status": "PAUSED"
            }
        """;
        mockMvc.perform(put("/events/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedJson))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteEventSuccess() throws Exception {
        Event event = createSampleEvent();
        mockMvc.perform(delete("/events/{id}", event.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteEventNotFound() throws Exception {
        mockMvc.perform(delete("/events/{id}", 999L))
                .andExpect(status().isNotFound());
    }
}
