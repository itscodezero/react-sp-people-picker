import React, { useState, Fragment } from "react";
import './index.css';
import * as spPeoplePickerAPI from "./user-profile-api";

//default queryPamrams
let userQueryObj = {
  queryParams: {
    QueryString: "",
    MaximumEntitySuggestions: 10,
    AllowEmailAddresses: true,
    AllowOnlyEmailAddresses: false,
    PrincipalSource: 2,
    PrincipalType: 1,
    SharePointGroupID: 0,
  },
};
const SpPeoplePicker = (props) => {
  let [activeSuggestion, setActiveSuggestion] = useState("");
  let [filteredSuggestions, setFilteredSuggestions] = useState([]);
  let [showSuggestions, setShowSuggestions] = useState([]);
  let [userInput, setUserInput] = useState("");

  const onChange = (e) => {
    let userQuery = Object.assign({}, userQueryObj);
    userQuery.queryParams.QueryString = e.currentTarget.value;

    spPeoplePickerAPI
      .getUserSuggesstions(userQuery)
      .then((data) => {
        if (
          data &&
          data.d.ClientPeoplePickerSearchUser &&
          data.d.ClientPeoplePickerSearchUser.length > 0
        ) {
          let jsonData = JSON.parse(data.d.ClientPeoplePickerSearchUser);
          jsonData = jsonData.map((item) => {
            if (item.EntityData.Email) return item;
            else {
              let strSpilt = item.Key.split("|");
              item.EntityData.Email = strSpilt[2];
              return item;
            }
          });
          setActiveSuggestion("");
          setFilteredSuggestions(jsonData);
          setShowSuggestions(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setUserInput(e.currentTarget.value);
    props.getSelectedUser(null);
  };

  const onClick = (e) => {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setUserInput(e.DisplayText);
    props.getSelectedUser(e);
  };

  const onKeyDown = (e) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setUserInput(filteredSuggestions[activeSuggestion].DisplayText);
      props.getSelectedUser(filteredSuggestions[activeSuggestion]);
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      if (activeSuggestion === "") {
        setActiveSuggestion(0);
      } else {
        setActiveSuggestion(activeSuggestion - 1);
      }
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion === filteredSuggestions.length - 1) {
        return;
      }
      if (activeSuggestion === "") {
        setActiveSuggestion(0);
      } else {
        setActiveSuggestion(activeSuggestion + 1);
      }
    }
  };

  return (
    <Fragment>
      <div className="relative-position">
        <input
          className="search"
          type="text"
          placeholder="Start typing..."
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        <span className="request-search-icon"></span>
      </div>

      {showSuggestions && userInput ? (
        filteredSuggestions.length > 0 ? (
          <SuggestionListComponent
            activeSuggestion={activeSuggestion}
            filteredSuggestions={filteredSuggestions}
            handleParentClick={onClick}
          ></SuggestionListComponent>
        ) : userInput.length > 3 ? (
          <div class="no-suggestions">
            <em>No maching user found!</em>
          </div>
        ) : (
              <></>
            )
      ) : (
          <></>
        )}
    </Fragment>
  );
};

export default SpPeoplePicker;

const SuggestionListComponent = (props) => {
  const handleClick = (e) => {
    props.handleParentClick(e);
  };

  return (
    <div className="search-data">
      {props.filteredSuggestions.map((suggestion, index) => {
        let checked = false;

        // Flag the active suggestion with a class
        if (index === props.activeSuggestion) {
          checked = true;
        }

        return (
          <div className="form-element mb-10" key={suggestion.Key}>
            <label
              className="radio-button"
              onClick={(e) => {
                handleClick(suggestion);
              }}
            >
              <input type="radio" checked={checked} name="Tremail" />
              <span className="label-visible">
                <span className="fake-radiobutton"></span>
                {`${suggestion.DisplayText}`} &nbsp;{" "}
                {`(${suggestion.EntityData.Email})`}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
};
