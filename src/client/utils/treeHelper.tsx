import { useCallback, useState } from "react";
import { Point } from 'react-d3-tree/lib/types/types/common';

export const useCenteredTree = (): [Point, any] => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2.5, y: height / 3 });
    }
  }, []);

  return [translate, containerRef];
};