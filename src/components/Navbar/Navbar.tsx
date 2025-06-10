import { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { RootState } from "../../app/store";
import { useAppDispatch } from "../../app/hooks";
import { setSearchQuery, sortByTitle } from "../../features/getMoviesSlice";
import { Popup } from "../Popup";
import styles from "./Navbar.module.scss";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const sortAscending = useSelector(
    (state: RootState) => state.allMovies.sortAscending,
  );

  const [openPopup, setOpenPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setSearchQuery(value));
      }, 300),
    [dispatch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedSearch(value.trim());
    },
    [debouncedSearch],
  );

  const handleSortClick = () => {
    dispatch(sortByTitle());
  };

  return (
    <header
      className={`${styles.navbar} ${isScrolled ? styles.navbar__scrolled : ""}`}
    >
      <div className={styles.navbar__container}>
        <a href="#" className={styles.navbar__logo}>
          <img src="images/logo.svg" alt="logo" />
        </a>

        {openPopup && <Popup onClose={() => setOpenPopup(false)} />}

        <div className={styles.navbar__options}>
          <button
            onClick={() => setOpenPopup(true)}
            className={styles.navbar__addMovie}
          >
            Add movie
          </button>

          <div className={styles.navbar__search}>
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              value={searchTerm}
            />
            <img src="images/icons/search-icon.svg" alt="search" />
          </div>

          <div className={styles.navbar__sort}>
            <img
              onClick={handleSortClick}
              src={
                sortAscending
                  ? "images/icons/sort-up.svg"
                  : "images/icons/sort-down.svg"
              }
              alt="sort"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
