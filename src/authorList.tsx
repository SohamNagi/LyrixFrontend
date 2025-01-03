import { useEffect, useState } from "react";
import { Link } from "react-router";

const BASE_URL = "http://localhost:8080/api/authors";

interface Author {
  name: string;
  _links: {
    self: { href: string };
    author: { href: string };
    songList: { href: string };
  };
}

interface responseList {
  _embedded: {
    authors: Author[];
  };
  _links: {
    first: { href: string };
    self: { href: string };
    next: { href: string };
    last: { href: string };
    profile: { href: string };
    search: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export default function SongList() {
  const [nameList, setNameList] = useState<responseList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}?size=30`);
        if (!response.ok) {
          throw new Error("Can't Fetch Auhor List");
        }
        const list = (await response.json()) as responseList;
        setNameList(list);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {nameList?._embedded.authors.map((value, index) => {
                return (
                  <tr>
                    <th>{index + 1}</th>

                    <Link to={`${value._links.author.href.slice(-3)}`}>
                      <td>{value.name}</td>
                    </Link>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
