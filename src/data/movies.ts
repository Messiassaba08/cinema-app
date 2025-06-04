export type Movie = {
  id: number;
  title: string;
  posterUrl: string;
};

// REVERTIDO: A constante 'movies' é exportada diretamente
export const movies: Movie[] = [
  {
    id: 1,
    title: "Noites de Cabíria",
    posterUrl:
      "https://br.web.img3.acsta.net/pictures/210/182/21018246_20130708173323076.jpg",
  },
  {
    id: 2,
    title: "Harakiri",
    posterUrl:
      "https://upload.wikimedia.org/wikipedia/pt/a/ab/Harakiri_%28filme%29.jpg",
  },
  {
    id: 3,
    title: "Os Fuzis",
    posterUrl: "https://upload.wikimedia.org/wikipedia/pt/7/7f/Fuzis.jpg",
  },
  {
    id: 4,
    title: "O Homem de Palha",
    posterUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS87psWrO5RYgydCx-olJXodzS1YJbneENXGg&s",
  },
  {
    id: 5,
    title: "Ladrões de Bicicleta",
    posterUrl:
      "https://br.web.img2.acsta.net/pictures/210/073/21007343_20130521200209704.jpg",
  },
  {
    id: 6,
    title: "A coisa",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYTA3NDU5MWEtNTk4Yy00ZDNkLThmZTQtMjU3ZGVhYzAyMzU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  },
  {
    id: 7,
    title: "Vertigo",
    posterUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Vertigomovie_restoration.jpg/1200px-Vertigomovie_restoration.jpg",
  },
  {
    id: 8,
    title: "Onibaba",
    posterUrl:
      "https://images.squarespace-cdn.com/content/v1/58b866f417bffc4dc469acab/1617768125124-W0XKFYZBSVGX576YASDG/MV5BMWRiYmNmNTEtM2FlNC00ODRlLWFiMmQtYmNlNzgxY2MzMzNkL2ltYWdlXkEyXkFqcGdeQXVyNjc1NTYyMjg%40._V1_.jpg",
  },
  {
    id: 9,
    title: "O Massacre da Serra Elétrica",
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYjE1MGJkMjUtY2VkNi00N2U1LWI2NWEtMDExNGYzYjRkZTM0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
  },
  {
    id: 10,
    title: "Aliens 2",
    posterUrl:
      "https://br.web.img3.acsta.net/medias/nmedia/18/96/31/17/20459002.jpg",
  },
];

// REMOVIDO: Funções getMovies, saveMovies, addMovie não são mais exportadas
