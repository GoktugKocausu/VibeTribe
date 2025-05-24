package com.example.vibetribesdemo.Repository;

import com.example.vibetribesdemo.entities.EventEntity;
import com.example.vibetribesdemo.entities.LocationEntity;
import com.example.vibetribesdemo.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<EventEntity, Long> {

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
            "FROM EventEntity e " +
            "WHERE e.location = :location " +
            "AND e.startTime < :endTime " +
            "AND e.endTime > :startTime")
    boolean existsByOverlappingTimeAndLocation(
            @Param("location") LocationEntity location,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );


    @Query(value = "SELECT DISTINCT e.* FROM events e " +
            "JOIN locations l ON l.location_id = e.location_id " +
            "WHERE " +
            "(:query IS NULL OR " +
            "LOWER(e.title) LIKE '%' || LOWER(:query) || '%' OR " +
            "LOWER(e.description) LIKE '%' || LOWER(:query) || '%') " +
            "AND (:address IS NULL OR LOWER(l.address) LIKE '%' || LOWER(:address) || '%')", 
            nativeQuery = true)
    List<EventEntity> searchEventsWithFilters(
            @Param("query") String query,
            @Param("address") String address);

    // Find events created by a specific user
    List<EventEntity> findByCreatedBy_Username(String username);

    // Find active events at a specific location
    @Query("SELECT e FROM EventEntity e WHERE e.location.locationId = :locationId AND e.status = 'ACTIVE'")
    List<EventEntity> findActiveEventsByLocation(@Param("locationId") Long locationId);


    @Query("SELECT COUNT(e) FROM EventEntity e WHERE e.createdBy.username = :username")
    int countHostedEventsByUser(@Param("username") String username);


    @Query("SELECT COUNT(e) FROM EventEntity e WHERE e.createdBy.username = :username AND e.status = 'ACTIVE'")
    long countHostedEvents(@Param("username") String username);



}
