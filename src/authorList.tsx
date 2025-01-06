import { useEffect, useState } from "react";
import { Link } from "react-router";

const BASE_URL = "https://lyrixbackend.onrender.com/api/authors";

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

  if (loading)
    return <span className="loading loading-spinner loading-md"></span>;

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <span className="loading loading-spinner loading-md"></span>
      ) : (
        <div>
          <p className=" text-xl font-extrabold">Author Table</p>
          <div className=" flex">
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Author</th>
                  </tr>
                </thead>
                <tbody>
                  {nameList?._embedded.authors
                    .slice(0, 15)
                    .map((value, index) => {
                      return (
                        <tr key={index}>
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
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Author</th>
                  </tr>
                </thead>
                <tbody>
                  {nameList?._embedded.authors
                    .slice(15, 30)
                    .map((value, index) => {
                      return (
                        <tr>
                          <th>{index + 16}</th>

                          <Link to={`${value._links.author.href.slice(-3)}`}>
                            <td>{value.name}</td>
                          </Link>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
