'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import { InfoModalProvider } from '@/contexts/InfoModalContext';
import MainDashboard from '@/components/Dashboard/MainDashboard';
import SyncStatus from '@/components/Dashboard/SyncStatus';
import ErrorBoundary from '@/components/Dashboard/ErrorBoundary';
import DatabaseErrorHandler from '@/components/Dashboard/DatabaseErrorHandler';

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <InfoModalProvider>
          <DatabaseErrorHandler>
            <MainDashboard />
            <SyncStatus />
          </DatabaseErrorHandler>
        </InfoModalProvider>
      </DashboardProvider>
    </ErrorBoundary>
  );
}
