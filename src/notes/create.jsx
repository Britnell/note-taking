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
    <div className=" shadow-lg p-2 rounded-sm min-h-[200px] flex flex-col items-center">
      <h3>Create new</h3>
      <button onClick={create} className=" w-1/2 h-1/2 bg-gray-200">
        {" "}
        +
      </button>
    </div>
  );
};

export default CreateNew;
