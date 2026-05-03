import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";
import { themes } from "./config";

const TabsHeader = ({
  activeTabs,
  onTabClick,
  pickerPos,
  showThemePicker,
  switchTheme,
  theme,
  themePickerRef,
  toggleBtnRef,
  toggleThemePicker,
  tabs,
}) => {
  const isTabActive = (tab) => activeTabs.includes(tab.id);

  return (
    <div className="tabs-header">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${isTabActive(tab) ? "active" : ""}`}
          onClick={() => onTabClick(tab)}
        >
          <tab.icon size={14} />
          <span>{tab.label}</span>
        </button>
      ))}
      <div className="theme-picker-wrapper" ref={themePickerRef}>
        <button
          className="theme-toggle-tab"
          ref={toggleBtnRef}
          onClick={toggleThemePicker}
          aria-label="Choose theme"
          title="Choose theme"
        >
          <Palette size={16} />
        </button>
        <AnimatePresence>
          {showThemePicker && (
            <motion.div
              className="theme-picker-dropdown"
              style={{ top: pickerPos.top, right: pickerPos.right }}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                return (
                  <button
                    key={themeOption.id}
                    className={`theme-option ${theme === themeOption.id ? "active" : ""}`}
                    onClick={(event) => switchTheme(themeOption.id, event)}
                  >
                    <Icon size={14} />
                    <span>{themeOption.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabsHeader;
