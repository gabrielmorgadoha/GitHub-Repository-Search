/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { GoRepo, GoBook, GoStar, GoRepoForked } from "react-icons/go";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import "./Repository.css";

const Repository = ({repository}) => {
    const { name, description, language, stargazers_count, forks_count, updated_at } = repository;
    const { login, avatar_url } = repository.owner;
    const updated_atR = updated_at.split("T").shift().split("-").reverse().join("/");

    return (
        <div className="repositoryItem">
            <a className="repositoryGenericData">
                <span className="starsInfo"><a title="Number of Stars"> <GoStar /> {stargazers_count} </a></span>
                <span className="forksInfo"><a title="Number of Forks"> <GoRepoForked /> {forks_count} </a></span>
                <span className="updateTimeInfo"><a title="Last update"> <AiOutlineClockCircle /> {updated_atR} </a></span>
                <span className="languageInfo"><a title="Main Language used"> <GoBook /> {language} </a></span>
            </a>
            <div className="nameInfo"><a title="View repository on GitHub" href={"https://github.com/" + login + "/" + name}> <GoRepo /> {name} </a></div>
            <small className="userInfo"> <MdSubdirectoryArrowRight /> <a title="View user page on GitHub" href={"https://github.com/" + login}><img src={avatar_url} alt="user" className="imageInfo"></img> {login} </a></small>
            <div className="descriptionInfo"><a title={description}> {description} </a></div>
        </div>
    )
};

export default Repository;
