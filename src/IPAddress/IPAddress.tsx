import { useState, useEffect, Fragment } from "react";
import axios from "axios";

export function IP() {
  const [userInfo, setUserInfo] = useState<string[]>([]);

  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setUserInfo([
      res.data.IPv4,
      res.data.country_name,
      res.data.state,
      res.data.city,
    ]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h2>My IP</h2>
      {userInfo[0]}
      <h2>My Country</h2>
      {userInfo[1]}
      <h2>My State</h2>
      {userInfo[2]}
      <h2>My City</h2>
      {userInfo[3]}
    </div>
  );
}
