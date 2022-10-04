import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./api";
import { Combobox } from "@headlessui/react";

const queryFilter = (query, users) => {
  // add search score to user data
  const userScores = users.map((user) => {
    const score = [user.first_name, user.last_name, user.email, user.username]
      .map((str) => str.includes(query))
      .reduce((a, b) => a + b, 0);
    return {
      ...user,
      score,
    };
  });
  // sort & filter by score
  return userScores
    .sort((a, b) => {
      if (a.score > b.score) return -1;
      if (a.score < b.score) return 1;
      return 0;
    })
    .slice(0, 5);
};
export default function UserSelect({ selectedUser, setSelectedUser }) {
  const { data: users } = useQuery(["users"], getUsers);

  const [query, setQuery] = useState("");
  const filtered = queryFilter(query, users);

  // TODO filter

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
                  {user.username} - {user.first_name} {user.last_name}
                </li>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </>
  );
}
