import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import UserSelect from "./userselect";
import { useMutation } from "@tanstack/react-query";
import { updateNote } from "./api";

export default function Note({ id, body }) {
  let [mentionDialog, setMentionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const saveQuery = useMutation(updateNote);
  const timer = useRef();

  const autosave = (text) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      console.log(" autosave ", text);
      saveQuery.mutate({ id, body: text });
    }, 1000);
  };

  const cancel = () => {
    setMentionDialog(false);
  };
  const update = () => {
    setMentionDialog(false);
    console.log(" => select ", selectedUser);
  };

  const onType = (ev) => {
    const val = ev.target.textContent;
    autosave(val);
  };

  return (
    <div>
      <h3>Note {id}</h3>
      <div onInput={onType} contentEditable>
        {body}
      </div>

      <Dialog open={mentionDialog} onClose={() => setMentionDialog(false)}>
        <Dialog.Panel>
          <Dialog.Title>@mention</Dialog.Title>
          <UserSelect
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
          <button onClick={cancel}>cancel</button>
          <button onClick={update}>Add</button>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

const onKey = (ev) => {
  // console.log(ev.key);
  // if (ev.key === "@") {
  //   setMentionDialog(true);
  //   ev.preventDefault();
  // }
};
