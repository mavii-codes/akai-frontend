import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { HeroBanner } from "@/components/dashboard/hero-banner";
import { TodaysPlan } from "@/components/dashboard/todays-plan";
// import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { AiSuggestion } from "@/components/dashboard/ai-suggestion";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StudyStreak } from "@/components/dashboard/study-streak";

export default function HomePage() {
  return (
    <>
      <DashboardHeader />
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        <HeroBanner />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TodaysPlan />
            <AiSuggestion />
            <QuickActions />
          </div>
          <div className="space-y-6">

            <StudyStreak />
          </div>
        </div>
      </div>
    </>
  );
}
