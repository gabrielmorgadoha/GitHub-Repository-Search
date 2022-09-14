/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "./axios";
import Repository from "./Repository";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import { GiMagnifyingGlass } from "react-icons/gi";
import { ThreeDots } from 'react-loader-spinner'
import './App.css';

export default function App() {
  const maxRepositoriesPerPage = 20;
  const [totalRepositories, setTotalRepositories] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(50 );
  const [totalPagesTitle, setTotalPagesTitle] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("&sort=stars&order=desc");
  const [sortType, setSortType] = useState("Most Stars");
  const [sortAux, setSortAux] = useState(1);
  const [showLoading, setShowLoading] = useState(false);
  const [repositories, setRepositories] = useState([]);

  const sortTypes = [
    {type: "Most Stars", sort: "&sort=stars&order=desc"},
    {type: "Fewest Stars", sort: "&sort=stars&order=asc"},
    {type: "Most Forks", sort: "&sort=forks&order=desc"},
    {type: "Fewest Forks", sort: "&sort=forks&order=asc"},
    {type: "Recently Updated", sort: "&sort=updated&order=desc"},
    {type: "Least Recently Updated", sort: "&sort=updated&order=asc"},
    {type: "Best Match", sort: ""},
  ];

  const handleNextPage = () => {
    if(page <= totalPages){
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if(page > 1){
      setPage(page - 1);
    }
  };

  const handleToggleSortType = () => {
    setSortAux(sortAux + 1);
    let sorterAux = sortTypes[sortAux % sortTypes.length];
    setSort(sorterAux.sort);
    setSortType(sorterAux.type);
  }

  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if(query){
      const repos = await fetchRepositories(1);
      setRepositories(repos);
    }
  };

  const handleTotalPage = () => {
    if(totalRepositories > 1000){
      setTotalPages(50);
      setTotalPagesTitle("The Search API limits fetch results to 1000 per query");
    }
    else{
      setTotalPages(Math.ceil(totalRepositories/maxRepositoriesPerPage));
      setTotalPagesTitle("All pages fetched");
    }
  }

  // fetch gets data from the api using baseURL + query
  const fetchRepositories = async (type) => {
    setShowLoading(true);
    try {
      if (query === "") { return; }
      const {data} = await axios.get("/search/repositories?q=" + query.split(" ").join("+") + sort + "&per_page=" + maxRepositoriesPerPage + "&page=" + page);
      setTotalRepositories(data?.total_count);
      
      if(type === 1){
        setPage(1);
        setSortAux(1);
        setSort("&sort=stars&order=desc");
        setSortType("Most Stars");
        setShowLoading(false);
        return data?.items;
      }
      else{
        setShowLoading(false);
        setRepositories(data?.items);
      }
    } catch (error) {
      console.error(error);
      setShowLoading(false);
      return null;
    }
  };

  // get data when going to another page or sorting
  useEffect(() => {
    fetchRepositories();
  }, [page, sort]);

  useEffect(() => {
    handleTotalPage();
  }, [showLoading]);

  return (
    <div>
      <div className="searchBar">
        <h1><a onClick={() => window.location.reload()} className="applicationName"> GitHub Repository Search </a></h1>
        <div>
          <form onSubmit={handleSearch}>
            <input value={query} onChange={handleInput} type="text" placeholder="Search" />
            <button title="Search" type="submit" className="searchButton"> <GiMagnifyingGlass /> </button>
          </form>
        </div>
        <div>
          <button title="Change sort type" onClick={handleToggleSortType} className="sortButton"> Sort Type: {sortType} </button>
        </div>
      </div>

      <div style={{display: showLoading ? "none" : "inline" }} className="pageButtons">
        <button title="Previous page" onClick={handlePreviousPage}> <MdOutlineArrowBackIos /> </button>
        {page}
        <button title="Next page" onClick={handleNextPage}> <MdOutlineArrowForwardIos /> </button>
      </div>

      <div style={{display: showLoading ? "none" : "block" }} >
        <a title="Displaying 20 results per page" className="totalRepositoriesBox">
          {totalRepositories} repositories found
        </a>
        <a title={totalPagesTitle} className="totalPagesTitleBox">
          {totalPages} pages fectched
        </a>
      </div>
      
      <div style={{display: showLoading ? "none" : "block" }} className="repositoriesList">
        { repositories ? repositories.map(repository => {
          return <Repository repository={repository} key={repository.id} />
        }) : <h2> Too many requests. Try again in a few seconds. </h2>}
      </div>

      <text style={{display: showLoading ? "block" : "none" }}>
        <a className="loadingScreen"> <ThreeDots height="80" width="80" radius="9"color="white" /> </a>
      </text>
    </div>
  );
};
