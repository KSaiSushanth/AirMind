class PolicyRecommender:
    @staticmethod
    def get_recommendations(city_name: str, current_aqi: int) -> list:
        # Define baseline options
        options = [
          {
            "name": "Dynamic Logistics Diversion",
            "desc": "Re-route heavy cargo carriers around wind canyon zones.",
            "aqiImprovement": 38,
            "cost": 45,  # thousands of dollars/rupees
            "feasibility": 85  # %
          },
          {
            "name": "Water Spray Optimization",
            "desc": "Trigger on-site dust sprinkler protocols across construction zones.",
            "aqiImprovement": 24,
            "cost": 15,
            "feasibility": 95
          },
          {
            "name": "Factory Peak Shaving",
            "desc": "Request heavy industrial stack emissions reduction during night stagnation.",
            "aqiImprovement": 45,
            "cost": 120,
            "feasibility": 70
          },
          {
            "name": "Macro Traffic Signal Cycles",
            "desc": "Instate adaptive signal cycles on Corridor A to clear vehicle queues.",
            "aqiImprovement": 28,
            "cost": 5,
            "feasibility": 90
          }
        ]

        # Multi-objective ranking score:
        # Score = (AQI_Improvement * 2.0) - (Cost * 0.5) + (Feasibility * 0.8)
        # Higher score = Better rank
        ranked_options = []
        for opt in options:
            score = (opt["aqiImprovement"] * 2.0) - (opt["cost"] * 0.5) + (opt["feasibility"] * 0.8)
            ranked_options.append({
                "name": opt["name"],
                "description": opt["desc"],
                "aqiImpact": f"-{opt['aqiImprovement']} AQI",
                "cost": f"${opt['cost']}k / Day",
                "trafficDelay": "+12 min" if opt["name"] == "Dynamic Logistics Diversion" else "None" if opt["name"] != "Macro Traffic Signal Cycles" else "-8 min",
                "score": round(score, 1)
            })

        # Sort descending by score
        ranked_options.sort(key=lambda x: x["score"], reverse=True)
        return ranked_options
