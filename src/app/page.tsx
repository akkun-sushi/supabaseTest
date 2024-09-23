"use client";

import { supabase } from "@/lib/supabase";
import { ChangeEvent, FormEvent, use, useEffect, useState } from "react";
import Test from "@/types/supabaseTypes";
import { eventNames } from "process";

export default function Home() {
  const [record, setRecord] = useState<Test[]>([]);
  const [name, setName] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  type Clicked = "GET" | "INSERT" | "DELETE" | "";
  const [clicked, setClicked] = useState<Clicked>("");

  const GetData = async () => {
    const { data } = await supabase.from("test").select("*");
    setRecord(data || []);
  };

  useEffect (()=> {
    GetData();
  }, [])

  const InsertData = async () => {
    await supabase
      .from("test")
      .insert([{ name: name }])
      .select();
    setName("");
  };

  const DeleteData = async () => {
    if (options.length > 0) {
      for (let i = 0; i <= options.length; i++) {
        const option = options[i];
        await supabase.from("test").delete().eq("id", option);
      }
    }
    GetData()
  };

  const handleClick = (state: Clicked) => () => {
    if (clicked === "" || clicked !== state) {
      setClicked(state);
    } else {
      setClicked("");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    InsertData();
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setOptions(options);
  };

  const handleDelete = () => {
    DeleteData();
  };

  useEffect(() => {
    switch (clicked) {
      case "GET":
        GetData();
    }
  }, [clicked]);

  return (
    <div className="h-screen bg-blue-100">
      <div className="p-10 h-3/4 flex flex-row justify-center">
        <div>
          <button
            onClick={handleClick("GET")}
            className="text-4xl font-bold px-6 py-2 mx-6 border-4 border-black rounded-lg"
          >
            Show
          </button>
          {clicked === "GET" &&
            (record.length > 0 ? (
              record.map((r) => <p key={r.id}>{r.name}</p>)
            ) : (
              <p>No data available</p>
            ))}
        </div>
        <div>
          <button
            onClick={handleClick("INSERT")}
            className="text-4xl font-bold px-6 py-2 mx-6 border-4 border-black rounded-lg"
          >
            Insert
          </button>
          {clicked === "INSERT" && (
            <form onSubmit={handleSubmit}>
              <p>Please enter the data name.</p>
              <input
                type="text"
                value={name}
                placeholder="name"
                onChange={(e) => setName(e.target.value)}
              />
              <input type="submit" value="insert" />
            </form>
          )}
        </div>
        <div>
          <button
            onClick={handleClick("DELETE")}
            className="text-4xl font-bold px-6 py-2 mx-6 border-4 border-black rounded-lg"
          >
            Delete
          </button>
          {clicked === "DELETE" && (
            <div>
              <p>Please select the data.</p>
              <select multiple onChange={handleSelect}>
                {record.map((r) => (
                  <option value={r.id} key={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <button onClick={handleDelete}>delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
