import DashboardLayout from "@/app/dashboard/layout";

export default function MarketingCampaignsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Marketing Campaigns</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 min-h-[300px] flex flex-col items-center justify-center border border-indigo-100 dark:border-indigo-900">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Marketing campaigns and analytics will appear here.
          </p>
          <div className="h-48 w-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/20 rounded">
            <span className="text-indigo-400 dark:text-indigo-600">
              [Campaigns Table]
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
