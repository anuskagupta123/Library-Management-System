import api from "./api";

export const getBooks = async () => {
  const response = await api.get("/books");
  return response.data;
};
