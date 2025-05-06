// Dans components/ui/Tabs.jsx
import React from 'react';

export const TabList = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export const Tab = ({ id, children, className, active, onClick }) => {
  const activeClass = active ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  return (
    <button
      type="button"
      onClick={() => onClick && onClick(id)}
      className={`${className} ${activeClass}`}
    >
      {children}
    </button>
  );
};

export const TabPanel = ({ id, children, active }) => {
  if (!active) return null;
  return <div>{children}</div>;
};

export const Tabs = ({ children, activeTab, onChange }) => {
  // Clone and add props to TabList children
  const enhancedChildren = React.Children.map(children, (child) => {
    if (child.type === TabList) {
      const enhancedTabListChildren = React.Children.map(
        child.props.children,
        (tabChild) => {
          if (tabChild.type === Tab) {
            return React.cloneElement(tabChild, {
              active: tabChild.props.id === activeTab,
              onClick: (id) => onChange && onChange(id),
            });
          }
          return tabChild;
        }
      );
      return React.cloneElement(child, {
        children: enhancedTabListChildren,
      });
    }
    if (child.type === TabPanel) {
      return React.cloneElement(child, {
        active: child.props.id === activeTab,
      });
    }
    return child;
  });

  return <div>{enhancedChildren}</div>;
};
