-- First clean up existing badges
DELETE FROM user_badges;
DELETE FROM badges;

-- Insert badge types
INSERT INTO badges (badge_name, description, reputation_requirement, event_count_requirement, badge_type, created_at)
VALUES 
    -- Welcome badge
    ('Welcome Starter', 'Awarded for joining VibeTribe', 0, 0, 'WELCOME', CURRENT_TIMESTAMP),
    
    -- Event badges
    ('First Event', 'Created your first event', 0, 1, 'EVENT', CURRENT_TIMESTAMP),
    ('Event Pro', 'Created 5 events', 0, 5, 'EVENT', CURRENT_TIMESTAMP),
    ('Event Master', 'Created 10 events', 0, 10, 'EVENT', CURRENT_TIMESTAMP),
    
    -- Reputation badges
    ('Rising Star', 'Earned 100 reputation points', 100, 0, 'REPUTATION', CURRENT_TIMESTAMP),
    ('Reputation Master', 'Earned 500 reputation points', 500, 0, 'REPUTATION', CURRENT_TIMESTAMP),
    ('Reputation Legend', 'Earned 1000 reputation points', 1000, 0, 'REPUTATION', CURRENT_TIMESTAMP)
ON CONFLICT ON CONSTRAINT badges_badge_name_badge_type_key 
DO UPDATE SET 
    description = EXCLUDED.description,
    reputation_requirement = EXCLUDED.reputation_requirement,
    event_count_requirement = EXCLUDED.event_count_requirement; 