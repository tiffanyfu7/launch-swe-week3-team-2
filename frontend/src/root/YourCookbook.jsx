import React, { useState, useEffect, useContext } from 'react';
import { Navbar } from "../components/Navbar";
import '../styles/Cookbook.css';
import { Link } from 'react-router-dom';
import { IoAddOutline } from 'react-icons/io5';
import RecipeCard from '../components/RecipeCard';
import { QueryContext } from '../components/QueryContext';
import { fetchCreatedRecipes } from '../components/fetchRecipes';
import { UserContext } from '../components/UserContext';
import axios from 'axios';

export const YourCookbook = () => {
    const [state, setState] = useState("Created");
    const { setSearchRequested } = useContext(QueryContext);
    const [createdRecipes, setCreatedRecipes] = useState([]);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState(null);

    const fetchUser = async () => {
        const response = await axios.get(`http://localhost:8000/profile/user/${user.uid}`)
        console.log("hello", response.data);
        setUserData(response.data);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    //add query in fetchCreatedRecipes to only get the ids that match userData.createdRecipes
    useEffect(() => {
        const getCreatedRecipes = async () => {
            const recipes = await fetchCreatedRecipes();
            setCreatedRecipes(recipes);
        };
        getCreatedRecipes();
    }, []);

    const handleSearchSubmit = () => {
        setSearchRequested(true);
    };

    return (
        <>
            <Navbar current="YourCookbook" onSearchSubmit={handleSearchSubmit} />
            {userData &&
                <div className="page-container cookbook-page">
                    <div className="profile-info">
                        <img
                            id="profile-pic"
                            src={userData.profilePictureUrl}
                            alt="profile-picture"
                        />
                        <p id="profile-username">{userData.name}</p>
                    </div>
                    <div id="create-save-buttons">
                        <button
                            className="toggle-button"
                            onClick={() => setState("Created")}
                            style={{ textDecoration: state === "Created" ? "underline" : "" }}
                        > Created </button>
                        <button className="toggle-button"
                            onClick={() => setState("Saved")}
                            style={{ textDecoration: state === "Saved" ? "underline" : "" }}
                        >Saved</button>
                    </div>
                    {state === "Created" &&
                        <div className="list-recipes-container">
                            <div id="create-new-card">
                                <Link id="create-button" to="/CreateRecipe">
                                    <IoAddOutline size={100} />
                                </Link>
                                <p id="create-new-text">Create New Recipe</p>
                            </div>
                            {createdRecipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} variant="basic" />
                            ))}
                        </div>
                    }
                    {state === "Saved" &&
                        <div className="list-recipes-container">
                            {savedRecipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} variant="basic" />
                            ))}
                        </div>
                    }
                </div>
            }
        </>
    );
};

export default YourCookbook;
