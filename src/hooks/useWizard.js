import { useState, useMemo, useCallback } from "react";

export function useWizard() {
  const [step, setStep] = useState(0);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedSpots, setSelectedSpots] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [travelMode, setTravelMode] = useState(null);
  const [duration, setDuration] = useState(null);
  const [selectedAccomTypes, setSelectedAccomTypes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 0:Welcome 1:Region 2:SpotPicker 3:FoodPicker 4:TripSettings 5:Result
  const TOTAL_STEPS = 6;

  const animateStep = useCallback((newStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const nextStep = useCallback(() => {
    if (isTransitioning) return;
    animateStep(step + 1);
  }, [step, isTransitioning, animateStep]);

  const prevStep = useCallback(() => {
    if (isTransitioning) return;
    if (step > 0) animateStep(step - 1);
  }, [step, isTransitioning, animateStep]);

  const resetAll = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(0);
      setSelectedRegions([]);
      setSelectedSpots([]);
      setSelectedRestaurants([]);
      setTravelMode(null);
      setDuration(null);
      setSelectedAccomTypes([]);
      setSelectedPriceRange(null);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const toggleRegion = useCallback((region) => {
    setSelectedRegions((prev) => {
      if (prev.includes(region)) return prev.filter((r) => r !== region);
      if (prev.length >= 3) return prev;
      return [...prev, region];
    });
    // 지역 변경 시 해당 지역 장소 선택 초기화
    setSelectedSpots((prev) => {
      const newRegions = selectedRegions.includes(region)
        ? selectedRegions.filter((r) => r !== region)
        : [...selectedRegions, region];
      return prev.filter((s) => newRegions.includes(s.region));
    });
    setSelectedRestaurants((prev) => {
      const newRegions = selectedRegions.includes(region)
        ? selectedRegions.filter((r) => r !== region)
        : [...selectedRegions, region];
      return prev.filter((r) => newRegions.includes(r.region));
    });
  }, [selectedRegions]);

  const toggleSpot = useCallback((spot) => {
    setSelectedSpots((prev) => {
      const exists = prev.some((s) => s.name === spot.name && s.region === spot.region);
      if (exists) return prev.filter((s) => !(s.name === spot.name && s.region === spot.region));
      return [...prev, spot];
    });
  }, []);

  const toggleRestaurant = useCallback((restaurant) => {
    setSelectedRestaurants((prev) => {
      const exists = prev.some((r) => r.name === restaurant.name && r.region === restaurant.region);
      if (exists) return prev.filter((r) => !(r.name === restaurant.name && r.region === restaurant.region));
      return [...prev, restaurant];
    });
  }, []);

  const toggleAccomType = useCallback((typeId) => {
    setSelectedAccomTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  }, []);

  const canProceed = useMemo(() => {
    switch (step) {
      case 1: return selectedRegions.length > 0;
      case 2: return selectedSpots.length >= 2;
      case 3: return selectedRestaurants.length >= 1;
      case 4: return duration !== null && travelMode !== null;
      default: return true;
    }
  }, [step, selectedRegions, selectedSpots, selectedRestaurants, duration, travelMode]);

  return {
    step, selectedRegions, selectedSpots, selectedRestaurants,
    travelMode, duration, selectedAccomTypes, selectedPriceRange,
    isTransitioning, TOTAL_STEPS, canProceed,
    setTravelMode, setDuration, setSelectedPriceRange,
    nextStep, prevStep, resetAll,
    toggleRegion, toggleSpot, toggleRestaurant, toggleAccomType,
  };
}
