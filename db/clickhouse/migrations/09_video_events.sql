-- Video Events Table
-- Tracks video playback events: start, Q1 (25%), Q2 (50%), Q3 (75%), complete (100%)
CREATE TABLE analytics.video_events
(
    event_id UUID,
    website_id UUID,
    session_id UUID,
    creative_id String,
    campaign_id String,
    video_url String,
    player_type LowCardinality(String),
    player_version String,
    -- Event tracking
    event_type LowCardinality(String), -- start, Q1, Q2, Q3, complete, pause, resume, fullscreen, mute, unmute
    quartile UInt8, -- 0=start, 25, 50, 75, 100=complete
    timestamp_ms UInt32, -- Milliseconds into video when event occurred
    -- Video metadata
    video_duration UInt32, -- Total video duration in milliseconds
    video_bitrate UInt32, -- Current bitrate in kbps
    video_width UInt16,
    video_height UInt16,
    -- Viewability
    is_viewable UInt8, -- 1 if viewable at time of event, 0 otherwise
    viewable_percent UInt8, -- Percentage of video pixels in viewport (0-100)
    volume_percent UInt8, -- Volume level 0-100
    -- VAST metadata
    vast_version String,
    vast_ad_id String,
    ad_server LowCardinality(String),
    -- Error tracking
    error_code String,
    error_message String,
    -- Context
    url_path String,
    referrer_domain String,
    device LowCardinality(String),
    os LowCardinality(String),
    browser LowCardinality(String),
    country LowCardinality(String),
    -- Timing
    created_at DateTime('UTC'),
    job_id Nullable(UUID)
)
ENGINE = MergeTree
    PARTITION BY toYYYYMM(created_at)
    ORDER BY (website_id, session_id, creative_id, created_at)
    PRIMARY KEY (website_id, session_id, creative_id)
    SETTINGS index_granularity = 8192;

-- Pod Events Table
-- Tracks CTV ad pod events for connected TV advertising
CREATE TABLE analytics.pod_events
(
    event_id UUID,
    website_id UUID,
    session_id UUID,
    pod_id String,
    -- Pod structure
    pod_position LowCardinality(String), -- pre-roll, mid-roll, post-roll
    pod_duration UInt32, -- Total pod duration in milliseconds
    max_slots UInt8, -- Maximum number of ad slots in pod
    slot_number UInt8, -- Slot position within pod (1-8 typical)
    -- Slot details
    creative_id String,
    advertiser_id String,
    brand_id String,
    industry_category String,
    -- Event tracking
    event_type LowCardinality(String), -- pod_start, slot_start, slot_complete, pod_complete, slot_skipped
    slot_duration UInt32, -- Duration of this slot in milliseconds
    -- Competitive separation
    previous_advertiser_id String,
    previous_brand_id String,
    previous_industry_category String,
    separation_seconds UInt16, -- Seconds since previous ad
    -- Fill and performance
    is_filled UInt8, -- 1 if slot filled with ad, 0 if empty
    fill_type LowCardinality(String), -- direct, programmatic, house, empty
    -- Context
    content_id String,
    content_genre LowCardinality(String),
    device_type LowCardinality(String), -- roku, firetv, appletv, samsung, lg, etc
    device_model String,
    os_version String,
    app_name String,
    app_version String,
    -- Timing
    created_at DateTime('UTC'),
    job_id Nullable(UUID)
)
ENGINE = MergeTree
    PARTITION BY toYYYYMM(created_at)
    ORDER BY (website_id, session_id, pod_id, slot_number, created_at)
    PRIMARY KEY (website_id, session_id, pod_id)
    SETTINGS index_granularity = 8192;

-- Video Performance Hourly Stats
CREATE TABLE analytics.video_stats_hourly
(
    website_id UUID,
    creative_id String,
    player_type LowCardinality(String),
    -- Aggregated metrics
    starts SimpleAggregateFunction(sum, UInt64),
    q1_reached SimpleAggregateFunction(sum, UInt64),
    q2_reached SimpleAggregateFunction(sum, UInt64),
    q3_reached SimpleAggregateFunction(sum, UInt64),
    completes SimpleAggregateFunction(sum, UInt64),
    errors SimpleAggregateFunction(sum, UInt64),
    -- Viewability
    viewable_starts SimpleAggregateFunction(sum, UInt64),
    avg_viewable_percent SimpleAggregateFunction(avg, Float32),
    -- Quality
    avg_bitrate SimpleAggregateFunction(avg, Float32),
    avg_duration SimpleAggregateFunction(avg, Float32),
    -- Context
    device LowCardinality(String),
    country LowCardinality(String),
    -- Time
    hour_timestamp DateTime('UTC')
)
ENGINE = AggregatingMergeTree
    PARTITION BY toYYYYMM(hour_timestamp)
    ORDER BY (website_id, creative_id, player_type, device, hour_timestamp)
    SETTINGS index_granularity = 8192;

-- Materialized view for video stats
CREATE MATERIALIZED VIEW analytics.video_stats_hourly_mv
TO analytics.video_stats_hourly
AS
SELECT
    website_id,
    creative_id,
    player_type,
    countIf(event_type = 'start') as starts,
    countIf(quartile = 25) as q1_reached,
    countIf(quartile = 50) as q2_reached,
    countIf(quartile = 75) as q3_reached,
    countIf(quartile = 100) as completes,
    countIf(error_code != '') as errors,
    countIf(event_type = 'start' AND is_viewable = 1) as viewable_starts,
    avgIf(viewable_percent, is_viewable = 1) as avg_viewable_percent,
    avg(video_bitrate) as avg_bitrate,
    avg(video_duration) as avg_duration,
    device,
    country,
    toStartOfHour(created_at) as hour_timestamp
FROM analytics.video_events
GROUP BY
    website_id,
    creative_id,
    player_type,
    device,
    country,
    hour_timestamp;

-- Pod Performance Hourly Stats
CREATE TABLE analytics.pod_stats_hourly
(
    website_id UUID,
    pod_position LowCardinality(String),
    slot_number UInt8,
    -- Aggregated metrics
    total_pods SimpleAggregateFunction(sum, UInt64),
    filled_slots SimpleAggregateFunction(sum, UInt64),
    empty_slots SimpleAggregateFunction(sum, UInt64),
    completed_slots SimpleAggregateFunction(sum, UInt64),
    -- Fill breakdown
    direct_fills SimpleAggregateFunction(sum, UInt64),
    programmatic_fills SimpleAggregateFunction(sum, UInt64),
    house_fills SimpleAggregateFunction(sum, UInt64),
    -- Competitive separation
    separation_violations SimpleAggregateFunction(sum, UInt64), -- Same brand within 60 seconds
    avg_separation_seconds SimpleAggregateFunction(avg, Float32),
    -- Context
    device_type LowCardinality(String),
    -- Time
    hour_timestamp DateTime('UTC')
)
ENGINE = AggregatingMergeTree
    PARTITION BY toYYYYMM(hour_timestamp)
    ORDER BY (website_id, pod_position, slot_number, device_type, hour_timestamp)
    SETTINGS index_granularity = 8192;

-- Materialized view for pod stats
CREATE MATERIALIZED VIEW analytics.pod_stats_hourly_mv
TO analytics.pod_stats_hourly
AS
SELECT
    website_id,
    pod_position,
    slot_number,
    countIf(event_type = 'pod_start') as total_pods,
    countIf(is_filled = 1) as filled_slots,
    countIf(is_filled = 0) as empty_slots,
    countIf(event_type = 'slot_complete') as completed_slots,
    countIf(fill_type = 'direct') as direct_fills,
    countIf(fill_type = 'programmatic') as programmatic_fills,
    countIf(fill_type = 'house') as house_fills,
    countIf(separation_seconds < 60 AND previous_brand_id = brand_id AND previous_brand_id != '') as separation_violations,
    avgIf(separation_seconds, separation_seconds > 0) as avg_separation_seconds,
    device_type,
    toStartOfHour(created_at) as hour_timestamp
FROM analytics.pod_events
GROUP BY
    website_id,
    pod_position,
    slot_number,
    device_type,
    hour_timestamp;

-- Add projections for faster queries
ALTER TABLE analytics.video_events
ADD PROJECTION video_events_creative_projection (
SELECT * ORDER BY website_id, creative_id, event_type, created_at
);

ALTER TABLE analytics.video_events MATERIALIZE PROJECTION video_events_creative_projection;

ALTER TABLE analytics.pod_events
ADD PROJECTION pod_events_position_projection (
SELECT * ORDER BY website_id, pod_position, slot_number, created_at
);

ALTER TABLE analytics.pod_events MATERIALIZE PROJECTION pod_events_position_projection;
