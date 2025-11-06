import { motion } from 'framer-motion';

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
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden"
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center h-full transition-colors ${
                isActive
                  ? 'text-carrot'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={`Switch to ${tab.label} tab`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-semibold">{tab.label}</span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-carrot"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
