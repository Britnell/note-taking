import React, { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useMutation } from "@tanstack/react-query";
import { updateNote } from "./api";
const UserSelect = React.lazy(() => import("./userselect"));

const Mention = ({ username }) => (
  <a
    className={`text-blue-400 hover:text-blue-700 font-medium before:content-[" "] after:content-[" "] `}
    href="#"
  >
    {username}
  </a>
);

const Parser = ({ body }) => {
  const _body = body
    .split(" ")
    .map((word) => (word[0] === "@" ? <Mention username={word} /> : word));
  // this is more complex than hoped, supposed to .join(' ') together
  //   but that doesnt work with jsx, need to join string elements only
  return _body;
};
const pasteAt = (str, pos, paste) => str.slice(0, pos) + paste + str.slice(pos);

export default function Note({ id, body }) {
  // State for dialog & @user selection
  let [mentionDialog, setMentionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const saveQuery = useMutation(updateNote);

  const timerRef = useRef();
  const cursorRef = useRef();
  const textRef = useRef();

  const autosave = (text) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      saveQuery.mutate({ id, body: text });
    }, 1000);
  };

  const cancel = () => setMentionDialog(false);

  const update = () => {
    const _text = pasteAt(
      textRef.current.textContent,
      cursorRef.current,
      `@${selectedUser.username}`
    );
    textRef.current.textContent = _text;
    autosave();
    setMentionDialog(false);
    // The parser does not parse newly added @mentions, need to store text in state and trigger re-render
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
        // dangerouslySetInnerHTML={{ __html: body }}
      >
        <Parser body={body} />
        {/* {body} */}
      </div>

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
          {/* potentially expensive component, lazy load w dialog */}
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
