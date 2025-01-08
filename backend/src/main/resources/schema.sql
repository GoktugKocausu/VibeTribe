-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    badge_id SERIAL PRIMARY KEY,
    badge_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    reputation_requirement INTEGER DEFAULT 0,
    event_count_requirement INTEGER DEFAULT 0,
    badge_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT badges_badge_name_badge_type_key UNIQUE (badge_name, badge_type)
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    user_badge_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_badges_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_badges_badge FOREIGN KEY (badge_id) REFERENCES badges(badge_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
); 