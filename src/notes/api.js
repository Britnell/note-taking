import { useQuery } from "@tanstack/react-query";

const SESSION = "test_session_123";
const API_URI = `https://challenge.leadjet.io`;

export const getNotes = () =>
  fetch(API_URI + `/${SESSION}/notes`).then((res) => res.json());

export const createNote = () =>
  fetch(API_URI + `/notes`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: " ",
    }),
  });

export const getUsers = () =>
  fetch(API_URI + "/users").then((resp) => resp.json());

export const updateNote = ({ id, body }) =>
  fetch(API_URI + `/${SESSION}/notes/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
