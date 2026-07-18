class CitizenHealthAdvisor:
    @staticmethod
    def generate_advisory(aqi: int, age: int, health_profile: str) -> dict:
        health_profile = health_profile.lower().strip()
        
        # 1. Evaluate general risk level
        if aqi > 300:
            risk_level = "Critical Exposure Hazard"
            mask = "N95/N99 respirator mandatory"
            exercise = "Move all exercise indoors. Suspend high-intensity cardio."
            outdoor = "Avoid outdoor transits entirely."
        elif aqi > 200:
            risk_level = "High Health Risk"
            mask = "N95 respirator required"
            exercise = "Indoor workouts highly recommended."
            outdoor = "Limit outdoor exposure to essential trips only."
        elif aqi > 100:
            risk_level = "Moderate Health Strain"
            mask = "Surgical mask recommended for sensitive groups"
            exercise = "Limit early morning and late evening outdoor exercise."
            outdoor = "Sensitive groups should reduce prolonged outdoor times."
        else:
            risk_level = "Low Risk / Satisfactory"
            mask = "Not required"
            exercise = "Ideal conditions for outdoor runs and workouts."
            outdoor = "Enjoy standard outdoor activities."

        # 2. Add profile specific warnings
        warnings = []
        if health_profile in ["asthma", "copd", "bronchitis", "respiratory"]:
            if aqi > 100:
                warnings.append("⚠️ Keep rescue inhaler handy at all times. High risk of immediate asthma attack.")
        elif health_profile in ["heart", "cardio", "hypertension"]:
            if aqi > 150:
                warnings.append("⚠️ PM2.5 can increase cardiovascular strain. Monitor blood pressure levels.")
        
        if age >= 60:
            if aqi > 150:
                warnings.append("⚠️ Elderly population should avoid morning walks due to low surface air clearing.")
        elif age <= 12:
            if aqi > 150:
                warnings.append("⚠️ Children breathe faster and inhale more relative volume. Limit outdoor playtime today.")

        if not warnings:
            warnings.append("✅ No immediate medical precautions required. Air metrics are within standard tolerances.")

        return {
            "healthRisk": risk_level,
            "outdoorRecommendation": outdoor,
            "maskRecommendation": mask,
            "exerciseRecommendation": exercise,
            "medicalWarning": " ".join(warnings)
        }
