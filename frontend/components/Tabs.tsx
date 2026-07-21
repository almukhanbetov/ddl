'use client';

import { useState, ReactNode } from 'react';

export type TabDef = { id: string; label: string; content: ReactNode };

export default function Tabs({ tabs }: { tabs: TabDef[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={active === tab.id ? 'is-active' : ''}
            onClick={() => setActive(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} className={`tab-panel${active === tab.id ? ' is-active' : ''}`}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
