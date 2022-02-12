export interface Movie {
  movie_id: number,
  movie_name: string,
  movie_year: number,
  movie_ranking: number
}

export interface Director {
  director_id: number,
  director_first_name: string,
  director_last_name: string
}

export interface DirectorGenre {
  director_id_genre: number,
  director_genre: string,
  director_genre_prob: number
}

export interface Actor {
  actor_id: number,
  actor_first_name: string,
  actor_last_name: string,
  actor_gender: string
}

export interface Role {
  director_id: number,
  movie_id: number,
  actor_id: number,
  part: string,
  movie_genre: string
}