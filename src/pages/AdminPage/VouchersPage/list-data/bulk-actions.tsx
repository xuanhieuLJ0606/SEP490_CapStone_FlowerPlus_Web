// use-bulk-actions.ts

export function useBulkActions() {
  const handleApprove = async (rows: any[]) => {
    console.log('Approve selected events:', rows);
  };

  return { handleApprove };
}
