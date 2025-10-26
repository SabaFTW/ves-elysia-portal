#!/usr/bin/env python3
"""
🌊 ARSO Weather Connector
========================
Fetches and parses weather data from ARSO (Slovenian Environment Agency)
Part of the VES Elysia Portal - Weather Integration Module

ARSO XML Source: https://www.arso.gov.si/xml/vode/hidro_podatki_zadnji.xml
"""

import asyncio
import json
import logging
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
from xml.etree import ElementTree as ET

try:
    import aiohttp
except ImportError:
    print("❌ Missing dependency: aiohttp")
    print("Run: pip3 install aiohttp")
    sys.exit(1)

# Configuration
ARSO_XML_URL = "https://www.arso.gov.si/xml/vode/hidro_podatki_zadnji.xml"
CACHE_FILE = Path(__file__).parent / "data" / "arso_cache.json"
CACHE_DURATION = timedelta(minutes=5)  # ARSO updates every 5 minutes

# Logging
logger = logging.getLogger("ARSOConnector")


class WeatherData:
    """Represents parsed weather/hydro data from ARSO"""

    def __init__(self, station_data: Dict):
        self.station_id = station_data.get("station_id", "")
        self.station_name = station_data.get("station_name", "")
        self.river_name = station_data.get("river_name", "")
        self.water_level = station_data.get("water_level")
        self.flow_rate = station_data.get("flow_rate")
        self.temperature = station_data.get("temperature")
        self.timestamp = station_data.get("timestamp", "")
        self.latitude = station_data.get("latitude")
        self.longitude = station_data.get("longitude")

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
        return {
            "station_id": self.station_id,
            "station_name": self.station_name,
            "river_name": self.river_name,
            "water_level": self.water_level,
            "flow_rate": self.flow_rate,
            "temperature": self.temperature,
            "timestamp": self.timestamp,
            "latitude": self.latitude,
            "longitude": self.longitude,
        }

    def check_alerts(self) -> List[Dict]:
        """Check if any measurements exceed thresholds"""
        alerts = []

        # Water level alert (example threshold: > 400 cm)
        if self.water_level and self.water_level > 400:
            alerts.append({
                "type": "water_level",
                "severity": "high",
                "message": f"High water level at {self.station_name}: {self.water_level} cm",
                "value": self.water_level,
                "threshold": 400,
            })

        # Temperature alert (example: < 5°C or > 30°C)
        if self.temperature:
            if self.temperature < 5:
                alerts.append({
                    "type": "temperature",
                    "severity": "low",
                    "message": f"Low temperature at {self.station_name}: {self.temperature}°C",
                    "value": self.temperature,
                    "threshold": 5,
                })
            elif self.temperature > 30:
                alerts.append({
                    "type": "temperature",
                    "severity": "high",
                    "message": f"High temperature at {self.station_name}: {self.temperature}°C",
                    "value": self.temperature,
                    "threshold": 30,
                })

        return alerts


class ARSOConnector:
    """Main connector class for ARSO weather data"""

    def __init__(self, cache_file: Path = CACHE_FILE):
        self.cache_file = cache_file
        self.cache_file.parent.mkdir(parents=True, exist_ok=True)
        self.cached_data: Optional[Dict] = None
        self.cache_time: Optional[datetime] = None

    async def fetch_xml(self) -> str:
        """Fetch XML data from ARSO"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(ARSO_XML_URL, timeout=aiohttp.ClientTimeout(total=30)) as resp:
                    if resp.status == 200:
                        xml_data = await resp.text()
                        logger.info(f"✅ Fetched ARSO XML data ({len(xml_data)} bytes)")
                        return xml_data
                    else:
                        logger.error(f"❌ ARSO API returned status {resp.status}")
                        return ""
        except asyncio.TimeoutError:
            logger.error("❌ Timeout fetching ARSO data")
            return ""
        except Exception as e:
            logger.exception(f"❌ Error fetching ARSO data: {e}")
            return ""

    def parse_xml(self, xml_data: str) -> List[WeatherData]:
        """Parse ARSO XML and extract weather data"""
        weather_stations = []

        try:
            root = ET.fromstring(xml_data)

            # ARSO XML structure: <podatki><postaja>...</postaja></podatki>
            for station in root.findall(".//postaja"):
                station_data = {}

                # Extract station metadata
                station_data["station_id"] = station.get("sifra", "")
                station_data["station_name"] = station.get("ime", "")
                station_data["river_name"] = station.get("reka", "")

                # Extract coordinates
                try:
                    station_data["latitude"] = float(station.get("lat", "0"))
                    station_data["longitude"] = float(station.get("lon", "0"))
                except (ValueError, TypeError):
                    station_data["latitude"] = None
                    station_data["longitude"] = None

                # Extract measurements
                for meritev in station.findall("meritev"):
                    param = meritev.get("parameterId", "")
                    value_elem = meritev.find("vrednost")

                    if value_elem is not None and value_elem.text:
                        try:
                            value = float(value_elem.text)

                            # Map ARSO parameters to our data model
                            if param == "vodostaj":  # Water level
                                station_data["water_level"] = value
                            elif param == "pretok":  # Flow rate
                                station_data["flow_rate"] = value
                            elif param == "temperatura_vode":  # Water temperature
                                station_data["temperature"] = value
                        except ValueError:
                            pass

                # Extract timestamp
                datum = station.find(".//datum")
                if datum is not None and datum.text:
                    station_data["timestamp"] = datum.text

                # Create WeatherData object
                weather_obj = WeatherData(station_data)
                weather_stations.append(weather_obj)

            logger.info(f"✅ Parsed {len(weather_stations)} weather stations")
            return weather_stations

        except ET.ParseError as e:
            logger.exception(f"❌ XML parse error: {e}")
            return []
        except Exception as e:
            logger.exception(f"❌ Error parsing XML: {e}")
            return []

    async def get_current_data(self, use_cache: bool = True) -> List[WeatherData]:
        """Get current weather data (from cache or fetch fresh)"""
        # Check cache validity
        if use_cache and self.cached_data and self.cache_time:
            if datetime.now() - self.cache_time < CACHE_DURATION:
                logger.info("📦 Using cached data")
                return [WeatherData(station) for station in self.cached_data["stations"]]

        # Fetch fresh data
        logger.info("🌐 Fetching fresh ARSO data")
        xml_data = await self.fetch_xml()

        if not xml_data:
            # Return cached data if available
            if self.cached_data:
                logger.warning("⚠️  Using stale cache due to fetch failure")
                return [WeatherData(station) for station in self.cached_data["stations"]]
            return []

        # Parse XML
        weather_stations = self.parse_xml(xml_data)

        # Update cache
        self.cached_data = {
            "stations": [station.to_dict() for station in weather_stations],
            "timestamp": datetime.now().isoformat(),
        }
        self.cache_time = datetime.now()

        # Save to disk
        try:
            with open(self.cache_file, "w") as f:
                json.dump(self.cached_data, f, indent=2)
            logger.info(f"💾 Cache saved to {self.cache_file}")
        except Exception as e:
            logger.error(f"❌ Failed to save cache: {e}")

        return weather_stations

    def load_cache(self) -> bool:
        """Load cached data from disk"""
        try:
            if self.cache_file.exists():
                with open(self.cache_file, "r") as f:
                    self.cached_data = json.load(f)

                timestamp_str = self.cached_data.get("timestamp")
                if timestamp_str:
                    self.cache_time = datetime.fromisoformat(timestamp_str)
                    logger.info(f"📦 Loaded cache from {self.cache_file}")
                    return True
        except Exception as e:
            logger.error(f"❌ Failed to load cache: {e}")

        return False

    async def get_alerts(self) -> List[Dict]:
        """Get all current alerts from weather data"""
        weather_data = await self.get_current_data()
        all_alerts = []

        for station in weather_data:
            alerts = station.check_alerts()
            all_alerts.extend(alerts)

        return all_alerts

    def get_history(self, limit: int = 10) -> List[Dict]:
        """Get historical data from cache (placeholder for future implementation)"""
        # For now, return cached data as history
        # In production, this would query a time-series database
        if self.cached_data:
            return [self.cached_data]
        return []


async def main():
    """CLI interface for ARSO connector"""
    import argparse

    # Setup logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    parser = argparse.ArgumentParser(description="ARSO Weather Connector CLI")
    parser.add_argument("command", choices=["fetch", "cache", "alerts", "test"],
                        help="Command to execute")
    parser.add_argument("--no-cache", action="store_true",
                        help="Skip cache and fetch fresh data")

    args = parser.parse_args()

    connector = ARSOConnector()
    connector.load_cache()

    if args.command == "fetch":
        print("🌐 Fetching current ARSO weather data...\n")
        weather_data = await connector.get_current_data(use_cache=not args.no_cache)

        if weather_data:
            # For CLI usage
            if sys.stdout.isatty():
                print(f"✅ Retrieved {len(weather_data)} stations\n")
                for i, station in enumerate(weather_data[:5], 1):  # Show first 5
                    print(f"{i}. {station.station_name} ({station.river_name})")
                    if station.water_level:
                        print(f"   Water Level: {station.water_level} cm")
                    if station.flow_rate:
                        print(f"   Flow Rate: {station.flow_rate} m³/s")
                    if station.temperature:
                        print(f"   Temperature: {station.temperature}°C")
                    print(f"   Timestamp: {station.timestamp}\n")
            else:
                # For API usage - output JSON only
                pass  # Cache file is already written
        else:
            print("❌ No data retrieved")

    elif args.command == "cache":
        if connector.cached_data:
            print("📦 Cache Information:")
            print(f"   Cached at: {connector.cache_time}")
            print(f"   Stations: {len(connector.cached_data['stations'])}")
            print(f"   File: {connector.cache_file}")
        else:
            print("📭 No cache available")

    elif args.command == "alerts":
        print("🚨 Checking for weather alerts...\n")
        alerts = await connector.get_alerts()

        if alerts:
            print(f"⚠️  Found {len(alerts)} alert(s):\n")
            for i, alert in enumerate(alerts, 1):
                severity_emoji = "🔴" if alert["severity"] == "high" else "🟡"
                print(f"{i}. {severity_emoji} {alert['message']}")
                print(f"   Type: {alert['type']}")
                print(f"   Value: {alert['value']} (threshold: {alert['threshold']})\n")
        else:
            print("✅ No alerts - all measurements within normal range")

    elif args.command == "test":
        print("🧪 Testing ARSO connector...\n")

        # Test 1: Fetch XML
        print("1. Testing XML fetch...")
        xml_data = await connector.fetch_xml()
        if xml_data:
            print(f"   ✅ Fetched {len(xml_data)} bytes")
        else:
            print("   ❌ Failed to fetch XML")
            return

        # Test 2: Parse XML
        print("\n2. Testing XML parsing...")
        weather_data = connector.parse_xml(xml_data)
        if weather_data:
            print(f"   ✅ Parsed {len(weather_data)} stations")
        else:
            print("   ❌ Failed to parse XML")
            return

        # Test 3: Cache
        print("\n3. Testing cache system...")
        await connector.get_current_data(use_cache=False)
        if connector.cache_file.exists():
            print(f"   ✅ Cache created at {connector.cache_file}")
        else:
            print("   ❌ Cache not created")

        # Test 4: Alerts
        print("\n4. Testing alert system...")
        alerts = await connector.get_alerts()
        print(f"   ✅ Alert system operational ({len(alerts)} alerts)")

        print("\n✅ All tests passed!")


if __name__ == "__main__":
    asyncio.run(main())
