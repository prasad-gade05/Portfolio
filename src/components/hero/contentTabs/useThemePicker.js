import { useCallback, useEffect, useRef, useState } from "react";
import { themes } from "./config";

export const useThemePicker = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "arcade-light";
  });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, right: 0 });
  const themePickerRef = useRef(null);
  const toggleBtnRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themePickerRef.current && !themePickerRef.current.contains(event.target)) {
        setShowThemePicker(false);
      }
    };

    if (showThemePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showThemePicker]);

  const toggleThemePicker = () => {
    if (!showThemePicker && toggleBtnRef.current) {
      const rect = toggleBtnRef.current.getBoundingClientRect();
      setPickerPos({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
      });
    }

    setShowThemePicker((prev) => !prev);
  };

  const switchTheme = useCallback((newThemeId, event) => {
    if (newThemeId === theme) {
      setShowThemePicker(false);
      return;
    }

    const toggleRect = toggleBtnRef.current?.getBoundingClientRect();
    const x = event?.clientX ?? (toggleRect ? toggleRect.left + toggleRect.width / 2 : window.innerWidth / 2);
    const y = event?.clientY ?? (toggleRect ? toggleRect.top + toggleRect.height / 2 : window.innerHeight / 2);

    if (!document.startViewTransition) {
      setTheme(newThemeId);
      setShowThemePicker(false);
      return;
    }

    const right = window.innerWidth - x;
    const bottom = window.innerHeight - y;
    const maxRadius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

    setShowThemePicker(false);
    const transition = document.startViewTransition(() => {
      setTheme(newThemeId);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
        );
      });
  }, [theme]);

  const cycleTheme = useCallback(() => {
    const currentIndex = themes.findIndex((themeOption) => themeOption.id === theme);
    const nextThemeId = themes[(currentIndex + 1 + themes.length) % themes.length].id;
    switchTheme(nextThemeId);
  }, [theme, switchTheme]);

  return {
    cycleTheme,
    pickerPos,
    showThemePicker,
    switchTheme,
    theme,
    themePickerRef,
    toggleBtnRef,
    toggleThemePicker,
  };
};
