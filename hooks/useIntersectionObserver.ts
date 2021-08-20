import { useEffect } from 'react';

export interface IntersectionObserverProps {
  root?: React.MutableRefObject<HTMLElement> | null; // 대상 객체의 가시성을 확일할 때 사용하는 뷰포트 요소 (기본값: 브라우저 뷰포트)
  rootMargin?: string; // root가 가진 여백
  threshold?: number | number[]; // observer의 콜백이 실행될 대상 요소의 가시성 퍼센티지 (예: 0.5 -> 50%)
  target: React.MutableRefObject<HTMLElement | null>; // 감시 대상
  onIntersect: () => void; // callback functon
  enabled?: boolean; // 감시 작동 유무
}

/**
 * 무한 스크롤링 훅
 * 참조: https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API
 * @param param0 '
 *
 */
export default function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0, //? 타겟이 완전히 다 보일 때
  rootMargin = '0px',
  enabled = true,
}: IntersectionObserverProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    );

    const element = target && target.current;

    if (!element) return;

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [enabled, onIntersect, root, rootMargin, target, threshold]);
}
