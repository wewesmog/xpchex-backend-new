-- Initialize the xpchex database
-- This script runs when the PostgreSQL container starts for the first time

-- Create the main tables for the application
CREATE TABLE IF NOT EXISTS app_reviews (
    id SERIAL PRIMARY KEY,
    app_id VARCHAR(255) NOT NULL,
    review_text TEXT,
    rating INTEGER,
    review_date TIMESTAMP,
    reviewer_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maswali_conversations (
    id SERIAL PRIMARY KEY,
    log_timestamp TIMESTAMP WITH TIME ZONE,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    conversation_id VARCHAR(255),
    user_input TEXT,
    state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS artifacts (
    response_id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    quiz_parameters JSONB NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_app_reviews_app_id ON app_reviews(app_id);
CREATE INDEX IF NOT EXISTS idx_app_reviews_created_at ON app_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_maswali_conversations_user_id ON maswali_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_maswali_conversations_session_id ON maswali_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_user_id ON artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_is_published ON artifacts(is_published);
CREATE INDEX IF NOT EXISTS idx_artifacts_created_at ON artifacts(created_at);

-- Create a view for daily reviews summary
CREATE OR REPLACE VIEW daily_reviews_view AS
SELECT 
    DATE(created_at) as review_date,
    app_id,
    COUNT(*) as total_reviews,
    AVG(rating) as average_rating,
    COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews,
    COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_reviews
FROM app_reviews 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), app_id
ORDER BY review_date DESC;
