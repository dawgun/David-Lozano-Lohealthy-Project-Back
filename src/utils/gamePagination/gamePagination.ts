interface PageOptions {
  page: number;
  limit: number;
}

const gamePagination = (pageOptions: PageOptions, countGames: number) => ({
  isPreviousPage: pageOptions.page !== 0,
  isNextPage: countGames >= pageOptions.limit * (pageOptions.page + 1),
  totalPages: Math.ceil(countGames / pageOptions.limit),
});

export default gamePagination;
