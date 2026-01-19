'use client';

import { useState, useCallback } from 'react';
import { ReportBatchesTable } from '@/components/ReportBatchesTable';
import { CreateBatchModal } from '@/components/CreateBatchModal';
import { ExportBatchList } from '@/components/ExportBatchList';

interface TableState {
  total: number;
  filtered: number;
  searchTerm: string;
}

export default function ReportBatchesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tableState, setTableState] = useState<TableState>({
    total: 0,
    filtered: 0,
    searchTerm: '',
  });

  const handleBatchCreated = () => {
    // Refresh the table by changing the key
    setRefreshKey((prev) => prev + 1);
  };

  const handleTableStateChange = useCallback((state: TableState) => {
    setTableState(state);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Report Batches
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage monthly report batches for investment reporting
              </p>
            </div>
            <div className="flex gap-3">
              <ExportBatchList
                totalBatches={tableState.total}
                filteredBatches={tableState.filtered}
                searchTerm={tableState.searchTerm}
              />
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                + Create New Batch
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Batches</h2>
          </div>
          <div className="p-6">
            <ReportBatchesTable
              key={refreshKey}
              onStateChange={handleTableStateChange}
            />
          </div>
        </div>
      </main>

      {/* Create Batch Modal */}
      <CreateBatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleBatchCreated}
      />
    </div>
  );
}
