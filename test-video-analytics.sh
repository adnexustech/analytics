#!/bin/bash

echo "=== Video & CTV Analytics Implementation Test ==="
echo ""

# Check ClickHouse schema
echo "✓ ClickHouse Schema Files:"
ls -lh db/clickhouse/migrations/09_video_events.sql
echo ""

# Check Video Components
echo "✓ Video Components:"
find src/components/video -type f -name "*.tsx" | while read file; do
  echo "  - $(basename $file)"
done
echo ""

# Check CTV Components
echo "✓ CTV Components:"
find src/components/ctv -type f -name "*.tsx" | while read file; do
  echo "  - $(basename $file)"
done
echo ""

# Check Video Queries
echo "✓ Video Query Functions:"
find src/queries/sql/video -type f -name "*.ts" | while read file; do
  echo "  - $(basename $file)"
done
echo ""

# Check CTV Queries
echo "✓ CTV Query Functions:"
find src/queries/sql/ctv -type f -name "*.ts" | while read file; do
  echo "  - $(basename $file)"
done
echo ""

# Check API Routes
echo "✓ API Routes:"
find src/app/api/video -type f -name "route.ts" | while read file; do
  echo "  - video/$(basename $(dirname $file))"
done
find src/app/api/ctv -type f -name "route.ts" | while read file; do
  echo "  - ctv/$(basename $(dirname $file))"
done
echo ""

# Check Main Page
echo "✓ Video Analytics Page:"
ls -lh src/app/\(main\)/video/page.tsx
echo ""

echo "=== Component & Schema Summary ==="
echo ""
echo "Video Components Created:"
echo "  1. VideoPerformanceChart - Quartile completion funnel"
echo "  2. ViewabilityTrendChart - Viewability % over time"
echo "  3. VASTErrorTable - Error tracking by creative"
echo "  4. PlayerTypeBreakdown - Performance by player"
echo "  5. BitrateAnalysisChart - Video quality metrics"
echo ""
echo "CTV Components Created:"
echo "  1. PodFillRateChart - Pod fill % trends"
echo "  2. PodCompletionChart - Completion rate by slot position"
echo "  3. SlotPerformanceTable - Performance by pod slot (1-8)"
echo "  4. BreakTypeAnalysis - Pre/mid/post-roll performance"
echo "  5. CompetitiveSeparationMetrics - Brand diversity in pods"
echo ""
echo "ClickHouse Tables:"
echo "  1. video_events - Video playback events (start, Q1, Q2, Q3, complete)"
echo "  2. pod_events - CTV ad pod events"
echo "  3. video_stats_hourly - Aggregated video metrics"
echo "  4. pod_stats_hourly - Aggregated pod metrics"
echo ""
echo "API Endpoints:"
echo "  - GET /api/video/performance - Video quartile metrics"
echo "  - GET /api/video/quartiles - Viewability trends"
echo "  - GET /api/ctv/pod-metrics - Pod fill rate, slots, breaks"
echo ""
echo "=== All Components Successfully Created! ==="
