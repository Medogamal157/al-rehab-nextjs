'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, MapPin, TrendingUp, Package } from 'lucide-react';
import { useRef, useState, useEffect, memo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import react-simple-maps to avoid SSR issues
const ComposableMap = dynamic(
  () => import('react-simple-maps').then((mod) => mod.ComposableMap),
  { ssr: false }
);
const Geographies = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Geographies),
  { ssr: false }
);
const Geography = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Geography),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Marker),
  { ssr: false }
);
const Line = dynamic(
  () => import('react-simple-maps').then((mod) => mod.Line),
  { ssr: false }
);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Countries we export to grouped by region
const exportCountries: Record<string, string[]> = {
  middleEast: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Iraq'],
  asia: ['China', 'India', 'Malaysia', 'Singapore', 'Indonesia', 'Thailand', 'Vietnam', 'Japan', 'South Korea', 'Pakistan', 'Bangladesh'],
  europe: ['Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Poland', 'Austria', 'Sweden'],
  northAmerica: ['United States of America', 'Canada', 'Mexico']
};

const regionData = {
  middleEast: {
    name: 'Middle East',
    count: '15+',
    countries: 'UAE, Saudi Arabia, Qatar, Kuwait',
    icon: '🕌',
    color: '#213D35',
    coordinates: [50, 25] as [number, number]
  },
  asia: {
    name: 'Asia',
    count: '20+',
    countries: 'China, India, Malaysia, Singapore',
    icon: '🏯',
    color: '#3d5a52',
    coordinates: [100, 30] as [number, number]
  },
  europe: {
    name: 'Europe',
    count: '12+',
    countries: 'Germany, UK, France, Italy',
    icon: '🏰',
    color: '#5E7C6C',
    coordinates: [10, 50] as [number, number]
  },
  northAmerica: {
    name: 'North America',
    count: '8+',
    countries: 'USA, Canada',
    icon: '🗽',
    color: '#758D74',
    coordinates: [-100, 45] as [number, number]
  }
};

// Egypt coordinates
const egyptCoordinates: [number, number] = [30, 27];

// Interactive World Map Component using react-simple-maps
function InteractiveWorldMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getCountryColor = (countryName: string) => {
    for (const [region, countries] of Object.entries(exportCountries)) {
      if (countries.includes(countryName)) {
        const data = regionData[region as keyof typeof regionData];
        return hoveredRegion === region ? data.color : data.color + 'cc'; // Add transparency when not hovered
      }
    }
    // Egypt
    if (countryName === 'Egypt') {
      return '#c4a24c';
    }
    return '#e5e7eb'; // Default gray for non-export countries
  };

  if (!mounted) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
        <Globe className="w-16 h-16 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-xl overflow-hidden bg-[#f8faf9]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140,
            center: [30, 25]
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                const fillColor = getCountryColor(countryName);
                
                // Determine which region this country belongs to
                let countryRegion: string | null = null;
                for (const [region, countries] of Object.entries(exportCountries)) {
                  if (countries.includes(countryName)) {
                    countryRegion = region;
                    break;
                  }
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { 
                        outline: 'none',
                        fill: countryRegion ? regionData[countryRegion as keyof typeof regionData].color : fillColor,
                        cursor: countryRegion ? 'pointer' : 'default'
                      },
                      pressed: { outline: 'none' }
                    }}
                    onMouseEnter={() => {
                      if (countryRegion) {
                        setHoveredRegion(countryRegion);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredRegion(null);
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Connection lines from Egypt to regions */}
          {Object.entries(regionData).map(([key, data]) => (
            <Line
              key={key}
              from={egyptCoordinates}
              to={data.coordinates}
              stroke={hoveredRegion === key ? '#c4a24c' : '#213D35'}
              strokeWidth={hoveredRegion === key ? 2 : 1}
              strokeLinecap="round"
              strokeDasharray="5,5"
              strokeOpacity={hoveredRegion === key ? 1 : 0.3}
            />
          ))}

          {/* Egypt Marker */}
          <Marker coordinates={egyptCoordinates}>
            <circle r={8} fill="#c4a24c" stroke="#fff" strokeWidth={2} />
            <text
              textAnchor="middle"
              y={-15}
              style={{ fontFamily: 'system-ui', fill: '#c4a24c', fontSize: '10px', fontWeight: 'bold' }}
            >
              🇪🇬 EGYPT
            </text>
          </Marker>

          {/* Region Markers */}
          {Object.entries(regionData).map(([key, data]) => (
            <Marker 
              key={key} 
              coordinates={data.coordinates}
              onMouseEnter={() => setHoveredRegion(key)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <circle 
                r={hoveredRegion === key ? 10 : 6} 
                fill={data.color} 
                stroke="#fff" 
                strokeWidth={2}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              />
              {hoveredRegion === key && (
                <text
                  textAnchor="middle"
                  y={-18}
                  style={{ fontFamily: 'system-ui', fill: data.color, fontSize: '11px', fontWeight: 'bold' }}
                >
                  {data.count}
                </text>
              )}
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Hover info card */}
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-4 right-4 bg-white rounded-xl p-4 shadow-xl border border-[#213D35]/10 min-w-[200px] z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{regionData[hoveredRegion as keyof typeof regionData].icon}</span>
            <div>
              <h4 className="font-semibold text-[#213D35]">
                {regionData[hoveredRegion as keyof typeof regionData].name}
              </h4>
              <p className="text-2xl font-bold text-[#c4a24c]">
                {regionData[hoveredRegion as keyof typeof regionData].count}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {regionData[hoveredRegion as keyof typeof regionData].countries}
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4 sm:gap-6">
        {Object.entries(regionData).map(([key, data]) => (
          <motion.div
            key={key}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
              hoveredRegion === key ? 'bg-gray-100 scale-105' : ''
            }`}
            onMouseEnter={() => setHoveredRegion(key)}
            onMouseLeave={() => setHoveredRegion(null)}
            whileHover={{ scale: 1.05 }}
          >
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: data.color }}
            />
            <span className="text-sm text-[#333333] font-medium">{data.name}</span>
            <span className="text-xs text-[#c4a24c] font-bold">{data.count}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function GlobalReach() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yMap = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const regions = [
    {
      name: 'Middle East',
      countries: 'UAE, Saudi Arabia, Qatar, Kuwait',
      icon: '🕌',
      count: '15+'
    },
    {
      name: 'Asia',
      countries: 'China, India, Malaysia, Singapore',
      icon: '🏯',
      count: '20+'
    },
    {
      name: 'Europe',
      countries: 'Germany, UK, France, Italy',
      icon: '🏰',
      count: '12+'
    },
    {
      name: 'North America',
      countries: 'USA, Canada',
      icon: '🗽',
      count: '8+'
    }
  ];

  const stats = [
    {
      icon: Globe,
      value: '50+',
      label: 'Countries',
      color: 'bg-[#213D35]'
    },
    {
      icon: MapPin,
      value: '200+',
      label: 'Active Clients',
      color: 'bg-[#5E7C6C]'
    },
    {
      icon: Package,
      value: '500+',
      label: 'Shipments/Year',
      color: 'bg-[#758D74]'
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: 'Client Satisfaction',
      color: 'bg-[#213D35]'
    }
  ];

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-[#F6F8F5] via-white to-[#E8EBE7] relative overflow-hidden">
      {/* Parallax Background Decorations */}
      <motion.div 
        style={{ y: yBackground, opacity: useTransform(opacity, [0, 1], [0, 0.05]) }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#213D35] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5E7C6C] rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl text-[#333333] mb-4 px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-[#213D35]">Al-Rehab Group for Export&apos;s</span> Global Reach
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-[#333333]/80 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Trusted by businesses worldwide, Al-Rehab Group for Export delivers premium Egyptian herbs and spices across continents with professionalism and reliability
          </motion.p>
        </motion.div>

        {/* Stats Grid with Parallax */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, -30 + (index * 10)])
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#213D35]/10"
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl text-[#213D35] mb-2">{stat.value}</div>
              <div className="text-sm sm:text-base text-[#333333]/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* World Map with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ y: yMap, scale }}
          className="mb-16 sm:mb-20"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-[#213D35]/10">
            <h3 className="text-2xl sm:text-3xl text-[#213D35] text-center mb-8">Where We Export</h3>
            
            <InteractiveWorldMap />
          </div>
        </motion.div>

        {/* Regions Grid with Parallax */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {regions.map((region, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                y: useTransform(scrollYProgress, [0, 1], [0, -20 * (index % 2 === 0 ? 1 : -1)])
              }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#213D35]/10 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl sm:text-5xl">{region.icon}</div>
                <div className="text-2xl sm:text-3xl text-[#213D35] group-hover:scale-110 transition-transform">
                  {region.count}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl text-[#333333] mb-3">{region.name}</h3>
              <p className="text-sm sm:text-base text-[#333333]/70 leading-relaxed">{region.countries}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA with Parallax */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -30])
          }}
          className="text-center px-4"
        >
          <p className="text-lg sm:text-xl text-[#333333] mb-6">
            Ready to join our global network of satisfied clients?
          </p>
          <Link href="/contact">
            <motion.button
              className="px-8 sm:px-10 py-4 sm:py-5 bg-[#213D35] text-white rounded-full shadow-xl hover:shadow-2xl hover:bg-[#5E7C6C] transition-all duration-300 text-base sm:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Export Journey
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
