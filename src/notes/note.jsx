import React, { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
// import UserSelect from "./userselect";
import { useMutation } from "@tanstack/react-query";
import { updateNote } from "./api";
const UserSelect = React.lazy(() => import("./userselect"));

export default function Note({ id, body }) {
  let [mentionDialog, setMentionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const saveQuery = useMutation(updateNote);
  const timerRef = useRef();
  const cursorRef = useRef();
  const textRef = useRef();

  const autosave = (text) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      console.log(" autosave ", text);
      saveQuery.mutate({ id, body: text });
    }, 1000);
  };

  const cancel = () => setMentionDialog(false);

  const pasteAt = (str, pos, paste) =>
    str.slice(0, pos) + paste + str.slice(pos);

  const update = () => {
    const _text = pasteAt(
      textRef.current.textContent,
      cursorRef.current,
      `@${selectedUser.username}`
    );
    textRef.current.textContent = _text;

    setMentionDialog(false);
  };

  // Autosave after user input
  const onType = (ev) => autosave(ev.target.textContent);

  // catch '@' key to open @mention modal
  const onKey = (ev) => {
    if (ev.key === "@") {
      cursorRef.current = window.getSelection().focusOffset;
      setMentionDialog(true);
      ev.preventDefault();
    }
  };

  return (
    <div className=" shadow-lg p-2 rounded-sm min-h-[200px] flex flex-col">
      <h3 className=" font-semibold">Note {id}</h3>
      <div
        className="p-1 flex-grow"
        onInput={onType}
        onKeyDown={onKey}
        contentEditable
        ref={textRef}
        dangerouslySetInnerHTML={{ __html: body }}
      ></div>

      <Dialog
        open={mentionDialog}
        onClose={() => setMentionDialog(false)}
        className={
          "bg-white p-8 border-2 border-blue-300 rounded-lg shadow-lg" +
          " absolute left-1/2 top-1/2  w-[400px] min-h-[250px] translate-x-[-50%] translate-y-[-50%] " +
          "flex flex-col"
        }
      >
        <Dialog.Panel className="flex flex-col flex-grow">
          <Dialog.Title className="">
            <span className="text-blue-700 font-bold">@mention</span>&nbsp;
            another User
          </Dialog.Title>
          <React.Suspense fallback={<div>...</div>}>
            <UserSelect
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
          </React.Suspense>
          <div className="flex-grow first-line:"></div>
          <div className="flex gap-4">
            <button
              onClick={cancel}
              className="py-1 px-2 rounded-sm bg-gray-200 hover:bg-gray-300"
            >
              cancel
            </button>
            {selectedUser?.username && (
              <button
                className="py-1 px-2 rounded-sm bg-blue-200 hover:bg-blue-300"
                onClick={update}
              >
                Add
              </button>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
