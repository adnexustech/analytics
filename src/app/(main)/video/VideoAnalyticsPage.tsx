'use client';

import { useState } from 'react';
import { useApi } from '@/components/hooks';
import { GridRow, GridColumn } from 'react-basics';
import PageHeader from '@/components/layout/PageHeader';
import VideoPerformanceChart from '@/components/video/VideoPerformanceChart';
import ViewabilityTrendChart from '@/components/video/ViewabilityTrendChart';
import VASTErrorTable from '@/components/video/VASTErrorTable';
import PlayerTypeBreakdown from '@/components/video/PlayerTypeBreakdown';
import BitrateAnalysisChart from '@/components/video/BitrateAnalysisChart';
import PodFillRateChart from '@/components/ctv/PodFillRateChart';
import PodCompletionChart from '@/components/ctv/PodCompletionChart';
import SlotPerformanceTable from '@/components/ctv/SlotPerformanceTable';
import BreakTypeAnalysis from '@/components/ctv/BreakTypeAnalysis';
import CompetitiveSeparationMetrics from '@/components/ctv/CompetitiveSeparationMetrics';
import { useWebsite } from '@/components/hooks';
import DatePickerForm from '@/components/metrics/DatePickerForm';

export function VideoAnalyticsPage() {
  const { websiteId } = useWebsite();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    unit: 'day',
  });

  // Video Performance Data
  const { data: videoPerformance, isLoading: isLoadingPerformance } = useApi(
    `/api/video/performance`,
    {
      websiteId,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    }
  );

  // Viewability Trends
  const { data: viewabilityTrends, isLoading: isLoadingViewability } = useApi(
    `/api/video/quartiles`,
    {
      websiteId,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      unit: dateRange.unit,
    }
  );

  // Player Type Breakdown
  const { data: playerTypes, isLoading: isLoadingPlayers } = useApi(
    `/api/video/performance`,
    {
      websiteId,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      metric: 'player-types',
    }
  );

  // CTV Pod Metrics
  const { data: podFillRate, isLoading: isLoadingPodFill } = useApi(
    `/api/ctv/pod-metrics`,
    {
      websiteId,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      metric: 'fill-rate',
      unit: dateRange.unit,
    }
  );

  const { data: slotPerformance, isLoading: isLoadingSlots } = useApi(
    `/api/ctv/pod-metrics`,
    {
      websiteId,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      metric: 'slots',
    }
  );

  const { data: breakTypeAnalysis, isLoading: isLoadingBreaks } = useApi(
    `/api/ctv/pod-metrics`,
    {
      websiteId,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      metric: 'breaks',
    }
  );

  return (
    <>
      <PageHeader title="Video & CTV Analytics" />

      <div style={{ marginBottom: 24 }}>
        <DatePickerForm
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={(newRange) => setDateRange({ ...dateRange, ...newRange })}
        />
      </div>

      {/* Video Analytics Section */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
          Video Performance
        </h2>

        <GridRow>
          <GridColumn xs={12} lg={12}>
            <div style={{ padding: 16, background: '#fff', borderRadius: 8, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                Quartile Completion Funnel
              </h3>
              <VideoPerformanceChart
                data={videoPerformance?.data || []}
                isLoading={isLoadingPerformance}
              />
            </div>
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn xs={12} lg={6}>
            <div style={{ padding: 16, background: '#fff', borderRadius: 8, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                Viewability Trends
              </h3>
              <ViewabilityTrendChart
                data={viewabilityTrends?.data || []}
                isLoading={isLoadingViewability}
                unit={dateRange.unit}
              />
            </div>
          </GridColumn>

          <GridColumn xs={12} lg={6}>
            <div style={{ padding: 16, background: '#fff', borderRadius: 8, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                Player Type Distribution
              </h3>
              <PlayerTypeBreakdown
                data={playerTypes?.data || []}
                isLoading={isLoadingPlayers}
              />
            </div>
          </GridColumn>
        </GridRow>
      </section>

      {/* CTV Analytics Section */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
          CTV Ad Pod Analytics
        </h2>

        <GridRow>
          <GridColumn xs={12} lg={6}>
            <div style={{ padding: 16, background: '#fff', borderRadius: 8, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                Pod Fill Rate Trends
              </h3>
              <PodFillRateChart
                data={podFillRate?.data || []}
                isLoading={isLoadingPodFill}
                unit={dateRange.unit}
              />
            </div>
          </GridColumn>

          <GridColumn xs={12} lg={6}>
            <div style={{ padding: 16, background: '#fff', borderRadius: 8, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                Completion by Slot Position
              </h3>
              <PodCompletionChart
                data={slotPerformance?.data || []}
                isLoading={isLoadingSlots}
              />
            </div>
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn xs={12} lg={12}>
            <div style={{ padding: 16, background: '#fff', borderRadius: 8, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                Break Type Performance
              </h3>
              <BreakTypeAnalysis
                data={breakTypeAnalysis?.data || []}
                isLoading={isLoadingBreaks}
              />
            </div>
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn xs={12} lg={12}>
            <div style={{ padding: 16, background: '#fff', borderRadius: 8, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>
                Slot Performance Details
              </h3>
              <SlotPerformanceTable
                data={slotPerformance?.data || []}
                isLoading={isLoadingSlots}
              />
            </div>
          </GridColumn>
        </GridRow>
      </section>
    </>
  );
}

export default VideoAnalyticsPage;
