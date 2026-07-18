class SourceAttributionEngine:
    @staticmethod
    def attribute_pollution(city_name: str, wind_speed: float, traffic_index: float, violating_permits_count: int) -> dict:
        # Base weights before local adjustment
        traffic_base = 25.0
        industrial_base = 20.0
        construction_base = 15.0
        biomass_base = 10.0
        natural_base = 10.0
        
        # City specific modifications (Delhi has higher biomass seasonal burning)
        if city_name.lower() == "delhi":
            biomass_base += 20.0  # Crop burning impact
        elif city_name.lower() == "mumbai":
            industrial_base += 15.0  # Port / Refinery clusters
            
        # Traffic dynamic load
        traffic_contrib = traffic_base * (traffic_index / 50.0)
        
        # Construction dynamic load (based on permit violations count)
        construction_contrib = construction_base + (violating_permits_count * 5.0)
        
        # Meteorological dilution factor: low wind speed concentrates local sources
        dilution_factor = max(1.0, wind_speed)
        weather_attributable = 30.0 / dilution_factor
        
        # Assemble raw weights
        raw_contribs = {
            "Traffic": max(5.0, traffic_contrib),
            "Industry": max(5.0, industrial_base),
            "Construction": max(5.0, construction_contrib),
            "Biomass Burning": max(2.0, biomass_base),
            "Weather / Dispersion": max(5.0, weather_attributable),
            "Others (Soil/Natural)": max(2.0, natural_base)
        }
        
        # Normalize contributions to sum to 100%
        total_sum = sum(raw_contribs.values())
        normalized = {}
        for key, val in raw_contribs.items():
            normalized[key] = round((val / total_sum) * 100, 1)
            
        # Adjust sum error from rounding
        error = 100.0 - sum(normalized.values())
        if error != 0:
            normalized["Others (Soil/Natural)"] = round(normalized["Others (Soil/Natural)"] + error, 1)

        return normalized
