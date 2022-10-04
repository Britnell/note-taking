import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./api";
import { Combobox } from "@headlessui/react";

export default function UserSelect({ selectedUser, setSelectedUser }) {
  const { data: users } = useQuery(["users"], getUsers);

  const filtered = users.slice(0, 5);

  return (
    <>
      <Combobox value={selectedUser} onChange={setSelectedUser}>
        <Combobox.Label>Find :</Combobox.Label>
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person) => person?.username}
          className="py-1 px-4 border-2 text-lg font-medium"
        />
        <Combobox.Options>
          {filtered.map((user) => (
            <Combobox.Option key={user.username} value={user}>
              {({ active, selected }) => (
                <li className={"py-1 px-2" + (active ? " bg-blue-200 " : "")}>
                  {user.username}
                </li>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </>
  );
}
