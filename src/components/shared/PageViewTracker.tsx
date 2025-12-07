'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageViewTrackerProps {
  // For dynamic pages, pass these props to track additional context
  pageType?: 'STATIC' | 'DYNAMIC';
  resourceType?: string; // e.g., 'product', 'certificate'
  resourceId?: string;
  resourceSlug?: string;
  pageName?: string; // Override automatic page name detection
}

// Generate or retrieve session ID from sessionStorage
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

export function PageViewTracker({
  pageType = 'STATIC',
  resourceType,
  resourceId,
  resourceSlug,
  pageName,
}: PageViewTrackerProps) {
  const pathname = usePathname();
  const trackedPaths = useRef<Set<string>>(new Set());
  const lastTrackedPath = useRef<string>('');

  useEffect(() => {
    // Create a unique key for this page view (path + resource details)
    const trackingKey = `${pathname}-${resourceType || ''}-${resourceId || ''}-${resourceSlug || ''}`;
    
    // Prevent duplicate tracking for the same page in the same session
    // (e.g., React Strict Mode double renders)
    if (trackedPaths.current.has(trackingKey)) {
      return;
    }

    // Also check if we just tracked this path (for route changes)
    if (lastTrackedPath.current === trackingKey) {
      return;
    }

    // Mark as tracked
    trackedPaths.current.add(trackingKey);
    lastTrackedPath.current = trackingKey;

    // Build tracking payload
    const payload = {
      path: pathname,
      pageName,
      pageType,
      resourceType,
      resourceId,
      resourceSlug,
      sessionId: getSessionId(),
      referer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    // Send tracking data asynchronously using multiple strategies
    // to ensure it doesn't block the main thread or page navigation
    
    // Strategy 1: Use sendBeacon (best for page unload scenarios)
    // Strategy 2: Use fetch with keepalive (for modern browsers)
    // Both are non-blocking and will complete even if the page navigates away

    const sendTracking = () => {
      const url = '/api/analytics/track';
      const data = JSON.stringify(payload);

      // Try sendBeacon first (most reliable for tracking)
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([data], { type: 'application/json' });
        const sent = navigator.sendBeacon(url, blob);
        if (sent) {
          return; // Successfully queued
        }
      }

      // Fallback to fetch with keepalive
      // keepalive allows the request to outlive the page
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
        keepalive: true, // Allow request to complete even if page closes
      }).catch(() => {
        // Silently fail - tracking should never affect user experience
      });
    };

    // Use requestIdleCallback if available for better performance
    // This ensures tracking runs when the browser is idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).requestIdleCallback(sendTracking, { timeout: 2000 });
    } else {
      // Fallback: use setTimeout to defer execution
      setTimeout(sendTracking, 0);
    }
  }, [pathname, pageType, resourceType, resourceId, resourceSlug, pageName]);

  // This component doesn't render anything
  return null;
}

// Export a hook version for more flexibility
export function usePageTracking(options: PageViewTrackerProps = {}) {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const {
      pageType = 'STATIC',
      resourceType,
      resourceId,
      resourceSlug,
      pageName,
    } = options;

    const payload = {
      path: pathname,
      pageName,
      pageType,
      resourceType,
      resourceId,
      resourceSlug,
      sessionId: getSessionId(),
      referer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    const url = '/api/analytics/track';
    const data = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      }).catch(() => {});
    }

    return () => {
      hasTracked.current = false;
    };
  }, [pathname, options]);
}
