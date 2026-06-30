import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
  completed: boolean;
}

interface Tutorial {
  id: string;
  name: string;
  steps: TutorialStep[];
  currentStep: number;
  completed: boolean;
}

export function useTutorialSystem() {
  const { user } = useAuth();
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  const [tutorialsCompleted, setTutorialsCompleted] = useState<string[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (user) {
      loadTutorialProgress();
    }
  }, [user]);

  const loadTutorialProgress = () => {
    if (!user) return;

    const saved = localStorage.getItem(`tutorials_${user.id}`);
    if (saved) {
      setTutorialsCompleted(JSON.parse(saved));
    }
  };

  const TUTORIALS: Record<string, Tutorial> = {
    getting_started: {
      id: 'getting_started',
      name: 'Getting Started',
      currentStep: 0,
      completed: false,
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to Space Strategy!',
          description: 'Let\'s learn the basics of building your galactic empire.',
          target: 'dashboard',
          position: 'bottom',
          completed: false
        },
        {
          id: 'resources',
          title: 'Resources',
          description: 'These are your resources: Metal, Crystal, and Deuterium. You need them to build and research.',
          target: 'resources-display',
          position: 'bottom',
          completed: false
        },
        {
          id: 'buildings',
          title: 'Build Your First Mine',
          description: 'Click on Buildings to start constructing resource mines.',
          target: 'buildings-button',
          position: 'right',
          action: 'navigate:/buildings',
          completed: false
        },
        {
          id: 'research',
          title: 'Research Technologies',
          description: 'Research new technologies to unlock advanced features.',
          target: 'research-button',
          position: 'right',
          action: 'navigate:/research',
          completed: false
        },
        {
          id: 'fleet',
          title: 'Build Your Fleet',
          description: 'Construct ships to explore, defend, and attack.',
          target: 'fleet-button',
          position: 'right',
          action: 'navigate:/shipyard',
          completed: false
        }
      ]
    },
    combat_basics: {
      id: 'combat_basics',
      name: 'Combat Basics',
      currentStep: 0,
      completed: false,
      steps: [
        {
          id: 'fleet_overview',
          title: 'Your Fleet',
          description: 'This is your fleet management screen. Here you can see all your ships.',
          target: 'fleet-list',
          position: 'top',
          completed: false
        },
        {
          id: 'send_fleet',
          title: 'Sending Fleets',
          description: 'Select ships and choose a mission type to send your fleet.',
          target: 'fleet-send',
          position: 'left',
          completed: false
        },
        {
          id: 'combat_simulator',
          title: 'Combat Simulator',
          description: 'Use the combat simulator to test your fleet before attacking.',
          target: 'combat-sim',
          position: 'top',
          action: 'navigate:/combat-simulator',
          completed: false
        }
      ]
    }
  };

  const startTutorial = (tutorialId: string) => {
    if (tutorialsCompleted.includes(tutorialId)) {
      return { success: false, message: 'Tutorial already completed' };
    }

    const tutorial = TUTORIALS[tutorialId];
    if (!tutorial) {
      return { success: false, message: 'Tutorial not found' };
    }

    setActiveTutorial({ ...tutorial, currentStep: 0 });
    setShowTutorial(true);
    return { success: true };
  };

  const nextStep = () => {
    if (!activeTutorial) return;

    const newStep = activeTutorial.currentStep + 1;

    if (newStep >= activeTutorial.steps.length) {
      completeTutorial();
      return;
    }

    setActiveTutorial({
      ...activeTutorial,
      currentStep: newStep,
      steps: activeTutorial.steps.map((step, index) =>
        index === activeTutorial.currentStep ? { ...step, completed: true } : step
      )
    });
  };

  const previousStep = () => {
    if (!activeTutorial || activeTutorial.currentStep === 0) return;

    setActiveTutorial({
      ...activeTutorial,
      currentStep: activeTutorial.currentStep - 1
    });
  };

  const skipTutorial = () => {
    setActiveTutorial(null);
    setShowTutorial(false);
  };

  const completeTutorial = () => {
    if (!activeTutorial || !user) return;

    const updated = [...tutorialsCompleted, activeTutorial.id];
    setTutorialsCompleted(updated);
    localStorage.setItem(`tutorials_${user.id}`, JSON.stringify(updated));

    setActiveTutorial(null);
    setShowTutorial(false);
  };

  const resetTutorials = () => {
    if (!user) return;

    setTutorialsCompleted([]);
    localStorage.removeItem(`tutorials_${user.id}`);
  };

  return {
    activeTutorial,
    showTutorial,
    tutorialsCompleted,
    startTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    resetTutorials
  };
}
