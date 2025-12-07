declare module 'react-simple-maps' {
  import { ReactNode, CSSProperties, ComponentType } from 'react';

  interface ComposableMapProps {
    children?: ReactNode;
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    width?: number;
    height?: number;
    style?: CSSProperties;
    className?: string;
  }

  interface GeographiesProps {
    children: (props: { geographies: Geography[] }) => ReactNode;
    geography: string | object;
    parseGeographies?: (features: Geography[]) => Geography[];
  }

  interface Geography {
    rsmKey: string;
    properties: Record<string, unknown>;
    geometry: object;
  }

  interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    className?: string;
  }

  interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    style?: {
      default?: CSSProperties;
      hover?: CSSProperties;
      pressed?: CSSProperties;
    };
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
    className?: string;
  }

  interface ZoomableGroupProps {
    children?: ReactNode;
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: (position: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (position: { coordinates: [number, number]; zoom: number }) => void;
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void;
  }

  interface LineProps {
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeDasharray?: string;
    strokeOpacity?: number;
    className?: string;
  }

  interface AnnotationProps {
    subject: [number, number];
    dx?: number;
    dy?: number;
    curve?: number;
    connectorProps?: object;
    children?: ReactNode;
  }

  interface SphereProps {
    id?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
  }

  interface GraticuleProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    step?: [number, number];
    className?: string;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Line: ComponentType<LineProps>;
  export const Annotation: ComponentType<AnnotationProps>;
  export const Sphere: ComponentType<SphereProps>;
  export const Graticule: ComponentType<GraticuleProps>;
}
