import axios, { AxiosError } from 'axios';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import { IInfinitePage } from 'lib/interfaces/IInfinitePage';
import React, { MutableRefObject, useRef } from 'react';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';

async function fetchTodos({ pageParam = 0 }: QueryFunctionContext) {
  const { data } = await axios.get(`/api/todo/infinite/${pageParam}`);
  return data;
}

function InfinityScroll() {
  //? fetchNextPage: pageParam을 알아서 증가시켜 호출하는 함수
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    IInfinitePage,
    AxiosError
  >('infinite', fetchTodos, {
    getNextPageParam: (LastPage) => LastPage.nextCursor,
  });

  const loadMoreButtonRef: MutableRefObject<HTMLButtonElement | null> = useRef(null);

  useIntersectionObserver({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
    threshold: 0.5,
  });

  return (
    <>
      {data?.pages.map((infinitePage, i) => {
        return (
          <React.Fragment key={i}>
            {infinitePage.page.todos.map((todo) => (
              <p key={todo.id}>{todo.message}</p>
            ))}
          </React.Fragment>
        );
      })}

      <button
        ref={loadMoreButtonRef}
        type="button"
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'Nothing more to Load'}
      </button>
    </>
  );
}

export default InfinityScroll;
