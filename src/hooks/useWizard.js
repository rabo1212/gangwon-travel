import { useState, useMemo, useCallback } from "react";

export function useWizard() {
  const [step, setStep] = useState(0);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [travelMode, setTravelMode] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 0:Welcome 1:ZoneVibe 2:TripSettings 3:Result
  const TOTAL_STEPS = 4;

  const animateStep = useCallback((newStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const nextStep = useCallback(() => {
    if (isTransitioning) return;
    if (step >= TOTAL_STEPS - 1) return;
    animateStep(step + 1);
  }, [step, isTransitioning, animateStep, TOTAL_STEPS]);

  const prevStep = useCallback(() => {
    if (isTransitioning) return;
    if (step > 0) animateStep(step - 1);
  }, [step, isTransitioning, animateStep]);

  const goToStep = useCallback((targetStep) => {
    if (targetStep < 0 || targetStep >= TOTAL_STEPS) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(targetStep);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const loadState = useCallback((zone, vibes, mode, dur) => {
    setSelectedZone(zone);
    setSelectedVibes(vibes || []);
    setTravelMode(mode);
    setDuration(dur);
  }, []);

  const resetAll = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(0);
      setSelectedZone(null);
      setSelectedVibes([]);
      setTravelMode(null);
      setDuration(null);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const selectZone = useCallback((zone) => {
    setSelectedZone((prev) => (prev?.id === zone.id ? null : zone));
  }, []);

  const toggleVibe = useCallback((vibeId) => {
    setSelectedVibes((prev) => {
      if (prev.includes(vibeId)) return prev.filter((v) => v !== vibeId);
      if (prev.length >= 3) return prev;
      return [...prev, vibeId];
    });
  }, []);

  const canProceed = useMemo(() => {
    switch (step) {
      case 1:
        return selectedZone !== null && selectedVibes.length >= 1;
      case 2:
        return duration !== null && travelMode !== null;
      default:
        return true;
    }
  }, [step, selectedZone, selectedVibes, duration, travelMode]);

  return {
    step,
    selectedZone,
    selectedVibes,
    travelMode,
    duration,
    isTransitioning,
    TOTAL_STEPS,
    canProceed,
    setTravelMode,
    setDuration,
    nextStep,
    prevStep,
    resetAll,
    selectZone,
    toggleVibe,
    goToStep,
    loadState,
  };
}
