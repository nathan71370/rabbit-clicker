interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

/**
 * TabNavigation Component
 * Bottom tab navigation for mobile layout
 */
export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center h-full transition-all rounded-xl mx-0.5 ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={`Switch to ${tab.label} tab`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <span className="text-2xl mb-0.5">{tab.icon}</span>
              <span className="text-[10px] font-semibold">
                {tab.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
