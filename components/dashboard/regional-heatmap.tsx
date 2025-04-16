"use client"

import { useTheme } from "next-themes"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"

// Ethiopia GeoJSON (simplified for demo)
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/ethiopia/ethiopia-regions.json"

// Demo data - participation by region (0-100%)
const data = [
  { id: "ET-AA", value: 85 }, // Addis Ababa
  { id: "ET-AF", value: 60 }, // Afar
  { id: "ET-AM", value: 75 }, // Amhara
  { id: "ET-BE", value: 45 }, // Benishangul-Gumuz
  { id: "ET-DD", value: 30 }, // Dire Dawa
  { id: "ET-GA", value: 55 }, // Gambela
  { id: "ET-HA", value: 65 }, // Harari
  { id: "ET-OR", value: 70 }, // Oromia
  { id: "ET-SO", value: 40 }, // Somali
  { id: "ET-SN", value: 80 }, // Southern Nations
  { id: "ET-TI", value: 50 }, // Tigray
]

// Color scale for the heatmap
const colorScale = (value: number) => {
  const hue = ((1 - value / 100) * 240).toString(10)
  return `hsl(${hue}, 70%, 50%)`
}

export function RegionalHeatmap() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 2500,
        center: [40, 9],
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ZoomableGroup zoom={1}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const regionData = data.find((d) => d.id === geo.id)
              const value = regionData ? regionData.value : 0

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={regionData ? colorScale(value) : isDark ? "#2d3748" : "#e2e8f0"}
                  stroke={isDark ? "#4a5568" : "#cbd5e0"}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      outline: "none",
                      fill: "#F53",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  )
}
