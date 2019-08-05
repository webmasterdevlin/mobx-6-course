import React, { useState, useEffect, useContext } from "react";
import NewItemForm from "../../shared/components/NewItemForm";
import { Link } from "react-router-dom";
import { heroContext } from "../hero-context";
import { useObserver } from "mobx-react-lite";

export default function Heroes() {
  const heroStore = useContext(heroContext);
  /*
    Don't destructure. MobX observable are objects (and derivates) only. When destructuring, any primitive variables will remain at latest values and won't be observable anymore. Use boxed observables to track primitive values exclusively or preferably pass a whole state object around.
    const {
    heroes,
    hero,
    getHeroes,
    postHero,
    setHero,
    deleteHero,
    isLoading
  } = useContext(heroContext);*/

  const [isShowNewItemForm, setIsShowNewItemForm] = useState(false);

  useEffect(() => {
    heroStore.getHeroes();
  }, []);

  const showNewItemForm = () => {
    setIsShowNewItemForm(!isShowNewItemForm);
  };
  const onChange = ({ currentTarget: input }) => {
    const newHero = { ...heroStore.hero };
    const { name, value } = input;
    newHero[name] = value;
    heroStore.setHero(newHero);
  };

  const onSubmit = async event => {
    event.preventDefault();

    heroStore.postHero(heroStore.hero);
    setIsShowNewItemForm(!isShowNewItemForm);
  };

  const removeItem = async (id, name) => {
    const isConfirmed = window.confirm(`Delete ${name}?`);
    if (!isConfirmed) return;

    try {
      await heroStore.deleteHero(id);
    } catch (e) {
      alert(e.message);
      throw e;
    }
  };
  return useObserver(() => (
    <>
      <NewItemForm
        isShowNewItemForm={isShowNewItemForm}
        handleOnChange={onChange}
        handleOnSubmit={onSubmit}
        handleShowNewItemForm={showNewItemForm}
      />
      {heroStore.isLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <div
            className="spinner-border"
            style={{
              width: "9rem",
              height: "9rem",
              color: "purple"
            }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        heroStore.heroes.map(item => (
          <div key={item.id} className="card mt-3" style={{ width: "auto" }}>
            <div className="card-header">
              <h3 className="card-title">
                {item.firstName} {item.lastName}
              </h3>
              <h5 className="card-subtitle mb-2 text-muted">{item.house}</h5>
              <p className="card-text">{item.knownAs}</p>
            </div>
            <section className="card-body">
              <div className="row">
                <button
                  onClick={() => removeItem(item.id, item.firstName)}
                  className="btn btn-outline-danger card-link col text-center"
                >
                  <span className="fas fa-eraser  mr-2" />
                  Delete
                </button>
                <Link
                  to={`/edit-hero/${item.id}`}
                  className="btn btn-primary card-link col text-center"
                >
                  <span className="fas fa-edit  mr-2" />
                  Edit
                </Link>
              </div>
            </section>
          </div>
        ))
      )}
    </>
  ));
}
