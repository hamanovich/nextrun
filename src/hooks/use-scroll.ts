import { useLayoutEffect, useState } from "react";

export const useWindowScroll = () => {
  const [state, setState] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  useLayoutEffect(() => {
    const handleScroll = () =>
      setState({ x: window.scrollX, y: window.scrollY });

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return [state];
};
