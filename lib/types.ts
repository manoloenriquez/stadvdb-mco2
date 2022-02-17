export interface Movie {
  movie_id?: number,
  movie_name: string,
  movie_year: number,
  movie_ranking: number
}

export interface Recovery {
  queries: Array<string>
}