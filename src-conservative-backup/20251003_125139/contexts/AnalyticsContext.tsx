'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WebsiteAnalytics, Conversion, ShopOrder, ContactRequest } from './DashboardContext';

// Stato per gli analytics
interface AnalyticsState {
  websiteAnalytics: WebsiteAnalytics[];
  conversions: Conversion[];
  shopOrders: ShopOrder[];
  contactRequests: ContactRequest[];
}

// Azioni per gli analytics
type AnalyticsAction = 
  | { type: 'ADD_WEBSITE_ANALYTICS'; payload: WebsiteAnalytics }
  | { type: 'UPDATE_WEBSITE_ANALYTICS'; payload: WebsiteAnalytics }
  | { type: 'DELETE_WEBSITE_ANALYTICS'; payload: string }
  | { type: 'ADD_CONVERSION'; payload: Conversion }
  | { type: 'UPDATE_CONVERSION'; payload: Conversion }
  | { type: 'DELETE_CONVERSION'; payload: string }
  | { type: 'ADD_SHOP_ORDER'; payload: ShopOrder }
  | { type: 'UPDATE_SHOP_ORDER'; payload: ShopOrder }
  | { type: 'DELETE_SHOP_ORDER'; payload: string }
  | { type: 'ADD_CONTACT_REQUEST'; payload: ContactRequest }
  | { type: 'UPDATE_CONTACT_REQUEST'; payload: ContactRequest }
  | { type: 'DELETE_CONTACT_REQUEST'; payload: string }
  | { type: 'LOAD_ANALYTICS_DATA'; payload: Partial<AnalyticsState> };

// Stato iniziale
const initialState: AnalyticsState = {
  websiteAnalytics: [],
  conversions: [],
  shopOrders: [],
  contactRequests: [],
};

// Reducer per gli analytics
function analyticsReducer(state: AnalyticsState, action: AnalyticsAction): AnalyticsState {
  switch (action.type) {
    case 'ADD_WEBSITE_ANALYTICS':
      return {
        ...state,
        websiteAnalytics: [...state.websiteAnalytics, action.payload],
      };
    case 'UPDATE_WEBSITE_ANALYTICS':
      return {
        ...state,
        websiteAnalytics: state.websiteAnalytics.map(analytics =>
          analytics.id === action.payload.id ? action.payload : analytics
        ),
      };
    case 'DELETE_WEBSITE_ANALYTICS':
      return {
        ...state,
        websiteAnalytics: state.websiteAnalytics.filter(analytics => analytics.id !== action.payload),
      };
    case 'ADD_CONVERSION':
      return {
        ...state,
        conversions: [...state.conversions, action.payload],
      };
    case 'UPDATE_CONVERSION':
      return {
        ...state,
        conversions: state.conversions.map(conversion =>
          conversion.id === action.payload.id ? action.payload : conversion
        ),
      };
    case 'DELETE_CONVERSION':
      return {
        ...state,
        conversions: state.conversions.filter(conversion => conversion.id !== action.payload),
      };
    case 'ADD_SHOP_ORDER':
      return {
        ...state,
        shopOrders: [...state.shopOrders, action.payload],
      };
    case 'UPDATE_SHOP_ORDER':
      return {
        ...state,
        shopOrders: state.shopOrders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
      };
    case 'DELETE_SHOP_ORDER':
      return {
        ...state,
        shopOrders: state.shopOrders.filter(order => order.id !== action.payload),
      };
    case 'ADD_CONTACT_REQUEST':
      return {
        ...state,
        contactRequests: [...state.contactRequests, action.payload],
      };
    case 'UPDATE_CONTACT_REQUEST':
      return {
        ...state,
        contactRequests: state.contactRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        ),
      };
    case 'DELETE_CONTACT_REQUEST':
      return {
        ...state,
        contactRequests: state.contactRequests.filter(request => request.id !== action.payload),
      };
    case 'LOAD_ANALYTICS_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Context type
interface AnalyticsContextType {
  state: AnalyticsState;
  addWebsiteAnalytics: (analytics: Omit<WebsiteAnalytics, 'id'>) => void;
  updateWebsiteAnalytics: (analytics: WebsiteAnalytics) => void;
  deleteWebsiteAnalytics: (id: string) => void;
  addConversion: (conversion: Omit<Conversion, 'id'>) => void;
  updateConversion: (conversion: Conversion) => void;
  deleteConversion: (id: string) => void;
  addShopOrder: (order: Omit<ShopOrder, 'id'>) => void;
  updateShopOrder: (order: ShopOrder) => void;
  deleteShopOrder: (id: string) => void;
  addContactRequest: (request: Omit<ContactRequest, 'id'>) => void;
  updateContactRequest: (request: ContactRequest) => void;
  deleteContactRequest: (id: string) => void;
}

// Context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// Provider
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  const addWebsiteAnalytics = (analytics: Omit<WebsiteAnalytics, 'id'>) => {
    const newAnalytics: WebsiteAnalytics = {
      ...analytics,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_WEBSITE_ANALYTICS', payload: newAnalytics });
  };

  const updateWebsiteAnalytics = (analytics: WebsiteAnalytics) => {
    dispatch({ type: 'UPDATE_WEBSITE_ANALYTICS', payload: analytics });
  };

  const deleteWebsiteAnalytics = (id: string) => {
    dispatch({ type: 'DELETE_WEBSITE_ANALYTICS', payload: id });
  };

  const addConversion = (conversion: Omit<Conversion, 'id'>) => {
    const newConversion: Conversion = {
      ...conversion,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CONVERSION', payload: newConversion });
  };

  const updateConversion = (conversion: Conversion) => {
    dispatch({ type: 'UPDATE_CONVERSION', payload: conversion });
  };

  const deleteConversion = (id: string) => {
    dispatch({ type: 'DELETE_CONVERSION', payload: id });
  };

  const addShopOrder = (order: Omit<ShopOrder, 'id'>) => {
    const newOrder: ShopOrder = {
      ...order,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_SHOP_ORDER', payload: newOrder });
  };

  const updateShopOrder = (order: ShopOrder) => {
    dispatch({ type: 'UPDATE_SHOP_ORDER', payload: order });
  };

  const deleteShopOrder = (id: string) => {
    dispatch({ type: 'DELETE_SHOP_ORDER', payload: id });
  };

  const addContactRequest = (request: Omit<ContactRequest, 'id'>) => {
    const newRequest: ContactRequest = {
      ...request,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CONTACT_REQUEST', payload: newRequest });
  };

  const updateContactRequest = (request: ContactRequest) => {
    dispatch({ type: 'UPDATE_CONTACT_REQUEST', payload: request });
  };

  const deleteContactRequest = (id: string) => {
    dispatch({ type: 'DELETE_CONTACT_REQUEST', payload: id });
  };

  const value: AnalyticsContextType = {
    state,
    addWebsiteAnalytics,
    updateWebsiteAnalytics,
    deleteWebsiteAnalytics,
    addConversion,
    updateConversion,
    deleteConversion,
    addShopOrder,
    updateShopOrder,
    deleteShopOrder,
    addContactRequest,
    updateContactRequest,
    deleteContactRequest,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook per usare il context
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
