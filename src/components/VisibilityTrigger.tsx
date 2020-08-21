import * as React from 'react';
import IntersectionObserver from 'inteobs';

/**
 * Hook that returns the previous value stored in it. This is useful for comparing
 * props from one render to the next (for example, when using `useEffect` to handle
 * lifecycle changes).
 */
function usePrevious<T extends any>(value: T) {
  const ref = React.useRef<T | null>();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;

export type VisibilityTriggerProps = {
  children?: React.ReactNode;
  onVisible?: () => any;
  onHidden?: () => any;
};

/**
 * A utility component that triggers a callback when it becomes visible
 * to the user.
 */
export function VisibilityTrigger({
  onVisible,
  onHidden,
  ...rest
}: VisibilityTriggerProps) {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const wasVisible = usePrevious(isVisible);

  React.useEffect(() => {
    if (!!wasVisible !== isVisible) {
      if (isVisible) {
        onVisible?.();
      } else {
        onHidden?.();
      }
    }
  }, [wasVisible, isVisible, onHidden, onVisible]);

  React.useEffect(() => {
    if (!elementRef.current) return;

    const { current } = elementRef;

    const observer = new IntersectionObserver((entries) => {
      setIsVisible(entries[0].isIntersecting);
    });

    observer.observe(current);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return <div ref={elementRef} {...rest} />;
}
