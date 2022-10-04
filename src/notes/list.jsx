import { useQuery } from "@tanstack/react-query";

import { getNotes } from "./api";
import Note from "./note";

export default function List() {
  const { data: notes } = useQuery(["notes"], getNotes);

  return (
    <div>
      {notes &&
        notes?.map((note) => (
          <Note key={note.id} id={note.id} body={note.body} />
        ))}
    </div>
  );
}
