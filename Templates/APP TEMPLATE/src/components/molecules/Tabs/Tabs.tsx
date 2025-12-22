// services/main/src/components/molecules/Tabs/Tabs.tsx

import React, { useState } from 'react';
import styles from './Tabs.module.css';

interface TabItem {
  label: string;
  key: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  initialTabKey?: string;
  className?: string;
}

/**
 * A theme-aware tab navigation component that manages local state.
 */
export const Tabs = ({ tabs, initialTabKey, className }: TabsProps) => {
  // Use first tab key as default if initialTabKey is not provided or invalid
  const [activeKey, setActiveKey] = useState(
    initialTabKey && tabs.some(t => t.key === initialTabKey) ? initialTabKey : tabs[0]?.key
  );
  
  // Find the active content
  const activeTab = tabs.find(t => t.key === activeKey);

  return (
    <div className={`${styles.tabContainer} ${className || ''}`}>
      
      {/* Tab Bar (Buttons) */}
      <div className={styles.tabBar} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={tab.key === activeKey}
            aria-controls={`tab-content-${tab.key}`}
            onClick={() => setActiveKey(tab.key)}
            className={`${styles.tabButton} ${tab.key === activeKey ? styles.active : ''}`}
            id={`tab-button-${tab.key}`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div 
        id={`tab-content-${activeKey}`} 
        role="tabpanel"
        aria-labelledby={`tab-button-${activeKey}`}
        className={styles.tabContent}
      >
        {activeTab?.content}
      </div>

    </div>
  );
};