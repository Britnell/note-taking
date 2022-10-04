import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./api";
import { Combobox } from "@headlessui/react";

export default function UserSelect({ selectedUser, setSelectedUser }) {
  const { data: users } = useQuery(["users"], getUsers);

  console.log(" <select ", users[0]);
  return (
    <div>
      <Combobox value={selectedUser} onChange={setSelectedUser}>
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person) => person?.username}
        />
        <Combobox.Options>
          {users.map((user) => (
            <Combobox.Option key={user.username} value={user}>
              {({ active, selected }) => (
                <li className={active ? " bg-blue-200 " : ""}>
                  {selected ? `[x]` : `[ ]`}
                  {user.username}
                </li>
              )}
            </Combobox.Option>
          ))}
          {/* {people.map((person) => (
            <Combobox.Option key={person.id} value={person}>
              {person.name}
              {({ active, selected }) => (
                <div style={{ color: active ? "blue" : "black" }}>
                  {selected ? `[x]` : `[ ]`}
                  {person.name}
                </div>
              )} 
                </Combobox.Option>
            ))}
              */}
        </Combobox.Options>
      </Combobox>
    </div>
  );
}
