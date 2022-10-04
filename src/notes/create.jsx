import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "./api";

const CreateNew = () => {
  const queryClient = useQueryClient();
  const createQuery = useMutation(createNote, {
    onSettled: () => {
      queryClient.invalidateQueries("notes");
    },
  });

  const create = () => createQuery.mutate();

  return (
    <div>
      <button onClick={create}>Add +</button>
    </div>
  );
};

export default CreateNew;
