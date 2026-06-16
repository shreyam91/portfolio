import { Calendar } from "@/components/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

export function DatePicker() {
  // Mock data generator for demo purposes
  const getActivityStatus = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (date > today) return null; // No dot for future dates

    // Simple deterministic pattern for the demo
    const day = date.getDate();
    if (day % 4 === 0) return "bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.6)]"; // Inactive
    return "bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]"; // Active
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar 
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px] p-0 md:p-3 mx-auto" 
          components={{
            DayContent: (props) => {
              const dotClass = getActivityStatus(props.date);
              return (
                <div className="flex flex-col items-center justify-center w-full h-full relative">
                  <span>{props.date.getDate()}</span>
                  {dotClass && (
                    <span className={`absolute bottom-1 w-1 h-1 rounded-full ${dotClass}`}></span>
                  )}
                </div>
              );
            }
          }}
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
