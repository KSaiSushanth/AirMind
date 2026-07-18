import { useApp } from '../context/AppContext';
import { CITIES_DATABASE } from '../mock/mockData';
import { getAqiTheme, aqiThemeToCssVars, showInversionCurtain } from './aqiTheme';

export function useStrataTheme() {
  const { currentCity, dashboardData } = useApp();
  const fallback = CITIES_DATABASE[currentCity] || CITIES_DATABASE.delhi;
  const aqi = dashboardData?.overallAqi ?? fallback.overallAqi;
  const budgetUsed = dashboardData?.budget?.availablePercent ?? 68;
  const theme = getAqiTheme(aqi);

  return {
    aqi,
    theme,
    cssVars: aqiThemeToCssVars(theme),
    inversionActive: showInversionCurtain(aqi, budgetUsed),
    status: dashboardData?.status ?? fallback.status,
  };
}
