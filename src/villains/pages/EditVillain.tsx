import React, { useState, useEffect, useContext } from "react";
import { villainContext } from "../villain-context";
import { useObserver } from "mobx-react-lite";
import { RootStoreContext } from "../../store/rootStore";

export default function EditVillain(params) {
  const store = useContext(RootStoreContext);

  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    store.villainsV2.getVillainById(params.id).then();
  }, []);

  const handleInputChange = async ({ currentTarget: input }) => {
    const updatedVillain = { ...store.villainsV2.villain };
    const { name, value } = input;
    updatedVillain[name] = value;
    await store.villainsV2.setVillain(updatedVillain);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await store.villainsV2.putVillain(store.villainsV2.villain);
    setIsSuccess(!isSuccess);
  };

  const handleBackButton = () => {
    window.history.back();
  };

  /*useObserver converts component into reactive component*/
  return useObserver(() => (
    <>
      <h2>Edit Villain</h2>
      {store.villainsV2.isLoading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            className="spinner-border"
            style={{
              width: "9rem",
              height: "9rem",
              color: "purple",
            }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card my-3" style={{ width: "auto" }}>
          <form className="card-header" onSubmit={handleSubmit}>
            <section className="d-flex flex-row">
              <div className="mt-3 mr-3 input-width">
                <label htmlFor="firstName">First Name</label>
                <input
                  name="firstName"
                  value={store.villainsV2.villain.firstName}
                  onChange={handleInputChange}
                  type="text"
                  id="firstName"
                  className="form-control"
                />
              </div>
              <div className="mt-3 ml-3 input-width">
                <label>Last Name</label>
                <input
                  name="lastName"
                  value={store.villainsV2.villain.lastName}
                  onChange={handleInputChange}
                  type="text"
                  id="lastName"
                  className="form-control"
                />
              </div>
            </section>
            <label className="mt-3">House</label>
            <input
              name="house"
              value={store.villainsV2.villain.house}
              onChange={handleInputChange}
              type="text"
              id="house"
              className="form-control"
            />
            <label className="mt-3">Known as</label>
            <input
              name="knownAs"
              value={store.villainsV2.villain.knownAs}
              onChange={handleInputChange}
              type="text"
              id="knownAs"
              className="form-control"
            />
            <button
              type="submit"
              disabled={isSuccess}
              className="btn btn-info mt-3"
            >
              Update
            </button>
            <button
              onClick={handleBackButton}
              type="button"
              className="btn btn-outline-info mt-3 ml-3"
            >
              Back
            </button>
          </form>
        </div>
      )}
      {isSuccess && (
        <div className="alert alert-success col-md-3" role="alert">
          This villain has been updated!
        </div>
      )}
    </>
  ));
}