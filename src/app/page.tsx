"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Test from "@/types/supabaseTypes";

export default function Home() {
  const [test, setTest] = useState<Test[]>([]);

  const fetchData = async () => {
    const { data, error } = await supabase.from("test").select("*");
    if (error) {
      console.log(error.message);
    }
    setTest(data || []);
  };

  const handleClick = () => {
    if (test.length === 0) {
      fetchData()
    } else {
      setTest([])
    }
  }

  return (
    <div>
      <button onClick={handleClick}>fetch data</button>
      {test.length > 0 && test.map((t) => <p key={t.id}>{t.name}</p>)}
    </div>
  );
}
